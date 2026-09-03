import { sendEmail } from '../services/email.js';
import { appendInquiryToGoogleSheets } from '../services/googleSheets.js';

const maxBodyBytes = 20 * 1024;
const submitWindowMs = 60 * 1000;
const maxSubmissionsPerWindow = 3;
const recentSubmissions = new Map();

const fieldLimits = {
  name: 100,
  email: 200,
  companyName: 200,
  phone: 100,
  country: 100,
  companyWebsite: 200,
  product: 200,
  quantity: 100,
  requiredSize: 160,
  packagingRequirement: 240,
  message: 5000,
  pageUrl: 500,
  source: 120,
  botField: 200,
  captchaToken: 2048,
};

function json(res, status, payload) {
  res.status(status).json(payload);
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

function buildInquiry(req, body) {
  const inquiry = {
    name: clean(body.name, fieldLimits.name),
    companyName: clean(body.companyName, fieldLimits.companyName),
    email: clean(body.email, fieldLimits.email).toLowerCase(),
    phone: clean(body.phone, fieldLimits.phone),
    country: clean(body.country, fieldLimits.country),
    companyWebsite: clean(body.companyWebsite, fieldLimits.companyWebsite),
    product: clean(body.product, fieldLimits.product),
    quantity: clean(body.quantity, fieldLimits.quantity),
    requiredSize: clean(body.requiredSize, fieldLimits.requiredSize),
    packagingRequirement: clean(body.packagingRequirement, fieldLimits.packagingRequirement),
    message: clean(body.message, fieldLimits.message),
    pageUrl: clean(body.pageUrl, fieldLimits.pageUrl),
    source: clean(body.source, fieldLimits.source) || 'website',
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

  if (!inquiry.email || !isEmail(inquiry.email)) {
    return { error: 'Please enter a valid email address.' };
  }

  if (!inquiry.product) {
    return { error: 'Please select a product.' };
  }

  if (!inquiry.message) {
    inquiry.message = `Product interest: ${inquiry.product}. Please contact me about OEM/ODM cooperation.`;
  }

  return {
    inquiry,
    captchaToken: clean(body.captchaToken, fieldLimits.captchaToken),
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
        product: inquiry.product,
        quantity: inquiry.quantity,
        message: inquiry.message,
        pageUrl: inquiry.pageUrl,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('JCZ Business Center sync failed', error?.message || 'Unknown error');
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    json(res, 405, { message: 'Method not allowed' });
    return;
  }

  try {
    const ip = getClientIp(req);

    if (isRateLimited(ip)) {
      json(res, 429, { message: 'Please wait a moment before submitting again.' });
      return;
    }

    const body = await readBody(req);
    const result = buildInquiry(req, body);

    if (result.error) {
      json(res, 400, { message: result.error });
      return;
    }

    const verification = await verifyHuman(result.captchaToken, ip);

    if (!verification.ok) {
      json(res, 400, { message: verification.message });
      return;
    }

    const sent = await sendEmail(result.inquiry);

    if (!sent.ok) {
      json(res, sent.status || 500, {
        message: 'Sorry, your inquiry could not be sent. Please try again or email us directly at hengtuo@nthengtuo.com.',
      });
      return;
    }

    await Promise.all([
      syncInquiryToGoogleSheets(result.inquiry),
      syncInquiryToBusinessCenter(result.inquiry),
    ]);

    json(res, 200, {
      ok: true,
      message: 'Thank you. Your inquiry has been sent successfully. We will contact you shortly.',
    });
  } catch (error) {
    const status = error.status || 500;
    json(res, status, {
      message: 'Sorry, your inquiry could not be sent. Please try again or email us directly at hengtuo@nthengtuo.com.',
    });
  }
}
