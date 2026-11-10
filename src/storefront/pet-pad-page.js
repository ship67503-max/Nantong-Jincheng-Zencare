const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow = '<span aria-hidden="true">↗</span>';
const sizes = ['33 × 45', '45 × 60', '60 × 60', '60 × 90', '80 × 120'];
const inquiry = (format='', intent='sample') => `/contact?${new URLSearchParams({product:'pet-training-pads',format,intent})}`;
const link = (href, text, cls='button') => `<a class="${cls}" href="${esc(href)}">${text} ${arrow}</a>`;
const details = [
  ['EVERYDAY FOUNDATION','Non-woven surface','Tissue paper in layer 02','Wood pulp + SAP core'],
  ['A DIFFERENT SECOND LAYER','Bamboo charcoal paper in layer 02','Also available with perforated film','Wood pulp + SAP core'],
  ['PLACEMENT & HANDLING','Adhesive backing option','Confirm the intended floor surface','Review holding and removal on a sample'],
  ['SCENT IN THE PACKAGE','Fragrance added inside the package','Discuss scent and packaging requirements','Fragrance is not a separate core layer'],
  ['A DIFFERENT FIRST LAYER','Perforated film replaces non-woven','The construction remains five layers','Available with tissue or bamboo charcoal paper'],
  ['ARTWORK WITHIN THE PAD','Printed tissue paper in layer 02','Pattern visible through the unprinted top cover','Plain PE backing in this version'],
  ['TURN IT OVER. SEE THE DESIGN.','Artwork directly on the layer 05 PE film','Plain absorbent face in this version','Review film printing and folding together'],
  ['SUPPORT THE TRAINING ROUTINE','Attractant-added product option','Use with consistent placement and rewards','Confirm the formulation and application on a sample'],
  ['A SEPARATE ODOR-CONTROL OPTION','Odor-control additive, not packaging fragrance','Wood pulp + SAP absorbent core','Confirm the formulation and supporting test results'],
];

const aiImageRoot='/images/products/pet-training-pads/ai-details-20260918';
const aiImage=(name,alt,extra='')=>`<img src="${aiImageRoot}/${name}.webp" alt="${esc(alt)}" width="1536" height="1024" ${extra}>`;
const aiLayerNames=['nonwoven-tissue','nonwoven-charcoal','perforated-tissue','perforated-charcoal'];
function imageStack(items, label){
  return `<div class="pad-ai-stack" role="group" aria-label="${label}">${items.map(([key,name,alt],i)=>aiImage(name,alt,`data-ai-image="${key}" class="${i===0?'is-active':''}" aria-hidden="${i!==0}" loading="${i===0?'eager':'lazy'}"`)).join('')}</div>`;
}

export function padVariantPanel(p, index=0) {
  const v=p.variants[index], points=details[index];
  const imageDescriptions = [
    'Standard white pet pad, blue-backed folded pads and retail bag in a home setting.',
    'Bamboo charcoal pet pad and packaging presentation.',
    'Adhesive-backed pet pad and packaging presentation.',
    'White pet pad with an open scented-pad package and a stack of blue-backed folded pads.',
    'Finished pet pad with a finely perforated top film and an intact blue backing, shown with packaging.',
    'Pale blue paw motifs visible through the white top cover; the folded corner shows plain blue PE backing.',
    'Plain white absorbent face with a turned-up corner showing paw motifs on the blue PE backing film.',
    'Samoyed puppy sniffing near a clean pad, beside attractant-pad packaging and folded pads.',
    'White pet pad and odor-control packaging in an indoor setting with a resting Samoyed.'
  ];
  const media=`<img src="${v.image}" alt="${esc(imageDescriptions[index])}${index>=3?' AI-generated product illustration.':''}" width="1536" height="1024" loading="eager" decoding="async">`;
  return `<div class="pad-format-media${index>=3?' pad-format-ai':''}">${media}</div><div class="pad-format-copy"><p class="eyebrow">${points[0]}</p><h3>${v.name}</h3><p>${v.purpose}</p><ul>${points.slice(1).map(s=>`<li>${s}</li>`).join('')}</ul><div class="pad-review"><span>SAMPLE REVIEW</span><p>${v.review}</p></div><div class="actions">${link(p.path+'/'+v.slug,'View product details')}${link(inquiry(v.name),'Request this sample','text-link')}${link('#pad-brief','Build your specification','text-link')}</div></div>`;
}

