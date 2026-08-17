import { sendEmail } from '../services/email.js';
import { appendInquiryToGoogleSheets } from '../services/googleSheets.js';
import { createHash } from 'node:crypto';

const maxBodyBytes = 20 * 1024;
const submitWindowMs = 60 * 1000;
const maxSubmissionsPerWindow = 3;
const recentSubmissions = new Map();
const submissionRetentionMs = 10 * 60 * 1000;
const completedSubmissions = new Map();
const inFlightSubmissions = new Set();
const successMessage = 'Thank you! Your inquiry has been sent successfully. Our team will contact you within 1 business day.';
const failureMessage = 'We couldn\u2019t send your inquiry. Please try again or contact us directly at sales3@nthengtuo.com.';
const secondarySyncTimeoutMs = 5000;

const fieldLimits = {
  name: 100,
  email: 200,
  companyName: 200,
  phone: 100,
  whatsapp: 100,
  country: 100,
  companyWebsite: 200,
  jobRole: 120,
  product: 200,
  productInterest: 200,
  quantity: 100,
  estimatedQuantity: 100,
  requiredSize: 160,
  packagingRequirement: 240,
  message: 5000,
  projectRequirements: 5000,
  pageUrl: 500,
  source: 120,
  botField: 200,
  captchaToken: 2048,
  submissionId: 100,
};

const leadSourceFieldLimits = {
  utm_source: 200,
  utm_medium: 200,
  utm_campaign: 200,
  utm_content: 200,
  utm_term: 200,
  fbclid: 500,
  gclid: 500,
  landing_page: 300,
  referrer: 300,
};

function json(res, status, payload) {
  res.status(status).json({ success: status >= 200 && status < 300, ...payload });
}

function isAllowedOrigin(origin, requestHost = '') {
  if (!origin) {
    return true;
  }

  try {
    const url = new URL(origin);
    const host = String(requestHost).split(':')[0].toLowerCase();
    const isProductionOrigin = url.protocol === 'https:'
      && (url.hostname === 'jczcare.com' || url.hostname === 'www.jczcare.com');
    const isSamePreviewOrigin = url.protocol === 'https:'
      && url.hostname.endsWith('.vercel.app')
      && url.hostname === host;
    const isSameLocalOrigin = url.protocol === 'http:'
      && /^(localhost|127\.0\.0\.1)$/.test(url.hostname)
      && url.hostname === host;

    return isProductionOrigin || isSamePreviewOrigin || isSameLocalOrigin;
  } catch {
    return false;
  }
}

function setCorsHeaders(req, res) {
  const origin = String(req.headers.origin || '');
  res.setHeader('Vary', 'Origin');

  if (origin && isAllowedOrigin(origin, req.headers.host)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Inquiry-Idempotency-Key');
}

function getClientIp(req) {
  return String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '')
    .split(',')[0]
    .trim() || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const bucket = recentSubmissions.get(ip)?.filter((timestamp) => now - timestamp < submitWindowMs) || [];

  if (bucket.length >= maxSubmissionsPerWindow) {
    recentSubmissions.set(ip, bucket);
    return true;
  }

  bucket.push(now);
  recentSubmissions.set(ip, bucket);
  return false;
}

function pruneSubmissionCache(now = Date.now()) {
  for (const [key, timestamp] of completedSubmissions) {
    if (now - timestamp > submissionRetentionMs) {
      completedSubmissions.delete(key);
    }
  }
}

function getSubmissionKey(inquiry, submissionId) {
  if (submissionId) {
    return `id:${submissionId}`;
  }

  const fingerprint = [
    inquiry.ip,
    inquiry.email,
    inquiry.phone,
    inquiry.product,
    inquiry.message,
  ].join('|');

  return `fingerprint:${createHash('sha256').update(fingerprint).digest('hex')}`;
}

