import fs from 'node:fs/promises';
import path from 'node:path';
import { blogArticles } from '../src/blogData.js';
import {
  nonIndexableRoutes,
  resolveMainSourceContent,
  resolvePublicRoutes,
  resolveStaticRoutes,
} from './seo-routes.mjs';
import { getSeoEntry, organization, productSeo, siteUrl } from './seo-page-data.mjs';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const templatePath = path.join(distDir, 'index.html');
const staticRoutes = resolveStaticRoutes();
const indexableRoutes = resolvePublicRoutes();
const nonIndexableRouteSet = new Set(nonIndexableRoutes);

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
const blogArticleMap = new Map(blogArticles.map((article) => [article.slug, article]));
const mainSourceContent = resolveMainSourceContent();
const businessPageMap = new Map(mainSourceContent.businessPages.map((page) => [page.path, page]));
const productContentMap = new Map(mainSourceContent.products.map((product) => [`/products/${product.slug}`, product]));
const newsArticleMap = new Map(mainSourceContent.newsArticles.map((article) => [`/pages/news/${article.slug}`, article]));

const renderLinkList = (links) => {
  const uniqueLinks = Array.from(new Map(links.map(([label, href]) => [href, [label, href]])).values());
  return uniqueLinks.map(([label, href]) => `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`).join('\n');
};

const pageLabel = (entry) => entry.title.split(' | ')[0];

const coreDiscoveryLinks = [
  ['Home', '/'],
  ['Factory', '/factory'],
  ['OEM Capability', '/oem-capability'],
  ['Private Label', '/private-label'],
  ['Quality Control', '/quality-control'],
  ['Buyer Resources', '/resources'],
  ['Blog', '/blog'],
  ['Editorial Team', '/authors/jczcare-editorial-team'],
  ['Contact', '/contact'],
  ['HTML Sitemap', '/sitemap.html'],
];

const relatedLinksFor = (entry) => {
  if (entry.path === '/') {
    return [
      ...mainSourceContent.products.map((product) => [product.title, `/products/${product.slug}`]),
      ...mainSourceContent.businessPages.map((page) => [page.h1 || pageLabel(page), page.path]),
      ...blogArticles.slice(0, 12).map((article) => [article.title, article.path]),
    ];
  }

  if (entry.path === '/blog') {
    return blogArticles.map((article) => [article.title, article.path]);
  }

  if (entry.path === '/pages/news') {
    return mainSourceContent.newsArticles.map((article) => [article.title, `/pages/news/${article.slug}`]);
  }

  const prefix = `/${entry.path.split('/').filter(Boolean)[0] || ''}`;
  const sameSection = indexableRoutes
    .filter((route) => route !== entry.path && route.startsWith(prefix))
    .slice(0, 24)
    .map((route) => {
      const relatedEntry = getSeoEntry(route);
      return [pageLabel(relatedEntry), route];
    });

  return [
    ...sameSection,
    ...mainSourceContent.products.map((product) => [product.title, `/products/${product.slug}`]),
    ['OEM Manufacturing Capability', '/oem-capability'],
    ['Contact the Factory', '/contact'],
  ];
};

