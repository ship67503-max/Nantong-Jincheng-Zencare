import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight,
  ArrowUp,
  CirclePlay,
  Droplets,
  Factory,
  FlaskConical,
  Layers3,
  Mail,
  MessageCircle,
  Microscope,
  Phone,
  Ruler,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import './styles.css';

const heroVideo = '/videos/hero-background-2-720p.webm';
const heroFallbackImage = '/images/factory-campus.jpeg';
const whatsappChatUrl =
  'https://wa.me/8615162883729?text=Hello%20Nantong%20JINCHENG%20ZENCARE%2C%20I%20would%20like%20to%20discuss%20a%20custom%20pet%20pad%20OEM%2FODM%20project.';
const Silk = React.lazy(() => import('./Silk'));

class SilkBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      return <div className="inquiry-silk-fallback" />;
    }

    return this.props.children;
  }
}

const factoryImages = [
  {
    title: 'Clean Production Workshop',
    tag: 'Production',
    src: '/images/production-line-clean.png',
  },
  {
    title: 'Automated Lamination Line',
    tag: 'Lamination',
    src: '/images/lamination-detail-clean.png',
  },
  {
    title: 'Custom Packing & Delivery',
    tag: 'Packaging',
    src: '/images/warehouse-storage-clean.png',
  },
];

const innovations = [
  {
    icon: Layers3,
    title: 'Structure Development',
    text: 'Layer design tuned for speed, lock-in, and cost control.',
  },
  {
    icon: Droplets,
    title: 'Performance Customization',
    text: 'Absorbency, rewet, pressure resistance, and size tuned by scenario.',
  },
  {
    icon: Ruler,
    title: 'Brand-Ready Launch',
    text: 'Specs, colors, scents, and packaging prepared for channel sales.',
  },
];

const inspections = [
  ['01', 'Materials', 'Topsheet, pulp, SAP, and film checked by batch.'],
  ['02', 'Process', 'Weight, size, sealing, embossing, and packing monitored on line.'],
  ['03', 'Performance', 'Absorption, diffusion, rewet, pressure, and leakage tested.'],
  ['04', 'Shipment', 'Cartons, labels, marks, and appearance reviewed before dispatch.'],
];

const advantages = [
  {
    icon: Factory,
    title: 'Source Factory',
    text: 'Direct control from core structure to finished packing.',
  },
  {
    icon: FlaskConical,
    title: 'Fast Sampling',
    text: 'Quick OEM/ODM samples across size, absorbency, and pack format.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality System',
    text: 'Batch checks for absorption, rewet, sealing, and consistency.',
  },
  {
    icon: Truck,
    title: 'Reliable Supply',
    text: 'Stable scheduling and export support for long-term orders.',
  },
];

const customProducts = [
  {
    slug: 'disposable-pet-pads',
    title: 'Disposable Pet Pads',
    category: 'Core Product',
    image: '/images/custom-disposable-pet-pads-premium.png',
    specs: ['Multiple sizes', 'Absorbency levels', 'Embossing optional'],
    badge: 'OEM / ODM',
    summary: 'OEM pet pads built around absorption, leak protection, and stable output.',
    details: ['Softness, embossing, size, and absorbency can be tuned.', 'Private-label packing and outer bag artwork supported.', 'Built for brands, retailers, and cross-border channels.'],
  },
  {
    slug: 'pet-care-pad-glove-wipes',
    title: 'Pet Care Pad & Glove Wipes',
    category: 'Care Series',
    image: '/images/custom-care-pad-packaging-ai.png',
    specs: ['Private label', 'Retail pack', 'Soft surface'],
    badge: 'Private Label',
    summary: 'Disposable care products for daily pet cleaning and private-label retail.',
    details: ['Pouch structure, pack count, and material feel can be customized.', 'Designed for retail shelves, online bundles, and care sets.', 'Sampling matched to target market and price band.'],
  },
  {
    slug: 'pet-absorbent-paper-sheets',
    title: 'Pet Absorbent Paper Sheets',
    category: 'Source Factory',
    image: '/images/custom-absorbent-paper-ai.png',
    specs: ['SAP blend', 'Layer material', 'Bulk customization'],
    badge: 'Factory Direct',
    summary: 'Absorbent paper sheets configured for core materials and bulk supply.',
    details: ['SAP ratio, paper feel, thickness, and packing can be customized.', 'Available as layer material or standalone absorbent sheets.', 'Factory-direct support for formula and delivery control.'],
  },
  {
    slug: 'custom-pet-waste-bags',
    title: 'Custom Pet Waste Bags',
    category: 'Extended Range',
    image: '/images/custom-pet-waste-bags-ai.png',
    specs: ['Custom colors', 'Roll formats', 'OEM packaging'],
    badge: 'Color Options',
    summary: 'Custom pet waste bags with flexible colors, rolls, and retail packs.',
    details: ['Roll format, thickness, color, and packaging can be specified.', 'Pairs well with pet pad private-label programs.', 'Made for retail, distribution, and subscription channels.'],
  },
  {
    slug: 'charcoal-pet-pads',
    title: 'Charcoal Pet Pads',
    category: 'Odor Control',
    image: '/images/custom-charcoal-pet-pad-ai.png',
    specs: ['Activated carbon', 'Odor reduction', 'Fast sampling'],
    badge: 'Formula Support',
    summary: 'Odor-control pet pads for premium and upgraded product lines.',
    details: ['Carbon layer, absorbency, size, and surface pattern can be configured.', 'Built for odor-sensitive and premium pet care channels.', 'Samples available for absorption, rewet, and odor review.'],
  },
  {
    slug: 'adhesive-pet-pads',
    title: 'Adhesive Pet Pads',
    category: 'Anti-Slip Design',
    image: '/images/custom-adhesive-pet-pad-ai.png',
    specs: ['Secure backing', 'Easy removal', 'Quality assured'],
    badge: 'Custom Backing',
    summary: 'Anti-slip pet pads designed for cleaner placement and easy removal.',
    details: ['Adhesive position, size, specification, and packing can be customized.', 'Designed to reduce shifting while removing cleanly.', 'Ideal for upgraded training pad and scenario-based lines.'],
  },
];

const regionLinks = [
  { label: 'United States', href: '/region/united-states', slug: 'united-states', lang: 'en' },
  { label: 'Canada', href: '/region/canada', slug: 'canada', lang: 'en' },
  { label: 'United Kingdom', href: '/region/united-kingdom', slug: 'united-kingdom', lang: 'en' },
  { label: 'Germany', href: '/region/germany', slug: 'germany', lang: 'de' },
  { label: 'France', href: '/region/france', slug: 'france', lang: 'fr' },
  { label: 'Italy', href: '/region/italy', slug: 'italy', lang: 'it' },
  { label: 'Spain', href: '/region/spain', slug: 'spain', lang: 'es' },
  { label: 'Netherlands', href: '/region/netherlands', slug: 'netherlands', lang: 'nl' },
  { label: 'Poland', href: '/region/poland', slug: 'poland', lang: 'pl' },
  { label: 'Sweden', href: '/region/sweden', slug: 'sweden', lang: 'sv' },
  { label: 'Denmark', href: '/region/denmark', slug: 'denmark', lang: 'da' },
  { label: 'Norway', href: '/region/norway', slug: 'norway', lang: 'no' },
  { label: 'Finland', href: '/region/finland', slug: 'finland', lang: 'fi' },
  { label: 'Belgium', href: '/region/belgium', slug: 'belgium', lang: 'nl' },
  { label: 'Switzerland', href: '/region/switzerland', slug: 'switzerland', lang: 'de' },
  { label: 'Austria', href: '/region/austria', slug: 'austria', lang: 'de' },
  { label: 'Ireland', href: '/region/ireland', slug: 'ireland', lang: 'en' },
  { label: 'Portugal', href: '/region/portugal', slug: 'portugal', lang: 'pt' },
];

