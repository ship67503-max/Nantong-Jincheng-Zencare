// Public documents supplied by JCZCARE. Authorization letters remain private.
export const certificateDocuments = [
  {
    id: 'fsc-chain-of-custody', group: 'pet-pads', type: 'Chain of custody', title: 'FSC® Chain of Custody',
    issuer: 'SGS', number: 'SGSHK-COC-311099', reference: 'CN23/00004806',
    from: '21 July 2025', until: '9 September 2028', pages: 1,
    scope: 'Purchase of FSC 100%, FSC Mix and FSC Recycled pulp and toilet paper; manufacture and sales of FSC 100% and FSC Mix pet pads, hygienic pads and training pads under the transfer system.',
    note: 'Applies to products supplied with the applicable FSC claim. Confirm the material specification and sales-document claim for your order; not every pad is automatically FSC-certified.',
    detail: 'FSC-STD-40-004 V3-1 · FSC-STD-50-001',
  },
  {
    id: 'ok-compost-industrial', group: 'compostable-bags', type: 'Industrial compostability', title: 'OK compost INDUSTRIAL',
    issuer: 'TÜV AUSTRIA', number: 'TA8012509341', from: '25 August 2025', until: '25 August 2030', pages: 1,
    scope: 'Bags for collection of biodegradable refuse, shopping bags and bags for loose products, within the certified description. Maximum nominal thickness: 78 μm.',
    note: 'For the specified products bearing the conformity mark. Industrial composting conditions apply; this document does not establish home compostability.',
    detail: 'OK 01 Edition F · including EN 13432:2000',
  },
  {
    id: 'seedling-industrial-compostability', group: 'compostable-bags', type: 'Industrial compostability', title: 'Seedling mark',
    issuer: 'TÜV AUSTRIA', number: '7P2697 — Ed. A', from: '25 August 2025', until: '25 August 2028', pages: 1,
    scope: 'Bags / sack trade and bags for collection of biodegradable refuse. Maximum thickness: 78 μm, white translucent or coloured, within the certified product description.',
    note: 'Applies to specified products bearing the mark. Confirm the material, thickness, printing and approved claim for the exact bag configuration.',
    detail: 'Industrial compostability scheme, 2023-07 · EN 13432',
  },
  {
    id: 'en-13432-assessment', group: 'compostable-bags', type: 'Supporting assessment', title: 'EN 13432 assessment',
    issuer: 'TÜV AUSTRIA', number: '65006534-2025-AG-0694insp', from: null, until: null, pages: 10,
    scope: 'Assessment of the described bags, including shopping / check-out bags and bags for loose products, using the specified film formulation with a maximum assessed thickness of 78 μm.',
    note: 'The conclusion applies only when the product corresponds fully to the report description, including material, colour and printing restrictions. This is an assessment report, not a separate certificate for every bag.',
    detail: 'Includes assessment and supporting technical records',
  },
  {
    id: 'eu-medical-device-notification', group: 'adult-care', type: 'EU notification document', title: 'EU Medical Device Notification',
    issuer: 'HUMISS TRADING S.L. · EU authorised representative', number: 'S-YQ-MD-2510280091',
    from: '28 October 2025', until: '27 October 2030', pages: 2,
    scope: 'The annex lists Adult Nursing Pad and Adult Diaper, models M / L / XL / XXL, Class I, rule 1, under Regulation (EU) 2017/745.',
    note: 'This is a notification document for the listed adult-care products. It is not pet-product certification or a notified-body product approval. Confirm the full market documentation for your project.',
    detail: 'Review the product annex on page 2',
  },
  {
    id: 'bsci-social-audit', group: 'social-compliance', type: 'Social compliance monitoring', title: 'amfori BSCI Social Audit — Full Monitoring',
    issuer: 'amfori · Monitoring partner: LRQA', number: '26-0427387', from: '19 August 2026', until: '26 August 2027', pages: 11,
    scope: 'Monitoring summary for Nantong Jincheng Zencare Technology Co., Ltd. covering the manufacturing site, management practices, worker conditions, occupational health and safety, and environmental protection areas reviewed in the amfori BSCI framework.',
    note: 'This is an extract of an online monitoring result and not a product certificate or blanket certification. The supplied document shows an overall rating of C; review the complete current result and corrective-action status before making a buyer or packaging claim.',
    detail: 'amfori BSCI · Full Monitoring · Semi Announced · Monitoring ID 26-0427387',
  },
];