const renderStaticPage = (entry) => {
  const businessPage = businessPageMap.get(entry.path);
  const product = productContentMap.get(entry.path);
  const newsArticle = newsArticleMap.get(entry.path);
  const h1 = businessPage?.h1 || pageLabel(entry);
  const intro = businessPage?.intro || newsArticle?.excerpt || product?.summary || entry.description;
  const sections = businessPage?.sections || [];
  const faqs = businessPage?.faqs || entry.faqs || [];

  const sectionHtml = sections.map(([heading, text]) =>
    `<section><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(text)}</p></section>`
  ).join('\n');

  const productHtml = product ? [
    '<section><h2>Product and OEM scope</h2>',
    `<p>${escapeHtml(product.application)}</p>`,
    `<p>${escapeHtml(product.oemCapability)}</p>`,
    `<p>${escapeHtml(product.customization)}</p>`,
    `<ul>${product.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join('')}</ul>`,
    '</section>',
    `<section><h2>Available directions</h2><ul>${product.specs.map((spec) => `<li>${escapeHtml(spec)}</li>`).join('')}</ul></section>`,
  ].join('\n') : '';

  const newsHtml = newsArticle ? [
    `<section><h2>${escapeHtml(newsArticle.title)}</h2>`,
    ...newsArticle.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`),
    `<ul>${newsArticle.points.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ul>`,
    '</section>',
  ].join('\n') : '';

  const faqHtml = faqs.length ? [
    '<section><h2>Frequently Asked Questions</h2>',
    ...faqs.map(([question, answer]) => `<h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p>`),
    '</section>',
  ].join('\n') : '';

  return [
    '<main class="static-seo-content">',
    `<nav aria-label="Primary">${coreDiscoveryLinks.map(([label, href]) => `<a href="${href}">${label}</a>`).join(' | ')}</nav>`,
    '<article>',
    `<p>${escapeHtml(businessPage?.kicker || product?.category || newsArticle?.category || 'JCZCARE')}</p>`,
    `<h1>${escapeHtml(h1)}</h1>`,
    `<p>${escapeHtml(intro)}</p>`,
    sectionHtml,
    productHtml,
    newsHtml,
    faqHtml,
    `<section><h2>Explore JCZCARE</h2><ul>${renderLinkList(relatedLinksFor(entry))}</ul></section>`,
    '<section><h2>Discuss your OEM project</h2><p>Share your target market, product specification, packaging direction, quantity, and delivery destination with our factory team.</p><a href="/contact">Contact an expert</a></section>',
    '</article>',
    '</main>',
  ].filter(Boolean).join('\n');
};

const renderStaticArticle = (article) => {
  if (!article) {
    return '';
  }

  const sectionHtml = article.sections.map((section) => [
    `<section>`,
    `<h2>${escapeHtml(section.heading)}</h2>`,
    section.h3 ? `<h3>${escapeHtml(section.h3)}</h3>` : '',
    ...section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`),
    section.comparisonRows
      ? `<table><tbody>${section.comparisonRows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`
      : '',
    `</section>`,
  ].join('\n')).join('\n');

  const checklistHtml = article.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n');
  const faqHtml = article.faqs.map(([question, answer]) => [
    `<section>`,
    `<h3>${escapeHtml(question)}</h3>`,
    `<p>${escapeHtml(answer)}</p>`,
    `</section>`,
  ].join('\n')).join('\n');

  const relatedHtml = (article.relatedSlugs || []).map((slug) => {
    const related = blogArticleMap.get(slug);
    return related
      ? '<li><a href="' + escapeHtml(related.path) + '">' + escapeHtml(related.title) + '</a></li>'
      : '';
  }).join('');

  return [
    `<main class="static-blog-content">`,
    `<article>`,
    `<p>${escapeHtml(article.category)} | <a href="/authors/jczcare-editorial-team">${escapeHtml(article.author)}</a> | ${escapeHtml(article.publishedAt)}</p>`,
    `<h1>${escapeHtml(article.title)}</h1>`,
    `<p>${escapeHtml(article.intro)}</p>`,
    `<nav aria-label="Table of contents"><h2>Table of contents</h2><ol>${article.toc.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol></nav>`,
    `<nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog">Blog</a> / <a href="${escapeHtml(article.clusterPath)}">${escapeHtml(article.clusterTitle)}</a> / <span>${escapeHtml(article.title)}</span></nav>`,
    `<nav aria-label="Internal links"><a href="${escapeHtml(article.clusterPath)}">${escapeHtml(article.clusterTitle)} pillar guide</a> | <a href="/factory">Factory resources</a> | <a href="/private-label">Customization</a> | <a href="/products/disposable-pet-pads">Products</a> | <a href="/contact">Contact an expert</a></nav>`,
    sectionHtml,
    `<section><h2>Buyer Checklist</h2><ul>${checklistHtml}</ul></section>`,
    `<section><h2>FAQ</h2>${faqHtml}</section>`,
    '<section><h2>Related Articles</h2><ul>' + relatedHtml + '</ul></section>',
    `<section><h2>${escapeHtml(article.cta.title)}</h2><p>${escapeHtml(article.cta.text)}</p></section>`,
    `</article>`,
    `</main>`,
  ].join('\n');
};

