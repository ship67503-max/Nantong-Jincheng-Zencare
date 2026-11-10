import assert from 'node:assert/strict';
import { test } from 'node:test';
import { captureLeadAttribution, getLeadAttribution } from '../src/leadAttribution.js';

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
  pathname = '/',
  search = '',
  referrer = '',
  localStorage = createStorage(),
  sessionStorage = createStorage(),
} = {}) => ({
  windowObject: {
    location: {
      hostname: 'www.jczcare.com',
      pathname,
      search,
    },
    localStorage,
    sessionStorage,
  },
  documentObject: { referrer },
});

test('captures every required field on the first visit', () => {
  const runtime = createRuntime({
    pathname: '/request-product-plan',
    search: '?utm_source=facebook&utm_medium=paid_social&utm_campaign=us_leads&utm_content=reels_v1&utm_term=buyers&fbclid=fb-click&gclid=g-click',
    referrer: 'https://www.facebook.com/reel/123?private=value',
  });
  const result = captureLeadAttribution({
    ...runtime,
    now: new Date('2026-08-13T08:00:00.000Z'),
  });

  assert.deepEqual(result, {
    first_touch: {
      utm_source: 'facebook',
      utm_medium: 'paid_social',
      utm_campaign: 'us_leads',
      utm_content: 'reels_v1',
      utm_term: 'buyers',
      fbclid: 'fb-click',
      gclid: 'g-click',
      landing_page: '/request-product-plan',
      referrer: 'https://www.facebook.com',
    },
    latest_touch: {
      utm_source: 'facebook',
      utm_medium: 'paid_social',
      utm_campaign: 'us_leads',
      utm_content: 'reels_v1',
      utm_term: 'buyers',
      fbclid: 'fb-click',
      gclid: 'g-click',
      landing_page: '/request-product-plan',
      referrer: 'https://www.facebook.com',
    },
    first_visit_time: '2026-08-13T08:00:00.000Z',
    latest_visit_time: '2026-08-13T08:00:00.000Z',
  });
});

test('internal navigation does not overwrite first or latest attribution', () => {
  const localStorage = createStorage();
  const sessionStorage = createStorage();
  const landingRuntime = createRuntime({
    pathname: '/contact',
    search: '?utm_source=google&utm_medium=cpc&gclid=google-click',
    localStorage,
    sessionStorage,
  });
  const first = captureLeadAttribution({
    ...landingRuntime,
    now: new Date('2026-08-13T08:00:00.000Z'),
  });

  const internalRuntime = createRuntime({
    pathname: '/factory',
    referrer: 'https://www.jczcare.com/contact?utm_source=private@example.com',
    localStorage,
    sessionStorage,
  });
  const later = captureLeadAttribution({
    ...internalRuntime,
    now: new Date('2026-08-13T08:10:00.000Z'),
  });

  assert.deepEqual(later, first);
  assert.deepEqual(getLeadAttribution(internalRuntime), first);
});

test('a new browser session updates latest touch but preserves first touch', () => {
  const localStorage = createStorage();
  const firstRuntime = createRuntime({
    pathname: '/contact',
    search: '?utm_source=facebook&utm_medium=paid_social&fbclid=first-click',
    localStorage,
  });
  const first = captureLeadAttribution({
    ...firstRuntime,
    now: new Date('2026-08-13T08:00:00.000Z'),
  });

  const returnRuntime = createRuntime({
    pathname: '/request-product-plan',
    search: '?utm_source=youtube&utm_medium=paid_video&utm_campaign=returning&gclid=latest-click',
    referrer: 'https://www.youtube.com/watch?v=public',
    localStorage,
    sessionStorage: createStorage(),
  });
  const returned = captureLeadAttribution({
    ...returnRuntime,
    now: new Date('2026-08-14T09:00:00.000Z'),
  });

  assert.deepEqual(returned.first_touch, first.first_touch);
  assert.equal(returned.first_visit_time, first.first_visit_time);
  assert.deepEqual(returned.latest_touch, {
    utm_source: 'youtube',
    utm_medium: 'paid_video',
    utm_campaign: 'returning',
    gclid: 'latest-click',
    landing_page: '/request-product-plan',
    referrer: 'https://www.youtube.com',
  });
  assert.equal(returned.latest_visit_time, '2026-08-14T09:00:00.000Z');
});

test('drops PII-like campaign values and stores referrer origin only', () => {
  const runtime = createRuntime({
    search: '?utm_source=buyer@example.com&utm_campaign=%2B1%20555%20123%204567&utm_content=safe_creative',
    referrer: 'https://example.com/private/path?email=buyer@example.com',
  });
  const result = captureLeadAttribution(runtime);

  assert.equal(result.first_touch.utm_source, undefined);
  assert.equal(result.first_touch.utm_campaign, undefined);
  assert.equal(result.first_touch.utm_content, 'safe_creative');
  assert.equal(result.first_touch.referrer, 'https://example.com');
});
