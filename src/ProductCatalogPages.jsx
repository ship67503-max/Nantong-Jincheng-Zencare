import { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Check,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Info,
  Layers3,
  PackageCheck,
  Palette,
  Ruler,
  Settings2,
} from 'lucide-react';
import { buildProductQuoteHref, productSeries } from './productCatalogData.js';

const capabilityIcons = [Ruler, Droplets, Layers3, Palette, PackageCheck, Settings2];

export const ownBrandProducts = [
  {
    brandId: 'petbest-pad-01',
    seriesSlug: 'pet-training-pads',
    productSlug: 'standard-pet-urine-pads',
    image: '/images/brand-petbest/products/petbest-pad-01.webp',
    imageScale: 2.62,
    eyebrow: 'Daily Care',
    title: 'PetBest Daily Pad',
    summary: 'A dependable everyday pad for home training and routine floor protection.',
  },
  {
    brandId: 'petbest-pad-02',
    seriesSlug: 'pet-training-pads',
    productSlug: 'standard-pet-urine-pads',
    image: '/images/brand-petbest/products/petbest-pad-02.webp',
    imageScale: 2.85,
    eyebrow: 'Absorbent Core',
    title: 'PetBest Blue Core Pad',
    summary: 'A practical absorbent format designed for everyday pet-care routines.',
  },
  {
    brandId: 'petbest-pad-03',
    seriesSlug: 'pet-training-pads',
    productSlug: 'bamboo-charcoal-pet-training-pads',
    image: '/images/brand-petbest/products/petbest-pad-03.webp',
    imageScale: 2.76,
    eyebrow: 'Odor Control',
    title: 'PetBest Charcoal Pad',
    summary: 'A charcoal-layer format for a cleaner, fresher pet-care setup.',
  },
  {
    brandId: 'petbest-pad-04',
    seriesSlug: 'pet-training-pads',
    productSlug: 'standard-pet-urine-pads',
    image: '/images/brand-petbest/products/petbest-pad-04.webp',
    imageScale: 2.27,
    eyebrow: 'Printed Range',
    title: 'PetBest Printed Pad',
    summary: 'A printed pad format that brings a clear identity to everyday pet care.',
  },
  {
    brandId: 'petbest-pad-05',
    seriesSlug: 'pet-training-pads',
    productSlug: 'standard-pet-urine-pads',
    image: '/images/brand-petbest/products/petbest-pad-05.webp',
    imageScale: 2.6,
    eyebrow: 'Compact Pack',
    title: 'PetBest Compact Pad',
    summary: 'A compact retail-ready format for convenient storage and daily use.',
  },
  {
    brandId: 'petbest-pad-06',
    seriesSlug: 'pet-training-pads',
    productSlug: 'standard-pet-urine-pads',
    image: '/images/brand-petbest/products/petbest-pad-06.webp',
    imageScale: 2.05,
    eyebrow: 'Daily Care',
    title: 'PetBest Blue Pack Pad',
    summary: 'A familiar blue-pack format for reliable home and travel protection.',
  },
  {
    brandId: 'petbest-pad-07',
    seriesSlug: 'pet-training-pads',
    productSlug: 'standard-pet-urine-pads',
    image: '/images/brand-petbest/products/petbest-pad-07.webp',
    imageScale: 2.44,
    eyebrow: 'Soft Surface',
    title: 'PetBest Soft Surface Pad',
    summary: 'A soft-surface pad option for comfortable everyday pet routines.',
  },
  {
    brandId: 'petbest-pad-08',
    seriesSlug: 'pet-training-pads',
    productSlug: 'bamboo-charcoal-pet-training-pads',
    image: '/images/brand-petbest/products/petbest-pad-08.webp',
    imageScale: 2.32,
    eyebrow: '3D Structure',
    title: 'PetBest 3D Charcoal Pad',
    summary: 'A structured charcoal pad format for a differentiated product range.',
  },
  {
    brandId: 'petbest-pad-09',
    seriesSlug: 'pet-training-pads',
    productSlug: 'standard-pet-urine-pads',
    image: '/images/brand-petbest/products/petbest-pad-09.webp',
    imageScale: 2.2,
    eyebrow: 'Comfort Care',
    title: 'PetBest Green Comfort Pad',
    summary: 'A soft green-format pad for daily home care and retail presentation.',
  },
  {
    brandId: 'petbest-pad-10',
    seriesSlug: 'pet-training-pads',
    productSlug: 'bamboo-charcoal-pet-training-pads',
    image: '/images/brand-petbest/products/petbest-pad-10.webp',
    imageScale: 2.26,
    eyebrow: 'Thickened Core',
    title: 'PetBest Thick Charcoal Pad',
    summary: 'A thickened charcoal format for a more substantial absorbent range.',
  },
].map((entry) => {
  const series = productSeries.find((item) => item.slug === entry.seriesSlug);
  const product = series?.products.find((item) => item.slug === entry.productSlug);
  return { ...entry, series, product, imageAlt: `${entry.title} from the PetBest own brand range` };
}).filter((entry) => entry.series && entry.product);

