import {sourceProducts,sourceProductForPath,sourceProductDetail,sourceRange,sourceFamilyPage,initSourceCatalog} from './source-products.js';
import {initWasteCatalog,initWasteDetail,wasteProductForPath,wasteProductDetail} from './waste-products.js';
import {initContactForm} from './contact.js';
import {updateMetadata} from './metadata.js';
import {privacyPage} from './privacy.js';
import './production.css';
import {initInsights} from './insights-client.js';
import {certificatesPage, certificateHome, addCertificateEvidence} from './certificates.js';
import './certificates.css';

window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
const analyticsScript=document.createElement('script');
analyticsScript.async=true;
analyticsScript.src='https://www.googletagmanager.com/gtag/js?id=G-7WBQ3V257N';
document.head.append(analyticsScript);
window.gtag('js',new Date());
window.gtag('config','G-7WBQ3V257N');
window.gtag('config',import.meta.env.VITE_GOOGLE_ADS_ID || 'AW-18346194096');

const contactClickSession = (() => {
  try {
    const key = 'jczcare_contact_click_session';
    let value = sessionStorage.getItem(key);
    if (!value) { value = crypto.randomUUID(); sessionStorage.setItem(key, value); }
    return value;
  } catch { return ''; }
})();
document.addEventListener('click', event => {
  const link = event.target.closest?.('a[href]');
  if (!link) return;
  const href = link.getAttribute('href') || '';
  const channel = /^https:\/\/wa\.me\//i.test(href) || link.classList.contains('quick-contact-whatsapp') ? 'whatsapp' : /^mailto:/i.test(href) || link.classList.contains('quick-contact-email') ? 'email' : '';
  if (!channel) return;
  const query = new URLSearchParams(location.search);
  const payload = JSON.stringify({channel,pageUrl:location.href,referrer:document.referrer,device:/Mobi|Android/i.test(navigator.userAgent)?'mobile':'desktop',language:navigator.language,utmSource:query.get('utm_source')||'',utmMedium:query.get('utm_medium')||'',utmCampaign:query.get('utm_campaign')||'',sessionId:contactClickSession});
  try { navigator.sendBeacon('/api/contact-click', new Blob([payload], {type:'application/json'})); }
  catch { fetch('/api/contact-click',{method:'POST',headers:{'Content-Type':'application/json'},body:payload,keepalive:true}).catch(()=>{}); }
});
import {customerGalleryPhotos} from './customerGalleryData.js';
import {initPetPadPage} from './pet-pad-page.js';
import {catalog,reviewPages,variantForPath} from './catalog.js';
import {paperExperience,initPaperPage} from './paper-simple.js';
import {productCards,productsPage,productPage,productVariantPage,variantPanel,factoryPage,oemPage,qualityPage,resourcesPage,cips2026Page,contactPage,notFoundPage} from './pages.js';

const homeView=document.getElementById('home-view');
const pageRoot=document.getElementById('site-page');
const certificateHomeRoot=document.getElementById('home-certificates');
certificateHomeRoot.innerHTML=certificateHome();
const initialInsightPath=pageRoot.querySelector('[data-insights]') ? location.pathname.replace(/\/$/,'') : null;
const initialInsightHtml=initialInsightPath ? pageRoot.innerHTML : '';
const initialInsightMeta=initialInsightPath ? {title:document.title,description:document.querySelector('meta[name="description"]')?.content,image:document.querySelector('meta[property="og:image"]')?.content,path:initialInsightPath} : null;
const initialInsightSchema=initialInsightPath ? JSON.parse(document.getElementById('storefront-schema').textContent) : null;
// Preserve the approved homepage; category and inquiry journeys now use local URLs.
document.getElementById('pads-view')?.remove();
document.querySelectorAll('#inquiry-dialog,#detail-dialog').forEach(el=>el.remove());
document.getElementById('category-grid').innerHTML=productCards();
document.querySelector('.header .brand').href='/';
document.querySelectorAll('[data-inquire],[data-pads],[data-quality]').forEach(button=>{
  const a=document.createElement('a');a.className=button.className;a.innerHTML=button.innerHTML;
  a.href=button.hasAttribute('data-pads')?catalog[0].path:button.hasAttribute('data-quality')?'/quality-control':'/contact';
  if(button.getAttribute('aria-label'))a.setAttribute('aria-label',button.getAttribute('aria-label'));
  button.replaceWith(a);
});
const homeProductLink=document.querySelector('.hero a[href="#products"]');
if(homeProductLink)homeProductLink.href='/products';
const homeProcessLink=document.createElement('a');homeProcessLink.className='text-link';homeProcessLink.href='/oem-process';homeProcessLink.textContent='Explore the full OEM / ODM process ↗';
document.querySelector('.process-note').after(homeProcessLink);
const factoryLink=document.createElement('a');factoryLink.className='text-link';factoryLink.href='/factory';factoryLink.textContent='Meet our factory ↗';
document.querySelector('.factory-story-description')?.after(factoryLink);

