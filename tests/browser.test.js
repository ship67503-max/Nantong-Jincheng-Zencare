import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
test('built UI consent and product routing in isolated browser',async()=>{
 const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4181','--strictPort'],{stdio:['ignore','pipe','pipe']});
 await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('preview startup timeout')),10000);server.stdout.on('data',data=>{if(data.toString().includes('4181')){clearTimeout(timer);resolve()}});server.on('exit',code=>{clearTimeout(timer);reject(Error('preview exited '+code))})});
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext();
 let sdk=0;const errors=[];
 // Every request is intercepted: never contact production or Meta.
 await context.route('**/*',async route=>{
  const u=new URL(route.request().url());
  if(u.hostname==='www.jczcare.com'){
   const response=await context.request.get('http://127.0.0.1:4181'+u.pathname+u.search);
   return route.fulfill({response});
  }
  if(u.hostname==='connect.facebook.net'){sdk++;return route.fulfill({contentType:'application/javascript',body:'window.__metaCalls = Array.from(window.fbq.queue, x => Array.from(x)); window.fbq.callMethod = function(){ window.__metaCalls.push(Array.from(arguments)); };'});}
  return route.abort();
 });
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto('https://www.jczcare.com/',{waitUntil:'domcontentloaded'});
  await page.getByRole('button',{name:'Reject marketing',exact:true}).click();
  assert.equal(sdk,0);
  await page.getByRole('button',{name:'Marketing cookie settings',exact:true}).click();
  await page.getByRole('button',{name:'Allow Meta marketing',exact:true}).click();
  await page.waitForFunction(()=>window.__metaCalls);
  assert.equal(sdk,1);
  let q=await page.evaluate(()=>window.__metaCalls);
  assert.equal(q.filter(x=>x[0]==='init').length,1);
  assert.equal(q.filter(x=>x[2]==='PageView').length,1);
  await page.evaluate(()=>{history.pushState({},'', '/products/disposable-pet-pads');history.replaceState({},'', '/products/disposable-pet-pads?test=1');});
  q=await page.evaluate(()=>window.__metaCalls);
  assert.equal(q.filter(x=>x[2]==='PageView').length,2);
  assert.equal(q.filter(x=>x[2]==='ViewContent').length,1);
  await page.getByRole('button',{name:'Marketing cookie settings',exact:true}).click();
  await page.getByRole('button',{name:'Reject marketing',exact:true}).click();
  await page.evaluate(()=>history.pushState({},'', '/pages/about'));
  q=await page.evaluate(()=>window.__metaCalls);
  assert.equal(q.filter(x=>x[2]==='PageView').length,2);
  assert.ok(q.some(x=>x[0]==='consent'&&x[1]==='revoke'));
  assert.equal(errors.length,0,errors.join('\n'));
 }finally{await browser.close();server.kill()}
});
