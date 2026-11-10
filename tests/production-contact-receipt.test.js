import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createProductionContactHandler } from '../api/contact.js';

const id = '9bd94f64-a59c-4933-893e-4e769334235b';
let ip = 0;
async function request(overrides = {}, bodyOverrides = {}) {
  const calls = [];
  const handler = createProductionContactHandler({
    verify: async () => { calls.push('verify'); return {ok:true}; },
    send: async () => { calls.push('email'); return {ok:true}; },
    append: async inquiry => { calls.push(['sheets', inquiry]); return {ok:true}; },
    syncBusiness: async inquiry => { calls.push(['business', inquiry]); },
    ...overrides,
  });
  const req = {method:'POST',headers:{'x-forwarded-for':`test-${++ip}`},body:{name:'Isolated Test',email:'test@example.invalid',phone:'0000000000',product:'Pet pads',captchaToken:'isolated',submissionId:id,...bodyOverrides}};
  const res = { setHeader(){}, status(code){this.statusCode=code;return this;}, json(data){this.data=data;}, end(){} };
  await handler(req,res);
  return {res,calls};
}
test('saved receipt follows awaited Sheets completion without changing business fields', async () => {
  const {res,calls} = await request();
  assert.equal(res.statusCode,200); assert.equal(res.data.ok,true); assert.equal(res.data.saved,true);
  assert.equal(res.data.saveStatus,'confirmed'); assert.equal(res.data.leadEventId,id);
  const inquiry=calls.find(c=>c[0]==='sheets')[1];
  assert.equal(inquiry.name,'Isolated Test'); assert.equal('submissionId' in inquiry,false);
  assert.deepEqual(calls.find(c=>c[0]==='business')[1],inquiry);
  assert.equal(calls[0],'verify'); assert.equal(calls[1],'email');
});
test('Sheets failure preserves original email success but never supplies a Lead ID', async () => {
  const {res,calls}=await request({append:async()=>{throw Error('isolated failure');}});
  assert.equal(res.statusCode,200); assert.equal(res.data.ok,true); assert.equal(res.data.saved,false);
  assert.equal(res.data.saveStatus,'unknown'); assert.equal(res.data.leadEventId,undefined);
  assert.ok(calls.some(c=>c[0]==='business'));
});
test('unconfirmed append does not authorize Lead', async () => {
  const {res}=await request({append:async()=>({})});
  assert.equal(res.data.saved,false); assert.equal(res.data.leadEventId,undefined);
});
test('email failure stops Sheets and business writes, no Lead receipt', async () => {
  const {res,calls}=await request({send:async()=>({ok:false,status:502})});
  assert.equal(res.statusCode,502); assert.equal(res.data.saved,undefined);
  assert.equal(calls.some(Array.isArray),false);
});
test('captcha and validation failures perform no business writes', async () => {
  const a=await request({verify:async()=>({ok:false,message:'verification failed'})});
  assert.equal(a.res.statusCode,400); assert.equal(a.calls.length,0);
  const b=await request({}, {email:'invalid'});
  assert.equal(b.res.statusCode,400); assert.equal(b.calls.length,0);
});
test('legacy clients remain compatible and invalid IDs cannot carry personal data into eventID', async () => {
  const {res}=await request({}, {submissionId:'customer@example.invalid'});
  assert.equal(res.statusCode,200); assert.equal(res.data.ok,true);
  assert.match(res.data.leadEventId,/^[a-f0-9-]{36}$/i);
});
test('retries retain stable eventID (not a promise of server-side write idempotency)', async () => {
  const a=await request(); const b=await request();
  assert.equal(a.res.data.leadEventId,b.res.data.leadEventId);
});