const arrow = '<span aria-hidden="true">↗</span>';
const pdf = d => `/documents/certificates/${d.id}.pdf`;
const thumbNames = {
  'fsc-chain-of-custody': 'FSC-chain-of-custody-certificate.webp',
  'ok-compost-industrial': 'OK-compost-industrial-certificate.webp',
  'seedling-industrial-compostability': 'Seedling-industrial-compostability-certificate.webp',
  'en-13432-assessment': 'EN-13432-compostability-assessment.webp',
  'eu-medical-device-notification': 'EU-adult-care-medical-device-notification.webp',
  'bsci-social-audit': 'BSCI-social-compliance-audit.webp',
};
const thumb = d => `/images/certificates/${thumbNames[d.id] || `${d.id}.webp`}`;
const documentImage = (d, eager=false) => `<img src="${thumb(d)}" alt="First page of ${d.title}, reference ${d.number}" width="1131" height="1600" loading="${eager ? 'eager' : 'lazy'}" decoding="async">`;
const requestLink = group => '/contact?' + new URLSearchParams({intent:'documents', product: group === 'pet-pads' ? 'pet-training-pads' : group === 'compostable-bags' ? 'garbage-bags' : group === 'adult-care' ? 'adult-underpads' : 'other', brief:'Please share current certificate and compliance documents relevant to our product and target market.'});

function documentCard(d) {
  return `<article class="certificate-document" id="${d.id}">
    <a class="certificate-document-image" href="${pdf(d)}" target="_blank" rel="noopener" aria-label="Open ${d.title} PDF in a new tab">${documentImage(d)}<span>View original · ${d.pages} ${d.pages===1?'page':'pages'} ${arrow}</span></a>
    <div class="certificate-document-copy"><p class="certificate-label">${d.type}</p><h3>${d.title}</h3><p class="certificate-issuer">${d.issuer}</p>
      <dl class="certificate-meta"><div><dt>Document reference</dt><dd>${d.number}${d.reference?`<small>${d.reference}</small>`:''}</dd></div><div><dt>${d.until?'Validity shown on document':'Document type'}</dt><dd>${d.until?`${d.from} — ${d.until}`:'Technical assessment report · 2025'}</dd></div></dl>
      <p class="certificate-scope-title">PRODUCT SCOPE</p><p class="certificate-scope">${d.scope}</p><p class="certificate-scope-note">${d.note}</p>
      <div class="certificate-document-links"><a class="text-link" href="${pdf(d)}" target="_blank" rel="noopener">View full document ${arrow}</a><a class="text-link" href="${pdf(d)}" download>Download PDF <span aria-hidden="true">↓</span></a></div>
      <small class="certificate-standard">${d.detail}</small>
    </div>
  </article>`;
}

const groups = [
  {id:'pet-pads', number:'01', label:'Pet pads & hygienic pads', title:'Trace the material.<br>Understand the claim.', text:'Chain-of-custody documentation connects the certified fibre inputs with the covered pad products.', path:'/products/pet-training-pads', product:'Explore pet pads'},
  {id:'compostable-bags', number:'02', label:'Selected compostable bags', title:'The right evidence.<br>For the exact bag.', text:'Read the two mark certificates together with the supporting assessment. Industrial compostability is specific to the approved product configuration.', path:'/products/garbage-bags', product:'Explore bag formats'},
  {id:'adult-care', number:'03', label:'Adult care', title:'Clear documents.<br>A defined care range.', text:'Review the notification document and its product annex for the listed adult nursing pads and adult diapers.', path:'/products/adult-underpads', product:'Explore adult care'},
  {id:'social-compliance', number:'04', label:'Social compliance', title:'Responsible sourcing.<br>With the site context.', text:'Review the supplied amfori BSCI monitoring summary as factory-level social-compliance evidence, separate from product certification.', path:'/factory', product:'Review our factory'},
];

