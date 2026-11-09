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
test('Lead requires saved confirmation and deduplicates retries',()=>{const o=runtime(),r={ok:true,saved:true,leadEventId:'12345678-1234-1234-1234-123456789abc',email:'private@example.com'};assert.equal(trackMetaLead({...r,saved:false},o),false);assert.equal(trackMetaLead({...r,ok:false},o),false);assert.equal(trackMetaLead(r,o),true);assert.equal(trackMetaLead(r,o),false);assert.ok(!JSON.stringify(o.windowObject.fbq.queue).includes('private'));});
test('withdrawal blocks events and regrant does not reinitialize',()=>{const o=runtime();trackMetaPage(null,o);o.local.set('jczcare-marketing-consent-v1','denied');revokeMetaConsent(o.windowObject);o.windowObject.location.pathname='/other';assert.equal(trackMetaPage(null,o),false);o.local.set('jczcare-marketing-consent-v1','granted');trackMetaPage(null,o);assert.equal(o.scripts.length,1)});
test('preexisting Pixel fails closed',()=>{const o=runtime();o.windowObject.fbq=()=>{throw Error('unexpected')};assert.equal(trackMetaPage(null,o),false)});
import { leadReceipt } from '../api/leadReceipt.js';
import { hasMarketingConsent, setMarketingConsent } from '../src/marketingConsent.js';
test('server receipts are stable across retries without customer identifiers',()=>{const key='12345678-1234-1234-1234-123456789abc';assert.equal(leadReceipt(key).eventId,key);assert.equal(leadReceipt(key).eventId,key);assert.match(leadReceipt('email@example.com').eventId,/^[a-f0-9-]{36}$/)});
test('consent defaults denied when storage fails',()=>{assert.equal(hasMarketingConsent({localStorage:{getItem(){throw Error()}}}),false);assert.equal(setMarketingConsent(true,{localStorage:{setItem(){throw Error()}}}),false)});
import { readFileSync } from 'node:fs';
const apiSource=readFileSync(new URL('../api/contact.js',import.meta.url),'utf8').replace(/import .*;\r?\n/g,'');
async function runApi(sheetFails, emailFails=false, captchaFails=false){
 const source=`const sendEmail=async()=>({ok:${!emailFails}}); const appendInquiryToGoogleSheets=async()=>{${sheetFails?'throw Error("mock Sheets failure");':''}}; const leadReceipt=()=>({eventId:'12345678-1234-1234-1234-123456789abc'});\n`+apiSource;
 const {default:handler}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 const old=globalThis.fetch,secret=process.env.TURNSTILE_SECRET_KEY;globalThis.fetch=async()=>({ok:true,json:async()=>({success:!captchaFails})});process.env.TURNSTILE_SECRET_KEY='test';
 let output;const res={setHeader(){},status(){return this},json(v){output=v}};
 try{await handler({method:'POST',headers:{},body:{name:'Test',email:'test@example.com',product:'pads',captchaToken:'test'}},res);return output}finally{globalThis.fetch=old;if(secret===undefined)delete process.env.TURNSTILE_SECRET_KEY;else process.env.TURNSTILE_SECRET_KEY=secret}
}
test('API confirms saved only when mocked Sheets write succeeds',async()=>{const success=await runApi(false),failure=await runApi(true);assert.equal(success.saved,true);assert.ok(success.leadEventId);assert.equal(failure.saved,false);assert.equal(failure.leadEventId,undefined)});

test('email and human verification failures never return saved receipt',async()=>{for(const result of [await runApi(false,true),await runApi(false,false,true)]){assert.notEqual(result.saved,true);assert.equal(result.leadEventId,undefined)}});
test('preview builds stay disabled unless test explicitly enables them',()=>{const o=runtime();delete o.enabled;assert.equal(trackMetaPage(null,o),false);assert.equal(o.scripts.length,0)});
