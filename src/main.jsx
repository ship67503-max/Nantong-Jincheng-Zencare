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
  Ruler,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import './styles.css';
import {
  blogArticles,
  getBlogArticlesByCluster,
  getBlogReadTime,
  getRelatedBlogArticles,
} from './blogData.js';
import {
  getAuthorityPage,
  getRelatedProductsForArticle,
} from './authorityData.js';
import { topicClusters } from './topicClusters.js';

const heroVideo = '/videos/hero-background-2-720p.webm';
const heroFallbackImage = '/images/factory-campus.jpeg';
const siteUrl = 'https://www.jczcare.com';
const contactEmail = 'hengtuo@nthengtuo.com';
const whatsappPhone = '+86 18962944556';
const whatsappChatUrl =
  'https://wa.me/8618962944556?text=Hello%2C%20I%20am%20interested%20in%20your%20OEM%2FODM%20pet%20products.%20Please%20share%20more%20information%20about%20MOQ%2C%20pricing%2C%20samples%2C%20and%20lead%20time.';
// Public Google Ads destination identifiers. Environment values override the supplied snippet.
const googleAdsId = String(import.meta.env.VITE_GOOGLE_ADS_ID || 'AW-18346194096').trim();
const googleAdsLeadLabel = String(import.meta.env.VITE_GOOGLE_ADS_LEAD_LABEL || 'R6b4CJ6xyNUcELDpkqxE').trim();
const hasGoogleAdsConfig = /^AW-\d+$/.test(googleAdsId) && Boolean(googleAdsLeadLabel);
const Silk = React.lazy(() => import('./Silk'));

const buildMailto = (subject = 'Website Inquiry', body = '') => {
  const params = new URLSearchParams({ subject });

  if (body) {
    params.set('body', body);
  }

  return `mailto:${contactEmail}?${params.toString()}`;
};
// Reuse the single GA4 Google tag loaded by index.html for Ads conversion events.
const ensureGoogleTagReady = () => {
  if (!hasGoogleAdsConfig || typeof window === 'undefined') {
    return false;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  return true;
};

const trackGoogleAdsLeadConversion = () => {
  if (!ensureGoogleTagReady()) {
    return;
  }

  window.gtag('event', 'conversion', {
    send_to: `${googleAdsId}/${googleAdsLeadLabel}`,
  });
};

const quotationEmailBody = [
  'Hello,',
  '',
  'I am interested in your products and would like to request a quotation.',
  '',
  'Company Name:',
  'Country:',
  'Product:',
  'Estimated Quantity:',
  'Customization Requirements:',
  '',
  'Best regards,',
].join('\n');

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
    title: 'Supply Coordination',
    text: 'Production scheduling and export support for long-term orders.',
  },
];

const customProducts = [
  {
    slug: 'disposable-pet-pads',
    title: 'Disposable Pet Pads',
    category: 'Core Product',
    image: '/images/custom-disposable-pet-pads-premium.png',
    detailImage: '/images/generated-site/products/products-disposable-pads-01.webp',
    detailImageAlt: 'Dog sitting beside a disposable pet training pad in a modern home',
    specs: ['Multiple sizes', 'Absorbency levels', 'Embossing optional'],
    badge: 'OEM / ODM',
    summary: 'OEM pet pads built around absorption, leak protection, and production planning.',
    details: ['Softness, embossing, size, and absorbency can be tuned.', 'Private-label packing and outer bag artwork supported.', 'Built for brands, retailers, and cross-border channels.'],
  },
  {
    slug: 'adult-underpads',
    title: 'Adult Disposable Underpads',
    category: 'Healthcare Care Series',
    image: '/images/adult-underpads-hero.png',
    detailImage: '/images/generated-site/products/products-underpads-01.webp',
    detailImageAlt: 'Absorbency testing of an adult disposable underpad in a quality laboratory',
    specs: ['SAP absorbency', 'Multiple sizes', 'OEM packaging'],
    badge: 'OEM / ODM',
    summary: 'Premium disposable underpads for healthcare, home care, distribution, and private-label programs.',
    details: ['Non-woven, tissue, SAP, and PE film structures can be planned around the application.', 'Size, weight, absorbency, pack count, and carton presentation can be customized.', 'Sampling and specification review support for B2B healthcare product programs.'],
  },
  {
    slug: 'pet-care-pad-glove-wipes',
    title: 'Pet Care Pad & Glove Wipes',
    category: 'Care Series',
    image: '/images/custom-care-pad-packaging-ai.png',
    detailImage: '/images/generated-site/packaging/private-label-packaging-01.webp',
    detailImageAlt: 'Private-label pet care packaging review meeting',
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
    detailImage: '/images/generated-site/materials/products-absorbent-paper-01.webp',
    detailImageAlt: 'Absorbent paper and core material sample on a tray',
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
    detailImage: '/images/generated-site/products/products-charcoal-pads-01.webp',
    detailImageAlt: 'Dark-backed absorbent pad edge for odor-control product reference',
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
    detailImage: '/images/generated-site/products/products-adhesive-pads-01.webp',
    detailImageAlt: 'Disposable pet pad on wood floor during liquid absorption test',
    specs: ['Secure backing', 'Easy removal', 'Quality checked'],
    badge: 'Custom Backing',
    summary: 'Anti-slip pet pads designed for cleaner placement and easy removal.',
    details: ['Adhesive position, size, specification, and packing can be customized.', 'Designed to reduce shifting while removing cleanly.', 'Ideal for upgraded training pad and scenario-based lines.'],
  },
];

const adultUnderpadProduct = customProducts.find((product) => product.slug === 'adult-underpads');

