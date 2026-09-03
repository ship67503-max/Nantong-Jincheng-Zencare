# Image Replacement Report

Generated at: 2026-07-23T09:25:40.105Z

## Summary

- Scanned candidate images: 152
- Usable candidate images: 143
- Excluded candidate images: 9
- Site image locations scanned: 172
- Generated reusable WebP assets: 32
- Generated blog WebP covers: 150
- Generated WebP files total: 182
- Replacement references written: 147

## Verification

- Lint: passed: npm.cmd run lint (topic clusters, content ecosystem, SEO validation for 393 routes)
- Build: passed: npm.cmd run build; Vite built successfully and generated 393 route-level SEO HTML files. Warning only: large chunk size.
- Route image check: passed: 393 routes, 97 unique image URLs, 0 failures
- Browser visual check: passed: desktop and 390px mobile representative checks for product, factory, blog, contact/learn pages; no initial viewport image failures or horizontal overflow found.
- Homepage protection: passed: no diff from checkpoint for index.html, src/styles.css, src/Silk.jsx, and protected homepage image files.

## Deployment

- Status: success
- Production domain: https://www.jczcare.com
- Vercel deployment URL: https://nantong-jincheng-zencare-aq42d47gw-shi-peiyu-s-projects.vercel.app
- Vercel inspector URL: https://vercel.com/shi-peiyu-s-projects/nantong-jincheng-zencare/4BswXnTAeFGtAMqR3VfZDeZ8KpaS
- Vercel project ID: prj_oydn0sYZkzaSe8GggaK4AQyJg69N
- Production check: passed, selected route/image HEAD requests returned 200

## Git

- Checkpoint commit: a587f04
- Image replacement commit: 90633a8
- Deployment report commit: 686dc4d
- Branch: codex/regenerate-non-homepage-images
- Pull request URL: https://github.com/ship67503-max/Nantong-Jincheng-Zencare/pull/new/codex/regenerate-non-homepage-images
- Push status: success, branch pushed to origin/codex/regenerate-non-homepage-images.

## Unsupported / Unreplaced Positions

- Custom Pet Waste Bags product detail and SEO image: kept /images/custom-pet-waste-bags-ai.png. No clean dog-waste-bag material was found outside rejected; the only packaging-like candidates had visible third-party/Japanese promotional text.
- Dog Poop Bags topic/category and generated guide source image: kept /images/custom-pet-waste-bags-ai.png. No clean dog-waste-bag material was found outside rejected; using unrelated pad/factory images would be a semantic mismatch.

## Changed Files

- scripts/seo-page-data.mjs
- src/authorityData.js
- src/blogData.js
- src/blogExpansionData.js
- src/factoryData.js
- src/main.jsx
- src/seoGrowthArticles.js
- src/topicClusters.js

## Excluded Images

- #36 D:\WebsiteImages\incoming\22张\reviewed-0062-original.jpg: Visible text/third-party promotional content or unsafe crop
- #131 D:\WebsiteImages\incoming\66张\reviewed-0033-original.jpg: Visible text/third-party promotional content or unsafe crop
- #143 D:\WebsiteImages\incoming\ChatGPT Image 2026年7月23日 16_09_58.png: Visible text/third-party promotional content or unsafe crop
- #144 D:\WebsiteImages\incoming\ChatGPT Image 2026年7月23日 16_16_29.png: Visible text/third-party promotional content or unsafe crop
- #148 D:\WebsiteImages\qa-temp\contact-1.jpg: Contact sheet or QA screenshot, not a website material
- #149 D:\WebsiteImages\qa-temp\contact-2.jpg: Contact sheet or QA screenshot, not a website material
- #150 D:\WebsiteImages\qa-temp\contact-3.jpg: Contact sheet or QA screenshot, not a website material
- #151 D:\WebsiteImages\qa-temp\contact-4.jpg: Contact sheet or QA screenshot, not a website material
- #152 D:\WebsiteImages\qa-temp\new-incoming-contact-sheet.jpg: Contact sheet or QA screenshot, not a website material