const galleryGrid=document.getElementById('customer-gallery-grid');
const galleryTrack=document.createElement('div');galleryTrack.className='customer-gallery-track';
const galleryGroup=document.createElement('div');galleryGroup.className='customer-gallery-group';
document.getElementById('customer-moments').classList.add('has-customer-photos');
customerGalleryPhotos.forEach((photo,index)=>{
  const figure=document.createElement('figure');figure.className=`customer-gallery-photo customer-gallery-photo-${photo.id}`;figure.dataset.photoLabel=photo.id==='02'?`${photo.id} / ${photo.label}`:photo.id;
  figure.style.setProperty('--photo-ratio',photo.width/photo.height);
  if(photo.src){const img=document.createElement('img');img.src=photo.src;img.alt=photo.alt;img.loading='lazy';img.decoding='async';img.width=photo.width;img.height=photo.height;img.style.objectPosition=photo.position;figure.classList.add('has-photo');figure.append(img);}
  else{const placeholder=document.createElement('div');placeholder.className='customer-gallery-placeholder';placeholder.setAttribute('role','img');placeholder.setAttribute('aria-label',`图片预留 ${photo.id}：${photo.label}`);placeholder.innerHTML='<span class="customer-gallery-frame" aria-hidden="true"><span>＋</span></span><strong></strong><span></span><small></small>';placeholder.querySelector('strong').textContent=photo.label;placeholder.children[2].textContent=`图片待补充 · PHOTO ${photo.id}`;placeholder.querySelector('small').textContent=photo.shape==='portrait'?'建议竖图 · 4:5':'建议横图 · 4:3';figure.append(placeholder);}
  const caption=document.createElement('figcaption');caption.textContent=photo.label;figure.append(caption);
  galleryGroup.append(figure);
});
galleryTrack.append(galleryGroup);galleryGrid.append(galleryTrack);
let galleryLoopSize='';
function sizeGalleryLoop(){
  const groupWidth=galleryGroup.getBoundingClientRect().width;
  const viewportWidth=galleryGrid.clientWidth;
  if(!groupWidth||!viewportWidth)return;
  const size=`${groupWidth}:${viewportWidth}`;
  if(size===galleryLoopSize)return;
  galleryLoopSize=size;
  galleryTrack.querySelectorAll('[aria-hidden="true"]').forEach(copy=>copy.remove());
  // Cover the viewport throughout the seamless loop; hover never pauses it.
  const coveredWidth=viewportWidth+Math.max(0,-galleryTrack.offsetLeft);
  for(let i=0;i<Math.ceil(coveredWidth/groupWidth);i++){
    const copy=galleryGroup.cloneNode(true);copy.setAttribute('aria-hidden','true');
    copy.querySelectorAll('img').forEach(img=>{img.alt='';img.loading='lazy';img.decoding='async';});
    galleryTrack.append(copy);
  }
  galleryTrack.style.setProperty('--gallery-distance',`${-groupWidth}px`);
  galleryTrack.style.animationDuration=`${groupWidth/11}s`;
}
const galleryResizeObserver=new ResizeObserver(sizeGalleryLoop);
galleryResizeObserver.observe(galleryGrid);galleryResizeObserver.observe(galleryGroup);
sizeGalleryLoop();
const galleryToggle=document.createElement('button');galleryToggle.type='button';galleryToggle.className='customer-gallery-toggle';
galleryToggle.setAttribute('aria-controls','customer-gallery-grid');
document.querySelector('.customer-gallery-end').append(galleryToggle);
const galleryMotion=matchMedia('(prefers-reduced-motion: reduce)');
function setGalleryPaused(paused){galleryGrid.dataset.paused=String(paused);galleryToggle.setAttribute('aria-pressed',String(paused));galleryToggle.setAttribute('aria-label',paused?'Play gallery':'Pause gallery');galleryToggle.textContent=paused?'▶':'Ⅱ';}
setGalleryPaused(galleryMotion.matches);
galleryMotion.addEventListener('change',e=>setGalleryPaused(e.matches));
galleryToggle.addEventListener('click',()=>setGalleryPaused(galleryGrid.dataset.paused!=='true'));
const marquee=document.getElementById('manufacturing-highlights');const group=marquee.querySelector('.manufacturing-marquee-group');const copy=group.cloneNode(true);copy.setAttribute('aria-hidden','true');group.parentElement.append(copy);
marquee.querySelector('.manufacturing-marquee-toggle').addEventListener('click',e=>{const paused=marquee.dataset.paused!=='true';marquee.dataset.paused=String(paused);e.currentTarget.setAttribute('aria-pressed',String(paused));e.currentTarget.setAttribute('aria-label',paused?'Resume scrolling highlights':'Pause scrolling highlights');e.currentTarget.querySelector('span').textContent=paused?'▶':'Ⅱ';});

