import {sourceRange} from './source-products.js';
import {escapeHtml as esc} from './pages.js';

const assetRoot='/images/products/pet-absorbent-paper-sheets/ai-details-20260918';
const materials=[
  {key:'nonwoven',name:'Non-woven absorbent sheets',outer:'Non-woven fabric',description:'Non-woven outer faces enclose a shared wood-pulp + SAP absorbent core. Available plain or with your printed design.'},
  {key:'wet-strength',name:'Wet-strength paper sheets',outer:'Thickened wet-strength tissue paper',description:'Thickened wet-strength tissue-paper outer faces enclose the same wood-pulp + SAP absorbent core. Available plain or with your printed design.'},
];
const image=(name,alt,extra='')=>`<img src="${assetRoot}/${name}.webp" alt="${esc(alt)}" width="1536" height="1024" ${extra}>`;
const heading=(kicker,title,copy)=>`<div class="section-heading"><div><p class="eyebrow">${kicker}</p><h2>${title}</h2></div><p>${copy}</p></div>`;
function imageStack(items,label){
  return `<div class="paper-detail-images" role="group" aria-label="${label}">${items.map(([name,alt],i)=>image(name,alt,`data-paper-image="${name}" class="${i===0?'is-active':''}" aria-hidden="${i!==0}" loading="${i===0?'eager':'lazy'}"`)).join('')}</div>`;
}
const materialButtons=()=>materials.map((m,i)=>`<button type="button" data-variant="${i}" aria-pressed="${i===0}" aria-controls="variant-panel"><span>0${i+1}</span>${m.name}</button>`).join('');

