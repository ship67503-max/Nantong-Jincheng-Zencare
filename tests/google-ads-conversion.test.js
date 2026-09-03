import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  GOOGLE_ADS_SEND_TO,
  trackGoogleAdsConversion,
} from '../src/googleAdsConversion.js';

const createRuntime = () => {
  const calls = [];
  return {
    calls,
    windowObject: {
      gtag(...args) {
        calls.push(args);
      },
    },
  };
};

test('sends one conversion with only send_to for a confirmed submission', () => {
  const runtime = createRuntime();

  assert.equal(trackGoogleAdsConversion({
    submissionId: 'submission-123',
    windowObject: runtime.windowObject,
  }), true);
  assert.equal(trackGoogleAdsConversion({
    submissionId: 'submission-123',
    windowObject: runtime.windowObject,
  }), false);
  assert.deepEqual(runtime.calls, [[
    'event',
    'conversion',
    { send_to: GOOGLE_ADS_SEND_TO },
  ]]);
});

test('does not send without an existing Google Tag or submission ID', () => {
  const runtime = createRuntime();

  assert.equal(trackGoogleAdsConversion({
    submissionId: 'submission-123',
    windowObject: {},
  }), false);
  assert.equal(trackGoogleAdsConversion({
    windowObject: runtime.windowObject,
  }), false);
  assert.deepEqual(runtime.calls, []);
});