const uiTranslations = {
  en: {
    nav: ['Profile', 'Projects', 'Innovation', 'Quality', 'Advantages', 'Customization'],
    contact: 'Contact Us',
    regionSearch: 'Search Europe / America',
    noRegion: 'No region found',
    support: 'Our experts are available 24/7:',
    chat: 'Chat Now',
    top: 'Back to Top',
    footer: ['About', 'Investor Relations', 'Affiliates', 'Jobs', 'Help', 'Learn', 'Give Back', 'Gift Cards'],
  },
  de: {
    nav: ['Profil', 'Projekte', 'Innovation', 'Qualitat', 'Vorteile', 'Anpassung'],
    contact: 'Kontakt',
    regionSearch: 'Europa / Amerika suchen',
    noRegion: 'Keine Region gefunden',
    support: 'Unsere Experten sind 24/7 verfugbar:',
    chat: 'Jetzt chatten',
    top: 'Nach oben',
    footer: ['Uber uns', 'Investor Relations', 'Partner', 'Jobs', 'Hilfe', 'Wissen', 'Engagement', 'Musterkits'],
  },
  fr: {
    nav: ['Profil', 'Projets', 'Innovation', 'Qualite', 'Avantages', 'Personnalisation'],
    contact: 'Contact',
    regionSearch: 'Rechercher Europe / Amerique',
    noRegion: 'Aucune region trouvee',
    support: 'Nos experts sont disponibles 24/7 :',
    chat: 'Chat en ligne',
    top: 'Haut de page',
    footer: ['A propos', 'Investisseurs', 'Affilies', 'Emplois', 'Aide', 'Guide', 'Engagement', 'Kits cadeaux'],
  },
  it: {
    nav: ['Profilo', 'Progetti', 'Innovazione', 'Qualita', 'Vantaggi', 'Personalizzazione'],
    contact: 'Contatti',
    regionSearch: 'Cerca Europa / America',
    noRegion: 'Nessuna regione trovata',
    support: 'I nostri esperti sono disponibili 24/7:',
    chat: 'Chatta ora',
    top: 'Torna su',
    footer: ['Chi siamo', 'Investitori', 'Affiliati', 'Lavoro', 'Aiuto', 'Guide', 'Responsabilita', 'Kit regalo'],
  },
  es: {
    nav: ['Perfil', 'Proyectos', 'Innovacion', 'Calidad', 'Ventajas', 'Personalizacion'],
    contact: 'Contacto',
    regionSearch: 'Buscar Europa / America',
    noRegion: 'No se encontro region',
    support: 'Nuestros expertos estan disponibles 24/7:',
    chat: 'Chatear ahora',
    top: 'Volver arriba',
    footer: ['Sobre nosotros', 'Inversores', 'Afiliados', 'Empleos', 'Ayuda', 'Aprender', 'Contribuir', 'Kits regalo'],
  },
  nl: {
    nav: ['Profiel', 'Projecten', 'Innovatie', 'Kwaliteit', 'Voordelen', 'Maatwerk'],
    contact: 'Contact',
    regionSearch: 'Zoek Europa / Amerika',
    noRegion: 'Geen regio gevonden',
    support: 'Onze experts zijn 24/7 beschikbaar:',
    chat: 'Chat nu',
    top: 'Naar boven',
    footer: ['Over ons', 'Investeerders', 'Partners', 'Jobs', 'Help', 'Leren', 'Teruggeven', 'Sample kits'],
  },
  pl: {
    nav: ['Profil', 'Projekty', 'Innowacje', 'Jakosc', 'Zalety', 'Personalizacja'],
    contact: 'Kontakt',
    regionSearch: 'Szukaj Europa / Ameryka',
    noRegion: 'Nie znaleziono regionu',
    support: 'Nasi eksperci sa dostepni 24/7:',
    chat: 'Czat teraz',
    top: 'Do gory',
    footer: ['O nas', 'Inwestorzy', 'Partnerzy', 'Praca', 'Pomoc', 'Wiedza', 'Wsparcie', 'Zestawy probek'],
  },
  sv: {
    nav: ['Profil', 'Projekt', 'Innovation', 'Kvalitet', 'Fordelar', 'Anpassning'],
    contact: 'Kontakt',
    regionSearch: 'Sok Europa / Amerika',
    noRegion: 'Ingen region hittades',
    support: 'Vara experter finns tillgangliga 24/7:',
    chat: 'Chatta nu',
    top: 'Till toppen',
    footer: ['Om oss', 'Investerare', 'Partners', 'Jobb', 'Hjalp', 'Lar dig', 'Ge tillbaka', 'Provkit'],
  },
  da: {
    nav: ['Profil', 'Projekter', 'Innovation', 'Kvalitet', 'Fordele', 'Tilpasning'],
    contact: 'Kontakt',
    regionSearch: 'Sog Europa / Amerika',
    noRegion: 'Ingen region fundet',
    support: 'Vores eksperter er tilgaengelige 24/7:',
    chat: 'Chat nu',
    top: 'Til toppen',
    footer: ['Om os', 'Investorer', 'Partnere', 'Jobs', 'Hjaelp', 'Laer', 'Giv tilbage', 'Provekit'],
  },
  no: {
    nav: ['Profil', 'Prosjekter', 'Innovasjon', 'Kvalitet', 'Fordeler', 'Tilpasning'],
    contact: 'Kontakt',
    regionSearch: 'Sok Europa / Amerika',
    noRegion: 'Ingen region funnet',
    support: 'Vare eksperter er tilgjengelige 24/7:',
    chat: 'Chat na',
    top: 'Til toppen',
    footer: ['Om oss', 'Investorer', 'Partnere', 'Jobber', 'Hjelp', 'Laer', 'Gi tilbake', 'Provekit'],
  },
  fi: {
    nav: ['Profiili', 'Projektit', 'Innovaatio', 'Laatu', 'Edut', 'Raatalointi'],
    contact: 'Yhteys',
    regionSearch: 'Hae Eurooppa / Amerikka',
    noRegion: 'Aluetta ei loytynyt',
    support: 'Asiantuntijamme ovat tavoitettavissa 24/7:',
    chat: 'Chat nyt',
    top: 'Ylos',
    footer: ['Tietoa meista', 'Sijoittajat', 'Kumppanit', 'Tyopaikat', 'Tuki', 'Opi', 'Vastuullisuus', 'Naytekitit'],
  },
  pt: {
    nav: ['Perfil', 'Projetos', 'Inovacao', 'Qualidade', 'Vantagens', 'Personalizacao'],
    contact: 'Contato',
    regionSearch: 'Pesquisar Europa / America',
    noRegion: 'Nenhuma regiao encontrada',
    support: 'Nossos especialistas estao disponiveis 24/7:',
    chat: 'Conversar agora',
    top: 'Voltar ao topo',
    footer: ['Sobre nos', 'Investidores', 'Afiliados', 'Empregos', 'Ajuda', 'Aprender', 'Retribuir', 'Kits amostra'],
  },
};

const getInitialRegion = () => {
  if (typeof window === 'undefined') {
    return regionLinks[0];
  }

  const params = new URLSearchParams(window.location.search);
  const requestedRegion = params.get('region');
  const pathRegion = window.location.pathname.match(/^\/region\/([^/]+)\/?$/)?.[1];
  const storedRegion = window.localStorage.getItem('selectedRegion');
  const selectedSlug = requestedRegion || pathRegion || storedRegion;

  return regionLinks.find((region) => region.slug === selectedSlug) ?? regionLinks[0];
};

const getUiText = (region) => uiTranslations[region.lang] ?? uiTranslations.en;

const footerLinks = [
  { label: 'About', href: '/pages/about' },
  { label: 'Investor Relations', href: '/pages/investor-relations' },
  { label: 'Affiliates', href: '/pages/affiliates' },
  { label: 'Jobs', href: '/pages/jobs' },
  { label: 'Help', href: '/pages/help' },
  { label: 'Learn', href: '/pages/learn' },
  { label: 'Give Back', href: '/pages/give-back' },
  { label: 'Gift Cards', href: '/pages/gift-cards' },
];