export function paperExperience(p){
  const productImages=materials.flatMap(m=>[[m.key+'-plain',`AI illustration of plain ${m.outer.toLowerCase()} absorbent cleanup sheets.`],[m.key+'-print',`AI illustration of custom paw-pattern printing on ${m.outer.toLowerCase()} absorbent cleanup sheets.`]]);
  const structureImages=materials.map(m=>[m.key+'-structure',`AI material illustration: ${m.outer}, wood pulp and SAP middle core, and ${m.outer.toLowerCase()} on the other face.`]);
  return `${sourceRange(p.slug)}<div class="paper-experience paper-spec-page">
    <nav class="paper-local-nav wrap" aria-label="Absorbent paper navigation"><a href="/products">← Products</a><span>Pet absorbent paper</span><a href="#paper-brief">Request a quote ↗</a></nav>
    <section class="paper-intro paper-spec-hero wrap"><div><p class="eyebrow">PET ABSORBENT PAPER / OEM & ODM</p><h1>Everyday accidents.<br><span>A simpler cleanup.</span></h1><p class="paper-intro-copy">Wood pulp + SAP for pet urine cleanup.<br>Two outer materials. Sizes and packaging for your brand.</p><div class="actions"><a class="button" href="#paper-brief">Request a sample ↗</a><a class="text-link" href="#range">Explore materials ↗</a></div><p class="paper-hero-foot">FOR PET BRANDS · DISTRIBUTORS · RETAILERS</p></div><figure class="paper-reference-product"><img src="${p.image}" alt="Pet absorbent paper in the blue bag with cat and dog artwork, beside folded white sheets" width="1672" height="941" fetchpriority="high"><figcaption>FINISHED CLEANUP SHEETS · PRODUCT & PACKAGING REFERENCE</figcaption></figure></section>
    <div class="wrap paper-spec-facts"><div><strong>02</strong><span>Outer-material options</span></div><div><strong>Wood pulp + SAP</strong><span>A shared absorbent core</span></div><div><strong>25 × 30 / 30 × 40 cm</strong><span>Standard sizes + custom dimensions</span></div><div><strong>Your artwork</strong><span>Sheet printing & custom bags</span></div></div>
    <nav class="wrap product-jump paper-spec-jump" aria-label="Product page sections"><a href="#paper-demo">01 · In use</a><a href="#range">02 · Materials & print</a><a href="#paper-construction">03 · Inside the sheet</a><a href="#specifications">04 · Sizes</a><a href="#paper-packaging">05 · Packaging</a><a href="#paper-brief">06 · Your brief</a></nav>
    
    <section class="wrap paper-use-context"><h2>For the moments<br>a pet pad misses.</h2><p>Pet pads are laid down in advance. Absorbent sheets are placed over urine after an accident: cover, let the sheet absorb, then gather and discard. A practical addition to your pet-care range.</p></section>
    <section class="section wrap" id="range">${heading('02 / MATERIALS & PRINT','Two materials.<br>Your choice of finish.','Choose the outer material first.<br>Custom sheet printing is available for both.')}
      <div class="paper-material-options" role="group" aria-label="Choose outer material">${materialButtons()}</div>
      <div class="paper-range-grid" id="variant-panel"><figure class="paper-detail-figure">${imageStack(productImages,'Plain and printed absorbent sheets')}</figure><div class="paper-range-copy"><p class="eyebrow" data-paper-type>01 / NON-WOVEN OUTER FACES</p><h3>${materials[0].name}</h3><p data-paper-description>${materials[0].description}</p><dl class="paper-material-facts"><div><dt>Outer faces</dt><dd data-paper-outer>${materials[0].outer}</dd></div><div><dt>Middle core</dt><dd>Wood pulp + SAP</dd></div><div><dt>Standard sizes</dt><dd>25 × 30 cm / 30 × 40 cm</dd></div></dl><fieldset class="paper-print-choice"><legend>Sheet finish</legend><div class="paper-segment"><button type="button" data-paper-print="plain" aria-pressed="true">Plain sheets</button><button type="button" data-paper-print="print" aria-pressed="false">Custom printed sheets</button></div></fieldset><p class="paper-fine">Both materials support custom sizes, sheet printing and the packaging options below.</p><div class="actions"><a class="button" data-paper-detail href="${p.path}/${p.variants[0].slug}">View product details ↗</a><a class="text-link" href="#paper-brief">Request your selected sample ↗</a></div></div></div>
    </section>
    <section class="paper-construction-section" id="paper-construction"><div class="wrap">${heading('03 / INSIDE THE SHEET','Different outer faces.<br>The same absorbent core.','The selected material appears on both outer faces.<br>Wood pulp and SAP sit in the middle.')}
      <div class="paper-construction-grid"><figure class="paper-detail-figure">${imageStack(structureImages,'Outer faces and absorbent core')}</figure><div><p class="eyebrow" data-paper-structure-name>NON-WOVEN FABRIC / CONSTRUCTION</p><ol class="paper-component-list"><li><span>01</span><div><h3>Upper outer face</h3><p data-paper-outer>${materials[0].outer}</p></div></li><li><span>02</span><div><h3>Wood pulp + SAP</h3><p>Wood pulp is part of the absorbent core. SAP, a superabsorbent polymer, helps absorb and retain liquid.</p></div></li><li><span>03</span><div><h3>Lower outer face</h3><p data-paper-outer>${materials[0].outer}</p></div></li></ol><a class="text-link" href="#range">Change the outer material ↗</a></div></div>
    </div></section>
    <section class="section wrap" id="specifications">${heading('04 / SELECT A SIZE','Two standard sizes.<br>Room for your own.','Both sizes are available in both materials.<br>Custom dimensions are supported.')}
      <div class="paper-size-options" role="group" aria-label="Sheet size"><button type="button" data-paper-size="25 × 30" aria-pressed="true"><span class="paper-size-drawing"><i style="--paper-w:100px;--paper-h:120px"></i></span><strong>25 × 30 <small>cm</small></strong><span>Standard size</span></button><button type="button" data-paper-size="30 × 40" aria-pressed="false"><span class="paper-size-drawing"><i style="--paper-w:120px;--paper-h:160px"></i></span><strong>30 × 40 <small>cm</small></strong><span>Standard size</span></button><button type="button" data-paper-size="custom" aria-pressed="false"><span class="paper-size-drawing paper-size-plus">＋</span><strong>Your dimensions</strong><span>Custom size</span></button></div>
      <div class="paper-custom-size" hidden><label>Width (cm)<input form="paper-brief-form" name="sheet-width" type="number" min="1" step="0.1" inputmode="decimal" placeholder="Width"></label><span aria-hidden="true">×</span><label>Length (cm)<input form="paper-brief-form" name="sheet-length" type="number" min="1" step="0.1" inputmode="decimal" placeholder="Length"></label></div><p class="paper-fine">Size diagrams share the same scale. Confirm finished dimensions and tolerances with your sample.</p>
    </section>
    <section class="paper-pack-section" id="paper-packaging"><div class="wrap">${heading('05 / PACK FOR YOUR MARKET','The sheet is yours.<br>So is the bag.','Resealable bags or color-printed plastic bags.<br>Custom packaging designs are supported.')}
      <div class="paper-pack-options" role="group" aria-label="Packaging format"><button type="button" data-paper-pack="resealable" aria-pressed="true">${image('pack-resealable','AI concept of a resealable zipper bag holding folded absorbent sheets.','loading="lazy"')}<span class="paper-pack-heading"><strong>Resealable bag</strong><span data-pack-status>Selected ✓</span></span><span class="paper-pack-description">A zip-close format. Custom bag artwork can be included in your brief.</span></button><button type="button" data-paper-pack="printed" aria-pressed="false">${image('pack-custom-print','AI concept of a custom color-printed flexible plastic bag for absorbent sheets.','loading="lazy"')}<span class="paper-pack-heading"><strong>Color-printed plastic bag</strong><span data-pack-status>Select ↗</span></span><span class="paper-pack-description">A custom printed pack for your brand. Review the design, bag size and pack count.</span></button></div>
      <label class="paper-artwork-choice"><input type="checkbox" name="sheet-bag-artwork" form="paper-brief-form">Include custom bag artwork</label><p class="paper-fine">Bag design, closure, pieces per pack and carton details follow the approved specification. Sheet printing and bag printing are separate choices.</p>
    </div></section>
    <section class="section wrap paper-brief-layout" id="paper-brief"><div><p class="eyebrow">06 / YOUR PRODUCT BRIEF</p><h2>Choose the details.<br>We’ll take it from here.</h2><p class="section-description">Your material, sheet finish, size and packaging choices are included automatically. Add the quantities and market you have in mind.</p><p class="paper-moq">MOQ is fixed. Ask our team for the applicable quantity through an inquiry or WhatsApp.</p><a class="text-link" href="https://wa.me/8618962944556" target="_blank" rel="noopener">Ask on WhatsApp ↗</a><p class="paper-fine">Nantong Jincheng Zencare Technology Co.,Ltd</p></div>
      <form id="paper-brief-form" class="paper-brief-form"><div class="paper-brief-summary" aria-live="polite"><span>YOUR SELECTED SPECIFICATION</span><dl><div><dt>Material</dt><dd data-paper-summary="material"></dd></div><div><dt>Sheet finish</dt><dd data-paper-summary="print"></dd></div><div><dt>Size</dt><dd data-paper-summary="size"></dd></div><div><dt>Packaging</dt><dd data-paper-summary="pack"></dd></div><div><dt>Bag artwork</dt><dd data-paper-summary="artwork"></dd></div></dl></div><div class="form-grid"><label>Pieces per pack<input name="sheet-pack-count" type="number" min="1" step="1" placeholder="To be discussed"></label><label>Estimated quantity<input name="sheet-quantity" maxlength="100" placeholder="Pieces, packs or monthly forecast"></label><label class="paper-form-wide">Target market<input name="sheet-market" maxlength="100" placeholder="Country / sales channel"></label></div><label>Artwork & other requirements<textarea name="sheet-notes" maxlength="1500" rows="3" placeholder="Sheet pattern, bag design or other requirements…"></textarea></label><p class="paper-fine">This step prepares your inquiry details for the contact form. Review and send the inquiry on the next page.</p><div class="actions"><button type="submit" class="button" name="sheet-intent" value="sample">Request a sample ↗</button><button type="submit" class="text-link" name="sheet-intent" value="quote">Request a quote ↗</button></div></form>
    </section>
    <section class="section wrap faq-layout" id="product-faq"><div><p class="eyebrow">BUYER QUESTIONS</p><h2>Know the product.<br>Prepare your brief.</h2></div><div class="faq-list">${p.faq.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></section><div class="wrap category-next"><a href="/products">← All product categories</a><a href="/products/pet-training-pads">Explore pet training pads →</a></div>
  </div>`;
}