export function certificatesPage() {
  return `<div class="certificates-page">
    <nav class="wrap breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/resources">Buyer resources</a><span>/</span><span aria-current="page">Certificates</span></nav>
    <section class="wrap certificate-hero"><div><p class="eyebrow">JCZCARE / DOCUMENTATION CENTER</p><h1>Confidence.<br><em>With context.</em></h1><p class="certificate-lead">Certificates &amp; compliance evidence, organised around the products you source.</p><p class="certificate-intro">Review the original documents, their scope and the dates shown. Then confirm the right documentation for your specification and destination market.</p><a class="button" href="#certificate-scopes">Explore the documents <span aria-hidden="true">↓</span></a></div>
      <div class="certificate-hero-visual"><span class="certificate-hero-caption">ORIGINAL DOCUMENTS / CLEAR PRODUCT SCOPE</span><div class="certificate-paper-stack"><a class="certificate-stack-back" href="#compostable-bags" aria-label="Review industrial compostability documents">${documentImage(certificateDocuments[1],true)}</a><a class="certificate-stack-front" href="#pet-pads" aria-label="Review FSC chain-of-custody document">${documentImage(certificateDocuments[0],true)}</a></div><div class="certificate-hero-bottom"><strong>06 <span>documents</span></strong><p>One source for your<br>supplier review.</p></div></div>
    </section>
    <nav class="wrap certificate-scope-nav" id="certificate-scopes" aria-label="Certificate product scopes">${groups.map(g=>`<a href="#${g.id}"><span>${g.number} / PRODUCT SCOPE</span><strong>${g.label} <b aria-hidden="true">↘</b></strong></a>`).join('')}</nav>
    <div class="wrap certificate-holder"><span>DOCUMENT HOLDER / MANUFACTURER</span><p>Nantong Jincheng Zencare Technology Co., Ltd.</p><small>JCZCARE is our website identity. Refer to each original document for the complete legal name and address.</small></div>
    ${groups.map(g=>`<section class="certificate-group ${g.id==='compostable-bags'?'certificate-group-tinted':''}" id="${g.id}"><div class="wrap"><div class="certificate-group-heading"><div><p class="eyebrow">${g.number} / ${g.label}</p><h2>${g.title}</h2></div><div><p>${g.text}</p><a class="text-link" href="${g.path}">${g.product} ${arrow}</a></div></div><div class="certificate-documents">${certificateDocuments.filter(d=>d.group===g.id).map(documentCard).join('')}</div><div class="certificate-group-end"><p>Need evidence for your selected specification?</p><a class="text-link" href="${requestLink(g.id)}">Request project documents ${arrow}</a></div></div></section>`).join('')}
    <section class="wrap certificate-read-guide"><div><p class="eyebrow">BEFORE USING A CLAIM</p><h2>Match the document<br>to your product.</h2></div><ol><li><span>01</span><div><h3>Check the scope</h3><p>Confirm the legal entity, product, materials, thickness and permitted configuration.</p></div></li><li><span>02</span><div><h3>Confirm the current status</h3><p>Dates shown are transcribed from the supplied documents. Request the latest version and verify current status with the issuing body.</p></div></li><li><span>03</span><div><h3>Agree the market claim</h3><p>Confirm destination requirements and any approval needed for certificate marks or packaging artwork before production.</p></div></li></ol></section>
    <section class="closing wrap certificate-closing"><div><p class="eyebrow">YOUR PRODUCT / YOUR MARKET</p><h2>Bring the requirement.<br>We’ll review the evidence.</h2><p>Tell us the product, material direction and destination market.</p></div><a class="button" href="${requestLink('')}">Request documentation ${arrow}</a></section>
  </div>`;
}