const renderStaticAuthority = (page) => {
  if (!page) {
    return '';
  }

  const breadcrumbs = (page.breadcrumbs || [['Home', '/'], [page.title, page.path]])
    .map(([label, href]) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`)
    .join(' / ');
  const sections = (page.sections || []).map((section) => [
    '<section>',
    `<h2>${escapeHtml(section.heading)}</h2>`,
    ...(section.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`),
    section.comparisonRows
      ? `<table><tbody>${section.comparisonRows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`
      : '',
    '</section>',
  ].join('\n')).join('\n');
  const articleLinks = (page.articles || []).map((article) =>
    `<li><a href="${escapeHtml(article.path)}">${escapeHtml(article.title)}</a></li>`
  ).join('');
  const cards = (page.cards || []).map(([label, href]) =>
    `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`
  ).join('');
  const faqGroups = (page.groups || []).map((group) => [
    `<section><h2>${escapeHtml(group.title)}</h2>`,
    ...group.faqs.map(([question, answer]) => `<h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p>`),
    `<p><a href="${escapeHtml(group.path)}">Read the ${escapeHtml(group.title)} pillar guide</a></p></section>`,
  ].join('\n')).join('\n');
  const faqs = page.groups
    ? ''
    : (page.faqs || []).map(([question, answer]) =>
      `<section><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p></section>`
    ).join('\n');
  const references = (page.references || []).map((reference) =>
    `<li><a href="${escapeHtml(reference.url)}" rel="noopener noreferrer">${escapeHtml(reference.label)}</a>: ${escapeHtml(reference.note)}</li>`
  ).join('');
  const products = (page.products || []).map((href) =>
    `<li><a href="${escapeHtml(href)}">${escapeHtml(href.split('/').pop().replace(/-/g, ' '))}</a></li>`
  ).join('');
  const timeline = (page.timeline || []).map(([number, title, text]) =>
    `<li><strong>${escapeHtml(number)} ${escapeHtml(title)}</strong><p>${escapeHtml(text)}</p></li>`
  ).join('');
  const specifications = (page.specifications || []).map(([label, value]) =>
    `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`
  ).join('');
  const gallery = (page.gallery || []).map(([src, caption]) =>
    `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(caption)}" loading="lazy" /><figcaption>${escapeHtml(caption)}</figcaption></figure>`
  ).join('');

  return [
    '<main class="static-authority-content">',
    `<nav aria-label="Breadcrumb">${breadcrumbs}</nav>`,
    `<article><p>${escapeHtml(page.kicker)}</p><h1>${escapeHtml(page.h1)}</h1><p>${escapeHtml(page.intro)}</p>`,
    sections,
    articleLinks ? `<section><h2>Related Articles</h2><ul>${articleLinks}</ul></section>` : '',
    cards ? `<section><h2>Explore Resources</h2><ul>${cards}</ul></section>` : '',
    timeline ? `<section><h2>Controlled Workflow</h2><ol>${timeline}</ol></section>` : '',
    specifications ? `<section><h2>Buyer Specifications</h2><table><tbody>${specifications}</tbody></table></section>` : '',
    faqGroups,
    faqs ? `<section><h2>Frequently Asked Questions</h2>${faqs}</section>` : '',
    gallery ? `<section><h2>Factory Photography</h2>${gallery}</section>` : '',
    references ? `<section><h2>Authoritative References</h2><ul>${references}</ul></section>` : '',
    `<section><h2>Related Products</h2><ul>${products}</ul></section>`,
    '<section><h2>Discuss your project</h2><p>Share your product, market, specification, packaging, quantity, and delivery destination with JCZCARE.</p><a href="/request-product-plan?product=authority-resource">Request a product plan</a> <a href="/contact">Contact an expert</a></section>',
    '</article></main>',
  ].filter(Boolean).join('\n');
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
      contactPoint: organization.contactPoint,
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
        target: `${siteUrl}/blog?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: (entry.breadcrumbs || [['Home', '/'], [entry.title, entry.path]]).map(([name, item], index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name,
        item: absoluteUrl(item),
      })),
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

  if (
    entry.authorityPage?.kind === 'pillar'
    || entry.authorityPage?.kind === 'factory-detail'
    || ['Article', 'Report'].includes(entry.authorityPage?.schemaType)
  ) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': entry.authorityPage.schemaType || 'Article',
      headline: entry.authorityPage.h1,
      description: entry.authorityPage.metaDescription,
      image,
      datePublished: entry.authorityPage.updatedAt,
      dateModified: entry.authorityPage.updatedAt,
      author: { '@type': 'Organization', name: 'JCZCARE Editorial Team' },
      publisher: { '@type': 'Organization', name: organization.name },
      mainEntityOfPage: canonical,
      articleSection: entry.authorityPage.title,
      keywords: entry.authorityPage.title,
    });
  }

  if (entry.authorityPage?.timeline?.length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${entry.authorityPage.title} workflow`,
      itemListElement: entry.authorityPage.timeline.map(([number, name, description], index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: `${number} ${name}`,
        description,
      })),
    });
  }

  if (entry.authorityPage?.gallery?.length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      name: entry.authorityPage.title,
      description: entry.authorityPage.metaDescription,
      url: canonical,
      associatedMedia: entry.authorityPage.gallery.map(([contentUrl, caption]) => ({
        '@type': 'ImageObject',
        contentUrl: absoluteUrl(contentUrl),
        caption,
      })),
    });
  }

  if (entry.authorityPage?.video) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: 'JCZCARE Factory Profile Video',
      description: entry.authorityPage.metaDescription,
      thumbnailUrl: absoluteUrl(entry.authorityPage.image),
      contentUrl: absoluteUrl(entry.authorityPage.video),
      uploadDate: entry.authorityPage.updatedAt,
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
  /<title>[\s\S]*?<\/title>|<meta\s+(?:name|property)="(?:description|keywords|robots|og:title|og:description|og:type|og:url|og:image|twitter:card|twitter:title|twitter:description|twitter:image|article:published_time|article:modified_time)"[\s\S]*?>|<link\s+rel="canonical"[\s\S]*?>|<link\s+rel="alternate"\s+type="application\/rss\+xml"[\s\S]*?>|<script id="jczcare-jsonld" type="application\/ld\+json">[\s\S]*?<\/script>/g;

