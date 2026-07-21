# JCZCARE Website Roadmap

## Roadmap Overview
This roadmap organizes the JCZCARE website into practical development sprints. Each sprint should improve trust, SEO, conversion, maintainability, or business value.

## Current Status
Checkpoint mode: Enabled  
Latest checkpoint file: `docs/CHECKPOINT.md`  
Active sprint: Sprint 05 and Sprint 06 authority expansion
Sprint 01 status: Completed as Technical SEO Foundation  
Latest completed task: 325-page B2B content ecosystem with 150 Blog articles, 40 Buyer Guides, expanded comparisons, case studies, factory knowledge, material knowledge, FAQs, reports, and resources, deployed and verified on Vercel Production
Next required deliverable: Use Search Console data to improve the highest-opportunity clusters and conversion paths rather than adding undirected volume

Difficulty scale:

- Low: simple content or configuration work.
- Medium: multiple files, moderate testing, or content design.
- High: complex UX, data, backend, SEO architecture, or deployment risk.

ROI scale:

- Low: useful but limited impact.
- Medium: supports growth or maintenance.
- High: directly improves traffic, trust, conversion, or operations.

## Sprint 01: Technical SEO Audit and Stability
Priority: Critical  
Difficulty: Medium  
Expected ROI: High
Status: Completed as Technical SEO Foundation

Goals:

- Implement sitemap, robots.txt, metadata, schema, canonical URLs, image optimization, WebP generation, and route-level SEO output.
- Confirm Google Search Console readiness.
- Validate duplicate titles, duplicate descriptions, canonical URLs, and image availability.

Deliverables:

- Build-time sitemap and robots generation.
- Route-level metadata and JSON-LD output.
- SEO validation script.
- WebP generation and optimized image component.
- RSS feed for Blog articles.
- HTML sitemap for public routes.
- Successful lint and production build.

## Sprint 02: Core Trust and Factory Positioning
Priority: Critical  
Difficulty: Medium  
Expected ROI: High
Status: Major factory resource milestone completed

Goals:

- Strengthen About, factory profile, quality control, and OEM process messaging.
- Improve factory credibility and buyer confidence.
- Align copy with source factory positioning.

Deliverables:

- Refined factory trust content.
- Clearer quality control content.
- Stronger OEM/ODM explanation.
- Better internal links to inquiry pages.

Completed increment:

- Added a Factory Center with ten dedicated process and capability pages.
- Added buyer-focused workflows, specifications, photography, related products, related articles, FAQs, breadcrumbs, and inquiry CTAs.
- Added production-line, warehouse, raw-material, QC, laboratory, packaging, loading, SAP, PE-film, and certificate-documentation topics.
- Added static SEO output and structured data for every factory page.

## Sprint 03: Product Page System
Priority: High  
Difficulty: High  
Expected ROI: High

Goals:

- Improve product detail pages for every product category.
- Add structured product content for B2B buyers.
- Clarify customization options, sample workflow, and use cases.

Deliverables:

- Product page template improvements.
- Product-specific SEO metadata.
- Product FAQ sections.
- Better CTA flow to request product plan.

## Sprint 04: Inquiry and Lead System
Priority: High  
Difficulty: High  
Expected ROI: High
Status: Partially Completed

Goals:

- Improve inquiry form usability.
- Capture product interest, country, contact method, and requirement details.
- Plan backend recording or CRM integration.

Deliverables:

- Better request form UX. Completed: shared inquiry form with loading, disabled submit state, duplicate-submit prevention, and failure fallback.
- Validation and success states. Completed: required name/email/message, max lengths, front-end and server-side checks, success state, and error fallback.
- Inquiry storage strategy. Partially completed: inquiries can now sync to Google Sheets through Google Sheets API.
- WhatsApp and email conversion paths. Completed: unified visible email, `mailto` fallback, and Resend-based server-side inquiry endpoint.

Completed increment:

- Unified all visible email contact points to `hengtuo@nthengtuo.com`.
- Added hardened `/api/contact` endpoint for Resend-based delivery.
- Added Vercel/Resend environment variable placeholders.
- Replaced the static contact-page form with the validated reusable inquiry form.
- Added HTML and plain-text email output, Reply-To handling, honeypot protection, input sanitization, content-length checks, and basic rate limiting.
- Added Google Sheets API sync for Contact / Inquiry / Request submissions.
- Added service separation for email delivery and Google Sheets append operations.
- Added safe Google Sheets diagnostics for service account identity and Spreadsheet GET failures.
- Added runtime Sheet ID verification to confirm the exact Vercel environment value used by Google Sheets sync.

Remaining:

- Configure production Resend sender/domain and Vercel environment variables.
- Configure Google Cloud service account, share the target Google Sheet, and add Google Sheets environment variables to Vercel.
- Decide whether Google Sheets should later sync into CRM, database, or JCZ Business Center.

## Sprint 05: Commercial SEO Landing Pages
Priority: High  
Difficulty: Medium  
Expected ROI: High

Status: Major authority-system milestone completed

Goals:

- Expand pages targeting B2B search intent.
- Build keyword clusters around OEM pet pads, private label, manufacturer, factory, quality control, and absorbent core development.

