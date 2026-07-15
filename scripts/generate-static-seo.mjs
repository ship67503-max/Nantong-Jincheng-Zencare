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
  /<title>[\s\S]*?<\/title>|<meta\s+(?:name|property)="(?:description|robots|og:title|og:description|og:type|og:url|og:image|twitter:card|twitter:title|twitter:description|twitter:image)"[\s\S]*?>|<link\s+rel="canonical"[\s\S]*?>|<script id="jczcare-jsonld" type="application\/ld\+json">[\s\S]*?<\/script>/g;

const renderHead = (entry) => {
  const canonical = absoluteUrl(entry.path);
  const image = absoluteUrl(entry.image);
  return [
    `<title>${escapeHtml(entry.title)}</title>`,
    `<meta name="description" content="${escapeHtml(entry.description)}" />`,
    '<meta name="robots" content="index, follow, max-image-preview:large" />',
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta property="og:title" content="${escapeHtml(entry.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(entry.description)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(entry.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(entry.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    `<script id="jczcare-jsonld" type="application/ld+json">${buildJsonLd(entry)}</script>`,
  ].join('\n    ');
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
  const cleaned = template.replace(managedHeadPattern, '').replace('</head>', `    ${renderHead(entry)}\n  </head>`);
  await writeHtml(route, cleaned);
  written += 1;
}

console.log(`Generated route-level SEO HTML for ${written} route${written === 1 ? '' : 's'}.`);
