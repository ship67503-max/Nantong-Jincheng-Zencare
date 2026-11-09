// Migrates the legacy Pixel singleton and submission-ID deduplication approach.
import { hasMarketingConsent } from './marketingConsent.js';
export const META_PIXEL_ID = '1532666838061135';
const stateKey = '__jczcareMetaPixelState';
export function initializeMetaPixel({ windowObject: w = window, documentObject: d = document,
  enabled = (import.meta.env?.PROD === true && ['www.jczcare.com', 'jczcare.com'].includes(w.location.hostname))
    || new URLSearchParams(w.location.search).get('meta_debug') === '1',
} = {}) {
  if (!enabled || !hasMarketingConsent(w)) return null;
  if (w[stateKey]) { w.fbq('consent', 'grant'); return w[stateKey]; }
  // Fail closed if another installer already owns fbq or the Meta script.
  if (w.fbq || d.querySelector('script[src*="connect.facebook.net"]')) return null;
  const fbq = function () { if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments); else fbq.queue.push(arguments); };
  Object.assign(fbq, { push: fbq, loaded: true, version: '2.0', queue: [] });
  w.fbq = w._fbq = fbq;
  const state = { path: null, product: null, leads: new Set() };
  w[stateKey] = state;
  fbq('consent', 'grant');
  fbq('set', 'autoConfig', false, META_PIXEL_ID);
  fbq('init', META_PIXEL_ID);
  const script = d.createElement('script');
  script.id = 'jczcare-meta-pixel'; script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  d.head.appendChild(script);
  return state;
}
export function revokeMetaConsent(w = window) {
  if (w[stateKey]) w.fbq('consent', 'revoke');
}
export function trackMetaPage(productId = null, options = {}) {
  const w = options.windowObject ?? window;
  const state = initializeMetaPixel(options);
  if (!state) return false;
  // Query strings and fragments are deliberately excluded from custom parameters.
  const path = w.location.pathname.replace(/\/$/, '') || '/';
  if (state.path !== path) {
    state.path = path; state.product = null;
    w.fbq('trackSingle', META_PIXEL_ID, 'PageView');
  }
  if (productId && /^[a-z][a-z0-9-]{0,99}$/.test(productId) && state.product !== productId) {
    state.product = productId;
    w.fbq('trackSingle', META_PIXEL_ID, 'ViewContent', { content_ids: [productId], content_type: 'product' });
  }
  return true;
}
export function trackMetaLead(result, options = {}) {
  const w = options.windowObject ?? window;
  if (result?.success !== true || result?.deliveryConfirmed !== true || result?.saved !== true || !/^[a-f0-9-]{36}$/.test(result.leadEventId || '')) return false;
  const state = initializeMetaPixel(options);
  if (!state) return false;
  const id = result.leadEventId, key = `jczcare-meta-lead:${id}`;
  let stored = false;
  try { stored = w.sessionStorage.getItem(key) === '1'; } catch { /* memory fallback */ }
  if (stored || state.leads.has(id)) return false;
  state.leads.add(id);
  try { w.sessionStorage.setItem(key, '1'); } catch { /* memory fallback */ }
  w.fbq('trackSingle', META_PIXEL_ID, 'Lead', {}, { eventID: id });
  return true;
}