Deliverables:

- Completed increment: created the first 12 English SEO Blog articles targeting B2B OEM/ODM pet pad sourcing intent.
- Completed increment: added `/blog` and `/blog/[slug]` with static metadata, schema, internal links, related articles, and inquiry CTA.
- Completed increment: added Blog URLs to sitemap/static SEO generation.
- Completed increment: expanded the Blog content system to 100 connected B2B articles.
- Completed increment: added 15 commercial pillar pages with cluster navigation, FAQs, schema, related products, and conversion links.
- Completed increment: added the expanded authority routes to sitemap, RSS, static HTML, and internal-link generation.
- Completed increment: expanded the complete target system to 150 Blog articles, 40 Buyer Guides, 30 comparisons, 20 case studies, 20 factory pages, 15 material pages, 15 FAQ landing pages, 10 reports, 15 pillars, and 10 buyer resources.
- Completed increment: added exact count, word-range, metadata, component-contract, internal-link, and duplicate-paragraph validation.

## Sprint 06: Blog and Knowledge Center
Priority: Medium  
Difficulty: Medium  
Expected ROI: Medium to High

Goals:

- Build topical authority.
- Educate buyers about product structure, packaging, quality, and OEM process.
- Support Google and AI search visibility.

Deliverables:

- Blog content framework.
- Editorial calendar.
- Article templates.
- Related links and CTAs.

Completed increment:

- Added a 300-topic SEO content map covering 20 B2B buyer-intent clusters.
- Added six new English long-form articles and expanded the Blog route set to 18 articles.
- Added static internal links to factory, customization, product, advantages, contact and related-article routes.
- Added dynamic reading-time labels based on article text length.
- Deployed and verified the six new Blog URLs in Vercel Production.
- Expanded the content library to 100 articles and organized them beneath 15 authoritative pillar pages.
- Added build-time cover generation for the expanded Blog library.
- Added automated topic-cluster validation to prevent orphaned articles, missing metadata, and broken cluster relationships.
- Added dedicated Buyer Guide, Materials, Reports, and Resource centers with cross-cluster product and inquiry links.
- Expanded the generated route set to 393 public pages and the RSS feed to 150 articles.

## Sprint 07: Performance and Core Web Vitals
Priority: High  
Difficulty: High  
Expected ROI: High

Goals:

- Optimize media loading.
- Review JavaScript bundle size.
- Improve LCP, CLS, INP, and mobile responsiveness.

Deliverables:

- Image optimization plan.
- Video optimization plan.
- Bundle analysis.
- Core Web Vitals action list.

Completed increment:

- Replaced a global 3.2 MB JPEG preload with its 148 KB WebP equivalent.
- Converted blocking Google display-font CSS import to non-blocking head loading.
- Improved a representative new Blog article Lighthouse performance score from 86 to 94 while retaining SEO 100 and Best Practices 100.

## Sprint 08: Accessibility and Responsive Refinement
Priority: Medium  
Difficulty: Medium  
Expected ROI: Medium

Goals:

- Improve usability across screen sizes.
- Strengthen accessibility basics.
- Ensure key CTAs and forms are easy to use.

Deliverables:

- Accessibility audit.
- Responsive layout fixes.
- Button and link label review.
- Contrast and keyboard navigation notes.

## Sprint 09: Schema and AI Search Optimization
Priority: Medium  
Difficulty: Medium  
Expected ROI: High

Goals:

- Improve structured data.
- Support Google AI Overview and AI-powered search engines.
- Make business facts machine-readable.

Deliverables:

- Organization schema review.
- WebSite schema review.
- Breadcrumb schema.
- FAQ schema.
- Page-level entity optimization.

## Sprint 10: Region and Market Expansion
Priority: Medium  
Difficulty: High  
Expected ROI: Medium to High

Goals:

- Evaluate country-specific content opportunities.
- Improve region pages if search demand supports them.
- Consider localization only after data confirms value.

Deliverables:

- Country opportunity analysis.
- Region content plan.
- Localization rules.
- hreflang recommendation if needed.

## Sprint 11: Analytics, Tracking and Reporting
Priority: High  
Difficulty: Medium  
Expected ROI: High

Goals:

- Track conversions and user behavior.
- Connect Google Search Console insights to page improvements.
- Create repeatable reporting.

Deliverables:

- Analytics implementation plan.
- Conversion event map.
- Monthly SEO dashboard outline.
- Inquiry source tracking plan.

## Sprint 12: Long-Term Content and Authority System
Priority: Medium  
Difficulty: High  
Expected ROI: High

Goals:

- Build repeatable content production.
- Create buyer education assets.
- Support LinkedIn and Google growth together.

Deliverables:

- Content calendar.
- LinkedIn post themes.
- Blog clusters.
- Case study format.
- Factory visual content guidelines.

Current growth focus:

- Publish from docs/SEO_ROADMAP.md in commercial-intent clusters before broad informational expansion.
- Improve existing 18 articles with measured Search Console query coverage, first-hand factory evidence and stronger inquiry paths.
- Add verified factory process, quality and packaging evidence only when source material is available.
