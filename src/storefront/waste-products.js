import {collectionFormatNavigation} from './collection-navigation.js';
import data from './waste-products.json' with {type:'json'};
import specifications from './waste-product-specifications.json' with {type:'json'};

const minimumOrder = p => p.details?.minimumOrder || specifications[p.id]?.minimumOrder || p.moq || 'Contact us';
function specificationSections(p) {
 const details = p.details || specifications[p.id];
 const sections = details ? [['Customization',details.customization],['Key product attributes',details.specifications],['Packaging & delivery',details.packaging]] : [['Product information',[['Product reference',p.id],['Minimum order',minimumOrder(p)],['Specifications','Contact our team for material, dimensions and packaging details.']]]];
 return sections.map(([title,rows])=>`<section class="waste-info-section"><h2>${title}</h2><dl class="waste-attribute-grid">${rows.map(([label,value])=>`<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl></section>`).join('');
}

const assetSrc=src=>String(src||'').replace(/\.(png|jpe?g)$/i,'.webp');
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pageSize = 12;
export function wasteProductResults(page = 1, category = '') {
  const products = category ? data.products.filter(p => wasteProductCategories(p).includes(category)) : data.products;
  const count = products.length;
  if (!count) return '<p class="waste-result-count">No matching products are currently listed. Contact us to discuss this specification.</p>';
  const pages = Math.ceil(count / pageSize);
  page = Math.max(1, Math.min(pages, Number(page) || 1));
  const start = (page - 1) * pageSize;
  return `<p class="waste-result-count" role="status">${start + 1}–${Math.min(start + pageSize, count)} of ${count} products</p>
    <div class="waste-product-grid">${products.slice(start, start + pageSize).map(p => `<article class="waste-product-card">
      <a href="${escape(p.path)}" aria-label="${escape(p.title)} — view product details"><img src="${assetSrc(p.image)}" alt="${escape(p.title)}" width="700" height="700" loading="lazy" decoding="async"></a>
      <div><p class="waste-product-ref">PRODUCT ${p.id}</p><h3>${escape(p.title)}</h3><p>MOQ: ${escape(minimumOrder(p))}</p>
      <div class="actions"><a class="text-link" href="${escape(p.path)}">Product details ↗</a><a class="text-link" href="/contact?${escape(new URLSearchParams({product:p.family||'garbage-bags',format:p.title,brief:'Product reference: '+p.id}).toString())}">Request a quote ↗</a></div></div>
    </article>`).join('')}</div>
    <nav class="waste-pagination" aria-label="Product pages"><button type="button" data-waste-page="${page - 1}" ${page === 1 ? 'disabled' : ''}>Previous</button>${Array.from({length:pages},(_,i)=>`<button type="button" data-waste-page="${i+1}" ${page===i+1?'aria-current="page"':''}>${i+1}</button>`).join('')}<button type="button" data-waste-page="${page + 1}" ${page === pages ? 'disabled' : ''}>Next</button></nav>`;
}
export function wasteProductCatalog() {
  return `<section class="section wrap waste-catalog" id="range"><div class="section-heading"><div><p class="eyebrow">OUR WASTE BAG COLLECTION</p><h2>Find your next<br>product.</h2></div><p>Explore our complete collection.<br>Choose a product and send us your requirements.</p></div><div data-waste-results>${wasteProductResults()}</div></section>`;
}
export function initWasteCatalog(root) {
  const results = root.querySelector('[data-waste-results]');
  if (!results) return;
  const category = results.dataset.wasteCategory || '';
  const current = () => Number(new URLSearchParams(location.search).get('page')) || 1;
  results.innerHTML = wasteProductResults(current(), category);

  results.addEventListener('click', event => {
    const button = event.target.closest('[data-waste-page]');
    if (!button || button.disabled) return;
    const page = Number(button.dataset.wastePage);
    const url = new URL(location.href);
    page === 1 ? url.searchParams.delete('page') : url.searchParams.set('page', page);
    url.hash = 'range';
    history.pushState({}, '', url);
    results.innerHTML = wasteProductResults(page, category);
  
    root.querySelector('#range').scrollIntoView({block:'start'});
    results.querySelector('[aria-current="page"]')?.focus({preventScroll:true});
  });
}

export const wasteProducts = data.products;
export const wasteProductForPath = path => data.products.find(p=>p.path===path);
export function wasteDetailMetadata(p){return {path:p.path,title:p.title+' | JCZCARE',description:p.title+'. Minimum order: '+minimumOrder(p)+'. Contact JCZCARE for specifications, private-label packaging and samples.',image:p.image};}
export function wasteProductDetail(p){
 const inquiry='/contact?'+new URLSearchParams({product:'garbage-bags',format:p.title,brief:'Product reference: '+p.id});
 const images=[...new Set([p.image,...(p.gallery||[])])];
 const familyPath='/products/'+(p.family||'garbage-bags');
 const familyName=p.familyName||'Waste bags';
 return `<nav class="wrap breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="${familyPath}#range">${escape(familyName)}</a><span>/</span><span>Product ${p.id}</span></nav>
 <section class="wrap waste-detail waste-commerce">
 <div class="waste-media-column"><div class="waste-image-stage"><div class="waste-detail-gallery" aria-label="Product images">${images.map((src,i)=>`<button type="button" data-waste-image="${escape(src)}" aria-pressed="${i===0}" aria-label="View product image ${i+1}"><img src="${escape(src)}" alt="${escape(p.title)} — image ${i+1}" loading="lazy" width="100" height="100"></button>`).join('')}</div><div class="waste-main-frame"><img class="waste-detail-main" src="${escape(p.image)}" alt="${escape(p.title)}" width="700" height="700"><button class="waste-next-image" type="button" aria-label="Next product image">›</button></div></div>
 <div class="waste-supplier"><p class="eyebrow">YOUR MANUFACTURING PARTNER</p><h2>Hengtuo · JCZCARE</h2><p>Nantong, Jiangsu, China</p><div><span>OEM / ODM</span><span>Custom logo</span><span>Private label</span></div><a class="text-link" href="/about">About our company ↗</a></div></div>
 <div class="waste-information"><p class="eyebrow">${escape(p.familyName||"PET WASTE COLLECTION")}</p><h1>${escape(p.title)}</h1><p class="waste-reference">Product reference: ${p.id}${(p.details||specifications[p.id])?.model?' · Model '+escape((p.details||specifications[p.id]).model):''}</p><div class="waste-order-summary"><span>Minimum order</span><strong>${escape(minimumOrder(p))}</strong><p>Pricing depends on your material, quantity and packaging requirements.</p></div>${specificationSections(p)}</div>
 <aside class="waste-quote-card" aria-label="Product inquiry"><p class="eyebrow">LET’S DISCUSS YOUR ORDER</p><h2>Get a tailored quote</h2><p>Share your quantity, destination and preferred specifications with our team.</p><div class="waste-quote-note"><strong>Made for your brand</strong><p>Confirm material, size, artwork and packaging for your project.</p></div><a class="button" href="${escape(inquiry)}">Send inquiry ↗</a><a class="waste-whatsapp" href="https://wa.me/8618962944556?text=${encodeURIComponent('Hello, I would like information about '+p.title+' (Product '+p.id+').')}" target="_blank" rel="noopener">Contact on WhatsApp ↗</a><a class="waste-email" href="mailto:hengtuo@nthengtuo.com?subject=${encodeURIComponent('Product inquiry: '+p.id)}">hengtuo@nthengtuo.com</a><div class="waste-quote-steps"><h3>Next steps</h3><p>01 · Confirm specifications</p><p>02 · Discuss samples & quotation</p><p>03 · Agree packing & delivery</p></div><a class="text-link" href="${familyPath}#range">Back to collection ↗</a></aside></section>`;
}

export function initWasteDetail(root){
 const main=root.querySelector('.waste-detail-main');if(!main)return;
 const buttons=[...root.querySelectorAll('[data-waste-image]')];
 function select(button){main.src=button.dataset.wasteImage;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}
 buttons.forEach(button=>button.addEventListener('click',()=>select(button)));
 root.querySelector('.waste-next-image')?.addEventListener('click',()=>{const current=buttons.findIndex(b=>b.getAttribute('aria-pressed')==='true');const next=buttons[(current+1)%buttons.length];select(next);next.scrollIntoView({block:'nearest',inline:'nearest'});});
}

export function wasteProductCategories(p) {
 const spec=specifications[p.id];
 const material=(spec?.specifications.find(([k])=>k==='Material')?.[1]||'').toLowerCase();
 const title=p.title.toLowerCase();
 const scent=(spec?.specifications.find(([k])=>k==='Scent')?.[1]||'').toLowerCase();
 const matches=[];
 const bag=!/silicone|capsule|soft plastic material/.test(title) && !/^(silicone|pp)$/i.test(material.trim());
 if(bag && /hdpe|high.density/.test(material+' '+title))matches.push('hdpe');
 if(bag && /ldpe|low.density/.test(material+' '+title))matches.push('ldpe');
 if(bag && /epi/.test(material+' '+title))matches.push('hdpe-epi');
 if(bag && /corn.?starch/.test(material+' '+title) && /\bpe\b|polyethylene/.test(material+' '+title))matches.push('cornstarch-pe');
 if(bag && /corn.?starch/.test(material+' '+title) && /pbat/.test(material+' '+title) && /pla/.test(material+' '+title))matches.push('cornstarch-pbat-pla');
 if(/with handles?|tie handles?|handle bag|vest/.test(title))matches.push('vest-style-bags');
 if(/dispenser|holder/.test(title))matches.push('dispenser-kits');
 if(/print|pattern|paw/.test(title))matches.push('printed-pet-waste-bags');
 if(/lavender|floral|fruit|mint|fragrance/.test(scent) || /\bscented\b|with scent|fragrance/.test(title))matches.push('scented-waste-bags');
 return matches;
}
export function wasteCategoryPage(v) {
 return `<nav class="wrap breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/products/garbage-bags">Waste bags</a><span>/</span><span>${escape(v.name)}</span></nav><section class="section wrap"><p class="eyebrow">WASTE BAG COLLECTION</p><h1>${escape(v.name)}</h1><p class="core-page-intro">${escape(v.purpose)}</p><p>${escape(v.review)}</p><p>Confirm the selected formulation, dimensions and packaging with our team before ordering.</p>${collectionFormatNavigation(v.parent,v.slug)}</section><section class="section wrap waste-catalog" id="range"><div class="section-heading"><h2>${escape(v.name)} products</h2></div><div data-waste-results data-waste-category="${escape(v.slug)}">${wasteProductResults(1,v.slug)}</div></section>`;
}
