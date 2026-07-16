import fs from 'node:fs/promises';
import path from 'node:path';
import { resolvePublicRoutes } from './seo-routes.mjs';
import { getSeoEntry, organization, productSeo, siteUrl } from './seo-page-data.mjs';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const templatePath = path.join(distDir, 'index.html');
const staticRoutes = resolvePublicRoutes();

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const absoluteUrl = (url = '/') => {
  if (url.startsWith('http')) {
    return url;
  }
  return `${siteUrl}${url.startsWith('/') ? url : `/${url}`}`;
};

const productMap = new Map(productSeo.map((product) => [product.path, product]));

const renderStaticArticle = (article) => {
  if (!article) {
    return '';
  }

  const sectionHtml = article.sections.map((section) => [
    `<section>`,
    `<h2>${escapeHtml(section.heading)}</h2>`,
    section.h3 ? `<h3>${escapeHtml(section.h3)}</h3>` : '',
    ...section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`),
    `</section>`,
  ].join('\n')).join('\n');

  const checklistHtml = article.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n');
  const faqHtml = article.faqs.map(([question, answer]) => [
    `<section>`,
    `<h3>${escapeHtml(question)}</h3>`,
    `<p>${escapeHtml(answer)}</p>`,
    `</section>`,
  ].join('\n')).join('\n');

  return [
    `<main class="static-blog-content">`,
    `<article>`,
    `<p>${escapeHtml(article.category)} | ${escapeHtml(article.author)} | ${escapeHtml(article.publishedAt)}</p>`,
    `<h1>${escapeHtml(article.title)}</h1>`,
    `<p>${escapeHtml(article.intro)}</p>`,
    `<nav aria-label="Table of contents"><h2>Table of contents</h2><ol>${article.toc.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol></nav>`,
    sectionHtml,
    `<section><h2>Buyer Checklist</h2><ul>${checklistHtml}</ul></section>`,
    `<section><h2>FAQ</h2>${faqHtml}</section>`,
    `<section><h2>${escapeHtml(article.cta.title)}</h2><p>${escapeHtml(article.cta.text)}</p></section>`,
    `</article>`,
    `</main>`,
  ].join('\n');
};

const buildJsonLd = (entry) => {
  const canonical = absoluteUrl(entry.path);
  const image = absoluteUrl(entry.image);
  const graph = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: organization.name,
      alternateName: organization.alternateName,
      url: siteUrl,
      email: organization.email,
      telephone: organization.telephone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: organization.addressLocality,
        addressRegion: organization.addressRegion,
        addressCountry: organization.addressCountry,
      },
      sameAs: organization.sameAs,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'JCZCARE',
      url: siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/pages/news?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: entry.title, item: canonical },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': entry.type || 'WebPage',
      name: entry.title,
      description: entry.description,
      url: canonical,
      image,
      isPartOf: { '@type': 'WebSite', name: 'JCZCARE', url: siteUrl },
      publisher: { '@type': 'Organization', name: organization.name },
    },
  ];

  const product = productMap.get(entry.path);
  if (product) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.productName,
      category: product.category,
      image,
      description: product.description,
      brand: { '@type': 'Brand', name: 'JCZCARE' },
      manufacturer: { '@type': 'Organization', name: organization.name },
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceCurrency: 'USD',
        url: canonical,
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'USD',
          description: 'OEM pricing depends on specification, packaging, and order quantity.',
        },
      },
    });
  }

  if (entry.article) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: entry.article.title,
      description: entry.article.metaDescription,
      image,
      datePublished: entry.article.publishedAt,
      dateModified: entry.article.updatedAt,
      author: {
        '@type': 'Organization',
        name: entry.article.author,
      },
      publisher: {
        '@type': 'Organization',
        name: organization.name,
      },
      mainEntityOfPage: canonical,
      articleSection: entry.article.category,
      keywords: [entry.article.primaryKeyword, ...entry.article.secondaryKeywords].join(', '),
      articleBody: entry.articleBody,
    });
  }

  if (entry.faqs?.length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: entry.faqs.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    });
  }

  return JSON.stringify(graph);
};

const managedHeadPattern =
  /<title>[\s\S]*?<\/title>|<meta\s+(?:name|property)="(?:description|robots|og:title|og:description|og:type|og:url|og:image|twitter:card|twitter:title|twitter:description|twitter:image|article:published_time|article:modified_time)"[\s\S]*?>|<link\s+rel="canonical"[\s\S]*?>|<link\s+rel="alternate"\s+type="application\/rss\+xml"[\s\S]*?>|<script id="jczcare-jsonld" type="application\/ld\+json">[\s\S]*?<\/script>/g;

const renderHead = (entry) => {
  const canonical = absoluteUrl(entry.path);
  const image = absoluteUrl(entry.image);
  return [
    `<title>${escapeHtml(entry.title)}</title>`,
    `<meta name="description" content="${escapeHtml(entry.description)}" />`,
    '<meta name="robots" content="index, follow, max-image-preview:large" />',
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<link rel="alternate" type="application/rss+xml" title="JCZCARE OEM Pet Pad Manufacturing Insights" href="${siteUrl}/rss.xml" />`,
    `<meta property="og:title" content="${escapeHtml(entry.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(entry.description)}" />`,
    `<meta property="og:type" content="${entry.type === 'Article' ? 'article' : 'website'}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(entry.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(entry.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    entry.article ? `<meta property="article:published_time" content="${escapeHtml(entry.article.publishedAt)}" />` : '',
    entry.article ? `<meta property="article:modified_time" content="${escapeHtml(entry.article.updatedAt)}" />` : '',
    `<script id="jczcare-jsonld" type="application/ld+json">${buildJsonLd(entry)}</script>`,
  ].filter(Boolean).join('\n    ');
};

const writeHtml = async (route, html) => {
  if (route === '/') {
    await fs.writeFile(templatePath, html);
    return;
  }
  const outDir = path.join(distDir, ...route.split('/').filter(Boolean));
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, 'index.html'), html);
};

const template = await fs.readFile(templatePath, 'utf8');
let written = 0;

for (const route of staticRoutes) {
  const entry = getSeoEntry(route);
  const staticContent = renderStaticArticle(entry.article);
  const bodyTemplate = staticContent
    ? template.replace('<div id="root"></div>', `<div id="root">${staticContent}</div>`)
    : template;
  const cleaned = bodyTemplate.replace(managedHeadPattern, '').replace('</head>', `    ${renderHead(entry)}\n  </head>`);
  await writeHtml(route, cleaned);
  written += 1;
}

console.log(`Generated route-level SEO HTML for ${written} route${written === 1 ? '' : 's'}.`);
