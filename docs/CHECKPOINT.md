# Project Checkpoint

## Latest Checkpoint
Date: 2026-07-15

Status: Google Sheets runtime Sheet ID verification added, verified, pushed, and deployed.

## Completed Tasks
- Documentation folder initialized with project strategy, rules, roadmap, changelog, and Sprint 01 audit checklist.
- Footer social media icon links were removed from the live website.
- Apple ID sign-in option and `/api/auth/apple` route were removed from the live website.
- Build verification passed after the latest website changes.
- GitHub push completed for the latest deployed website changes.
- Full audit process was cancelled by instruction.
- Sprint 01 was redefined as Technical SEO Foundation.
- Implemented sitemap/robots compatibility, route-level metadata, canonical URLs, Open Graph, Twitter Card, JSON-LD, Organization Schema, Product Schema, FAQ Schema, Breadcrumb Schema, image alt improvements, WebP generation, lazy loading, internal linking improvements, and duplicate metadata validation.
- `npm.cmd run lint` passed.
- `npm.cmd run build` passed.
- Unified all visible email contact points to `hengtuo@nthengtuo.com`.
- Added `/api/contact` Resend-based inquiry email endpoint.
- Replaced the static contact-page form with the validated reusable inquiry form.
- Added Resend/contact email environment placeholders to `.env.example`.
- Verified no legacy email strings remain in the repository outside ignored build folders.
- Hardened `/api/contact` for real Resend delivery with HTML and plain-text email bodies.
- Added honeypot protection, content-length limiting, field length limits, input sanitization, and basic per-IP rate limiting.
- Added front-end duplicate-submit prevention, hidden honeypot field, max lengths, loading state, and failure fallback mailto.
- Verified API validation and mocked Resend success path.
- Confirmed final recipient is `hengtuo@nthengtuo.com`.
- Enforced `CONTACT_FROM_EMAIL` as the only sender source for `/api/contact`.
- Added direct Google Sheets API inquiry sync through `services/googleSheets.js`.
- Refactored Resend delivery into `services/email.js`.
- Updated `/api/contact` to call `sendEmail()` and `appendInquiryToGoogleSheets()` independently.
- Confirmed Google Sheets sync failure is logged and does not break customer success when Resend succeeds.
- Updated Google Sheets range to use `GOOGLE_SHEET_NAME`, defaulting to `工作表1`.
- Confirmed `/api/contact` sends email first, then appends to Google Sheets after Resend succeeds.
- Confirmed Google Sheets append uses `USER_ENTERED` and `INSERT_ROWS`.
- Added Google Sheets diagnostics for sheet ID, sheet name, spreadsheet GET, append range, and 404 response data.
- Confirmed diagnostics do not log the private key value.
- Added safe service account identity diagnostics for Google Sheets troubleshooting.
- Updated Spreadsheet GET failure diagnostics to log status, response data, and message without logging the private key.
- Searched for stale Spreadsheet ID usage and confirmed no hardcoded Spreadsheet ID exists in source.
- Added explicit `Runtime GOOGLE_SHEET_ID =` logging to verify the exact Vercel runtime value.

## Current Task
- Await the next user task.

## Remaining Tasks
- Configure Resend production environment variables in Vercel before expecting live email delivery.
- Configure Google Cloud service account and Google Sheets environment variables in Vercel.
- Confirm Vercel creates a new deployment after GitHub push.
- Plan the next sprint only after approval.
- Continue future tasks from this checkpoint.

## Resume Instructions
If the connection is interrupted:

1. Read this file first.
2. Check `git status --short`.
3. Do not repeat completed tasks.
4. Continue from the current task listed above.
5. After completing a task, update this file, `CHANGELOG.md`, and `ROADMAP.md`.

## Latest Verification
- SEO lint: passed for 57 public routes.
- Production build: passed.
- Sitemap XML: generated with 57 URLs.
- Robots.txt: generated with sitemap reference.
- Route-level static metadata: generated.
- WebP images: generated.
- Contact email scan: passed with no legacy email matches.
- Contact/inquiry validation: implemented in React form and `/api/contact`.
- API tests: empty form rejected, invalid email rejected, honeypot rejected, missing API key fails safely, mocked Resend success returns success.
- Secret exposure scan: no Resend/API environment names are referenced from front-end source files.
- Sender check: `/api/contact` uses `CONTACT_FROM_EMAIL` and no hardcoded sender fallback.
- Recipient check: `/api/contact` sends to `hengtuo@nthengtuo.com`.
- Google Sheets sync test: Resend success returns success even when Sheets sync logs an error.
- Package check: `googleapis` installed.
- Google Sheets range: `GOOGLE_SHEET_NAME` defaults to `工作表1`; append range resolves to `工作表1!A:L`.
- Latest lint/build: passed after Google Sheets deployment fix.
- Latest lint/build: passed after Google Sheets diagnostics.
- Latest lint/build: passed after Google Sheets service account diagnostics.
- Latest lint/build: passed after Google Sheets runtime Sheet ID verification.
- Latest GitHub push: completed for commit `f3dec97`.
- Latest Vercel deployment: completed successfully for commit `f3dec97`.

## Next Checkpoint
Next checkpoint should be created after the user approves, commits, deploys, configures email environment variables, or assigns the next sprint.
