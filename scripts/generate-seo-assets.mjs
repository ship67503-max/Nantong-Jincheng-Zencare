import fs from 'node:fs/promises';
import path from 'node:path';
import { resolvePublicRoutes } from './seo-routes.mjs';
import { getSeoEntry, siteUrl } from './seo-page-data.mjs';
import { blogArticles } from '../src/blogData.js';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const buildDate = new Date().toISOString();

const escapeXml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const absoluteUrl = (route = '/') => `${siteUrl}${route === '/' ? '/' : route}`;

const blogItems = blogArticles.map((article) => ({
  title: article.title,
  description: article.metaDescription,
  url: absoluteUrl(article.path),
  pubDate: new Date(article.publishedAt).toUTCString(),
  updatedAt: article.updatedAt,
  category: article.category,
}));

const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>JCZCARE OEM Pet Pad Manufacturing Insights</title>
    <link>${siteUrl}/blog</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Practical OEM/ODM pet pad manufacturing insights for brands, importers, distributors, and private-label buyers.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${blogItems.map((item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid isPermaLink="true">${escapeXml(item.url)}</guid>
      <description>${escapeXml(item.description)}</description>
      <category>${escapeXml(item.category)}</category>
      <pubDate>${item.pubDate}</pubDate>
    </item>`).join('\n')}
  </channel>
</rss>
`;

const routes = resolvePublicRoutes();
const groupedRoutes = routes.reduce((groups, route) => {
  const section = route === '/'
    ? 'Core'
    : route.startsWith('/blog')
      ? 'Blog'
      : route.startsWith('/products')
        ? 'Products'
        : route.startsWith('/pages')
          ? 'Resources'
          : route.startsWith('/region')
            ? 'Regions'
            : 'SEO Landing Pages';
  groups[section] = groups[section] || [];
  groups[section].push(route);
  return groups;
}, {});

const sitemapHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${siteUrl}/sitemap.html" />
    <title>HTML Sitemap | JCZCARE</title>
    <meta name="description" content="Browse all public JCZCARE pages, product pages, OEM resources, blog articles, and regional sourcing pages." />
    <style>
      body { margin: 0; font-family: Arial, sans-serif; background: #07130e; color: #f6f8ed; }
      main { width: min(1180px, calc(100% - 40px)); margin: 0 auto; padding: 72px 0; }
      h1 { font-size: clamp(42px, 7vw, 88px); line-height: .95; margin: 0 0 18px; }
      p { color: rgba(246, 248, 237, .72); font-size: 18px; max-width: 760px; line-height: 1.7; }
      section { border-top: 1px solid rgba(246, 248, 237, .14); padding: 32px 0; }
      h2 { color: #d9fb76; font-size: 15px; letter-spacing: .08em; text-transform: uppercase; }
      ul { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; padding: 0; list-style: none; }
      a { display: block; color: #f6f8ed; text-decoration: none; border: 1px solid rgba(246, 248, 237, .14); border-radius: 18px; padding: 14px 16px; background: rgba(255,255,255,.04); }
      a:hover { border-color: rgba(217, 251, 118, .7); color: #d9fb76; }
    </style>
  </head>
  <body>
    <main>
      <p>JCZCARE Sitemap</p>
      <h1>All public pages for OEM pet pad buyers.</h1>
      <p>This HTML sitemap helps buyers and search engines find JCZCARE factory profiles, OEM services, product pages, regional pages, and B2B blog resources.</p>
${Object.entries(groupedRoutes).map(([section, sectionRoutes]) => `      <section>
        <h2>${escapeXml(section)}</h2>
        <ul>
${sectionRoutes.map((route) => {
  const entry = getSeoEntry(route);
  return `          <li><a href="${route}">${escapeXml(entry.title.replace(' | JCZCARE', '').replace(' | Nantong JINCHENG ZENCARE', ''))}</a></li>`;
}).join('\n')}
        </ul>
      </section>`).join('\n')}
      <p>Last updated: ${escapeXml(buildDate)}</p>
    </main>
  </body>
</html>
`;

await fs.writeFile(path.join(distDir, 'rss.xml'), rssXml, 'utf8');
await fs.writeFile(path.join(distDir, 'sitemap.html'), sitemapHtml, 'utf8');

console.log(`Generated RSS feed with ${blogItems.length} items.`);
console.log(`Generated HTML sitemap with ${routes.length} public routes.`);