const menuButton=document.querySelector('.menu-button');
menuButton.addEventListener('click',()=>{const opened=document.querySelector('.header nav').classList.toggle('open');menuButton.setAttribute('aria-expanded',String(opened));});
const productsNav=document.querySelector('.products-nav');
const productsTrigger=document.querySelector('.products-nav-trigger');
const productsPanel=productsNav?.querySelector('.products-mega-menu');
let productsCloseTimer;
function positionProductsMenu(){
  const bottom=document.querySelector('.header').getBoundingClientRect().bottom;
  productsPanel?.style.setProperty('--mega-top',Math.max(0,bottom-1)+'px');
}
function holdProductsMenu(){
  clearTimeout(productsCloseTimer);
  positionProductsMenu();
  productsNav?.classList.add('is-open');
  productsTrigger?.setAttribute('aria-expanded','true');
}
function scheduleProductsClose(){
  clearTimeout(productsCloseTimer);
  productsCloseTimer=setTimeout(()=>{productsNav?.classList.remove('is-open');productsTrigger?.setAttribute('aria-expanded','false');},350);
}
productsNav?.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')holdProductsMenu();});
productsNav?.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse')scheduleProductsClose();});
productsPanel?.addEventListener('pointerenter',()=>clearTimeout(productsCloseTimer));
productsNav?.addEventListener('focusin',positionProductsMenu);
window.addEventListener('resize',positionProductsMenu);
window.addEventListener('scroll',()=>{if(productsNav?.classList.contains('is-open'))positionProductsMenu();},{passive:true});
document.addEventListener('pointerdown',event=>{if(!productsNav?.contains(event.target)){clearTimeout(productsCloseTimer);productsNav?.classList.remove('is-open');productsTrigger?.setAttribute('aria-expanded','false');}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();productsTrigger?.blur();}});
productsTrigger?.addEventListener('click',e=>{
  clearTimeout(productsCloseTimer);
  positionProductsMenu();
  const open=productsNav.classList.contains('is-open');
  e.preventDefault();
  productsNav.classList.toggle('is-open',!open);
  productsTrigger.setAttribute('aria-expanded',String(!open));
});
function closeMenu(){clearTimeout(productsCloseTimer);document.querySelector('.header nav').classList.remove('open');menuButton.setAttribute('aria-expanded','false');productsNav?.classList.remove('is-open');productsTrigger?.setAttribute('aria-expanded','false');}

