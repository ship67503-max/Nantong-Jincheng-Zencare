import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { contactInternals, createContactHandler } from '../api/contact.js';

function createRequest(body, ip = '203.0.113.10') {
  return {
    method: 'POST',
    body,
    headers: {
      'x-forwarded-for': ip,
      'user-agent': 'node-test',
    },
    socket: {},
  };
}

function createResponse() {
  return {
    headers: {},
    statusCode: 200,
    body: null,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    end() {},
  };
}

function validBody(overrides = {}) {
  return {
    name: 'WEBSITE EMAIL TEST',
    email: 'buyer@example.com',
    phone: '+1 (555) 010-1000',
    product: 'Disposable Pet Pads',
    captchaToken: 'verified-token',
    botField: '',
    ...overrides,
  };
}

function testHandler(sendEmailFn = async () => ({
  ok: true,
  deliveryConfirmed: true,
  provider: 'smtp',
  messageId: '<test@example>',
  accepted: ['sales3@nthengtuo.com'],
  rejected: [],
})) {
  return createContactHandler({
    sendEmailFn,
    verifyHumanFn: async () => ({ ok: true }),
    syncGoogleSheetsFn: async () => {},
    syncBusinessCenterFn: async () => {},
  });
}

beforeEach(() => {
  contactInternals.completedSubmissions.clear();
  contactInternals.inFlightSubmissions.clear();
  contactInternals.recentSubmissions.clear();
});

test('returns success only after the email provider accepts the inquiry', async () => {
  let receivedInquiry;
  const handler = testHandler(async (value) => {
    receivedInquiry = value;
    return {
      ok: true,
      deliveryConfirmed: true,
      provider: 'smtp',
      messageId: '<test@example>',
      accepted: ['sales3@nthengtuo.com'],
      rejected: [],
    };
  });
  const response = createResponse();

  await handler(createRequest(validBody()), response);

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, {
    success: true,
    deliveryConfirmed: true,
    message: 'Thank you! Your inquiry has been sent successfully. Our team will contact you within 1 business day.',
  });
  assert.equal(receivedInquiry.email, 'buyer@example.com');
  assert.equal(receivedInquiry.product, 'Disposable Pet Pads');
});

test('rejects a missing required field without sending email', async () => {
  let sendCount = 0;
  const handler = testHandler(async () => {
    sendCount += 1;
    return { ok: true };
  });
  const response = createResponse();

  await handler(createRequest(validBody({ name: '' })), response);

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.success, false);
  assert.equal(sendCount, 0);
});

test('rejects browser requests from an unrelated origin', async () => {
  const request = createRequest(validBody());
  request.headers.origin = 'https://attacker.example';
  const response = createResponse();

  await testHandler()(request, response);

  assert.equal(response.statusCode, 403);
  assert.equal(response.body.success, false);
  assert.equal(response.headers['Access-Control-Allow-Origin'], undefined);
});

test('allows production, preview, and local browser origins', () => {
  assert.equal(contactInternals.isAllowedOrigin('https://www.jczcare.com', 'www.jczcare.com'), true);
  assert.equal(contactInternals.isAllowedOrigin('https://project-git-main-team.vercel.app', 'project-git-main-team.vercel.app'), true);
  assert.equal(contactInternals.isAllowedOrigin('http://localhost:5173', 'localhost:3000'), true);
  assert.equal(contactInternals.isAllowedOrigin('http://127.0.0.1:5173', '127.0.0.1:3000'), true);
  assert.equal(contactInternals.isAllowedOrigin('https://other-project.vercel.app', 'project-git-main-team.vercel.app'), false);
  assert.equal(contactInternals.isAllowedOrigin('https://example.com', 'www.jczcare.com'), false);
});

test('rejects an invalid customer email', async () => {
  const response = createResponse();
  await testHandler()(createRequest(validBody({ email: 'invalid' })), response);
  assert.equal(response.statusCode, 400);
  assert.equal(response.body.success, false);
});

test('rejects a missing phone or WhatsApp number', async () => {
  const response = createResponse();
  await testHandler()(createRequest(validBody({ phone: '   ' })), response);
  assert.equal(response.statusCode, 400);
  assert.equal(response.body.success, false);
});

test('accepts an inquiry when every optional field is blank', async () => {
  const response = createResponse();
  await testHandler()(createRequest(validBody({
    companyName: '',
    country: '',
    quantity: '',
    message: '',
  })), response);
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
});

test('rejects a missing or placeholder product interest', async () => {
  for (const product of ['', 'Select a product']) {
    const response = createResponse();
    await testHandler()(createRequest(validBody({ product })), response);
    assert.equal(response.statusCode, 400);
    assert.equal(response.body.success, false);
  }
});

test('returns 500 when the email provider fails', async () => {
  const response = createResponse();
  await testHandler(async () => ({ ok: false, status: 500 }))(
    createRequest(validBody()),
    response,
  );
  assert.equal(response.statusCode, 500);
  assert.equal(response.body.success, false);
});