const adultUnderpadFaqs = [
  ['Can I customize the package?', 'Yes. We can coordinate private-label artwork, pack count, bag format, carton marks, and outer packaging around your target market and channel requirements.'],
  ['What is your MOQ?', 'MOQ is negotiated according to size, absorbency specification, packaging format, and production planning. Share your target quantity for a project-specific quotation.'],
  ['Can you print my logo?', 'Yes. Logo printing and private-label presentation can be reviewed during the packaging and artwork confirmation stage.'],
  ['Can you develop new sizes?', 'Yes. Size, weight, core configuration, and packing can be reviewed for new product programs before sampling.'],
  ['What certificates do you have?', 'Certification and compliance documentation should be confirmed against the destination market and specific product program. Our team can discuss the documentation required for your project.'],
  ['How long is production?', 'Production timing depends on specification approval, raw-material planning, packaging confirmation, and order quantity. A project schedule is provided after the brief is reviewed.'],
  ['Do you provide samples?', 'Yes. Samples can be arranged for material feel, dimensions, absorbency direction, packaging review, and buyer evaluation before bulk production.'],
  ['Can you support Amazon brands?', 'Yes. We can discuss private-label product specifications, packaging, carton information, and supply planning for online brands and other retail channels.'],
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
    nav: ['Profile', 'Projects', 'Innovation', 'Quality', 'Advantages', 'Customization', 'Blog'],
    contact: 'Contact Us',
    regionSearch: 'Search Europe / America',
    noRegion: 'No region found',
    support: 'Contact our team for project support:',
    chat: 'Chat Now',
    top: 'Back to Top',
    footer: ['About', 'Investor Relations', 'Affiliates', 'Help', 'Learn', 'Give Back', 'Gift Cards'],
  },
  de: {
    nav: ['Profil', 'Projekte', 'Innovation', 'Qualitat', 'Vorteile', 'Anpassung', 'Blog'],
    contact: 'Kontakt',
    regionSearch: 'Europa / Amerika suchen',
    noRegion: 'Keine Region gefunden',
    support: 'Unsere Experten sind 24/7 verfugbar:',
    chat: 'Jetzt chatten',
    top: 'Nach oben',
    footer: ['Uber uns', 'Investor Relations', 'Partner', 'Hilfe', 'Wissen', 'Engagement', 'Musterkits'],
  },
  fr: {
    nav: ['Profil', 'Projets', 'Innovation', 'Qualite', 'Avantages', 'Personnalisation', 'Blog'],
    contact: 'Contact',
    regionSearch: 'Rechercher Europe / Amerique',
    noRegion: 'Aucune region trouvee',
    support: 'Nos experts sont disponibles 24/7 :',
    chat: 'Chat en ligne',
    top: 'Haut de page',
    footer: ['A propos', 'Investisseurs', 'Affilies', 'Aide', 'Guide', 'Engagement', 'Kits cadeaux'],
  },
  it: {
    nav: ['Profilo', 'Progetti', 'Innovazione', 'Qualita', 'Vantaggi', 'Personalizzazione', 'Blog'],
    contact: 'Contatti',
    regionSearch: 'Cerca Europa / America',
    noRegion: 'Nessuna regione trovata',
    support: 'I nostri esperti sono disponibili 24/7:',
    chat: 'Chatta ora',
    top: 'Torna su',
    footer: ['Chi siamo', 'Investitori', 'Affiliati', 'Aiuto', 'Guide', 'Responsabilita', 'Kit regalo'],
  },
  es: {
    nav: ['Perfil', 'Proyectos', 'Innovacion', 'Calidad', 'Ventajas', 'Personalizacion', 'Blog'],
    contact: 'Contacto',
    regionSearch: 'Buscar Europa / America',
    noRegion: 'No se encontro region',
    support: 'Nuestros expertos estan disponibles 24/7:',
    chat: 'Chatear ahora',
    top: 'Volver arriba',
    footer: ['Sobre nosotros', 'Inversores', 'Afiliados', 'Ayuda', 'Aprender', 'Contribuir', 'Kits regalo'],
  },
  nl: {
    nav: ['Profiel', 'Projecten', 'Innovatie', 'Kwaliteit', 'Voordelen', 'Maatwerk', 'Blog'],
    contact: 'Contact',
    regionSearch: 'Zoek Europa / Amerika',
    noRegion: 'Geen regio gevonden',
    support: 'Onze experts zijn 24/7 beschikbaar:',
    chat: 'Chat nu',
    top: 'Naar boven',
    footer: ['Over ons', 'Investeerders', 'Partners', 'Help', 'Leren', 'Teruggeven', 'Sample kits'],
  },
  pl: {
    nav: ['Profil', 'Projekty', 'Innowacje', 'Jakosc', 'Zalety', 'Personalizacja', 'Blog'],
    contact: 'Kontakt',
    regionSearch: 'Szukaj Europa / Ameryka',
    noRegion: 'Nie znaleziono regionu',
    support: 'Nasi eksperci sa dostepni 24/7:',
    chat: 'Czat teraz',
    top: 'Do gory',
    footer: ['O nas', 'Inwestorzy', 'Partnerzy', 'Pomoc', 'Wiedza', 'Wsparcie', 'Zestawy probek'],
  },
  sv: {
    nav: ['Profil', 'Projekt', 'Innovation', 'Kvalitet', 'Fordelar', 'Anpassning', 'Blog'],
    contact: 'Kontakt',
    regionSearch: 'Sok Europa / Amerika',
    noRegion: 'Ingen region hittades',
    support: 'Vara experter finns tillgangliga 24/7:',
    chat: 'Chatta nu',
    top: 'Till toppen',
    footer: ['Om oss', 'Investerare', 'Partners', 'Hjalp', 'Lar dig', 'Ge tillbaka', 'Provkit'],
  },
  da: {
    nav: ['Profil', 'Projekter', 'Innovation', 'Kvalitet', 'Fordele', 'Tilpasning', 'Blog'],
    contact: 'Kontakt',
    regionSearch: 'Sog Europa / Amerika',
    noRegion: 'Ingen region fundet',
    support: 'Vores eksperter er tilgaengelige 24/7:',
    chat: 'Chat nu',
    top: 'Til toppen',
    footer: ['Om os', 'Investorer', 'Partnere', 'Hjaelp', 'Laer', 'Giv tilbage', 'Provekit'],
  },
  no: {
    nav: ['Profil', 'Prosjekter', 'Innovasjon', 'Kvalitet', 'Fordeler', 'Tilpasning', 'Blog'],
    contact: 'Kontakt',
    regionSearch: 'Sok Europa / Amerika',
    noRegion: 'Ingen region funnet',
    support: 'Vare eksperter er tilgjengelige 24/7:',
    chat: 'Chat na',
    top: 'Til toppen',
    footer: ['Om oss', 'Investorer', 'Partnere', 'Hjelp', 'Laer', 'Gi tilbake', 'Provekit'],
  },
  fi: {
    nav: ['Profiili', 'Projektit', 'Innovaatio', 'Laatu', 'Edut', 'Raatalointi', 'Blog'],
    contact: 'Yhteys',
    regionSearch: 'Hae Eurooppa / Amerikka',
    noRegion: 'Aluetta ei loytynyt',
    support: 'Asiantuntijamme ovat tavoitettavissa 24/7:',
    chat: 'Chat nyt',
    top: 'Ylos',
    footer: ['Tietoa meista', 'Sijoittajat', 'Kumppanit', 'Tuki', 'Opi', 'Vastuullisuus', 'Naytekitit'],
  },
  pt: {
    nav: ['Perfil', 'Projetos', 'Inovacao', 'Qualidade', 'Vantagens', 'Personalizacao', 'Blog'],
    contact: 'Contato',
    regionSearch: 'Pesquisar Europa / America',
    noRegion: 'Nenhuma regiao encontrada',
    support: 'Nossos especialistas estao disponiveis 24/7:',
    chat: 'Conversar agora',
    top: 'Voltar ao topo',
    footer: ['Sobre nos', 'Investidores', 'Afiliados', 'Ajuda', 'Aprender', 'Retribuir', 'Kits amostra'],
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
  { label: 'Help', href: '/pages/help' },
  { label: 'Learn', href: '/pages/learn' },
  { label: 'Give Back', href: '/pages/give-back' },
  { label: 'Gift Cards', href: '/pages/gift-cards' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Pet Pad Factory', href: '/pet-pad-factory' },
  { label: 'Private Label Pet Pads', href: '/private-label-pet-pads' },
  { label: 'Quality Control', href: '/quality-control' },
  { label: 'OEM Process', href: '/oem-process' },
  { label: 'Contact', href: '/contact' },
  { label: 'Resources', href: '/resources' },
  { label: 'Factory Center', href: '/factory' },
  { label: 'Academy', href: '/academy' },
  { label: 'Comparisons', href: '/comparisons' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Media', href: '/media' },
  { label: 'Downloads', href: '/downloads' },
  { label: 'Buyer Guides', href: '/buyer-guides' },
  { label: 'Material Knowledge', href: '/materials' },
  { label: 'Industry Reports', href: '/reports' },
];

const newsArticles = [
  {
    slug: 'private-label-pet-pad-ideas',
    category: 'Creative Ideas',
    date: '2026.07',
    title: 'Private-label pet pad ideas for brands building a sharper product line',
    excerpt: 'How size, absorbency, surface feel, and packaging language can turn a basic pet pad into a clearer market offer.',
    image: '/images/generated-site/products/products-disposable-pads-01.webp',
    body: [
      'A private-label pet pad project works best when the product is planned around a specific use case. Puppy training, senior pet care, travel, cage lining, and care-bed protection all require different choices in size, weight, surface feel, and absorbency.',
      'For brand owners, the creative work is not only visual packaging. It is also the way the structure, core, film, embossing, and pack count communicate value to customers.',
      'Our team uses sample review, structure discussion, and packaging coordination to help customers turn loose ideas into a product plan that can be quoted, sampled, and produced.',
    ],
    points: ['Scenario-based size planning', 'Absorbency and core structure direction', 'Retail pack and carton language'],
  },
  {
    slug: 'absorbent-core-development-notes',
    category: 'Product Thinking',
    date: '2026.07',
    title: 'What we consider when developing absorbent core structures',
    excerpt: 'A concise look at SAP ratio, fluff pulp, diffusion speed, rewet control, and cost balance in pet absorbent products.',
    image: '/images/generated-site/products/products-pet-pad-structure-01.webp',
    body: [
      'Absorbent core development is a balance between speed, lock-in, surface dryness, pad thickness, and target cost. A stronger core does not always mean simply adding more material.',
      'Different sales channels may need different product logic. A high-turnover daily pad may focus on cost and consistency, while a premium pad may emphasize surface comfort, structure visibility, and packaging presentation.',
      'By adjusting layer materials, SAP placement, pulp ratio, and film options, we help customers evaluate which structure fits the market positioning.',
    ],
    points: ['SAP and fluff pulp balance', 'Rewet and diffusion review', 'Cost-to-performance planning'],
  },
  {
    slug: 'factory-visual-content-for-b2b-brands',
    category: 'Brand Content',
    date: '2026.07',
    title: 'Why factory visual content matters for B2B pet care brands',
    excerpt: 'Factory scenes, inspection details, and clean product visuals help customers understand capability before sampling.',
    image: '/images/generated-site/factory/factory-production-line-01.webp',
    body: [
      'B2B customers often need more than a product photo. They need to understand the manufacturing environment, inspection logic, packaging workflow, and communication reliability behind the product.',
      'Clear factory visuals can help brands and buyers align faster. Production lines, warehouse order, laboratory inspection, and product layer details all become part of the trust-building process.',
      'We are building a content system that makes OEM/ODM cooperation easier to understand, from first inquiry to sample confirmation.',
    ],
    points: ['Factory capability storytelling', 'Inspection and process content', 'Buyer-facing product education'],
  },
];

const businessSeoPages = [
  {
    path: '/oem-pet-pee-pads',
    kicker: 'OEM Pet Pee Pads',
    title: 'OEM Pet Pee Pads Manufacturer | Nantong JINCHENG ZENCARE',
    description: 'OEM pet pee pads manufacturer in China for overseas pet brands, wholesalers, importers, supermarkets, and distributors needing custom size, absorbency, packaging, and stable supply.',
    h1: 'OEM pet pee pads for brands that need stable factory supply.',
    intro: 'Nantong JINCHENG ZENCARE develops and manufactures OEM pet pee pads for B2B buyers who need practical product specifications, private-label packaging, and repeatable delivery performance.',
    image: '/images/generated-site/products/products-disposable-pads-01.webp',
    sections: [
      ['Custom specification', 'Size, weight, embossing, topsheet feel, absorbency level, and backing film can be planned around your market position.'],
      ['Factory-side development', 'Our team supports sample review, material selection, production testing, packaging coordination, and export-ready order planning.'],
      ['B2B supply focus', 'We work with brands, channel partners, importers, and distributors that need reliable OEM pet pad programs rather than retail one-off orders.'],
    ],
    faqs: [
      ['Can you customize OEM pet pee pads?', 'Yes. We can customize size, absorbency, surface material, embossing, color direction, packaging, carton marks, and pack count.'],
      ['Who is this OEM service for?', 'It is designed for pet brands, wholesalers, distributors, importers, supermarkets, and cross-border sellers.'],
      ['Can you prepare samples before mass production?', 'Yes. Samples can be prepared for specification review, absorbency testing, packaging confirmation, and buyer presentation.'],
    ],
  },
  {
    path: '/private-label-pet-pads',
    kicker: 'Private Label Pet Pads',
    title: 'Private Label Pet Pads Manufacturer | OEM Packaging & Supply',
    description: 'Private label pet pads manufacturer supporting brand packaging, custom specifications, absorbency options, sample development, and export supply for B2B pet care buyers.',
    h1: 'Private label pet pads with factory-backed product planning.',
    intro: 'Build a pet pad line with your own brand identity, packaging direction, product structure, and channel-ready specification support.',
    image: '/images/generated-site/packaging/private-label-packaging-01.webp',
    sections: [
      ['Brand presentation', 'We support pouch, bag, carton, label, product naming, pack count, and buyer-facing material descriptions.'],
      ['Product matching', 'Private-label pads can be aligned to puppy training, adult pet care, travel, cage lining, retail shelves, or online bundles.'],
      ['Sampling workflow', 'Samples help confirm structure, absorbency, surface feel, package language, and carton details before bulk production.'],
    ],
    faqs: [
      ['Can you make products under our brand?', 'Yes. We support private-label packaging and product specifications for your target market.'],
      ['Do you help with packaging direction?', 'Yes. We can coordinate bag format, pack count, carton marks, product descriptions, and sample presentation.'],
      ['Can one brand develop multiple pad lines?', 'Yes. Customers can build basic, premium, charcoal, adhesive, or scenario-based product lines.'],
    ],
  },
  {
    path: '/pet-pee-pad-manufacturer',
    kicker: 'Pet Pee Pad Manufacturer',
    title: 'Pet Pee Pad Manufacturer in China | JCZCARE OEM Factory',
    description: 'China pet pee pad manufacturer for OEM/ODM orders, custom absorbency, private-label packaging, automated production, and export-ready B2B supply.',
    h1: 'Pet pee pad manufacturer for long-term B2B cooperation.',
    intro: 'Our factory supports commercial buyers with absorbent pet care products made for stable quality, structured communication, and repeat production.',
    image: '/images/generated-site/factory/factory-campus-01.webp',
    sections: [
      ['Manufacturing capability', 'A 12,000-square-meter factory and automated lines support custom pet pad, pet diaper, absorbent sheet, and care pad programs.'],
      ['Quality process', 'Incoming materials, line checks, absorbency tests, sealing review, and shipment inspection help maintain order consistency.'],
      ['Export support', 'We coordinate samples, packaging, cartons, marks, and production schedules for overseas B2B buyers.'],
    ],
    faqs: [
      ['What products do you manufacture?', 'We manufacture pet pads, pet absorbent sheets, pet diapers, dog poop bags, and related absorbent pet care items.'],
      ['Can you supply overseas distributors?', 'Yes. Our service is built for brands, distributors, importers, wholesalers, and channel buyers.'],
      ['Do you support ODM development?', 'Yes. We can assist with structure, formula direction, packaging, and market-oriented product planning.'],
    ],
  },
  {
    path: '/pet-pad-factory',
    kicker: 'Pet Pad Factory',
    title: 'Pet Pad Factory | Automated OEM Pet Care Manufacturing',
    description: 'Pet pad factory with automated production, custom specifications, absorbent core development, private-label packaging, and B2B export coordination.',
    h1: 'A pet pad factory built for OEM/ODM supply.',
    intro: 'From raw material review to packing and shipment, our pet pad factory supports buyers who need clarity, capacity, and product consistency.',
    image: '/images/generated-site/factory/factory-production-line-01.webp',
    sections: [
      ['Automated production', 'Automated equipment helps manage repeated order output across size, weight, core structure, and pack format.'],
      ['Factory visibility', 'Production lines, warehouse organization, inspection steps, and packing workflows are part of our buyer communication process.'],
      ['Product flexibility', 'We support standard pads, charcoal pads, adhesive pads, absorbent paper sheets, and care products for different channels.'],
    ],
    faqs: [
      ['Is JCZCARE a source factory?', 'Yes. Nantong JINCHENG ZENCARE is a source manufacturer focused on absorbent pet care products.'],
      ['Can factory specifications be customized?', 'Yes. Size, absorbency, surface material, packaging, and carton requirements can be customized.'],
      ['Can you support repeat orders?', 'Yes. Our production planning is designed for long-term B2B cooperation and repeat order coordination.'],
    ],
  },
  {
    path: '/about-factory',
    kicker: 'About Factory',
    title: 'About JCZCARE Factory | Nantong JINCHENG ZENCARE',
    description: 'Learn about Nantong JINCHENG ZENCARE, a pet care absorbent product manufacturer focused on OEM/ODM pet pads, private-label support, quality control, and export service.',
    h1: 'A focused absorbent pet care factory in Nantong.',
    intro: 'Nantong JINCHENG ZENCARE Technology Company focuses on the R&D, manufacturing, and sales of pet pads, pet diapers, absorbent sheets, and dog poop bags.',
    image: '/images/generated-site/factory/factory-campus-01.webp',
    sections: [
      ['Company profile', 'With 20 years of industry experience, we support B2B buyers with product development, manufacturing, and packaging coordination.'],
      ['Production base', 'Our factory covers about 12,000 square meters with automated lines and stable production planning for absorbent pet care products.'],
      ['Cooperation model', 'We serve overseas pet brands, distributors, supermarkets, wholesalers, importers, and cross-border channels.'],
    ],
    faqs: [
      ['Where is the factory located?', 'The company is located in Nantong, Jiangsu, China.'],
      ['What is your main business?', 'Our main business is OEM/ODM manufacturing of pet absorbent care products for B2B buyers.'],
      ['Can buyers visit or review the factory?', 'Factory information, production visuals, product samples, and project communication can be prepared for buyer review.'],
    ],
  },
  {
    path: '/quality-control',
    kicker: 'Quality Control',
    title: 'Pet Pad Quality Control | OEM Absorbency & Batch Inspection',
    description: 'Quality control process for OEM pet pads covering raw materials, production checks, absorbency testing, rewet review, leakage performance, packaging, and shipment inspection.',
    h1: 'Quality control before every pet pad shipment.',
    intro: 'Our quality process is designed around practical buyer concerns: material consistency, absorbency, surface dryness, leakage prevention, sealing, packing, and shipment appearance.',
    image: '/images/generated-site/quality-control/factory-quality-control-01.webp',
    sections: [
      ['Incoming materials', 'Topsheet, fluff pulp, SAP, backing film, and packaging materials are reviewed against order requirements.'],
      ['Process checks', 'Weight, size, sealing, embossing, folding, and packaging consistency are monitored during production.'],
      ['Performance review', 'Absorption speed, diffusion, rewet, pressure performance, and leakage behavior can be tested according to the project brief.'],
    ],
    faqs: [
      ['What quality checks are used for pet pads?', 'Typical checks include raw material review, size and weight checks, absorbency tests, rewet review, sealing checks, and packaging inspection.'],
      ['Can quality requirements be customized?', 'Yes. Buyers can define target absorbency, pad size, weight, packaging, and inspection focus for the project.'],
      ['Do you inspect before shipment?', 'Yes. Carton marks, labels, packaging appearance, and shipment readiness are reviewed before dispatch.'],
    ],
  },
  {
    path: '/oem-process',
    kicker: 'OEM Process',
    title: 'OEM Pet Pad Process | From Brief to Production',
    description: 'OEM pet pad process for B2B buyers: project brief, specification planning, sample development, testing, packaging confirmation, production, inspection, and shipment.',
    h1: 'A clear OEM process from brief to shipment.',
    intro: 'Our OEM process helps buyers turn product ideas into practical specifications, samples, confirmed packaging, and repeatable production orders.',
    image: '/images/generated-site/warehouse/warehouse-finished-goods-01.webp',
    sections: [
      ['Project brief', 'Share target market, product type, size, absorbency, packaging direction, expected quantity, and delivery requirements.'],
      ['Sample development', 'We prepare specification options for buyer review, including material, structure, package format, and performance direction.'],
      ['Production delivery', 'After sample and packaging confirmation, production, batch inspection, packing, and shipping coordination are arranged.'],
    ],
    faqs: [
      ['What information is needed to start?', 'Please provide target market, size, absorbency, packaging idea, order quantity, and preferred delivery plan.'],
      ['How does sample confirmation work?', 'Samples are reviewed for structure, absorbency, surface feel, packaging, and buyer requirements before bulk order planning.'],
      ['Can you support repeat production?', 'Yes. Confirmed specifications and packaging details can be used to support repeat order consistency.'],
    ],
  },
  {
    path: '/certifications',
    kicker: 'Certifications',
    title: 'Pet Pad Factory Certifications & Compliance Support | JCZCARE',
    description: 'Certification and compliance support for pet pad OEM buyers, including factory documentation, material information, packaging coordination, and B2B export requirements.',
    h1: 'Certification support for B2B pet pad projects.',
    intro: 'Certification and documentation needs vary by market and channel. We support buyers with practical factory, product, material, and packaging information for project review.',
    image: '/images/generated-site/factory/factory-production-line-02.webp',
    sections: [
      ['Documentation support', 'Factory information, product specifications, material descriptions, and packaging details can be prepared for buyer evaluation.'],
      ['Channel requirements', 'We coordinate project information for distributors, supermarkets, importers, and private-label brand review processes.'],
      ['Quality records', 'Batch-related inspection and production information can support order communication and internal buyer documentation.'],
    ],
    faqs: [
      ['Can you provide factory documentation?', 'Yes. We can prepare available factory and product information according to project requirements.'],
      ['Can packaging be adjusted for local markets?', 'Yes. Label direction, carton marks, pack count, and product language can be coordinated for target channels.'],
      ['Do certification needs vary by country?', 'Yes. Requirements may vary by market, channel, and buyer policy, so details should be confirmed during project planning.'],
    ],
  },
  {
    path: '/faq',
    kicker: 'FAQ',
    title: 'OEM Pet Pad FAQ | Private Label, MOQ, Samples & Quality',
    description: 'Frequently asked questions for OEM pet pad buyers covering customization, private label, samples, MOQ planning, quality control, packaging, delivery, and factory cooperation.',
    h1: 'OEM pet pad questions, answered clearly.',
    intro: 'Use this FAQ to understand how JCZCARE supports B2B buyers with pet pad customization, sample development, private-label packaging, and production coordination.',
    image: '/images/generated-site/products/products-disposable-pads-02.webp',
    sections: [
      ['For brand owners', 'We help convert product requirements into specifications, samples, packaging formats, and production-ready plans.'],
      ['For distributors', 'We support practical product lines, carton planning, shipment coordination, and repeat order communication.'],
      ['For importers', 'We provide factory-side coordination for absorbent pet care products, private label, and market-fit product development.'],
    ],
    faqs: [
      ['Do you offer OEM and ODM service?', 'Yes. We offer OEM and ODM support for pet pads, absorbent sheets, pet diapers, dog poop bags, and related products.'],
      ['Can we customize the package?', 'Yes. Private-label packaging, pack count, carton marks, labels, and brand presentation can be customized.'],
      ['What affects MOQ?', 'MOQ can depend on material, size, packaging, printing, product structure, and production scheduling.'],
      ['Can you ship overseas?', 'Yes. We support export-oriented B2B projects and coordinate packing and shipment requirements with buyers.'],
    ],
  },
  {
    path: '/blog',
    kicker: 'Blog',
    title: 'Pet Pad OEM Blog | Factory Ideas, Product Development & B2B Supply',
    description: 'Read JCZCARE blog insights about OEM pet pads, private-label packaging, absorbent core development, quality control, factory supply, and B2B pet care product planning.',
    h1: 'Pet pad OEM insights for better B2B decisions.',
    intro: 'Our blog collects practical product ideas, factory notes, and buyer-focused guidance for pet care brands, distributors, wholesalers, importers, and channel teams.',
    image: '/images/generated-site/contact/contact-business-office-01.webp',
    sections: [
      ['Product development', 'Explore absorbent core planning, material choices, pad scenarios, and channel-specific product direction.'],
      ['Factory knowledge', 'Understand production workflow, quality control, packaging coordination, and export order planning.'],
      ['Brand growth', 'Build stronger private-label product lines with clearer specifications, better sample presentation, and structured communication.'],
    ],
    faqs: [
      ['What topics does the blog cover?', 'The blog covers OEM pet pads, private-label packaging, absorbent core design, quality control, factory supply, and B2B product planning.'],
      ['Is the blog for retail buyers?', 'No. The content is mainly written for B2B buyers such as brands, distributors, wholesalers, importers, and channel partners.'],
      ['Can I request a topic?', 'Yes. Contact our team with your product question and we can provide project-focused guidance.'],
    ],
    articleLinks: true,
  },
  {
    path: '/contact',
    kicker: 'Contact',
    title: 'Contact JCZCARE | OEM Pet Pad Manufacturer Inquiry',
    description: 'Contact Nantong JINCHENG ZENCARE for OEM pet pads, private-label packaging, samples, product planning, absorbent core development, and B2B factory cooperation.',
    h1: 'Contact JCZCARE for your OEM pet pad project.',
    intro: 'Share your target market, product requirement, size, absorbency, packaging direction, and quantity. Our team will help prepare a clear project plan.',
    image: '/images/generated-site/contact/contact-business-office-01.webp',
    sections: [
      ['Project inquiry', 'Tell us what product line you want to develop and which market or sales channel you plan to serve.'],
      ['Specification support', 'We can discuss size, weight, absorbency, surface material, backing film, packaging, and carton requirements.'],
      ['Direct communication', 'Use WhatsApp, email, or the request form to start project communication with our factory team.'],
    ],
    faqs: [
      ['What should I include in my inquiry?', 'Please include product type, target market, size, absorbency, packaging idea, quantity, and delivery expectation.'],
      ['Can I contact by WhatsApp?', 'Yes. You can contact us by WhatsApp for OEM/ODM pet pad project discussion.'],
      ['Do you reply to B2B project requests?', 'Yes. We focus on overseas B2B OEM/ODM inquiries from brands, distributors, importers, and channel partners.'],
    ],
  },
];

const seoPageMap = new Map(businessSeoPages.map((page) => [page.path, page]));

const staticSeoPages = {
  '/request-product-plan': {
    title: 'OEM Product Plan Request | JCZCARE Pet Pad Factory',
    description: 'Submit your OEM/ODM pet pad project details to Nantong JINCHENG ZENCARE for specification planning, samples, packaging direction, and B2B factory support.',
    image: '/images/generated-site/products/products-pet-pad-structure-01.webp',
  },
  '/sign-in': {
    title: 'Business Sign In | JCZCARE',
    description: 'Sign in to the JCZCARE business portal for OEM pet pad project communication and account registration.',
    image: heroFallbackImage,
  },
  '/pages/about': {
    title: 'About Nantong JINCHENG ZENCARE | Pet Pad Source Factory',
    description: 'Learn about Nantong JINCHENG ZENCARE, a pet care absorbent products source factory supporting OEM/ODM pet pads, private-label packaging, and export supply.',
    image: '/images/generated-site/factory/factory-campus-01.webp',
  },
  '/pages/investor-relations': {
    title: 'Business Overview | JCZCARE Pet Care Manufacturing',
    description: 'A business overview of JCZCARE manufacturing capability, production capacity, quality focus, and B2B absorbent pet care product supply.',
    image: '/images/generated-site/factory/factory-campus-01.webp',
  },
  '/pages/affiliates': {
    title: 'Distributor & Partner Program | JCZCARE OEM Pet Pads',
    description: 'Partner with JCZCARE as a distributor or sourcing partner for OEM pet pads, private-label absorbent products, packaging support, and factory supply.',
    image: '/images/generated-site/contact/contact-business-office-01.webp',
  },
  '/pages/help': {
    title: 'Help Center | OEM Pet Pad Orders, Samples & Packaging',
    description: 'Find answers about OEM pet pad orders, sample development, packaging support, quality control, production scheduling, and factory communication.',
    image: '/images/generated-site/quality-control/factory-quality-control-01.webp',
  },
  '/pages/learn': {
    title: 'Learn Center | Pet Pad OEM Knowledge & Product Planning',
    description: 'Learn about pet pad absorbency, private-label packaging, product structure, factory supply, quality control, and OEM/ODM development decisions.',
    image: '/images/generated-site/products/products-pet-pad-structure-01.webp',
  },
  '/pages/give-back': {
    title: 'Responsible Pet Care Manufacturing | JCZCARE',
    description: 'Explore JCZCARE responsible manufacturing principles for practical absorbent pet care products, quality planning, and long-term B2B cooperation.',
    image: '/images/generated-site/contact/contact-business-office-01.webp',
  },
  '/pages/gift-cards': {
    title: 'OEM Sample Kits | Pet Pad Material & Packaging Review',
    description: 'Request OEM sample kits for pet pads, absorbent sheets, packaging swatches, material review, and buyer-ready private-label product planning.',
    image: '/images/generated-site/products/products-disposable-pads-01.webp',
  },
};

const buildAbsoluteUrl = (path = '/') => `${siteUrl}${path}`;

const setHeadTag = (selector, createTag, valueKey, value) => {
  let tag = document.head.querySelector(selector);

  if (!tag) {
    tag = createTag();
    document.head.appendChild(tag);
  }

  tag.setAttribute(valueKey, value);
};

function OptimizedImage({ src, alt, loading = 'lazy', decoding = 'async', ...props }) {
  const webpSrc = src?.match(/\.(png|jpe?g)$/i) ? src.replace(/\.(png|jpe?g)$/i, '.webp') : '';

  if (!webpSrc) {
    return <img src={src} alt={alt} loading={loading} decoding={decoding} {...props} />;
  }

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img src={src} alt={alt} loading={loading} decoding={decoding} {...props} />
    </picture>
  );
}

const buildStructuredData = ({
  title,
  description,
  path,
  faqs = [],
  image,
  product,
  article,
  breadcrumbs,
  authorityPage,
}) => {
  const canonical = buildAbsoluteUrl(path);
  const baseData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Nantong JINCHENG ZENCARE Technology Company',
      alternateName: 'JCZCARE',
      url: siteUrl,
      email: contactEmail,
      telephone: whatsappPhone,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: whatsappPhone,
        availableLanguage: ['English'],
        url: 'https://wa.me/8618962944556',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nantong',
        addressRegion: 'Jiangsu',
        addressCountry: 'CN',
      },
      sameAs: ['https://youtube.com/@nantongjinchengzencaretechnolo'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'JCZCARE',
      url: siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/blog?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: (breadcrumbs || [['Home', '/'], [title, path]]).map(([name, item], index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name,
        item: buildAbsoluteUrl(item),
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': path === '/contact' ? 'ContactPage' : 'WebPage',
      name: title,
      description,
      url: canonical,
      image: image ? buildAbsoluteUrl(image) : buildAbsoluteUrl(heroFallbackImage),
      isPartOf: {
        '@type': 'WebSite',
        name: 'JCZCARE',
        url: siteUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Nantong JINCHENG ZENCARE Technology Company',
      },
    },
  ];

  if (faqs.length > 0) {
    baseData.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      })),
    });
  }

  if (product) {
    baseData.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      category: product.category,
      image: buildAbsoluteUrl(product.detailImage || product.image),
      description: product.summary,
      brand: {
        '@type': 'Brand',
        name: 'JCZCARE',
      },
      manufacturer: {
        '@type': 'Organization',
        name: 'Nantong JINCHENG ZENCARE Technology Company',
      },
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceCurrency: 'USD',
        url: canonical,
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'USD',
          description: 'OEM pricing depends on product specification, packaging, and order quantity.',
        },
      },
    });
  }

  if (article) {
    baseData.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.metaDescription,
      image: buildAbsoluteUrl(article.image),
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      author: {
        '@type': 'Organization',
        name: article.author,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Nantong JINCHENG ZENCARE Technology Company',
      },
      mainEntityOfPage: canonical,
      articleSection: article.category,
      keywords: [article.primaryKeyword, ...article.secondaryKeywords].join(', '),
    });
  }

  if (authorityPage?.kind === 'pillar' || authorityPage?.kind === 'factory-detail') {
    baseData.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: authorityPage.h1,
      description: authorityPage.metaDescription,
      image: buildAbsoluteUrl(authorityPage.image),
      datePublished: authorityPage.updatedAt,
      dateModified: authorityPage.updatedAt,
      author: { '@type': 'Organization', name: 'JCZCARE Editorial Team' },
      publisher: { '@type': 'Organization', name: 'Nantong JINCHENG ZENCARE Technology Company' },
      mainEntityOfPage: canonical,
      articleSection: authorityPage.title,
    });
  }

  if (authorityPage?.timeline?.length) {
    baseData.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${authorityPage.title} workflow`,
      itemListElement: authorityPage.timeline.map(([number, name, description], index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: `${number} ${name}`,
        description,
      })),
    });
  }

  if (authorityPage?.gallery?.length) {
    baseData.push({
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      name: authorityPage.title,
      url: canonical,
      associatedMedia: authorityPage.gallery.map(([contentUrl, caption]) => ({
        '@type': 'ImageObject',
        contentUrl: buildAbsoluteUrl(contentUrl),
        caption,
      })),
    });
  }

  if (authorityPage?.video) {
    baseData.push({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: 'JCZCARE Factory Profile Video',
      description: authorityPage.metaDescription,
      thumbnailUrl: buildAbsoluteUrl(authorityPage.image),
      contentUrl: buildAbsoluteUrl(authorityPage.video),
      uploadDate: authorityPage.updatedAt,
    });
  }

  return baseData;
};

const applyPageSeo = ({
  title,
  description,
  path,
  image,
  faqs,
  product,
  article,
  breadcrumbs,
  authorityPage,
}) => {
  const canonical = buildAbsoluteUrl(path);
  const shareImage = buildAbsoluteUrl(image || heroFallbackImage);

  document.title = title;
  setHeadTag('meta[name="description"]', () => {
    const tag = document.createElement('meta');
    tag.setAttribute('name', 'description');
    return tag;
  }, 'content', description);
  setHeadTag('meta[name="robots"]', () => {
    const tag = document.createElement('meta');
    tag.setAttribute('name', 'robots');
    return tag;
  }, 'content', 'index, follow, max-image-preview:large');
  setHeadTag('link[rel="canonical"]', () => {
    const tag = document.createElement('link');
    tag.setAttribute('rel', 'canonical');
    return tag;
  }, 'href', canonical);

  [
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    ['property', 'og:type', article ? 'article' : 'website'],
    ['property', 'og:url', canonical],
    ['property', 'og:image', shareImage],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', description],
    ['name', 'twitter:image', shareImage],
  ].forEach(([attr, key, content]) => {
    setHeadTag(`meta[${attr}="${key}"]`, () => {
      const tag = document.createElement('meta');
      tag.setAttribute(attr, key);
      return tag;
    }, 'content', content);
  });

  let structuredDataTag = document.head.querySelector('#jczcare-jsonld');
  if (!structuredDataTag) {
    structuredDataTag = document.createElement('script');
    structuredDataTag.id = 'jczcare-jsonld';
    structuredDataTag.type = 'application/ld+json';
    document.head.appendChild(structuredDataTag);
  }
  structuredDataTag.textContent = JSON.stringify(buildStructuredData({
    title,
    description,
    path,
    faqs,
    image,
    product,
    article,
    breadcrumbs,
    authorityPage,
  }));
};

function SiteNav({ navRef, ui }) {
  return (
    <nav ref={navRef} className="nav">
      <a className="brand" href="/#home" aria-label="Nantong JINCHENG ZENCARE homepage">
        <span>
          <strong>Nantong JINCHENG ZENCARE</strong>
          <small>Technology Company</small>
        </span>
      </a>
      <div className="nav-links" aria-label="Main navigation">
        <a href="/#about">{ui.nav[0]}</a>
        <a href="/#projects">{ui.nav[1]}</a>
        <a href="/#innovation">{ui.nav[2]}</a>
        <a href="/blog">{ui.nav[6]}</a>
        <a href="/factory">Factory</a>
        <a href="/resources">Resources</a>
        <a href="/products/adult-underpads">Products</a>
        <a href="/#quality">{ui.nav[3]}</a>
        <a href="/#advantages">{ui.nav[4]}</a>
        <a href="/#customization">{ui.nav[5]}</a>
      </div>
      <a className="nav-cta" href="/#contact">
        {ui.contact}
        <ArrowUpRight size={18} strokeWidth={1.8} />
      </a>
      <a className="nav-signin" href="/sign-in">
        Sign In
      </a>
    </nav>
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
            <OptimizedImage
              src={product.detailImage || product.image}
              alt={product.detailImageAlt || `${product.title} product image`}
              loading="eager"
              fetchPriority="high"
            />
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

const adultUnderpadFeatures = [
  [Droplets, 'Super Absorbent', 'Rapid liquid absorption with SAP technology.'],
  [ShieldCheck, 'Leak-proof Protection', 'Reliable waterproof PE backing.'],
  [Layers3, 'Soft Comfort', 'Gentle non-woven surface for skin comfort.'],
  [Factory, 'OEM / ODM Available', 'Custom sizes, packaging, and branding.'],
];

const adultUnderpadAdvantages = [
  'High Absorption Capacity',
  'Multi-layer Leak Protection',
  'Skin-friendly Surface',
  'Low Rewet Performance',
  'Odor Control',
  'OEM Customization',
  'Multiple Sizes',
  'Fast Production',
];

const adultUnderpadCustomization = [
  ['Custom Size', 'Match dimensions to care settings, packs, and usage scenarios.'],
  ['Custom Weight', 'Balance material weight, absorbency, and target price positioning.'],
  ['Custom SAP Ratio', 'Review core composition around absorption and rewet targets.'],
  ['Custom Packaging', 'Choose pack count, bag format, carton marks, and label direction.'],
  ['Private Label', 'Prepare a brand-ready product line for distributors and retailers.'],
  ['Carton Printing', 'Coordinate outer carton information for logistics and shipment.'],
];

const adultUnderpadApplications = [
  ['Hospital', 'Disposable protection for beds, examination areas, and care workflows.'],
  ['Nursing Home', 'Practical absorbent formats for routine resident care and supply planning.'],
  ['Medical Distributor', 'Configurable specifications and packaging for regional distribution.'],
  ['Retail Brand', 'Private-label underpads for home care and consumer healthcare channels.'],
];

function SiteFooter({ ui }) {
  return (
    <footer className="site-footer">
      <div className="footer-support">
        <div className="container footer-support-inner">
          <strong>{ui.support}</strong>
          <a className="footer-whatsapp-cta" href={whatsappChatUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat with our OEM specialist on WhatsApp">
            <MessageCircle className="whatsapp-icon" size={20} />
            <span>
              <strong>Talk to Our OEM Specialist</strong>
              <small>Start WhatsApp Chat</small>
              <small>{whatsappPhone}</small>
            </span>
          </a>
          <a href={whatsappChatUrl} target="_blank" rel="noopener noreferrer" aria-label="Start WhatsApp Chat">
            <MessageCircle size={20} />
            Start WhatsApp Chat
          </a>
          <a className="footer-top-link" href="#adult-underpads-top">
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
        </div>
      </div>
    </footer>
  );
}

function AdultUnderpadsPage({ ui }) {
  return (
    <div className="adult-underpads-page" id="adult-underpads-top">
      <div className="container adult-underpads-shell">
        <a className="detail-back" href="/#customization">
          Back to Products
          <ArrowUpRight size={16} />
        </a>

        <section className="adult-underpads-hero" aria-labelledby="adult-underpads-title">
          <div className="adult-underpads-hero-media">
            <OptimizedImage
              src={adultUnderpadProduct.detailImage}
              alt={adultUnderpadProduct.detailImageAlt}
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <div className="adult-underpads-hero-copy">
            <p className="section-kicker">OEM / ODM</p>
            <h1 id="adult-underpads-title">Premium Adult Disposable Underpads</h1>
            <p className="adult-underpads-subtitle">Premium Protection for Healthcare &amp; Home Care</p>
            <p>
              Designed for hospitals, nursing homes, distributors, and private label brands. Manufactured with absorbent material planning, leak protection, and buyer-ready packaging support for global B2B programs.
            </p>
            <div className="adult-underpads-actions">
              <a className="detail-cta" href="/request-product-plan?product=adult-underpads">
                Request OEM Quote
                <ArrowUpRight size={18} />
              </a>
              <a className="adult-underpads-secondary-cta" href="/request-product-plan?product=adult-underpads&request=catalogue">
                Download Catalogue
                <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="adult-underpads-inline-links" aria-label="Product resources">
              <a href="/#customization">OEM / ODM service</a>
              <a href="/products/disposable-pet-pads">Pet pad range</a>
              <a href="/#contact">Contact factory</a>
            </div>
          </div>
        </section>

        <section className="adult-underpads-section" aria-labelledby="adult-underpads-features-title">
          <div className="adult-underpads-section-heading">
            <p className="section-kicker">Product Platform</p>
            <h2 id="adult-underpads-features-title">Protection planned for real care environments.</h2>
          </div>
          <div className="adult-underpads-feature-grid">
            {adultUnderpadFeatures.map(([Icon, title, text]) => (
              <article key={title} className="adult-underpads-feature-card">
                <span className="adult-underpads-icon"><Icon size={22} strokeWidth={1.8} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="adult-underpads-advantages" aria-labelledby="adult-underpads-advantages-title">
          <div className="adult-underpads-advantages-media">
            <OptimizedImage
              src={adultUnderpadProduct.detailImage}
              alt={adultUnderpadProduct.detailImageAlt}
            />
          </div>
          <div className="adult-underpads-advantages-copy">
            <p className="section-kicker">Product Advantages</p>
            <h2 id="adult-underpads-advantages-title">Why Choose Our Underpads</h2>
            <ul>
              {adultUnderpadAdvantages.map((advantage) => <li key={advantage}>{advantage}</li>)}
            </ul>
            <a className="text-link" href="/#advantages">Explore factory advantages <ArrowUpRight size={16} /></a>
          </div>
        </section>

        <section className="adult-underpads-section" aria-labelledby="adult-underpads-spec-title">
          <div className="adult-underpads-section-heading">
            <p className="section-kicker">Specification Framework</p>
            <h2 id="adult-underpads-spec-title">A clear starting point for your product brief.</h2>
          </div>
          <div className="adult-underpads-spec-table" role="table" aria-label="Adult disposable underpad specifications">
            {[
              ['Material', 'Non-woven + Tissue + SAP + PE Film'],
              ['Absorbency', 'High'],
              ['Size', 'Customizable'],
              ['Color', 'White / Blue'],
              ['Packing', 'OEM'],
              ['Surface', 'Diamond Embossed'],
              ['MOQ', 'Negotiable'],
              ['Application', 'Hospital / Clinic / Nursing Home / Home Care'],
            ].map(([label, value]) => (
              <div key={label} className="adult-underpads-spec-row" role="row">
                <strong role="cell">{label}</strong>
                <span role="cell">{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="adult-underpads-section" aria-labelledby="adult-underpads-custom-title">
          <div className="adult-underpads-section-heading">
            <p className="section-kicker">OEM / ODM Development</p>
            <h2 id="adult-underpads-custom-title">Build the specification your market needs.</h2>
          </div>
          <div className="adult-underpads-custom-grid">
            {adultUnderpadCustomization.map(([title, text], index) => (
              <article key={title} className="adult-underpads-custom-card">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="adult-underpads-section" aria-labelledby="adult-underpads-applications-title">
          <div className="adult-underpads-section-heading">
            <p className="section-kicker">Industry Applications</p>
            <h2 id="adult-underpads-applications-title">One platform, multiple care channels.</h2>
          </div>
          <div className="adult-underpads-application-grid">
            {adultUnderpadApplications.map(([title, text]) => (
              <article key={title} className="adult-underpads-application-card">
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="adult-underpads-certification" aria-labelledby="adult-underpads-certification-title">
          <div>
            <p className="section-kicker">Compliance &amp; Supply</p>
            <h2 id="adult-underpads-certification-title">Documentation aligned to your market.</h2>
          </div>
          <div className="adult-underpads-certification-list" aria-label="Certification and service capabilities">
            {['ISO', 'CE', 'FDA', 'BSCI', 'OEM Factory', 'Private Label Service'].map((item) => <span key={item}>{item}</span>)}
          </div>
        </section>

        <section className="adult-underpads-section adult-underpads-faq-section" aria-labelledby="adult-underpads-faq-title">
          <div className="adult-underpads-section-heading">
            <p className="section-kicker">Buyer FAQ</p>
            <h2 id="adult-underpads-faq-title">Questions buyers ask before sampling.</h2>
          </div>
          <div className="adult-underpads-faq-list">
            {adultUnderpadFaqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}<span aria-hidden="true">+</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="adult-underpads-final-cta" aria-labelledby="adult-underpads-cta-title">
          <p className="section-kicker">OEM / ODM Partnership</p>
          <h2 id="adult-underpads-cta-title">Looking for a Reliable OEM Underpad Manufacturer?</h2>
          <p>Our engineering team helps brands build premium healthcare products for global markets.</p>
          <div className="adult-underpads-actions">
            <a className="detail-cta" href="/#contact">Contact Sales <ArrowUpRight size={18} /></a>
            <a className="adult-underpads-secondary-cta" href="/request-product-plan?product=adult-underpads&request=sample">Request Sample <ArrowUpRight size={18} /></a>
          </div>
        </section>
      </div>
      <SiteFooter ui={ui} />
    </div>
  );
}

function NewsPage() {
  const featuredArticle = newsArticles[0];

  return (
    <section className="news-page">
      <div className="container news-shell">
        <div className="news-hero">
          <p className="section-kicker">News & Ideas</p>
          <h1>
            Factory ideas for
            <br />
            <em className="title-key">better pet care products</em>.
          </h1>
          <p>
            Short updates on OEM/ODM product thinking, factory capability, packaging direction, and brand-ready pet care ideas.
          </p>
        </div>

        <a className="news-feature" href={`/pages/news/${featuredArticle.slug}`}>
          <OptimizedImage src={featuredArticle.image} alt={`${featuredArticle.title} article image`} />
          <div>
            <span>{featuredArticle.category}</span>
            <h2>{featuredArticle.title}</h2>
            <p>{featuredArticle.excerpt}</p>
            <small>
              Read article
              <ArrowUpRight size={16} />
            </small>
          </div>
        </a>

        <div className="news-grid">
          {newsArticles.map((article) => (
            <a className="news-card" href={`/pages/news/${article.slug}`} key={article.slug}>
              <OptimizedImage src={article.image} alt={`${article.title} article image`} />
              <div>
                <span>{article.category}</span>
                <small>{article.date}</small>
              </div>
              <h2>{article.title}</h2>
              <p>{article.excerpt}</p>
              <strong>
                Know more...
                <ArrowUpRight size={16} />
              </strong>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsArticlePage({ article }) {
  const relatedArticles = newsArticles.filter((item) => item.slug !== article.slug);

  return (
    <section className="news-article-page">
      <div className="container news-article-shell">
        <a className="detail-back" href="/pages/news">
          Back to News
          <ArrowUpRight size={16} />
        </a>
        <div className="news-article-hero">
          <div>
            <p className="section-kicker">{article.category}</p>
            <h1>{article.title}</h1>
            <p>{article.excerpt}</p>
          </div>
          <OptimizedImage src={article.image} alt={`${article.title} article image`} loading="eager" />
        </div>

        <div className="news-article-layout">
          <article className="news-article-body">
            {article.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
          <aside className="news-article-aside">
            <span>{article.date}</span>
            <h2>Key notes</h2>
            <ul>
              {article.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <a href="/request-product-plan?product=news-inquiry">
              Request a product plan
              <ArrowUpRight size={16} />
            </a>
          </aside>
        </div>

        <div className="news-related">
          <p className="section-kicker">More Ideas</p>
          <div>
            {relatedArticles.map((item) => (
              <a className="news-related-card" href={`/pages/news/${item.slug}`} key={item.slug}>
                <span>{item.category}</span>
                <h2>{item.title}</h2>
                <ArrowUpRight size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogPage() {
  const featuredArticle = blogArticles[0];

  return (
    <section className="news-page blog-page">
      <div className="container news-shell">
        <div className="news-hero blog-hero">
          <p className="section-kicker">JCZCARE Blog</p>
          <h1>
            Practical insights for
            <br />
            <em className="title-key">OEM pet pad buyers</em>.
          </h1>
          <p>
            Practical insights for pet product brands, importers and distributors sourcing OEM and private label pet pads.
          </p>
        </div>

        <nav className="blog-cluster-directory" aria-label="Blog topic clusters">
          <div>
            <p className="section-kicker">15 Buyer Knowledge Hubs</p>
            <h2>Explore by sourcing decision</h2>
          </div>
          <div className="blog-cluster-links">
            {topicClusters.map((cluster) => (
              <a href={cluster.path} key={cluster.slug}>
                <span>{cluster.title}</span>
                <small>{getBlogArticlesByCluster(cluster.slug).length} related guides</small>
                <ArrowUpRight size={16} />
              </a>
            ))}
          </div>
        </nav>

        <a className="news-feature blog-feature" href={`/blog/${featuredArticle.slug}`}>
          <OptimizedImage src={featuredArticle.image} alt={featuredArticle.imageAlt} />
          <div>
            <span>{featuredArticle.category}</span>
            <h2>{featuredArticle.title}</h2>
            <p>{featuredArticle.intro}</p>
            <small>
              {featuredArticle.publishedAt} · {getBlogReadTime(featuredArticle)} min read
              <ArrowUpRight size={16} />
            </small>
          </div>
        </a>

        <div className="news-grid blog-grid">
          {blogArticles.map((article) => (
            <a className="news-card blog-card" href={`/blog/${article.slug}`} key={article.slug}>
              <OptimizedImage src={article.image} alt={article.imageAlt} />
              <div>
                <span>{article.category}</span>
                <small>{article.publishedAt} · {getBlogReadTime(article)} min read</small>
              </div>
              <h2>{article.title}</h2>
              <p>{article.intro}</p>
              <strong>
                Read article
                <ArrowUpRight size={16} />
              </strong>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogArticlePage({ article }) {
  const relatedArticles = getRelatedBlogArticles(article.slug);
  const relatedProducts = getRelatedProductsForArticle(article)
    .map((path) => customProducts.find((product) => `/products/${product.slug}` === path))
    .filter(Boolean);

  return (
    <section className="news-article-page blog-article-page">
      <div className="container news-article-shell">
        <nav className="authority-breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a><span>/</span>
          <a href="/blog">Blog</a><span>/</span>
          <a href={article.clusterPath}>{article.clusterTitle}</a><span>/</span>
          <span aria-current="page">{article.title}</span>
        </nav>
        <div className="news-article-hero blog-article-hero">
          <div>
            <p className="section-kicker">{article.category}</p>
            <h1>{article.title}</h1>
            <p>{article.intro}</p>
            <div className="blog-meta">
              <span>{article.author}</span>
              <span>{article.publishedAt}</span>
              <span>Updated {article.updatedAt}</span>
              <span>Primary keyword: {article.primaryKeyword}</span>
            </div>
          </div>
          <OptimizedImage src={article.image} alt={article.imageAlt} loading="eager" />
        </div>

        <div className="news-article-layout">
          <article className="news-article-body blog-article-body">
            <div className="blog-intro">
              <p>{article.coreAngle}</p>
              <div className="blog-inline-links" aria-label="Related internal links">
                <a href="/">JCZCARE homepage</a>
                <a href={article.clusterPath}>{article.clusterTitle} pillar guide</a>
                <a href="/customization">OEM/ODM customization</a>
                <a href="/factory">Factory resources</a>
                <a href="/products/disposable-pet-pads">Disposable pet pads</a>
                <a href="/advantages">Factory advantages</a>
                <a href="/contact">Contact the factory</a>
              </div>
            </div>

            <nav className="blog-toc" aria-label="Article table of contents">
              <h2>Table of contents</h2>
              <ol>
                {article.toc.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </nav>

            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.h3 && <h3>{section.h3}</h3>}
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.comparisonRows && (
                  <div className="adult-underpads-spec-table" role="table" aria-label={`${section.heading} comparison`}>
                    {section.comparisonRows.map(([label, optionA, optionB, implication]) => (
                      <div role="row" key={`${label}-${optionA}`}>
                        <strong role="cell">{label}</strong>
                        <span role="cell">{optionA}</span>
                        <span role="cell">{optionB}</span>
                        <span role="cell">{implication}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}

            <section className="blog-checklist">
              <h2>Buyer Checklist</h2>
              <ul>
                {article.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="blog-faq">
              <h2>FAQ</h2>
              {article.faqs.map(([question, answer]) => (
                <div key={question}>
                  <h3>{question}</h3>
                  <p>{answer}</p>
                </div>
              ))}
            </section>

            <section className="blog-cta">
              <h2>{article.cta.title}</h2>
              <p>{article.cta.text}</p>
              <div>
                {article.cta.links.map((link) => (
                  <a key={link.href} href={link.href}>
                    {link.label}
                    <ArrowUpRight size={16} />
                  </a>
                ))}
              </div>
            </section>
          </article>

          <aside className="news-article-aside blog-article-aside">
            <span>{article.category}</span>
            <h2>Article focus</h2>
            <ul>
              <li>Primary keyword: {article.primaryKeyword}</li>
              {article.secondaryKeywords.map((keyword) => (
                <li key={keyword}>{keyword}</li>
              ))}
            </ul>
            <a href="/request-product-plan?product=blog-inquiry">
              Submit an inquiry
              <ArrowUpRight size={16} />
            </a>
          </aside>
        </div>

        <div className="news-related">
          <p className="section-kicker">Related Articles</p>
          <div>
            {relatedArticles.map((item) => (
              <a className="news-related-card" href={`/blog/${item.slug}`} key={item.slug}>
                <span>{item.category}</span>
                <h2>{item.title}</h2>
                <ArrowUpRight size={16} />
              </a>
            ))}
          </div>
        </div>

        <section className="blog-related-products" aria-labelledby="article-related-products">
          <div>
            <p className="section-kicker">Related Products</p>
            <h2 id="article-related-products">Move from research to a product brief.</h2>
          </div>
          <div>
            {relatedProducts.map((product) => (
              <a href={`/products/${product.slug}`} key={product.slug}>
                <OptimizedImage src={product.image} alt={`${product.title} related OEM product`} />
                <span>{product.category}</span>
                <strong>{product.title}</strong>
                <ArrowUpRight size={18} />
              </a>
            ))}
            <a className="blog-expert-card" href="/request-product-plan?product=blog-consultation">
              <span>Contact an Expert</span>
              <strong>Discuss specification, MOQ, samples, and lead time.</strong>
              <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
      </div>
    </section>
  );
}

function AuthorityPage({ page }) {
  const pageProducts = (page.products || [])
    .map((path) => customProducts.find((product) => `/products/${product.slug}` === path))
    .filter(Boolean);

  return (
    <section className={`authority-page authority-${page.kind}`}>
      <div className="container authority-shell">
        <nav className="authority-breadcrumbs" aria-label="Breadcrumb">
          {page.breadcrumbs.map(([label, href], index) => (
            <React.Fragment key={`${href}-${label}`}>
              {index > 0 && <span>/</span>}
              {index === page.breadcrumbs.length - 1
                ? <span aria-current="page">{label}</span>
                : <a href={href}>{label}</a>}
            </React.Fragment>
          ))}
        </nav>

        <header className="authority-hero">
          <div>
            <p className="section-kicker">{page.kicker}</p>
            <h1>{page.h1}</h1>
            <p>{page.intro}</p>
            <div className="authority-hero-actions">
              <a href={page.downloadPath || '/request-product-plan?product=oem-consultation'}>
                {page.downloadPath ? 'Request Download' : 'Request OEM Consultation'} <ArrowUpRight size={17} />
              </a>
              <a href="/contact">Contact Sales <ArrowUpRight size={17} /></a>
            </div>
          </div>
          <OptimizedImage src={page.image} alt={page.imageAlt} loading="eager" fetchPriority="high" />
        </header>

        {(page.kind === 'pillar' || page.kind === 'factory-detail') && (
          <div className="authority-summary-bar">
            <span><strong>{page.articles.length}</strong> related buyer guides</span>
            <span><strong>{page.sections.length}</strong> process chapters</span>
            <span><strong>{page.faqs.length}</strong> buyer FAQs</span>
            <span>Updated {page.updatedAt}</span>
          </div>
        )}

        {page.cards?.length > 0 && (
          <section className="authority-card-section">
            <p className="section-kicker">Explore Resources</p>
            <div className="authority-card-grid">
              {page.cards.map(([label, href], index) => (
                <a href={href} key={`${href}-${label}`}>
                  <small>{String(index + 1).padStart(2, '0')}</small>
                  <strong>{label}</strong>
                  <ArrowUpRight size={18} />
                </a>
              ))}
            </div>
          </section>
        )}

        {page.timeline?.length > 0 && (
          <section className="factory-timeline-section" aria-labelledby="factory-timeline-title">
            <div className="factory-section-heading">
              <p className="section-kicker">Controlled Workflow</p>
              <h2 id="factory-timeline-title">How the process moves from requirement to evidence.</h2>
            </div>
            <div className="factory-timeline">
              {page.timeline.map(([number, title, text]) => (
                <article key={`${number}-${title}`}>
                  <span>{number}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {page.specifications?.length > 0 && (
          <section className="factory-specifications" aria-labelledby="factory-specifications-title">
            <div className="factory-section-heading">
              <p className="section-kicker">Buyer Specifications</p>
              <h2 id="factory-specifications-title">The information to define, verify, and retain.</h2>
            </div>
            <div className="factory-specification-table" role="table" aria-label={`${page.title} buyer specifications`}>
              {page.specifications.map(([label, value]) => (
                <div role="row" key={label}>
                  <strong role="rowheader">{label}</strong>
                  <span role="cell">{value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {page.sections?.length > 0 && (
          <div className="authority-content-layout">
            <nav className="authority-toc" aria-label="Pillar page contents">
              <p>On this page</p>
              {page.sections.map((section, index) => (
                <a href={`#pillar-section-${index + 1}`} key={section.heading}>
                  <span>{String(index + 1).padStart(2, '0')}</span>{section.heading}
                </a>
              ))}
              {page.articles?.length > 0 && <a href="#related-cluster-articles"><span>→</span>All related guides</a>}
            </nav>

            <article className="authority-content">
              {page.sections.map((section, index) => (
                <section id={`pillar-section-${index + 1}`} key={section.heading}>
                  <span className="authority-chapter">{String(index + 1).padStart(2, '0')}</span>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.comparisonRows && (
                    <div className="authority-table-wrap">
                      <div className="authority-table" role="table" aria-label={`${section.heading} comparison table`}>
                        {section.comparisonRows.map((row, rowIndex) => (
                          <div role="row" className={rowIndex === 0 ? 'authority-table-head' : ''} key={row.join('-')}>
                            {row.map((cell) => <span role={rowIndex === 0 ? 'columnheader' : 'cell'} key={cell}>{cell}</span>)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              ))}
            </article>
          </div>
        )}

        {page.articles?.length > 0 && (
          <section className="authority-article-library" id="related-cluster-articles">
            <div>
              <p className="section-kicker">{page.kind === 'factory-detail' ? 'Factory Knowledge Library' : 'Topic Cluster Library'}</p>
              <h2>{page.kind === 'factory-detail' ? 'Continue with related technical and procurement guides.' : 'Every related buyer article, connected to this guide.'}</h2>
              <p>Use the focused articles below for deeper specification, quality, cost, packaging, and sourcing decisions.</p>
            </div>
            <div className="authority-article-grid">
              {page.articles.map((article) => (
                <a href={article.path} key={article.slug}>
                  <span>{article.category}</span>
                  <h3>{article.title}</h3>
                  <small>{getBlogReadTime(article)} min read</small>
                  <ArrowUpRight size={17} />
                </a>
              ))}
            </div>
          </section>
        )}

        {page.gallery?.length > 0 && (
          <section className="authority-gallery">
            {page.gallery.map(([src, caption]) => (
              <figure key={src}>
                <OptimizedImage src={src} alt={caption} />
                <figcaption>{caption}</figcaption>
              </figure>
            ))}
          </section>
        )}

        {(page.groups?.length > 0 || page.faqs?.length > 0) && (
          <section className="authority-faq">
            <div>
              <p className="section-kicker">Buyer FAQ</p>
              <h2>Answers grounded in controlled B2B sourcing.</h2>
            </div>
            {(page.groups || [{ title: page.title, path: page.path, faqs: page.faqs }]).map((group) => (
              <div className="authority-faq-group" key={group.title}>
                {page.groups && <h3><a href={group.path}>{group.title}</a></h3>}
                {group.faqs.map(([question, answer]) => (
                  <details key={`${group.title}-${question}`}>
                    <summary>{question}<span aria-hidden="true">+</span></summary>
                    <p>{answer}</p>
                  </details>
                ))}
              </div>
            ))}
          </section>
        )}

        {page.references?.length > 0 && (
          <section className="authority-references">
            <p className="section-kicker">Authoritative References</p>
            <div>
              {page.references.map((reference) => (
                <a href={reference.url} target="_blank" rel="noopener noreferrer" key={reference.url}>
                  <strong>{reference.label}</strong>
                  <span>{reference.note}</span>
                  <ArrowUpRight size={17} />
                </a>
              ))}
            </div>
          </section>
        )}

        {pageProducts.length > 0 && (
          <section className="authority-products">
            <div>
              <p className="section-kicker">Related Products</p>
              <h2>Apply the framework to a live OEM brief.</h2>
            </div>
            <div>
              {pageProducts.map((product) => (
                <a href={`/products/${product.slug}`} key={product.slug}>
                  <OptimizedImage src={product.image} alt={`${product.title} related to ${page.title}`} />
                  <span>{product.category}</span>
                  <strong>{product.title}</strong>
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="authority-final-cta">
          <p className="section-kicker">Start a Controlled Project</p>
          <h2>Turn this buyer knowledge into a clear OEM specification.</h2>
          <p>Share your market, product benchmark, target performance, quantity, packaging, and delivery destination.</p>
          <div>
            <a href="/request-product-plan?product=oem-consultation">Request a Product Plan <ArrowUpRight size={18} /></a>
            <a href="/contact">Contact JCZCARE <ArrowUpRight size={18} /></a>
          </div>
        </section>
      </div>
    </section>
  );
}

function BusinessSeoPage({ page }) {
  const clusterLinks = businessSeoPages
    .filter((item) => item.path !== page.path)
    .slice(0, 6);

  return (
    <section className="business-seo-page">
      <div className="container business-seo-shell">
        <div className="business-seo-hero">
          <div>
            <p className="section-kicker">{page.kicker}</p>
            <h1>{page.h1}</h1>
            <p>{page.intro}</p>
            <div className="business-seo-actions">
              <a href="/request-product-plan?product=oem-pet-pad-project">
                Request OEM plan
                <ArrowUpRight size={18} />
              </a>
              <a href={whatsappChatUrl} target="_blank" rel="noopener noreferrer" aria-label="Start WhatsApp Chat">
                Talk by WhatsApp
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
          <OptimizedImage src={page.image} alt={`${page.kicker} by Nantong JINCHENG ZENCARE`} loading="eager" />
        </div>

        <div className="business-seo-grid">
          {page.sections.map(([title, text]) => (
            <article key={title}>
              <span>{title}</span>
              <p>{text}</p>
            </article>
          ))}
        </div>

        {page.articleLinks && (
          <div className="business-seo-featured">
            <p className="section-kicker">Latest Factory Ideas</p>
            <div>
              {newsArticles.map((article) => (
                <a href={`/pages/news/${article.slug}`} key={article.slug}>
                  <OptimizedImage src={article.image} alt={`${article.title} related content image`} />
                  <span>{article.category}</span>
                  <h2>{article.title}</h2>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="business-seo-faq">
          <div>
            <p className="section-kicker">Buyer FAQ</p>
            <h2>Clear answers for OEM/ODM decision makers.</h2>
          </div>
          <div className="affiliate-faq-list">
            {page.faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="business-seo-links">
          <p className="section-kicker">Related OEM Resources</p>
          <div>
            {clusterLinks.map((item) => (
              <a href={item.path} key={item.path}>
                {item.kicker}
                <ArrowUpRight size={16} />
              </a>
            ))}
            <a href="/pages/news">
              News & Ideas
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function InquiryForm({ className = '', product = '', source = 'website-contact', rows = 4, buttonLabel = 'Send Inquiry' }) {
  const [formState, setFormState] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    country: '',
    product,
    quantity: '',
    message: '',
    website: '',
  });
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' });
  const lastSubmitAtRef = useRef(0);
  const conversionTrackedRef = useRef(false);

  useEffect(() => {
    setFormState((state) => ({ ...state, product }));
  }, [product]);
  useEffect(() => {
    if (submitState.status !== 'success') {
      conversionTrackedRef.current = false;
      return;
    }

    if (!conversionTrackedRef.current) {
      conversionTrackedRef.current = true;
      trackGoogleAdsLeadConversion();
    }
  }, [submitState.status]);

  const updateField = (field) => (event) => {
    setFormState((state) => ({ ...state, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...formState,
      name: formState.name.trim(),
      companyName: formState.companyName.trim(),
      email: formState.email.trim(),
      phone: formState.phone.trim(),
      country: formState.country.trim(),
      product: formState.product.trim(),
      quantity: formState.quantity.trim(),
      message: formState.message.trim(),
      website: formState.website.trim(),
      source,
      pageUrl: window.location.href,
    };

    const now = Date.now();

    if (submitState.status === 'loading' || now - lastSubmitAtRef.current < 2000) {
      return;
    }

    lastSubmitAtRef.current = now;

    if (!payload.name) {
      setSubmitState({ status: 'error', message: 'Please enter your name.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      setSubmitState({ status: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    if (!payload.message) {
      setSubmitState({ status: 'error', message: 'Please enter your product requirement.' });
      return;
    }

    setSubmitState({ status: 'loading', message: 'Sending your inquiry...' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Sorry, your inquiry could not be sent.');
      }

      setFormState({
        name: '',
        companyName: '',
        email: '',
        phone: '',
        country: '',
        product,
        quantity: '',
        message: '',
        website: '',
      });
      setSubmitState({
        status: 'success',
        message: data.message || 'Thank you. Your inquiry has been sent successfully. We will contact you shortly.',
      });
    } catch (error) {
      setSubmitState({
        status: 'error',
        message: error.message || 'Sorry, your inquiry could not be sent. Please try again or email us directly at hengtuo@nthengtuo.com.',
      });
    }
  };

  const isLoading = submitState.status === 'loading';

  return (
    <form className={`contact-form ${className}`.trim()} aria-label="OEM inquiry form" onSubmit={handleSubmit}>
      <label className="form-honeypot" aria-hidden="true">
        <span>Website</span>
        <input
          type="text"
          name="website"
          tabIndex="-1"
          autoComplete="off"
          value={formState.website}
          onChange={updateField('website')}
        />
      </label>
      <label>
        <span>Name</span>
        <input type="text" name="name" required maxLength="100" autoComplete="name" value={formState.name} onChange={updateField('name')} />
      </label>
      <label>
        <span>Company Name</span>
        <input type="text" name="companyName" maxLength="200" autoComplete="organization" value={formState.companyName} onChange={updateField('companyName')} />
      </label>
      <label>
        <span>Email</span>
        <input type="email" name="email" required maxLength="200" autoComplete="email" value={formState.email} onChange={updateField('email')} />
      </label>
      <label>
        <span>Phone / WhatsApp</span>
        <input type="text" name="phone" maxLength="100" autoComplete="tel" value={formState.phone} onChange={updateField('phone')} />
      </label>
      <label>
        <span>Country</span>
        <input type="text" name="country" maxLength="100" autoComplete="country-name" value={formState.country} onChange={updateField('country')} />
      </label>
      <label>
        <span>Product</span>
        <input type="text" name="product" maxLength="200" value={formState.product} onChange={updateField('product')} />
      </label>
      <label>
        <span>Estimated Quantity</span>
        <input type="text" name="quantity" maxLength="100" value={formState.quantity} onChange={updateField('quantity')} />
      </label>
      <label>
        <span>Product Requirement</span>
        <textarea name="message" rows={rows} required maxLength="5000" value={formState.message} onChange={updateField('message')} />
      </label>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending...' : buttonLabel}
        <ArrowUpRight size={18} />
      </button>
      {submitState.message && (
        <p className={`form-message ${submitState.status}`}>
          {submitState.message.includes(contactEmail) ? (
            <>
              Sorry, your inquiry could not be sent. Please try again or email us directly at{' '}
              <a href={buildMailto('Website Inquiry')}>{contactEmail}</a>.
            </>
          ) : (
            submitState.message
          )}
        </p>
      )}
    </form>
  );
}

function ProductPlanInquiry() {
  const productParam = new URLSearchParams(window.location.search).get('product') || '';

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
        <InquiryForm
          className="inquiry-form"
          product={productParam}
          source="product-plan-request"
          rows={5}
        />
      </div>
    </section>
  );
}

function SignInPage() {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });
  const [submitState, setSubmitState] = useState({
    status: 'idle',
    message: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitState({ status: 'loading', message: 'Submitting account record...' });

    try {
      const response = await fetch('/api/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formState.email,
          password: formState.password,
          method: 'email-password',
          source: window.location.pathname,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Unable to submit this account record.');
      }

      setFormState({ email: '', password: '' });
      setSubmitState({
        status: 'success',
        message: data.message || 'Account submitted. Our business team will review the registration.',
      });
    } catch (error) {
      setSubmitState({
        status: 'error',
        message: error.message || 'Submission failed. Please try again later.',
      });
    }
  };

  return (
    <section className="signin-page">
      <div className="signin-silk" aria-hidden="true">
        <SilkBoundary>
          <React.Suspense fallback={<div className="inquiry-silk-fallback" />}>
            <Silk
              speed={2.6}
              scale={1.12}
              color="#102217"
              noiseIntensity={1.05}
              rotation={-0.28}
            />
          </React.Suspense>
        </SilkBoundary>
      </div>
      <div className="container signin-shell">
        <div className="signin-copy">
          <p className="section-kicker">Business Account</p>
          <h1>
            Sign in to
            <br />
            <em className="title-key">JINCHENG ZENCARE</em>.
          </h1>
          <p>
            Access your business account for OEM/ODM project communication, sample follow-up, and product plan records.
          </p>
        </div>

        <div className="signin-card">
          <div className="signin-card-head">
            <span>Account Login</span>
            <h2>Enter your business account details.</h2>
          </div>

          <form className="contact-form signin-form" aria-label="Business account sign in form" onSubmit={handleSubmit}>
            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={formState.email}
                onChange={(event) => setFormState((state) => ({ ...state, email: event.target.value }))}
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                minLength="8"
                value={formState.password}
                onChange={(event) => setFormState((state) => ({ ...state, password: event.target.value }))}
              />
            </label>
            <button type="submit" disabled={submitState.status === 'loading'}>
              {submitState.status === 'loading' ? 'Submitting...' : 'Sign In'}
              <ArrowUpRight size={18} />
            </button>
            {submitState.message && (
              <p className={`signin-message ${submitState.status}`}>
                {submitState.message}
              </p>
            )}
          </form>

          <div className="signin-providers">
            <a href={buildMailto('Business account access request')}>
              Email Support
              <Mail size={16} />
            </a>
          </div>

          <p className="signin-note">
            Passwords are processed securely and are not stored in plain text. Business account records can be synchronized with JCZ Business Center through the backend API.
          </p>
        </div>
      </div>
    </section>
  );
}

function AboutPage() {
  const aboutHighlights = [
    ['Company', 'Nantong JINCHENG ZENCARE Technology Company is a pet care absorbent product source factory serving OEM, ODM, and private-label programs.'],
    ['Services', 'Pet pads, pet diapers, dog poop bags, adult nursing pads, glove wipes, structure design, packaging development, sampling, and export support.'],
    ['Team', 'R&D, production, quality inspection, merchandising, packaging, and delivery teams work as one project flow.'],
    ['Results', '20 years in the industry, 12,000 sq.m factory area, 8 automated lines, and annual capacity of up to 300M pcs, subject to product specifications and production schedule.'],
  ];

  return (
    <section className="about-page">
      <div className="container about-page-shell">
        <div className="about-page-hero">
          <p className="section-kicker">About JINCHENG ZENCARE</p>
          <h1>
            Built for
            <br />
            <em className="title-key">pet pad OEM/ODM supply projects</em>.
          </h1>
          <p>
            We help brands, cross-border sellers, and channel partners build absorbent pet care product lines with manufacturing support and practical customization.
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
          <a href={whatsappChatUrl} target="_blank" rel="noopener noreferrer" aria-label="Start WhatsApp Chat">
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
    ['300M pcs', 'Annual Capacity'],
  ];
  const investorUpdates = [
    ['Capacity Upgrade', 'Automated pet pad production supports long-term OEM/ODM project planning.'],
    ['Quality System', 'Batch inspection covers materials, process, performance, and shipment review.'],
    ['Custom Program', 'Private-label projects can include structure, absorbency, packaging, and market-ready specifications.'],
  ];

  return (
    <section className="investor-page">
      <div className="investor-hero">
        <OptimizedImage src="/images/contact-pets-grass-centered.png" alt="Pet care brand partnership scene" loading="eager" />
        <div className="investor-hero-overlay" />
        <div className="container investor-hero-content">
          <p className="section-kicker">Investor Relations</p>
          <h1>
            Corporate strength
            <br />
            behind <em className="title-key">pet care supply</em>.
          </h1>
          <p>
            A source factory focused on pet absorbent products, OEM/ODM customization, and delivery coordination for global business partners.
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
            We specialize in R&D, manufacturing, and sales of pet pads, pet diapers, dog poop bags, glove wipes, and related absorbent care products. Our operating model combines production capacity planning, practical product development, and flexible private-label support.
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
    'Introduce pet care products to your market with source-factory support.',
    'Access OEM/ODM customization across absorbency, size, packing, and private label.',
    'Work with capacity planning, sample support, and export-ready coordination.',
    'Build long-term channel value with practical product development and quality control.',
  ];
  const faqs = [
    ['Who can join?', 'Distributors, sourcing agents, channel partners, retailers, and pet care project operators.'],
    ['What products are available?', 'Pet pads, pet diapers, dog poop bags, glove wipes, pet waste bags, and customized absorbent products.'],
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
            For distributors, sourcing partners, and channel teams looking for OEM/ODM supply support.
          </p>
        </div>

        <div className="affiliates-feature">
          <div className="affiliates-image">
            <OptimizedImage src="/images/generated-site/packaging/private-label-packaging-02.webp" alt="Custom pet care product program preview" />
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
            <a href={whatsappChatUrl} target="_blank" rel="noopener noreferrer" aria-label="Start WhatsApp Chat">
              Chat Now
              <MessageCircle size={18} />
            </a>
          </div>
        <div className="help-quick-contact">
          <a href={whatsappChatUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat with our OEM specialist on WhatsApp"><MessageCircle className="whatsapp-icon" size={18} /> {whatsappPhone}</a>
            <a href={buildMailto('Website Inquiry', quotationEmailBody)} aria-label={`Email ${contactEmail}`}><Mail size={18} /> {contactEmail}</a>
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
      image: '/images/generated-site/products/products-pet-pad-structure-01.webp',
      tag: 'Absorbency Guide',
    },
    {
      title: 'What brands should confirm before private-label packaging',
      image: '/images/generated-site/packaging/private-label-packaging-01.webp',
      tag: 'Packaging',
    },
    {
      title: 'Inside batch inspection for pet pad delivery management',
      image: '/images/generated-site/quality-control/factory-quality-control-01.webp',
      tag: 'Quality',
    },
  ];
  const learnSections = [
    {
      title: 'Product Structure',
      image: '/images/generated-site/products/products-pet-pad-macro-01.webp',
      articles: ['Layer design for fast lock-in', 'SAP core and pulp balance', 'Leakproof film selection'],
    },
    {
      title: 'Custom Development',
      image: '/images/generated-site/products/products-disposable-pads-01.webp',
      articles: ['Size, weight, and embossing options', 'Channel-ready product planning', 'Sample review checklist'],
    },
    {
      title: 'Factory & Supply',
      image: '/images/generated-site/factory/factory-production-line-01.webp',
      articles: ['Automated production stability', 'Packing and shipment workflow', 'How OEM orders move through factory'],
    },
    {
      title: 'Market Applications',
      image: '/images/generated-site/products/products-adhesive-pads-01.webp',
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
          <OptimizedImage src="/images/generated-site/contact/contact-business-office-01.webp" alt="Pet care product learning center visual" loading="eager" />
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
              <OptimizedImage src={article.image} alt={`${article.title} learning article image`} />
              <span>{article.tag}</span>
              <h2>{article.title}</h2>
            </article>
          ))}
        </div>

        <div className="learn-section-list">
          {learnSections.map((section) => (
            <article key={section.title}>
              <OptimizedImage src={section.image} alt={`${section.title} learning topic image`} />
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
    ['Quality Focus', 'Quality management can help improve product consistency and reduce unnecessary product loss in daily operations.'],
  ];
  const partnerStories = [
    ['Brand Partners', 'Developing fit-for-market pet pad lines with balanced performance and cost.'],
    ['Channel Teams', 'Supporting distributors with delivery coordination, packaging coordination, and sample planning.'],
    ['Pet Care Projects', 'Creating absorbent products for home care, training, travel, and care-bed scenarios.'],
  ];

  return (
    <section className="giveback-page">
      <div className="giveback-hero">
        <OptimizedImage src="/images/contact-pets-grass-centered.png" alt="People and pets in a lively outdoor scene" loading="eager" />
        <div className="giveback-hero-overlay" />
        <div className="container giveback-hero-content">
          <p className="section-kicker">Give Back</p>
          <h1>
            Better pet care,
            <br />
            <em className="title-key">built with responsibility</em>.
          </h1>
          <p>
            We believe source manufacturing should support quality management, practical use, and long-term value for pets, brands, and channel partners.
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
            <a href={whatsappChatUrl} target="_blank" rel="noopener noreferrer" aria-label="Start WhatsApp Chat">Discuss support <ArrowUpRight size={16} /></a>
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
          <h2>Working with customers who care about practical and well-managed products.</h2>
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
    ['Starter Kit', 'Pads, absorbent sheets, and packaging swatches for initial evaluation.'],
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
            <a href={whatsappChatUrl} target="_blank" rel="noopener noreferrer" aria-label="Start WhatsApp Chat">
              Discuss by WhatsApp
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        <div className="gift-card-preview">
          <div className="gift-card-visual">
            <OptimizedImage src="/images/generated-site/products/products-disposable-pads-01.webp" alt="Premium pet pad sample kit for OEM review" />
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
                <OptimizedImage src={product.image} alt={`${product.title} sample kit item`} />
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
  const isAdultUnderpadsPage = currentPath === '/products/adult-underpads';
  const isInquiryPage = currentPath === '/request-product-plan';
  const isSignInPage = currentPath === '/sign-in';
  const isAboutPage = currentPath === '/pages/about';
  const isInvestorPage = currentPath === '/pages/investor-relations';
  const isAffiliatesPage = currentPath === '/pages/affiliates';
  const isHelpPage = currentPath === '/pages/help';
  const isLearnPage = currentPath === '/pages/learn';
  const isGiveBackPage = currentPath === '/pages/give-back';
  const isGiftCardsPage = currentPath === '/pages/gift-cards';
  const newsSlug = currentPath.match(/^\/pages\/news\/([^/]+)\/?$/)?.[1];
  const isNewsPage = currentPath === '/pages/news';
  const blogSlug = currentPath.match(/^\/blog\/([^/]+)\/?$/)?.[1];
  const isBlogPage = currentPath === '/blog';
  const currentAuthorityPage = getAuthorityPage(currentPath);
  const currentSeoPage = seoPageMap.get(currentPath);
  const currentStaticSeo = staticSeoPages[currentPath];
  const currentProduct = productSlug
    ? customProducts.find((product) => product.slug === productSlug)
    : null;
  useEffect(() => {
    ensureGoogleTagReady();
  }, []);
  const currentNewsArticle = newsSlug
    ? newsArticles.find((article) => article.slug === newsSlug)
    : null;
  const currentBlogArticle = blogSlug
    ? blogArticles.find((article) => article.slug === blogSlug)
    : null;

  useEffect(() => {
    document.documentElement.lang = activeRegion.lang;
    document.documentElement.dataset.region = activeRegion.slug;
  }, [activeRegion]);

  useEffect(() => {
    if (currentAuthorityPage) {
      applyPageSeo({
        title: currentAuthorityPage.seoTitle,
        description: currentAuthorityPage.metaDescription,
        path: currentAuthorityPage.path,
        image: currentAuthorityPage.image,
        faqs: currentAuthorityPage.faqs,
        breadcrumbs: currentAuthorityPage.breadcrumbs,
        authorityPage: currentAuthorityPage,
      });
      return;
    }

    if (currentSeoPage) {
      applyPageSeo({
        title: currentSeoPage.title,
        description: currentSeoPage.description,
        path: currentSeoPage.path,
        image: currentSeoPage.image,
        faqs: currentSeoPage.faqs,
      });
      return;
    }

    if (isAdultUnderpadsPage && currentProduct) {
      applyPageSeo({
        title: 'Premium Adult Disposable Underpads OEM Manufacturer | JCZCare',
        description: 'OEM adult disposable underpads manufacturer providing customizable absorbent underpads for hospitals, distributors and private label brands worldwide.',
        path: '/products/adult-underpads',
        image: currentProduct.detailImage,
        product: currentProduct,
        faqs: adultUnderpadFaqs,
      });
      return;
    }

    if (currentProduct) {
      applyPageSeo({
        title: `${currentProduct.title} OEM Manufacturer | JCZCARE`,
        description: `${currentProduct.summary} Custom specifications, private-label packaging, sample development, and B2B factory supply from Nantong JINCHENG ZENCARE.`,
        path: `/products/${currentProduct.slug}`,
        image: currentProduct.image,
        product: currentProduct,
        faqs: [
          [`Can you customize ${currentProduct.title}?`, 'Yes. We support OEM/ODM specifications, private-label packaging, sample review, and B2B production planning.'],
          ['How do I request this product plan?', 'Use the product request form or WhatsApp to share target market, specification, quantity, and packaging direction.'],
        ],
      });
      return;
    }

    if (currentBlogArticle) {
      applyPageSeo({
        title: currentBlogArticle.seoTitle,
        description: currentBlogArticle.metaDescription,
        path: `/blog/${currentBlogArticle.slug}`,
        image: currentBlogArticle.image,
        faqs: currentBlogArticle.faqs,
        article: currentBlogArticle,
        breadcrumbs: [
          ['Home', '/'],
          ['Blog', '/blog'],
          [currentBlogArticle.clusterTitle, currentBlogArticle.clusterPath],
          [currentBlogArticle.title, currentBlogArticle.path],
        ],
      });
      return;
    }

    if (isBlogPage) {
      applyPageSeo({
        title: 'Pet Pad OEM Blog | Factory Insights for Buyers',
        description: 'Practical JCZCARE blog insights for pet product brands, importers and distributors sourcing OEM pet pads and private label puppy pads.',
        path: '/blog',
        image: '/images/generated-site/factory/factory-campus-01.webp',
      });
      return;
    }

    if (currentNewsArticle) {
      applyPageSeo({
        title: `${currentNewsArticle.title} | JCZCARE News`,
        description: currentNewsArticle.excerpt,
        path: `/pages/news/${currentNewsArticle.slug}`,
        image: currentNewsArticle.image,
      });
      return;
    }

    if (isNewsPage) {
      applyPageSeo({
        title: 'News & Ideas | Pet Pad OEM Factory Insights | JCZCARE',
        description: 'Factory ideas and B2B insights about OEM pet pads, private-label packaging, absorbent core development, quality control, and export supply.',
        path: '/pages/news',
        image: '/images/contact-pets-grass-centered.png',
      });
      return;
    }

    if (currentStaticSeo) {
      applyPageSeo({
        title: currentStaticSeo.title,
        description: currentStaticSeo.description,
        path: currentPath,
        image: currentStaticSeo.image,
      });
      return;
    }

    applyPageSeo({
      title: 'Nantong JINCHENG ZENCARE | Pet Pad OEM/ODM Source Factory',
      description: 'Nantong JINCHENG ZENCARE is a pet pad OEM/ODM source factory for pet pads, absorbent care products, private-label packaging, and B2B supply.',
      path: currentPath === '/' ? '/' : currentPath,
      image: heroFallbackImage,
    });
  }, [currentAuthorityPage, currentSeoPage, currentProduct, currentNewsArticle, currentBlogArticle, currentStaticSeo, isNewsPage, isBlogPage, isAdultUnderpadsPage, currentPath]);

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

      if (currentProduct || currentNewsArticle || currentBlogArticle || currentAuthorityPage || currentSeoPage || isInquiryPage || isSignInPage || isAboutPage || isInvestorPage || isAffiliatesPage || isHelpPage || isLearnPage || isGiveBackPage || isGiftCardsPage || isNewsPage || isBlogPage) {
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
          : currentNewsArticle
            ? '.news-article-page .news-article-hero > *, .news-article-page .news-article-body > *, .news-article-page .news-article-aside, .news-article-page .news-related-card'
            : isNewsPage
              ? '.news-page .news-hero > *, .news-page .news-feature, .news-page .news-card'
              : currentAuthorityPage
                ? '.authority-page .authority-hero > *, .authority-page .authority-summary-bar > *, .authority-page .authority-card-grid a'
              : currentSeoPage
                ? '.business-seo-page .business-seo-hero > *, .business-seo-page .business-seo-grid article, .business-seo-page .business-seo-faq > *, .business-seo-page .business-seo-links > *, .business-seo-page .business-seo-featured > *'
          : isInquiryPage
            ? '.inquiry-page .inquiry-copy > *, .inquiry-page .inquiry-form'
            : isSignInPage
              ? '.signin-page .signin-copy > *, .signin-page .signin-card'
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
  }, [currentProduct, currentNewsArticle, currentBlogArticle, currentAuthorityPage, currentSeoPage, isInquiryPage, isSignInPage, isAboutPage, isInvestorPage, isAffiliatesPage, isHelpPage, isLearnPage, isGiveBackPage, isGiftCardsPage, isNewsPage, isBlogPage]);

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
    if (currentProduct || currentNewsArticle || currentBlogArticle || currentAuthorityPage || currentSeoPage || isInquiryPage || isSignInPage || isAboutPage || isInvestorPage || isAffiliatesPage || isHelpPage || isLearnPage || isGiveBackPage || isGiftCardsPage || isNewsPage || isBlogPage) {
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
  }, [currentProduct, currentNewsArticle, currentBlogArticle, currentAuthorityPage, currentSeoPage, isInquiryPage, isSignInPage, isAboutPage, isInvestorPage, isAffiliatesPage, isHelpPage, isLearnPage, isGiveBackPage, isGiftCardsPage, isNewsPage, isBlogPage]);

  if (isInquiryPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <ProductPlanInquiry />
      </main>
    );
  }

  if (isSignInPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <SignInPage />
      </main>
    );
  }

  if (isAboutPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <AboutPage />
      </main>
    );
  }

  if (isInvestorPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <InvestorRelationsPage />
      </main>
    );
  }

  if (isAffiliatesPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <AffiliatesPage />
      </main>
    );
  }

  if (isHelpPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <HelpCenterPage />
      </main>
    );
  }

  if (isLearnPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <LearnCenterPage />
      </main>
    );
  }

  if (isGiveBackPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <GiveBackPage />
      </main>
    );
  }

  if (isGiftCardsPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <GiftCardsPage />
      </main>
    );
  }

  if (isBlogPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <BlogPage />
        <SiteFooter ui={ui} />
      </main>
    );
  }

  if (currentBlogArticle) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <BlogArticlePage article={currentBlogArticle} />
        <SiteFooter ui={ui} />
      </main>
    );
  }

  if (isNewsPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <NewsPage />
      </main>
    );
  }

  if (currentNewsArticle) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <NewsArticlePage article={currentNewsArticle} />
      </main>
    );
  }

  if (isAdultUnderpadsPage && currentProduct) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <AdultUnderpadsPage ui={ui} />
      </main>
    );
  }

  if (currentAuthorityPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <AuthorityPage page={currentAuthorityPage} />
        <SiteFooter ui={ui} />
      </main>
    );
  }

  if (currentSeoPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <BusinessSeoPage page={currentSeoPage} />
      </main>
    );
  }

  if (currentProduct) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <ProductDetail product={currentProduct} />
      </main>
    );
  }

  return (
    <main ref={rootRef}>
      <SiteNav navRef={navRef} ui={ui} />

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
                <a className="hero-action secondary whatsapp-cta" href={whatsappChatUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat with our OEM specialist on WhatsApp">
                  <MessageCircle className="whatsapp-icon" size={18} />
                  <span>
                    <strong>Talk to Our OEM Specialist</strong>
                    <small>Start WhatsApp Chat</small>
                    <small>{whatsappPhone}</small>
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
              <OptimizedImage
                src="/images/factory-campus.jpeg"
                alt="Nantong JINCHENG ZENCARE factory exterior"
                loading="eager"
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
                20 years focused on pet pads, pet diapers, dog poop bags, and adult nursing pads.
              </p>
              <p>
                12,000 sq.m factory, 8 automated lines, 300M pcs annual capacity.
              </p>
              <div className="contact-strip">
                <a className="whatsapp-cta" href={whatsappChatUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat with our OEM specialist on WhatsApp"><MessageCircle className="whatsapp-icon" size={18} /> {whatsappPhone}</a>
                <a href={buildMailto('Website Inquiry', quotationEmailBody)} aria-label={`Email ${contactEmail}`}><Mail size={18} /> {contactEmail}</a>
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
                <OptimizedImage src={item.src} alt={`${item.title} factory production scene`} />
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
            <OptimizedImage
              src="/images/quality-inspection-lab-mask.png"
              alt="Pet pad quality inspection and laboratory testing"
              loading="eager"
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
                Source factory strength for <em className="title-key">OEM/ODM supply support</em>.
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
                  <OptimizedImage src={product.image} alt={`${product.title} customization option`} />
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
              <span><em className="title-key">custom pet products program</em>.</span>
            </h2>
            <p>
              Send your target market, specs, packaging, and order plan. We will prepare the OEM/ODM solution.
            </p>
            <div className="contact-panel">
              <a className="contact-panel-whatsapp" href={whatsappChatUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat with our OEM specialist on WhatsApp">
                <MessageCircle className="whatsapp-icon" size={20} />
                <span>
                  <strong>Talk to Our OEM Specialist</strong>
                  <small>Start WhatsApp Chat</small>
                  <small>{whatsappPhone}</small>
                </span>
              </a>
              <a href={buildMailto('Website Inquiry', quotationEmailBody)} aria-label={`Email ${contactEmail}`}>
                <Mail size={20} />
                <span>{contactEmail}</span>
              </a>
            </div>
          </div>
          <InquiryForm
            product="OEM/ODM pet products"
            source="contact-page"
            rows={4}
            buttonLabel="Send Inquiry"
          />
        </div>
      </section>
      <footer className="site-footer">
        <div className="footer-support">
          <div className="container footer-support-inner">
            <strong>{ui.support}</strong>
            <a className="footer-whatsapp-cta" href={whatsappChatUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat with our OEM specialist on WhatsApp">
              <MessageCircle className="whatsapp-icon" size={20} />
              <span>
                <strong>Talk to Our OEM Specialist</strong>
                <small>Start WhatsApp Chat</small>
                <small>{whatsappPhone}</small>
              </span>
            </a>
            <a href={whatsappChatUrl} target="_blank" rel="noopener noreferrer" aria-label="Start WhatsApp Chat">
              <MessageCircle size={20} />
              Start WhatsApp Chat
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
          </div>
        </div>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);

