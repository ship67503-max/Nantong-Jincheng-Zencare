import test from 'node:test';
import assert from 'node:assert/strict';
import { trackMetaPage, trackMetaLead, revokeMetaConsent } from '../src/metaPixel.js';
function runtime(consent='granted') {
 const local=new Map([['jczcare-marketing-consent-v1',consent]]), session=new Map(), scripts=[];
 const storage=m=>({getItem:k=>m.get(k),setItem:(k,v)=>m.set(k,v)});
 const w={location:{hostname:'www.jczcare.com',pathname:'/'},localStorage:storage(local),sessionStorage:storage(session)};
 const d={querySelector:()=>null,createElement:()=>({}),head:{appendChild:s=>scripts.push(s)}};
 return {windowObject:w,documentObject:d,enabled:true,scripts,local};
}
test('denied consent loads no script and queues no events',()=>{const o=runtime('denied');assert.equal(trackMetaPage(null,o),false);assert.equal(o.scripts.length,0);assert.equal(o.windowObject.fbq,undefined)});
test('singleton, path changes, query-only dedupe, product-only ViewContent',()=>{const o=runtime();trackMetaPage(null,o);trackMetaPage(null,o);o.windowObject.location.search='?email=private';trackMetaPage(null,o);o.windowObject.location.pathname='/products/pet-pads';trackMetaPage('pet-pads',o);trackMetaPage('pet-pads',o);o.windowObject.location.pathname='/';trackMetaPage(null,o);const q=o.windowObject.fbq.queue.map(x=>Array.from(x));assert.equal(o.scripts.length,1);assert.equal(q.filter(x=>x[0]==='init').length,1);assert.equal(q.filter(x=>x[2]==='PageView').length,3);assert.equal(q.filter(x=>x[2]==='ViewContent').length,1);assert.ok(!JSON.stringify(q).includes('private'));});
test('Lead requires saved confirmation and deduplicates retries',()=>{const o=runtime(),r={success:true,deliveryConfirmed:true,saved:true,leadEventId:'12345678-1234-1234-1234-123456789abc',email:'private@example.com'};assert.equal(trackMetaLead({...r,saved:false},o),false);assert.equal(trackMetaLead({...r,success:false},o),false);assert.equal(trackMetaLead(r,o),true);assert.equal(trackMetaLead(r,o),false);assert.ok(!JSON.stringify(o.windowObject.fbq.queue).includes('private'));});
test('withdrawal blocks events and regrant does not reinitialize',()=>{const o=runtime();trackMetaPage(null,o);o.local.set('jczcare-marketing-consent-v1','denied');revokeMetaConsent(o.windowObject);o.windowObject.location.pathname='/other';assert.equal(trackMetaPage(null,o),false);o.local.set('jczcare-marketing-consent-v1','granted');trackMetaPage(null,o);assert.equal(o.scripts.length,1)});
test('preexisting Pixel fails closed',()=>{const o=runtime();o.windowObject.fbq=()=>{throw Error('unexpected')};assert.equal(trackMetaPage(null,o),false)});

import { hasMarketingConsent, setMarketingConsent } from '../src/marketingConsent.js';
import { readFileSync } from 'node:fs';
test('consent defaults denied when storage fails',()=>{assert.equal(hasMarketingConsent({localStorage:{getItem(){throw Error()}}}),false);assert.equal(setMarketingConsent(true,{localStorage:{setItem(){throw Error()}}}),false)});
test('email acceptance alone never qualifies for Lead',()=>{const o=runtime();for(const result of [{success:true,deliveryConfirmed:true},{success:true,deliveryConfirmed:true,saved:false},{success:true,saved:true,leadEventId:'12345678-1234-1234-1234-123456789abc'}])assert.equal(trackMetaLead(result,o),false);assert.equal(o.scripts.length,0)});
test('no unconditional noscript Pixel or video preload',()=>{const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');assert.doesNotMatch(html,/facebook\.com\/tr|as="video"/)});
test('preview builds stay disabled unless test explicitly enables them',()=>{const o=runtime();delete o.enabled;assert.equal(trackMetaPage(null,o),false);assert.equal(o.scripts.length,0)});

test('explicit preview debug still requires consent',()=>{const o=runtime('denied');delete o.enabled;o.windowObject.location.hostname='preview.vercel.app';o.windowObject.location.search='?meta_debug=1';assert.equal(trackMetaPage(null,o),false);o.local.set('jczcare-marketing-consent-v1','granted');assert.equal(trackMetaPage(null,o),true);assert.equal(o.scripts.length,1)});
