# Project Checkpoint

## Latest Checkpoint
Date: 2026-07-21

Status: Non-homepage image regeneration is audited and isolated on `codex/regenerate-non-homepage-images`, but generation is blocked by the built-in imagegen service returning repeated network errors.

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
- Added 12 English SEO Blog articles for B2B pet pad OEM/ODM sourcing intent.
- Added `/blog` and `/blog/[slug]` routes.
- Added Blog metadata, Article Schema, FAQ Schema, canonical support, static body output, sitemap routes, and responsive styles.
- Confirmed Vercel successfully deployed SEO Blog foundation for commit `416ddc2`.
- Added build-time RSS feed generation at `/rss.xml`.
- Added build-time HTML sitemap generation at `/sitemap.html`.
- Added RSS discovery tags to route-level static SEO output.
- Updated Vercel routing and headers for RSS and HTML sitemap static assets.
- Committed and pushed Technical SEO feed infrastructure as `8b5d207`.
- Confirmed Vercel production deployment completed successfully for `8b5d207`.
- Verified live `/rss.xml`, `/sitemap.html`, and `/sitemap.xml` responses.
- Expanded the Blog content library to 100 connected B2B articles.
- Added 15 authoritative pillar pages and connected existing articles into topic clusters.
- Added build-time Blog cover generation and topic-cluster validation.
- Added ten factory resource pages covering Production Line, Warehouse, Raw Materials, Quality Control, Testing Laboratory, Packaging, Container Loading, SAP Technology, PE Film, and Certificates.
- Added factory photography, workflow timelines, buyer specifications, related products, related articles, FAQs, breadcrumbs, and inquiry CTAs.
- Added factory routes to navigation, static SEO output, XML sitemap, HTML sitemap, and structured data.
- Fixed the factory runtime blank-page error by normalizing section data for the shared authority-page renderer.
- Verified desktop and 390 px mobile rendering with no horizontal overflow.
- Expanded the Blog library to 150 connected B2B articles.
- Added 40 Buyer Guides, 30 total comparisons, 20 total case studies, 20 total factory pages, 15 material pages, 15 FAQ landing pages, 10 industry reports, and 10 buyer resources.
- Added Buyer Guide, Material Knowledge, Industry Report, and Buyer Resource centers.
- Added automated content count, word range, metadata, data-contract, related-link, and duplicate-paragraph validation.
- Expanded static SEO output, sitemap, RSS, and semantic internal linking to 393 public routes.
- Fixed the new Blog table-of-contents runtime contract and verified deep-link rendering.
- Reduced global preload transfer weight by using the existing WebP factory image and non-blocking display fonts.

## Current Task
- Regenerate and replace all non-homepage content images while preserving the homepage exactly.
- Route and asset audit is complete: 393 public routes, 392 non-homepage routes, 150 Blog articles, 186 authority routes, and 10 factory detail routes.
- Resume at image generation batch 1; do not repeat the completed scan or homepage protection analysis.
- Use only the built-in Codex imagegen workflow. Do not use CLI/API or third-party generation fallbacks.

