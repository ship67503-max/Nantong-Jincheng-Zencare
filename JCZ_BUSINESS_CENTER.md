# JCZ Business Center Integration

This website reads managed content from JCZ Business Center through Vercel serverless API routes in this repository.

## Runtime API

The site exposes:

```text
GET /api/public/content
GET /api/public/content?type=product
GET /api/public/content?type=banner
GET /api/public/content?type=seo
GET /api/public/content?type=news
POST /api/sign-in
```

The browser script `/jcz-business-center.js` reads these same-origin endpoints by default, so no separate `business-api.jczcare.com` service is required for website content updates.

## Managed Content Directory

JCZ Business Center publishes JSON files into:

```text
data/jcz-business-center/product/*.json
data/jcz-business-center/news/*.json
data/jcz-business-center/banner/*.json
data/jcz-business-center/seo/*.json
```

Only records with `status: "published"` are returned by the public API.

## Business Account Registration

The website sign-in page submits business account records to:

```text
POST /api/sign-in
```

For production, configure a durable backend receiver:

```text
JCZ_BUSINESS_CENTER_WEBHOOK_URL=https://your-business-system.example.com/account-registration
```

The API never stores plain-text passwords. Passwords are converted to a salted PBKDF2 hash before the record is sent to the business backend. Local development may write temporary JSON files into:

```text
data/jcz-business-center/account/*.json
```

These local JSON records are ignored by Git and should not be committed.

## Desktop Publishing Settings

In JCZ Business Center, use:

```text
网站发布模式: GitHub + Vercel
GitHub Owner: ship67503-max
GitHub Repo: Nantong-Jincheng-Zencare
GitHub Branch: main
内容文件目录: data/jcz-business-center
```

The desktop system also needs a fine-grained GitHub token with `Contents: Read and write` for this repository. Vercel will automatically redeploy after each GitHub commit to `main`.

## Content Effects

Published products can replace the product grid.

Published SEO content can update:

- `document.title`
- meta description
- meta keywords

Published Banner content can update the hero title and intro copy.

If no managed content exists, the site keeps its built-in static content.
