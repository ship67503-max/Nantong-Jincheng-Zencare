# Inquiry email setup

The form submits to `/api/contact`. Configure these variables in the Vercel
**Production** environment to deliver through the enterprise mailbox SMTP
server:

```text
INQUIRY_TO_EMAIL=sales3@nthengtuo.com
SMTP_HOST=<your enterprise mail SMTP host>
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=hengtuo@nthengtuo.com
SMTP_PASS=<mailbox password or app-specific password>
SMTP_FROM_EMAIL=hengtuo@nthengtuo.com
VITE_TURNSTILE_SITE_KEY=<Cloudflare Turnstile site key>
TURNSTILE_SECRET_KEY=<Cloudflare Turnstile secret key>
```

For SMTP port `587`, use `SMTP_SECURE=false` (STARTTLS). The SMTP user must be
allowed to send mail, and the provider may require enabling SMTP or creating an
app-specific password. The server-only `INQUIRY_TO_EMAIL` value controls where
website inquiries are delivered. The public website email remains
`hengtuo@nthengtuo.com`.

As an alternative to SMTP, configure `RESEND_API_KEY` and
`CONTACT_FROM_EMAIL` with a sender address verified by Resend. Do not configure
both delivery methods unless SMTP is intended to take precedence. The API
refuses to send if `INQUIRY_TO_EMAIL` is missing or is not exactly
`sales3@nthengtuo.com`.

Optional inquiry storage and business-system synchronization variables:

```text
GOOGLE_PROJECT_ID
GOOGLE_CLIENT_EMAIL
GOOGLE_PRIVATE_KEY
GOOGLE_SHEET_ID
GOOGLE_SHEET_NAME
JCZ_BUSINESS_SHARED_API_URL
JCZ_BUSINESS_SHARED_INGEST_TOKEN
```

All variables except `VITE_TURNSTILE_SITE_KEY` are server-only and must not be
prefixed with `VITE_` or included in client code.

After saving the variables, redeploy the Production deployment. Submit one
real test inquiry and confirm it arrives in the inbox and in the mailbox's
sent/trace records. If SMTP is configured but sending fails, the API returns an
error instead of silently reporting success through another provider.