## Remaining Tasks
- Retry generation batch 1 after the built-in imagegen service is available.
- Generate and validate unique non-homepage hero and supporting images in semantic batches.
- Update only non-homepage image references and alt text.
- Complete desktop/mobile visual QA, lint, build, report, commit, push, and Vercel Production deployment.
- Configure Resend production environment variables in Vercel before expecting live email delivery.
- Configure Google Cloud service account and Google Sheets environment variables in Vercel.
- Continue Phase 1 Technical SEO improvements in logical milestones.
- Continue future tasks from this checkpoint.
- Use Google Search Console query data to prioritize updates to the highest-opportunity clusters rather than adding undirected content volume.
- Review inquiry conversion by hub, cluster, and CTA after production data is available.
- Continue reducing the existing main and Silk JavaScript chunks in a dedicated performance milestone.

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
- Latest lint/build: passed after SEO Blog foundation.
- Latest sitemap check: `/blog` plus 12 Blog article URLs generated.
- Latest static HTML check: 12 Blog articles include body text, metadata, canonical, Article Schema, FAQ Schema, and Buyer Checklist content.
- SEO Blog deployment: completed successfully for commit `416ddc2`.
- Latest lint/build: passed after Technical SEO feed infrastructure.
- RSS check: `dist/rss.xml` generated with 12 Blog items.
- HTML sitemap check: `dist/sitemap.html` generated with 69 public routes.
- Vercel routing check: `/rss.xml` and `/sitemap.html` excluded from SPA fallback.
- Latest GitHub push: completed for commit `8b5d207`.
- Latest Vercel deployment: completed successfully for commit `8b5d207`.
- Live RSS check: `https://www.jczcare.com/rss.xml` returns `application/rss+xml` with 12 items.
- Live HTML sitemap check: `https://www.jczcare.com/sitemap.html` returns static HTML with 12 Blog links.
- Live XML sitemap check: `https://www.jczcare.com/sitemap.xml` returns `application/xml` with 13 Blog matches.
- Added docs/SEO_ROADMAP.md with 300 unique topics across 20 commercial B2B clusters.
- Added six new Blog articles, increasing the total from 12 to 18.
- Added static Blog internal links for product, advantages, contact and related content discovery.
- Added calculated Blog reading-time labels.
- Latest commit: 198c69a95070e950c2ff444d6b9dec766fa02032 (Publish SEO growth content batch 01).
- Production check: all six new Blog URLs return HTTP 200 and include FAQ Schema.
- Production sitemap check: six new Blog URLs are present in https://www.jczcare.com/sitemap.xml.
- Production RSS check: https://www.jczcare.com/rss.xml returns application/rss+xml with 18 items.
- Latest SEO lint: passed for 204 public routes.
- Latest production build: passed with 204 route-level static HTML pages and 100 RSS items.
- Topic-cluster validation: passed for 15 pillar pages and 100 connected articles.
- Factory route validation: all ten pages generated with metadata, canonical, FAQ, Breadcrumb, workflow, photography, related-product, and inquiry content.
- Browser validation: Production Line and Certificates pages render correctly on desktop; Production Line also passed a 390 px mobile overflow check.
- Known non-blocking build warning: the existing main and Silk chunks remain above Vite's 500 kB advisory threshold.
- Vercel Production deployment: `dpl_Et8mETwtW4ywcsKWUdECXsmNdnsj`, Ready, aliased to `https://www.jczcare.com`.
- GitHub push: commit `8183eae` pushed to `origin/main`.
- GitHub-triggered Vercel deployment: `dpl_3v1Qz1S3a7miTA9jLeeTwU4GWQui`, Ready, aliased to `https://www.jczcare.com`.
- Live factory verification: all ten routes return HTTP 200 with static H1, FAQ Schema, and Breadcrumb Schema.
- Live sitemap verification: `application/xml`, all ten factory routes present.
- Live RSS verification: `application/rss+xml`, 100 items.
- Latest SEO lint: passed for 393 public routes.
- Latest production build: passed with 393 route-level static HTML pages and 150 RSS items.
- Content ecosystem validation: 325 target content pages, 186 authority routes, no duplicate authority metadata or exact duplicate paragraphs.
- Sitemap validation: 393 unique absolute URLs and zero broken internal routes in generated HTML.
- Browser validation: representative Blog, Buyer Guide, report, material, and resource routes render on desktop; 390 px mobile checks show zero overflow, broken images, or console errors.
- Lighthouse: Performance 94, Accessibility 96, Best Practices 100, SEO 100 on a new long-form Blog article.
- GitHub push: commit `e62b070` pushed to `origin/main`.
- Vercel deployment: GitHub status `Vercel: success` for deployment `2Psi7fW8dSPpN9tbfEGAVPHmBdgn`.
- Live production checks: five representative content routes return HTTP 200 with static H1, canonical, and JSON-LD.
- Live sitemap: `application/xml`, 393 URLs.
- Live RSS: `application/rss+xml`, 150 items.

## Next Checkpoint
After production verification, use Google Search Console query and page data to prioritize improvements to the highest-opportunity pillar, guide, report, factory, and Blog pages without repeating this completed milestone.