function layersImages(){
  return imageStack(aiLayerNames.map(key=>[key,'layers-'+key,`AI five-layer illustration: ${key.startsWith('perforated')?'perforated film':'non-woven fabric'}, ${key.endsWith('charcoal')?'bamboo charcoal paper':'tissue paper'}, wood pulp and SAP, tissue paper, PE backing.`]),'Five-layer construction images');
}
function printImages(){
  return imageStack([
    ['surface','printed-tissue-layer02','AI cutaway: printed tissue in layer 02 beneath an unprinted non-woven cover, with the pattern visible through the cover.'],
    ['backing','printed-backing','AI product illustration: paw patterns printed directly on the PE backing film in layer 05, viewed from underneath.'],
  ],'Printed layer 02 tissue or layer 05 PE backing');
}

export function petPadPage(p) {
  return `<div class="pad-detail">
    <nav class="wrap breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/products">Products</a><span>/</span><span aria-current="page">Pet training pads</span></nav>
    <section class="wrap pad-intro"><div><p class="eyebrow">PET TRAINING PADS / OEM & ODM</p><h1>Everyday care.<br><em>Your specification.</em></h1><p class="pad-lead">Pet training pads are a core product of our factory. Build your range around the surface, materials and presentation your market needs.</p><div class="actions">${link('#range','Explore nine formats')}${link('#pad-brief','Request a sample','text-link')}</div><p class="hero-note">For pet brands, retailers and distributors.</p></div><figure class="pad-hero-figure"><img src="${p.image}" alt="Pet pad and packaging presentation" fetchpriority="high"><figcaption>Pet pads / product & packaging presentation</figcaption></figure></section>
    <div class="wrap pad-facts"><div><strong>${String(p.variants.length).padStart(2,'0')}</strong><span>Product directions</span></div><div><strong>05</strong><span>Construction layers</span></div><div><strong>05</strong><span>Standard size references</span></div><div><strong>OEM / ODM</strong><span>A brief built around your market</span></div></div>
    <nav class="wrap product-jump pad-jump" aria-label="Product page sections"><a href="#range">01 · Formats</a><a href="#pad-construction">02 · Materials</a><a href="#specifications">03 · Sizes</a><a href="#visual-brief">04 · In use</a><a href="#pad-presentation">05 · Print & pack</a><a href="#pad-brief">06 · Your brief</a></nav>
    <section class="section wrap" id="range"><div class="section-heading"><div><p class="eyebrow">01 / CHOOSE YOUR DIRECTION</p><h2>One essential.<br>Nine ways to specify it.</h2></div><p>Start with the feature that matters.<br>Then review the complete construction.</p></div><div class="variant-buttons pad-format-buttons" role="group" aria-label="Choose product format">${p.variants.map((v,i)=>`<button type="button" data-variant="${i}" aria-pressed="${i===0}" aria-controls="variant-panel"><span>0${i+1}</span>${v.name}</button>`).join('')}</div><div id="variant-panel" class="pad-format-panel" aria-live="polite">${padVariantPanel(p)}</div><p class="pad-small">These are product directions, not mutually exclusive categories. Perforated film + bamboo charcoal is available. Other combinations are confirmed with our team.</p><details class="format-overview"><summary>Compare all ${p.variants.length} product directions</summary><div class="table-scroll"><table><caption>What changes in each format</caption><thead><tr><th scope="col">Format</th><th scope="col">Construction / presentation</th><th scope="col">Sample review</th></tr></thead><tbody>${p.variants.map(v=>`<tr><th scope="row">${v.name}</th><td>${v.purpose}</td><td>${v.review}</td></tr>`).join('')}</tbody></table></div></details></section>
    <section class="pad-material-section" id="pad-construction"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">02 / INSIDE THE PAD</p><h2>Five layers.<br>Every material, clear.</h2></div><p>Change the surface. Change the second layer. <br>The structure still has five layers.</p></div><div class="pad-material-grid"><div class="pad-material-art" data-pad-surface="nonwoven" data-pad-paper="tissue">${layersImages()}</div><div class="pad-material-copy"><div class="pad-material-controls"><fieldset><legend>Layer 01 · Surface</legend><label><input type="radio" name="pad-surface" value="nonwoven" checked>Non-woven fabric</label><label><input type="radio" name="pad-surface" value="perforated">Perforated film</label></fieldset><fieldset><legend>Layer 02 · Paper</legend><label><input type="radio" name="pad-paper" value="tissue" checked>Tissue paper</label><label><input type="radio" name="pad-paper" value="charcoal">Bamboo charcoal paper</label></fieldset></div><ol class="pad-layer-list" aria-live="polite"><li><span>01</span><div><strong data-layer-name="1">Non-woven fabric</strong><p data-layer-description="1">The surface in contact with the pet.</p></div></li><li><span>02</span><div><strong data-layer-name="2">Tissue paper</strong><p data-layer-description="2">Paper layer above the absorbent core.</p></div></li><li><span>03</span><div><strong>Wood pulp + SAP</strong><p>The absorbent core. SAP is a superabsorbent polymer.</p></div></li><li><span>04</span><div><strong>Tissue paper</strong><p>Paper layer below the absorbent core.</p></div></li><li><span>05</span><div><strong>PE film</strong><p>The bottom backing layer.</p></div></li></ol><p class="pad-material-note" data-material-note>Standard surface with tissue paper. Layer selections are carried into your inquiry brief.</p></div></div></div></section>
    <section class="section wrap" id="specifications"><div class="section-heading"><div><p class="eyebrow">03 / FIND THE RIGHT FOOTPRINT</p><h2>Five familiar sizes.<br>Room for your own.</h2></div><p>Choose a reference dimension for your brief.<br>Custom sizes are supported.</p></div><div class="pad-sizes" role="group" aria-label="Pad size">${sizes.map((size,i)=>`<button type="button" data-pad-size="${size}" aria-pressed="${i===1}"><span class="pad-size-art" aria-hidden="true"><i style="--sw:${[41.25,56.25,75,75,100][i]}%;--sh:${[37.5,50,50,75,100][i]}%"></i></span><strong>${size} <small>cm</small></strong><span>Standard size</span></button>`).join('')}<button type="button" data-pad-size="custom" aria-pressed="false"><span class="pad-size-art pad-size-custom" aria-hidden="true">＋</span><strong>Your size</strong><span>Custom dimensions</span></button></div><div class="pad-custom-dimensions" hidden><label>Custom width (cm)<input name="pad-width" type="number" min="1" max="999" step="0.1" inputmode="decimal" placeholder="Width"></label><span aria-hidden="true">×</span><label>Custom length (cm)<input name="pad-length" type="number" min="1" max="999" step="0.1" inputmode="decimal" placeholder="Length"></label></div><p class="pad-small">Dimensions are size references. Confirm usable absorbent area, weight, tolerances and pack counts with your sample specification.</p></section>
    
    <section class="section wrap" id="pad-presentation"><div class="section-heading"><div><p class="eyebrow">05 / THE FINISHING DETAILS</p><h2>Your print.<br>Your presentation.</h2></div><p>Separate the product artwork<br>from the packaging choices.</p></div><div class="pad-presentation-grid"><div class="pad-print-demo"><div class="pad-print-art" data-print-side="surface">${printImages()}<span data-print-caption>Printed tissue · Layer 02</span></div><div class="pad-print-switch" role="group" aria-label="Preview print placement"><button type="button" data-print-preview="surface" aria-pressed="true">Surface view · Layer 02</button><button type="button" data-print-preview="backing" aria-pressed="false">PE backing · Layer 05</button></div><p class="pad-print-explanation" data-print-explanation>Layer 02 tissue is printed before lamination. The pattern is visible through the unprinted non-woven cover.</p><p class="pad-small">AI illustrations: surface-side tissue cutaway and directly printed PE backing. Final artwork and appearance follow the approved sample.</p></div><div class="pad-pack-copy"><article><span>01 / PRODUCT PRINTING</span><h3>Two print options.<br>Two different layers.</h3><p>For the surface-view version, print the layer 02 tissue paper before lamination; the pattern shows through the unprinted cover. For the backing-view version, print directly on the layer 05 PE backing film. Layer 04 remains plain tissue paper.</p><ol class="pad-print-process"><li><span>01</span>Choose tissue or PE film</li><li><span>02</span>Specify the artwork</li><li><span>03</span>Review the finished pad</li></ol></article><article><span>02 / FRAGRANCE</span><h3>Added inside the package.</h3><p>The fragrance option is applied inside the packaging. Tell us your scent preference and target market; confirm the available method with our team.</p></article><article><span>03 / PRIVATE-LABEL PACKING</span><h3>Make the pack part of the brief.</h3><p>Discuss pieces per pack, artwork, folding, carton details and shipping marks alongside the pad itself.</p></article></div></div></section>
    <section class="pad-sample-section"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">FROM SPECIFICATION TO SAMPLE</p><h2>See it. Handle it.<br>Review it on a sample.</h2></div><p>Agree the test conditions before comparing results.<br>Illustrations are not performance measurements.</p></div><div class="pad-test-list">${[['Absorption','Liquid intake, retention and rewet.'],['Surface & backing','Edge leakage, film and seal integrity.'],['Selected features','Adhesive handling, print finish, fragrance, attractant trials and odor-control evidence.']].map(([h,d],i)=>`<article><span>0${i+1}</span><h3>${h}</h3><p>${d}</p></article>`).join('')}</div><ol class="pad-process">${['Choose your direction','Define the specification','Review the sample','Approve product & pack'].map((s,i)=>`<li><span>0${i+1}</span>${s}</li>`).join('')}</ol></div></section>
    <section class="section wrap pad-brief-layout" id="pad-brief"><div><p class="eyebrow">06 / LET’S BUILD YOUR RANGE</p><h2>A few choices.<br>A clearer inquiry.</h2><p class="section-description">Your format, layer and size selections are included automatically. Add the finishing details you already know.</p><p class="pad-moq">A fixed MOQ applies. Ask through our inquiry form or the existing WhatsApp contact.</p>${link('https://wa.me/8618962944556','Ask on WhatsApp','text-link')}<p class="pad-small">Nantong Jincheng Zencare Technology Co.,Ltd</p></div><form class="pad-brief-form"><div class="pad-brief-summary" aria-live="polite"><span>YOUR STARTING SPECIFICATION</span><p data-pad-summary></p></div><div class="form-grid"><label>Print option<select name="pad-print"><option value="Not specified">Not specified</option><option value="No print">No print</option><option value="Layer 02 tissue printing (surface view)">Layer 02 tissue · surface view</option><option value="Layer 05 PE film printing (backing view)">Layer 05 PE film · backing view</option></select></label><label>Packaging fragrance<select name="pad-fragrance"><option value="Not specified">Not specified</option><option value="No fragrance requested">No fragrance requested</option><option value="Fragrance inside packaging requested">Fragrance inside packaging requested</option></select></label><label>Adhesive backing<select name="pad-adhesive"><option value="Not specified">Not specified</option><option value="Requested">Requested</option><option value="Not requested">Not requested</option></select></label><label>Attractant additive<select name="pad-attractant"><option value="Not specified">Not specified</option><option value="Requested">Requested</option><option value="Not requested">Not requested</option></select></label><label>Odor-control additive<select name="pad-odor-control"><option value="Not specified">Not specified</option><option value="Requested">Requested</option><option value="Not requested">Not requested</option></select></label><label>Pieces per pack<input name="pad-pack-count" type="number" min="1" step="1" placeholder="To be discussed"></label><label>Estimated quantity<input name="pad-quantity" maxlength="100" placeholder="Pieces, packs or monthly forecast"></label><label>Target market<input name="pad-market" maxlength="100" placeholder="Country / sales channel"></label></div><label>Artwork, scent or other requirements<textarea name="pad-notes" rows="3" maxlength="1500" placeholder="Share any preferences or questions…"></textarea></label><p class="pad-small">Layer 02 printing uses tissue paper in layer 02. Additive formulas, application methods and feature combinations are reviewed with our team. No price or availability is calculated here.</p><div class="actions"><button class="button" type="submit" name="pad-intent" value="sample">Request a sample ${arrow}</button><button class="text-link" type="submit" name="pad-intent" value="quote">Request a quote ${arrow}</button></div></form></section>
    <section class="section wrap faq-layout" id="product-faq"><div><p class="eyebrow">BUYER QUESTIONS</p><h2>Know the details.<br>Choose with clarity.</h2></div><div class="faq-list">${[...p.faq,['Where can I find the MOQ?','MOQ is fixed. Contact our team through the inquiry form or WhatsApp for the applicable MOQ.'],['How should I compare samples?','Use consistent size and test conditions. Review absorption, retention, rewet, backing and the selected optional features separately.']].map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></section><div class="wrap category-next"><a href="/products">← All product categories</a><a href="/products/pet-absorbent-paper-sheets">Next: Pet absorbent paper →</a></div>
  </div>`;
}

