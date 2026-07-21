# Changelog

All notable project documentation and website development changes should be recorded in this file.

## v1.5.0 - Complete B2B SEO Content Ecosystem

Date: 2026-07-21

### Added
- Expanded the Blog library from 100 to 150 connected B2B articles.
- Added 40 long-form Buyer Guides, bringing supplier selection, MOQ, sampling, lead time, packaging, inspection, importing, and landed-cost decisions into one procurement center.
- Expanded the authority system to 30 comparison pages, 20 representative case studies, 20 factory-knowledge pages, 15 material-knowledge pages, 15 FAQ landing pages, 10 industry reports, and 10 downloadable-resource request pages.
- Added Buyer Guide, Material Knowledge, Industry Report, and Buyer Resource hubs with semantic links to products, pillars, related articles, factory content, and inquiry routes.
- Added an automated content-ecosystem validator for page counts, word ranges, component data contracts, related content, metadata uniqueness, and exact paragraph duplication.

### Changed
- Expanded the static SEO, sitemap, RSS, schema, navigation, and internal-link systems to cover 393 public routes.
- Added cross-collection links among pillars, guides, comparisons, related articles, products, and conversion routes.
- Switched the global factory-image preload from a 3.2 MB JPEG to the existing 148 KB WebP asset.
- Moved display-font loading out of the blocking CSS import and into a non-blocking document-head preload with a noscript fallback.

### Fixed
- Corrected the new Blog table-of-contents data contract so direct article URLs render without a React runtime error.
- Filled related-article lists for small topic clusters without creating duplicate links.
- Removed a duplicate `/resources` hub definition while preserving the established public URL.
- Eliminated exact duplicate paragraphs from generated long-form authority content by binding every paragraph to its page and section context.

### Verified
- Topic-cluster validation passed for 15 pillar pages and 150 connected articles.
- Content-ecosystem validation passed for 325 target content pages and 186 authority routes.
- SEO validation passed for 393 public routes.
- Production build generated 393 route-level HTML pages and 150 RSS items.
- XML sitemap contains 393 unique URLs; static link validation found zero broken internal routes.
- Desktop and 390 px mobile browser checks passed with zero horizontal overflow, broken images, or console errors.
- Lighthouse for a new Blog article: Performance 94, Accessibility 96, Best Practices 100, SEO 100.

## v1.4.0 - Topic Authority and Factory Resource Centers

Date: 2026-07-20

### Added
- Expanded the SEO Blog content system to 100 connected B2B articles.
- Added 15 authoritative topic-cluster pillar pages for OEM manufacturing, pet training pads, adult underpads, dog poop bags, private label, customization, quality, factory audits, packaging, shipping, materials, SAP, PE film, importing, and industry insights.
- Added ten dedicated factory pages for Production Line, Warehouse, Raw Materials, Quality Control, Testing Laboratory, Packaging, Container Loading, SAP Technology, PE Film, and Certificates.
- Added factory workflow timelines, buyer specification tables, professional factory photography, related products, related technical articles, FAQs, breadcrumbs, and inquiry CTAs.
- Added build-time cover generation and topic-cluster validation scripts.

### Changed
- Connected Blog articles to their parent pillar pages, related content, relevant products, factory resources, and conversion routes.
- Expanded the Factory Center into a navigation hub for all ten factory topics.
- Added Factory to the primary navigation.
- Extended route-level SEO generation, sitemap, RSS, static HTML, Article Schema, FAQ Schema, Breadcrumb Schema, ItemList workflow Schema, and ImageGallery Schema for the expanded authority system.
- Added responsive factory timeline and specification layouts.

### Fixed
- Normalized factory section data to the shared authority-page content model, fixing a runtime blank-page error caused by an undefined paragraph collection.

### Verified
- `npm.cmd run lint` passed for 204 public routes.
- `npm.cmd run build` completed successfully.
- Topic-cluster validation passed for 15 pillar pages and 100 connected articles.
- All ten factory routes generated as static HTML and are present in the XML and HTML sitemaps.
- Desktop and 390 px mobile browser checks passed without horizontal overflow.
- Production Line and Certificates pages render with unique metadata, canonical URLs, FAQ Schema, Breadcrumb Schema, and workflow ItemList Schema.
- Vercel Production deployment `dpl_Et8mETwtW4ywcsKWUdECXsmNdnsj` completed with Ready status and was aliased to `https://www.jczcare.com`.
- GitHub `main` push completed for commit `8183eae`.
- The GitHub-triggered Vercel Production deployment `dpl_3v1Qz1S3a7miTA9jLeeTwU4GWQui` completed with Ready status.
- All ten live factory routes return HTTP 200 with static H1, FAQ Schema, and Breadcrumb Schema.
- The live XML sitemap returns `application/xml` with all ten factory URLs; the live RSS feed returns 100 items.

