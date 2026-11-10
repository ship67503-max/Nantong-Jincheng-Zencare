import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {insightRoutes} from './storefront-insights.mjs';

const base='http://127.0.0.1:5190';
const output='output/insights-review';
await fs.mkdir(output,{recursive:true});
for(const route of insightRoutes){
  const html=await fs.readFile(path.join('dist',route.slice(1),'index.html'),'utf8');
  assert(html.includes('data-insights'),route);
  assert(!html.includes('Primary keyword:'),route);
  assert(html.includes(`href="https://www.jczcare.com${route}"`),route);
  for(const match of html.matchAll(/<img[^>]+src="(\/images\/[^"?]+)"/g)){
    await fs.access(path.join('public',match[1]));
  }
}
const browser=await chromium.launch({headless:true});
const errors=[];
try{
  const context=await browser.newContext();
  await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  for(const width of [1440,768,390]){
    await page.setViewportSize({width,height:900});
    for(const route of ['/resources','/blog','/blog/choose-reliable-pet-pad-manufacturer','/blog/category/pet-training-pads']){
      await page.goto(base+route,{waitUntil:'networkidle'});
      assert.equal(await page.locator('main:visible h1').count(),1);
      assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),`${route}: overflow ${width}`);
      assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://www.jczcare.com'+route);
      await page.screenshot({path:`${output}/${route.split('/').pop()}-${width}.png`});
    }
  }
  await page.goto(base+'/blog?search=packaging',{waitUntil:'networkidle'});
  assert.equal(await page.locator('[data-insights-search]').inputValue(),'packaging');
  assert((await page.locator('[data-insight-card]:visible').count())>0);
  assert((await page.locator('[data-insight-card]:visible').count())<150);
  await page.locator('[data-insights-search]').fill('no-results-qa-zqv');
  assert.equal(await page.locator('[data-insight-card]:visible').count(),0);
  assert(await page.locator('[data-insights-empty]').isVisible());
  await page.locator('[data-insights-search]').fill('');
  await page.locator('[data-insights-category]').selectOption('pet-training-pads');
  assert((await page.locator('[data-insight-card]:visible').count())>0);
  await page.goto(base+'/blog/choose-reliable-pet-pad-manufacturer',{waitUntil:'networkidle'});
  await page.locator('.insights-toc a[href="#reading-2"]').click();
  assert.equal(new URL(page.url()).hash,'#reading-2');
  const title=await page.title();
  await page.setViewportSize({width:1440,height:900});
  await page.locator('.header nav a[href="/products"]').click();
  await page.waitForURL(base+'/products');
  await page.goBack();
  await page.waitForFunction(expected=>document.title===expected,title);
  assert.equal(await page.title(),title);
  assert.equal(await page.locator('meta[property="og:type"]').getAttribute('content'),'article');
  const schema=await page.locator('#storefront-schema').textContent();
  assert(JSON.parse(schema)['@graph'].some(x=>x['@type']==='BlogPosting'));
  assert.deepEqual(errors,[]);
  console.log(`PASS: ${insightRoutes.length} static routes, images and canonicals; 12 responsive views; search, category, empty state, TOC, back navigation and article schema.`);
}finally{await browser.close();}
