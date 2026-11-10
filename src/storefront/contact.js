import {catalog} from './catalog.js';
import { createProductionPixel, validLeadEventId, createLeadSubmissionId } from '../productionPixel.js';

// This adapter uses the existing production API and its server-side validation,
// Turnstile, email delivery and Sheets integration. No separate inquiry store.
export function initContactForm() {
  const form = document.getElementById('project-form');
  if (!form) return () => {};
  const result = document.getElementById('project-result');
  const context = document.getElementById('inquiry-context');
  const submit = form.querySelector('[type="submit"]');
  const category = form.elements.product;
  const format = form.elements.format;
  const params = new URLSearchParams(location.search);
  let token = '', widget = null, disposed = false, busy = false;
  const pixel = createProductionPixel();
  const attemptKey = 'jczcare-storefront-inquiry-attempt';
  let submissionId = '';
  try { submissionId = sessionStorage.getItem(attemptKey) || ''; } catch { /* memory fallback */ }
  const clearAttempt = () => {
    submissionId = '';
    try { sessionStorage.removeItem(attemptKey); } catch { /* memory fallback */ }
  };
  // Retry an unchanged logical submission with the same non-personal event ID.
  form.addEventListener('input', () => { if (!busy) clearAttempt(); });
  form.addEventListener('change', () => { if (!busy) clearAttempt(); });
  const normalize = value => String(value || '').trim().toLowerCase().replace(/[–—]/g, '-');
  function syncFormats(selected = '') {
    const product = catalog.find(p => p.slug === category.value);
    format.replaceChildren(new Option(product ? 'Any format / still deciding' : 'Select a product category first', ''));
    format.disabled = !product;
    product?.variants.forEach(v => format.add(new Option(v.name, v.name)));
    const matched = [...format.options].find(o => normalize(o.value) === normalize(selected));
    if (selected && !matched) {
      // Keep a human-readable URL value visible rather than silently dropping a product direction.
      format.add(new Option(`${selected} (to be confirmed)`, selected));
    }
    if (matched) format.value = matched.value;
    else if (selected) format.value = selected;
  }
  const supplied = params.get('product') || '';
  const aliases = {'disposable-pet-pads':'pet-training-pads','custom-pet-waste-bags':'garbage-bags','pet-care-pad-glove-wipes':'disposable-cleaning-products'};
  const suppliedProduct = aliases[supplied] || supplied;
  const match = catalog.find(p => normalize(p.slug) === normalize(suppliedProduct) || normalize(p.name) === normalize(suppliedProduct));
  if (match) category.value = match.slug;
  else if (supplied) category.value = 'other';
  const requestedFormat = params.get('format') || '';
  syncFormats(requestedFormat);
  for (const field of ['brief', 'quantity', 'market']) {
    if (params.has(field)) form.elements[field].value = params.get(field).slice(0, field === 'brief' ? 4600 : 100);
  }
  if (requestedFormat && format.selectedOptions[0]?.textContent.endsWith('(to be confirmed)')) {
    form.elements.brief.value = `Requested format: ${requestedFormat}\n${form.elements.brief.value}`.slice(0, 4600);
  }
  if (supplied && !match) form.elements.brief.value = `Product interest: ${supplied.slice(0, 200)}\n${form.elements.brief.value}`.slice(0, 4600);
  const legacyIntents = {'request-sample':'sample','request-quote':'quote','oem-catalog':'documents','product-catalog':'documents','size-charts':'documents','packaging-guide':'documents','specification-sheets':'documents','certificate-pack':'documents','moq-guide':'documents','factory-profile':'documents'};
  const requestedIntent = params.get('intent') || params.get('request') || legacyIntents[supplied];
  const intent = requestedIntent === 'catalogue' || requestedIntent === 'catalog' ? 'documents' : requestedIntent;
  if ([...form.elements.intent.options].some(o => o.value === intent)) form.elements.intent.value = intent;
  const updateContext = () => {
    const selectedCategory = category.selectedOptions[0]?.textContent;
    const selectedFormat = format.value;
    if (!context || !selectedCategory || !category.value) {
      if (context) context.hidden = true;
      return;
    }
    context.hidden = false;
    context.textContent = `You are asking about: ${selectedCategory}${selectedFormat ? ` → ${format.selectedOptions[0].textContent}` : ''}`;
  };
  category.addEventListener('change', () => { syncFormats(); updateContext(); });
  format.addEventListener('change', updateContext);
  updateContext();
  form.elements.company.maxLength = 200;
  form.elements.market.maxLength = 100;
  form.elements.quantity.maxLength = 100;
  form.elements.brief.maxLength = 4600;
  const honey = document.createElement('label');
  honey.className = 'inquiry-honeypot';
  honey.setAttribute('aria-hidden', 'true');
  honey.innerHTML = 'Leave empty<input name="botField" tabindex="-1" autocomplete="off">';
  form.append(honey);
  const verify = document.createElement('div');
  verify.className = 'inquiry-verification';
  verify.setAttribute('aria-label', 'Human verification');
  submit.before(verify);
  submit.disabled = true;
  const sitekey = import.meta.env.VITE_TURNSTILE_SITE_KEY || (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? '1x00000000000000000000AA' : '');
  const refresh = () => { submit.disabled = busy || !token; };
  const reset = () => { token = ''; if (widget !== null) window.turnstile?.reset(widget); refresh(); };
  const renderCaptcha = () => {
    if (disposed || widget !== null || !window.turnstile) return;
    widget = window.turnstile.render(verify, {
      sitekey, theme: 'light', size: matchMedia('(max-width:640px)').matches ? 'compact' : 'flexible',
      callback: value => { token = value; refresh(); },
      'expired-callback': () => { token = ''; refresh(); },
      'error-callback': () => { token = ''; refresh(); result.textContent = 'Verification could not load. Retry or contact us by email / WhatsApp.'; },
    });
  };
  const failed = () => { if (!disposed) result.textContent = 'Verification is unavailable. Please contact hengtuo@nthengtuo.com or WhatsApp.'; };
  let script = document.getElementById('cloudflare-turnstile-api');
  if (!sitekey) failed();
  else if (window.turnstile) renderCaptcha();
  else {
    if (!script) {
      script = document.createElement('script');
      script.id = 'cloudflare-turnstile-api';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      document.head.append(script);
    }
    script.addEventListener('load', renderCaptcha);
    script.addEventListener('error', failed);
  }
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (busy || !form.reportValidity() || !token) return;
    busy = true; refresh(); result.textContent = 'Sending your inquiry…';
    if (!validLeadEventId(submissionId)) submissionId = createLeadSubmissionId();
    try { sessionStorage.setItem(attemptKey, submissionId); } catch { /* memory fallback */ }
    const data = new FormData(form);
    const payload = {
      name: data.get('name'), email: data.get('email'), phone: data.get('phone'), companyName: data.get('company'),
      country: data.get('market'), product: category.selectedOptions[0].textContent,
      quantity: data.get('quantity'),
      message: `Request: ${form.elements.intent.selectedOptions[0].textContent}\nFormat: ${format.value || 'To be discussed'}\n${data.get('brief')}`,
      botField: data.get('botField'), captchaToken: token,
      source: 'storefront-contact', pageUrl: location.origin + location.pathname,
      submissionId,
    };
    try {
      const response = await fetch('/api/contact', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Unable to send. Please try again or contact our team directly.');
      if (disposed) return;
      result.textContent = data.message || 'Thank you. Your inquiry has been sent. Our team will contact you shortly.';
      result.dataset.status = 'success';
      const adsId = import.meta.env.VITE_GOOGLE_ADS_ID || 'AW-18346194096';
      const label = import.meta.env.VITE_GOOGLE_ADS_LEAD_LABEL || 'R6b4CJ6xyNUcELDpkqxE';
      window.gtag?.('event', 'conversion', {send_to:`${adsId}/${label}`});
      if (validLeadEventId(submissionId) && data.leadEventId === submissionId) pixel.lead(data);
      clearAttempt();
      form.reset(); syncFormats();
    } catch (error) {
      if (!disposed) { result.textContent = error.message; result.dataset.status = 'error'; }
    } finally {
      busy = false;
      if (!disposed) reset();
    }
  });
  return () => {
    disposed = true;
    script?.removeEventListener('load', renderCaptcha);
    script?.removeEventListener('error', failed);
    if (widget !== null) window.turnstile?.remove(widget);
  };
}
