import {sourceProducts,sourceProductForPath,sourceProductDetail,sourceRange,sourceFamilyPage} from './source-products.js';
import {wasteProducts,wasteProductForPath,wasteDetailMetadata} from './waste-products.js';
import {catalog,productVariants,variantForPath} from './catalog.js';

export const storefrontRoutes = ['/', '/products', ...sourceProducts.map(p=>p.path), ...wasteProducts.map(p=>p.path), ...catalog.map(p => p.path), ...productVariants.map(v => v.path), '/factory', '/oem-process', '/quality-control', '/resources', '/events/cips-2026', '/certifications', '/contact', '/privacy-policy'];
export const siteOrigin = 'https://www.jczcare.com';
const variantTitleOverrides = {
  'cleaning-finger-cots': 'Non-woven Finger Cots OEM',
  'biodegradable-material-direction': 'Biodegradable Waste Bags OEM',
};
const staticMeta = {
  '/': ['Pet Hygiene OEM / ODM Manufacturer', 'Nantong Jincheng Zencare Technology Co.,Ltd supplies pet training pads, absorbent cleanup sheets and private-label hygiene products for brands, importers and distributors.'],
  '/products': ['Pet Hygiene Product Collection', 'Explore pet hygiene and accessory families: pet pads, waste bags, pet diapers, adult underpads, disposable cleaning products and pet absorbent paper sheets.'],
  '/factory': ['Our Nantong Manufacturing Factory', 'Review JCZCARE production, materials, packaging and factory capabilities for your OEM / ODM pet hygiene program.'],
  '/oem-process': ['OEM / ODM Product Development', 'From product specifications and sample review to private-label packaging, production and shipment: plan your OEM program with JCZCARE.'],
  '/quality-control': ['Quality Control & Sample Review', 'Review incoming materials, in-process inspection, product sample checks and finished-goods controls for pet hygiene sourcing.'],
  '/resources': ['Buyer Resources for Pet Product Sourcing', 'Practical OEM and private-label resources for pet product buyers: product specifications, samples, packaging, quality review and supplier planning.'],
  '/events/cips-2026': ['CIPS 2026 Pet Supplies Exhibition', 'Meet Nantong Jincheng Zencare Technology Co., Ltd. at the 30th China International Pet Show in Guangzhou, 12–15 November 2026, Booth 9.2 Hall D010.', '/images/oem/hero/hengtuo-pet-show-banner-20260923.webp'],
  '/certifications': ['Certificates & Compliance Evidence', 'Review certificate scope, issuing bodies, validity dates and downloadable evidence for selected JCZCARE pet, compostable bag and adult-care products.'],
  '/contact': ['Contact & Product Inquiry', 'Request the fixed MOQ, a quote, product samples or packaging support from Nantong Jincheng Zencare Technology Co.,Ltd.'],
  '/privacy-policy': ['Privacy Notice', 'How JCZCARE handles product inquiries, contact information and website services. Contact our team with privacy questions.'],
};
export function metadataFor(path) {
  const source=sourceProductForPath(path);if(source)return {title:source.name+' | JCZCARE',description:'Model '+(source.model||source.id)+'. '+source.specs.map(r=>r.join(': ')).join('. ').slice(0,150),image:source.image||'/images/brand/jczcare-factory-hero-2560x977.webp',path};
  const waste=wasteProductForPath(path);
  if(waste)return wasteDetailMetadata(waste);
  const product = catalog.find(p => p.path === path);
  const variant = variantForPath(path);
  const [label, description, image = '/images/brand/jczcare-factory-hero-2560x977.webp'] = variant ? [variantTitleOverrides[variant.slug] || `${variant.name} | ${variant.parent.name} OEM`, variant.purpose, variant.image || '/images/brand/jczcare-factory-hero-2560x977.webp'] : product ? [`${product.name} OEM & Private Label`, product.intro, product.image || '/images/brand/jczcare-factory-hero-2560x977.webp'] : (staticMeta[path] || ['Page not found', 'Explore JCZCARE pet hygiene products.']);
  return {title:`${label} | JCZCARE`, description:description.length>180 ? description.slice(0,176).replace(/\s+\S*$/,'')+'…' : description, image, path};
}
export function schemaFor(path) {
  const meta = metadataFor(path);
  const company = {'@type':'Organization','@id':`${siteOrigin}/#organization`, name:'Nantong Jincheng Zencare Technology Co.,Ltd', alternateName:'JCZCARE',url:siteOrigin,email:'hengtuo@nthengtuo.com',telephone:'+86 18962944556'};
  const graph = [company, {'@type':'WebSite','@id':`${siteOrigin}/#website`,url:siteOrigin,name:'JCZCARE',publisher:{'@id':company['@id']}}, {'@type':'WebPage',url:siteOrigin+path,name:meta.title,description:meta.description,isPartOf:{'@id':`${siteOrigin}/#website`}}];
  if (path !== '/') {
    const variant=variantForPath(path), parent=variant?.parent;
    const items = path === '/events/cips-2026'
      ? [{'@type':'ListItem',position:1,name:'Home',item:siteOrigin+'/'},{'@type':'ListItem',position:2,name:'CIPS 2026',item:siteOrigin+path}]
      : [{'@type':'ListItem',position:1,name:'Home',item:siteOrigin+'/'},{'@type':'ListItem',position:2,name:'Products',item:siteOrigin+'/products'},...(parent?[{'@type':'ListItem',position:3,name:parent.name,item:siteOrigin+parent.path}]:[]),{'@type':'ListItem',position:parent?4:3,name:meta.title.split(' | ')[0],item:siteOrigin+path}];
    graph.push({'@type':'BreadcrumbList',itemListElement:items});
  }
  if (path === '/events/cips-2026') {
    const eventId = `${siteOrigin}${path}#event`;
    graph.push({'@type':'Event','@id':eventId,name:'The 30th China International Pet Show',description:'The 30th China International Pet Show takes place in Guangzhou, China, from 12 to 15 November 2026. JCZCARE will participate as an exhibitor at Hall 9.2, Booth D010.',startDate:'2026-11-12',endDate:'2026-11-15',eventStatus:'https://schema.org/EventScheduled',eventAttendanceMode:'https://schema.org/OfflineEventAttendanceMode',location:{'@type':'Place',name:'Guangzhou, China',address:{'@type':'PostalAddress',addressLocality:'Guangzhou',addressCountry:'CN'},description:'JCZCARE exhibitor location: Hall 9.2, Booth D010.'},url:siteOrigin+path,image:siteOrigin+'/images/oem/hero/hengtuo-pet-show-banner-20260923.webp'});
    graph.push({'@type':'FAQPage','mainEntity':[['Where can I meet JCZCARE at CIPS 2026?','Our team will be at 9.2 Hall, Booth D010 in Guangzhou, China, from 12 to 15 November 2026.'],['What products will you display?','We will discuss pet training pads, pet absorbent paper sheets, pet diapers, garbage and pet waste bags, adult care products and disposable cleaning products.'],['Can I schedule a meeting before the show?','Yes. Submit the meeting inquiry form with your preferred timing and product interest so our team can prepare.']].map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))});
  }
  return {'@context':'https://schema.org','@graph':graph};
}
export function updateMetadata(path, override=null, schemaOverride=null) {
  const meta = override || metadataFor(path);
  const imageUrl=meta.image.startsWith('https://')?meta.image:siteOrigin+meta.image;
  document.title = meta.title;
  const set = (attr, key, value) => {
    let tag = document.querySelector(`meta[${attr}="${key}"]`);
    if (!tag) {tag=document.createElement('meta');tag.setAttribute(attr,key);document.head.append(tag);}
    tag.content=value;
  };
  set('name','description',meta.description);
  for (const [key,value] of Object.entries({title:meta.title, description:meta.description, type:override&&path.startsWith('/blog/')&&!path.includes('/category/')?'article':'website',url:siteOrigin+path,image:imageUrl})) set('property','og:'+key,value);
  for (const [key,value] of Object.entries({card:'summary_large_image',title:meta.title,description:meta.description,image:imageUrl})) set('name','twitter:'+key,value);
  let canonical=document.querySelector('link[rel="canonical"]');
  if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.append(canonical);}
  canonical.href=siteOrigin+path;
  let schema=document.getElementById('storefront-schema');
  if(!schema){schema=document.createElement('script');schema.id='storefront-schema';schema.type='application/ld+json';document.head.append(schema);}
  schema.textContent=JSON.stringify(schemaOverride || schemaFor(path));
}