export function certificateHome() {
  const featured = certificateDocuments;
  return `<section class="certificate-home" id="certificates" aria-labelledby="certificate-home-title"><div class="wrap"><div class="certificate-home-heading"><div><p class="eyebrow">EVIDENCE FOR INFORMED SOURCING</p><h2 id="certificate-home-title">More than a mark.<br><em>Know what it covers.</em></h2></div><div><a class="text-link" href="/certifications">Explore certificates ${arrow}</a></div></div><div class="certificate-home-grid">${featured.map(d=>{const g=groups.find(group=>group.id===d.group); return `<a class="certificate-home-card" href="/certifications#${d.group}"><div class="certificate-home-preview">${documentImage(d)}</div><div class="certificate-home-copy"><h3>${d.id==='eu-medical-device-notification'?'Adult-care EU notification':d.id==='bsci-social-audit'?'amfori BSCI monitoring summary':d.title}</h3></div></a>`;}).join('')}</div></div></section>`;
}

function productEvidence(slug) {
  const config = {
    'pet-training-pads': ['pet-pads','FSC® chain-of-custody documentation.','For covered pet pad products supplied with the applicable FSC claim. Confirm certified material inputs and the order documentation with our team.', [0]],
    'garbage-bags': ['compostable-bags','Evidence for selected compostable bags.','OK compost INDUSTRIAL, Seedling and EN 13432 documentation applies to the specified bag constructions. It does not cover every bag in this range or establish home compostability.', [1,2,3]],
    'adult-underpads': ['adult-care','Documentation for the listed adult-care products.','The EU notification document lists Adult Nursing Pad and Adult Diaper in its annex. Confirm the exact model, current documentation and destination-market requirements.', [4]],
  }[slug];
  if(!config)return '';
  const [group,title,note,indices]=config;
  return `<section class="wrap product-certificate" id="product-certificates" aria-label="Relevant product documentation"><div><p class="eyebrow">DOCUMENTS / DEFINED PRODUCT SCOPE</p><h2>${title}</h2><p>${note}</p><a class="text-link" href="/certifications#${group}">View documents &amp; scope ${arrow}</a></div><div class="product-certificate-documents">${indices.map(i=>{const d=certificateDocuments[i];return `<a href="/certifications#${d.id}">${documentImage(d)}<span><strong>${d.title}</strong><small>${d.number}</small></span>${arrow}</a>`;}).join('')}</div></section>`;
}

export function addCertificateEvidence(html, path) {
  const evidence = productEvidence(path.replace('/products/',''));
  if(evidence){
    const marker = path.endsWith('pet-training-pads') ? '<section class="section wrap pad-brief-layout"' : '<section class="section wrap faq-layout" id="product-faq"';
    return html.replace(marker, evidence + marker);
  }
  if(path==='/quality-control')return html.replace('<a class="button" href="/contact?intent=documents">', '<p><a class="text-link" href="/certifications">Explore certificates &amp; scope ↗</a></p><a class="button" href="/contact?intent=documents">');
  if(path==='/factory')return html.replace('<section class="closing wrap">', `<section class="wrap certificate-gateway"><p class="eyebrow">CONTINUE YOUR SUPPLIER REVIEW</p><h2>The documents.<br>The scope behind them.</h2><p>Review FSC chain of custody, industrial compostability evidence and adult-care notification documents in one place.</p><a class="text-link" href="/certifications">Visit the certificate center ${arrow}</a></section><section class="closing wrap">`);
  if(path==='/resources')return html.replace('<div class="resources-grid">', `<div class="resources-grid"><article class="resource-card"><span>DOCUMENTS</span><h3>Certificates &amp; scope</h3><p>View original certificates and supporting reports, organised by product application, issuer and validity.</p><a class="text-link" href="/certifications">Review documents ${arrow}</a></article>`);
  return html;
}