test('does not report success when a provider returns ok without delivery confirmation', async () => {
  const response = createResponse();
  await testHandler(async () => ({ ok: true }))(
    createRequest(validBody()),
    response,
  );

  assert.equal(response.statusCode, 500);
  assert.deepEqual(response.body, {
    success: false,
    message: 'We couldn\u2019t send your inquiry. Please try again or contact us directly at sales3@nthengtuo.com.',
  });
});

test('passes all required and recommended fields to the mail service', async () => {
  let receivedInquiry;
  const response = createResponse();
  await testHandler(async (inquiry) => {
    receivedInquiry = inquiry;
    return { ok: true, deliveryConfirmed: true, provider: 'smtp' };
  })(createRequest(validBody({
    companyName: 'Buyer Co',
    companyWebsite: 'https://buyer.example',
    jobRole: 'Purchasing Manager',
    country: 'United States',
    quantity: '10000 pcs',
    message: 'Sample request',
  })), response);

  assert.equal(response.statusCode, 200);
  assert.deepEqual({
    name: receivedInquiry.name,
    email: receivedInquiry.email,
    phone: receivedInquiry.phone,
    product: receivedInquiry.product,
    companyName: receivedInquiry.companyName,
    companyWebsite: receivedInquiry.companyWebsite,
    jobRole: receivedInquiry.jobRole,
    country: receivedInquiry.country,
    quantity: receivedInquiry.quantity,
    message: receivedInquiry.message,
  }, {
    name: 'WEBSITE EMAIL TEST',
    email: 'buyer@example.com',
    phone: '+1 (555) 010-1000',
    product: 'Disposable Pet Pads',
    companyName: 'Buyer Co',
    companyWebsite: 'https://buyer.example',
    jobRole: 'Purchasing Manager',
    country: 'United States',
    quantity: '10000 pcs',
    message: 'Sample request',
  });
});

test('sanitizes and passes first-touch and latest-touch lead attribution', async () => {
  let receivedInquiry;
  const response = createResponse();
  await testHandler(async (inquiry) => {
    receivedInquiry = inquiry;
    return { ok: true, deliveryConfirmed: true, provider: 'smtp' };
  })(createRequest(validBody({
    leadSource: {
      first_touch: {
        utm_source: 'facebook',
        utm_medium: 'paid_social',
        fbclid: 'fb-click-id',
        landing_page: '/contact',
        referrer: 'https://www.facebook.com',
        customer_email: 'must-not-pass@example.com',
      },
      latest_touch: {
        utm_source: 'buyer@example.com',
        utm_campaign: 'returning_campaign',
        gclid: 'google-click-id',
        landing_page: '/request-product-plan',
        referrer: 'https://www.google.com',
      },
      first_visit_time: '2026-08-13T08:00:00.000Z',
      latest_visit_time: '2026-08-14T09:00:00.000Z',
      arbitrary: 'must-not-pass',
    },
  })), response);

  assert.deepEqual(receivedInquiry.leadSource, {
    first_touch: {
      utm_source: 'facebook',
      utm_medium: 'paid_social',
      fbclid: 'fb-click-id',
      landing_page: '/contact',
      referrer: 'https://www.facebook.com',
    },
    latest_touch: {
      utm_campaign: 'returning_campaign',
      gclid: 'google-click-id',
      landing_page: '/request-product-plan',
      referrer: 'https://www.google.com',
    },
    first_visit_time: '2026-08-13T08:00:00.000Z',
    latest_visit_time: '2026-08-14T09:00:00.000Z',
  });
});

test('reuses a confirmed idempotent result without sending a second email', async () => {
  let sendCount = 0;
  const handler = testHandler(async () => {
    sendCount += 1;
    return { ok: true, deliveryConfirmed: true, provider: 'smtp' };
  });
  const body = validBody({ submissionId: 'same-submission-id' });
  const firstResponse = createResponse();
  const secondResponse = createResponse();

  await handler(createRequest(body), firstResponse);
  await handler(createRequest(body), secondResponse);

  assert.equal(firstResponse.statusCode, 200);
  assert.equal(secondResponse.statusCode, 200);
  assert.equal(secondResponse.body.duplicate, true);
  assert.equal(secondResponse.body.deliveryConfirmed, true);
  assert.equal(sendCount, 1);
});

test('rejects overlong fields instead of silently truncating them', async () => {
  const response = createResponse();
  await testHandler()(createRequest(validBody({ name: 'x'.repeat(101) })), response);
  assert.equal(response.statusCode, 400);
  assert.match(response.body.message, /too long/i);
});

test('rate limits repeated submissions from the same address', async () => {
  const handler = testHandler();
  const statuses = [];

  for (let index = 0; index < 4; index += 1) {
    const response = createResponse();
    await handler(createRequest(validBody({ submissionId: `rate-limit-${index}` }), '198.51.100.8'), response);
    statuses.push(response.statusCode);
  }

  assert.deepEqual(statuses, [200, 200, 200, 429]);
});
