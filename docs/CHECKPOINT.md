# Project Checkpoint

## Latest Checkpoint
Date: 2026-07-21 17:16 +08:00

Status: Batch 1 was prepared and started after a successful standalone connectivity test, but the built-in imagegen backend became unavailable again. Six consecutive attempts across the first two image tasks failed; no image or website file was changed.

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
- Latest recovery test: three failed attempts on 2026-07-21 at 13:08 +08:00. Each returned `network error: error sending request for url (https://chatgpt.com/backend-api/codex/images/generations)`.
- Connection-only recovery check on 2026-07-21 at 15:23 +08:00: one permitted request returned `image generation failed: network error: error sending request for url (https://chatgpt.com/backend-api/codex/images/generations)`.
- Diagnostic classification: HTTP status unavailable because no HTTP response was returned; error type is a network transport error; request failed while sending to the built-in image generation endpoint. The response did not indicate an expired login, permission denial, quota exhaustion, or an HTTP-level network policy block.
- Latest backend availability check on 2026-07-21 at 15:51 +08:00: three attempts, separated by 20-second and 30-second intervals, all failed with the same request-transmission network error. No output was created and batch 1 did not start.
- Batch 1 scope is fixed as Disposable Pet Pads, Adult Underpads, Pet Care Pad & Glove Wipes, Pet Absorbent Paper Sheets, and Custom Pet Waste Bags. Their page semantics, existing subjects, image purpose, and responsive hero container were reviewed without repeating the global route scan.
- Batch 1 interruption on 2026-07-21 at 17:16 +08:00: Disposable Pet Pads failed three attempts and Adult Underpads failed three attempts. The remaining three tasks were not started after the backend met the complete-unavailability stop condition.
- Recovery-test outputs: none. Generated images: 0. Replaced images: 0. Homepage changes: none.

## Remaining Tasks
- Retry one minimal imagegen recovery test after the built-in service is available; do not repeat the completed scan or Batch 1 semantic review.
- After a successful recovery test, restart Batch 1 at `/products/disposable-pet-pads` with the five already identified product-detail tasks.
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

## Image Regeneration Checkpoint - 2026-07-22 09:46 +08:00

- Branch: `codex/regenerate-non-homepage-images`
- Starting checkpoint: `ed41bc0`
- Route inventory and image-demand mapping: reused; no rescan
- Current task: `/products/disposable-pet-pads`
- Playwright: installed as a development-only QA dependency with dedicated Chromium
- Desktop candidate QA: passed loading, decoding, layout, network, and console checks
- Mobile candidate QA: failed because the existing portrait crop removed the dog; candidate rejected
- Website state: original Disposable Pet Pads asset/reference restored; homepage unchanged
- Accepted generated images: `0`
- Replaced images: `0`
- Push/merge/deploy: not performed
- Blocker: built-in imagegen product requests repeatedly fail during request transport; a minimal connectivity test succeeded once, but the immediate product retry failed
- Resume point: retry only the centered mobile-safe Disposable Pet Pads image in single-image serial mode; do not rescan routes or repeat semantic review

### Retry Update - 2026-07-22 10:04 +08:00

- `/products/disposable-pet-pads`: one product-specific 4:3 imagegen request attempted in strict serial mode
- Result: request-transport network error; no file returned
- Empty-room connectivity output: explicitly rejected and not used
- Original product image/reference: preserved
- Homepage and website source: unchanged
- Adult Underpads: not started
- Commit/push/merge/deploy: not performed
- Resume point: retry the same approved Disposable Pet Pads product scene only after built-in imagegen service recovery; reuse all existing route, semantic, container, and QA findings

### Image Queue Checkpoint - 2026-07-22 10:15 +08:00

- Mode: `IMAGE QUEUE MODE`
- Completed queue images: `0`
- Current/next pending image: `Disposable Pet Pads`
- Latest attempt: failed during request transport; no image returned
- Retry behavior: stopped immediately; no additional imagegen call made
- Website images/references, homepage, layout, and source code: unchanged
- Browser/build/Git/deployment actions: not performed
- Resume rule: when built-in imagegen is available, continue with the same pending Disposable Pet Pads image; do not rescan, recreate mappings, or regenerate completed images

### Image Queue Retry Checkpoint - 2026-07-22 10:40 +08:00