const renderHead = (entry, indexable) => {
  const canonical = absoluteUrl(entry.path);
  const image = absoluteUrl(entry.image);
  return [
    `<title>${escapeHtml(entry.title)}</title>`,
    `<meta name="description" content="${escapeHtml(entry.description)}" />`,
    entry.keywords ? `<meta name="keywords" content="${escapeHtml(entry.keywords)}" />` : '',
    `<meta name="robots" content="${indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow'}" />`,
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
    '<style id="jczcare-static-shell">.static-seo-content,.static-blog-content,.static-authority-content{max-width:1180px;margin:0 auto;padding:96px 24px;font-family:Arial,sans-serif;line-height:1.65;color:#17231d}.static-seo-content nav,.static-blog-content nav,.static-authority-content nav{margin-bottom:24px}.static-seo-content a,.static-blog-content a,.static-authority-content a{color:#246b45}.static-seo-content section,.static-blog-content section,.static-authority-content section{margin:32px 0}.static-seo-content img,.static-authority-content img{max-width:100%;height:auto}</style>',
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
  const staticContent = entry.article
    ? renderStaticArticle(entry.article)
    : entry.authorityPage
      ? renderStaticAuthority(entry.authorityPage)
      : renderStaticPage(entry);
  const bodyTemplate = template.replace('<div id="root"></div>', `<div id="root">${staticContent}</div>`);
  const cleaned = bodyTemplate
    .replace(managedHeadPattern, '')
    .replace('</head>', `    ${renderHead(entry, !nonIndexableRouteSet.has(route))}\n  </head>`);

  if (!/<main\b/i.test(cleaned) || !/<h1\b/i.test(cleaned) || !/<a\b/i.test(cleaned)) {
    throw new Error(`Static SEO output is missing crawlable content for ${route}`);
  }

  await writeHtml(route, cleaned);
  written += 1;
}

console.log(`Generated route-level SEO HTML for ${written} route${written === 1 ? '' : 's'}.`);