const socialLinks = [
  { label: 'Facebook', mark: 'f', href: 'https://www.facebook.com/' },
  { label: 'YouTube', mark: '▶', href: 'https://youtube.com/@nantongjinchengzencaretechnolo?si=jTie2dZK0mYx4M7c' },
  { label: 'Instagram', mark: 'ig', href: 'https://www.instagram.com/' },
  { label: 'TikTok', mark: '♪', href: 'https://www.tiktok.com/' },
];

function SiteNav({ navRef, activeRegion, onRegionChange, ui }) {
  return (
    <nav ref={navRef} className="nav">
      <a className="brand" href="/#home" aria-label="Nantong JINCHENG ZENCARE homepage">
        <span>
          <strong>Nantong JINCHENG ZENCARE</strong>
          <small>Technology Company</small>
        </span>
      </a>
      <RegionSelector activeRegion={activeRegion} onRegionChange={onRegionChange} ui={ui} />
      <div className="nav-links" aria-label="Main navigation">
        <a href="/#about">{ui.nav[0]}</a>
        <a href="/#projects">{ui.nav[1]}</a>
        <a href="/#innovation">{ui.nav[2]}</a>
        <a href="/#quality">{ui.nav[3]}</a>
        <a href="/#advantages">{ui.nav[4]}</a>
        <a href="/#customization">{ui.nav[5]}</a>
      </div>
      <a className="nav-cta" href="/#contact">
        {ui.contact}
        <ArrowUpRight size={18} strokeWidth={1.8} />
      </a>
    </nav>
  );
}

