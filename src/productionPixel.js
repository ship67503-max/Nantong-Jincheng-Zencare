// The storefront entry is independent of the legacy React entry.
// Keep the verified asset ID in one source of truth.
import { META_PIXEL_ID } from './metaPixel.js';

export const CONSENT_KEY = 'jczcare-marketing-consent-v1';
const stateKey = '__jczcareProductionPixel';
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const validLeadEventId = value => uuidPattern.test(String(value || ''));

export function createLeadSubmissionId(cryptoObject = globalThis.crypto) {
  try { return cryptoObject?.randomUUID?.() || ''; } catch { return ''; }
}

export function hasMarketingConsent(w = window) {
  try { return w.localStorage.getItem(CONSENT_KEY) === 'granted'; } catch { return false; }
}

export function setMarketingConsent(granted, w = window) {
  try { w.localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied'); } catch { return false; }
  syncMarketingConsent(w);
  w.dispatchEvent(new w.Event('jczcare-consent-change'));
  return true;
}

export function syncMarketingConsent(w = window) {
  const state = w[stateKey];
  if (!hasMarketingConsent(w) && state) {
    // The SDK may still be downloading. Do not replay queued events after withdrawal.
    if (Array.isArray(w.fbq?.queue)) {
      w.fbq.queue = w.fbq.queue.filter(args => !['track', 'trackSingle', 'trackCustom'].includes(args[0]));
    }
    try { w.fbq('consent', 'revoke'); } catch { /* never affect the website */ }
  }
}

// Meta's SDK also sends standard document/referrer URLs. Do not initialize on
// inquiry prefill URLs containing personal fields; never pass form values to it.
function hasSensitiveUrl(w, d) {
  return [w.location.href || '', d.referrer || ''].some(value => {
    if (/@|%40/i.test(value)) return true;
    try {
      const url = new URL(value, 'https://www.jczcare.com');
      return [...url.searchParams.keys()].some(key => /^(name|email|phone|whatsapp|message|brief|company|companyName)$/i.test(key));
    } catch { return true; }
  });
}

function initialize({ windowObject: w, documentObject: d, enabled }) {
  if (!enabled || !hasMarketingConsent(w) || hasSensitiveUrl(w, d)) return null;
  if (w[stateKey]) return w[stateKey];
  // Another installer must be investigated instead of initializing a second pixel.
  if (w.fbq || w.__jczcareMetaPixelState || d.querySelector('script[src*="connect.facebook.net"]')) return null;
  const fbq = function () {
    if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
    else fbq.queue.push(arguments);
  };
  Object.assign(fbq, { push: fbq, loaded: true, version: '2.0', queue: [] });
  w.fbq = w._fbq = fbq;
  const state = { path: null, product: null, leads: new Set() };
  w[stateKey] = state;
  fbq('consent', 'grant');
  fbq('set', 'autoConfig', false, META_PIXEL_ID);
  fbq('init', META_PIXEL_ID);
  const script = d.createElement('script');
  script.id = 'jczcare-production-meta-pixel';
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  d.head.appendChild(script);
  return state;
}

export function createProductionPixel({
  windowObject: w = window, documentObject: d = document,
  enabled = import.meta.env?.PROD === true && (
    ['www.jczcare.com', 'jczcare.com'].includes(w.location.hostname)
    || (import.meta.env?.VITE_META_PIXEL_PREVIEW_ENABLED === 'true' && w.location.hostname.endsWith('.vercel.app'))
  ),
} = {}) {
  const options = { windowObject: w, documentObject: d, enabled };
  const withPixel = callback => {
    try {
      syncMarketingConsent(w);
      const state = initialize(options);
      if (!state || !hasMarketingConsent(w)) return false;
      w.fbq('consent', 'grant');
      return callback(state);
    } catch { return false; }
  };
  return {
    page(productId = null) {
      return withPixel(state => {
        const path = w.location.pathname.replace(/\/$/, '') || '/';
        let sent = false;
        if (state.path !== path) {
          w.fbq('trackSingle', META_PIXEL_ID, 'PageView');
          state.path = path;
          state.product = null;
          sent = true;
        }
        if (productId && /^[a-z0-9][a-z0-9_-]{0,99}$/i.test(String(productId)) && state.product !== String(productId)) {
          w.fbq('trackSingle', META_PIXEL_ID, 'ViewContent', { content_ids: [String(productId)], content_type: 'product' });
          state.product = String(productId);
          sent = true;
        }
        return sent;
      });
    },
    lead(receipt) {
      if (receipt?.ok !== true || receipt?.saved !== true || !validLeadEventId(receipt?.leadEventId)) return false;
      return withPixel(state => {
        const id = receipt.leadEventId;
        const key = `jczcare-meta-lead:${id}`;
        let stored = false;
        try { stored = w.sessionStorage.getItem(key) === '1'; } catch { /* memory fallback */ }
        if (stored || state.leads.has(id)) return false;
        // Mark before handing off to SDK; no automatic replay or inquiry resubmission.
        state.leads.add(id);
        try { w.sessionStorage.setItem(key, '1'); } catch { /* memory fallback */ }
        w.fbq('trackSingle', META_PIXEL_ID, 'Lead', {}, { eventID: id });
        return true;
      });
    },
  };
}
