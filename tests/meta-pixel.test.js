import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import {
  initializeMetaPixel,
  isMetaPixelEnabled,
  META_PIXEL_ID,
  trackMetaLead,
  trackMetaPageView,
} from '../src/metaPixel.js';

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
  sessionStorage = createStorage(),
} = {}) => {
  const elements = new Map();
  const appendedScripts = [];
  const debugCalls = [];
  const documentObject = {
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
  };
  const windowObject = {
    location: {
      hostname,
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
    sessionStorage,
    windowObject,
  };
};

const getPixelCalls = (runtime) => (
  (runtime.windowObject.fbq?.queue || []).map((entry) => Array.from(entry))
);

const pixelOptions = (runtime, extra = {}) => ({
  ...runtime,
  isProductionBuild: true,
  ...extra,
});

test('uses only the requested production Pixel ID', () => {
  assert.equal(META_PIXEL_ID, '1532666838061135');
  assert.equal(isMetaPixelEnabled({
    hostname: 'www.jczcare.com',
    isProductionBuild: true,
    pixelId: META_PIXEL_ID,
  }), true);
  assert.equal(isMetaPixelEnabled({
    hostname: 'preview.vercel.app',
    isProductionBuild: true,
    pixelId: META_PIXEL_ID,
  }), false);
});

test('includes the official no-script PageView fallback', async () => {
  const indexHtml = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(
    indexHtml,
    /https:\/\/www\.facebook\.com\/tr\?id=1532666838061135&amp;ev=PageView&amp;noscript=1/,
  );
});

test('loads one Meta script and initializes the production Pixel once', () => {
  const runtime = createRuntime();

  assert.ok(initializeMetaPixel(pixelOptions(runtime)));
  assert.ok(initializeMetaPixel(pixelOptions(runtime)));
  assert.equal(runtime.appendedScripts.length, 1);
  assert.equal(runtime.appendedScripts[0].src, 'https://connect.facebook.net/en_US/fbevents.js');
  assert.deepEqual(getPixelCalls(runtime), [['init', META_PIXEL_ID]]);
});

test('sends PageView once per real pathname without double-firing initial load', () => {
  const runtime = createRuntime({ pathname: '/contact' });

  assert.equal(trackMetaPageView(pixelOptions(runtime)), true);
  assert.equal(trackMetaPageView(pixelOptions(runtime)), false);
  runtime.windowObject.location.pathname = '/request-product-plan';
  assert.equal(trackMetaPageView(pixelOptions(runtime)), true);

  assert.deepEqual(
    getPixelCalls(runtime).filter(([command, name]) => command === 'track' && name === 'PageView'),
    [['track', 'PageView'], ['track', 'PageView']],
  );
});

test('disables local and preview traffic unless explicitly debugging', () => {
  for (const hostname of ['localhost', '127.0.0.1', 'preview.vercel.app']) {
    const runtime = createRuntime({ hostname });
    assert.equal(trackMetaPageView(pixelOptions(runtime)), false);
    assert.equal(runtime.windowObject.fbq, undefined);
  }

  const debugRuntime = createRuntime({ hostname: 'localhost', search: '?meta_debug=1' });
  assert.equal(trackMetaPageView(pixelOptions(debugRuntime, { isProductionBuild: false })), true);
});

test('requires a confirmed submission ID before a Lead can be tracked', () => {
  const runtime = createRuntime();

  assert.equal(trackMetaLead({ formName: 'website_contact_inquiry' }, pixelOptions(runtime)), false);
  assert.equal(runtime.windowObject.fbq, undefined);
});

test('deduplicates one confirmed Lead across rerenders and a page refresh', () => {
  const sessionStorage = createStorage();
  const runtime = createRuntime({ pathname: '/request-product-plan', sessionStorage });
  const lead = {
    formName: 'product_plan_inquiry',
    productInterest: 'Pet pads',
    isSampleRequest: true,
    submissionId: 'submission-123',
  };

  assert.equal(trackMetaLead(lead, pixelOptions(runtime)), true);
  assert.equal(trackMetaLead(lead, pixelOptions(runtime)), false);

  const refreshedRuntime = createRuntime({
    pathname: '/request-product-plan',
    sessionStorage,
  });
  assert.equal(trackMetaLead(lead, pixelOptions(refreshedRuntime)), false);

  assert.deepEqual(
    getPixelCalls(runtime).find(([command, name]) => command === 'track' && name === 'Lead'),
    ['track', 'Lead', {
      content_name: 'Sample Request',
      content_category: 'Pet pads',
      form_name: 'product_plan_inquiry',
      page_path: '/request-product-plan',
    }, { eventID: 'submission-123' }],
  );
});

test('allows a second real inquiry with a new submission ID', () => {
  const runtime = createRuntime();

  assert.equal(trackMetaLead({
    formName: 'website_contact_inquiry',
    submissionId: 'submission-first',
  }, pixelOptions(runtime)), true);
  assert.equal(trackMetaLead({
    formName: 'website_contact_inquiry',
    submissionId: 'submission-second',
  }, pixelOptions(runtime)), true);

  assert.equal(
    getPixelCalls(runtime).filter(([command, name]) => command === 'track' && name === 'Lead').length,
    2,
  );
});

test('drops PII-like values and never accepts arbitrary customer fields', () => {
  const runtime = createRuntime({ hostname: 'localhost', search: '?meta_debug=1' });

  assert.equal(trackMetaLead({
    formName: 'buyer@example.com',
    productInterest: '+86 189 6294 4556',
    submissionId: 'private-test-123',
    name: 'Private Buyer',
    message: 'Private inquiry',
  }, pixelOptions(runtime, { isProductionBuild: false })), true);

  assert.deepEqual(
    getPixelCalls(runtime).find(([command, name]) => command === 'track' && name === 'Lead'),
    ['track', 'Lead', {
      content_name: 'B2B Inquiry',
      page_path: '/',
    }, { eventID: 'private-test-123' }],
  );
  assert.deepEqual(runtime.debugCalls[0], [
    '[Meta Pixel debug]',
    'Lead',
    {
      content_name: 'B2B Inquiry',
      page_path: '/',
    },
  ]);
});

test('emits no Meta events other than PageView and Lead', () => {
  const runtime = createRuntime();
  trackMetaPageView(pixelOptions(runtime));
  trackMetaLead({
    formName: 'website_contact_inquiry',
    submissionId: 'submission-only-events',
  }, pixelOptions(runtime));

  const eventNames = getPixelCalls(runtime)
    .filter(([command]) => command === 'track' || command === 'trackCustom')
    .map(([, name]) => name);
  assert.deepEqual(eventNames, ['PageView', 'Lead']);
});
