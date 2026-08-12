import nodemailer from 'nodemailer';

const contactEmail = process.env.CONTACT_TO_EMAIL || 'hengtuo@nthengtuo.com';
const fromEmail = process.env.CONTACT_FROM_EMAIL;

function getSmtpToEmail() {
  return process.env.SMTP_TO_EMAIL || contactEmail;
}

function getSmtpFromEmail() {
  return process.env.SMTP_FROM_EMAIL || fromEmail || process.env.SMTP_USER;
}

function hasSmtpConfig() {
  return Boolean(
    process.env.SMTP_HOST
      && process.env.SMTP_USER
      && process.env.SMTP_PASS,
  );
}

function getSmtpTransporter() {
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = String(process.env.SMTP_SECURE || (port === 465 ? 'true' : 'false')).toLowerCase() === 'true';

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // NewNet's smtp.nthengtuo.com CNAME serves a global-mail.cn certificate.
    // Authentication remains enforced; disable only hostname verification.
    tls: {
      rejectUnauthorized: String(process.env.SMTP_TLS_REJECT_UNAUTHORIZED || 'false').toLowerCase() !== 'false',
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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

export async function sendEmail(inquiry) {
  const subject = inquiry.companyName
    ? `New Website Inquiry - ${inquiry.companyName}`
    : 'New Website Inquiry';
  const text = renderTextEmail(inquiry);
  const html = renderHtmlEmail(inquiry);

  if (hasSmtpConfig()) {
    try {
      const transporter = getSmtpTransporter();
      await transporter.sendMail({
        from: getSmtpFromEmail(),
        to: getSmtpToEmail(),
        replyTo: inquiry.email,
        subject,
        text,
        html,
      });
      return { ok: true, provider: 'smtp' };
    } catch (error) {
      console.error('SMTP inquiry email failed', error?.message || 'Unknown error');
    }
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || !fromEmail) {
    return { ok: false, status: 503 };
  }

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
      text,
      html,
    }),
  });

  if (!response.ok) {
    return { ok: false, status: response.status };
  }

  return { ok: true, provider: 'resend' };
}
