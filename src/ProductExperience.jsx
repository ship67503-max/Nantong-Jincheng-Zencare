import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Layers3, Mail, MessageCircle } from 'lucide-react';
import { buildProductQuoteHref, productSeries } from './productCatalogData.js';

export function HomeTrustBar({ items = [] }) {
  return (
    <div className="home-trust-bar" aria-label="Trusted manufacturing highlights">
      <div className="container home-trust-bar-grid">
        {items.slice(0, 4).map(([value, label]) => (
          <span key={label}>
            <strong>{value}</strong>
            <small>{label}</small>
          </span>
        ))}
      </div>
    </div>
  );
}

export function HomeHeroCarousel({ emailHref, contactEmail, whatsappPhone, whatsappChatUrl }) {
  return (
    <section className="home-hero-split" id="home">
      <div className="container home-hero-split-grid">
        <div className="home-hero-copy">
          <p className="section-kicker">OEM/ODM DISPOSABLE HYGIENE MANUFACTURER</p>
          <h1>Private-Label Pet Pads &amp; Disposable Hygiene Products</h1>
          <p>
            We manufacture pet urine pads, absorbent paper sheets, pet diapers, adult underpads, disposable cleaning products and garbage bags for brands, retailers, importers and distributors.
          </p>
          <p className="home-hero-subcopy">
            Custom specifications, absorbency, materials, packaging and private-label solutions—from sampling to global delivery.
          </p>
          <div className="home-hero-chips" aria-label="Core product range">
            {productSeries.map((series) => (
              <span key={series.slug}>{series.shortTitle || series.title}</span>
            ))}
          </div>
          <div className="home-hero-actions">
            <a className="home-hero-primary" href="/products">Explore Products <ArrowUpRight size={18} /></a>
            <a className="home-hero-secondary" href="#contact">Request a Quote <ArrowUpRight size={18} /></a>
          </div>
          <ul className="home-hero-highlights" aria-label="Key trust points">
            <li>3-Day Sampling</li>
            <li>8 Automated Production Lines</li>
            <li>OEM/ODM &amp; Private Label</li>
          </ul>
          <div className="home-hero-contact-links">
            <a href={emailHref} aria-label={'Email ' + contactEmail}><Mail size={17} /> {contactEmail}</a>
            <a href={whatsappChatUrl} target="_blank" rel="noopener noreferrer" aria-label={'Chat on WhatsApp at ' + whatsappPhone}><MessageCircle size={17} /> WhatsApp</a>
          </div>
        </div>
        <aside className="home-hero-panel home-hero-capability-panel" aria-label="JCZCARE factory capability">
          <div className="home-hero-capability-media">
            <img src="/images/oem/hero/factory-campus.webp" alt="JCZCARE disposable hygiene product factory" loading="eager" decoding="async" />
            <span>JCZCARE SOURCE FACTORY</span>
          </div>
          <div className="home-hero-capability-copy">
            <p className="section-kicker">What We Manufacture</p>
            <h2>Disposable hygiene products for private-label programs.</h2>
            <div className="home-hero-capability-list">
              {productSeries.map((series) => (
                <a key={series.slug} href={'/products/' + series.slug}>
                  <span>{series.shortTitle || series.title}</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              ))}
            </div>
            <p className="home-hero-capability-note">Product specification, absorbency, materials, packaging, sampling, production, and export coordination.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function HomeProductShowcase() {
  return (
    <section className="home-product-showcase" id="product-categories">
      <div className="container">
        <div className="home-product-showcase-head">
          <div>
            <p className="section-kicker">Product Center</p>
            <h2>Six Product Categories, One OEM/ODM Partner</h2>
            <p>Build individual products or coordinate multiple disposable hygiene categories through one manufacturing and project communication workflow.</p>
          </div>
          <a className="home-product-showcase-link" href="/products#product-series">View Product Pages <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
        <div className="home-product-category-grid" aria-label="Six product categories">
          {productSeries.map((series) => (
            <article className="home-product-category-card" key={series.slug}>
              <a className="home-product-category-media" href={'/products/' + series.slug} aria-label={'View ' + series.title}>
                <img src={series.image} alt={series.imageAlt} loading="lazy" decoding="async" />
              </a>
              <div className="home-product-category-copy">
                <strong>{series.title}</strong>
                <small>{series.productTypes.slice(0, 3).join(' / ')}</small>
                <p>{series.intro}</p>
                <div className="home-product-category-actions">
                  <a href={'/products/' + series.slug}>View Series <ArrowUpRight size={15} aria-hidden="true" /></a>
                  <a href={buildProductQuoteHref(series)}>Request a Quote <ArrowUpRight size={15} aria-hidden="true" /></a>
                </div>
              </div>
            </article>
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
      className={'nav-products-menu' + (open ? ' is-open' : '')}
      ref={menuRef}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpen(false);
      }}
    >
      <button type="button" className="nav-products-trigger" aria-expanded={open} aria-controls="products-mega-menu" onClick={() => setOpen((value) => !value)}>
        {label}<ChevronDown size={14} />
      </button>
      <div className="products-mega-menu" id="products-mega-menu">
        <div className="products-mega-menu-grid">
          {productSeries.map((series, index) => (
            <a href={'/products/' + series.slug} onClick={onNavigate} key={series.slug}>
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