## v1.3.0 - SEO Growth Content Batch 01

Date: 2026-07-16

### Added
- Added docs/SEO_ROADMAP.md with 300 unique B2B article topics across 20 topic clusters.
- Added six long-form English Blog articles for supplier qualification, private-label launches, factory audits, packaging, landed cost and quality control.
- Added the new articles to the static Blog route set, sitemap, RSS feed and route-level SEO generation.

### Changed
- Added product, factory advantages and contact internal links to Blog article content.
- Added related-article links to static Blog HTML so crawlers can discover the content without relying on client-side rendering.
- Replaced the Blog listing fixed reading-time label with article-length-based reading time.

### Verified
- npm.cmd run lint passed for 75 public routes.
- npm.cmd run build completed successfully.
- 18 Blog articles generated as static HTML.
- dist/sitemap.xml contains 18 Blog article URLs.
- dist/rss.xml contains 18 Blog feed items.
- GitHub push completed for commit 198c69a.
- Vercel Production deployment completed and the six new Blog URLs return HTTP 200.
- Live sitemap contains the six new Blog URLs and live RSS contains 18 items.

## v1.2.0 - Technical SEO Feed Infrastructure

Date: 2026-07-16

### Added
- Added build-time RSS feed generation at `/rss.xml` for SEO Blog articles.
- Added build-time HTML sitemap generation at `/sitemap.html` for buyers and search engines.
- Added RSS discovery link to the global document head and generated route-level SEO heads.
- Added Article Open Graph published/modified time tags for Blog article static HTML.

### Changed
- Updated the production build pipeline to generate RSS and HTML sitemap assets after route-level static SEO output.
- Updated Vercel routing exclusions so `/rss.xml` and `/sitemap.html` are served as static SEO files instead of falling back to the SPA shell.
- Added Vercel content-type headers for RSS and HTML sitemap assets.

### Verified
- Confirmed previous SEO Blog deployment completed successfully on Vercel for commit `416ddc2`.
- `npm.cmd run lint` passed for 69 public routes.
- `npm.cmd run build` completed successfully.
- Verified `dist/rss.xml` contains 12 Blog feed items.
- Verified `dist/sitemap.html` contains 69 public routes and 12 Blog article links.
- Verified Blog article static HTML includes RSS discovery, Article Schema, FAQ Schema, Buyer Checklist content, and article time tags.
- GitHub push completed for commit `8b5d207`.
- Vercel production deployment completed successfully for commit `8b5d207`.
- Live `https://www.jczcare.com/rss.xml` returns `application/rss+xml` with 12 items.
- Live `https://www.jczcare.com/sitemap.html` returns a static HTML sitemap with Blog links.
- Live `https://www.jczcare.com/sitemap.xml` returns `application/xml` with Blog URLs.

## v1.1.9 - SEO Blog Foundation

Date: 2026-07-15

### Added
- Added 12 English SEO Blog articles targeting B2B pet pad OEM/ODM sourcing intent.
- Added `/blog` listing page and `/blog/[slug]` article detail pages.
- Added Blog article data module with titles, slugs, keywords, summaries, FAQs, buyer checklists, CTA links, related articles, author, publish date, update date, image alt text, and metadata.
- Added Blog Article Schema, FAQ Schema, canonical URLs, Open Graph, Twitter Card support, and static article body output during build.
- Added Blog routes to sitemap/static route generation.
- Added responsive Blog page styles for desktop and mobile layouts.

### Verified
- `npm.cmd run lint` passed for 69 public routes.
- `npm.cmd run build` completed successfully.
- Verified all 12 Blog article files are generated in `dist/blog/`.
- Verified sitemap contains `/blog` plus all 12 Blog article URLs.
- Verified generated article HTML contains body text, title, description, canonical, Article Schema, FAQ Schema, and Buyer Checklist content.

## v1.1.8 - Google Sheet ID Runtime Verification

Date: 2026-07-15

### Added
- Added explicit runtime logging for `Runtime GOOGLE_SHEET_ID =` to verify the exact Spreadsheet ID used by Vercel at request time.

### Checked
- Searched the project for the reported stale Spreadsheet ID.
- Confirmed no hardcoded Spreadsheet ID or default `GOOGLE_SHEET_ID` fallback exists in project source.
- Confirmed Google Sheets access still reads Spreadsheet ID only from `process.env.GOOGLE_SHEET_ID`.

### Verified
- `npm.cmd run lint` passed for 57 public routes.
- `npm.cmd run build` completed successfully.
- GitHub push completed.
- Vercel deployment completed successfully for commit `f3dec97`.

## v1.1.7 - Google Sheets Service Account Diagnostics

