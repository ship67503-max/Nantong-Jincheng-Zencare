import React, { useState } from 'react';
import { consentKey, setMarketingConsent } from './marketingConsent.js';
export function MarketingConsent() {
  const [open, setOpen] = useState(() => { try { return !['granted', 'denied'].includes(localStorage.getItem(consentKey)); } catch { return true; } });
  const choose = (value) => { if (setMarketingConsent(value)) setOpen(false); };
  return <aside style={{ position: 'fixed', bottom: 12, left: 12, zIndex: 10000, maxWidth: 420, padding: 16, background: 'white', color: '#18382b', border: '1px solid #aaa', borderRadius: 8 }} aria-label="Marketing cookie preferences">
    {open ? <><p>Allow Meta marketing cookies? Meta receives device and browsing information to measure page views, product views and successful inquiries. Your choice does not affect inquiry submission. You can change it here at any time.</p><button type="button" onClick={() => choose(false)}>Reject marketing</button>{' '}<button type="button" onClick={() => choose(true)}>Allow Meta marketing</button></> : <button type="button" onClick={() => setOpen(true)}>Marketing cookie settings</button>}
  </aside>;
}
