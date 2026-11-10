import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  GA_MEASUREMENT_ID,
  captureTrafficAttribution,
  getContactEventName,
  installContactClickTracking,
  isAnalyticsEnabled,
  trackB2BEvent,
  trackFormStart,
  trackPageView,
} from '../src/analytics.js';

const createStorage = () => {
  const values = new Map();
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
  };
};

const createRuntime = ({
  hostname = 'www.jczcare.com',
  pathname = '/',
  search = '',
  title = 'JCZCARE',
  referrer = '',
  sessionStorage = createStorage(),
} = {}) => {
  const elements = new Map();
  const listeners = new Map();
  const appendedScripts = [];
  const debugCalls = [];
  const documentObject = {
    title,
    referrer,
    head: {
      appendChild(element) {
        elements.set(element.id, element);
        appendedScripts.push(element);
      },
    },
    createElement(tagName) {
      return { tagName };
    },
    getElementById(id) {
      return elements.get(id) || null;
    },
    addEventListener(name, listener) {
      listeners.set(name, listener);
    },
    removeEventListener(name, listener) {
      if (listeners.get(name) === listener) {
        listeners.delete(name);
      }
    },
  };
  const windowObject = {
    location: {
      hostname,
      origin: `https://${hostname}`,
      pathname,
      search,
    },
    sessionStorage,
    console: {
      debug(...args) {
        debugCalls.push(args);
      },
    },
  };

  return {
    appendedScripts,
    debugCalls,
    documentObject,
    listeners,
    sessionStorage,
    windowObject,
  };
};

const getEventCalls = (runtime, eventName) => (
  (runtime.windowObject.dataLayer || [])
    .map((entry) => Array.from(entry))
    .filter(([command, name]) => command === 'event' && name === eventName)
);

test('enables GA4 only on the production domains by default', () => {
  assert.equal(isAnalyticsEnabled({ hostname: 'www.jczcare.com', isProductionBuild: true }), true);
  assert.equal(isAnalyticsEnabled({ hostname: 'jczcare.com', isProductionBuild: true }), true);
  assert.equal(isAnalyticsEnabled({ hostname: 'localhost', isProductionBuild: false }), false);
  assert.equal(isAnalyticsEnabled({ hostname: 'project.vercel.app', isProductionBuild: true }), false);
});