- Branch: `codex/regenerate-non-homepage-images`
- Queue item: `Disposable Pet Pads`
- Attempt count this cycle: `3`
- Recovery intervals completed: `45 seconds`, then `90 seconds`
- Latest error type: built-in imagegen request-transport network error with no HTTP response or output file
- Output directory/file: not created
- Completed/approved queue images: `0`
- Current status: `failed-network`; keep as first pending item
- Website source, image references, homepage, Playwright, build, Git, push, merge, and deployment: untouched
- Next resume action: retry this same item only when built-in imagegen recovers; do not rescan routes or recreate the queue

### Fal Billing Preflight Checkpoint - 2026-07-22 10:57 +08:00

- Branch: `codex/regenerate-non-homepage-images`
- Starting checkpoint: `ed41bc0`
- Existing route scan, semantic analysis, image mapping, and queue: reused without rescanning
- Fal plugin: installed and callable; catalog, schema, pricing, and documentation queries succeeded
- Recommended endpoint: `fal-ai/flux-2/klein/9b`
- Price: USD `0.011` per megapixel for successful output
- Supported output: `landscape_4_3` or custom size; JPEG, PNG, and WebP
- Account free credits / remaining balance: not exposed by the available Fal connector tools and therefore not verified
- Commercial-use status for the exact recommended endpoint: not explicitly returned by the connector; Fal requires model-specific license verification
- Generation decision: no request submitted because an unauthorized charge could not be ruled out
- Current/next pending item: `Disposable Pet Pads`
- Generated/saved/replaced images: `0 / 0 / 0`
- Homepage, website source, image references, layout, SEO, and task queue: unchanged
- Build/Playwright/Git commit/push/merge/deploy: not performed
- Resume condition: verify sufficient free credit or explicitly authorize the estimated Fal cost before submitting a single-image request

### Manual Canva Intake Checkpoint - 2026-07-22 13:38 +08:00

- Branch: `codex/regenerate-non-homepage-images`
- Existing 393-route scan and 392 non-homepage image requirements: reused without rescanning
- Queue file: `docs/image-generation-queue.json` (392 tasks, all currently `pending`)
- Homepage baseline: `docs/homepage-image-protection-baseline.json`
- Current/next task: `task-0001` for `/products/disposable-pet-pads`
- Current target: `/generated-images/pet-pads/products-disposable-pet-pads.webp`
- Expected source: a completed PNG, JPG, JPEG, or WebP download placed in `D:\WebsiteImages\incoming`
- Intake/processed/rejected directories: created and writable
- Project category output directories: created under `public/generated-images/`
- Stable eligible files detected at checkpoint: `0`
- Current completed/rejected/replaced totals: `0 / 0 / 0`
- Homepage, website text, layout, SEO, routes, contact form, Resend, and Google Sheets logic: unchanged
- Build, push, merge, and deployment: not performed
- Next action: monitor the intake directory every 30 seconds; process only a stable, valid, semantically matching image for `task-0001`

### Manual Intake Idle Checkpoint - 2026-07-22 13:51 +08:00

- Intake monitoring completed for 10 continuous minutes at 30-second intervals
- Eligible files received: `0`
- Completed / rejected / manual-review-required: `0 / 0 / 0`
- Remaining pending tasks: `392`
- Next pending task: `task-0001`
- Next page: `/products/disposable-pet-pads`
- Expected target: `/generated-images/pet-pads/products-disposable-pet-pads.webp`
- Homepage unchanged: `YES`
- Website image references and source code: unchanged during monitoring
- Build, Git commit, push, merge, and Vercel deployment: not performed
- Resume trigger: place the next completed Canva image in `D:\WebsiteImages\incoming`; resume from this checkpoint without rescanning or recreating the queue

### Manual Intake Task Checkpoint - 2026-07-23 09:12 +08:00

- Completed task: `task-0001`
- Completed page: `/products/disposable-pet-pads`
- New route-specific asset: `/generated-images/pet-pads/products-disposable-pet-pads.webp`
- Processed dimensions / size: `1458 x 941` / `60,596` bytes
- Desktop/mobile image loading: passed
- Homepage and customization product card: still use `/images/custom-disposable-pet-pads-premium.png`
- Homepage unchanged: `YES`
- Queue totals: `1 completed`, `391 pending`
- Next pending task: `task-0002`
- Next page: `/products/adult-underpads`
- Expected subject: adult disposable underpad in a professional home-care or healthcare setting
- Existing unrelated or pet-pad-only downloads: retained for review; not misassigned
- Build, Git commit, push, merge, and Vercel deployment: not performed
- Resume action: evaluate the next stable incoming image against `task-0002`; reject or retain mismatches without advancing the queue

