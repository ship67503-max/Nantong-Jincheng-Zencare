import assert from 'node:assert/strict';
import {sendEmail} from '../services/email.js';
import {getSheetRange} from '../services/googleSheets.js';

// Isolated service regression checks: no network calls or production credentials.
process.env.GOOGLE_SHEET_NAME = '全部询盘';
assert.equal(getSheetRange(), "'全部询盘'!A:O");
process.env.GOOGLE_SHEET_NAME = "Buyer's inquiries";
assert.equal(getSheetRange(), "'Buyer''s inquiries'!A:O");
process.env.RESEND_API_KEY = 'unit-test-only';
process.env.CONTACT_FROM_EMAIL = 'Website <inquiry@example.com>';
process.env.CONTACT_TO_EMAIL = 'sales@example.com';
let sent;
globalThis.fetch = async (url, options) => {
  assert.equal(url, 'https://api.resend.com/emails');
  sent = JSON.parse(options.body);
  return {ok:true,status:200,json:async()=>({id:'test-message-id'})};
};
const inquiry = {name:'Test',email:'buyer@example.com',companyName:'TEST ONLY',product:'Pet pads',message:'<script>not html</script>',submittedAt:'2026-09-20T00:00:00Z'};
assert.deepEqual(await sendEmail(inquiry), {ok:true,id:'test-message-id'});
assert.deepEqual(sent.to,['sales@example.com']);
assert.equal(sent.reply_to,inquiry.email);
assert(sent.html.includes('&lt;script&gt;'));
assert(!sent.html.includes('<script>'));
globalThis.fetch = async () => ({ok:true,status:200,json:async()=>({})});
assert.equal((await sendEmail(inquiry)).ok,false);
globalThis.fetch = async () => ({ok:false,status:403,json:async()=>({name:'validation_error'})});
assert.equal((await sendEmail(inquiry)).ok,false);
delete process.env.RESEND_API_KEY;
assert.equal((await sendEmail(inquiry)).status,503);
console.log('PASS: email envelope, escaping, acceptance ID, provider failure, missing configuration, quoted sheet names.');
