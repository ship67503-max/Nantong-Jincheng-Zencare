# JCZ Business Center Integration

This website can read managed content from JCZ Business Center.

## Vercel Environment Variable

Set this variable in the Vercel project:

```text
VITE_JCZ_BUSINESS_API=https://business-api.jczcare.com
```

The value must point to the public HTTPS URL of the JCZ Business Center API.

## Runtime Content

The site reads:

```text
GET /api/public/content?type=product
GET /api/public/content?type=banner
GET /api/public/content?type=seo
GET /api/public/content?type=news
```

Published products are merged with the built-in product catalog by `slug`.

Published SEO content can update:

- `document.title`
- meta description
- meta keywords

Published Banner content can update the hero title and intro copy.

If `VITE_JCZ_BUSINESS_API` is not configured, the site keeps its built-in static content.
