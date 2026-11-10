import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {storefrontRoutes} from '../src/storefront/metadata.js';
import {catalog} from '../src/storefront/catalog.js';
import {resolveStaticRoutes} from './seo-routes.mjs';

const root = path.resolve('dist');
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.xml':'application/xml','.webm':'video/webm','.mp4':'video/mp4'};
const server = http.createServer(async (req,res)=>{
  const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const target = path.resolve(root, '.' + (pathname.endsWith('/') ? pathname+'index.html' : path.extname(pathname) ? pathname : pathname+'/index.html'));
  if(!target.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  try{const data=await fs.readFile(target);res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream'}).end(data);}catch{res.writeHead(404).end('Not found');}
});
await new Promise(resolve=>server.listen(5191,'127.0.0.1',resolve));
const base=process.env.REVIEW_BASE_URL || 'http://127.0.0.1:5191';
const browser=await chromium.launch({headless:true});
const errors=[], failures=[], report=[];
try{
  const context=await browser.newContext();
  await context.route('**/*',async route=>{
    const url=new URL(route.request().url());
    if(url.origin===base) return route.continue();
    return route.abort();
  });
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)failures.push([r.url(),r.status()]);});
  for(const width of [1440,768,390]){
    await page.setViewportSize({width,height:900});
    for(const route of storefrontRoutes){
      await page.goto(base+route,{waitUntil:'networkidle'});
      await page.locator('main:not([hidden]) h1').waitFor();
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
      assert(!overflow,`${route} overflow at ${width}`);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://www.jczcare.com'+route);
      assert(!(await page.locator('body').innerText()).match(/local preview|local design model|本地审阅|未部署/i),`Preview copy on ${route}`);
      const broken=await page.locator('main:not([hidden]) img').evaluateAll(async images=>{
        await Promise.all(images.map(im=>{im.loading='eager';return im.decode().catch(()=>{});}));
        return images.filter(im=>!im.naturalWidth).map(im=>im.src);
      });
      assert.deepEqual(broken,[],`Broken images ${route}`);
      report.push({route,width,ok:true});
    }
  }
  await page.setViewportSize({width:1440,height:900});
  for(const p of catalog){
    await page.goto(base+p.path,{waitUntil:'networkidle'});
    for(let i=0;i<4;i++){
      await page.locator(`[data-visual-step="${i}"]`).click();
      await page.waitForFunction(i=>document.querySelector(`[data-visual-step="${i}"]`)?.getAttribute('aria-pressed')==='true',i);
      await page.waitForTimeout(320);
      assert.equal(await page.locator('[data-visual-image].is-active').getAttribute('data-visual-image'),String(i));
    }
  }
  for(const [width,height] of [[1440,900],[2560,1440]]){
    await page.setViewportSize({width,height});
    await page.goto(base+'/products/pet-absorbent-paper-sheets#paper-demo',{waitUntil:'networkidle'});
    const start=await page.locator('#paper-demo').evaluate(el=>el.getBoundingClientRect().top+scrollY-document.querySelector('.header').offsetHeight);
    for(const offset of [0,120,240,360]){
      await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),start+offset);
      await page.waitForTimeout(350);
      const geometry=await page.locator('.product-visual-sticky').evaluate(el=>({top:el.getBoundingClientRect().top,height:el.getBoundingClientRect().height,nav:document.querySelector('.header').offsetHeight,vh:innerHeight}));
      assert(Math.abs(geometry.top-geometry.nav)<3,`Sticky drift ${JSON.stringify(geometry)}`);
      assert(Math.abs(geometry.height-(geometry.vh-geometry.nav))<3,'Sticky height mismatch');
    }
    await fs.mkdir('output/deployment-qa',{recursive:true});
    await page.screenshot({path:`output/deployment-qa/paper-${width}.png`});
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto(base+'/products/pet-absorbent-paper-sheets#paper-demo',{waitUntil:'networkidle'});
  await page.screenshot({path:'output/deployment-qa/paper-mobile.png'});
  await page.goto(base+'/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('.customer-gallery-group:not([aria-hidden]) img').count(),4);
  await page.locator('#customer-moments').scrollIntoViewIfNeeded();
  await page.locator('#customer-moments').hover();
  assert.equal(await page.locator('.customer-gallery-track').evaluate(el=>getComputedStyle(el).animationPlayState),'running');

  // Test submission in a fully mocked browser context: no live inquiry is sent.
  const formContext=await browser.newContext();
  await formContext.addInitScript(()=>{
    window.turnstile={render(el,options){window.verifyTest=()=>options.callback('test-token');return 0;},reset(){},remove(){}};
  });
  let submitted=null, count=0;
  await formContext.route('**/*',async route=>{
    const url=new URL(route.request().url());
    if(url.pathname==='/api/contact'){
      submitted=route.request().postDataJSON();count++;
      return route.fulfill({status:count===1?500:200,contentType:'application/json',body:JSON.stringify({message:count===1?'Please retry.':'Test inquiry accepted.'})});
    }
    if(url.origin===base)return route.continue();
    return route.abort();
  });
  const formPage=await formContext.newPage();
  await formPage.goto(base+'/contact?product=pet-absorbent-paper-sheets&intent=sample&brief=Nonwoven%20printed%2030x40&quantity=10000');
  assert.equal(await formPage.locator('[name="brief"]').inputValue(),'Nonwoven printed 30x40');
  assert(await formPage.locator('#project-form [type="submit"]').isDisabled());
  await formPage.locator('[name="name"]').fill('Local QA');
  await formPage.locator('[name="email"]').fill('qa@example.com');
  await formPage.evaluate(()=>window.verifyTest());
  await formPage.locator('#project-form [type="submit"]').click();
  await formPage.waitForFunction(()=>document.querySelector('#project-result').dataset.status==='error');
  assert.equal(await formPage.locator('[name="brief"]').inputValue(),'Nonwoven printed 30x40');
  await formPage.evaluate(()=>window.verifyTest());
  await formPage.locator('#project-form [type="submit"]').click();
  await formPage.waitForFunction(()=>document.querySelector('#project-result').dataset.status==='success');
  assert(submitted.message.includes('Nonwoven printed 30x40'));
  assert.equal(submitted.quantity,'10000');
  const conversions=await formPage.evaluate(()=>window.dataLayer.filter(event=>event[0]==='event'&&event[1]==='conversion').length);
  assert.equal(conversions,1);

  for(const route of resolveStaticRoutes()){
    const file=path.join(root,route==='/'?'index.html':route.slice(1)+'/index.html');
    const html=await fs.readFile(file,'utf8');
    assert(html.includes('rel="canonical"'),`Missing static canonical ${route}`);
    assert(html.includes(route==='/'?'https://www.jczcare.com/':'https://www.jczcare.com'+route),`Missing route SEO ${route}`);
  }
  await page.goto(base+'/blog',{waitUntil:'networkidle'});
  assert(await page.locator('main:not([hidden]) h1').innerText());
  assert.equal(await page.locator('#site-page [data-insights]').count(),1,'Blog must use the current storefront library');
  assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
  await fs.writeFile('output/deployment-qa/report.json',JSON.stringify({report,scenes:24,form:'mocked failure + success, one conversion',errors,failures},null,2));
  console.log(`PASS: ${report.length} responsive page checks, 24 scene changes, sticky geometry, gallery and mocked inquiry; preserved ${resolveStaticRoutes().length} SEO pages.`);
}finally{await browser.close();server.close();}
