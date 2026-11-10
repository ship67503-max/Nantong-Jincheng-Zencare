import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const output='output/brand-refresh';
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true});
const errors=[];
try{
  const context=await browser.newContext();
  await context.route('**/*',r=>new URL(r.request().url()).origin==='http://127.0.0.1:5190'?r.continue():r.abort());
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:900});
    for(const route of ['/','/products','/products/pet-training-pads','/products/pet-absorbent-paper-sheets','/quality-control','/resources','/blog','/faq','/pet-pee-pad-manufacturer','/sitemap.html']){
      await page.goto('http://127.0.0.1:5190'+route,{waitUntil:'networkidle'});
      assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),`${route} overflow at ${width}`);
      const logo=page.locator('a.brand-logo:visible img,.sitemap-logo img').first();
      assert(await logo.isVisible(),`No visible logo on ${route}`);
      assert(await logo.evaluate(img=>img.complete&&img.naturalWidth>0));
      assert.equal(await page.locator('link[rel="icon"]').getAttribute('href'),'/favicon.png');
      await page.screenshot({path:`${output}/${route.replaceAll('/','_')||'home'}-${width}.png`});
      if(route==='/'){
        await page.locator('footer').scrollIntoViewIfNeeded();
        await page.screenshot({path:`${output}/footer-${width}.png`});
      }
    }
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: 20 desktop/mobile brand views, visible logos, favicon, no horizontal overflow or JS errors.');
}finally{await browser.close();}
