# Production recovery / Meta Pixel review

## Baselines

- Actual Production: `dpl_9GLx1s5c7y4yJNCPZb8sfEzgJWhs`, recorded Git SHA `6fba93689bab55808d9121f11ad8d63de9ad67ba`, ref `codex/google-ads-conversion-tracking`, `gitDirty=1`.
- Verified original-upload recovery snapshot: `0390a198720b9bd80466bc6d4862b321eafcda75` (`codex/production-source-recovery`). 3,808 necessary source/build/resource files matched deployment SHA1 UIDs. Customer databases and development backups were excluded. This is not a complete business-system backup.
- New incremental branch: `codex/production-recovery-meta-safe`. Do not deploy PR #1 or substitute the old main tree for the recovered storefront.
- Pixel ID `1532666838061135` verified from the user's Meta Settings screenshot. The shorter historical ID must not be used.

## Increment relative to recovery snapshot

- `src/productionPixel.js`: one installer, explicit worldwide marketing opt-in, trackSingle events, route deduplication, product-ID allowlist, save-receipt/UUID-gated Lead, session/memory deduplication, withdrawal handling, no customer fields in custom event parameters. SDK/document/referrer URLs containing recognized personal prefill fields block tracking. This heuristic is not a universal PII detector.
- `src/storefront/marketing-consent.js` and `.css`: equally accessible allow/reject choices, persistent Cookie preferences button, storage failure defaults to disabled. Existing GA/Ads are unchanged; this panel governs Meta only, and is not a full-site compliance certification.
- `src/storefront/app.js`: actual production route renderer integration; categories and format collection pages do not send ViewContent. Only real source/waste product detail mappings do.
- `src/storefront/contact.js`: stable attempt UUID for unchanged retries, existing busy guard, no automatic retry, Lead only for matching server save receipt; tracking failures cannot change the inquiry success UI. No visible fields changed.
- `api/contact.js`: preserve validation, Turnstile, email, shared business sync, HTTP response semantics; add explicit saved status from awaited Sheets append and stable Lead ID. A Sheets error remains tolerated by the business flow, but does not authorize Meta Lead.
- Two isolated test files cover consent, routing, deduplication, privacy, SDK failures, and production API success/failure receipts. Dependencies are mocked; no real customer-store writes occurred.
- `services/googleSheets.js`, `services/email.js`, metadata, products, media, video code, routes and Vercel config have no incremental changes.

## Validation

- Complete production build: PASS; 625 SEO route HTML, 623 indexable sitemap routes, 438 storefront / 166 library pages.
- Added tests: 19/19 PASS. All tests: 47/51 PASS; the same four recovery-baseline failures remain (three historical contact/email interface mismatches and a legacy noscript-Pixel expectation). Do not report all tests green.
- Lint: FAIL, 461 original SEO/content diagnostics, zero new diagnostics compared with recovery baseline. Do not silence these by changing production SEO.
- Necessary production manifest: only the three expected modified existing files differ. All original media retained byte-for-byte.
- Local real browser: home/category/product/contact navigation and consent reject/allow/reopen work. Contact fields preserved; no inquiry submitted. Localhost is intentionally excluded from real Pixel loading, so these checks do not prove Meta receipt.
- Mobile product overflow was observed both locally and on Production at the same size (375px client width / 400px scroll width). It is an existing issue, retained rather than silently changing the design.

## Preview / release gates

- Preview tracking requires build-only `VITE_META_PIXEL_PREVIEW_ENABLED=true`; only *.vercel.app Preview hosts qualify. No debug query can enable tracking on arbitrary hosts.
- Keep Deployment Protection. Do not promote Preview, merge main or change Production Branch without explicit user approval.
- Meta Test Events must be checked on the user's other computer. Automatic Events being disabled has not yet been independently verified. Check event-setup rules too.
- The API event ID does NOT provide durable, cross-instance write idempotency. Retries can still duplicate business writes; client/session event deduplication is limited to its lifetime/storage scope. No new database was created.
- Real Sheets/email/shared-API end-to-end checks are NOT DONE. Production test data must not be submitted without approval; use an authorized isolated test destination first.
- Second Preview deployment `dpl_FggV9SrUGjLQK8HBpYrohMotYnZW` at commit `73b5ff900720224bc9bc86416632cc2465b24727` was browser-verified under Vercel protection. Reject/unknown consent produced 0 Meta requests; after opt-in, the SDK and PageView requests returned 200. Home, category and product-detail routes emitted exactly one PageView each; the real product detail emitted one ViewContent; regranting on the same route emitted 0 additional events; after withdrawal, navigating to Contact emitted 0 Meta requests. SDK loader count was one. This proves browser-network behavior, not that Events Manager attributed/displayed the events. Pixel Helper/Event Manager and real Lead receipt remain unverified.
- Preview Contact retained all existing fields and had the existing Turnstile unavailable state; submit stayed disabled. No inquiry was sent and Sheets/email/shared API were not contacted.
- Existing GA/Ads initialization is preserved; broader regional privacy requirements for them need a separate assessment.
- Full-page browser coverage and all production functions are not certified by the limited route checks/build.
- Production rollback target remains the unchanged deployment listed above. Use Vercel rollback to that exact deployment if a later, explicitly authorized release fails; do not rebuild a dirty SHA as rollback.

**Current verdict: suitable for controlled Preview review, NOT approved for Production.**