Date: 2026-07-15

### Added
- Added safe runtime diagnostics for `GOOGLE_CLIENT_EMAIL` and `GOOGLE_PROJECT_ID`.
- Kept existing `GOOGLE_SHEET_ID`, `GOOGLE_SHEET_NAME`, and `spreadsheets.get` diagnostics.
- Updated Spreadsheet GET failure logging to show response status, response data, and error message.

### Security
- Confirmed `GOOGLE_PRIVATE_KEY` is not logged.
- Removed full Spreadsheet GET error object logging to reduce sensitive diagnostic noise.

### Verified
- `npm.cmd run lint` passed for 57 public routes.
- `npm.cmd run build` completed successfully.

## v1.1.6 - Google Sheets Diagnostics Added

Date: 2026-07-15

### Added
- Added runtime diagnostics for `GOOGLE_SHEET_ID` and `GOOGLE_SHEET_NAME`.
- Added `spreadsheets.get` check before appending inquiry rows.
- Added logs for the actual `spreadsheetId` and `range` used by Google Sheets append.
- Added 404 response data logging for Google Sheets GET and append failures.

### Verified
- Confirmed no private key value is logged.
- `npm.cmd run lint` passed for 57 public routes.
- `npm.cmd run build` completed successfully.

## v1.1.5 - Google Sheets Sync Deployment Fix

Date: 2026-07-15

### Changed
- Updated Google Sheets range to use `GOOGLE_SHEET_NAME`, defaulting to `工作表1`.
- Ensured `/api/contact` sends email first, then awaits Google Sheets append only after Resend succeeds.
- Updated Google Sheets logging to `Google Sheets append succeeded` on success.
- Updated Google Sheets failure logging to `Google Sheets append failed` with a safe error message only.

### Verified
- Confirmed `googleapis` is listed in `package.json`.
- Confirmed `GOOGLE_PRIVATE_KEY` is normalized with `replace(/\\n/g, '\n')`.
- Confirmed `spreadsheets.values.append` uses `valueInputOption: USER_ENTERED` and `insertDataOption: INSERT_ROWS`.
- API test confirmed Resend success returns success even when Google Sheets append fails.
- API test confirmed Resend failure still returns a failure response.
- `npm.cmd run lint` passed for 57 public routes.
- `npm.cmd run build` completed successfully.

## v1.1.4 - Google Sheets Inquiry Sync Added

Date: 2026-07-15

### Added
- Added `googleapis` dependency for direct Google Sheets API integration.
- Added `services/googleSheets.js` to append each inquiry as a new Google Sheets row.
- Added `services/email.js` to keep Resend email delivery separate from contact API flow control.
- Added Google Sheets environment placeholders to `.env.example`.

### Changed
- Refactored `/api/contact` so it validates inquiry data, calls `sendEmail()`, and calls `appendInquiryToGoogleSheets()`.
- Google Sheets sync now runs independently from Resend email delivery.
- Google Sheets failures are logged with `console.error()` and do not make the customer-facing form fail when Resend succeeds.

### Verified
- API test confirmed Resend success still returns success when Google Sheets sync fails.
- API test confirmed Resend failure still returns a customer-facing failure response.
- `npm.cmd run lint` passed for 57 public routes.
- `npm.cmd run build` completed successfully.

## v1.1.3 - Contact Sender Environment Enforcement

Date: 2026-07-15

### Changed
- Confirmed the final inquiry recipient remains `hengtuo@nthengtuo.com`.
- Updated `/api/contact` so the sender address is read only from `CONTACT_FROM_EMAIL`.
- Removed the hardcoded fallback sender address from the contact email endpoint.

### Verified
- API mock test confirmed `to` is `hengtuo@nthengtuo.com`.
- API mock test confirmed `from` comes from `CONTACT_FROM_EMAIL`.
- API mock test confirmed `reply_to` is the inquiry user's email address.
- `npm.cmd run lint` passed for 57 public routes.
- `npm.cmd run build` completed successfully.

## v1.1.2 - Real Server-Side Inquiry Email Sending

Date: 2026-07-14

### Added
- Added hardened server-side contact email handling through the existing Vercel `/api/contact` endpoint.
- Added HTML and plain-text inquiry email rendering for Resend delivery.
- Added honeypot spam protection, content-length limiting, field length limits, input sanitization, and basic per-IP rate limiting.
- Added front-end honeypot field, field max lengths, autocomplete hints, duplicate-submit prevention, and disabled loading state.

### Changed
- Strengthened the shared Contact / Inquiry / Request form so success is shown only after the server endpoint returns success.
- Preserved user-entered values on send failure and clears the form only after successful delivery.
- Standardized failure fallback text with a clickable `mailto:hengtuo@nthengtuo.com` backup.
- Updated `.env.example` so `CONTACT_FROM_EMAIL` is an explicit production placeholder instead of a production-looking default.

