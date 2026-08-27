import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Factory,
  Layers3,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { buildProductQuoteHref, productSeries } from './productCatalogData.js';

const heroVideoSource = '/videos/hero-background-2-720p.webm';
const heroVideoPoster = '/images/oem/hero/factory-campus.webp';

const productImageMosaicRows = (() => {
  const seen = new Set();
  const groups = productSeries.map((series) => {
    const images = series.products.flatMap((item) => [
      item.image ? { src: item.image, alt: item.imageAlt } : null,
      ...(item.gallery || []),
      ...(item.detailGallery || []),
    ].map((image) => image && ({
      ...image,
      name: item.name,
      seriesSlug: series.slug,
      seriesTitle: series.title,
    })));

    return images.filter((image) => {
      if (!image?.src || seen.has(image.src)) return false;
      seen.add(image.src);
      return true;
    });
  });

  const dominantIndex = groups.reduce((best, group, index) => group.length > groups[best].length ? index : best, 0);
  const dominant = groups[dominantIndex] || [];
  const supporting = groups.filter((_, index) => index !== dominantIndex);
  const supportingImages = [];
  const maxSupportingLength = Math.max(0, ...supporting.map((group) => group.length));
  for (let index = 0; index < maxSupportingLength; index += 1) {
    supporting.forEach((group) => {
      if (group[index]) supportingImages.push(group[index]);
    });
  }
  const repeatedSupportingImages = Array.from({ length: 4 }, () => supportingImages).flat();

  const dominantRows = Array.from({ length: 4 }, () => []);
  dominant.forEach((image, index) => dominantRows[index % 4].push(image));
  const supportingRows = Array.from({ length: 4 }, () => []);
  repeatedSupportingImages.forEach((image, index) => supportingRows[index % 4].push(image));

  return dominantRows.map((dominantRow, rowIndex) => {
    const supportRow = supportingRows[rowIndex];
    const mixed = [];
    let supportIndex = 0;
    dominantRow.forEach((image, index) => {
      const target = Math.floor(((index + 1) * supportRow.length) / dominantRow.length);
      while (supportIndex < target) mixed.push(supportRow[supportIndex++]);
      mixed.push(image);
    });
    mixed.push(...supportRow.slice(supportIndex));
    return mixed;
  });
})();

const heroSlides = [
  {
    kicker: 'Source Manufacturing',
    title: 'OEM/ODM Manufacturing',
    copy: 'Source production and product customization across six disposable hygiene, absorbent material, and cleaning categories.',
    image: '/images/oem/production/production-line-clean.webp',
    imageAlt: 'Disposable hygiene product manufacturing line',
    points: ['Six product categories', 'Product customization', 'Private-label packaging'],
  },
  {
    kicker: 'Pet Hygiene Products',
    title: 'Pet Hygiene Products',
    copy: 'Explore pet urine pads, urine absorbent paper sheets, and pet diapers through focused series pages and product inquiry paths.',
    image: '/images/products/pet-training-pads/pet-training-pad-home.webp',
    imageAlt: 'Pet training pad shown in a home setting with a puppy',
    points: ['Pet Urine Pads', 'Urine Absorbent Paper', 'Pet Diapers'],
  },
  {
    kicker: 'Hygiene and Cleaning Solutions',
    title: 'Hygiene and Cleaning Solutions',
    copy: 'Review adult underpads, disposable cleaning products, and garbage bags for wholesale and private-label projects.',
    image: '/images/products/disposable-cleaning-products/disposable-cleaning-gloves-upload.png',
    imageAlt: 'Disposable hygiene and cleaning product presentation',
    points: ['Adult Underpads', 'Cleaning Products', 'Garbage Bags'],
  },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  return reduced;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  return mobile;
}