async function settleWithTimeout(task, label) {
  let timer;

  try {
    await Promise.race([
      Promise.resolve().then(task),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out.`)), secondarySyncTimeoutMs);
      }),
    ]);
  } catch (error) {
    console.error(`${label} failed`, error?.message || 'Unknown error');
  } finally {
    clearTimeout(timer);
  }
}

function readBody(req) {
  const length = Number(req.headers['content-length'] || 0);

  if (length > maxBodyBytes) {
    const error = new Error('Request body is too large.');
    error.status = 413;
    return Promise.reject(error);
  }

  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body);
  }

  if (typeof req.body === 'string') {
    return Promise.resolve(parseBodyString(req, req.body));
  }

  return new Promise((resolve, reject) => {
    let raw = '';

    req.on('data', (chunk) => {
      raw += chunk;

      if (Buffer.byteLength(raw, 'utf8') > maxBodyBytes) {
        const error = new Error('Request body is too large.');
        error.status = 413;
        req.destroy(error);
      }
    });

    req.on('end', () => {
      try {
        resolve(parseBodyString(req, raw));
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', reject);
  });
}

function parseBodyString(req, raw) {
  if (!raw) {
    return {};
  }

  const contentType = String(req.headers['content-type'] || '').toLowerCase();

  if (contentType.includes('application/x-www-form-urlencoded')) {
    return Object.fromEntries(new URLSearchParams(raw));
  }

  return JSON.parse(raw);
}

function clean(value, limit) {
  return String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, limit);
}

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const emailLikePattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const phoneLikePattern = /(?:\+?\d[\s().-]*){7,}/;

function cleanLeadTouch(value) {
  const touch = value && typeof value === 'object' && !Array.isArray(value) ? value : {};

  return Object.fromEntries(
    Object.entries(leadSourceFieldLimits)
      .map(([field, limit]) => {
        const fieldValue = clean(touch[field], limit);
        const isClickId = field === 'fbclid' || field === 'gclid';
        return [
          field,
          !isClickId && (emailLikePattern.test(fieldValue) || phoneLikePattern.test(fieldValue))
            ? ''
            : fieldValue,
        ];
      })
      .filter(([, fieldValue]) => fieldValue),
  );
}

function cleanLeadSource(value) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const firstVisitTime = clean(source.first_visit_time, 40);
  const latestVisitTime = clean(source.latest_visit_time, 40);

  return {
    first_touch: cleanLeadTouch(source.first_touch),
    latest_touch: cleanLeadTouch(source.latest_touch),
    first_visit_time: Number.isNaN(Date.parse(firstVisitTime)) ? '' : firstVisitTime,
    latest_visit_time: Number.isNaN(Date.parse(latestVisitTime)) ? '' : latestVisitTime,
  };
}

function buildInquiry(req, body) {
  for (const [field, limit] of Object.entries(fieldLimits)) {
    if (String(body[field] || '').length > limit) {
      return { error: `The ${field} field is too long.` };
    }
  }

  const inquiry = {
    name: clean(body.name, fieldLimits.name),
    companyName: clean(body.companyName, fieldLimits.companyName),
    email: clean(body.email, fieldLimits.email).toLowerCase(),
    phone: clean(body.phone || body.whatsapp, fieldLimits.phone),
    country: clean(body.country, fieldLimits.country),
    companyWebsite: clean(body.companyWebsite, fieldLimits.companyWebsite),
    jobRole: clean(body.jobRole, fieldLimits.jobRole),
    product: clean(body.product || body.productInterest, fieldLimits.product),
    quantity: clean(body.quantity || body.estimatedQuantity, fieldLimits.quantity),
    requiredSize: clean(body.requiredSize, fieldLimits.requiredSize),
    packagingRequirement: clean(body.packagingRequirement, fieldLimits.packagingRequirement),
    message: clean(body.message || body.projectRequirements, fieldLimits.message),
    pageUrl: clean(body.pageUrl, fieldLimits.pageUrl),
    source: clean(body.source, fieldLimits.source) || 'website',
    leadSource: cleanLeadSource(body.leadSource),
    botField: clean(body.botField, fieldLimits.botField),
    submittedAt: new Date().toISOString(),
    userAgent: clean(req.headers['user-agent'], 500),
    ip: getClientIp(req),
  };

  if (inquiry.botField) {
    return { error: 'Unable to process this request.' };
  }

  if (!inquiry.name) {
    return { error: 'Please enter your name.' };
  }

  if (!inquiry.email) {
    return { error: 'Please enter your work email.' };
  }

  if (!isEmail(inquiry.email)) {
    return { error: 'Please enter a valid email address.' };
  }

  if (!inquiry.phone) {
    return { error: 'Please enter your phone or WhatsApp number.' };
  }

  if (!inquiry.product || inquiry.product.toLowerCase() === 'select a product') {
    return { error: 'Please select a product of interest.' };
  }

  return {
    inquiry,
    captchaToken: clean(body.captchaToken, fieldLimits.captchaToken),
    submissionId: clean(
      body.submissionId || req.headers['x-inquiry-idempotency-key'],
      fieldLimits.submissionId,
    ),
  };
}

async function verifyHuman(captchaToken, ip) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    return { ok: false, message: 'Human verification is not configured.' };
  }

  if (!captchaToken) {
    return { ok: false, message: 'Please complete the human verification.' };
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: captchaToken,
        remoteip: ip,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return { ok: false, message: 'Human verification could not be completed. Please try again.' };
    }

    const result = await response.json();
    return result.success
      ? { ok: true }
      : { ok: false, message: 'Human verification failed. Please try again.' };
  } catch {
    return { ok: false, message: 'Human verification could not be completed. Please try again.' };
  }
}

async function syncInquiryToGoogleSheets(inquiry) {
  try {
    await appendInquiryToGoogleSheets(inquiry);
  } catch (error) {
    console.error('Google Sheets append failed', error?.message || 'Unknown error');
  }
}

async function syncInquiryToBusinessCenter(inquiry) {
  const apiUrl = String(process.env.JCZ_BUSINESS_SHARED_API_URL || '').replace(/\/$/, '');
  const ingestToken = process.env.JCZ_BUSINESS_SHARED_INGEST_TOKEN;

  if (!apiUrl || !ingestToken) {
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/api/public/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-jcz-ingest-token': ingestToken,
      },
      body: JSON.stringify({
        name: inquiry.name,
        companyName: inquiry.companyName,
        email: inquiry.email,
        phone: inquiry.phone,
        country: inquiry.country,
        companyWebsite: inquiry.companyWebsite,
        jobRole: inquiry.jobRole,
        product: inquiry.product,
        quantity: inquiry.quantity,
        message: inquiry.message,
        pageUrl: inquiry.pageUrl,
        leadSource: inquiry.leadSource,
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('JCZ Business Center sync failed', error?.message || 'Unknown error');
  }
}

export function createContactHandler({
  sendEmailFn = sendEmail,
  verifyHumanFn = verifyHuman,
  syncGoogleSheetsFn = syncInquiryToGoogleSheets,
  syncBusinessCenterFn = syncInquiryToBusinessCenter,
} = {}) {
  return async function handler(req, res) {
    setCorsHeaders(req, res);

    if (!isAllowedOrigin(req.headers.origin, req.headers.host)) {
      json(res, 403, { message: 'Origin not allowed.' });
      return;
    }

    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    if (req.method !== 'POST') {
      json(res, 405, { message: 'Method not allowed' });
      return;
    }

    try {
      const body = await readBody(req);
      const result = buildInquiry(req, body);

      if (result.error) {
        json(res, 400, { message: result.error });
        return;
      }

      const ip = getClientIp(req);
      const submissionKey = getSubmissionKey(result.inquiry, result.submissionId);
      pruneSubmissionCache();

      if (completedSubmissions.has(submissionKey)) {
        json(res, 200, {
          deliveryConfirmed: true,
          duplicate: true,
          message: successMessage,
        });
        return;
      }

      if (inFlightSubmissions.has(submissionKey)) {
        json(res, 409, { message: 'This inquiry is already being processed.' });
        return;
      }

      if (isRateLimited(ip)) {
        json(res, 429, { message: 'Please wait a moment before submitting again.' });
        return;
      }

      inFlightSubmissions.add(submissionKey);

      try {
        const verification = await verifyHumanFn(result.captchaToken, ip);

        if (!verification.ok) {
          json(res, 400, { message: verification.message });
          return;
        }

        const sent = await sendEmailFn(result.inquiry);

        if (!sent.ok || sent.deliveryConfirmed !== true) {
          json(res, sent.status || 500, { message: failureMessage });
          return;
        }

        completedSubmissions.set(submissionKey, Date.now());

        console.info('Inquiry email accepted by provider', {
          provider: sent.provider,
          messageId: sent.messageId || null,
          accepted: sent.accepted || [],
          rejected: sent.rejected || [],
        });

        await Promise.all([
          settleWithTimeout(() => syncGoogleSheetsFn(result.inquiry), 'Google Sheets sync'),
          settleWithTimeout(() => syncBusinessCenterFn(result.inquiry), 'JCZ Business Center sync'),
        ]);

        json(res, 200, {
          deliveryConfirmed: true,
          message: successMessage,
        });
      } finally {
        inFlightSubmissions.delete(submissionKey);
      }
    } catch (error) {
      const status = error.status || 500;
      json(res, status, { message: failureMessage });
    }
  };
}

export const contactInternals = {
  buildInquiry,
  completedSubmissions,
  inFlightSubmissions,
  isAllowedOrigin,
  recentSubmissions,
};

export default createContactHandler();
