import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import nodemailer from 'nodemailer';
import { emailInternals, sendEmail } from '../services/email.js';

const envKeys = [
  'INQUIRY_TO_EMAIL',
  'SMTP_FROM_EMAIL',
  'CONTACT_FROM_EMAIL',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASS',
  'RESEND_API_KEY',
];
const originalCreateTransport = nodemailer.createTransport;
const originalFetch = globalThis.fetch;

const inquiry = {
  name: 'WEBSITE EMAIL TEST',
  companyName: 'Jincheng Zencare Internal Test',
  companyWebsite: 'https://buyer.example',
  jobRole: 'Purchasing Manager',
  email: 'buyer@example.com',
  phone: '+1 555 0100',
  country: 'United States',
  product: 'Disposable Pet Pads',
  quantity: '10000 pcs',
  message: 'Production inquiry email delivery test',
  pageUrl: 'https://www.jczcare.com/request-product-plan',
  submittedAt: '2026-08-12T08:00:00.000Z',
  leadSource: {
    first_touch: {
      utm_source: 'facebook',
      utm_medium: 'paid_social',
      utm_campaign: 'us_leads_pet_pads_2026q3',
      utm_content: 'reels_factory_v1',
      utm_term: 'pet_brand_owners',
      fbclid: 'facebook-click-id',
      landing_page: '/request-product-plan',
      referrer: 'https://www.facebook.com',
    },
    latest_touch: {
      utm_source: 'google',
      utm_medium: 'cpc',
      gclid: 'google-click-id',
      landing_page: '/contact',
      referrer: 'https://www.google.com',
    },
    first_visit_time: '2026-08-10T07:00:00.000Z',
    latest_visit_time: '2026-08-12T08:00:00.000Z',
  },
};

function configureSmtp() {
  process.env.INQUIRY_TO_EMAIL = 'sales3@nthengtuo.com';
  process.env.SMTP_FROM_EMAIL = 'hengtuo@nthengtuo.com';
  process.env.SMTP_HOST = 'smtp.global-mail.cn';
  process.env.SMTP_PORT = '465';
  process.env.SMTP_SECURE = 'true';
  process.env.SMTP_USER = 'hengtuo@nthengtuo.com';
  process.env.SMTP_PASS = 'test-only-password';
}

afterEach(() => {
  nodemailer.createTransport = originalCreateTransport;
  globalThis.fetch = originalFetch;
  for (const key of envKeys) delete process.env[key];
});

test('requires the server-only inquiry recipient', async () => {
  process.env.SMTP_FROM_EMAIL = 'hengtuo@nthengtuo.com';
  const result = await sendEmail(inquiry);
  assert.deepEqual(result, { ok: false, status: 500, code: 'EMAIL_CONFIG_MISSING' });
});

test('sends to sales3 and uses the customer address only as Reply-To', async () => {
  configureSmtp();
  let mailOptions;
  nodemailer.createTransport = () => ({
    sendMail: async (options) => {
      mailOptions = options;
      return {
        messageId: '<smtp-message-id@example>',
        accepted: ['sales3@nthengtuo.com'],
        rejected: [],
        response: '250 OK',
      };
    },
  });

  const result = await sendEmail(inquiry);

  assert.equal(result.ok, true);
  assert.equal(result.deliveryConfirmed, true);
  assert.equal(result.provider, 'smtp');
  assert.equal(result.messageId, '<smtp-message-id@example>');
  assert.equal(mailOptions.to, 'sales3@nthengtuo.com');
  assert.equal(mailOptions.from, 'hengtuo@nthengtuo.com');
  assert.equal(mailOptions.replyTo, 'buyer@example.com');
  assert.equal(
    mailOptions.subject,
    'New Website Inquiry \u2013 WEBSITE EMAIL TEST \u2013 Disposable Pet Pads',
  );
  assert.match(mailOptions.text, /Website: www\.jczcare\.com/);
  assert.match(mailOptions.html, /Production inquiry email delivery test/);
  assert.match(mailOptions.html, /https:\/\/buyer\.example/);
  assert.match(mailOptions.html, /Purchasing Manager/);
  assert.match(mailOptions.text, /Lead Source/);
  assert.match(mailOptions.text, /Facebook Click ID: facebook-click-id/);
  assert.match(mailOptions.text, /Google Click ID: google-click-id/);
  assert.match(mailOptions.html, /First Touch/);
  assert.match(mailOptions.html, /us_leads_pet_pads_2026q3/);
});

test('rejects a recipient configuration other than sales3', async () => {
  configureSmtp();
  process.env.INQUIRY_TO_EMAIL = 'hengtuo@nthengtuo.com';
  let sendCount = 0;
  nodemailer.createTransport = () => ({
    sendMail: async () => {
      sendCount += 1;
      return {};
    },
  });

  const result = await sendEmail(inquiry);

  assert.deepEqual(result, { ok: false, status: 500, code: 'EMAIL_CONFIG_MISSING' });
  assert.equal(sendCount, 0);
});

test('renders empty optional fields as Not provided', () => {
  const text = emailInternals.renderTextEmail({
    ...inquiry,
    companyName: '',
    country: '',
    quantity: '',
    message: '',
  });

  assert.match(text, /Company: Not provided/);
  assert.match(text, /Country: Not provided/);
  assert.match(text, /Estimated Quantity: Not provided/);
  assert.match(text, /Message:\nNot provided/);
});

test('returns failure when SMTP rejects the recipient', async () => {
  configureSmtp();
  nodemailer.createTransport = () => ({
    sendMail: async () => ({
      messageId: '<rejected@example>',
      accepted: [],
      rejected: ['sales3@nthengtuo.com'],
      response: '550 rejected',
    }),
  });

  const result = await sendEmail(inquiry);
  assert.deepEqual(result, { ok: false, status: 500, code: 'EMAIL_REJECTED' });
});

test('renders escaped customer content in HTML', () => {
  const html = emailInternals.renderHtmlEmail({
    ...inquiry,
    name: '<script>alert(1)</script>',
  });

  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
});

test('requires a Resend message ID before confirming delivery', async () => {
  process.env.INQUIRY_TO_EMAIL = 'sales3@nthengtuo.com';
  process.env.CONTACT_FROM_EMAIL = 'verified@example.com';
  process.env.RESEND_API_KEY = 'test-only-api-key';
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({}),
  });

  const result = await sendEmail(inquiry);

  assert.deepEqual(result, { ok: false, status: 500, code: 'RESEND_CONFIRMATION_MISSING' });
});

test('Resend sends to sales3 with the customer as Reply-To', async () => {
  process.env.INQUIRY_TO_EMAIL = 'sales3@nthengtuo.com';
  process.env.CONTACT_FROM_EMAIL = 'verified@example.com';
  process.env.RESEND_API_KEY = 'test-only-api-key';
  let requestBody;
  globalThis.fetch = async (url, options) => {
    requestBody = JSON.parse(options.body);
    return {
      ok: true,
      json: async () => ({ id: 'resend-message-id' }),
    };
  };

  const result = await sendEmail(inquiry);

  assert.equal(result.deliveryConfirmed, true);
  assert.equal(result.messageId, 'resend-message-id');
  assert.deepEqual(requestBody.to, ['sales3@nthengtuo.com']);
  assert.equal(requestBody.reply_to, 'buyer@example.com');
});
