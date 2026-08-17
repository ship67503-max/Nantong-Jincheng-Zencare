import nodemailer from 'nodemailer';

export const REQUIRED_INQUIRY_RECIPIENT = 'sales3@nthengtuo.com';

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
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
}

function getEmailConfig() {
  return {
    recipient: String(process.env.INQUIRY_TO_EMAIL || '').trim().toLowerCase(),
    sender: String(
      process.env.SMTP_FROM_EMAIL
        || process.env.CONTACT_FROM_EMAIL
        || process.env.SMTP_USER
        || '',
    ).trim(),
  };
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const leadSourceLabels = {
  utm_source: 'UTM Source',
  utm_medium: 'UTM Medium',
  utm_campaign: 'UTM Campaign',
  utm_content: 'UTM Content',
  utm_term: 'UTM Term',
  fbclid: 'Facebook Click ID',
  gclid: 'Google Click ID',
  landing_page: 'Landing Page',
  referrer: 'Referrer',
};

function renderLeadTouchText(label, touch = {}) {
  return [
    `${label}:`,
    ...Object.entries(leadSourceLabels)
      .map(([field, fieldLabel]) => `  ${fieldLabel}: ${touch[field] || 'Not provided'}`),
  ].join('\n');
}

function renderLeadSourceText(leadSource = {}) {
  return [
    'Lead Source',
    `First Visit Time: ${leadSource.first_visit_time || 'Not provided'}`,
    renderLeadTouchText('First Touch', leadSource.first_touch),
    `Latest Visit Time: ${leadSource.latest_visit_time || 'Not provided'}`,
    renderLeadTouchText('Latest Touch', leadSource.latest_touch),
  ].join('\n');
}

function renderLeadTouchHtml(label, touch = {}) {
  return `
    <h3 style="margin:18px 0 8px;font-size:14px;color:#123b2d;">${escapeHtml(label)}</h3>
    <table style="width:100%;border-collapse:collapse;">
      ${Object.entries(leadSourceLabels).map(([field, fieldLabel]) => `
        <tr>
          <td style="width:180px;padding:7px 0;border-bottom:1px solid #edf1e9;color:#607064;font-weight:700;">${escapeHtml(fieldLabel)}</td>
          <td style="padding:7px 0;border-bottom:1px solid #edf1e9;color:#172019;word-break:break-word;">${escapeHtml(touch[field] || 'Not provided')}</td>
        </tr>
      `).join('')}
    </table>
  `;
}

function renderLeadSourceHtml(leadSource = {}) {
  return `
    <h2 style="margin:28px 0 10px;font-size:18px;color:#123b2d;">Lead Source</h2>
    <p style="margin:0 0 6px;"><strong>First Visit Time:</strong> ${escapeHtml(leadSource.first_visit_time || 'Not provided')}</p>
    ${renderLeadTouchHtml('First Touch', leadSource.first_touch)}
    <p style="margin:18px 0 6px;"><strong>Latest Visit Time:</strong> ${escapeHtml(leadSource.latest_visit_time || 'Not provided')}</p>
    ${renderLeadTouchHtml('Latest Touch', leadSource.latest_touch)}
  `;
}

function renderTextEmail(inquiry) {
  return [
    'New Website Inquiry',
    '',
    `Your Name: ${inquiry.name}`,
    `Work Email: ${inquiry.email}`,
    `Phone / WhatsApp: ${inquiry.phone}`,
    `Product Interest: ${inquiry.product}`,
    `Company: ${inquiry.companyName || 'Not provided'}`,
    `Company Website: ${inquiry.companyWebsite || 'Not provided'}`,
    `Job Role: ${inquiry.jobRole || 'Not provided'}`,
    `Country: ${inquiry.country || 'Not provided'}`,
    `Estimated Quantity: ${inquiry.quantity || 'Not provided'}`,
    '',
    'Message:',
    inquiry.message || 'Not provided',
    '',
    renderLeadSourceText(inquiry.leadSource),
    '',
    `Source Page: ${inquiry.pageUrl || 'Not provided'}`,
    `Submission Time: ${inquiry.submittedAt}`,
    'Website: www.jczcare.com',
  ].join('\n');
}

function renderHtmlEmail(inquiry) {
  const rows = [
    ['Your Name', inquiry.name],
    ['Work Email', inquiry.email],
    ['Phone / WhatsApp', inquiry.phone],
    ['Product Interest', inquiry.product],
    ['Company', inquiry.companyName || 'Not provided'],
    ['Company Website', inquiry.companyWebsite || 'Not provided'],
    ['Job Role', inquiry.jobRole || 'Not provided'],
    ['Country', inquiry.country || 'Not provided'],
    ['Estimated Quantity', inquiry.quantity || 'Not provided'],
    ['Source Page', inquiry.pageUrl || 'Not provided'],
    ['Submission Time', inquiry.submittedAt],
    ['Website', 'www.jczcare.com'],
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
        <div style="white-space:pre-wrap;background:#f6f8ef;border-radius:14px;padding:16px;line-height:1.7;">${escapeHtml(inquiry.message || 'Not provided')}</div>
        ${renderLeadSourceHtml(inquiry.leadSource)}
      </div>
    </div>
  </body>
</html>`;
}

export async function sendEmail(inquiry) {
  const { recipient, sender } = getEmailConfig();

  if (recipient !== REQUIRED_INQUIRY_RECIPIENT) {
    console.error('Inquiry email configuration error: INQUIRY_TO_EMAIL must be the approved sales mailbox.');
    return { ok: false, status: 500, code: 'EMAIL_CONFIG_MISSING' };
  }

  if (!sender) {
    console.error('Inquiry email configuration error: a verified sender address is missing.');
    return { ok: false, status: 500, code: 'EMAIL_CONFIG_MISSING' };
  }

  const subject = `New Website Inquiry \u2013 ${inquiry.name} \u2013 ${inquiry.product}`;
  const text = renderTextEmail(inquiry);
  const html = renderHtmlEmail(inquiry);

  if (hasSmtpConfig()) {
    try {
      const transporter = getSmtpTransporter();
      const info = await transporter.sendMail({
        from: sender,
        to: recipient,
        replyTo: inquiry.email,
        subject,
        text,
        html,
      });

      const accepted = Array.isArray(info.accepted) ? info.accepted : [];
      const rejected = Array.isArray(info.rejected) ? info.rejected : [];
      const recipientAccepted = accepted.some(
        (address) => String(address).toLowerCase() === recipient.toLowerCase(),
      );

      console.info('Inquiry email SMTP result', {
        messageId: info.messageId || null,
        accepted,
        rejected,
        response: info.response || null,
      });

      if (!recipientAccepted || rejected.length > 0) {
        return { ok: false, status: 500, code: 'EMAIL_REJECTED' };
      }

      return {
        ok: true,
        deliveryConfirmed: true,
        provider: 'smtp',
        messageId: info.messageId || null,
        accepted,
        rejected,
      };
    } catch (error) {
      console.error('SMTP inquiry email failed', error?.message || 'Unknown error');
      return { ok: false, status: 500, code: 'SMTP_SEND_FAILED' };
    }
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('Inquiry email configuration error: SMTP and Resend are not configured.');
    return { ok: false, status: 500, code: 'EMAIL_CONFIG_MISSING' };
  }

  let response;

  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: inquiry.email,
        subject,
        text,
        html,
      }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (error) {
    console.error('Resend inquiry email request failed', error?.message || 'Unknown error');
    return { ok: false, status: 500, code: 'RESEND_SEND_FAILED' };
  }

  if (!response.ok) {
    console.error('Resend inquiry email failed', response.status);
    return { ok: false, status: 500, code: 'RESEND_SEND_FAILED' };
  }

  const result = await response.json().catch(() => ({}));

  if (!result.id) {
    console.error('Resend inquiry email response did not include a message ID.');
    return { ok: false, status: 500, code: 'RESEND_CONFIRMATION_MISSING' };
  }

  console.info('Inquiry email Resend result', { messageId: result.id || null });

  return {
    ok: true,
    deliveryConfirmed: true,
    provider: 'resend',
    messageId: result.id,
  };
}

export const emailInternals = {
  getEmailConfig,
  renderLeadSourceHtml,
  renderLeadSourceText,
  renderHtmlEmail,
  renderTextEmail,
};
