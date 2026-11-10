import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  INQUIRY_FAILURE_MESSAGE,
  isInquiryResponseSuccessful,
  submitInquiry,
  validateInquiryFields,
} from '../src/inquirySubmission.js';

test('accepts only an HTTP success with explicit delivery confirmation', () => {
  assert.equal(isInquiryResponseSuccessful({ ok: true }, { success: true, deliveryConfirmed: true }), true);
  assert.equal(isInquiryResponseSuccessful({ ok: true }, { success: true }), false);
  assert.equal(isInquiryResponseSuccessful({ ok: true }, { success: false }), false);
  assert.equal(isInquiryResponseSuccessful({ ok: false }, { success: true }), false);
  assert.equal(isInquiryResponseSuccessful({ ok: true }, {}), false);
});

test('sends the idempotency key and returns only a confirmed response', async () => {
  let request;
  const result = await submitInquiry({ submissionId: 'submission-123' }, {
    fetchFn: async (url, options) => {
      request = { url, options };
      return {
        ok: true,
        status: 200,
        json: async () => ({ success: true, deliveryConfirmed: true }),
      };
    },
  });

  assert.equal(result.deliveryConfirmed, true);
  assert.equal(request.url, '/api/contact');
  assert.equal(request.options.headers['X-Inquiry-Idempotency-Key'], 'submission-123');
});

test('aborts a request that exceeds the client timeout', async () => {
  const fetchFn = async (url, options) => new Promise((resolve, reject) => {
    options.signal.addEventListener('abort', () => {
      const error = new Error('aborted');
      error.name = 'AbortError';
      reject(error);
    });
  });

  await assert.rejects(
    submitInquiry({ submissionId: 'timeout-test' }, { fetchFn, timeoutMs: 5 }),
    (error) => error.code === 'INQUIRY_TIMEOUT' && error.message === INQUIRY_FAILURE_MESSAGE,
  );
});

test('validates the four required inquiry fields', () => {
  assert.deepEqual(validateInquiryFields({}), {
    name: 'Please enter your name.',
    email: 'Please enter your work email.',
    phone: 'Please enter your phone or WhatsApp number.',
    product: 'Please select a product of interest.',
  });

  assert.deepEqual(validateInquiryFields({
    name: '  Buyer Name  ',
    email: 'buyer@example.com',
    phone: '+44 (0) 20 1234-5678',
    product: 'Disposable Pet Pads',
  }), {});
});

test('rejects invalid email and placeholder product values', () => {
  const errors = validateInquiryFields({
    name: 'Buyer',
    email: 'buyer-at-example',
    phone: '+1 555 0100',
    product: 'Select a product',
  });

  assert.equal(errors.email, 'Please enter a valid email address.');
  assert.equal(errors.product, 'Please select a product of interest.');
});