### Verified
- API test: empty form is rejected.
- API test: invalid email is rejected.
- API test: honeypot spam field is rejected.
- API test: missing `RESEND_API_KEY` returns a failure and does not show fake success.
- API test: mocked Resend success includes `reply_to`, HTML body, and text body.
- `npm.cmd run lint` passed for 57 public routes.
- `npm.cmd run build` completed successfully.

### Notes
- Live sending requires Vercel environment variables and a verified Resend sender/domain.
- No deployment was triggered for this task.

## v1.1.1 - Contact Email and Inquiry Routing Unified

Date: 2026-07-14

### Added
- Added `/api/contact` serverless endpoint for website inquiry email delivery through Resend.
- Added environment placeholders for `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL`.
- Added reusable inquiry form validation, loading state, success state, and failure state.

### Changed
- Unified visible website email contact to `hengtuo@nthengtuo.com`.
- Converted visible email contact points into clickable `mailto:` links with prefilled inquiry subjects and quotation body where relevant.
- Replaced the static contact-page form with the reusable inquiry form that submits to `/api/contact`.
- Updated structured data email output to use the unified contact email.

### Verified
- `npm.cmd run lint` passed for 57 public routes.
- `npm.cmd run build` completed successfully.
- Global search found no remaining legacy email strings or the previous typo email.

### Notes
- Real email sending requires Vercel environment variables and a verified Resend sender/domain before production use.
- No deployment was triggered for this task.

## v1.1.0 - Technical SEO Foundation Implemented

Date: 2026-07-14

### Added
- Added build-time WebP generation for public image assets.
- Added route-level static SEO HTML generation for all public routes.
- Added shared SEO page data for canonical URLs, metadata, Open Graph, Twitter Card, and JSON-LD output.
- Added SEO validation script to check route metadata, duplicate titles, duplicate descriptions, canonical format, and image availability.
- Added Product Schema for product detail routes.
- Added FAQ Schema support for FAQ-oriented pages.
- Added Breadcrumb, Organization, and WebSite schema output in generated static HTML.

### Changed
- Updated the production build command to generate WebP assets, build the Vite app, and generate route-level SEO HTML.
- Optimized homepage default meta description for clearer B2B source-factory positioning.
- Improved internal linking by adding key commercial SEO pages to footer navigation.
- Replaced major visible images with a WebP-aware optimized image component using native lazy loading and async decoding.
- Improved image alt text across product, news, factory, learning, and SEO landing page visuals.

### Verified
- `npm.cmd run lint` passed for 57 public routes.
- `npm.cmd run build` completed successfully.
- `dist/sitemap.xml` begins with XML and contains 57 URLs.
- `dist/robots.txt` points to `https://www.jczcare.com/sitemap.xml`.
- Generated route HTML includes unique title, description, canonical, Open Graph, Twitter Card, and JSON-LD metadata.
- Product detail HTML includes Product Schema.
- FAQ/contact HTML includes FAQ Schema where applicable.

### Notes
- No deployment was triggered.
- The project remains Vite + React, so Next/Image was addressed through a Vite-compatible optimized image component and generated WebP assets.
- Vite still reports the existing Silk animation chunk as larger than 500 kB; this is a performance warning, not a build failure.

## v1.0.1 - Checkpoint Workflow Enabled

Date: 2026-07-14

### Added
- Added checkpoint-mode operating rule for future development work.
- Added requirement to save progress after every completed task.
- Added requirement to update `CHANGELOG.md` and `ROADMAP.md` after each completed task.
- Added current checkpoint tracking through `docs/CHECKPOINT.md`.

### Completed Before This Checkpoint
- Footer social media icon links were removed and deployed.
- Apple ID sign-in option and backend Apple auth route were removed and deployed.
- Project documentation system was initialized.
- Sprint 01 audit work was started but not yet completed.

### Notes
- Future work must continue from the latest checkpoint instead of restarting the project.
- Website source code was not modified for this checkpoint setup.

## v1.0.0 - Documentation System Initialized

### Added
- Created the `docs/` documentation system.
- Added master project prompt documentation.
- Added AI development rules.
- Added business strategy documentation.
- Added roadmap documentation.
- Added sprint audit documentation.
- Added changelog file.

### Notes
- This version initializes long-term project documentation only.
- No website source code changes are included in this documentation initialization.
- Future website changes should be recorded here with version number, date, summary, files changed, and verification status.

## Future Changelog Format

### vX.X.X - Title

Date: To be added.

Added:
- To be added.

Changed:
- To be added.

Fixed:
- To be added.

Verified:
- To be added.