let cleanupContact=()=>{};
const staticPages={'/products':productsPage,'/factory':factoryPage,'/oem-process':oemPage,'/quality-control':qualityPage,'/resources':resourcesPage,'/events/cips-2026':cips2026Page,'/certifications':certificatesPage,'/contact':contactPage,'/privacy-policy':privacyPage};
let cleanupHeroCarousel=()=>{};
function initHeroCarousel(){
  const carousel=document.querySelector('[data-hero-carousel]');
  if(!carousel||homeView.hidden)return ()=>{};
  const slides=[...carousel.querySelectorAll('[data-hero-slide]')];
  const buttons=[...carousel.querySelectorAll('[data-hero-button]')];
  if(slides.length<2||buttons.length!==slides.length)return ()=>{};
  const pauseButton=carousel.querySelector('[data-hero-pause]');
  let current=0,hovered=false,focused=false,paused=false,timer,transitionTimer;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const loadSlideImages=slide=>slide.querySelectorAll('img[data-src]').forEach(img=>{
    img.src=img.dataset.src;
    img.removeAttribute('data-src');
  });
  const show=(index)=>{
    const next=(index+slides.length)%slides.length;
    const previousSlide=slides[current];
    const nextSlide=slides[next];
    loadSlideImages(nextSlide);
    window.clearTimeout(transitionTimer);
    if(next!==current){
      previousSlide.classList.remove('is-active');
      previousSlide.classList.add('is-leaving');
      nextSlide.classList.remove('is-leaving');
      nextSlide.classList.add('is-active');
      transitionTimer=window.setTimeout(()=>previousSlide.classList.remove('is-leaving'),720);
    }
    current=next;
    slides.forEach((slide,i)=>{const active=i===current;slide.setAttribute('aria-hidden',String(!active));slide.inert=!active;});
    buttons.forEach((button,i)=>{const active=i===current;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});
  };
  // Keep the hero cycling while the pointer rests over the banner; only the explicit
  // pause control, a hidden tab, or reduced-motion preference stops autoplay.
  const schedule=()=>{window.clearInterval(timer);if(!paused&&!document.hidden&&!reduced.matches)timer=window.setInterval(()=>show(current+1),5000);};
  const enter=()=>{hovered=true;schedule();};
  const leave=()=>{hovered=false;schedule();};
  const focusIn=()=>{focused=true;schedule();};
  const focusOut=e=>{focused=carousel.contains(e.relatedTarget);schedule();};
  const togglePause=()=>{paused=!paused;pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.setAttribute('aria-label',paused?'Resume banner slideshow':'Pause banner slideshow');pauseButton.textContent=paused?'▶':'Ⅱ';schedule();};
  const onButton=(event)=>{show(Number(event.currentTarget.dataset.heroButton));schedule();};
  const preventFocusScroll=event=>event.preventDefault();
  buttons.forEach(button=>{button.addEventListener('click',onButton);button.addEventListener('pointerdown',preventFocusScroll);});
  carousel.addEventListener('mouseenter',enter);carousel.addEventListener('mouseleave',leave);
  carousel.addEventListener('focusin',focusIn);carousel.addEventListener('focusout',focusOut);
  pauseButton.addEventListener('click',togglePause);document.addEventListener('visibilitychange',schedule);
  reduced.addEventListener('change',schedule);show(0);schedule();
  return ()=>{window.clearInterval(timer);window.clearTimeout(transitionTimer);buttons.forEach(button=>{button.removeEventListener('click',onButton);button.removeEventListener('pointerdown',preventFocusScroll);});carousel.removeEventListener('mouseenter',enter);carousel.removeEventListener('mouseleave',leave);carousel.removeEventListener('focusin',focusIn);carousel.removeEventListener('focusout',focusOut);pauseButton.removeEventListener('click',togglePause);document.removeEventListener('visibilitychange',schedule);reduced.removeEventListener('change',schedule);};
}
function initFactoryVideoSwitcher(){
  const section=document.querySelector('.factory-video-intro');
  if(!section)return;
  const video=section.querySelector('video');
  const title=section.querySelector('#factory-video-title');
  const intro=section.querySelector('[data-factory-video-intro]');
  const points=section.querySelector('.factory-video-points');
  const data={
    pads:{title:'Made for Your Brand',intro:'Custom pet pads. Factory-direct OEM / ODM.',points:[['20+ Years of Experience','From sampling to production.'],['12,000 m² Factory','Automated lines. Reliable supply.']],src:'/videos/factory-showcase-web.mp4',poster:'/images/oem/production/pet-pad-factory-poster.jpg'},
    bags:{title:'Waste Bags for Your Brand',intro:'Custom waste bags. Private-label supply.',points:[['Complete Production','Film, printing, sealing and packing.'],['Custom Packaging','Your format. Your branding.']],src:'/videos/waste-bag-factory-web.mp4',poster:'/images/oem/production/waste-bag-factory-poster.webp'}
  };
  const copy=section.querySelector('.factory-video-copy');
  function reserveFactoryCopyHeight(){
    const width=copy.getBoundingClientRect().width;
    if(!width)return;
    const probe=copy.cloneNode(true);
    probe.style.cssText='position:absolute;visibility:hidden;pointer-events:none;height:auto;min-height:0;width:'+width+'px;';
    probe.removeAttribute('id');
    probe.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
    copy.parentElement.append(probe);
    let height=0;
    for(const item of Object.values(data)){
      probe.querySelector('h2').textContent=item.title;
      probe.querySelector('[data-factory-video-intro]').textContent=item.intro;
      probe.querySelectorAll('.factory-video-point').forEach((point,index)=>{
        point.querySelector('h3').textContent=item.points[index][0];
        point.querySelector('p').textContent=item.points[index][1];
      });
      height=Math.max(height,probe.getBoundingClientRect().height);
    }
    probe.remove();
    copy.style.minHeight=Math.ceil(height)+'px';
  }
  reserveFactoryCopyHeight();
  document.fonts.ready.then(reserveFactoryCopyHeight);
  let factoryCopyWidth=0;
  new ResizeObserver(entries=>{
    const width=entries[0].contentRect.width;
    if(width!==factoryCopyWidth){factoryCopyWidth=width;reserveFactoryCopyHeight();}
  }).observe(copy);
  section.querySelectorAll('[data-factory-video-tab]').forEach(button=>button.addEventListener('click',()=>{
    const d=data[button.dataset.factoryVideoTab]; video.pause(); video.src=d.src; video.poster=d.poster; video.load(); title.textContent=d.title; intro.textContent=d.intro;
    points.innerHTML=d.points.map(item=>`<article class="factory-video-point"><i aria-hidden="true">${item[0][0]}</i><div><h3>${item[0]}</h3><p>${item[1]}</p></div></article>`).join('');
    section.querySelectorAll('[data-factory-video-tab]').forEach(x=>x.setAttribute('aria-selected',String(x===button)));
  }));
}
function renderRoute({focus=false}={}){
  cleanupHeroCarousel();

  cleanupContact();
  let path=location.pathname.replace(/\/$/,'')||'/';
  if(path==='/factory/certificates'){history.replaceState({},'',`/certifications${location.search}${location.hash}`);path='/certifications';}
  if((path==='/'||path==='/index.html')&&location.hash==='#contact'){history.replaceState({},'',`/contact${location.search}`);path='/contact';}
  if(path==='/request-product-plan'){const params=new URLSearchParams(location.search);history.replaceState({},'',`/contact${params.size?'?'+params:''}`);path='/contact';}
  if(path==='/'&&location.hash==='#pet-pads'){history.replaceState({},'',catalog[0].path);path=catalog[0].path;}
  const isHome=path==='/'||path==='/index.html';const p=catalog.find(p=>p.path===path);const variant=variantForPath(path);const current=reviewPages.find(p=>p.path===path);
  homeView.hidden=!isHome;pageRoot.hidden=isHome;
  if(!isHome){pageRoot.innerHTML=path===initialInsightPath ? initialInsightHtml : sourceProductForPath(path)?sourceProductDetail(sourceProductForPath(path)):wasteProductForPath(path)?wasteProductDetail(wasteProductForPath(path)):variant?productVariantPage(variant):p?(productPage(p)):(staticPages[path]?.()||notFoundPage());}
  else pageRoot.replaceChildren();
  if(!isHome)pageRoot.innerHTML=addCertificateEvidence(pageRoot.innerHTML,path);
  updateMetadata(path,path===initialInsightPath ? initialInsightMeta : null,path===initialInsightPath ? initialInsightSchema : null);
  if(path===initialInsightPath)initInsights(pageRoot);
  document.querySelectorAll('.header nav a').forEach(a=>{const active=path===a.pathname||(a.pathname==='/products'&&path.startsWith('/products/'));if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  closeMenu();
  if(p?.slug==='pet-training-pads')initPetPadPage(pageRoot,p);
  else if(p?.slug==='pet-absorbent-paper-sheets')initPaperPage(pageRoot,p);
  else if(p)pageRoot.querySelectorAll('[data-variant]').forEach(b=>b.addEventListener('click',()=>{pageRoot.querySelectorAll('[data-variant]').forEach(other=>other.setAttribute('aria-pressed',String(other===b)));pageRoot.querySelector('#variant-panel').innerHTML=variantPanel(p,Number(b.dataset.variant));}));
  if(p?.slug==='garbage-bags'||variant?.parent.slug==='garbage-bags')initWasteCatalog(pageRoot);
  initSourceCatalog(pageRoot);
  initWasteDetail(pageRoot);
  cleanupContact=initContactForm();

  cleanupHeroCarousel=initHeroCarousel();
  initFactoryVideoSwitcher();
  if(isHome)initScrollReveal();
  requestAnimationFrame(()=>{if(location.hash){const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target&&!target.closest('[hidden]'))target.scrollIntoView({behavior:'instant'});}else window.scrollTo({top:0,behavior:'instant'});if(focus){const h=(isHome?homeView:pageRoot).querySelector('h1');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}}});
}
function initScrollReveal(){
  const targets=document.querySelectorAll('#products.section,.factory-video-intro,.process-section,#faq.faq-layout');
  if(!targets.length||!('IntersectionObserver' in window)){targets.forEach(x=>x.classList.add('is-visible'));return;}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.18});
  targets.forEach(target=>{
    observer.observe(target);
    const box=target.getBoundingClientRect();
    if(box.top<window.innerHeight*.9&&box.bottom>0)target.classList.add('is-visible');
  });
  window.setTimeout(()=>targets.forEach(target=>target.classList.add('is-visible')),1800);
}
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href]');if(!a||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||a.target==='_blank'||a.hasAttribute('download'))return;
  if(a.classList.contains('products-nav-trigger'))return;
  const url=new URL(a.href,location.href);if(url.origin!==location.origin)return;
  if((url.pathname==='/'||url.pathname==='/index.html')&&url.hash==='#contact'){url.pathname='/contact';url.hash='';}
  const supported=Boolean(sourceProductForPath(url.pathname))||Boolean(wasteProductForPath(url.pathname))||url.pathname==='/'||catalog.some(p=>p.path===url.pathname)||Boolean(variantForPath(url.pathname))||Boolean(staticPages[url.pathname]);
  if(!supported)return;
  e.preventDefault();closeMenu();
  if(url.pathname===location.pathname&&url.search===location.search&&url.hash){history.pushState({},'',url.pathname+url.search+url.hash);document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView({behavior:'smooth'});return;}
  history.pushState({},'',url.pathname+url.search+url.hash);renderRoute({focus:true});
});
window.addEventListener('popstate',()=>renderRoute());
renderRoute();
const categoryCount=document.getElementById('product-category-count');if(categoryCount)categoryCount.textContent=catalog.length+' categories.';
