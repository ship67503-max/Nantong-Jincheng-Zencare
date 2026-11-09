export const consentKey = 'jczcare-marketing-consent-v1';
export function hasMarketingConsent(w = window) {
  try { return w.localStorage.getItem(consentKey) === 'granted'; } catch { return false; }
}
export function setMarketingConsent(granted, w = window) {
  try { w.localStorage.setItem(consentKey, granted ? 'granted' : 'denied'); } catch { return false; }
  w.dispatchEvent(new w.Event('jczcare-consent-change'));
  return true;
}