function RegionSelector({ activeRegion, onRegionChange, ui }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const filteredRegions = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) {
      return regionLinks;
    }

    return regionLinks.filter((region) => region.label.toLowerCase().includes(keyword));
  }, [query]);

  return (
    <div className="region-selector">
      <button
        type="button"
        className="region-trigger"
        aria-expanded={isOpen}
        aria-controls="region-menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="region-flag" aria-hidden="true" />
        <span>{activeRegion.label}</span>
        <span className="region-caret" aria-hidden="true">v</span>
      </button>
      {isOpen && (
        <div className="region-menu" id="region-menu">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={ui.regionSearch}
            aria-label="Search region"
            autoFocus
          />
          <div className="region-options">
            {filteredRegions.map((region) => (
              <button
                type="button"
                key={region.href}
                className={region.href === activeRegion.href ? 'active' : undefined}
                onClick={() => {
                  onRegionChange(region);
                  setIsOpen(false);
                  setQuery('');
                }}
              >
                {region.label}
              </button>
            ))}
            {filteredRegions.length === 0 && <span className="region-empty">{ui.noRegion}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductDetail({ product }) {
  return (
    <section className="product-detail-page">
      <div className="container product-detail-shell">
        <a className="detail-back" href="/#customization">
          Back to Customization
          <ArrowUpRight size={16} />
        </a>
        <div className="detail-hero">
          <div className="detail-copy">
            <p className="section-kicker">{product.category}</p>
            <h1>{product.title}</h1>
            <p>{product.summary}</p>
            <div className="detail-specs">
              {product.specs.map((spec) => (
                <span key={spec}>{spec}</span>
              ))}
            </div>
            <a className="detail-cta" href={`/request-product-plan?product=${product.slug}`}>
              Request This Product Plan
              <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="detail-visual">
            <img src={product.image} alt={product.title} />
            <span>{product.badge}</span>
          </div>
        </div>
        <div className="detail-info-grid">
          {product.details.map((detail, index) => (
            <article key={detail}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductPlanInquiry() {
  return (
    <section className="inquiry-page">
      <div className="inquiry-silk" aria-hidden="true">
        <SilkBoundary>
          <React.Suspense fallback={<div className="inquiry-silk-fallback" />}>
            <Silk
              speed={3.2}
              scale={1.18}
              color="#14251b"
              noiseIntensity={1.15}
              rotation={-0.34}
            />
          </React.Suspense>
        </SilkBoundary>
      </div>
      <div className="container inquiry-shell">
        <div className="inquiry-copy">
          <p className="section-kicker">Product Plan Request</p>
          <h1>
            Start a
            <br />
            focused
            <br />
            <em className="title-key">OEM/ODM inquiry</em>
          </h1>
          <p>
            Share the key project details. Our team will prepare a clear product plan for your market.
          </p>
        </div>
        <form className="contact-form inquiry-form" aria-label="Product plan inquiry form">
          <label>
            <span>Name</span>
            <input type="text" name="name" />
          </label>
          <label>
            <span>Email / WhatsApp</span>
            <input type="text" name="contact" />
          </label>
          <label>
            <span>Country</span>
            <input type="text" name="country" />
          </label>
          <label>
            <span>Product Requirement</span>
            <textarea name="message" rows="5" />
          </label>
          <button type="button">
            Submit Request
            <ArrowUpRight size={18} />
          </button>
        </form>
      </div>
    </section>
  );
}

function AboutPage() {
  const aboutHighlights = [
    ['Company', 'Nantong JINCHENG ZENCARE Technology Company is a pet care absorbent product source factory serving OEM, ODM, and private-label programs.'],
    ['Services', 'Pet pads, pet diapers, care bed pads, glove wipes, structure design, packaging development, sampling, and export support.'],
    ['Team', 'R&D, production, quality inspection, merchandising, packaging, and delivery teams work as one project flow.'],
    ['Results', '20 years in the industry, 12,000 sq.m factory area, 8 automated lines, and 120M pcs stable annual capacity.'],
  ];

  return (
    <section className="about-page">
      <div className="container about-page-shell">
        <div className="about-page-hero">
          <p className="section-kicker">About JINCHENG ZENCARE</p>
          <h1>
            Built for stable
            <br />
            <em className="title-key">pet pad OEM/ODM supply</em>.
          </h1>
          <p>
            We help brands, cross-border sellers, and channel partners build absorbent pet care product lines with reliable manufacturing and practical customization.
          </p>
        </div>

        <div className="about-page-grid">
          {aboutHighlights.map(([label, text], index) => (
            <article key={label}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h2>{label}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <div className="about-address-card">
          <div>
            <p className="section-kicker">Address</p>
            <h2>Nantong, Jiangsu, China</h2>
          </div>
          <p>
            Factory visits, sample discussions, product development meetings, and OEM/ODM project communication can be arranged by appointment.
          </p>
          <a href={whatsappChatUrl} target="_blank" rel="noreferrer">
            Contact for Factory Visit
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

function InvestorRelationsPage() {
  const investorStats = [
    ['20 Years', 'Industry Experience'],
    ['12,000 sq.m', 'Factory Area'],
    ['8 Lines', 'Automated Production'],
    ['120M pcs', 'Stable Capacity'],
  ];
  const investorUpdates = [
    ['Capacity Upgrade', 'Automated pet pad production supports stable long-term OEM/ODM supply.'],
    ['Quality System', 'Batch inspection covers materials, process, performance, and shipment review.'],
    ['Custom Program', 'Private-label projects can include structure, absorbency, packaging, and market-ready specifications.'],
  ];

  return (
    <section className="investor-page">
      <div className="investor-hero">
        <img src="/images/contact-pets-grass-centered.png" alt="Pet care market and brand partnership" />
        <div className="investor-hero-overlay" />
        <div className="container investor-hero-content">
          <p className="section-kicker">Investor Relations</p>
          <h1>
            Corporate strength
            <br />
            behind <em className="title-key">pet care supply</em>.
          </h1>
          <p>
            A source factory focused on pet absorbent products, OEM/ODM customization, and reliable delivery for global business partners.
          </p>
        </div>
      </div>

      <div className="container investor-shell">
        <div className="investor-overview">
          <div>
            <p className="section-kicker">Corporate Overview</p>
            <h2>Nantong JINCHENG ZENCARE Technology Company</h2>
          </div>
          <p>
            We specialize in R&D, manufacturing, and sales of pet pads, pet diapers, care bed pads, glove wipes, and related absorbent care products. Our operating model combines stable production capacity, practical product development, and flexible private-label support.
          </p>
          <p>
            For B2B customers, we provide product structure planning, sample development, batch production, quality inspection, packaging coordination, and export delivery support.
          </p>
        </div>

        <div className="investor-stats">
          {investorStats.map(([value, label]) => (
            <article key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>

        <div className="investor-news">
          <div className="investor-news-head">
            <div>
              <p className="section-kicker">Latest Updates</p>
              <h2>Business Milestones</h2>
            </div>
            <a href="/#contact">
              Contact Us
              <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="investor-news-list">
            {investorUpdates.map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AffiliatesPage() {
  const reasons = [
    'Introduce reliable pet care products to your market with source-factory support.',
    'Access OEM/ODM customization across absorbency, size, packing, and private label.',
    'Work with stable capacity, sample support, and export-ready coordination.',
    'Build long-term channel value with practical product development and quality control.',
  ];
  const faqs = [
    ['Who can join?', 'Distributors, sourcing agents, channel partners, retailers, and pet care project operators.'],
    ['What products are available?', 'Pet pads, pet diapers, care bed pads, glove wipes, pet waste bags, and customized absorbent products.'],
    ['Can we request private-label support?', 'Yes. We support packaging, specifications, structure, label direction, and sample planning.'],
    ['How do we start?', 'Send your market, product target, expected volume, and packaging needs. Our team will prepare a cooperation plan.'],
  ];

  return (
    <section className="affiliates-page">
      <div className="container affiliates-shell">
        <div className="affiliates-intro">
          <p className="section-kicker">Affiliate Program</p>
          <h1>
            Partner with a
            <br />
            <em className="title-key">pet pad source factory</em>.
          </h1>
          <p>
            For distributors, sourcing partners, and channel teams looking for stable OEM/ODM supply.
          </p>
        </div>

        <div className="affiliates-feature">
          <div className="affiliates-image">
            <img src="/images/custom-products-preview.png" alt="Custom pet care product program" />
          </div>
          <div className="affiliates-reasons">
            <p className="section-kicker">Why Partner With Us</p>
            <h2>Designed for channel growth.</h2>
            <ul>
              {reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="partner-paths">
          <div>
            <p className="section-kicker">Choose Your Path</p>
            <h2>Start with the role that fits your market.</h2>
          </div>
          <a href="/request-product-plan?product=affiliate-distributor">
            Apply as Distributor
            <ArrowUpRight size={18} />
          </a>
          <a href="/request-product-plan?product=affiliate-sourcing-partner">
            Apply as Sourcing Partner
            <ArrowUpRight size={18} />
          </a>
        </div>

        <div className="affiliate-faq">
          <p className="section-kicker">Program FAQs</p>
          <h2>Clear cooperation, from sample to shipment.</h2>
          <div className="affiliate-faq-list">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HelpCenterPage() {
  const helpTopics = [
    ['Custom Order Process', 'From project brief and sample confirmation to batch production and shipment.'],
    ['Sampling & Lead Time', 'Understand sample preparation, testing, approval, and production scheduling.'],
    ['Packaging Support', 'Private-label packing, export cartons, labels, marks, and channel-ready formats.'],
    ['Quality & Inspection', 'Materials, process, absorbency, leakage, sealing, and shipment checks.'],
  ];
  const supportCategories = [
    'OEM / ODM inquiry',
    'Product specification',
    'Sample request',
    'Packaging and labels',
    'Shipping and delivery',
    'After-sales support',
  ];
  const helpFaqs = [
    ['How do I start a custom pet pad order?', 'Share your target market, size, absorbency, packaging direction, and expected quantity. We will prepare a product plan.'],
    ['Can you help develop private-label packaging?', 'Yes. We support bag format, carton marks, label direction, pack count, and retail-ready presentation.'],
    ['Do you provide samples before production?', 'Yes. Samples can be prepared for specification review, absorbency testing, packaging confirmation, and market evaluation.'],
    ['How can I contact your team quickly?', 'Use WhatsApp, email, or the product request form. Our team will follow up with a clear OEM/ODM response.'],
  ];

  return (
    <section className="help-page">
      <div className="container help-shell">
        <div className="help-hero">
          <p className="section-kicker">Help Center</p>
          <h1>
            How can we
            <br />
            <em className="title-key">support your order</em>?
          </h1>
          <div className="help-search">
            <input type="search" placeholder="Search OEM, sampling, packaging, quality..." aria-label="Search help topics" />
            <a href={whatsappChatUrl} target="_blank" rel="noreferrer">
              Chat Now
              <MessageCircle size={18} />
            </a>
          </div>
          <div className="help-quick-contact">
            <a href={whatsappChatUrl} target="_blank" rel="noreferrer"><Phone size={18} /> +86 15162883729</a>
            <a href="mailto:hengtuo@nthegntuo.com"><Mail size={18} /> hengtuo@nthegntuo.com</a>
          </div>
        </div>

        <div className="help-content">
          <aside className="help-sidebar">
            {supportCategories.map((category) => (
              <a key={category} href={`/pages/help#${category.toLowerCase().replaceAll(' ', '-').replaceAll('/', '')}`}>
                {category}
              </a>
            ))}
          </aside>

          <div className="help-main">
            <div className="help-topic-grid">
              {helpTopics.map(([title, text]) => (
                <article key={title}>
                  <h2>{title}</h2>
                  <p>{text}</p>
                  <a href="/request-product-plan?product=help-center">
                    Know more...
                    <ArrowUpRight size={16} />
                  </a>
                </article>
              ))}
            </div>

            <div className="help-faq">
              <p className="section-kicker">Popular Topics</p>
              <h2>Answers before you send the brief.</h2>
              <div className="affiliate-faq-list">
                {helpFaqs.map(([question, answer]) => (
                  <details key={question}>
                    <summary>{question}</summary>
                    <p>{answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LearnCenterPage() {
  const learnCategories = ['Pet Pads', 'Absorbent Core', 'OEM / ODM', 'Quality', 'Packaging', 'Export'];
  const featuredArticles = [
    {
      title: 'How to choose absorbency for pet pad OEM projects',
      image: '/images/pet-pad-layer-protection-premium.png',
      tag: 'Absorbency Guide',
    },
    {
      title: 'What brands should confirm before private-label packaging',
      image: '/images/custom-care-pad-packaging-ai.png',
      tag: 'Packaging',
    },
    {
      title: 'Inside batch inspection for stable pet pad delivery',
      image: '/images/quality-inspection-lab-mask.png',
      tag: 'Quality',
    },
  ];
  const learnSections = [
    {
      title: 'Product Structure',
      image: '/images/pet-pad-layer-protection.png',
      articles: ['Layer design for fast lock-in', 'SAP core and pulp balance', 'Leakproof film selection'],
    },
    {
      title: 'Custom Development',
      image: '/images/custom-disposable-pet-pads-premium.png',
      articles: ['Size, weight, and embossing options', 'Channel-ready product planning', 'Sample review checklist'],
    },
    {
      title: 'Factory & Supply',
      image: '/images/production-line-clean.png',
      articles: ['Automated production stability', 'Packing and shipment workflow', 'How OEM orders move through factory'],
    },
    {
      title: 'Market Applications',
      image: '/images/custom-adhesive-pet-pad-ai.png',
      articles: ['Training pad product lines', 'Care bed pad scenarios', 'Premium and charcoal pad upgrades'],
    },
  ];

  return (
    <section className="learn-page">
      <div className="container learn-shell">
        <div className="learn-hero">
          <p className="section-kicker">Learn Center</p>
          <h1>
            Practical insight for
            <br />
            <em className="title-key">pet pad product decisions</em>.
          </h1>
          <div className="learn-category-row">
            {learnCategories.map((category) => (
              <a key={category} href={`/pages/learn#${category.toLowerCase().replaceAll(' ', '-').replaceAll('/', '')}`}>
                {category}
              </a>
            ))}
          </div>
        </div>

        <div className="learn-feature">
          <img src="/images/contact-pets-grass-centered.png" alt="Pet care product learning center" />
          <div>
            <span>OEM Knowledge</span>
            <h2>Build better private-label pet care products with factory-side guidance.</h2>
            <a href="/request-product-plan?product=learn-center">
              Ask for product advice
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>

        <div className="learn-featured-grid">
          {featuredArticles.map((article) => (
            <article key={article.title}>
              <img src={article.image} alt={article.title} />
              <span>{article.tag}</span>
              <h2>{article.title}</h2>
            </article>
          ))}
        </div>

        <div className="learn-section-list">
          {learnSections.map((section) => (
            <article key={section.title}>
              <img src={section.image} alt={section.title} />
              <div>
                <p className="section-kicker">{section.title}</p>
                <h2>{section.title}</h2>
                <ul>
                  {section.articles.map((article) => (
                    <li key={article}>
                      <a href="/pages/learn">{article}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GiveBackPage() {
  const impactStats = [
    ['Responsible Supply', 'Partner with brands on practical, long-life product programs.'],
    ['Waste Awareness', 'Support specification planning that reduces over-design and excess packing.'],
    ['Pet Care Access', 'Help channel partners build accessible absorbent care products for everyday use.'],
    ['Quality First', 'Stable quality reduces returns, defects, and unnecessary product loss.'],
  ];
  const partnerStories = [
    ['Brand Partners', 'Developing fit-for-market pet pad lines with balanced performance and cost.'],
    ['Channel Teams', 'Supporting distributors with stable delivery, packaging coordination, and sample planning.'],
    ['Pet Care Projects', 'Creating absorbent products for home care, training, travel, and care-bed scenarios.'],
  ];

  return (
    <section className="giveback-page">
      <div className="giveback-hero">
        <img src="/images/contact-pets-grass-centered.png" alt="People and pets in a lively outdoor scene" />
        <div className="giveback-hero-overlay" />
        <div className="container giveback-hero-content">
          <p className="section-kicker">Give Back</p>
          <h1>
            Better pet care,
            <br />
            <em className="title-key">built with responsibility</em>.
          </h1>
          <p>
            We believe source manufacturing should support stable quality, practical use, and long-term value for pets, brands, and channel partners.
          </p>
          <a href="/#contact">
            Start a responsible project
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>

      <div className="container giveback-shell">
        <div className="giveback-intro">
          <p className="section-kicker">Our Commitment</p>
          <h2>Small details create better care at scale.</h2>
          <p>
            From product structure to packaging and delivery, we help customers make decisions that balance absorbency, comfort, cost, and responsible supply.
          </p>
        </div>

        <div className="giveback-actions">
          <article>
            <h3>Product Donation Support</h3>
            <p>Reserved sample and surplus programs can support local pet care initiatives when project conditions allow.</p>
            <a href={whatsappChatUrl} target="_blank" rel="noreferrer">Discuss support <ArrowUpRight size={16} /></a>
          </article>
          <article>
            <h3>Responsible Packaging</h3>
            <p>We help brands choose pack formats, carton marks, and specifications that are practical for channel delivery.</p>
            <a href="/request-product-plan?product=responsible-packaging">Plan packaging <ArrowUpRight size={16} /></a>
          </article>
        </div>

        <div className="giveback-impact">
          <div>
            <p className="section-kicker">How We Give Back</p>
            <h2>Responsibility through everyday manufacturing choices.</h2>
          </div>
          <div className="giveback-impact-grid">
            {impactStats.map(([title, text]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="giveback-stories">
          <p className="section-kicker">Partners & Projects</p>
          <h2>Working with customers who care about stable, useful products.</h2>
          <div>
            {partnerStories.map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GiftCardsPage() {
  const kitOptions = [
    ['Starter Kit', 'Pads, absorbent sheets, and packaging swatches for first-round evaluation.'],
    ['Brand Review Set', 'Private-label mockups with material cards, structure notes, and pack directions.'],
    ['Channel Sample Box', 'Retail-ready sample kits prepared for distributors, buyers, and category teams.'],
  ];
  const programSteps = [
    ['01', 'Select Product Line', 'Choose pet pads, absorbent cores, wipes, bags, or care-bed programs.'],
    ['02', 'Match Brand Format', 'Align size, artwork, language, claims, and sample presentation.'],
    ['03', 'Send to Buyers', 'Prepare compact sample kits for review, quotation, and market testing.'],
  ];

  return (
    <section className="gift-page">
      <div className="container gift-hero">
        <div className="gift-copy">
          <p className="section-kicker">Gift Cards & Sample Kits</p>
          <h1>
            Premium sample kits
            <br />
            for <em className="title-key">OEM decisions</em>.
          </h1>
          <p>
            Turn product samples into a clear buyer presentation with structure cards, pack options, and private-label directions.
          </p>
          <div className="gift-actions">
            <a href="/request-product-plan?product=sample-kit">
              Request sample kit
              <ArrowUpRight size={18} />
            </a>
            <a href={whatsappChatUrl} target="_blank" rel="noreferrer">
              Discuss by WhatsApp
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        <div className="gift-card-preview">
          <div className="gift-card-visual">
            <img src="/images/custom-disposable-pet-pads-premium.png" alt="Premium pet pad sample kit" />
            <span>OEM / ODM</span>
          </div>
          <div className="gift-card-panel">
            <p>Sample Card</p>
            <h2>JINCHENG ZENCARE</h2>
            <small>Material / Absorbency / Packaging</small>
          </div>
        </div>
      </div>

      <div className="container gift-content">
        <div className="gift-options">
          {kitOptions.map(([title, text]) => (
            <article key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
              <a href="/request-product-plan?product=sample-kit">
                Configure
                <ArrowUpRight size={16} />
              </a>
            </article>
          ))}
        </div>

        <div className="gift-showcase">
          <div>
            <p className="section-kicker">Buyer-Ready Presentation</p>
            <h2>Make samples feel like a finished product plan.</h2>
          </div>
          <div className="gift-showcase-grid">
            {customProducts.slice(0, 4).map((product) => (
              <a key={product.slug} href={`/products/${product.slug}`}>
                <img src={product.image} alt={product.title} />
                <span>{product.category}</span>
                <strong>{product.title}</strong>
              </a>
            ))}
          </div>
        </div>

        <div className="gift-process">
          {programSteps.map(([number, title, text]) => (
            <article key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function App() {
  const rootRef = useRef(null);
  const navRef = useRef(null);
  const heroVideoRef = useRef(null);
  const [heroVideoFailed, setHeroVideoFailed] = useState(false);
  const currentPath = window.location.pathname;
  const [activeRegion, setActiveRegion] = useState(getInitialRegion);
  const ui = useMemo(() => getUiText(activeRegion), [activeRegion]);
  const productSlug = currentPath.match(/^\/products\/([^/]+)\/?$/)?.[1];
  const isInquiryPage = currentPath === '/request-product-plan';
  const isAboutPage = currentPath === '/pages/about';
  const isInvestorPage = currentPath === '/pages/investor-relations';
  const isAffiliatesPage = currentPath === '/pages/affiliates';
  const isHelpPage = currentPath === '/pages/help';
  const isLearnPage = currentPath === '/pages/learn';
  const isGiveBackPage = currentPath === '/pages/give-back';
  const isGiftCardsPage = currentPath === '/pages/gift-cards';
  const currentProduct = productSlug
    ? customProducts.find((product) => product.slug === productSlug)
    : null;

  const handleRegionChange = (region) => {
    setActiveRegion(region);
    window.localStorage.setItem('selectedRegion', region.slug);

    const nextUrl = new URL(window.location.href);

    if (nextUrl.pathname.startsWith('/region/')) {
      nextUrl.pathname = region.href;
      nextUrl.searchParams.delete('region');
    } else {
      nextUrl.searchParams.set('region', region.slug);
    }

    window.history.replaceState(null, '', nextUrl);
  };

  useEffect(() => {
    document.documentElement.lang = activeRegion.lang;
    document.documentElement.dataset.region = activeRegion.slug;
  }, [activeRegion]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    const nav = navRef.current;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!root || !nav || prefersReducedMotion) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const easeOut = 'power4.out';
      const cinematicEase = 'expo.out';
      const navLinks = nav.querySelector('.nav-links');
      const navCta = nav.querySelector('.nav-cta');

      const getNavLayout = () => {
        const viewportWidth = window.innerWidth;
        const isCompactViewport = viewportWidth <= 1400;
        const startMaxWidth = viewportWidth - (isCompactViewport ? 64 : 96);
        const startPadding = isCompactViewport ? 40 : 46;
        const startGap = isCompactViewport ? 11 : 16;
        const contentWidth = Array.from(nav.children).reduce(
          (total, child) => total + Math.ceil(Math.max(child.scrollWidth, child.getBoundingClientRect().width)),
          0,
        );
        const endMaxWidth = viewportWidth - (isCompactViewport ? 40 : 76);
        const endPadding = isCompactViewport ? 34 : 50;
        const endGap = isCompactViewport ? 16 : 28;
        const startWidth = Math.min(
          Math.ceil(contentWidth + startPadding + startGap * 2),
          startMaxWidth,
        );
        const startLeft = Math.max(isCompactViewport ? 32 : 48, (viewportWidth - startWidth) / 2);
        const endWidth = Math.min(
          isCompactViewport ? 1160 : 1480,
          endMaxWidth,
          Math.ceil(contentWidth + endPadding + endGap * 2),
        );
        const endLeft = (viewportWidth - endWidth) / 2;

        return {
          startLeft,
          startWidth,
          endLeft,
          endWidth,
        };
      };

      if (currentProduct || isInquiryPage || isAboutPage || isInvestorPage || isAffiliatesPage || isHelpPage || isLearnPage || isGiveBackPage || isGiftCardsPage) {
        gsap.set(nav, {
          x: 0,
          y: 0,
          autoAlpha: 1,
          left: () => getNavLayout().endLeft,
          top: 16,
          width: () => getNavLayout().endWidth,
          height: 66,
          gap: () => (window.innerWidth <= 1400 ? 16 : 28),
          padding: () => (window.innerWidth <= 1400 ? '0 12px 0 18px' : '0 16px 0 22px'),
          backgroundColor: 'rgba(19, 34, 27, 0.78)',
          borderColor: 'rgba(230, 246, 206, 0.22)',
          boxShadow: '0 24px 86px rgba(0, 0, 0, 0.42)',
        });
        gsap.set(navLinks, { backgroundColor: 'rgba(255, 255, 255, 0.09)' });
        gsap.set(navCta, { backgroundColor: '#d7ee84', color: '#0f1d16' });
        const entryTargets = currentProduct
          ? '.product-detail-page .detail-copy > *, .product-detail-page .detail-visual, .product-detail-page .detail-info-grid article'
          : isInquiryPage
            ? '.inquiry-page .inquiry-copy > *, .inquiry-page .inquiry-form'
            : isAboutPage
              ? '.about-page .about-page-hero > *, .about-page .about-page-grid article, .about-page .about-address-card'
              : isInvestorPage
                ? '.investor-page .investor-hero-content > *, .investor-page .investor-overview > *, .investor-page .investor-stats article, .investor-page .investor-news article'
                : isAffiliatesPage
                  ? '.affiliates-page .affiliates-intro > *, .affiliates-page .affiliates-feature > *, .affiliates-page .partner-paths > *, .affiliates-page .affiliate-faq > *'
                  : isHelpPage
                    ? '.help-page .help-hero > *, .help-page .help-sidebar > *, .help-page .help-topic-grid article, .help-page .help-faq > *'
                    : isLearnPage
                      ? '.learn-page .learn-hero > *, .learn-page .learn-feature, .learn-page .learn-featured-grid article, .learn-page .learn-section-list article'
                      : isGiveBackPage
                        ? '.giveback-page .giveback-hero-content > *, .giveback-page .giveback-intro > *, .giveback-page .giveback-actions article, .giveback-page .giveback-impact > *, .giveback-page .giveback-stories > *'
                        : '.gift-page .gift-copy > *, .gift-page .gift-card-preview, .gift-page .gift-options article, .gift-page .gift-showcase > *, .gift-page .gift-process article';

        gsap.fromTo(
          entryTargets,
          {
            y: 56,
            autoAlpha: 0,
            clipPath: 'inset(14% 0 0 0)',
          },
          {
            y: 0,
            autoAlpha: 1,
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.05,
            stagger: 0.08,
            ease: 'power3.out',
          },
        );

        return;
      }

      gsap.set(nav, {
        x: 0,
        y: -34,
        autoAlpha: 0,
        left: () => getNavLayout().startLeft,
        top: 18,
        width: () => getNavLayout().startWidth,
        height: 54,
        gap: 16,
        padding: '0 12px 0 18px',
        backgroundColor: 'rgba(18, 29, 23, 0.34)',
        borderColor: 'rgba(255, 255, 255, 0.14)',
        boxShadow: '0 16px 58px rgba(0, 0, 0, 0.22)',
      });
      gsap.set(navLinks, { backgroundColor: 'rgba(255, 255, 255, 0.06)' });
      gsap.set(navCta, { backgroundColor: '#d7ee84', color: '#15201a' });

      gsap.to(nav, {
        left: () => getNavLayout().endLeft,
        top: 16,
        width: () => getNavLayout().endWidth,
        height: 66,
        gap: () => (window.innerWidth <= 1400 ? 16 : 28),
        padding: () => (window.innerWidth <= 1400 ? '0 12px 0 18px' : '0 16px 0 22px'),
        backgroundColor: 'rgba(19, 34, 27, 0.78)',
        borderColor: 'rgba(230, 246, 206, 0.22)',
        boxShadow: '0 24px 86px rgba(0, 0, 0, 0.42)',
        ease: 'none',
        scrollTrigger: {
          trigger: '#home',
          start: 'top top',
          end: () => `+=${Math.max(420, window.innerHeight * 0.58)}`,
          scrub: 1.25,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(navLinks, {
        backgroundColor: 'rgba(255, 255, 255, 0.09)',
        ease: 'none',
        scrollTrigger: {
          trigger: '#home',
          start: 'top top',
          end: () => `+=${Math.max(420, window.innerHeight * 0.58)}`,
          scrub: 1.25,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(navCta, {
        backgroundColor: '#d7ee84',
        color: '#0f1d16',
        ease: 'none',
        scrollTrigger: {
          trigger: '#home',
          start: 'top top',
          end: () => `+=${Math.max(420, window.innerHeight * 0.58)}`,
          scrub: 1.25,
          invalidateOnRefresh: true,
        },
      });

      gsap.set('.hero-video', { scale: 1.12, filter: 'blur(8px)' });
      gsap.set('.hero-overlay', { autoAlpha: 0.94 });
      gsap.set('.hero-title-block .eyebrow', {
        yPercent: 120,
        clipPath: 'inset(0 0 100% 0)',
      });
      gsap.set('.hero h1 span', {
        yPercent: 118,
        scaleY: 0.68,
        transformOrigin: '50% 100%',
        clipPath: 'inset(0 0 100% 0)',
      });
      gsap.set('.hero-title-line', {
        scaleX: 0,
        autoAlpha: 0,
        transformOrigin: '50% 50%',
      });
      gsap.set('.hero-side > *', { y: 34, autoAlpha: 0 });
      gsap
        .timeline({ defaults: { ease: easeOut } })
        .to('.hero-video', {
          scale: 1,
          filter: 'blur(0px)',
          duration: 2.2,
          ease: cinematicEase,
        })
        .to('.hero-overlay', { autoAlpha: 1, duration: 1.4 }, 0)
        .to(nav, { y: 0, autoAlpha: 1, duration: 1.05 }, 0.18)
        .to(
          '.hero-title-block .eyebrow',
          {
            yPercent: 0,
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.0,
          },
          0.48,
        )
        .to(
          '.hero h1 span',
          {
            yPercent: 0,
            scaleY: 1,
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.45,
            stagger: 0.16,
            ease: 'expo.out',
          },
          0.62,
        )
        .to(
          '.hero-title-line',
          {
            scaleX: 1,
            autoAlpha: 1,
            duration: 0.95,
            ease: 'power3.out',
          },
          1.0,
        )
        .to(
          '.hero-side > *',
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.18,
            stagger: 0.16,
          },
          1.04,
        );

      const sectionConfigs = [
        {
          section: '#about',
          title: '#about .section-kicker',
          image: '#about .about-video, #about .about-media',
          imageInner: '#about .about-video video, #about .about-media img',
          items: '#about .about-copy h2, #about .about-copy p:not(.section-kicker), #about .contact-strip, #about .profile-metrics-bar',
        },
        {
          section: '#projects',
          title: '#projects .section-kicker',
          image: '#projects .project-card',
          imageInner: '#projects .project-card img',
          items: '#projects .project-card',
        },
        {
          section: '#innovation',
          title: '#innovation .section-kicker',
          items: '#innovation .innovation-copy h2, #innovation .innovation-copy p:not(.section-kicker), #innovation .innovation-card',
        },
        {
          section: '#quality',
          title: '#quality .section-kicker',
          image: '#quality .quality-visual',
          imageInner: '#quality .quality-visual img',
          items: '#quality .quality-content h2, #quality .quality-content > p, #quality .inspection-item',
        },
        {
          section: '#advantages',
          title: '#advantages .section-kicker',
          items: '#advantages .section-head h2, #advantages .advantage-card',
        },
        {
          section: '#customization',
          title: '#customization .section-kicker',
          image: '#customization .custom-product-card',
          imageInner: '#customization .custom-product-card img',
          items: '#customization .section-head h2, #customization .customization-toolbar, #customization .custom-product-card',
        },
        {
          section: '#contact',
          title: '#contact .section-kicker',
          items: '#contact h2 span, #contact .contact-panel > *',
        },
      ];

      sectionConfigs.forEach(({ section, title, image, imageInner, items }) => {
        gsap.fromTo(
          title,
          {
            x: -180,
            scaleX: 1.55,
            transformOrigin: '0% 50%',
            clipPath: 'inset(0 100% 0 0)',
            autoAlpha: 0,
          },
          {
            x: 0,
            scaleX: 1,
            clipPath: 'inset(0 0% 0 0)',
            autoAlpha: 1,
            duration: 1.35,
            ease: cinematicEase,
            scrollTrigger: {
              trigger: section,
              start: 'top 74%',
              once: true,
            },
          },
        );

        gsap.fromTo(
          items,
          {
            y: 72,
            scale: 0.97,
            autoAlpha: 0,
            clipPath: 'inset(18% 0 0 0)',
          },
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.12,
            stagger: 0.09,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 66%',
              once: true,
            },
          },
        );

        if (image) {
          gsap.fromTo(
            image,
            {
              clipPath: 'inset(0 0 100% 0)',
              y: 54,
            },
            {
              clipPath: 'inset(0 0 0% 0)',
              y: 0,
              duration: 1.45,
              ease: cinematicEase,
              scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                once: true,
              },
            },
          );
        }

        if (imageInner) {
          gsap.fromTo(
            imageInner,
            { yPercent: -5, scale: 1.08 },
            {
              yPercent: 5,
              scale: 1.03,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
              },
            },
          );
        }
      });
    }, root);

    return () => ctx.revert();
  }, [currentProduct, isInquiryPage, isAboutPage, isInvestorPage, isAffiliatesPage, isHelpPage, isLearnPage, isGiveBackPage, isGiftCardsPage]);

  useEffect(() => {
    const video = heroVideoRef.current;

    if (!video || heroVideoFailed) {
      return undefined;
    }

    const keepHeroVideoLooping = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    video.loop = true;
    video.muted = true;
    video.addEventListener('ended', keepHeroVideoLooping);

    return () => {
      video.removeEventListener('ended', keepHeroVideoLooping);
    };
  }, [heroVideoFailed]);

  useEffect(() => {
    if (currentProduct || isInquiryPage || isAboutPage || isInvestorPage || isAffiliatesPage || isHelpPage || isLearnPage || isGiveBackPage || isGiftCardsPage) {
      return undefined;
    }

    const scrollToHashSection = () => {
      const targetId = window.location.hash.slice(1);

      if (!targetId) {
        return;
      }

      const target = document.getElementById(targetId);

      if (target) {
        requestAnimationFrame(() => {
          target.scrollIntoView({ block: 'start' });
        });
      }
    };

    const timer = window.setTimeout(scrollToHashSection, 80);
    window.addEventListener('hashchange', scrollToHashSection);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('hashchange', scrollToHashSection);
    };
  }, [currentProduct, isInquiryPage, isAboutPage, isInvestorPage, isAffiliatesPage, isHelpPage, isLearnPage, isGiveBackPage, isGiftCardsPage]);

  if (isInquiryPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} activeRegion={activeRegion} onRegionChange={handleRegionChange} ui={ui} />
        <ProductPlanInquiry />
      </main>
    );
  }

  if (isAboutPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} activeRegion={activeRegion} onRegionChange={handleRegionChange} ui={ui} />
        <AboutPage />
      </main>
    );
  }

  if (isInvestorPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} activeRegion={activeRegion} onRegionChange={handleRegionChange} ui={ui} />
        <InvestorRelationsPage />
      </main>
    );
  }

  if (isAffiliatesPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} activeRegion={activeRegion} onRegionChange={handleRegionChange} ui={ui} />
        <AffiliatesPage />
      </main>
    );
  }

  if (isHelpPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} activeRegion={activeRegion} onRegionChange={handleRegionChange} ui={ui} />
        <HelpCenterPage />
      </main>
    );
  }

  if (isLearnPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} activeRegion={activeRegion} onRegionChange={handleRegionChange} ui={ui} />
        <LearnCenterPage />
      </main>
    );
  }

  if (isGiveBackPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} activeRegion={activeRegion} onRegionChange={handleRegionChange} ui={ui} />
        <GiveBackPage />
      </main>
    );
  }

  if (isGiftCardsPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} activeRegion={activeRegion} onRegionChange={handleRegionChange} ui={ui} />
        <GiftCardsPage />
      </main>
    );
  }

  if (currentProduct) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} activeRegion={activeRegion} onRegionChange={handleRegionChange} ui={ui} />
        <ProductDetail product={currentProduct} />
      </main>
    );
  }

  return (
    <main ref={rootRef}>
      <SiteNav navRef={navRef} activeRegion={activeRegion} onRegionChange={handleRegionChange} ui={ui} />

      <section className="hero" id="home">
        {heroVideoFailed ? (
          <img className="hero-video" src={heroFallbackImage} alt="" aria-hidden="true" />
        ) : (
          <video
            ref={heroVideoRef}
            className="hero-video"
            src={heroVideo}
            poster={heroFallbackImage}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setHeroVideoFailed(true)}
          />
        )}
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-main">
            <div className="hero-title-block">
              <p className="eyebrow">PET PADS OEM / ODM MANUFACTURER</p>
              <h1 className="hero-title">
                <span className="hero-title-focus">Pet Pad OEM/ODM</span>
                <span className="hero-title-source">Source Factory.</span>
              </h1>
              <span className="hero-title-line" aria-hidden="true" />
            </div>
            <div className="hero-side">
              <p className="hero-copy">
                <span>Custom absorbent pet care products for global brands, retailers, and channel partners.</span>
              </p>
              <div className="hero-actions">
                <a className="hero-action primary" href="#about">
                  Watch Factory Video
                  <CirclePlay size={18} />
                </a>
                <a className="hero-action secondary" href={whatsappChatUrl} target="_blank" rel="noreferrer">
                  <Phone size={18} />
                  <span>
                    <strong>Call Us Now</strong>
                    <small>+86 15162883729</small>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section about" id="about">
        <div className="container about-shell">
          <div className="about-video" aria-label="Factory video">
            <video
              src="/videos/factory-profile-4-compressed.mp4"
              poster="/images/factory-campus.jpeg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
          <div className="about-grid">
            <div className="about-media">
              <img
                src="/images/factory-campus.jpeg"
                alt="Nantong JINCHENG ZENCARE factory exterior"
              />
            </div>
            <div className="about-copy">
              <p className="section-kicker">Factory Profile</p>
              <h2>
                Nantong JINCHENG ZENCARE,
                <br />
                an <em className="title-key">OEM/ODM source factory</em>.
              </h2>
              <p>
                20 years focused on pet pads, pet diapers, and care bed pads.
              </p>
              <p>
                12,000 sq.m factory, 8 automated lines, 120M pcs annual capacity.
              </p>
              <div className="contact-strip">
                <a href={whatsappChatUrl} target="_blank" rel="noreferrer"><Phone size={18} /> +86 15162883729</a>
                <span><Mail size={18} /> hengtuo@nthegntuo.com</span>
              </div>
            </div>
          </div>
          <div className="profile-metrics-bar" aria-label="Factory core strengths">
            <div>
              <strong>20 Years</strong>
              <span>Industry Experience</span>
            </div>
            <div>
              <strong>12,000 sq.m</strong>
              <span>Factory Area</span>
            </div>
            <div>
              <strong>8 Lines</strong>
              <span>Automated Production</span>
            </div>
            <a href="#contact">
              Get Custom Plan
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="section projects" id="projects">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-kicker">Selected Projects</p>
              <h2>
                Real production scenes for <em className="title-key">scalable OEM delivery</em>.
              </h2>
            </div>
          </div>
          <div className="project-grid">
            {factoryImages.map((item, index) => (
              <article className={`project-card project-${index + 1}`} key={item.title}>
                <img src={item.src} alt={item.title} />
                <div className="project-content">
                  <span>{item.tag}</span>
                  <h3>{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section innovation" id="innovation">
        <div className="container innovation-grid">
          <div className="innovation-copy">
            <p className="section-kicker">Product Innovation</p>
            <h2>
              <em className="title-key">R&D-led upgrades</em> for market-ready products.
            </h2>
            <p>
              From materials to packaging, we build scalable product systems.
            </p>
          </div>
          <div className="innovation-cards">
            {innovations.map(({ icon: Icon, title, text }) => (
              <article className="innovation-card" key={title}>
                <div className="icon-box">
                  <Icon size={26} strokeWidth={1.7} />
                </div>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section quality" id="quality">
        <div className="container quality-layout">
          <div className="quality-visual">
            <img
              src="/images/quality-inspection-lab-mask.png"
              alt="Pet pad quality inspection and laboratory testing"
            />
            <div className="quality-badge">
              <Microscope size={20} />
              <span>Batch Inspection</span>
            </div>
          </div>
          <div className="quality-content">
            <p className="section-kicker">Quality Inspection</p>
            <h2>
              Batch-level <em className="title-key">quality control</em>.
            </h2>
            <p>
              Materials, process, performance, and shipment are checked before delivery.
            </p>
            <div className="inspection-list">
              {inspections.map(([step, title, text]) => (
                <article className="inspection-item" key={title}>
                  <strong>{step}</strong>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section advantages" id="advantages">
        <div className="container">
          <div className="section-head compact">
            <div>
              <p className="section-kicker">Why JINCHENG ZENCARE</p>
              <h2>
                Source factory strength for <em className="title-key">stable OEM/ODM supply</em>.
              </h2>
            </div>
          </div>
          <div className="advantage-grid">
            {advantages.map(({ icon: Icon, title, text }) => (
              <article className="advantage-card" key={title}>
                <div className="icon-box">
                  <Icon size={26} strokeWidth={1.7} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section customization" id="customization">
        <div className="container">
          <div className="section-head customization-head">
            <div>
              <p className="section-kicker">Product Customization</p>
              <h2>
                Build your <em className="title-key">private-label line</em>.
              </h2>
            </div>
            <a className="section-action" href="#contact">
              Request Product Plan
              <ArrowUpRight size={18} />
            </a>
          </div>

          <div className="customization-toolbar" aria-label="Product customization categories">
            <div>
              <strong>All categories</strong>
              <span>Core products, structures, formulas, and retail-ready packs.</span>
            </div>
            <div className="customization-tabs">
              <span>Pet Pads</span>
              <span>Absorbent Core</span>
              <span>Odor Control</span>
              <span>Packaging</span>
              <span>Private Label</span>
            </div>
          </div>

          <div className="custom-product-grid">
            {customProducts.map((product) => (
              <article className="custom-product-card" key={product.title}>
                <div className="custom-product-media">
                  <img src={product.image} alt={product.title} />
                  <span>{product.badge}</span>
                </div>
                <div className="custom-product-body">
                  <p>{product.category}</p>
                  <h3>{product.title}</h3>
                  <div className="custom-specs">
                    {product.specs.map((spec) => (
                      <span key={spec}>{spec}</span>
                    ))}
                  </div>
                  <a href={`/products/${product.slug}`}>
                    Know more...
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-page" id="contact">
        <div className="container contact-inner">
          <div className="contact-copy">
            <p className="section-kicker">Start Your Custom Order</p>
            <h2>
              <span>Start your</span>
              <span><em className="title-key">custom pet pad program</em>.</span>
            </h2>
            <p>
              Send your target market, specs, packaging, and order plan. We will prepare the OEM/ODM solution.
            </p>
            <div className="contact-panel">
              <a href={whatsappChatUrl} target="_blank" rel="noreferrer">
                <Phone size={20} />
                <span>+86 15162883729</span>
              </a>
              <a href="mailto:hengtuo@nthegntuo.com">
                <Mail size={20} />
                <span>hengtuo@nthegntuo.com</span>
              </a>
            </div>
          </div>
          <form className="contact-form" aria-label="OEM inquiry form">
            <label>
              <span>Name</span>
              <input type="text" name="name" />
            </label>
            <label>
              <span>Email / WhatsApp</span>
              <input type="text" name="contact" />
            </label>
            <label>
              <span>Product Requirement</span>
              <textarea name="message" rows="4" />
            </label>
            <button type="button">
              Send Inquiry
              <ArrowUpRight size={18} />
            </button>
          </form>
        </div>
      </section>
      <footer className="site-footer">
        <div className="footer-support">
          <div className="container footer-support-inner">
            <strong>{ui.support}</strong>
            <a href={whatsappChatUrl} target="_blank" rel="noreferrer">
              <Phone size={20} />
              +86 15162883729
            </a>
            <a href={whatsappChatUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={20} />
              {ui.chat}
            </a>
            <a className="footer-top-link" href="#home">
              <ArrowUp size={20} />
              {ui.top}
            </a>
          </div>
        </div>
        <div className="footer-links-band">
          <div className="container footer-links-inner">
            <nav className="footer-links" aria-label="Footer links">
              {footerLinks.map((link, index) => (
                <a key={link.label} href={link.href}>{ui.footer[index] ?? link.label}</a>
              ))}
            </nav>
            <div className="footer-socials" aria-label="Social links">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.href} aria-label={link.label}>
                  {link.mark}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
