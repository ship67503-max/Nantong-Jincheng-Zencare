import {sourceProductForPath,sourceProductDetail} from '../src/storefront/source-products.js';
import {wasteProductForPath,wasteProductDetail} from '../src/storefront/waste-products.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import {catalog,variantForPath} from '../src/storefront/catalog.js';
import {productCards, productsPage, productPage, productVariantPage, factoryPage, oemPage, qualityPage, resourcesPage, cips2026Page, contactPage, escapeHtml} from '../src/storefront/pages.js';
import {paperExperience} from '../src/storefront/paper-simple.js';
import {privacyPage} from '../src/storefront/privacy.js';
import {storefrontRoutes, metadataFor, schemaFor, siteOrigin} from '../src/storefront/metadata.js';
import {insightRoutes, insightMetadata, renderInsights} from './storefront-insights.mjs';
import {certificatesPage, certificateHome, addCertificateEvidence} from '../src/storefront/certificates.js';

const root = process.cwd();
const dist = path.join(root, 'dist');
const source = path.join(dist, 'storefront.html');
const template = await fs.readFile(source, 'utf8');
const renderers = {'/products':productsPage,'/factory':factoryPage,'/oem-process':oemPage,'/quality-control':qualityPage,'/resources':resourcesPage,'/events/cips-2026':cips2026Page,'/certifications':certificatesPage,'/contact':contactPage,'/privacy-policy':privacyPage};
for (const route of [...storefrontRoutes,...insightRoutes]) {
  const insight=insightRoutes.includes(route);
  const meta = insight ? insightMetadata(route) : metadataFor(route);
  const schema=schemaFor(route);
  if(insight){
    const page=schema['@graph'].find(x=>x['@type']==='WebPage');
    page.name=meta.title;page.description=meta.description;
    const breadcrumb=schema['@graph'].find(x=>x['@type']==='BreadcrumbList');
    breadcrumb.itemListElement=[{ '@type':'ListItem',position:1,name:'Home',item:siteOrigin+'/'},{'@type':'ListItem',position:2,name:'Buyer resources',item:siteOrigin+'/resources'},...(route==='/blog'?[]:[{'@type':'ListItem',position:3,name:'Article library',item:siteOrigin+'/blog'}]),{'@type':'ListItem',position:route==='/blog'?3:4,name:meta.title,item:siteOrigin+route}];
    if(meta.article) schema['@graph'].push({'@type':'BlogPosting',headline:meta.article.title,description:meta.description,image:siteOrigin+meta.image,datePublished:meta.article.publishedAt,dateModified:meta.article.updatedAt,author:{'@type':'Organization',name:meta.article.author},publisher:{'@id':siteOrigin+'/#organization'},mainEntityOfPage:siteOrigin+route});
  }
  let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  const tags = [
    `<meta name="description" content="${escapeHtml(meta.description)}">`,
    `<link rel="canonical" href="${siteOrigin}${route}">`,
    ...Object.entries({title:meta.title,description:meta.description,type:meta.article?'article':'website',url:siteOrigin+route,image:siteOrigin+meta.image}).map(([key,value])=>`<meta property="og:${key}" content="${escapeHtml(value)}">`),
    ...Object.entries({card:'summary_large_image',title:meta.title,description:meta.description,image:siteOrigin+meta.image}).map(([key,value])=>`<meta name="twitter:${key}" content="${escapeHtml(value)}">`),
    `<script id="storefront-schema" type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>`,
  ];
  html = html.replace('</head>', tags.join('\n') + '\n</head>');
  html = html.replace('<div id="home-certificates"></div>', `<div id="home-certificates">${certificateHome()}</div>`);
  html = html.replace('<div class="category-grid" id="category-grid"></div>', `<div class="category-grid" id="category-grid">${productCards()}</div>`);
  if (route !== '/') {
    const product = catalog.find(p=>p.path===route);
    const variant = variantForPath(route);
    const waste = wasteProductForPath(route);
    const sourceProduct=sourceProductForPath(route);
    const body = sourceProduct ? sourceProductDetail(sourceProduct) : waste ? wasteProductDetail(waste) : insight ? renderInsights(route) : variant ? productVariantPage(variant) : product ? (productPage(product)) : renderers[route]();
    html = html.replace('<main id="home-view">', '<main id="home-view" hidden>');
    html = html.replace('<main id="site-page" hidden></main>', `<main id="site-page">${addCertificateEvidence(body,route)}</main>`);
  }
  const directory = route==='/' ? dist : path.join(dist, route.slice(1));
  await fs.mkdir(directory, {recursive:true});
  await fs.writeFile(path.join(directory,'index.html'), html);
}
// Keep a single certificate URL, including in the local review build.
await fs.mkdir(path.join(dist,'factory/certificates'),{recursive:true});
await fs.copyFile(path.join(dist,'certifications/index.html'),path.join(dist,'factory/certificates/index.html'));
// Do not ship excluded raw source videos. The compressed playback assets stay.
for (const name of ['factory-profile-3.mp4','factory-final.mp4','factory-profile-4.mp4','hero-background-2.mp4']) {
  await fs.rm(path.join(dist,'videos',name), {force:true});
}
console.log(`Generated ${storefrontRoutes.length} storefront pages and ${insightRoutes.length} library pages with static metadata; preserved other pages and API routes.`);
