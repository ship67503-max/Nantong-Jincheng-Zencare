import { pbkdf2Sync, randomBytes, randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const recordRoot = path.join(process.cwd(), 'data', 'jcz-business-center', 'account');

function readBody(req) {
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body);
  }

  if (typeof req.body === 'string') {
    return Promise.resolve(req.body ? JSON.parse(req.body) : {});
  }

  return new Promise((resolve, reject) => {
    let raw = '';

    req.on('data', (chunk) => {
      raw += chunk;
    });

    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', reject);
  });
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('hex');

  return { salt, hash };
}

function safeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function buildRecord(req, body) {
  const email = safeEmail(body.email);
  const password = String(body.password || '');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Please enter a valid business email address.' };
  }

  if (password.length < 8) {
    return { error: 'Password must contain at least 8 characters.' };
  }

  const { salt, hash } = hashPassword(password);
  const id = randomUUID();
  const now = new Date().toISOString();

  return {
    record: {
      id,
      type: 'account',
      status: 'registered',
      authMethod: body.method || 'email-password',
      email,
      passwordHash: hash,
      passwordSalt: salt,
      source: body.source || '/sign-in',
      userAgent: req.headers['user-agent'] || '',
      ip: String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim(),
      createdAt: now,
      updatedAt: now,
    },
  };
}

async function sendToWebhook(record) {
  const webhookUrl = process.env.JCZ_BUSINESS_CENTER_WEBHOOK_URL;

  if (!webhookUrl) {
    return false;
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });

  return response.ok;
}

function writeLocalRecord(record) {
  fs.mkdirSync(recordRoot, { recursive: true });
  fs.writeFileSync(path.join(recordRoot, `${record.id}.json`), JSON.stringify(record, null, 2));
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
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const body = await readBody(req);
    const result = buildRecord(req, body);

    if (result.error) {
      res.status(400).json({ message: result.error });
      return;
    }

    const { record } = result;
    const savedByWebhook = await sendToWebhook(record).catch(() => false);

    if (!savedByWebhook && process.env.NODE_ENV !== 'production') {
      writeLocalRecord(record);
    }

    if (!savedByWebhook && process.env.NODE_ENV === 'production') {
      res.status(503).json({
        message: 'Account backend is not configured yet. Please contact our team by email.',
      });
      return;
    }

    res.status(200).json({
      ok: true,
      recordId: record.id,
      message: 'Account record received. It has been submitted to the business registration system.',
    });
  } catch {
    res.status(500).json({
      message: 'Unable to submit this account record. Please contact our team by email.',
    });
  }
}