export function HomeHeroCarousel({ emailHref, contactEmail, whatsappPhone, whatsappChatUrl }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeAtRef = useRef(0);
  const touchStartRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const selectSlide = (index, manual = false) => {
    setActiveIndex((index + heroSlides.length) % heroSlides.length);
    if (manual) resumeAtRef.current = Date.now() + 10000;
  };

  useEffect(() => {
    if (reducedMotion || paused || isMobile) return undefined;
    const timer = window.setInterval(() => {
      if (Date.now() >= resumeAtRef.current) setActiveIndex((index) => (index + 1) % heroSlides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, isMobile]);

  const onTouchStart = (event) => {
    setPaused(true);
    touchStartRef.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event) => {
    const end = event.changedTouches[0]?.clientX ?? null;
    const start = touchStartRef.current;
    if (start !== null && end !== null && Math.abs(start - end) > 45) {
      selectSlide(activeIndex + (start > end ? 1 : -1), true);
    }
    touchStartRef.current = null;
    setPaused(false);
  };

  return (
    <section
      className="home-product-hero"
      id="home"
      aria-roledescription="carousel"
      aria-label="Product and manufacturing overview"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <aside className="home-hero-contact" aria-label="Quick contact">
        <a className="home-hero-contact-link is-email" href={emailHref} aria-label={`Email ${contactEmail}`} title={`Email ${contactEmail}`}>
          <span className="home-hero-contact-icon"><Mail size={18} aria-hidden="true" /></span>
          <span className="home-hero-contact-copy"><small>Email Sales</small><strong>{contactEmail}</strong></span>
          <ArrowUpRight className="home-hero-contact-arrow" size={17} aria-hidden="true" />
        </a>
        <a className="home-hero-contact-link is-whatsapp" href={whatsappChatUrl} target="_blank" rel="noopener noreferrer" aria-label={`Chat on WhatsApp at ${whatsappPhone}`} title={`WhatsApp ${whatsappPhone}`}>
          <span className="home-hero-contact-icon"><MessageCircle size={18} aria-hidden="true" /></span>
          <span className="home-hero-contact-copy"><small>WhatsApp</small><strong>{whatsappPhone}</strong></span>
          <ArrowUpRight className="home-hero-contact-arrow" size={17} aria-hidden="true" />
        </a>
        <ul className="home-hero-contact-keywords" aria-label="Manufacturing capabilities">
          <li>OEM/ODM Capability</li>
          <li>Private Label</li>
          <li>Custom Manufacturing</li>
          <li>Global Supply</li>
        </ul>
      </aside>
      <video
        className="home-product-hero-video"
        src={heroVideoSource}
        poster={heroVideoPoster}
        autoPlay={!reducedMotion && !isMobile}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="home-product-hero-slides">
        {heroSlides.map((slide, index) => (
          <article className={`home-product-hero-slide${index === activeIndex ? ' is-active' : ''}`} aria-hidden={index !== activeIndex} key={slide.title}>
            <div className="container home-product-hero-layout">
              <div className="home-product-hero-copy">
                <p className="section-kicker">{slide.kicker}</p>
                {index === 0 ? <h1>{slide.title}</h1> : <h2>{slide.title}</h2>}
                <p>{slide.copy}</p>
                <ul>{slide.points.map((point) => <li key={point}>{point}</li>)}</ul>
                <div className="home-product-hero-actions">
                  <a href="/products">Explore Products <ArrowRight size={18} /></a>
                  <a href={buildProductQuoteHref({ title: 'Homepage Product Inquiry' })}>Request a Quote <ArrowUpRight size={18} /></a>
                </div>
              </div>
              <div className="home-product-hero-media">
                <img src={slide.image} alt={slide.imageAlt} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
                <div className="home-product-hero-proof"><Factory size={20} /><span>OEM / ODM manufacturing</span></div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="container home-product-hero-controls">
        <div className="home-product-hero-arrows">
          <button type="button" onClick={() => selectSlide(activeIndex - 1, true)} aria-label="Previous slide"><ArrowLeft size={19} /></button>
          <button type="button" onClick={() => selectSlide(activeIndex + 1, true)} aria-label="Next slide"><ArrowRight size={19} /></button>
        </div>
        <div className="home-product-hero-dots" role="tablist" aria-label="Choose hero slide">
          {heroSlides.map((slide, index) => (
            <button key={slide.title} type="button" role="tab" aria-selected={index === activeIndex} aria-label={`Show slide ${index + 1}`} onClick={() => selectSlide(index, true)} />
          ))}
        </div>
        <span className="home-product-hero-count">0{activeIndex + 1} / 0{heroSlides.length}</span>
      </div>
    </section>
  );
}

export function HomeProductShowcase() {

  return (
    <section className="home-product-showcase" id="product-categories">
      <div className="container">
        <div className="home-product-showcase-head">
          <div><p className="section-kicker">Product Center</p><h2>Explore Our Product Categories</h2></div>
          <a className="home-product-showcase-link" href="/products#product-series">View Product Pages <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>

        <div className="home-product-mosaic" aria-label="Product image showcase">
          {productImageMosaicRows.map((rowItems, rowIndex) => {
            return (
              <div className="home-product-mosaic-row" key={`product-mosaic-row-${rowIndex}`}>
                <div className="home-product-mosaic-track">
                  {[...rowItems, ...rowItems].map((item, index) => (
                    <span className="home-product-mosaic-item" key={`${item.seriesSlug}-${item.src}-${index}`} aria-hidden={index >= rowItems.length}>
                      <img src={item.src} alt={index >= rowItems.length ? '' : `${item.name} product image`} loading={index >= rowItems.length ? 'lazy' : 'eager'} decoding="async" />
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="home-product-category-grid" aria-label="Six product categories">
          {productSeries.map((series) => (
            <a className="home-product-category-card" href={`/products/${series.slug}`} key={series.slug}>
              <span className="home-product-category-media"><img src={series.image} alt={series.imageAlt} loading="lazy" decoding="async" /></span>
              <span className="home-product-category-copy">
                <strong>{series.title}</strong>
                <small>{series.productTypes.slice(0, 3).join(' / ')}</small>
                <em>View Series <ArrowUpRight size={15} aria-hidden="true" /></em>
              </span>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}

export function ProductMegaMenu({ label, onNavigate }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const closeOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, []);

  return (
    <div
      className={`nav-products-menu${open ? ' is-open' : ''}`}
      ref={menuRef}
      onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }}
    >
      <button type="button" className="nav-products-trigger" aria-expanded={open} aria-controls="products-mega-menu" onClick={() => setOpen((value) => !value)}>
        {label}<ChevronDown size={14} />
      </button>
      <div className="products-mega-menu" id="products-mega-menu">
        <div className="products-mega-menu-grid">
          {productSeries.map((series, index) => (
            <a href={`/products/${series.slug}`} onClick={onNavigate} key={series.slug}>
              <span>0{index + 1}</span>
              <strong>{series.title}</strong>
              <small>{series.productTypes.slice(0, 3).join(' / ')}</small>
              <em>View All <ArrowUpRight size={14} /></em>
            </a>
          ))}
        </div>
        <a className="products-mega-all" href="/products" onClick={onNavigate}>All Product Categories <Layers3 size={17} /></a>
      </div>
    </div>
  );
}
