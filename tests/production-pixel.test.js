import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createProductionPixel, CONSENT_KEY, setMarketingConsent, createLeadSubmissionId } from '../src/productionPixel.js';

const id = '9bd94f64-a59c-4933-893e-4e769334235b';
const storage = () => {
  const values = new Map();
  return { getItem: k => values.get(k) ?? null, setItem: (k, v) => values.set(k, v) };
};
function runtime({ granted = true, enabled = true } = {}) {
  const scripts = [];
  const w = { location: { pathname: '/', hostname: 'www.jczcare.com', href: 'https://www.jczcare.com/' },
    localStorage: storage(), sessionStorage: storage(), dispatchEvent() {}, Event: class {} };
  if (granted) w.localStorage.setItem(CONSENT_KEY, 'granted');
  const d = { referrer: '', querySelector: () => scripts[0] || null, createElement: () => ({}), head: { appendChild: s => scripts.push(s) } };
  const options = { windowObject: w, documentObject: d, enabled };
  return { w, d, scripts, options, pixel: createProductionPixel(options), calls: () => (w.fbq?.queue || []).map(args => [...args]) };
}
const events = r => r.calls().filter(args => args[0] === 'trackSingle');

test('unavailable crypto disables event correlation without breaking inquiry submission', () => {
  assert.equal(createLeadSubmissionId({}), '');
  assert.equal(createLeadSubmissionId({randomUUID(){throw Error('unsupported');}}), '');
  assert.equal(createLeadSubmissionId({randomUUID:()=>id}), id);
});

test('production asset ID is exact; initialize only once across clients', () => {
  const r = runtime();
  r.pixel.page(); createProductionPixel(r.options).page();
  assert.deepEqual(r.calls().filter(c => c[0] === 'init'), [['init', '1532666838061135']]);
  assert.equal(r.scripts.length, 1);
  assert.equal(events(r).length, 1);
  assert.ok(r.calls().some(c => c[0] === 'set' && c[1] === 'autoConfig' && c[2] === false));
});
test('unknown or rejected consent loads no SDK and emits nothing', () => {
  const r = runtime({ granted: false });
  assert.equal(r.pixel.page(), false);
  assert.equal(r.pixel.lead({ ok: true, saved: true, leadEventId: id }), false);
  assert.equal(r.scripts.length, 0);
  assert.equal(r.w.fbq, undefined);
});
test('grant sends current page, same route/query/hash does not count twice', () => {
  const r = runtime({ granted: false });
  setMarketingConsent(true, r.w);
  r.pixel.page(); r.w.location.search = '?utm_source=facebook'; r.w.location.hash = '#products'; r.pixel.page();
  r.w.location.pathname = '/contact'; r.pixel.page(); r.pixel.page();
  r.w.location.pathname = '/'; r.pixel.page();
  assert.equal(events(r).filter(c => c[2] === 'PageView').length, 3);
});
test('ViewContent only when caller supplies real product, once per entry', () => {
  const r = runtime(); r.pixel.page();
  r.w.location.pathname = '/products/pet-training-pads'; r.pixel.page();
  assert.equal(events(r).filter(c => c[2] === 'ViewContent').length, 0);
  r.w.location.pathname += '/item-1601083381060'; r.pixel.page('1601083381060'); r.pixel.page('1601083381060');
  assert.equal(events(r).filter(c => c[2] === 'ViewContent').length, 1);
  r.w.location.pathname = '/'; r.pixel.page();
  r.w.location.pathname = '/products/pet-training-pads/item-1601083381060'; r.pixel.page('1601083381060');
  assert.equal(events(r).filter(c => c[2] === 'ViewContent').length, 2);
});
test('Lead requires explicit save success, ok and a UUID, never customer fields', () => {
  const r = runtime();
  for (const receipt of [{}, {ok:true}, {ok:true,saved:false,leadEventId:id}, {ok:true,saved:'unknown',leadEventId:id}, {ok:false,saved:true,leadEventId:id}, {ok:true,saved:true,leadEventId:'customer@example.com'}]) {
    assert.equal(r.pixel.lead(receipt), false);
  }
  assert.equal(r.pixel.lead({ok:true,saved:true,leadEventId:id,email:'customer@example.com',name:'Test Customer',phone:'+12345678900'}), true);
  assert.deepEqual(events(r), [['trackSingle','1532666838061135','Lead',{}, {eventID:id}]]);
});
test('Lead is deduplicated in memory and session, even after singleton is recreated', () => {
  const r = runtime(); const receipt = {ok:true,saved:true,leadEventId:id};
  assert.equal(r.pixel.lead(receipt), true); assert.equal(r.pixel.lead(receipt), false);
  delete r.w.__jczcareProductionPixel; delete r.w.fbq; delete r.w._fbq; r.scripts.length = 0;
  assert.equal(createProductionPixel(r.options).lead(receipt), false);
});
test('withdrawal before SDK load clears queued events and blocks subsequent Lead', () => {
  const r = runtime(); r.pixel.page();
  setMarketingConsent(false, r.w);
  assert.equal(events(r).length, 0);
  assert.ok(r.calls().some(c => c[0] === 'consent' && c[1] === 'revoke'));
  assert.equal(r.pixel.lead({ok:true,saved:true,leadEventId:id}), false);
});
test('withdrawal in another tab is applied on next tracking call', () => {
  const r = runtime(); r.pixel.page();
  r.w.localStorage.setItem(CONSENT_KEY, 'denied');
  assert.equal(r.pixel.page(), false);
  assert.equal(events(r).length, 0);
});
test('blocked storage, foreign installer, disabled runtime fail closed', () => {
  const a = runtime(); a.w.localStorage.getItem = () => { throw Error('blocked'); }; assert.equal(a.pixel.page(), false);
  const b = runtime(); b.w.fbq = () => { throw Error('foreign'); }; assert.equal(b.pixel.page(), false); assert.equal(b.scripts.length, 0);
  const c = runtime({ enabled: false }); assert.equal(c.pixel.page(), false); assert.equal(c.scripts.length, 0);
});
test('sensitive inquiry URLs and referrers never initialize SDK', () => {
  for (const field of ['href', 'referrer']) {
    const r = runtime();
    if (field === 'href') r.w.location.href = 'https://www.jczcare.com/contact?brief=private';
    else r.d.referrer = 'https://example.org/?email=customer%40example.com';
    assert.equal(r.pixel.page(), false); assert.equal(r.scripts.length, 0);
  }
});
test('SDK errors cannot escape to the inquiry success UI', () => {
  const r = runtime(); r.pixel.page(); r.w.fbq = () => { throw Error('network blocked'); };
  assert.equal(r.pixel.lead({ok:true,saved:true,leadEventId:id}), false);
});
