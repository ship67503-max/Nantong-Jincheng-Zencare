import assert from 'node:assert/strict';
import http from 'node:http';
import { after, before, test } from 'node:test';
import { createContactHandler } from '../api/contact.js';

let baseUrl;
let server;
let sendCount = 0;

before(async () => {
  const handler = createContactHandler({
    sendEmailFn: async (inquiry) => {
      sendCount += 1;
      return {
        ok: true,
        deliveryConfirmed: true,
        provider: 'smtp-test',
        messageId: `<http-${inquiry.email}>`,
        accepted: ['sales3@nthengtuo.com'],
        rejected: [],
      };
    },
    verifyHumanFn: async () => ({ ok: true }),
    syncGoogleSheetsFn: async () => {},
    syncBusinessCenterFn: async () => {},
  });

  server = http.createServer((req, res) => {
    res.status = (statusCode) => {
      res.statusCode = statusCode;
      return res;
    };
    res.json = (payload) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(payload));
      return res;
    };
    handler(req, res);
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
});

const validInquiry = {
  name: 'HTTP INTEGRATION TEST',
  email: 'http-buyer@example.com',
  phone: '+1 555 0100',
  product: 'Disposable Pet Pads',
  captchaToken: 'test-token',
  submissionId: 'http-integration-submission',
};

test('POST /api/contact returns confirmed success and is idempotent over HTTP', async () => {
  const request = () => fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: baseUrl,
    },
    body: JSON.stringify(validInquiry),
  });

  const firstResponse = await request();
  const firstBody = await firstResponse.json();
  const secondResponse = await request();
  const secondBody = await secondResponse.json();

  assert.equal(firstResponse.status, 200);
  assert.equal(firstBody.success, true);
  assert.equal(firstBody.deliveryConfirmed, true);
  assert.equal(secondResponse.status, 200);
  assert.equal(secondBody.duplicate, true);
  assert.equal(sendCount, 1);
});

test('POST /api/contact returns a validation error over HTTP', async () => {
  const response = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...validInquiry, submissionId: 'invalid-http', email: 'invalid' }),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.success, false);
  assert.equal(body.message, 'Please enter a valid email address.');
});
