# Inquiry email setup

Configure these variables in the Vercel Production environment:

```text
CONTACT_TO_EMAIL=sales3@nthengtuo.com
CONTACT_FROM_EMAIL=sales3@nthengtuo.com
SMTP_HOST=smtp.nthengtuo.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=sales3@nthengtuo.com
SMTP_PASS=<client authorization code>
```

The SMTP password must only be stored in Vercel, never in source control. The
existing Resend configuration remains available as a fallback if SMTP fails.