function ProductVisual({ image, imageAlt, imageFit, imagePosition, label, status, loading = 'lazy', className = '' }) {
  if (!image || status === 'placeholder') {
    return (
      <div className={`catalog-placeholder ${className}`.trim()} role="img" aria-label={imageAlt}>
        <Box size={38} strokeWidth={1.35} aria-hidden="true" />
        <span>{label}</span>
        <small>Image pending</small>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={image}
      alt={imageAlt}
      loading={loading}
      decoding="async"
      style={imageFit || imagePosition ? { objectFit: imageFit || undefined, objectPosition: imagePosition || undefined } : undefined}
    />
  );
}

function ProductGallery({ series, item, loading }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = item.gallery[activeIndex];
  const showPrevious = () => setActiveIndex((activeIndex - 1 + item.gallery.length) % item.gallery.length);
  const showNext = () => setActiveIndex((activeIndex + 1) % item.gallery.length);

  return (
    <div className="series-product-media series-product-gallery">
      <a className="series-product-gallery-link" href={`/products/${series.slug}/${item.slug}`} aria-label={`View ${item.name}`}>
        <img
          src={activeImage.src}
          alt={activeImage.alt}
          loading={loading}
          decoding="async"
          style={{ objectPosition: activeImage.position || 'center' }}
        />
      </a>
      <button className="series-gallery-control is-previous" type="button" onClick={showPrevious} aria-label="Previous product image" title="Previous image">
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <button className="series-gallery-control is-next" type="button" onClick={showNext} aria-label="Next product image" title="Next image">
        <ChevronRight size={20} aria-hidden="true" />
      </button>
      <div className="series-gallery-dots" aria-label="Select product image">
        {item.gallery.map((image, imageIndex) => (
          <button
            className={imageIndex === activeIndex ? 'is-active' : ''}
            type="button"
            onClick={() => setActiveIndex(imageIndex)}
            aria-label={`Show product image ${imageIndex + 1}`}
            aria-pressed={imageIndex === activeIndex}
            key={image.src}
          />
        ))}
      </div>
      <span className="series-gallery-count">{activeIndex + 1} / {item.gallery.length}</span>
    </div>
  );
}

function ProductCard({ series, item, index }) {
  return (
    <article className="series-product-card">
      {item.gallery?.length ? (
        <ProductGallery series={series} item={item} loading={index < 3 ? 'eager' : 'lazy'} />
      ) : (
        <a className="series-product-media" href={`/products/${series.slug}/${item.slug}`} aria-label={`View ${item.name}`}>
          <ProductVisual {...item} label={item.name} loading={index < 3 ? 'eager' : 'lazy'} />
        </a>
      )}
      <div className="series-product-body">
        <span className="series-product-oem"><Check size={14} aria-hidden="true" /> Available for OEM/ODM</span>
        <h3>{item.name}</h3>
        <ul>
          {item.features.map((feature) => <li key={feature}>{feature}</li>)}
        </ul>
        <div className="series-product-actions">
          <a href={`/products/${series.slug}/${item.slug}`}>View Details <ArrowUpRight size={16} /></a>
          <a href={buildProductQuoteHref(series, item)}>Get a Quote <ArrowUpRight size={16} /></a>
        </div>
      </div>
    </article>
  );
}

function OwnBrandCollection() {
  return (
    <section className="own-brand-section" aria-labelledby="own-brand-title">
      <div className="products-center-heading own-brand-heading">
        <div>
          <p className="section-kicker">Our Own Brands</p>
          <h1 id="own-brand-title">Own Brand Products</h1>
        </div>
        <p>Explore JCZCARE own-brand products. Select a brand to view its products and individual details.</p>
      </div>
      <div className="catalog-update-notice" role="note">
        <Info size={21} strokeWidth={1.8} aria-hidden="true" />
        <div>
          <p className="catalog-update-notice-kicker">Catalog Update</p>
          <p>Our product content is being fully updated. If you need assistance, <a href={buildProductQuoteHref({ title: 'Own Brand Product Update Inquiry' })}>contact us directly</a> and submit the form. A product specialist will get in touch.</p>
        </div>
      </div>
      <nav className="own-brand-directory" aria-label="Own brand directory">
        <a className="own-brand-directory-item is-active" href="#petbest-products">
          <span className="own-brand-logo">
            <img src="/images/brand-petbest/petbest-logo.png" alt="PetBest logo" loading="lazy" decoding="async" />
          </span>
          <span className="own-brand-directory-copy">
            <strong>PetBest</strong>
            <span>Our own pet-care product brand</span>
          </span>
          <span className="own-brand-directory-meta"><b>{ownBrandProducts.length}</b> products</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </nav>
      <div className="own-brand-grid" id="petbest-products">
        {ownBrandProducts.map(({ brandId, series, product, image, imageAlt, imageScale, eyebrow, title, summary }) => (
          <article className="own-brand-card" key={brandId}>
            <a
              className="own-brand-card-media"
              href={`/products/${series.slug}/${product.slug}?brand=${brandId}`}
              aria-label={`View ${title}`}
              style={{ '--product-image-scale': imageScale }}
            >
              <ProductVisual image={image} imageAlt={imageAlt} label={title} loading="lazy" />
              <span className="own-brand-badge">Own Brand</span>
            </a>
            <div className="own-brand-card-body">
              <p className="own-brand-eyebrow">{eyebrow}</p>
              <h2>{title}</h2>
              <p>{summary}</p>
              <a href={`/products/${series.slug}/${product.slug}?brand=${brandId}`}>View Product <ArrowUpRight size={17} /></a>
            </div>
          </article>
        ))}
      </div>
      <div className="own-brand-footer">
        <p>Looking for PetBest products or a branded range for your market?</p>
        <a href={buildProductQuoteHref({ title: 'PetBest Own Brand Collection' })}>Discuss Brand Supply <ArrowUpRight size={17} /></a>
      </div>
    </section>
  );
}

export function OwnBrandPage() {
  return (
    <section className="own-brand-page">
      <div className="container own-brand-page-shell">
        <nav className="catalog-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a><span>/</span><span aria-current="page">Own Brands</span>
        </nav>
        <OwnBrandCollection />
      </div>
    </section>
  );
}

export function ProductCenterPage() {
  return (
    <section className="products-center-page products-redesign">
      <div className="container products-center-shell">
        <header className="products-center-hero">
          <div className="products-center-hero-copy">
            <p className="section-kicker">Six Product Categories</p>
            <h1>Disposable Hygiene and Cleaning Products Manufacturer</h1>
            <p>Explore our six product categories for wholesale, private label and OEM/ODM manufacturing.</p>
            <div className="products-center-actions">
              <a className="catalog-action-primary" href="#product-series">Explore Products <ArrowRight size={18} /></a>
              <a className="catalog-action-secondary" href={buildProductQuoteHref({ title: 'Product Center' })}>Request a Quote <ArrowUpRight size={18} /></a>
            </div>
          </div>
          <div className="products-center-hero-index">
            <ProductVisual
              image="/images/oem/products/products-disposable-pads-01.webp"
              imageAlt="Disposable hygiene product manufacturing portfolio"
              label="Disposable hygiene products"
              loading="eager"
            />
            <div className="products-center-index-copy">
              <strong>6</strong>
              <span>Focused product categories</span>
            </div>
          </div>
        </header>

        <div className="catalog-update-notice" role="note">
          <Info size={21} strokeWidth={1.8} aria-hidden="true" />
          <div>
            <p className="catalog-update-notice-kicker">Catalog Update</p>
            <p>Our product content is being fully updated. If you need assistance, <a href={buildProductQuoteHref({ title: 'Product Content Update Inquiry' })}>contact us directly</a> and submit the form. A product specialist will get in touch.</p>
          </div>
        </div>

        <section id="product-series" className="products-series-section" aria-labelledby="product-series-title">
          <div className="products-center-heading">
            <div>
              <p className="section-kicker">Product Center</p>
              <h2 id="product-series-title">Explore six focused series.</h2>
            </div>
            <p>Each series leads to a consistent product overview, customization scope, and direct inquiry path.</p>
          </div>

          <div className="products-center-grid products-six-grid">
            {productSeries.map((series, index) => (
              <article className={`products-center-card${series.featured ? ' is-featured' : ''}`} key={series.slug}>
                <a className="products-center-card-media" href={`/products/${series.slug}`} aria-label={`Explore ${series.title}`}>
                  <ProductVisual {...series} label={series.title} loading={index < 3 ? 'eager' : 'lazy'} />
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </a>
                <div className="products-center-card-body">
                  <p>{series.category}</p>
                  <h2>{series.title}</h2>
                  <p>{series.summary}</p>
                  <ul className="products-series-types">
                    {series.productTypes.map((type) => <li key={type}>{type}</li>)}
                  </ul>
                  <a href={`/products/${series.slug}`}>Explore Series <ArrowUpRight size={17} /></a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="products-oem-section" aria-labelledby="products-oem-title">
          <div className="products-center-heading">
            <div>
              <p className="section-kicker">OEM / ODM Capability</p>
              <h2 id="products-oem-title">One customization framework across the portfolio.</h2>
            </div>
            <p>Project details are reviewed against the selected product format before sampling and quotation.</p>
          </div>
          <div className="products-oem-grid">
            {['Custom Size', 'Custom Absorbency', 'Custom Materials', 'Printed Design', 'Private Label Packaging', 'Functional Customization'].map((label, index) => {
              const Icon = capabilityIcons[index];
              return <div key={label}><Icon size={22} strokeWidth={1.6} /><span>{label}</span></div>;
            })}
          </div>
          <a className="products-oem-cta" href={buildProductQuoteHref({ title: 'OEM/ODM Project' })}>Start Your OEM/ODM Project <ArrowUpRight size={18} /></a>
        </section>
      </div>
    </section>
  );
}

export function ProductSeriesPage({ series }) {
  return (
    <section className="catalog-series-page">
      <div className="container catalog-series-shell">
        <nav className="catalog-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a><span>/</span><a href="/products">Products</a><span>/</span><span aria-current="page">{series.title}</span>
        </nav>

        <header className="catalog-series-hero">
          <div className="catalog-series-hero-copy">
            <p className="section-kicker">{series.category}</p>
            <h1>{series.title}</h1>
            <p>{series.intro}</p>
            <a href={buildProductQuoteHref(series)}>Request a Quote <ArrowUpRight size={18} /></a>
          </div>
          <div className="catalog-series-hero-media">
            <ProductVisual {...series} label={series.title} loading="eager" />
          </div>
        </header>

        <section className="catalog-series-products" aria-labelledby={`${series.slug}-products-title`}>
          <div className="catalog-series-heading">
            <p className="section-kicker">Product Range</p>
            <h2 id={`${series.slug}-products-title`}>{series.title} product formats</h2>
          </div>
          <div className="series-product-grid">
            {series.products.map((item, index) => <ProductCard series={series} item={item} index={index} key={item.slug} />)}
          </div>
        </section>

        <section className="series-customization" aria-labelledby={`${series.slug}-customization-title`}>
          <div className="catalog-series-heading">
            <p className="section-kicker">Customization Direction</p>
            <h2 id={`${series.slug}-customization-title`}>Configure the series around your brief.</h2>
          </div>
          <div className="series-customization-grid">
            {series.customization.map((item, index) => {
              const Icon = capabilityIcons[index % capabilityIcons.length];
              return <div key={item}><Icon size={21} strokeWidth={1.6} /><span>{item}</span></div>;
            })}
          </div>
        </section>

        <section className="catalog-series-cta">
          <div>
            <p className="section-kicker">Project Inquiry</p>
            <h2>Share the details needed for a focused review.</h2>
            <p>Include the product, size, quantity, target market, and packaging requirements in your inquiry.</p>
          </div>
          <a href={buildProductQuoteHref(series)}>Request a Quote <ArrowUpRight size={18} /></a>
        </section>
      </div>
    </section>
  );
}

export function CatalogProductDetailPage({ product }) {
  const { series } = product;

  return (
    <section className="catalog-detail-template">
      <div className="container catalog-detail-shell">
        <nav className="catalog-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a><span>/</span><a href="/products">Products</a><span>/</span>
          <a href={`/products/${series.slug}`}>{series.title}</a><span>/</span><span aria-current="page">{product.name}</span>
        </nav>

        <header className="catalog-detail-hero">
          <div
            className={`catalog-detail-media${product.imageScale ? ' is-own-brand' : ''}`}
            style={product.imageScale ? { '--product-detail-scale': product.imageScale } : undefined}
          >
            <ProductVisual {...product} label={product.name} loading="eager" />
          </div>
          <div className="catalog-detail-copy">
            <p className="section-kicker">{series.title}</p>
            <h1>{product.name}</h1>
            <ul>{product.features.map((feature) => <li key={feature}><Check size={17} /> {feature}</li>)}</ul>
            <span className="series-product-oem"><Check size={14} /> Available for OEM/ODM</span>
            <div className="catalog-detail-actions">
              <a href={buildProductQuoteHref(series, product)}>Get a Quote <ArrowUpRight size={18} /></a>
              <a href={`/products/${series.slug}`}>View Series <ArrowRight size={18} /></a>
            </div>
          </div>
        </header>

        {product.detailGallery?.length ? (
          <section className="catalog-detail-gallery" aria-labelledby={`${product.slug}-detail-gallery-title`}>
            <div className="catalog-series-heading">
              <p className="section-kicker">Product Details</p>
              <h2 id={`${product.slug}-detail-gallery-title`}>A closer look at the product.</h2>
            </div>
            <div className="catalog-detail-gallery-grid">
              {product.detailGallery.map((image, index) => (
                <figure key={image.src}>
                  <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
                  <figcaption><span>{String(index + 1).padStart(2, '0')}</span>{image.title}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        <section className="catalog-detail-info">
          <div>
            <p className="section-kicker">Customization</p>
            <h2>Discuss the specification before sampling.</h2>
          </div>
          <div className="series-customization-grid">
            {series.customization.map((item, index) => {
              const Icon = capabilityIcons[index % capabilityIcons.length];
              return <div key={item}><Icon size={21} strokeWidth={1.6} /><span>{item}</span></div>;
            })}
          </div>
        </section>

        <section className="catalog-series-cta">
          <div>
            <p className="section-kicker">Inquiry</p>
            <h2>Turn this product into a buyer-ready brief.</h2>
            <p>Share your target market, size, quantity, packaging direction, and any product-specific requirements.</p>
          </div>
          <a href={buildProductQuoteHref(series, product)}>Request a Quote <ArrowUpRight size={18} /></a>
        </section>
      </div>
    </section>
  );
}