export function initPetPadPage(root, product) {
  const page=root.querySelector('.pad-detail');
  if(!page)return;
  let selectedFormat=0, selectedSize=sizes[1];
  const form=page.querySelector('.pad-brief-form');
  const surface=()=>page.querySelector('[name="pad-surface"]:checked').value;
  const paper=()=>page.querySelector('[name="pad-paper"]:checked').value;
  const surfaceText=()=>surface()==='perforated'?'Perforated film':'Non-woven fabric';
  const paperText=()=>paper()==='charcoal'?'Bamboo charcoal paper':'Tissue paper';
  const sizeText=()=>selectedSize==='custom'?`${page.querySelector('[name="pad-width"]').value||'?'} × ${page.querySelector('[name="pad-length"]').value||'?'} cm (custom)`:selectedSize+' cm';
  async function showImage(container,key){
    const target=container.querySelector(`[data-ai-image="${key}"]`);
    if(!target)return;
    container.dataset.requestedImage=key;
    if(target.classList.contains('is-active')&&target.complete&&target.naturalWidth){container.setAttribute('aria-busy','false');return;}
    container.setAttribute('aria-busy','true');
    try{
      await target.decode();
      if(!container.isConnected||container.dataset.requestedImage!==key)return;
      container.querySelectorAll('[data-ai-image]').forEach(img=>{
        img.classList.toggle('is-active',img===target);
        img.setAttribute('aria-hidden',String(img!==target));
      });
      container.removeAttribute('data-image-error');
    }catch{
      if(container.dataset.requestedImage===key)container.dataset.imageError='true';
    }finally{
      if(container.dataset.requestedImage===key)container.setAttribute('aria-busy','false');
    }
  }
  function update(){
    const art=page.querySelector('.pad-material-art');art.dataset.padSurface=surface();art.dataset.padPaper=paper();
    showImage(art.querySelector('.pad-ai-stack'),`${surface()}-${paper()}`);
    page.querySelector('[data-layer-name="1"]').textContent=surfaceText();
    page.querySelector('[data-layer-description="1"]').textContent=surface()==='perforated'?'Replaces the non-woven surface; it is not an extra layer.':'The surface in contact with the pet.';
    page.querySelector('[data-layer-name="2"]').textContent=paperText();
    page.querySelector('[data-layer-description="2"]').textContent=paper()==='charcoal'?'Replaces the ordinary tissue paper in layer 02.':'Paper layer above the absorbent core.';
    page.querySelector('[data-material-note]').textContent=`${surfaceText()} + ${paperText().toLowerCase()}. Five layers; PE film remains the bottom backing.`;
    page.querySelector('[data-pad-summary]').textContent=`${product.variants[selectedFormat].name} · ${sizeText()} · ${surfaceText()} · ${paperText()}`;
    const printValue=form.elements['pad-print'].value;
    const incompatible=printValue==='Layer 02 tissue printing (surface view)'&&paper()==='charcoal';
    form.elements['pad-print'].setCustomValidity(incompatible?'Layer 02 printing uses tissue paper. Choose tissue paper for Layer 02, or select another print option.':'');
    const printSide=printValue.startsWith('Layer 02')?'surface':printValue.startsWith('Layer 05')?'backing':null;
    if(printSide){
      showImage(page.querySelector('.pad-print-art .pad-ai-stack'),printSide);
      page.querySelector('.pad-print-art').dataset.printSide=printSide;
      page.querySelector('[data-print-caption]').textContent=printSide==='surface'?'Printed tissue · Layer 02':'Printed PE film · Layer 05';
      page.querySelectorAll('[data-print-preview]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.printPreview===printSide)));
      page.querySelector('[data-print-explanation]').textContent=printSide==='surface'?'Layer 02 tissue is printed before lamination. The pattern is visible through the unprinted non-woven cover.':'The pattern is printed directly on the PE backing film in layer 05. Layer 04 tissue paper remains unprinted.';
    }
  }
  page.addEventListener('click',e=>{
    const variant=e.target.closest('[data-variant]');
    if(variant){
      selectedFormat=Number(variant.dataset.variant);
      page.querySelectorAll('[data-variant]').forEach(b=>b.setAttribute('aria-pressed',String(b===variant)));
      page.querySelector('#variant-panel').innerHTML=padVariantPanel(product,selectedFormat);
      // A format selection starts a fresh brief; material controls remain independently selectable.
      page.querySelector('[name="pad-surface"][value="'+(selectedFormat===4?'perforated':'nonwoven')+'"]').checked=true;
      page.querySelector('[name="pad-paper"][value="'+(selectedFormat===1?'charcoal':'tissue')+'"]').checked=true;
      form.elements['pad-adhesive'].value=selectedFormat===2?'Requested':'Not specified';
      form.elements['pad-fragrance'].value=selectedFormat===3?'Fragrance inside packaging requested':'Not specified';
      form.elements['pad-print'].value=selectedFormat===5?'Layer 02 tissue printing (surface view)':selectedFormat===6?'Layer 05 PE film printing (backing view)':'Not specified';
      form.elements['pad-attractant'].value=selectedFormat===7?'Requested':'Not specified';
      form.elements['pad-odor-control'].value=selectedFormat===8?'Requested':'Not specified';
      update();
    }
    const size=e.target.closest('[data-pad-size]');
    if(size){selectedSize=size.dataset.padSize;page.querySelectorAll('[data-pad-size]').forEach(b=>b.setAttribute('aria-pressed',String(b===size)));page.querySelector('.pad-custom-dimensions').hidden=selectedSize!=='custom';update();}
    const print=e.target.closest('[data-print-preview]');
    if(print){form.elements['pad-print'].value=print.dataset.printPreview==='surface'?'Layer 02 tissue printing (surface view)':'Layer 05 PE film printing (backing view)';update();}
  });
  page.addEventListener('change',update);page.addEventListener('input',update);
  form.addEventListener('submit',e=>{
    e.preventDefault();
    if(selectedSize==='custom'){
      for(const name of ['pad-width','pad-length']){const field=page.querySelector(`[name="${name}"]`);field.required=true;if(!field.reportValidity())return;}
    }
    const brief=[`Starting direction: ${product.variants[selectedFormat].name}`,`Size: ${sizeText()}`,`Layer 01: ${surfaceText()}`,`Layer 02: ${paperText()}`,'Layer 03: Wood pulp + SAP','Layer 04: Tissue paper','Layer 05: PE film',`Print: ${form.elements['pad-print'].value}`,`Adhesive backing: ${form.elements['pad-adhesive'].value}`,`Packaging fragrance: ${form.elements['pad-fragrance'].value}`,`Attractant additive: ${form.elements['pad-attractant'].value}`,`Odor-control additive: ${form.elements['pad-odor-control'].value}`,`Pieces per pack: ${form.elements['pad-pack-count'].value||'To be discussed'}`,form.elements['pad-notes'].value].filter(Boolean).join('\n');
    const params=new URLSearchParams({product:product.slug,format:product.variants[selectedFormat].name,intent:e.submitter?.value||'sample',brief,quantity:form.elements['pad-quantity'].value,market:form.elements['pad-market'].value});
    // Continue to the contact form. No inquiry is sent by this step.
    const a=document.createElement('a');a.href='/contact?'+params;page.append(a);a.click();a.remove();
  });
  update();
}