test('sends one explicit page_view and disables the automatic page view', () => {
  const runtime = createRuntime();

  assert.equal(trackPageView({ ...runtime, isProductionBuild: true }), true);
  assert.equal(trackPageView({ ...runtime, isProductionBuild: true }), false);
  assert.equal(runtime.appendedScripts.length, 1);
  assert.equal(runtime.appendedScripts[0].src, `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);

  const calls = runtime.windowObject.dataLayer.map((entry) => Array.from(entry));
  const configCall = calls.find(([command]) => command === 'config');
  const pageViewCalls = getEventCalls(runtime, 'page_view');

  assert.deepEqual(configCall.slice(0, 2), ['config', GA_MEASUREMENT_ID]);
  assert.equal(configCall[2].send_page_view, false);
  assert.equal(pageViewCalls.length, 1);
  assert.equal(pageViewCalls[0][2].page_path, '/');
  assert.equal(pageViewCalls[0][2].page_title, 'JCZCARE');
});

test('does not load Google tag or send data on local and Vercel preview hosts', () => {
  for (const hostname of ['localhost', '127.0.0.1', 'project-git-feature-team.vercel.app']) {
    const runtime = createRuntime({ hostname });
    assert.equal(trackPageView({ ...runtime, isProductionBuild: true }), false);
    assert.equal(trackB2BEvent('generate_lead', {}, { ...runtime, isProductionBuild: true }), false);
    assert.equal(runtime.appendedScripts.length, 0);
    assert.equal(runtime.windowObject.dataLayer, undefined);
  }
});

test('the explicit ga_debug parameter permits marked, sanitized DebugView events', () => {
  const runtime = createRuntime({ hostname: 'localhost', search: '?ga_debug=1' });

  assert.equal(trackPageView({ ...runtime, isProductionBuild: false }), true);
  assert.equal(trackB2BEvent('form_error', {
    form_name: 'website_contact_inquiry',
    product_interest: 'Pet pads',
    email: 'buyer@example.com',
    phone: '+1 555 123 4567',
    message: 'Private message',
  }, { ...runtime, isProductionBuild: false }), true);

  const pageView = getEventCalls(runtime, 'page_view')[0];
  const formError = getEventCalls(runtime, 'form_error')[0];
  assert.equal(pageView[2].debug_mode, true);
  assert.equal(formError[2].debug_mode, true);
  assert.deepEqual(formError[2], {
    form_name: 'website_contact_inquiry',
    page_path: '/',
    product_interest: 'Pet pads',
    traffic_source: '(direct)',
    debug_mode: true,
  });
  assert.deepEqual(runtime.debugCalls[0], [
    '[GA4 debug]',
    'form_error',
    {
      form_name: 'website_contact_inquiry',
      page_path: '/',
      product_interest: 'Pet pads',
      traffic_source: '(direct)',
    },
  ]);
});

test('a new route can send once while repeat renders remain deduplicated', () => {
  const runtime = createRuntime({ pathname: '/products' });

  assert.equal(trackPageView({ ...runtime, isProductionBuild: true }), true);
  runtime.windowObject.location.pathname = '/factory';
  runtime.documentObject.title = 'Factory | JCZCARE';
  assert.equal(trackPageView({ ...runtime, isProductionBuild: true }), true);
  assert.equal(trackPageView({ ...runtime, isProductionBuild: true }), false);

  assert.deepEqual(
    getEventCalls(runtime, 'page_view').map((call) => call[2].page_path),
    ['/products', '/factory'],
  );
});

test('preserves UTM attribution for later SPA events in the same session', () => {
  const sessionStorage = createStorage();
  const landingRuntime = createRuntime({
    pathname: '/contact',
    search: '?utm_source=linkedin&utm_campaign=oem_launch&utm_content=buyer_ad',
    sessionStorage,
  });
  const attribution = captureTrafficAttribution({
    location: landingRuntime.windowObject.location,
    documentObject: landingRuntime.documentObject,
    sessionStorage,
  });
  assert.equal(attribution.utm_source, 'linkedin');

  const laterRuntime = createRuntime({ pathname: '/request-product-plan', sessionStorage });
  assert.equal(trackB2BEvent('generate_lead', {
    form_name: 'product_plan_inquiry',
  }, { ...laterRuntime, isProductionBuild: true }), true);

  assert.deepEqual(getEventCalls(laterRuntime, 'generate_lead')[0][2], {
    form_name: 'product_plan_inquiry',
    page_path: '/request-product-plan',
    traffic_source: 'linkedin',
    campaign: 'oem_launch',
    content: 'buyer_ad',
  });
});

test('allows only approved event names and non-PII parameters', () => {
  const runtime = createRuntime();

  assert.equal(trackB2BEvent('purchase', {}, { ...runtime, isProductionBuild: true }), false);
  assert.equal(trackB2BEvent('generate_lead', {
    form_name: 'website_contact_inquiry',
    product_interest: 'buyer@example.com',
    country: '+86 189 6294 4556',
    customer_name: 'Private Buyer',
    message: 'Do not upload this',
  }, { ...runtime, isProductionBuild: true }), true);

  assert.deepEqual(getEventCalls(runtime, 'generate_lead')[0][2], {
    form_name: 'website_contact_inquiry',
    page_path: '/',
    traffic_source: '(direct)',
  });
});

test('tracks form_start once per form and session', () => {
  const sessionStorage = createStorage();
  const runtime = createRuntime({ sessionStorage });

  assert.equal(trackFormStart('website_contact_inquiry', {}, { ...runtime, isProductionBuild: true }), true);
  assert.equal(trackFormStart('website_contact_inquiry', {}, { ...runtime, isProductionBuild: true }), false);
  assert.equal(getEventCalls(runtime, 'form_start').length, 1);

  const reloadedRuntime = createRuntime({ sessionStorage });
  assert.equal(trackFormStart('website_contact_inquiry', {}, { ...reloadedRuntime, isProductionBuild: true }), false);
  assert.equal(trackFormStart('product_plan_inquiry', {}, { ...reloadedRuntime, isProductionBuild: true }), true);
});

test('deduplicates conversion events by event name and submission ID', () => {
  const runtime = createRuntime();
  const options = { ...runtime, isProductionBuild: true, dedupeKey: 'submission-123' };

  assert.equal(trackB2BEvent('generate_lead', {}, options), true);
  assert.equal(trackB2BEvent('generate_lead', {}, options), false);
  assert.equal(trackB2BEvent('form_submit_success', {}, options), true);
  assert.equal(getEventCalls(runtime, 'generate_lead').length, 1);
  assert.equal(getEventCalls(runtime, 'form_submit_success').length, 1);
});

test('classifies contact links and installs one removable delegated listener', () => {
  assert.equal(getContactEventName('mailto:sales@example.com'), 'contact_email');
  assert.equal(getContactEventName('https://wa.me/861234567890'), 'contact_whatsapp');
  assert.equal(getContactEventName('https://api.whatsapp.com/send?phone=861234567890'), 'contact_whatsapp');
  assert.equal(getContactEventName('https://example.com/contact'), null);

  const runtime = createRuntime();
  const removeListener = installContactClickTracking({ ...runtime, isProductionBuild: true });
  const clickListener = runtime.listeners.get('click');
  const link = { href: 'mailto:sales@example.com' };
  clickListener({ target: { closest: () => link } });
  assert.equal(getEventCalls(runtime, 'contact_email').length, 1);

  removeListener();
  assert.equal(runtime.listeners.has('click'), false);
});