### Adult Underpads Intake Checkpoint - 2026-07-23 09:19 +08:00

- Active task: `task-0002`
- Active route: `/products/adult-underpads`
- Reviewed downloads in this checkpoint: `44`
- Valid Adult Underpads assets: `0`
- Rejected but preserved assets: `44`
- Rejected directory: `D:/WebsiteImages/rejected`
- Queue totals: `1 completed`, `391 pending`
- Download asset totals: `1 processed`, `44 rejected`, `0 manual-review-required`
- Incoming directory after reviewed snapshot: empty
- Homepage unchanged: `YES`
- No page reference was advanced for `task-0002`
- Build, commit, push, merge, and deployment: not performed
- Resume trigger: receive a stable, decodable, watermark-free Adult Disposable Underpads image showing a professional home-care bed or healthcare setting

### Adult Underpads Idle Checkpoint - 2026-07-23 09:31 +08:00

- Monitoring window: 10 minutes
- New eligible downloads: `0`
- Queue: `1 completed`, `391 pending`
- Rejected assets: `44`, all preserved on disk
- Next task: `task-0002`
- Incoming directory: empty
- Homepage baseline verification: passed with zero mismatches
- Homepage root/customization new-image usage: zero; protected original remains in use
- Build, commit, push, merge, and deployment: not performed
- Resume from this exact checkpoint when the next Canva download is placed in `D:\WebsiteImages\incoming`

### Adult Underpads Completed Checkpoint - 2026-07-23 11:23 +08:00

- Completed task: `task-0002`
- Completed page: `/products/adult-underpads`
- Accepted source: `D:/WebsiteImages/processed/task-0002-adult-underpads-source.jpg`
- New route-specific asset: `/generated-images/adult-underpads/products-adult-underpads.webp`
- Processed dimensions / size: `1536 x 1024` / `59,724` bytes
- Semantic validation: passed; watermark-free adult underpad absorbency testing in a quality laboratory
- Desktop validation: passed; HTTP 200, both image instances decoded, no request or console errors
- Mobile validation: passed; HTTP 200, both image instances decoded, responsive 3:2 rendering, no request or console errors
- Homepage/customization product card: still use `/images/adult-underpads-hero.png`
- Homepage protected-file baseline: passed with zero mismatches
- Queue totals: `2 completed`, `390 pending`
- Next pending task: `task-0003`
- Next page: `/products/pet-care-pad-glove-wipes`
- Expected subject: disposable pet care glove wipes and private-label care-product presentation
- Watermarked files: not cropped, altered, or assigned
- Build, commit, push, merge, and deployment: not performed
- Resume action: review only a new, stable, watermark-free source matching `task-0003`

### Pet Care Glove Wipes Intake Checkpoint - 2026-07-23 11:53 +08:00

- Active task: `task-0003`
- Active route: `/products/pet-care-pad-glove-wipes`
- Expected subject: disposable pet care glove wipes and a credible private-label care-product presentation
- Reviewed downloads in this checkpoint: `8`
- Accepted assets: `0`
- Rejected but preserved assets: `8`
- Rejected directory range: `D:/WebsiteImages/rejected/reviewed-0057-original.jpg` through `reviewed-0064-original.jpg`
- Rejection reasons: category mismatch, missing glove-wipe product, or visible generated/packaging text
- Watermark/text removal: not performed
- Incoming directory after review: empty
- Queue totals: `2 completed`, `390 pending`
- Next pending task remains: `task-0003`
- Homepage unchanged: `YES`
- Build, commit, push, merge, and deployment: not performed
- Resume trigger: place a stable, decodable, watermark-free image that clearly shows disposable pet care glove wipes in `D:\WebsiteImages\incoming`

### Pet Care Glove Wipes Idle Checkpoint - 2026-07-23 12:18 +08:00

- Monitoring window: at least 10 continuous minutes after the latest intake review
- New eligible downloads: `0`
- Queue totals: `2 completed`, `390 pending`
- Rejected downloaded assets: `64`, all preserved on disk
- Next pending task: `task-0003`
- Next page: `/products/pet-care-pad-glove-wipes`
- Incoming directory: empty
- Homepage unchanged: `YES`
- Build, commit, push, merge, and deployment: not performed
- Resume trigger: place a stable, decodable, watermark-free image that clearly shows disposable pet care glove wipes in `D:\WebsiteImages\incoming`
