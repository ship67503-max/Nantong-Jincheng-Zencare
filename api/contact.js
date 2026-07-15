const contactEmail = process.env.CONTACT_TO_EMAIL || 'hengtuo@nthengtuo.com';
const fromEmail = process.env.CONTACT_FROM_EMAIL;
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
  product: 200,
  quantity: 100,
  message: 5000,
  pageUrl: 500,
  source: 120,
  website: 200,
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

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function buildInquiry(req, body) {
  const inquiry = {
    name: clean(body.name, fieldLimits.name),
    companyName: clean(body.companyName, fieldLimits.companyName),
    email: clean(body.email, fieldLimits.email).toLowerCase(),
    phone: clean(body.phone, fieldLimits.phone),
    country: clean(body.country, fieldLimits.country),
    product: clean(body.product, fieldLimits.product),
    quantity: clean(body.quantity, fieldLimits.quantity),
    message: clean(body.message, fieldLimits.message),
    pageUrl: clean(body.pageUrl, fieldLimits.pageUrl),
    source: clean(body.source, fieldLimits.source) || 'website',
    website: clean(body.website, fieldLimits.website),
    submittedAt: new Date().toISOString(),
    userAgent: clean(req.headers['user-agent'], 500),
    ip: getClientIp(req),
  };

  if (inquiry.website) {
    return { error: 'Unable to process this request.' };
  }

  if (!inquiry.name) {
    return { error: 'Please enter your name.' };
  }

  if (!inquiry.email || !isEmail(inquiry.email)) {
    return { error: 'Please enter a valid email address.' };
  }

  if (!inquiry.message) {
    return { error: 'Please enter your product requirement.' };
  }

  return { inquiry };
}

function renderTextEmail(inquiry) {
  return [
    'New Website Inquiry',
    '',
    `Name: ${inquiry.name}`,
    `Company Name: ${inquiry.companyName || '-'}`,
    `Email: ${inquiry.email}`,
    `Phone / WhatsApp: ${inquiry.phone || '-'}`,
    `Country: ${inquiry.country || '-'}`,
    `Product: ${inquiry.product || '-'}`,
    `Estimated Quantity: ${inquiry.quantity || '-'}`,
    '',
    'Message:',
    inquiry.message,
    '',
    `Page URL: ${inquiry.pageUrl || '-'}`,
    `Website Source: ${inquiry.source || '-'}`,
    `Browser: ${inquiry.userAgent || '-'}`,
    `Submission Time: ${inquiry.submittedAt}`,
  ].join('\n');
}

function renderHtmlEmail(inquiry) {
  const rows = [
    ['Name', inquiry.name],
    ['Company Name', inquiry.companyName || '-'],
    ['Email', inquiry.email],
    ['Phone / WhatsApp', inquiry.phone || '-'],
    ['Country', inquiry.country || '-'],
    ['Product', inquiry.product || '-'],
    ['Estimated Quantity', inquiry.quantity || '-'],
    ['Page URL', inquiry.pageUrl || '-'],
    ['Website Source', inquiry.source || '-'],
    ['Browser', inquiry.userAgent || '-'],
    ['Submission Time', inquiry.submittedAt],
  ];

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f6f8ef;font-family:Arial,Helvetica,sans-serif;color:#172019;">
    <div style="max-width:720px;margin:0 auto;padding:32px;">
      <div style="background:#ffffff;border:1px solid #dfe5d8;border-radius:18px;padding:28px;">
        <h1 style="margin:0 0 20px;font-size:24px;line-height:1.2;color:#123b2d;">New Website Inquiry</h1>
        <table style="width:100%;border-collapse:collapse;">
          ${rows.map(([label, value]) => `
            <tr>
              <td style="width:180px;padding:10px 0;border-bottom:1px solid #edf1e9;color:#607064;font-weight:700;">${escapeHtml(label)}</td>
              <td style="padding:10px 0;border-bottom:1px solid #edf1e9;color:#172019;">${escapeHtml(value)}</td>
            </tr>
          `).join('')}
        </table>
        <h2 style="margin:24px 0 10px;font-size:16px;color:#123b2d;">Message</h2>
        <div style="white-space:pre-wrap;background:#f6f8ef;border-radius:14px;padding:16px;line-height:1.7;">${escapeHtml(inquiry.message)}</div>
      </div>
    </div>
  </body>
</html>`;
}

async function sendWithResend(inquiry) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || !fromEmail) {
    return { ok: false, status: 503 };
  }

  const subject = inquiry.companyName
    ? `New Website Inquiry - ${inquiry.companyName}`
    : 'New Website Inquiry';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [contactEmail],
      reply_to: inquiry.email,
      subject,
      text: renderTextEmail(inquiry),
      html: renderHtmlEmail(inquiry),
    }),
  });

  if (!response.ok) {
    return { ok: false, status: response.status };
  }

  return { ok: true };
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

    const sent = await sendWithResend(result.inquiry);

    if (!sent.ok) {
      json(res, sent.status || 500, {
        message: 'Sorry, your inquiry could not be sent. Please try again or email us directly at hengtuo@nthengtuo.com.',
      });
      return;
    }

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
