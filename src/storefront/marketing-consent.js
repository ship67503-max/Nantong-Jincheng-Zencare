import { CONSENT_KEY, setMarketingConsent } from '../productionPixel.js';
import './marketing-consent.css';

export function initMarketingConsent() {
  if (document.getElementById('marketing-consent-panel')) return;
  const panel = document.createElement('section');
  panel.id = 'marketing-consent-panel';
  panel.className = 'marketing-consent-panel';
  panel.setAttribute('aria-label', 'Marketing cookie preferences');
  panel.innerHTML = '<p>With your permission, we use Meta marketing cookies to measure page visits, product views and successful inquiries. You can change your choice at any time. <a href="/privacy-policy">Privacy policy</a></p><div><button type="button" data-choice="denied">Reject marketing cookies</button><button type="button" data-choice="granted">Allow marketing cookies</button></div><p data-consent-error hidden>Your preference could not be saved. Marketing tracking remains disabled.</p>';
  const settings = document.createElement('button');
  settings.type = 'button';
  settings.className = 'marketing-consent-settings';
  settings.textContent = 'Cookie preferences';
  settings.setAttribute('aria-controls', panel.id);
  const show = visible => { panel.hidden = !visible; settings.setAttribute('aria-expanded', String(visible)); };
  settings.addEventListener('click', () => { show(panel.hidden); if (!panel.hidden) panel.querySelector('button').focus(); });
  panel.addEventListener('click', event => {
    const button = event.target.closest('[data-choice]');
    if (!button) return;
    if (setMarketingConsent(button.dataset.choice === 'granted')) { show(false); settings.focus(); }
    else panel.querySelector('[data-consent-error]').hidden = false;
  });
  document.body.append(panel, settings);
  let known = false;
  try { known = ['granted', 'denied'].includes(localStorage.getItem(CONSENT_KEY)); } catch { /* default denied */ }
  show(!known);
}
