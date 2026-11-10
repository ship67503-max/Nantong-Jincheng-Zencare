import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {catalog} from '../src/storefront/catalog.js';

// Local-only mocks; production Turnstile and API remain untouched.
const root = path.resolve('dist');
const redirects = JSON.parse(await fs.readFile('vercel.json','utf8')).redirects;
assert(redirects.some(r=>r.source==='/request-product-plan'&&r.destination==='/contact'));
let htmlCount=0, inquiryLinks=0;
const destinations=new Set();
async function scan(dir) {
  for(const entry of await fs.readdir(dir,{withFileTypes:true})) {
    const file=path.join(dir,entry.name);
    if(entry.isDirectory()) await scan(file);
    else if(entry.name.endsWith('.html')) {
      htmlCount++;
      const html=await fs.readFile(file,'utf8');
      for(const match of html.matchAll(/href=["']([^"']+)["']/g)) {
        const href=match[1].replaceAll('&amp;','&');
        if(/(?:\/contact|\/request-product-plan|\/#contact)/.test(href)) {
          inquiryLinks++; destinations.add(href);
          assert(!href.includes('/#contact'),`Stale contact anchor in ${file}`);
        }
      }
    }
  }
}
await scan(root);
const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/request-product-plan') {
    res.writeHead(307,{Location:'/contact'+url.search}).end();return;
  }
  const file=path.resolve(root,'.'+(url.pathname.endsWith('/')?url.pathname+'index.html':path.extname(url.pathname)?url.pathname:url.pathname+'/index.html'));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  try{const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':({'.js':'text/javascript','.css':'text/css','.html':'text/html','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream'}).end(data);}catch{res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});
const report={htmlCount,inquiryLinks,uniqueDestinations:destinations.size,checks:[]};
try {
  const context=await browser.newContext();
  let payload, fail=false;
  await context.route('**/*',async route=>{
    const url=new URL(route.request().url());
    if(url.hostname==='challenges.cloudflare.com') return route.fulfill({contentType:'application/javascript',body:'window.turnstile={render:(el,o)=>{o.callback("local-mock-only");return 1},reset:()=>{},remove:()=>{}};'});
    if(url.origin!==base)return route.abort();
    if(url.pathname==='/api/contact') {
      payload=route.request().postDataJSON();
      return route.fulfill({status:fail?502:200,contentType:'application/json',body:JSON.stringify(fail?{message:'Test delivery failure'}:{ok:true,message:'Local mock accepted'})});
    }
    return route.continue();
  });
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const value=name=>page.locator(`#project-form [name="${name}"]`).inputValue();
  for(const p of catalog){
    await page.goto(`${base}/contact?product=${p.slug}&request=sample`);
    await page.waitForFunction(()=>document.querySelector('[name="intent"]')?.value==='sample');
    assert.equal(await value('product'),p.slug);
  }
  report.checks.push('All six product categories preserve sample intent');
  await page.goto(base+'/request-product-plan?product=adult-underpads&request=catalogue');
  await page.waitForFunction(()=>document.querySelector('[name="intent"]')?.value==='documents');
  assert.equal(await value('product'),'adult-underpads');
  await page.goto(base+'/contact?product=request-sample');
  await page.waitForFunction(()=>document.querySelector('[name="intent"]')?.value==='sample');
  assert((await value('brief')).includes('request-sample'));
  await page.goto(base+'/contact?product=oem-catalog');
  await page.waitForFunction(()=>document.querySelector('[name="intent"]')?.value==='documents');
  report.checks.push('Legacy request route, catalogue and unknown context preserved');
  await page.goto(base+'/#contact');
  await page.waitForURL('**/contact');
  await page.locator('#project-form').waitFor();
  report.checks.push('Bookmarked /#contact reaches form');
  for(const [slug,prefix,form] of [['pet-training-pads','pad','.pad-brief-form'],['pet-absorbent-paper-sheets','sheet','#paper-brief-form']]) {
    await page.goto(`${base}/products/${slug}`);
    await page.locator(`[name="${prefix}-quantity"]`).fill('20000 pieces');
    await page.locator(`[name="${prefix}-market"]`).fill('Europe');
    await page.locator(`[name="${prefix}-notes"]`).fill('TEST ONLY — custom packing');
    await page.locator(`${form} button[value="sample"]`).click();
    await page.waitForURL('**/contact?**');
    assert.equal(await value('product'),slug);
    assert.equal(await value('quantity'),'20000 pieces');
    assert.equal(await value('market'),'Europe');
    assert((await value('brief')).includes('Wood pulp + SAP'));
    assert((await value('brief')).includes('TEST ONLY — custom packing'));
    assert.equal(await value('intent'),'sample');
  }
  report.checks.push('Pad/paper configurations carry material, quantity, market and notes');
  await page.locator('[name="name"]').fill('Local test');
  await page.locator('[name="email"]').fill('test@example.com');
  await page.locator('[name="phone"]').fill('+1 555 010 2026');
  fail=true;
  await page.locator('#project-form [type="submit"]').click();
  await page.locator('#project-result[data-status="error"]').waitFor();
  assert.equal(await value('name'),'Local test');
  assert(payload.message.includes('Sample request'));
  assert(payload.message.includes('Wood pulp + SAP'));
  assert.equal(payload.phone, '+1 555 010 2026');
  report.checks.push('Submission payload complete; failure keeps customer input');
  fail=false;
  await page.goto(base+'/contact?product=pet-training-pads');
  await page.locator('[name="name"]').fill('Local test');
  await page.locator('[name="email"]').fill('test@example.com');
  await page.locator('[name="phone"]').fill('+44 20 7946 0000');
  await page.locator('#project-form [type="submit"]').click();
  await page.locator('#project-result[data-status="success"]').waitFor();
  assert.equal(await value('name'),'');
  report.checks.push('Successful submission resets form');
  assert.deepEqual(errors,[]);
  await fs.mkdir('output/inquiry-audit',{recursive:true});
  await fs.writeFile('output/inquiry-audit/local-flow.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
} finally {await browser.close();server.close();}
