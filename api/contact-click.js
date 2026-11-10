import { appendContactClickToGoogleSheets } from '../services/googleSheets.js';

const clean = (value, limit) => String(value || '')
  .replace(/[<>\u0000-\u001f\u007f]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, limit);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ ok: false }); return; }
  try {
    const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    const channel = body.channel === 'email' ? 'Email' : body.channel === 'whatsapp' ? 'WhatsApp' : '';
    if (!channel) { res.status(400).json({ ok: false }); return; }
    await appendContactClickToGoogleSheets({
      timestamp: new Date().toISOString(),
      channel,
      pageUrl: clean(body.pageUrl, 500),
      referrer: clean(body.referrer, 500),
      device: clean(body.device, 80),
      language: clean(body.language, 40),
      utmSource: clean(body.utmSource, 100),
      utmMedium: clean(body.utmMedium, 100),
      utmCampaign: clean(body.utmCampaign, 150),
      sessionId: clean(body.sessionId, 80),
    });
    res.status(204).end();
  } catch (error) {
    console.error('Contact click tracking failed:', error?.message || error);
    res.status(204).end();
  }
}