export function initPaperPage(root,p){
  const page=root.querySelector('.paper-spec-page');if(!page)return;
  const form=page.querySelector('#paper-brief-form');
  const state={material:0,print:'plain',size:'25 × 30',pack:'resealable'};
  const field=name=>form.elements[name]||page.querySelector(`[name="${name}"]`);
  const sizeText=()=>state.size==='custom'?`${field('sheet-width').value||'?'} × ${field('sheet-length').value||'?'} cm (custom)`:state.size+' cm';
  const packText=()=>state.pack==='printed'?'Color-printed plastic bag':'Resealable bag';
  async function showImage(stack,key){
    const target=stack.querySelector(`[data-paper-image="${key}"]`);if(!target)return;
    stack.dataset.requestedImage=key;
    if(target.classList.contains('is-active')&&target.complete&&target.naturalWidth){stack.setAttribute('aria-busy','false');stack.removeAttribute('data-image-error');return;}
    stack.setAttribute('aria-busy','true');
    try{
      await target.decode();
      if(!stack.isConnected||stack.dataset.requestedImage!==key)return;
      stack.querySelectorAll('img').forEach(img=>{img.classList.toggle('is-active',img===target);img.setAttribute('aria-hidden',String(img!==target));});
      stack.removeAttribute('data-image-error');
    }catch{if(stack.dataset.requestedImage===key)stack.dataset.imageError='true';}
    finally{if(stack.dataset.requestedImage===key)stack.setAttribute('aria-busy','false');}
  }
  function update(){
    const m=materials[state.material];
    page.querySelectorAll('[data-variant]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.variant)===state.material)));
    page.querySelector('#variant-panel h3').textContent=m.name;
    page.querySelector('[data-paper-detail]').href='/products/pet-absorbent-paper-sheets/'+(state.material===0?'non-woven-absorbent-sheets':'wet-strength-paper-sheets');
    page.querySelector('[data-paper-description]').textContent=m.description;
    page.querySelector('[data-paper-type]').textContent=`0${state.material+1} / ${m.outer.toUpperCase()}`;
    page.querySelectorAll('[data-paper-outer]').forEach(el=>el.textContent=m.outer);
    page.querySelector('[data-paper-structure-name]').textContent=m.outer.toUpperCase()+' / CONSTRUCTION';
    showImage(page.querySelector('#variant-panel .paper-detail-images'),m.key+'-'+state.print);
    showImage(page.querySelector('#paper-construction .paper-detail-images'),m.key+'-structure');
    page.querySelectorAll('[data-paper-print]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.paperPrint===state.print)));
    page.querySelectorAll('[data-paper-size]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.paperSize===state.size)));
    page.querySelector('.paper-custom-size').hidden=state.size!=='custom';
    for(const name of ['sheet-width','sheet-length'])field(name).required=state.size==='custom';
    page.querySelectorAll('[data-paper-pack]').forEach(b=>{const active=b.dataset.paperPack===state.pack;b.setAttribute('aria-pressed',String(active));b.querySelector('[data-pack-status]').textContent=active?'Selected ✓':'Select ↗';});
    const artwork=field('sheet-bag-artwork');
    if(state.pack==='printed')artwork.checked=true;
    artwork.disabled=state.pack==='printed';
    const summary={material:m.name,print:state.print==='print'?'Custom printed sheets':'Plain sheets',size:sizeText(),pack:packText(),artwork:artwork.checked?'Custom artwork requested':'Not specified'};
    for(const [key,value]of Object.entries(summary))page.querySelector(`[data-paper-summary="${key}"]`).textContent=value;
  }
  page.addEventListener('click',e=>{
    const material=e.target.closest('[data-variant]');if(material)state.material=Number(material.dataset.variant);
    const print=e.target.closest('[data-paper-print]');if(print)state.print=print.dataset.paperPrint;
    const size=e.target.closest('[data-paper-size]');if(size)state.size=size.dataset.paperSize;
    const pack=e.target.closest('[data-paper-pack]');if(pack)state.pack=pack.dataset.paperPack;
    if(material||print||size||pack)update();
  });
  page.addEventListener('input',update);page.addEventListener('change',update);
  form.addEventListener('submit',e=>{
    e.preventDefault();if(!form.reportValidity())return;
    const m=materials[state.material];
    const brief=[`Outer material (both faces): ${m.outer}`,'Middle core: Wood pulp + SAP',`Sheet finish: ${state.print==='print'?'Custom printed sheets':'Plain sheets'}`,`Size: ${sizeText()}`,`Packaging: ${packText()}`,`Bag artwork: ${field('sheet-bag-artwork').checked?'Custom artwork requested':'Not specified'}`,`Pieces per pack: ${field('sheet-pack-count').value||'To be discussed'}`,field('sheet-notes').value].filter(Boolean).join('\n');
    const params=new URLSearchParams({product:p.slug,format:m.name,intent:e.submitter?.value||'sample',brief,quantity:field('sheet-quantity').value,market:field('sheet-market').value});
    const a=document.createElement('a');a.href='/contact?'+params;page.append(a);a.click();a.remove();
  });
  update();
}
