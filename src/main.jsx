import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight,
  ArrowUp,
  Check,
  CirclePlay,
  Droplets,
  Factory,
  Facebook,
  FlaskConical,
  Instagram,
  Layers3,
  Languages,
  Mail,
  Menu,
  MessageCircle,
  Microscope,
  Ruler,
  ShieldCheck,
  Truck,
  X,
  Youtube,
} from 'lucide-react';
import './styles.css';
import {
  installContactClickTracking,
  trackB2BEvent,
  trackFormStart,
  trackPageView,
} from './analytics.js';
import { trackGoogleAdsConversion } from './googleAdsConversion.js';
import {
  trackMetaLead,
  trackMetaPageView,
} from './metaPixel.js';
import { captureLeadAttribution, getLeadAttribution } from './leadAttribution.js';
import {
  createInquirySubmissionId,
  INQUIRY_FAILURE_MESSAGE,
  INQUIRY_SUCCESS_MESSAGE,
  submitInquiry,
  validateInquiryFields,
} from './inquirySubmission.js';
import { CustomizationTimeline, ShippingSolution } from './HomePartnershipSolution.jsx';
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
import { CatalogProductDetailPage, ProductCenterPage, ProductSeriesPage } from './ProductCatalogPages.jsx';
import { HomeHeroCarousel, HomeProductShowcase, HomeTrustBar, ProductMegaMenu } from './ProductExperience.jsx';
import {
  getProductSeries,
  getSeriesProduct,
  primaryProductCatalog,
  productCenterSeo,
} from './productCatalogData.js';

trackMetaPageView();

const heroVideo = '/videos/hero-background-2-720p.webm';
const heroFallbackImage = '/images/oem/hero/factory-campus.webp';
const siteUrl = 'https://www.jczcare.com';
const companyName = 'Nantong JINCHENG ZENCARE Technology Company';
const companyNameZh = '\u5357\u901a\u9526\u7a0b\u81fb\u62a4\u79d1\u6280\u6709\u9650\u516c\u53f8';
const contactEmail = 'hengtuo@nthengtuo.com';
const whatsappPhone = '+86 18962944556';
const whatsappChatUrl =
  'https://wa.me/8618962944556?text=Hello%2C%20I%20am%20interested%20in%20your%20OEM%2FODM%20pet%20products.%20Please%20share%20more%20information%20about%20MOQ%2C%20pricing%2C%20samples%2C%20and%20lead%20time.';
const turnstileScriptId = 'cloudflare-turnstile-api';
const turnstileTestSiteKey = '1x00000000000000000000AA';
const googleTranslateScriptId = 'google-translate-element-script';
const languageStorageKey = 'jczcare-language';
const siteLanguages = [
  { code: 'en', shortLabel: 'EN', label: 'English' },
  { code: 'zh-CN', shortLabel: '\u4e2d', label: '\u4e2d\u6587' },
  { code: 'it', shortLabel: 'IT', label: 'Italiano' },
  { code: 'fr', shortLabel: 'FR', label: 'Fran\u00e7ais' },
];
const navigationTranslations = {
  en: {
    home: 'Home',
    factory: 'Factory',
    products: 'Products',
    oemProcess: 'OEM Process',
    quality: 'Quality Control',
    resources: 'Resources',
    contact: 'Contact',
    quote: 'Request Quote',
    signIn: 'Sign In',
    ariaLabel: 'Main navigation',
  },
  'zh-CN': {
    home: '\u9996\u9875',
    factory: '\u5de5\u5382\u5b9e\u529b',
    products: '\u4ea7\u54c1\u4e2d\u5fc3',
    oemProcess: 'OEM\u6d41\u7a0b',
    quality: '\u8d28\u91cf\u63a7\u5236',
    resources: '\u8d44\u6e90\u4e2d\u5fc3',
    contact: '\u8054\u7cfb\u6211\u4eec',
    quote: '\u83b7\u53d6\u62a5\u4ef7',
    signIn: '\u767b\u5f55',
    ariaLabel: '\u4e3b\u5bfc\u822a',
  },
  it: {
    home: 'Home',
    factory: 'Fabbrica',
    products: 'Prodotti',
    oemProcess: 'Processo OEM',
    quality: 'Controllo qualit\u00e0',
    resources: 'Risorse',
    contact: 'Contatti',
    quote: 'Richiedi preventivo',
    signIn: 'Accedi',
    ariaLabel: 'Navigazione principale',
  },
  fr: {
    home: 'Accueil',
    factory: 'Usine',
    products: 'Produits',
    oemProcess: 'Processus OEM',
    quality: 'Contr\u00f4le qualit\u00e9',
    resources: 'Ressources',
    contact: 'Contact',
    quote: 'Demander un devis',
    signIn: 'Connexion',
    ariaLabel: 'Navigation principale',
  },
};
const inquiryProductOptions = [
  'OEM/ODM pet products',
  'Disposable pet training pads',
  'Adult underpads',
  'Pet waste bags',
  'Absorbent paper sheets',
  'Other / Not sure yet',
];

const formatInquiryProduct = (value) => {
  if (!value) {
    return '';
  }

  if (inquiryProductOptions.includes(value)) {
    return value;
  }

  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase())
    .replace(/\b(Oem|Odm|Seo|Rfq|Faq|B2b)\b/g, (acronym) => acronym.toUpperCase());
};
const Silk = React.lazy(() => import('./Silk'));

const buildMailto = (subject = 'Website Inquiry', body = '') => {
  const params = new URLSearchParams({ subject });

  if (body) {
    params.set('body', body);
  }

  return `mailto:${contactEmail}?${params.toString()}`;
};

const getInitialSiteLanguage = () => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const storedLanguage = window.localStorage.getItem(languageStorageKey);
  const cookieLanguage = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('googtrans='))
    ?.split('/').pop();
  const requestedLanguage = storedLanguage || cookieLanguage || 'en';

  return siteLanguages.some(({ code }) => code === requestedLanguage)
    ? requestedLanguage
    : 'en';
};

const getLocalizedCompanyName = () => (
  getInitialSiteLanguage() === 'zh-CN' ? companyNameZh : companyName
);

const setGoogleTranslateCookie = (language) => {
  const cookieValue = `/en/${language}`;
  const cookieOptions = 'path=/; max-age=31536000; SameSite=Lax';
  document.cookie = `googtrans=${cookieValue}; ${cookieOptions}`;

  if (window.location.hostname === 'jczcare.com' || window.location.hostname.endsWith('.jczcare.com')) {
    document.cookie = `googtrans=${cookieValue}; domain=.jczcare.com; ${cookieOptions}`;
  }
};

const initializeGoogleTranslate = () => {
  const translateHost = document.getElementById('google_translate_element');

  if (!translateHost || translateHost.dataset.initialized === 'true' || !window.google?.translate?.TranslateElement) {
    return;
  }

  new window.google.translate.TranslateElement(
    {
      pageLanguage: 'en',
      includedLanguages: 'zh-CN,it,fr',
      autoDisplay: false,
    },
    'google_translate_element',
  );
  translateHost.dataset.initialized = 'true';
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
    src: '/images/oem/production/production-line-clean.png',
  },
  {
    title: 'Automated Lamination Line',
    tag: 'Lamination',
    src: '/images/oem/production/lamination-detail-clean.png',
  },
  {
    title: 'Custom Packing & Delivery',
    tag: 'Packaging',
    src: '/images/oem/warehouse/warehouse-storage-clean.png',
  },
];

const innovations = [
  {
    icon: Layers3,
    title: 'Nonwoven Fabric',
    text: 'Surface feel, liquid intake, embossing, and weight can be specified for the target channel.',
    image: '/images/oem/materials/products-pet-pad-macro-01.webp',
  },
  {
    icon: Droplets,
    title: 'SAP & Wood Pulp',
    text: 'Absorbent core direction is developed around capacity, diffusion, rewet, and cost targets.',
    materialTerminology: true,
    image: '/images/oem/materials/products-absorbent-paper-01.webp',
  },
  {
    icon: Ruler,
    title: 'PE Film & Layer Structure',
    text: 'Backing film, edge sealing, and layer combinations are reviewed for leak protection.',
    image: '/images/oem/materials/products-pe-film-01.webp',
  },
];

const materialTerminologyTranslations = {
  en: {
    title: 'SAP & Wood Pulp',
    text: 'Absorbent core direction is developed around capacity, diffusion, rewet, and cost targets.',
    introduction: 'SAP, wood pulp, nonwoven fabric, and PE film are reviewed as one absorbent product system.',
  },
  'zh-CN': {
    title: 'SAP 和木浆',
    text: '吸收芯体围绕吸收量、扩散速度、回渗控制和成本目标进行设计。',
    introduction: 'SAP、木浆、无纺布和 PE 膜作为一个完整的吸收产品系统进行评估。',
  },
  it: {
    title: 'SAP e pasta di cellulosa',
    text: 'La struttura del nucleo assorbente viene definita in base a capacita, diffusione, rewet e obiettivi di costo.',
    introduction: 'SAP, pasta di cellulosa, tessuto non tessuto e film PE vengono valutati come un unico sistema assorbente.',
  },
  fr: {
    title: 'SAP et p\u00e2te de cellulose',
    text: 'La structure du noyau absorbant est d\u00e9finie selon la capacit\u00e9, la diffusion, le rewet et les objectifs de co\u00fbt.',
    introduction: 'Le SAP, la p\u00e2te de cellulose, le non-tiss\u00e9 et le film PE sont \u00e9valu\u00e9s comme un syst\u00e8me absorbant unique.',
  },
};

const homepageTrustStats = [
  ['20 Years', 'Manufacturing Experience', 'Focused absorbent hygiene manufacturing.'],
  ['300M pcs', 'Production Capability', 'Annual planned capacity across 8 automated lines.'],
  ['Global Supply', 'Export Capability', 'International OEM order and shipment coordination.'],
  ['OEM / ODM', 'Customization Support', 'Specification, material, packaging, and sampling support.'],
];

const inspections = [
  ['01', 'Incoming Material Inspection', 'Nonwoven, fluff pulp, SAP, PE film, and packaging materials are checked before production.'],
  ['02', 'Production Inspection', 'Weight, size, sealing, embossing, folding, and packing are monitored on line.'],
  ['03', 'Finished Product Testing', 'Absorption, diffusion, rewet, leakage, appearance, and carton marks are reviewed before release.'],
];

const advantages = [
  {
    icon: Ruler,
    title: 'Size Customization',
    text: 'Dimensions, folding format, pack count, and carton configuration planned for your channel.',
    image: '/images/products/pet-training-pads/pet-training-pad-main.jpg',
  },
  {
    icon: FlaskConical,
    title: 'Material Adjustment',
    text: 'Surface, core, SAP ratio, backing film, and absorbency direction reviewed before sampling.',
    image: '/images/oem/customization/generated-20260808/material-adjustment.png',
  },
  {
    icon: Layers3,
    title: 'Packaging Customization',
    text: 'Pack format, artwork workflow, pack count, carton marks, and retail presentation support.',
    image: '/images/oem/customization/generated-20260808/packaging-customization.png',
  },
  {
    icon: ShieldCheck,
    title: 'Private Label Support',
    text: 'Specification confirmation, sample approval, production control, and export coordination.',
    image: '/images/oem/customization/generated-20260808/private-label-support.png',
  },
];

const homeCustomizationCapabilities = [
  ['Custom Size', 'Dimensions, folding format, pack count, and carton configuration planned for the target channel.'],
  ['Custom Absorbency', 'Core direction reviewed around capacity, diffusion, rewet, and cost targets.'],
  ['Custom Materials', 'Surface, pulp, SAP, backing film, and layer combinations reviewed before sampling.'],
  ['Functional Options', 'Non-slip, charcoal, printed, and other product-specific directions discussed against the brief.'],
  ['Printed Design', 'Product print direction, artwork review, and retail presentation coordinated before production.'],
  ['Private Label Packaging', 'Bag structure, pack count, labels, cartons, and shipping marks planned for the channel.'],
];

const homePartnerReasons = [
  ['Product Development Support', 'Translate market requirements into workable product specifications and a sampling brief.'],
  ['Controlled Production', 'Coordinate materials, dimensions, absorbency, sealing, folding, and packing against the approved brief.'],
  ['Private Label Coordination', 'Support packaging structure, artwork review, pack count, and carton requirements.'],
  ['Export & Delivery Coordination', 'Discuss FOB, EXW, CIF, and DDP project options according to destination and buyer requirements.'],
];

const homeProcessSteps = [
  ['01', 'Share Requirements', 'Tell us the product, market, quantity, specification, and packaging direction.'],
  ['02', 'Confirm Specification', 'We organize the material, size, performance, and commercial brief for review.'],
  ['03', 'Develop Sample', 'A sample is prepared against the confirmed brief and planned review points.'],
  ['04', 'Approve Product & Packaging', 'Product performance, pack structure, artwork, and carton details are confirmed.'],
  ['05', 'Produce & Inspect', 'Approved specifications move into scheduled production and in-process inspection.'],
  ['06', 'Pack & Ship', 'Finished goods are released, packed, documented, and coordinated for shipment.'],
];

const homeQualityChecks = [
  'Incoming Material Inspection',
  'In-Process Inspection',
  'Absorbency & Performance Review',
  'Packaging & Count Check',
  'Finished-Goods Release',
  'Batch & Shipment Documentation',
];

const homeBuyerTypes = ['Pet Brands', 'Retailers', 'Importers', 'Distributors', 'Wholesalers', 'E-commerce Sellers'];

const homeProjectScenarios = [
  ['Private-Label Pet Pad Launch', 'Develop a product brief, sample, packaging direction, and repeat-order specification.'],
  ['Multi-SKU Distributor Sourcing', 'Coordinate several categories through one product and commercial communication workflow.'],
  ['Retail Packaging Redesign', 'Review pack count, artwork, bag structure, carton marks, and shelf presentation.'],
  ['Absorbency Specification Adjustment', 'Compare material and core directions against use, price, and performance targets.'],
];

const homeFaqs = [
  ['What products can JCZCARE manufacture?', 'JCZCARE supports pet urine pads, pet absorbent paper sheets, pet diapers, adult underpads, disposable cleaning products, and garbage bags.'],
  ['What can be customized?', 'Size, absorbency, materials, functional options, printed design, pack count, private-label packaging, and export cartons can be discussed by product.'],
  ['How do I request a sample?', 'Submit the inquiry form with your product, target market, specification, and expected quantity. The team will confirm the sample brief and delivery details.'],
  ['What information is needed for a quotation?', 'Share product type, dimensions, materials or performance direction, pack format, estimated quantity, target market, and delivery destination.'],
  ['What is the MOQ?', 'MOQ depends on the product, specification, material, and packaging format. It is confirmed after the project brief is reviewed.'],
  ['Can you support private-label packaging?', 'Yes. Packaging structure, artwork review, pack count, labels, cartons, and shipping marks can be coordinated.'],
  ['Which trade terms can be discussed?', 'FOB, EXW, CIF, and DDP can be discussed according to destination, logistics scope, and buyer requirements.'],
  ['How long do sampling and production take?', 'Sampling is planned against the confirmed brief. Production and shipping timing vary by product, quantity, packaging, destination, and trade term.'],
];

const customProducts = [
  {
    slug: 'disposable-pet-pads',
    title: 'Disposable Pet Pads',
    category: 'Core Product',
    image: '/images/oem/products/custom-disposable-pet-pads-premium.png',
    detailImage: '/images/oem/products/products-disposable-pads-01.webp',
    detailImageAlt: 'Dog sitting beside a disposable pet training pad in a modern home',
    specs: ['Multiple sizes', 'Absorbency levels', 'Embossing optional'],
    application: 'Retail, e-commerce, distributors, and daily pet training.',
    oemCapability: 'Core training-pad OEM platform with repeat-order production control.',
    customization: 'Size, absorbency, embossing, color, pack count, and private label.',
    badge: 'OEM / ODM',
    summary: 'OEM pet pads built around absorption, leak protection, and production planning.',
    details: ['Softness, embossing, size, and absorbency can be tuned.', 'Private-label packing and outer bag artwork supported.', 'Built for brands, retailers, and cross-border channels.'],
  },
  {
    slug: 'adult-underpads',
    title: 'Adult Disposable Underpads',
    category: 'Healthcare Care Series',
    image: '/images/oem/products/adult-underpads-hero.png',
    detailImage: '/images/oem/products/products-underpads-01.webp',
    detailImageAlt: 'Absorbency testing of an adult disposable underpad in a quality laboratory',
    specs: ['SAP absorbency', 'Multiple sizes', 'OEM packaging'],
    application: 'Healthcare, home care, medical distribution, and retail.',
    oemCapability: 'Private-label underpad development for care and distribution channels.',
    customization: 'Size, weight, SAP ratio, absorbency, folding, and packaging.',
    badge: 'OEM / ODM',
    summary: 'Premium disposable underpads for healthcare, home care, distribution, and private-label programs.',
    details: ['Non-woven, tissue, SAP, and PE film structures can be planned around the application.', 'Size, weight, absorbency, pack count, and carton presentation can be customized.', 'Sampling and specification review support for B2B healthcare product programs.'],
  },
  {
    slug: 'pet-care-pad-glove-wipes',
    title: 'Pet Care Pad & Glove Wipes',
    category: 'Care Series',
    image: '/images/custom-care-pad-packaging-ai.png',
    detailImage: '/images/oem/packaging/private-label-packaging-01.webp',
    detailImageAlt: 'Private-label pet care packaging review meeting',
    specs: ['Private label', 'Retail pack', 'Soft surface'],
    application: 'Pet care sets, retail shelves, e-commerce, and cleaning programs.',
    oemCapability: 'Multi-product private-label support for disposable care ranges.',
    customization: 'Material feel, product format, pouch structure, and pack count.',
    badge: 'Private Label',
    summary: 'Disposable care products for daily pet cleaning and private-label retail.',
    details: ['Pouch structure, pack count, and material feel can be customized.', 'Designed for retail shelves, online bundles, and care sets.', 'Sampling matched to target market and price band.'],
  },
  {
    slug: 'pet-absorbent-paper-sheets',
    title: 'Pet Absorbent Paper Sheets',
    category: 'Source Factory',
    image: '/images/oem/products/custom-absorbent-paper-ai.png',
    detailImage: '/images/oem/materials/products-absorbent-paper-01.webp',
    detailImageAlt: 'Absorbent paper and core material sample on a tray',
    specs: ['SAP blend', 'Layer material', 'Bulk customization'],
    application: 'Absorbent product factories, converters, and bulk material buyers.',
    oemCapability: 'Factory-direct absorbent layer and sheet supply programs.',
    customization: 'Dimensions, thickness, SAP blend, absorbency, and bulk packing.',
    badge: 'Factory Direct',
    summary: 'Absorbent paper sheets configured for core materials and bulk supply.',
    details: ['SAP ratio, paper feel, thickness, and packing can be customized.', 'Available as layer material or standalone absorbent sheets.', 'Factory-direct support for formula and delivery control.'],
  },
  {
    slug: 'custom-pet-waste-bags',
    title: 'Custom Pet Waste Bags',
    category: 'Extended Range',
    image: '/images/oem/products/custom-pet-waste-bags-ai.png',
    specs: ['Custom colors', 'Roll formats', 'OEM packaging'],
    application: 'Retail, wholesale, subscription, and pet accessory channels.',
    oemCapability: 'Extended-category sourcing for coordinated private-label ranges.',
    customization: 'Film thickness, color, scent, roll count, and retail packaging.',
    badge: 'Color Options',
    summary: 'Custom pet waste bags with flexible colors, rolls, and retail packs.',
    details: ['Roll format, thickness, color, and packaging can be specified.', 'Pairs well with pet pad private-label programs.', 'Made for retail, distribution, and subscription channels.'],
  },
  {
    slug: 'charcoal-pet-pads',
    title: 'Charcoal Pet Pads',
    category: 'Odor Control',
    image: '/images/oem/products/custom-charcoal-pet-pad-ai.png',
    detailImage: '/images/oem/products/products-charcoal-pads-01.webp',
    detailImageAlt: 'Dark-backed absorbent pad edge for odor-control product reference',
    specs: ['Activated carbon', 'Odor reduction', 'Fast sampling'],
    application: 'Premium retail, odor-control ranges, and indoor pet care.',
    oemCapability: 'Functional training-pad development with carbon-layer options.',
    customization: 'Carbon layer, absorbency, size, surface pattern, and packaging.',
    badge: 'Formula Support',
    summary: 'Odor-control pet pads for premium and upgraded product lines.',
    details: ['Carbon layer, absorbency, size, and surface pattern can be configured.', 'Built for odor-sensitive and premium pet care channels.', 'Samples available for absorption, rewet, and odor review.'],
  },
  {
    slug: 'adhesive-pet-pads',
    title: 'Non-Slip Underpad',
    category: 'Anti-Slip Design',
    image: '/images/oem/products/custom-adhesive-pet-pad-ai.png',
    detailImage: '/images/oem/products/products-adhesive-pads-01.webp',
    detailImageAlt: 'Disposable pet pad on wood floor during liquid absorption test',
    specs: ['Secure backing', 'Easy removal', 'Quality checked'],
    application: 'Indoor training, travel, clinics, and stability-focused product lines.',
    oemCapability: 'Backing and anti-slip feature development for upgraded pad ranges.',
    customization: 'Non-slip backing, size, absorbency, and pack format.',
    badge: 'Non-Slip Backing',
    summary: 'Non-slip underpads designed for stable placement and easy removal.',
    details: ['Backing, size, specification, and packing can be customized.', 'Designed to reduce shifting while removing cleanly.', 'Ideal for upgraded training pad and scenario-based lines.'],
  },
];

const b2bImage = (name) => `/images/generated-site/b2b-optimization/${name}.webp`;

const productTechnicalSpecs = {
  default: [
    ['Size', 'Standard market sizes or buyer-defined dimensions'],
    ['Absorption Level', 'Configured against the approved product brief and sample'],
    ['Layer Structure', 'Nonwoven + distribution layer + absorbent core + PE backing'],
    ['Material', 'Nonwoven, fluff pulp, SAP, tissue or absorbent paper, and PE film'],
    ['Packing', 'Custom pack count, printed bag, export carton, and shipping marks'],
    ['MOQ', 'Confirmed after specification, material, and packaging review'],
  ],
  'disposable-pet-pads': [
    ['Size', '33 x 45 cm, 45 x 60 cm, 60 x 60 cm, 60 x 90 cm, or custom'],
    ['Absorption Level', 'Buyer-defined direction confirmed through sample and performance review'],
    ['Layer Structure', 'Nonwoven + tissue or absorbent paper + fluff pulp and SAP + PE film'],
    ['Material', 'Soft nonwoven, fluff pulp, SAP, tissue or absorbent paper, and waterproof PE'],
    ['Packing', 'Custom pack count, private-label bag, export carton, and shipping marks'],
    ['MOQ', 'Confirmed according to size, absorbency, packaging, and order plan'],
  ],
  'adult-underpads': [
    ['Size', '60 x 60 cm, 60 x 90 cm, 80 x 90 cm, or custom care dimensions'],
    ['Core Material', 'Tissue layers with fluff pulp and SAP absorbent core'],
    ['Absorption', 'Buyer-defined capacity and rewet direction confirmed during sampling'],
    ['Back Sheet', 'Waterproof PE backing with project-defined color and thickness'],
    ['Packing', 'Healthcare, retail, or distributor pack with private-label support'],
  ],
  'custom-pet-waste-bags': [
    ['Material', 'HDPE / LDPE options'],
    ['Thickness', 'Buyer-defined film gauge aligned to strength, feel, and price target'],
    ['Roll Size', 'Custom bag dimensions, roll width, roll count, and dispenser format'],
    ['Printing', 'Custom color, bag printing, labels, and private-label artwork'],
    ['Packaging', 'Roll, pouch, box, dispenser, bundle, and export carton options'],
  ],
  'pet-care-pad-glove-wipes': [
    ['Product Format', 'Care sheet, disposable pad, glove format, or project-defined item'],
    ['Size', 'Buyer-defined dimensions and pack count'],
    ['Material', 'Soft nonwoven selected around feel, strength, and intended care use'],
    ['Packing', 'Pouch, bag, retail set, bundle, and export carton'],
    ['Printing', 'Private-label pouch artwork, labels, and carton marks'],
    ['MOQ', 'Confirmed after product format, material, and packaging review'],
  ],
  'pet-absorbent-paper-sheets': [
    ['Sheet Size', 'Buyer-defined dimensions or converted layer cut size'],
    ['Thickness', 'Project-defined basis weight and layer build'],
    ['Core Material', 'Absorbent paper with optional tissue and SAP blend direction'],
    ['Absorption', 'Configured around the intended finished product and sample target'],
    ['Packing', 'Bulk protective wrapping, labels, pallets, and shipment marks'],
    ['MOQ', 'Confirmed after material structure, sheet size, and delivery plan review'],
  ],
  'charcoal-pet-pads': [
    ['Size', '33 x 45 cm, 45 x 60 cm, 60 x 60 cm, 60 x 90 cm, or custom'],
    ['Absorption Level', 'Buyer-defined direction reviewed with odor-control sample performance'],
    ['Layer Structure', 'Nonwoven + activated-carbon direction + absorbent core + PE film'],
    ['Material', 'Nonwoven, carbon layer, fluff pulp, SAP, tissue, and waterproof PE'],
    ['Packing', 'Private-label pack count, printed bag, export carton, and shipping marks'],
    ['MOQ', 'Confirmed according to carbon layer, absorbency, packaging, and order plan'],
  ],
  'adhesive-pet-pads': [
    ['Size', '33 x 45 cm, 45 x 60 cm, 60 x 60 cm, 60 x 90 cm, or custom'],
    ['Absorption Level', 'Buyer-defined direction confirmed through sample testing'],
    ['Layer Structure', 'Nonwoven + absorbent core + waterproof PE + non-slip backing'],
    ['Material', 'Nonwoven, fluff pulp, SAP, tissue, PE film, and non-slip backing option'],
    ['Packing', 'Custom pack count, private-label bag, carton, and shipping marks'],
    ['MOQ', 'Confirmed according to backing design, size, packaging, and order plan'],
  ],
};

const productApplications = [
  'Retail chains',
  'Wholesale distribution',
  'Pet brands',
  'Importers and distributors',
];

const productBuyerChannels = [
  ['Retail', 'Shelf-ready specifications, pack counts, and carton planning for physical retail programs.'],
  ['Pet Brands', 'Private-label product development aligned to brand positioning and target performance.'],
  ['Distributors', 'Repeatable specifications and export packing for wholesale and regional supply.'],
  ['Online Sellers', 'E-commerce pack formats, clear product differentiation, and repeat-order support.'],
];

const standardPadMaterialStructure = [
  ['Nonwoven', 'Controls surface softness and liquid intake; weight, texture, and embossing can be reviewed.'],
  ['Fluff Pulp', 'Supports liquid distribution and core volume; the selected grade affects bulk and absorption behavior.'],
  ['SAP', 'Locks liquid inside the absorbent core; the ratio is planned around capacity, rewet, and cost targets.'],
  ['PE Film', 'Provides the waterproof backing; thickness, color, and leak-resistance direction can be specified.'],
];

const productProcurementDetails = {
  'disposable-pet-pads': {
    overview: {
      purpose: 'Disposable floor protection and daily pet training with a configurable absorbent core and waterproof backing.',
      buyers: 'Pet brands, retailers, distributors, importers, wholesalers, and online sellers.',
      scenarios: 'Home training, crates, carriers, veterinary use, travel, and indoor pet care.',
    },
    features: ['High absorption', 'Fast liquid intake', 'Leak protection', 'Custom sizes', 'Private label available'],
    sizes: ['33 x 45 cm', '45 x 60 cm', '60 x 60 cm', '60 x 90 cm', 'Custom dimensions'],
    materials: standardPadMaterialStructure,
    customization: [
      ['Size', 'Standard market sizes or buyer-defined dimensions and folding format.'],
      ['Thickness', 'Product weight and core build planned around feel, capacity, and price position.'],
      ['Absorption Level', 'Fluff pulp, absorbent paper, and SAP ratios reviewed against target performance.'],
      ['Packaging', 'Pack count, bag format, carton quantity, and shipping marks.'],
      ['Printing', 'Buyer-supplied artwork workflow, bag presentation, and carton marks.'],
      ['Private Label', 'Brand-ready specification, sample approval, packaging, and repeat-order references.'],
    ],
    oemSupport: 'Specification review, sample development, private-label packaging, quality checkpoints, and repeat-order control.',
  },
  'adult-underpads': {
    overview: {
      purpose: 'Disposable protection for beds, chairs, examination surfaces, and home-care environments.',
      buyers: 'Healthcare brands, medical distributors, care retailers, importers, and private-label buyers.',
      scenarios: 'Hospitals, clinics, nursing homes, rehabilitation, home care, and mobility support.',
    },
    features: ['High absorption', 'Soft contact surface', 'Low rewet direction', 'Leak protection', 'Private label available'],
    sizes: ['60 x 60 cm', '60 x 90 cm', '80 x 90 cm', 'Custom care dimensions'],
    materials: standardPadMaterialStructure,
    customization: [
      ['Size', 'Common care dimensions or a buyer-defined format and folding direction.'],
      ['Thickness', 'Core weight and layer build aligned to care setting and product positioning.'],
      ['Absorption Level', 'SAP and fluff pulp direction developed around capacity and rewet targets.'],
      ['Packaging', 'Healthcare, retail, or distributor pack counts and export cartons.'],
      ['Printing', 'Private-label bag artwork, labels, carton marks, and approval workflow.'],
      ['Private Label', 'Buyer-specific care specifications supported from sample to repeat production.'],
    ],
    oemSupport: 'Buyer-specific care specifications, sampling, private-label packs, carton planning, and production release support.',
  },
  'pet-care-pad-glove-wipes': {
    overview: {
      purpose: 'Disposable formats for routine pet cleaning, handling, and convenient care-set programs.',
      buyers: 'Pet care brands, retailers, distributors, subscription sellers, and multi-product program buyers.',
      scenarios: 'Daily cleaning, travel kits, grooming support, retail bundles, and home pet care.',
    },
    features: ['Soft contact material', 'Convenient single-use format', 'Custom product formats', 'Retail-ready packaging', 'Private label available'],
    sizes: ['Buyer-defined sheet size', 'Glove format', 'Single-use care pad', 'Custom pack count'],
    materials: [
      ['Nonwoven', 'The selected grade controls softness, strength, surface feel, and the intended cleaning format.'],
      ['Care Material', 'Dry or project-defined material direction is confirmed during specification and sample review.'],
      ['Pouch Structure', 'Barrier and closure direction influence storage, handling, and retail presentation.'],
      ['Retail Carton', 'Carton or bundle configuration supports shelf display and coordinated product programs.'],
    ],
    customization: [
      ['Size', 'Buyer-defined sheet, pad, or glove dimensions and product format.'],
      ['Thickness', 'Material weight and hand feel selected for the intended care task.'],
      ['Absorption Level', 'Material uptake is reviewed where required by the specific care format.'],
      ['Packaging', 'Pouch structure, closure, pack count, bundle, and carton format.'],
      ['Printing', 'Buyer artwork, labels, pouch presentation, and carton marks.'],
      ['Private Label', 'Coordinated product and packaging development for branded care ranges.'],
    ],
    oemSupport: 'Format review, sample confirmation, coordinated private-label packaging, and multi-product care program support.',
  },
  'pet-absorbent-paper-sheets': {
    overview: {
      purpose: 'Absorbent sheet material for use as a converted-product core layer or a standalone project-defined sheet.',
      buyers: 'Absorbent product factories, converters, material distributors, importers, and bulk buyers.',
      scenarios: 'Pet hygiene converting, absorbent core development, sampling, bulk material supply, and industrial use.',
    },
    features: ['Configurable absorption', 'Flexible layer integration', 'Custom dimensions', 'Bulk supply formats', 'Private label documentation'],
    sizes: ['Custom sheet dimensions', 'Layer cut size', 'Project-specific thickness', 'Bulk packing format'],
    materials: [
      ['Absorbent Paper', 'Provides liquid distribution and a stable converted layer; basis weight affects thickness and handling.'],
      ['SAP', 'Optional blend direction increases liquid lock-in and is planned around the required capacity.'],
      ['Tissue', 'Tissue combinations can support layer integrity, distribution, and downstream converting.'],
      ['Core Combination', 'The final sheet structure is matched to the buyer process and intended finished product.'],
    ],
    customization: [
      ['Size', 'Sheet dimensions or converted layer cut size matched to buyer equipment.'],
      ['Thickness', 'Basis weight and layer build reviewed for handling and finished-product targets.'],
      ['Absorption Level', 'Paper grade and SAP blend adjusted around the requested uptake direction.'],
      ['Packaging', 'Bulk packs, protective wrapping, pallet plan, and shipment labels.'],
      ['Printing', 'Project identification, labels, outer marks, and buyer-required documentation.'],
      ['Private Label', 'Buyer references and supply documentation for controlled repeat material orders.'],
    ],
    oemSupport: 'Material brief review, sample sheets, absorption checks, bulk packing planning, and repeat supply coordination.',
  },
  'custom-pet-waste-bags': {
    overview: {
      purpose: 'Disposable waste collection bags developed for convenient dispensing, carrying, and retail sale.',
      buyers: 'Pet brands, retailers, distributors, importers, subscription sellers, and accessory wholesalers.',
      scenarios: 'Daily walks, travel, parks, dispenser refills, retail bundles, and subscription programs.',
    },
    features: ['Leak-resistant film direction', 'Roll or folded formats', 'Dispenser-compatible options', 'Custom colors and printing', 'Private label available'],
    sizes: ['Small roll format', 'Medium roll format', 'Large roll format', 'Custom bag and roll count'],
    materials: [
      ['HDPE Film', 'Supports a lightweight, firm bag direction; thickness is matched to strength and cost targets.'],
      ['LDPE Film', 'Provides a softer and more flexible feel where the buyer brief requires it.'],
      ['Color & Printing', 'Pigment and print direction create product differentiation and brand presentation.'],
      ['Perforation & Roll', 'Perforation, roll count, and core format affect dispensing and pack compatibility.'],
    ],
    customization: [
      ['Size', 'Bag dimensions, roll width, and dispenser-compatible formats.'],
      ['Thickness', 'Film gauge selected around feel, leak resistance, and target price.'],
      ['Absorption Level', 'Not applicable; film strength and leak-resistance requirements are specified instead.'],
      ['Packaging', 'Roll count, box, pouch, dispenser, bundle, and export carton.'],
      ['Printing', 'Bag print, color, packaging artwork, labels, and carton marks.'],
      ['Private Label', 'Branded waste-bag specifications coordinated with retail packaging approval.'],
    ],
    oemSupport: 'Specification matching, color and print review, sample rolls, retail packaging, and coordinated category supply.',
  },
  'charcoal-pet-pads': {
    overview: {
      purpose: 'Functional pet training pads combining an absorbent core with an activated-carbon odor-control direction.',
      buyers: 'Premium pet brands, retailers, distributors, importers, and online category sellers.',
      scenarios: 'Indoor training, apartments, odor-sensitive homes, crates, travel, and premium retail ranges.',
    },
    features: ['High absorption', 'Odor-control direction', 'Fast liquid intake', 'Leak protection', 'Private label available'],
    sizes: ['33 x 45 cm', '45 x 60 cm', '60 x 60 cm', '60 x 90 cm', 'Custom dimensions'],
    materials: [
      ...standardPadMaterialStructure,
      ['Activated Carbon', 'Adds the odor-control direction; layer format and product positioning are reviewed during sampling.'],
    ],
    customization: [
      ['Size', 'Standard training-pad sizes or buyer-defined dimensions and folding.'],
      ['Thickness', 'Core weight, carbon-layer direction, and product feel.'],
      ['Absorption Level', 'Fluff pulp and SAP ratio planned with absorption and odor-control targets.'],
      ['Packaging', 'Pack count, bag presentation, carton quantity, and shipping marks.'],
      ['Printing', 'Private-label artwork, product messaging workflow, and carton marks.'],
      ['Private Label', 'Functional product positioning supported through sample and packaging approval.'],
    ],
    oemSupport: 'Functional structure review, odor-control sampling, performance checks, packaging approval, and mass-production support.',
  },
  'adhesive-pet-pads': {
    overview: {
      purpose: 'Absorbent pet pads with an adhesive or anti-slip placement direction for improved stability.',
      buyers: 'Pet brands, retailers, veterinary suppliers, distributors, importers, and online sellers.',
      scenarios: 'Indoor training, carriers, travel, veterinary use, moving pets, and stability-focused product ranges.',
    },
    features: ['High absorption', 'Anti-slip placement', 'Easy-removal direction', 'Leak protection', 'Private label available'],
    sizes: ['33 x 45 cm', '45 x 60 cm', '60 x 60 cm', '60 x 90 cm', 'Custom dimensions'],
    materials: [
      ...standardPadMaterialStructure,
      ['Adhesive Placement', 'Position and application direction affect holding performance and clean-removal evaluation.'],
    ],
    customization: [
      ['Size', 'Standard or buyer-defined dimensions, folding, and adhesive placement.'],
      ['Thickness', 'Product weight and core build aligned to capacity and channel position.'],
      ['Absorption Level', 'Fluff pulp, SAP, and layer direction planned around target performance.'],
      ['Packaging', 'Pack count, bag format, carton quantity, and export marks.'],
      ['Printing', 'Buyer artwork, retail presentation, labels, and carton marks.'],
      ['Private Label', 'Backing design, samples, packaging approval, and repeat-production references.'],
    ],
    oemSupport: 'Backing design review, sample evaluation, placement testing direction, private-label packaging, and production control.',
  },
};

const oemProcessSteps = [
  ['01', 'Requirement Analysis', 'Confirm target market, product category, channel, quantity, delivery destination, and commercial priorities.', '/images/oem/contact/business-meeting-oem.webp'],
  ['02', 'Product Specification', 'Define size, weight, structure, absorbency, surface, backing, pack count, and acceptance criteria.', '/images/oem/customization/oem-meeting-01.webp'],
  ['03', 'Material Selection', 'Review nonwoven, tissue, absorbent paper, fluff pulp, SAP, PE film, and functional options.', '/images/oem/materials/production-process-line.webp'],
  ['04', 'Sample Development', 'Produce samples against the controlled specification and record each development version.', '/images/oem/customization/oem-sample-review-01.webp'],
  ['05', 'Testing Approval', 'Review dimensions, absorption, diffusion, rewet, leakage, appearance, and buyer approval.', '/images/oem/quality/private-label-packaging-review.webp'],
  ['06', 'Mass Production', 'Release the approved specification to material planning, scheduling, line setup, and in-process control.', '/images/oem/production/production-line-clean.png'],
  ['07', 'Packaging', 'Confirm private-label artwork, bag format, pack count, carton marks, and export packing.', '/images/oem/packaging/generated-20260808/oem-packaging-approval-20260808.png'],
  ['08', 'Shipment', 'Complete finished-goods release, loading preparation, documents, and delivery coordination.', '/images/oem/warehouse/absorbency-testing.webp'],
];

const oemCustomizationCapabilities = [
  [Layers3, 'Private Label', 'Coordinate product specification, brand presentation, artwork approval, pack count, and repeat-order references.'],
  [Factory, 'Custom Packaging', 'Review bag format, printed film, labels, cartons, shipping marks, and channel-ready presentation.'],
  [Ruler, 'Size Customization', 'Develop dimensions, folding, weight, absorbency, and pack configuration around the target application.'],
];

const factoryCoreModules = [
  ['01', 'Factory Overview', 'A 12,000 sq.m manufacturing base supports product development, production, quality review, packing, and export preparation.', '/images/oem/factory/factory-campus-real-aerial-20260729.png', ['20 years manufacturing experience', 'Integrated production and export coordination']],
  ['02', 'Production Capability', 'Eight automated lines support repeatable dimensions, material placement, folding, sealing, and pack formats for planned OEM volumes.', '/images/oem/production/production-line-clean.png', ['8 automated production lines', '300M pcs planned annual capacity']],
  ['03', 'Manufacturing Equipment', 'Production and lamination equipment is matched to absorbent structures, backing films, product dimensions, and packaging requirements.', '/images/oem/production/lamination-detail-clean.png', ['Automated converting equipment', 'Controlled line setup and monitoring']],
  ['04', 'Production Workflow', 'Material release, line setup, production checks, performance testing, packaging, and finished-goods release follow one controlled order brief.', '/images/oem/production/factory-production-line-real-20260729.jpg', ['Specification-controlled workflow', 'In-process and release checkpoints']],
  ['05', 'Warehouse & Logistics', 'Finished goods, export cartons, pallet preparation, loading coordination, and shipment documents are managed for international orders.', '/images/oem/warehouse/warehouse-storage-clean.png', ['Finished-goods storage', 'Export packing and loading preparation']],
];

const qualityStageSummary = [
  ['01', 'Incoming Material Inspection', 'Check nonwoven, tissue, absorbent paper, fluff pulp, SAP, PE film, and packaging materials before release.', '/images/oem/quality/factory-quality-control-01.webp'],
  ['02', 'Production Inspection', 'Monitor size, weight, material placement, sealing, embossing, folding, count, and line consistency.', '/images/oem/production/production-line-clean.png'],
  ['03', 'Finished Product Testing', 'Review absorption, diffusion, rewet, leakage, appearance, packing, carton marks, and retained evidence.', '/images/oem/quality/generated-20260808/finished-product-testing-20260808.png'],
];

const qualityControlSteps = [
  ['Material Verification', 'Approved material type, weight, appearance, and project references are reviewed before line release.', '/images/oem/quality/factory-quality-control-01.webp'],
  ['Production Monitoring', 'Line checks track size, weight, sealing, folding, material placement, and pack consistency.', '/images/oem/production/production-line-clean.png'],
  ['Absorption Testing', 'Absorption speed, capacity, diffusion, and rewet direction are checked against the project brief.', '/images/oem/quality/factory-testing-lab-01.webp'],
  ['Leak Prevention Testing', 'Backing film, edge seal, adhesive direction, and pressure-related leakage risk are reviewed.', '/images/oem/quality/generated-20260808/leak-prevention-testing-20260808.png'],
  ['Final Inspection', 'Finished goods, packs, cartons, appearance, count, and carton marks are inspected before release.', '/images/oem/quality/generated-20260808/final-inspection-ai-20260808.png'],
  ['Shipment Approval', 'Release records, documents, pallet condition, and loading readiness are confirmed for export.', '/images/oem/warehouse/absorbency-testing.webp'],
];

const manufacturingProcess = [
  'Raw Material',
  'Material Inspection',
  'Production',
  'Absorption Testing',
  'Packaging',
  'Shipment',
];

const privateLabelOptions = [
  'Size',
  'Absorbency',
  'Packaging',
  'Printing',
  'Materials',
  'Product Features',
];

const downloadResources = [
  ['Product Catalog', 'Product range, material direction, applications, and OEM product platforms.'],
  ['Factory Profile', 'Manufacturing base, production capability, quality system, and export support overview.'],
  ['OEM Capability', 'OEM/ODM workflow, customization scope, sampling, MOQ discussion, and production planning.'],
  ['Packaging Options', 'Private-label packaging formats, pack count planning, carton marks, and artwork approval flow.'],
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
  { label: 'Download Center', href: '/download' },
  { label: 'Buyer Guides', href: '/buyer-guides' },
  { label: 'Material Knowledge', href: '/materials' },
  { label: 'Industry Reports', href: '/reports' },
];

const footerLinkGroups = [
  { title: 'Company', labels: ['About', 'Investor Relations', 'Affiliates', 'Give Back', 'Gift Cards'] },
  { title: 'Products', labels: ['Pet Pad Factory', 'Private Label Pet Pads', 'Quality Control'] },
  { title: 'OEM Resources', labels: ['OEM Process', 'Resources', 'Blog', 'FAQ', 'Learn', 'Downloads', 'Download Center', 'Buyer Guides', 'Material Knowledge', 'Industry Reports', 'Case Studies', 'Comparisons', 'Media'] },
  { title: 'Contact', labels: ['Contact', 'Factory Center', 'Help'] },
];

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/jczcare?igsh=MXFsb3A5bzVqMGZobA%3D%3D&utm_source=qr',
    icon: Instagram,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1HKwq1h4NZ/?mibextid=wwXIfr',
    icon: Facebook,
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@nantongjinchengzencaretechnolo?si=IkMAmxKgn0InDe8j',
    icon: Youtube,
  },
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
    image: '/images/oem/production/factory-production-line-real-20260729.jpg',
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
    path: '/private-label',
    kicker: 'Private Label',
    title: 'Private Label Pet Pads OEM Program | JCZCARE',
    description: 'Private label pet pads for brands, retailers, distributors, and wholesalers needing custom size, absorbency, packaging, printing, materials, and OEM manufacturing support.',
    h1: 'Private label pet pads for brand-ready OEM programs.',
    intro: 'Develop private-label pet pads with controlled specifications, sample approval, packaging customization, production planning, and export-ready delivery.',
    image: b2bImage('private-label-packaging-review'),
    sections: [
      ['Customization scope', 'Size, absorbency, packaging, printing, material structure, and product features can be planned around your market.'],
      ['Brand launch workflow', 'Move from idea to prototype, sample, production, and delivery with a clear buyer approval path.'],
      ['B2B buyer fit', 'Built for pet brands, retail chains, wholesalers, distributors, and private-label buyers.'],
    ],
    faqs: [
      ['Can JCZCARE support private-label packaging?', 'Yes. We can review pack format, artwork direction, carton marks, pack count, and production feasibility.'],
      ['Can product specifications be customized?', 'Yes. Size, absorbency, materials, surface feel, backing film, and product features can be discussed before sampling.'],
      ['What should a brand send first?', 'Share target market, benchmark product, expected monthly quantity, size, absorbency, packaging idea, and launch timing.'],
    ],
  },
  {
    path: '/download',
    kicker: 'Download Center',
    title: 'OEM Pet Pad Download Center | JCZCARE',
    description: 'Request JCZCARE product catalog, factory profile, OEM capability overview, and packaging options for pet pad private-label and OEM sourcing projects.',
    h1: 'Request OEM catalogs and buyer documents.',
    intro: 'Use the download center to request product and factory information. Files are provided after inquiry review so the document pack matches your target product and market.',
    image: b2bImage('download-center-catalog'),
    sections: [
      ['Product Catalog', 'Request product range information for disposable pet pads, underpads, absorbent sheets, care products, and dog waste bags.'],
      ['Factory Profile', 'Request manufacturing capability, production workflow, quality control, and export-support information.'],
      ['OEM Capability', 'Request customization, private-label packaging, sampling, MOQ, and production-planning information.'],
    ],
    faqs: [
      ['Can I download PDFs directly?', 'The page currently provides a request entry. We do not publish fake PDF files when a document pack has not been confirmed.'],
      ['What can I request?', 'Product catalog, factory profile, OEM capability information, and packaging option references.'],
      ['How do I get the right files?', 'Submit your company, product interest, country, and project requirement so the team can send the relevant document pack.'],
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
    image: '/images/oem/factory/factory-campus-real-aerial-20260729.png',
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
    image: '/images/oem/production/factory-production-line-real-20260729.jpg',
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
    image: '/images/oem/factory/factory-campus-real-aerial-20260729.png',
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
    image: b2bImage('quality-control-lab'),
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
    image: b2bImage('oem-sample-review'),
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
    path: '/oem-capability',
    kicker: 'OEM Manufacturing Capability',
    title: 'Pet Hygiene OEM Manufacturing Capability | JCZCARE',
    description: 'Evaluate JCZCARE pet hygiene OEM manufacturing capability, production workflow, customization, quality control, and global supply support for European and American buyers.',
    h1: 'OEM manufacturing capability for global pet hygiene buyers.',
    intro: 'A factory capability overview for pet brands, retailers, distributors, importers, wholesalers, and procurement teams evaluating long-term OEM supply.',
    image: '/images/oem/factory/factory-campus-real-aerial-20260729.png',
    sections: [
      ['Manufacturing overview', 'Review the production base, automated equipment, absorbent product experience, and order coordination behind OEM pet hygiene programs.'],
      ['OEM cooperation process', 'Move from requirement analysis and specification confirmation through sampling, production, inspection, packaging, and shipment.'],
      ['Quality and global supply', 'Connect incoming material checks, in-process inspection, finished-product testing, export packing, and delivery coordination.'],
    ],
    faqs: [
      ['What can be customized for an OEM project?', 'Size, product weight, absorbency direction, materials, functional options, pack count, artwork, private label presentation, and carton requirements can be reviewed.'],
      ['How does an OEM project begin?', 'Buyers can share the target market, product category, specification, estimated quantity, packaging direction, and delivery destination for project review.'],
      ['Do you support European and American buyers?', 'Yes. The cooperation workflow is designed for overseas brands, retailers, distributors, importers, wholesalers, and procurement teams.'],
    ],
  },
  {
    path: '/case-study',
    kicker: 'Anonymous OEM Project Examples',
    title: 'OEM Pet Hygiene Case Studies | Global B2B Projects | JCZCARE',
    description: 'Review five anonymous OEM pet hygiene project examples covering private-label pet pads, adult underpads, charcoal pads, adhesive pads, and coordinated category supply.',
    h1: 'Anonymous OEM project examples for global pet care buyers.',
    intro: 'Representative project profiles for pet brands, retailers, distributors, importers, and procurement teams evaluating product development, customization, production support, and repeat supply.',
    image: '/images/oem/production/factory-production-line-03.webp',
    sections: [
      ['Product development examples', 'Review how different buyer briefs move from commercial challenge to controlled product and packaging specifications.'],
      ['Customization and production support', 'Each anonymous example connects product options with sampling, quality checkpoints, production planning, and shipment preparation.'],
      ['Buyer outcomes', 'Results focus on practical sourcing outputs such as approved specifications, aligned packaging, and repeat-order references without disclosing customer identities.'],
    ],
    faqs: [
      ['Are customer names disclosed?', 'No. The examples are anonymous and do not identify customer companies, brands, or confidential commercial details.'],
      ['What project types are included?', 'The page covers pet pads, adult underpads, charcoal pads, adhesive pads, waste bags, private label packaging, and coordinated supply.'],
      ['How can a buyer start a similar project?', 'Share the target market, product category, specification, packaging direction, quantity, and delivery destination through the OEM partnership request.'],
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
  '/privacy-policy': {
    title: 'Privacy Policy | JCZCARE',
    description: 'Read how Nantong JINCHENG ZENCARE collects, uses, stores, and protects information submitted through the JCZCARE website and B2B inquiry forms.',
    image: heroFallbackImage,
  },
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
    image: '/images/oem/factory/factory-campus-real-aerial-20260729.png',
  },
  '/pages/investor-relations': {
    title: 'Business Overview | JCZCARE Pet Care Manufacturing',
    description: 'A business overview of JCZCARE manufacturing capability, production capacity, quality focus, and B2B absorbent pet care product supply.',
    image: '/images/oem/factory/factory-campus-real-aerial-20260729.png',
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
      name: companyName,
      alternateName: ['JCZCARE', companyNameZh],
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
        name: companyName,
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
        name: companyName,
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
        name: companyName,
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
      publisher: { '@type': 'Organization', name: companyName },
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
  keywords,
  path,
  image,
  indexable = true,
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
  if (keywords?.length) {
    setHeadTag('meta[name="keywords"]', () => {
      const tag = document.createElement('meta');
      tag.setAttribute('name', 'keywords');
      return tag;
    }, 'content', keywords.join(', '));
  }
  setHeadTag('meta[name="robots"]', () => {
    const tag = document.createElement('meta');
    tag.setAttribute('name', 'robots');
    return tag;
  }, 'content', indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow');
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

function LanguageSwitcher() {
  const [activeLanguage, setActiveLanguage] = useState(getInitialSiteLanguage);
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef(null);
  const activeLanguageDetails = siteLanguages.find(({ code }) => code === activeLanguage) ?? siteLanguages[0];

  useEffect(() => {
    document.documentElement.lang = activeLanguage;
    document.documentElement.dataset.language = activeLanguage;
    window.googleTranslateElementInit = initializeGoogleTranslate;

    const existingScript = document.getElementById(googleTranslateScriptId);
    if (existingScript) {
      initializeGoogleTranslate();
      return undefined;
    }

    const script = document.createElement('script');
    script.id = googleTranslateScriptId;
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);

    return undefined;
  }, [activeLanguage]);

  useEffect(() => {
    const closeMenu = (event) => {
      if (!switcherRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeMenu);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeMenu);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const selectLanguage = (language) => {
    if (language === activeLanguage) {
      setIsOpen(false);
      return;
    }

    window.localStorage.setItem(languageStorageKey, language);
    setGoogleTranslateCookie(language);
    setActiveLanguage(language);
    window.location.reload();
  };

  return (
    <div className="language-switcher notranslate" translate="no" ref={switcherRef}>
      <button
        type="button"
        className="language-switcher-trigger"
        aria-label={`Language: ${activeLanguageDetails.label}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <Languages size={17} strokeWidth={1.8} aria-hidden="true" />
        <span>{activeLanguageDetails.shortLabel}</span>
      </button>
      {isOpen && (
        <div className="language-switcher-menu" role="menu" aria-label="Select language">
          {siteLanguages.map((language) => (
            <button
              type="button"
              role="menuitemradio"
              aria-checked={language.code === activeLanguage}
              className={language.code === activeLanguage ? 'is-active' : ''}
              key={language.code}
              onClick={() => selectLanguage(language.code)}
            >
              <span>{language.label}</span>
              {language.code === activeLanguage && <Check size={15} strokeWidth={2.1} aria-hidden="true" />}
            </button>
          ))}
          <small>Powered by Google Translate</small>
        </div>
      )}
      <div id="google_translate_element" className="google-translate-host" aria-hidden="true" />
    </div>
  );
}

function SiteNav({ navRef, ui }) {
  const activeLanguage = getInitialSiteLanguage();
  const labels = navigationTranslations[activeLanguage] ?? navigationTranslations.en;
  const isChinese = activeLanguage === 'zh-CN';
  const localizedCompanyName = isChinese ? companyNameZh : companyName;
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const closeMobileMenu = () => setMobileOpen(false);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.classList.remove('mobile-menu-open');
      return undefined;
    }

    document.body.classList.add('mobile-menu-open');
    const firstFocusable = menuRef.current?.querySelector('a, button');
    firstFocusable?.focus({ preventScroll: true });
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        toggleRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.classList.remove('mobile-menu-open');
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobileOpen]);

  return (
    <nav ref={navRef} className="nav">
      <a className="brand notranslate" translate="no" href="/#home" aria-label={`${localizedCompanyName} homepage`}>
        <span>
          <strong>{isChinese ? '\u5357\u901a\u9526\u7a0b\u81fb\u62a4' : 'Nantong JINCHENG ZENCARE'}</strong>
          <small>{isChinese ? '\u79d1\u6280\u6709\u9650\u516c\u53f8' : 'Technology Company'}</small>
        </span>
      </a>
      <button
        type="button"
        className="nav-mobile-toggle"
        ref={toggleRef}
        aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={mobileOpen}
        aria-controls="site-navigation-links"
        onClick={() => setMobileOpen((open) => !open)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div id="site-navigation-links" ref={menuRef} className={`nav-links notranslate${mobileOpen ? ' is-open' : ''}`} translate="no" aria-label={labels.ariaLabel}>
        <a href="/" onClick={closeMobileMenu}>{labels.home}</a>
        <a href="/factory" onClick={closeMobileMenu}>{labels.factory}</a>
        <ProductMegaMenu label={labels.products} onNavigate={closeMobileMenu} />
        <a href="/oem-process" onClick={closeMobileMenu}>{labels.oemProcess}</a>
        <a href="/quality-control" onClick={closeMobileMenu}>{labels.quality}</a>
        <a href="/blog" onClick={closeMobileMenu}>{labels.resources}</a>
        <a href="/#contact" onClick={closeMobileMenu}>{labels.contact}</a>
      </div>
      <a className="nav-cta notranslate" translate="no" href="/request-product-plan?product=oem-pet-pad-project">
        {labels.quote}
        <ArrowUpRight size={18} strokeWidth={1.8} />
      </a>
      <LanguageSwitcher />
      <button type="button" className={`nav-mobile-backdrop${mobileOpen ? ' is-visible' : ''}`} aria-label="Close navigation" onClick={closeMobileMenu} tabIndex={mobileOpen ? 0 : -1} />
      <div className="mobile-conversion-bar" aria-label="Quick contact actions">
        <a className="mobile-conversion-whatsapp" href={whatsappChatUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true" /> WhatsApp</a>
        <a className="mobile-conversion-quote" href="/request-product-plan?product=oem-pet-pad-project"><ArrowUpRight size={18} aria-hidden="true" /> Request Quote</a>
      </div>
    </nav>
  );
}

function ProductProcurementModules({ product }) {
  const details = productProcurementDetails[product.slug];
  const technicalSpecs = productTechnicalSpecs[product.slug] || productTechnicalSpecs.default;

  if (!details) {
    return null;
  }

  return (
    <section className="product-procurement-section" aria-labelledby={`${product.slug}-procurement-title`}>
      <div className="product-procurement-heading">
        <p className="section-kicker">B2B Product Configuration</p>
        <h2 id={`${product.slug}-procurement-title`}>Evaluate the product before requesting a sample.</h2>
        <p>Review the application, material structure, customization scope, and OEM entry points used to prepare a buyer-ready specification.</p>
      </div>

      <section className="product-buyer-module product-overview-module" aria-labelledby={`${product.slug}-overview-title`}>
        <div className="product-module-heading">
          <span>01</span>
          <div>
            <p className="section-kicker">Product Overview</p>
            <h3 id={`${product.slug}-overview-title`}>{product.title} procurement overview</h3>
          </div>
        </div>
        <div className="product-overview-grid">
          {[
            ['Product Use', details.overview.purpose],
            ['Target Customers', details.overview.buyers],
            ['Application Scenarios', details.overview.scenarios],
          ].map(([title, text]) => (
            <article key={title}>
              <h4>{title}</h4>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="product-size-row">
          <strong>Available Sizes</strong>
          <div>{details.sizes.map((size) => <span key={size}>{size}</span>)}</div>
        </div>
      </section>

      <section className="product-buyer-module" aria-labelledby={`${product.slug}-features-title`}>
        <div className="product-module-heading">
          <span>02</span>
          <div>
            <p className="section-kicker">Key Features</p>
            <h3 id={`${product.slug}-features-title`}>Commercial features buyers can specify.</h3>
          </div>
        </div>
        <div className="product-feature-grid">
          {details.features.map((feature) => (
            <article key={feature}>
              <ShieldCheck size={20} strokeWidth={1.7} />
              <strong>{feature}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="product-buyer-module" aria-labelledby={`${product.slug}-materials-title`}>
        <div className="product-module-heading">
          <span>03</span>
          <div>
            <p className="section-kicker">Material Structure</p>
            <h3 id={`${product.slug}-materials-title`}>Material choices linked to product performance.</h3>
          </div>
        </div>
        <div className="product-material-list">
          {details.materials.map(([material, impact], index) => (
            <article key={material}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h4>{material}</h4>
                <p>{impact}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="product-buyer-module product-technical-module" aria-labelledby={`${product.slug}-technical-title`}>
        <div className="product-module-heading">
          <span>04</span>
          <div>
            <p className="section-kicker">Technical Specification</p>
            <h3 id={`${product.slug}-technical-title`}>Specification fields for buyer review.</h3>
          </div>
        </div>
        <dl className="product-specification-table">
          {technicalSpecs.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="product-buyer-module" aria-labelledby={`${product.slug}-customization-title`}>
        <div className="product-module-heading">
          <span>05</span>
          <div>
            <p className="section-kicker">Customization Options</p>
            <h3 id={`${product.slug}-customization-title`}>Define the specification for your market.</h3>
          </div>
        </div>
        <div className="product-customization-grid">
          {details.customization.map(([option, description]) => (
            <article key={option}>
              <h4>{option}</h4>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="product-buyer-module product-oem-entry" aria-labelledby={`${product.slug}-oem-entry-title`}>
        <div>
          <div className="product-module-heading">
            <span>06</span>
            <div>
              <p className="section-kicker">OEM Process Entry</p>
              <h3 id={`${product.slug}-oem-entry-title`}>Start with a sample or a commercial brief.</h3>
            </div>
          </div>
          <p>{details.oemSupport}</p>
        </div>
        <div className="product-oem-actions">
          <a className="product-action-secondary" data-product-cta="sample" href={`/request-product-plan?product=${product.slug}&request=sample`}>
            Request Sample
            <ArrowUpRight size={17} />
          </a>
          <a className="product-action-primary" data-product-cta="quote" href={`/request-product-plan?product=${product.slug}&request=quote`}>
            Request Quote
            <ArrowUpRight size={17} />
          </a>
        </div>
      </section>

      <section className="product-buyer-module" aria-labelledby={`${product.slug}-applications-title`}>
        <div className="product-module-heading">
          <span>07</span>
          <div>
            <p className="section-kicker">Application</p>
            <h3 id={`${product.slug}-applications-title`}>Prepared for major B2B sales channels.</h3>
          </div>
        </div>
        <div className="product-channel-grid">
          {productBuyerChannels.map(([channel, description]) => (
            <article key={channel}>
              <h4>{channel}</h4>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="product-rfq-cta" aria-labelledby={`${product.slug}-rfq-title`}>
        <div>
          <p className="section-kicker">RFQ</p>
          <h3 id={`${product.slug}-rfq-title`}>Send your target specification and order plan.</h3>
          <p>Include market, size, material direction, packaging, estimated quantity, and delivery destination.</p>
        </div>
        <a data-product-cta="rfq" href={`/request-product-plan?product=${product.slug}`}>
          Request OEM Quote
          <ArrowUpRight size={18} />
        </a>
      </section>
    </section>
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
              Request OEM Quote
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
        <div className="product-b2b-grid product-b2b-summary-grid">
          <article>
            <p className="section-kicker">Product Overview</p>
            <h2>{product.title} for OEM and private-label buyers</h2>
            <p>{product.summary} JCZCARE helps buyers confirm product structure, package format, sample purpose, and repeat-order control before mass production.</p>
          </article>
          <article>
            <p className="section-kicker">Applications</p>
            <ul className="application-list">
              {productApplications.map((application) => <li key={application}>{application}</li>)}
            </ul>
          </article>
        </div>
        <ProductProcurementModules product={product} />
        <div className="product-quote-band">
          <div>
            <p className="section-kicker">OEM Quote</p>
            <h2>Share size, absorbency, packaging, and monthly quantity.</h2>
          </div>
          <a href={`/request-product-plan?product=${product.slug}`}>Request OEM Quote <ArrowUpRight size={18} /></a>
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

function FooterSocialLinks() {
  return (
    <nav className="footer-social-links" aria-label="JCZ Care social media">
      {socialLinks.map(({ label, href, icon: Icon }) => (
        <a
          className="footer-social-link"
          data-social={label.toLowerCase()}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit JCZ Care on ${label}`}
          title={`Visit JCZ Care on ${label}`}
          key={label}
        >
          <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}

function SiteFooter({ ui, topHref = '#adult-underpads-top' }) {
  const [openGroups, setOpenGroups] = useState(() => {
    const openByDefault = !window.matchMedia('(max-width: 767px)').matches;
    return Object.fromEntries(footerLinkGroups.map((group) => [group.title, openByDefault]));
  });

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const syncGroups = () => {
      const openByDefault = !query.matches;
      setOpenGroups(Object.fromEntries(footerLinkGroups.map((group) => [group.title, openByDefault])));
    };
    query.addEventListener?.('change', syncGroups);
    return () => query.removeEventListener?.('change', syncGroups);
  }, []);

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
          <a href="/request-product-plan?product=oem-partnership" aria-label="Start an OEM partnership">
            <ArrowUpRight size={20} />
            Start OEM Partnership
          </a>
          <FooterSocialLinks />
          <a className="footer-top-link" href={topHref}>
            <ArrowUp size={20} />
            {ui.top}
          </a>
        </div>
      </div>
      <div className="footer-links-band">
        <div className="container footer-links-inner">
          <div className="footer-links" aria-label="Footer links">
            {footerLinkGroups.map((group) => (
              <details className="footer-link-group" key={group.title} open={openGroups[group.title]} onToggle={(event) => { const isOpen = event.currentTarget.open; setOpenGroups((state) => ({ ...state, [group.title]: isOpen })); }}>
                <summary>{group.title}<span aria-hidden="true">+</span></summary>
                <nav aria-label={group.title}>
                  {group.labels.map((label) => {
                    const link = footerLinks.find((item) => item.label === label);
                    return link ? <a key={link.label} href={link.href}>{link.label}</a> : null;
                  })}
                </nav>
              </details>
            ))}
          </div>
        </div>
      </div>
      <div className="container footer-legal">
        <span className="notranslate" translate="no">{companyName}</span>
        <a href={buildMailto('Website Inquiry')}>{contactEmail}</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/terms">Terms</a>
        <small>Copyright {new Date().getFullYear()} JCZCARE. All rights reserved.</small>
      </div>
    </footer>
  );
}

const privacyPolicySections = [
  {
    id: 'scope',
    title: '1. Scope',
    content: (
      <p>
        This Privacy Policy explains how Nantong JINCHENG ZENCARE Technology Company ("JCZCARE", "we", "us", or "our") handles personal information when you visit jczcare.com, review our products and manufacturing services, or contact us about an OEM, ODM, private-label, sample, or supply project.
      </p>
    ),
  },
  {
    id: 'information-we-collect',
    title: '2. Information We Collect',
    content: (
      <>
        <p>We may collect information that you choose to provide through an inquiry form, email, WhatsApp, or other direct communication, including:</p>
        <ul>
          <li>Your name, company name, company website, and job role.</li>
          <li>Your work email address, phone or WhatsApp number, and country or region.</li>
          <li>Product interests, estimated quantity, target market, specifications, packaging direction, and project requirements.</li>
          <li>Messages, attachments, sample requests, quotation details, and subsequent business correspondence.</li>
        </ul>
        <p>When you use the website, we may also receive technical and usage information such as browser and device type, IP address, approximate location derived from IP, pages viewed, referring page, visit time, button interactions, form events, and campaign parameters such as UTM values, fbclid, and gclid.</p>
      </>
    ),
  },
  {
    id: 'how-we-use-information',
    title: '3. How We Use Information',
    content: (
      <>
        <p>We use information for legitimate business purposes connected with our B2B manufacturing services, including to:</p>
        <ul>
          <li>Respond to inquiries and prepare product, sample, quotation, packaging, and production plans.</li>
          <li>Communicate about specifications, orders, delivery, quality, service, and ongoing cooperation.</li>
          <li>Operate, secure, troubleshoot, and improve the website and inquiry process.</li>
          <li>Understand website performance and the effectiveness of business marketing campaigns.</li>
          <li>Comply with applicable legal, tax, accounting, export, and recordkeeping obligations.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'analytics-and-storage',
    title: '4. Analytics, Cookies, and Browser Storage',
    content: (
      <>
        <p>On our production website, we use Google Analytics 4 (measurement ID G-7WBQ3V257N) to understand page views, form activity, completed inquiries, errors, sample requests, and contact-link interactions. Analytics event values are restricted to avoid sending email addresses or phone numbers.</p>
        <p>We also use Meta Pixel (pixel ID 1532666838061135) on our production domains to measure page views and confirmed lead events. Google and Meta may process device, browser, network, and interaction data under their own privacy terms.</p>
        <p>The website may use cookies, local storage, and session storage to remember language and region preferences, support Google Translate, prevent duplicate event reporting, and retain first-visit and latest-visit attribution such as campaign parameters, landing page, external referrer origin, and visit timestamps. The language preference cookie may remain for up to one year. You can clear or block cookies and browser storage in your browser settings, although some preferences or website functions may then be unavailable.</p>
      </>
    ),
  },
  {
    id: 'service-providers',
    title: '5. Service Providers and International Transfers',
    content: (
      <>
        <p>We use service providers that help us host, protect, measure, and operate the website and deliver inquiries. These may include Vercel for hosting, Cloudflare Turnstile for abuse prevention, Google for analytics and translation, Meta for advertising measurement, and email or delivery providers such as SMTP services or Resend.</p>
        <p>These providers process information only for the relevant service and under their own contractual and privacy obligations. Because JCZCARE is located in China and our providers and customers may operate in other countries, information may be processed outside your country. Where applicable, we take reasonable steps to use appropriate safeguards for such transfers.</p>
        <p>We do not sell personal information. We may disclose information when required by law, to protect our rights or systems, or as part of a corporate transaction subject to appropriate confidentiality protections.</p>
      </>
    ),
  },
  {
    id: 'retention',
    title: '6. Retention',
    content: (
      <p>
        We retain personal information only for as long as reasonably necessary to respond to and manage your project, maintain business records, protect website security, resolve disputes, and meet legal or regulatory obligations. Retention periods vary according to the type of information and the purpose for which it is used.
      </p>
    ),
  },
  {
    id: 'security',
    title: '7. Security',
    content: (
      <p>
        We use reasonable administrative, technical, and organizational measures intended to protect information against unauthorized access, loss, misuse, or alteration. Cloudflare Turnstile is used on inquiry forms to reduce automated abuse. No internet transmission or storage system is completely secure, so we cannot guarantee absolute security.
      </p>
    ),
  },
  {
    id: 'rights-and-choices',
    title: '8. Your Rights and Choices',
    content: (
      <>
        <p>Depending on your location, you may have rights to request access to, correction of, deletion of, restriction of, or a copy of your personal information, and to object to or withdraw consent for certain processing.</p>
        <p>You may control cookies and browser storage through your browser, use browser privacy controls, or contact us to make a privacy request. We may need to verify your identity before completing a request, and some information may be retained where required by law or for legitimate legal and security purposes.</p>
      </>
    ),
  },
  {
    id: 'children',
    title: '9. Children',
    content: (
      <p>
        Our website is intended for business customers and is not directed to children. We do not knowingly collect personal information from children. If you believe a child has provided information to us, please contact us so that we can review and, where appropriate, delete it.
      </p>
    ),
  },
  {
    id: 'changes',
    title: '10. Changes to This Policy',
    content: (
      <p>
        We may update this Privacy Policy to reflect changes in our website, services, providers, or legal obligations. The effective date at the top of this page identifies the latest version. Material updates will be posted on this standalone URL.
      </p>
    ),
  },
];

function PrivacyPolicyPage() {
  return (
    <div className="privacy-page" id="privacy-policy-top">
      <div className="container privacy-shell">
        <header className="privacy-hero">
          <a className="privacy-back-link" href="/">Back to JCZCARE</a>
          <p className="section-kicker">Legal / Privacy</p>
          <h1>Privacy Policy</h1>
          <p className="privacy-lead">How JCZCARE collects, uses, stores, and protects information from website visitors and B2B customers.</p>
          <p className="privacy-effective-date"><strong>Effective date:</strong> August 28, 2026</p>
        </header>

        <div className="privacy-layout">
          <aside className="privacy-toc" aria-label="Privacy Policy contents">
            <strong>On this page</strong>
            <nav>
              {privacyPolicySections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title.replace(/^\d+\.\s*/, '')}</a>)}
              <a href="#contact-privacy">Contact Us</a>
            </nav>
          </aside>

          <article className="privacy-content">
            {privacyPolicySections.map((section) => (
              <section className="privacy-section" id={section.id} key={section.id}>
                <h2>{section.title}</h2>
                {section.content}
              </section>
            ))}

            <section className="privacy-section privacy-contact" id="contact-privacy">
              <h2>11. Contact Us</h2>
              <p>For questions about this policy or to exercise a privacy right, contact:</p>
              <address>
                <strong>Nantong JINCHENG ZENCARE Technology Company</strong>
                <span>Nantong, Jiangsu, China</span>
                <a href={buildMailto('Privacy Request')}>{contactEmail}</a>
                <a href={whatsappChatUrl} target="_blank" rel="noopener noreferrer">Phone / WhatsApp: {whatsappPhone}</a>
              </address>
            </section>
          </article>
        </div>
      </div>
    </div>
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

        <ProductProcurementModules product={adultUnderpadProduct} />

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
          <div className="business-seo-actions blog-hero-actions">
            <a href="/request-product-plan?product=blog-reader">Request OEM Quote <ArrowUpRight size={18} /></a>
            <a href="/oem-process">View OEM Process <ArrowUpRight size={18} /></a>
          </div>
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
              <a href="/authors/jczcare-editorial-team">{article.author}</a>
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
                <a href="/private-label">OEM/ODM customization</a>
                <a href="/factory">Factory resources</a>
                <a href="/products/disposable-pet-pads">Disposable pet pads</a>
                <a href="/about-factory">Factory advantages</a>
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
            <a href={`/request-product-plan?product=${article.slug}`}>
              Request OEM Quote
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
          <OptimizedImage
            src={page.image}
            alt={page.imageAlt}
            loading="eager"
            fetchPriority="high"
          />
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

function OemCapabilityPage() {
  const productionSteps = [
    ['01', 'Requirement Review', 'Confirm market, product category, target specification, estimated volume, packaging direction, and delivery destination.'],
    ['02', 'Specification Planning', 'Define size, weight, absorbency, layer structure, functional options, pack count, and acceptance criteria.'],
    ['03', 'Material Selection', 'Review nonwoven, tissue or absorbent paper, fluff pulp, SAP, PE film, and project-specific options.'],
    ['04', 'Sample Development', 'Prepare controlled samples for dimensions, structure, performance, handling, and buyer evaluation.'],
    ['05', 'Production Release', 'Transfer the approved specification to material planning, line setup, scheduling, and in-process controls.'],
    ['06', 'Quality Verification', 'Check dimensions, weight, absorption, rewet, leakage, sealing, appearance, and pack consistency.'],
    ['07', 'Packaging Approval', 'Confirm artwork, bag format, pack count, labels, carton marks, and export packing requirements.'],
    ['08', 'Shipment Coordination', 'Complete finished-goods release, loading preparation, documentation, and delivery coordination.'],
  ];
  const customizationCapabilities = [
    [Ruler, 'Size & Format', 'Standard market sizes or buyer-defined dimensions, folding, pack count, and carton configuration.'],
    [Layers3, 'Material Structure', 'Surface material, core combination, SAP direction, backing film, and functional layers.'],
    [Droplets, 'Performance Target', 'Absorption, liquid intake, diffusion, rewet, leakage, and product weight direction.'],
    [Factory, 'Production Configuration', 'Specification-controlled line setup, product format, and planned volume requirements.'],
    [FlaskConical, 'Sample Development', 'Documented sample versions for product, performance, and packaging review.'],
    [ShieldCheck, 'Private Label Support', 'Artwork workflow, printed packaging, labels, carton marks, and repeat-order references.'],
  ];
  const qualityStages = [
    ['Incoming Material Inspection', 'Review material type, weight, appearance, project reference, and release status before production.'],
    ['Production Inspection', 'Monitor dimensions, product weight, material placement, sealing, folding, count, and line consistency.'],
    ['Finished Product Testing', 'Verify absorption, diffusion, rewet, leakage, appearance, packing, carton marks, and release evidence.'],
  ];
  const globalSupplyCapabilities = [
    ['Export Packing', 'Coordinate inner packs, cartons, shipping marks, pallet direction, and loading preparation.'],
    ['Buyer Documentation', 'Prepare product specifications, packing references, quality records, and shipment information for project review.'],
    ['Delivery Coordination', 'Align order planning with destination, shipment requirements, production timing, and logistics communication.'],
    ['Repeat Supply', 'Maintain approved specification and packaging references to support repeat-order consistency.'],
  ];

  return (
    <section className="oem-capability-page">
      <div className="container oem-capability-shell">
        <header className="oem-capability-hero">
          <div className="oem-capability-hero-copy">
            <p className="section-kicker">B2B Pet Hygiene Manufacturing</p>
            <h1>OEM capability for European and American buyers.</h1>
            <p>Evaluate manufacturing, customization, quality control, and global supply through one factory cooperation framework built for brands, retailers, distributors, importers, wholesalers, and procurement teams.</p>
            <div className="oem-capability-actions">
              <a href="/request-product-plan?product=oem-capability">
                Request OEM Quote
                <ArrowUpRight size={18} />
              </a>
              <a href="/products/disposable-pet-pads">
                Review Product Platform
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
          <div className="oem-capability-hero-media">
            <OptimizedImage
              src="/images/oem/factory/factory-campus-real-aerial-20260729.png"
              alt="Pet hygiene products OEM manufacturing facility"
              loading="eager"
              fetchPriority="high"
            />
            <div>
              <span>Factory direct</span>
              <span>OEM / ODM</span>
              <span>Global B2B supply</span>
            </div>
          </div>
        </header>

        <section className="oem-capability-page-section" aria-labelledby="oem-manufacturing-overview-title">
          <div className="oem-capability-heading">
            <span>01</span>
            <div>
              <p className="section-kicker">Manufacturing Overview</p>
              <h2 id="oem-manufacturing-overview-title">Factory capacity buyers can evaluate.</h2>
              <p>Production resources, absorbent product experience, and export-order coordination are connected through one specification-controlled manufacturing system.</p>
            </div>
          </div>
          <div className="oem-capability-overview">
            <div className="oem-capability-media">
              <OptimizedImage src="/images/oem/production/factory-production-line-real-20260729.jpg" alt="Automated pet hygiene product production line" />
            </div>
            <div className="oem-capability-stat-grid">
              {[
                ['12,000 sq.m', 'Manufacturing Base', 'Production, quality review, packing, and export preparation.'],
                ['8 Lines', 'Automated Equipment', 'Planned line resources for absorbent hygiene product programs.'],
                ['300M pcs', 'Planned Annual Capacity', 'Volume planning supported by automated manufacturing resources.'],
                ['20 Years', 'Manufacturing Experience', 'Experience in absorbent hygiene products and B2B supply.'],
              ].map(([value, title, text]) => (
                <article key={title}>
                  <strong>{value}</strong>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="oem-capability-page-section" aria-labelledby="oem-production-process-title">
          <div className="oem-capability-heading">
            <span>02</span>
            <div>
              <p className="section-kicker">Production Process</p>
              <h2 id="oem-production-process-title">From buyer brief to shipment release.</h2>
              <p>The cooperation process links commercial requirements to controlled specifications, samples, production, inspection, packaging, and shipment.</p>
            </div>
          </div>
          <div className="oem-capability-process-media">
            <OptimizedImage src="/images/oem/production/factory-production-line-02.webp" alt="Pet hygiene products factory production workflow" />
          </div>
          <ol className="oem-capability-process-list">
            {productionSteps.map(([number, title, text]) => (
              <li key={title}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="oem-capability-page-section" aria-labelledby="oem-customization-capability-title">
          <div className="oem-capability-heading">
            <span>03</span>
            <div>
              <p className="section-kicker">Customization Capability</p>
              <h2 id="oem-customization-capability-title">Configure the product for your market and channel.</h2>
              <p>Customization is reviewed as a connected product system so materials, performance, packaging, and production remain aligned.</p>
            </div>
          </div>
          <div className="oem-capability-customization">
            <div className="oem-capability-media">
              <OptimizedImage src="/images/oem/production/factory-lamination-01.webp" alt="Factory lamination equipment for customized absorbent products" />
            </div>
            <div className="oem-capability-custom-grid">
              {customizationCapabilities.map(([Icon, title, text]) => (
                <article key={title}>
                  <span><Icon size={21} strokeWidth={1.7} /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="oem-capability-page-section" aria-labelledby="oem-quality-system-title">
          <div className="oem-capability-heading">
            <span>04</span>
            <div>
              <p className="section-kicker">Quality Control System</p>
              <h2 id="oem-quality-system-title">Quality checkpoints tied to the approved specification.</h2>
              <p>Inspection starts with incoming materials, continues during production, and finishes with product, packaging, and release review.</p>
            </div>
          </div>
          <div className="oem-capability-split">
            <div className="oem-capability-media">
              <OptimizedImage src="/images/oem/quality/factory-quality-control-01.webp" alt="Factory quality inspection for absorbent hygiene products" />
            </div>
            <div className="oem-capability-stage-list">
              {qualityStages.map(([title, text], index) => (
                <article key={title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
              <a href="/quality-control">Review Quality Control System <ArrowUpRight size={17} /></a>
            </div>
          </div>
        </section>

        <section className="oem-capability-page-section" aria-labelledby="oem-global-supply-title">
          <div className="oem-capability-heading">
            <span>05</span>
            <div>
              <p className="section-kicker">Global Supply Capability</p>
              <h2 id="oem-global-supply-title">Export coordination for repeat B2B supply.</h2>
              <p>Finished goods, export packing, buyer documentation, and delivery communication are reviewed as part of the order plan.</p>
            </div>
          </div>
          <div className="oem-capability-split oem-capability-supply">
            <div className="oem-capability-supply-list">
              {globalSupplyCapabilities.map(([title, text]) => (
                <article key={title}>
                  <Truck size={20} strokeWidth={1.7} />
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="oem-capability-media">
              <OptimizedImage src="/images/oem/warehouse/warehouse-finished-goods-01.webp" alt="Finished goods warehouse prepared for global OEM supply" />
            </div>
          </div>
        </section>

        <section className="oem-capability-cta" aria-labelledby="oem-capability-cta-title">
          <div>
            <p className="section-kicker">06 Request OEM Quote</p>
            <h2 id="oem-capability-cta-title">Share your product brief with the factory team.</h2>
            <p>Send the target market, product category, specification, packaging direction, estimated quantity, and delivery destination for review.</p>
          </div>
          <a href="/request-product-plan?product=oem-capability">
            Request OEM Quote
            <ArrowUpRight size={18} />
          </a>
        </section>
      </div>
    </section>
  );
}

function CaseStudyPage() {
  const cases = [
    {
      number: '01',
      title: 'Private-Label Pet Pad Program',
      market: 'European brand program',
      image: '/images/oem/products/products-disposable-pads-01.webp',
      imageAlt: 'Disposable pet pad product for an anonymous private-label OEM project example',
      summary: 'A pet care brand needed a clear product and packaging route for retail and online channels without losing control of repeat-order specifications.',
      details: [
        ['Industry', 'European pet care brand serving retail and e-commerce channels.'],
        ['Challenge', 'Align absorption, product feel, pack count, and private-label presentation for multiple sales channels.'],
        ['Solution', 'Create a controlled product brief, compare sample directions, and confirm measurable product and packaging requirements before production.'],
        ['Customization', 'Size, product weight, SAP direction, surface embossing, pack count, printed bag artwork, and carton marks.'],
        ['Production Support', 'Material review, sample version control, line setup, absorption and leakage checks, packaging approval, and shipment preparation.'],
        ['Result', 'A buyer-approved product and packaging reference prepared for repeat-order planning and channel rollout.'],
      ],
    },
    {
      number: '02',
      title: 'Adult Underpad Retail Program',
      market: 'North American retail program',
      image: '/images/oem/products/products-underpads-01.webp',
      imageAlt: 'Adult disposable underpad for an anonymous retailer OEM project example',
      summary: 'A retailer required an underpad specification that could serve home-care demand while remaining clear for packaging, quality review, and replenishment planning.',
      details: [
        ['Industry', 'North American retailer with healthcare and home-care product categories.'],
        ['Challenge', 'Define a soft, leak-resistant underpad with an appropriate absorption direction and retail-ready pack structure.'],
        ['Solution', 'Translate the channel brief into size, core, backing, packing, and acceptance requirements supported by sample review.'],
        ['Customization', 'Care dimensions, core weight, SAP ratio, surface direction, PE backing, folding, pack count, and private-label packaging.'],
        ['Production Support', 'Incoming material verification, product weight and size checks, absorption and rewet review, pack inspection, and carton confirmation.'],
        ['Result', 'A documented underpad specification and pack configuration ready for purchasing review and repeat production control.'],
      ],
    },
    {
      number: '03',
      title: 'Charcoal Pad Product Range',
      market: 'Regional distributor program',
      image: '/images/oem/products/products-charcoal-pads-01.webp',
      imageAlt: 'Charcoal pet pad for an anonymous distributor OEM project example',
      summary: 'A distributor wanted a differentiated odor-control range while keeping the underlying absorbent performance and supply workflow practical.',
      details: [
        ['Industry', 'Pet hygiene distributor supplying regional retail and wholesale accounts.'],
        ['Challenge', 'Add an odor-control direction without creating unclear performance expectations or an unstable production specification.'],
        ['Solution', 'Review carbon-layer options alongside absorbency, surface, backing, pack positioning, and sample acceptance criteria.'],
        ['Customization', 'Activated-carbon direction, pad size, product weight, SAP ratio, surface pattern, backing color, pack count, and artwork.'],
        ['Production Support', 'Functional sample preparation, absorption and rewet checks, line specification control, packaging review, and finished-goods release.'],
        ['Result', 'A differentiated charcoal-pad specification aligned to distributor positioning and repeat supply references.'],
      ],
    },
    {
      number: '04',
      title: 'Adhesive Pad Online Launch',
      market: 'Global online brand program',
      image: '/images/oem/products/products-adhesive-pads-01.webp',
      imageAlt: 'Adhesive pet pad for an anonymous online brand OEM project example',
      summary: 'An online pet brand needed a stability-focused pad that could be explained clearly to buyers and packed efficiently for e-commerce fulfillment.',
      details: [
        ['Industry', 'Online pet brand serving direct-to-consumer and marketplace channels.'],
        ['Challenge', 'Balance adhesive placement, clean-removal direction, absorption, pack dimensions, and product differentiation.'],
        ['Solution', 'Develop sample variants around backing and adhesive placement, then confirm product and pack requirements against the approved brief.'],
        ['Customization', 'Pad size, absorption level, adhesive position, backing structure, folding, pack count, artwork, and carton configuration.'],
        ['Production Support', 'Sample identification, backing review, dimensions and weight checks, absorption testing, pack inspection, and order reference control.'],
        ['Result', 'A channel-ready adhesive-pad specification with approved sample and packaging references for production planning.'],
      ],
    },
    {
      number: '05',
      title: 'Coordinated Multi-Category Supply',
      market: 'International importer program',
      image: '/images/oem/products/custom-pet-waste-bags-ai.webp',
      imageAlt: 'Pet waste bags for an anonymous multi-category OEM supply example',
      summary: 'An importer wanted to coordinate pet pads and waste bags under one purchasing framework while keeping each product specification independently controlled.',
      details: [
        ['Industry', 'International importer and distributor managing multiple pet hygiene categories.'],
        ['Challenge', 'Coordinate different product materials, pack formats, artwork files, carton requirements, and shipment preparation.'],
        ['Solution', 'Use separate controlled specifications for each category with one project schedule, packaging review process, and shipment communication plan.'],
        ['Customization', 'Pet pad size and absorbency, waste-bag material and thickness, roll count, color, printing, private-label packs, and carton marks.'],
        ['Production Support', 'Category-specific samples, artwork status tracking, production scheduling, quality checkpoints, packing review, and export coordination.'],
        ['Result', 'An aligned multi-category sourcing framework with clear product references, packaging status, and repeat-order responsibilities.'],
      ],
    },
  ];

  return (
    <section className="oem-case-study-page">
      <div className="container oem-case-study-shell">
        <header className="oem-case-study-hero">
          <div>
            <p className="section-kicker">Anonymous OEM Project Examples</p>
            <h1>OEM project examples for global pet care buyers.</h1>
            <p>Five representative sourcing briefs showing how product requirements can move through customization, sampling, production support, quality review, packaging, and repeat-order preparation.</p>
            <a href="/request-product-plan?product=oem-partnership">
              Request OEM Partnership
              <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="oem-case-study-hero-media">
            <OptimizedImage
              src="/images/oem/production/factory-production-line-03.webp"
              alt="Pet hygiene products OEM factory production line"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </header>

        <div className="oem-case-study-disclosure" role="note">
          <ShieldCheck size={22} strokeWidth={1.7} />
          <div>
            <strong>Anonymous by design</strong>
            <p>These examples do not identify customer companies, brand names, or confidential commercial details. Results describe sourcing outputs without invented sales figures.</p>
          </div>
        </div>

        <div className="oem-case-study-audience" aria-label="Target buyer groups">
          {[
            ['Pet Brands', 'Private-label product and packaging development'],
            ['Retailers', 'Channel specifications and replenishment planning'],
            ['Distributors', 'Differentiated ranges and repeat supply control'],
          ].map(([title, text]) => (
            <div key={title}>
              <strong>{title}</strong>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <section className="oem-case-study-list" aria-labelledby="oem-case-study-list-title">
          <div className="oem-case-study-heading">
            <p className="section-kicker">Five Project Profiles</p>
            <h2 id="oem-case-study-list-title">Different channels. One controlled OEM workflow.</h2>
            <p>Each case follows the same buyer evaluation structure: industry context, sourcing challenge, proposed solution, customization scope, production support, and practical result.</p>
          </div>

          {cases.map((project) => (
            <article className="oem-case-study-card" key={project.number}>
              <div className="oem-case-study-card-heading">
                <span>{project.number}</span>
                <div>
                  <p>Anonymous Case {project.number}</p>
                  <h2>{project.title}</h2>
                  <small>{project.market}</small>
                </div>
              </div>
              <div className="oem-case-study-card-intro">
                <div className="oem-case-study-card-media">
                  <OptimizedImage src={project.image} alt={project.imageAlt} />
                </div>
                <p>{project.summary}</p>
              </div>
              <dl className="oem-case-study-details">
                {project.details.map(([label, text]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </section>

        <section className="oem-case-study-cta" aria-labelledby="oem-case-study-cta-title">
          <div>
            <p className="section-kicker">OEM Cooperation</p>
            <h2 id="oem-case-study-cta-title">Build the next product brief with our factory team.</h2>
            <p>Share your target market, product category, specification, packaging direction, estimated quantity, and delivery destination.</p>
          </div>
          <a href="/request-product-plan?product=oem-partnership">
            Request OEM Partnership
            <ArrowUpRight size={18} />
          </a>
        </section>
      </div>
    </section>
  );
}

function MaterialInnovationSection({ materialTerminology }) {
  return (
    <section className="section innovation" id="innovation">
      <div className="container innovation-grid">
        <div className="innovation-copy">
          <p className="section-kicker">Material Technology</p>
          <h2>
            Material choices engineered for <em className="title-key">target performance</em>.
          </h2>
          <p>
            <span className="notranslate" translate="no">{materialTerminology.introduction}</span>
          </p>
        </div>
        <div className="innovation-cards">
          {innovations.map(({ icon: Icon, title, text, image, materialTerminology: isMaterialTerminology }) => {
            const displayTitle = isMaterialTerminology ? materialTerminology.title : title;
            const displayText = isMaterialTerminology ? materialTerminology.text : text;

            return (
              <article className="innovation-card" key={title}>
                <OptimizedImage src={image} alt={`${title} material detail`} />
                <div className="innovation-card-copy">
                  <div className="icon-box">
                    <Icon size={24} strokeWidth={1.7} />
                  </div>
                  <div>
                    <h3 className={isMaterialTerminology ? 'notranslate' : undefined} translate={isMaterialTerminology ? 'no' : undefined}>{displayTitle}</h3>
                    <p className={isMaterialTerminology ? 'notranslate' : undefined} translate={isMaterialTerminology ? 'no' : undefined}>{displayText}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function OemProcessPage({ materialTerminology }) {
  return (
    <section className="business-seo-page process-page">
      <div className="container business-seo-shell">
        <div className="business-seo-hero">
          <div className="process-hero-copy">
            <p className="section-kicker">OEM/ODM Process</p>
            <h1>OEM/ODM Pet Pad Manufacturing Process</h1>
            <p>Move from product requirement to approved sample, mass production, quality inspection, and global shipment with a clear B2B workflow.</p>
            <div className="business-seo-actions">
              <a href="/request-product-plan?product=oem-process">Request OEM Quote <ArrowUpRight size={18} /></a>
              <a href="/private-label">Private Label Options <ArrowUpRight size={18} /></a>
            </div>
          </div>
          <div className="process-hero-media" aria-hidden="true">
            <OptimizedImage src={b2bImage('oem-sample-review')} alt="" loading="eager" />
          </div>
        </div>
        <OemProcessBusinessContent />
        <MaterialInnovationSection materialTerminology={materialTerminology} />
        <CustomizationTimeline />
        <ShippingSolution />
        <section className="section quality" id="quality">
          <div className="container quality-layout">
            <div className="quality-visual">
              <OptimizedImage
                src="/images/oem/quality/quality-absorbency-batch-test-20260806.jpg"
                alt="Pet pad absorbency batch test in the quality laboratory"
                loading="eager"
              />
              <div className="quality-badge">
                <Microscope size={20} />
                <span>Batch Inspection</span>
              </div>
            </div>
            <div className="quality-content">
              <p className="section-kicker">Quality Control</p>
              <h2>
                Inspection from incoming material to <em className="title-key">finished goods</em>.
              </h2>
              <p>
                Quality checks focus on specification consistency, absorbency, sealing, packaging, and shipment readiness.
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
        <section className="oem-capability-section" aria-labelledby="oem-capability-title">
          <div>
            <p className="section-kicker">Customization Capability</p>
            <h2 id="oem-capability-title">Build a product and pack system for your market.</h2>
          </div>
          <div className="oem-capability-grid">
            {oemCustomizationCapabilities.map(([Icon, title, text]) => (
              <article key={title}>
                <span><Icon size={24} strokeWidth={1.7} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <div className="process-timeline">
          {oemProcessSteps.map(([number, title, text, image]) => (
            <article key={title}>
              <OptimizedImage src={image} alt={`${title} in OEM pet pad manufacturing process`} />
              <span>{number}</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="product-quote-band">
          <div>
            <p className="section-kicker">Project Brief</p>
            <h2>Send your target market, specification, packaging direction, and quantity.</h2>
          </div>
          <a href="/request-product-plan?product=oem-process">Request OEM Quote <ArrowUpRight size={18} /></a>
        </div>
      </div>
    </section>
  );
}

function ManufacturingCapabilityPage() {
  const capabilityImages = [
    ['/images/oem/production/factory-production-line-real-20260729.jpg', 'Automated pet pad production line'],
    [b2bImage('factory-capability-workshop'), 'Factory capability and production workshop'],
    ['/images/oem/warehouse/warehouse-finished-goods-01.webp', 'Finished goods warehouse for export orders'],
    ['/images/oem/quality/factory-quality-control-01.webp', 'Quality control review for absorbent products'],
  ];

  return (
    <section className="business-seo-page manufacturing-page">
      <div className="container business-seo-shell">
        <div className="business-seo-hero factory-quality-hero">
          <div>
            <p className="section-kicker">Manufacturing Capability</p>
            <h1>Manufacturing capability for OEM pet pad supply.</h1>
            <p>JCZCARE combines automated production lines, material inspection, quality checks, packaging coordination, and export preparation for overseas B2B buyers.</p>
            <div className="business-seo-actions">
              <a href="/request-product-plan?product=factory-capability">Request OEM Quote <ArrowUpRight size={18} /></a>
              <a href="/quality-control">Quality Control System <ArrowUpRight size={18} /></a>
            </div>
          </div>
          <div className="factory-quality-hero-media" aria-hidden="true">
            <OptimizedImage src="/images/oem/production/factory-production-line-real-20260729.jpg" alt="" loading="eager" />
          </div>
        </div>
        <section className="factory-core-system" aria-labelledby="factory-core-system-title">
          <div className="factory-core-heading">
            <div>
              <p className="section-kicker">Factory System</p>
              <h2 id="factory-core-system-title">Manufacturing evidence for supplier evaluation.</h2>
            </div>
            <a href="/request-product-plan?product=factory-capability">
              Request OEM Quote
              <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="factory-core-list">
            {factoryCoreModules.map(([number, title, text, image, facts]) => (
              <article key={title}>
                <div className="factory-core-media">
                  <OptimizedImage src={image} alt={`${title} at JCZCARE OEM manufacturing facility`} />
                </div>
                <div className="factory-core-copy">
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <ul>
                    {facts.map((fact) => <li key={fact}>{fact}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
        <div className="business-seo-grid">
          {[
            ['Automated production lines', 'Stable equipment supports repeatable size, weight, folding, and pack formats.'],
            ['Professional manufacturing team', 'Production, quality, packaging, and export teams coordinate the buyer brief.'],
            ['Stable supply capability', 'Order planning connects material preparation, production scheduling, inspection, and shipment.'],
          ].map(([title, text]) => (
            <article key={title}>
              <span>{title}</span>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="process-flow">
          {manufacturingProcess.map((step) => <span key={step}>{step}</span>)}
        </div>
        <div className="capability-gallery">
          {capabilityImages.map(([src, alt]) => (
            <OptimizedImage key={src} src={src} alt={alt} />
          ))}
        </div>
      </div>
    </section>
  );
}

function QualityControlPage() {
  return (
    <section className="business-seo-page quality-system-page">
      <div className="container business-seo-shell">
        <div className="business-seo-hero factory-quality-hero">
          <div>
            <p className="section-kicker">Quality Control System</p>
            <h1>Quality control system for OEM absorbent products.</h1>
            <p>From incoming materials to shipment approval, quality checks focus on the details that affect B2B buyer risk: absorbency, leakage, rewet, sealing, packaging, and consistency.</p>
            <div className="business-seo-actions">
              <a href="/request-product-plan?product=quality-control">Request OEM Quote <ArrowUpRight size={18} /></a>
              <a href="/oem-process">View OEM Process <ArrowUpRight size={18} /></a>
            </div>
          </div>
          <div className="factory-quality-hero-media" aria-hidden="true">
            <OptimizedImage src="/images/oem/quality/quality-inspection-lab-mask.png" alt="" loading="eager" />
          </div>
        </div>
        <section className="quality-stage-section" aria-labelledby="quality-stage-title">
          <div>
            <p className="section-kicker">Three Inspection Stages</p>
            <h2 id="quality-stage-title">Control the order before, during, and after production.</h2>
          </div>
          <div className="quality-stage-grid">
            {qualityStageSummary.map(([number, title, text, image]) => (
              <article key={title}>
                <OptimizedImage src={image} alt={`${title} for OEM absorbent products`} />
                <div>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <div className="quality-check-grid">
          {qualityControlSteps.map(([title, text, image]) => (
            <article key={title}>
              <OptimizedImage src={image} alt={`${title} for OEM pet pad quality control`} />
              <div>
                <h2>{title}</h2>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrivateLabelPage() {
  return (
    <section className="business-seo-page private-label-page">
      <div className="container business-seo-shell">
        <div className="business-seo-hero">
          <div>
            <p className="section-kicker">Private Label Pet Pads</p>
            <h1>Private label pet pads for brands and retail channels.</h1>
            <p>Build a differentiated pet pad line with custom size, absorbency, packaging, printing, materials, and product features backed by OEM manufacturing support.</p>
            <div className="business-seo-actions">
              <a href="/request-product-plan?product=private-label-pet-pads">Request OEM Quote <ArrowUpRight size={18} /></a>
              <a href="/download">Request Catalog <ArrowUpRight size={18} /></a>
            </div>
          </div>
          <OptimizedImage src={b2bImage('private-label-packaging-review')} alt="Private label pet pad packaging review" loading="eager" />
        </div>
        <div className="custom-option-grid">
          {privateLabelOptions.map((option) => <span key={option}>{option}</span>)}
        </div>
        <div className="process-flow private-label-flow">
          {['Idea', 'Prototype', 'Sample', 'Production', 'Delivery'].map((step) => <span key={step}>{step}</span>)}
        </div>
        <div className="business-seo-featured">
          <p className="section-kicker">Private Label Inputs</p>
          <div>
            {[
              [b2bImage('packaging-customization-options'), 'Packaging design and format review'],
              [b2bImage('business-meeting-oem'), 'OEM project meeting and sample confirmation'],
              [b2bImage('product-specification-samples'), 'Product specification and material samples'],
            ].map(([src, title]) => (
              <a href="/request-product-plan?product=private-label-pet-pads" key={title}>
                <OptimizedImage src={src} alt={title} />
                <span>Private Label</span>
                <h2>{title}</h2>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DownloadCenterPage() {
  return (
    <section className="business-seo-page download-center-page">
      <div className="container business-seo-shell">
        <div className="business-seo-hero">
          <div>
            <p className="section-kicker">Download Center</p>
            <h1>Request product and OEM capability documents.</h1>
            <p>Use this page to request the right document pack for your project. We do not publish fake PDFs; the team will send relevant materials after reviewing your product interest.</p>
            <div className="business-seo-actions">
              <a href="/request-product-plan?product=download-center">Request Documents <ArrowUpRight size={18} /></a>
              <a href="/contact">Contact Sales <ArrowUpRight size={18} /></a>
            </div>
          </div>
          <OptimizedImage src={b2bImage('download-center-catalog')} alt="OEM product catalog and factory document request" loading="eager" />
        </div>
        <div className="download-grid">
          {downloadResources.map(([title, text]) => (
            <article key={title}>
              <span>Request</span>
              <h2>{title}</h2>
              <p>{text}</p>
              <a href={`/request-product-plan?product=${encodeURIComponent(title)}`}>Request {title} <ArrowUpRight size={16} /></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function InquiryForm({ className = '', product = '', source = 'website-contact', buttonLabel = 'Send Inquiry' }) {
  const formName = source === 'product-plan-request'
    ? 'product_plan_inquiry'
    : 'website_contact_inquiry';
  const [formState, setFormState] = useState({
    name: '',
    companyName: '',
    companyWebsite: '',
    jobRole: '',
    email: '',
    phone: '',
    country: '',
    product,
    quantity: '',
    message: '',
    botField: '',
  });
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaStatus, setCaptchaStatus] = useState('loading');
  const [moreDetailsOpen, setMoreDetailsOpen] = useState(() => !window.matchMedia('(max-width: 767px)').matches);
  const lastSubmitAtRef = useRef(0);
  const isSubmittingRef = useRef(false);
  const submissionIdRef = useRef(createInquirySubmissionId());
  const captchaContainerRef = useRef(null);
  const captchaWidgetIdRef = useRef(null);
  const verificationRef = useRef(null);
  const successCardRef = useRef(null);
  const fieldRefs = {
    name: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    product: useRef(null),
  };
  const captchaSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
    || (/^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname) ? turnstileTestSiteKey : '');

  useEffect(() => {
    setFormState((state) => ({ ...state, product }));
  }, [product]);

  useEffect(() => {
    if (!captchaSiteKey) {
      setCaptchaStatus('unavailable');
      return undefined;
    }

    let cancelled = false;
    const renderCaptcha = () => {
      if (cancelled || !captchaContainerRef.current || !window.turnstile || captchaWidgetIdRef.current !== null) {
        return;
      }

      captchaWidgetIdRef.current = window.turnstile.render(captchaContainerRef.current, {
        sitekey: captchaSiteKey,
        theme: 'light',
        size: window.matchMedia('(max-width: 640px)').matches ? 'compact' : 'flexible',
        callback: (token) => {
          setCaptchaToken(token);
          setCaptchaStatus('verified');
          setFieldErrors((errors) => ({ ...errors, verification: undefined }));
        },
        'expired-callback': () => {
          setCaptchaToken('');
          setCaptchaStatus('expired');
        },
        'error-callback': () => {
          setCaptchaToken('');
          setCaptchaStatus('error');
        },
      });
      setCaptchaStatus('ready');
    };

    let script = document.getElementById(turnstileScriptId);
    if (window.turnstile) {
      renderCaptcha();
    } else if (script) {
      script.addEventListener('load', renderCaptcha);
    } else {
      script = document.createElement('script');
      script.id = turnstileScriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.addEventListener('load', renderCaptcha);
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      script?.removeEventListener('load', renderCaptcha);
      if (captchaWidgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(captchaWidgetIdRef.current);
        captchaWidgetIdRef.current = null;
      }
    };
  }, [captchaSiteKey]);

  useEffect(() => {
    if (submitState.status === 'success') {
      successCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [submitState.status]);

  useEffect(() => {
    if (submitState.status === 'success') {
      trackGoogleAdsConversion({ submissionId: submissionIdRef.current });
    }
  }, [submitState.status]);

  const updateField = (field) => (event) => {
    const value = event.target.value;
    if (field !== 'botField') {
      trackFormStart(formName, {
        product_interest: field === 'product' ? value : formState.product,
        country: field === 'country' ? value : formState.country,
      });
    }
    setFormState((state) => ({ ...state, [field]: value }));
    setFieldErrors((errors) => {
      if (!errors[field] || validateInquiryFields({ ...formState, [field]: value })[field]) {
        return errors;
      }

      const nextErrors = { ...errors };
      delete nextErrors[field];
      return nextErrors;
    });
    if (submitState.status === 'error') {
      submissionIdRef.current = createInquirySubmissionId();
      setSubmitState({ status: 'idle', message: '' });
    }
  };

  const focusFirstError = (errors) => {
    const firstField = ['name', 'email', 'phone', 'product'].find((field) => errors[field]);
    const target = firstField ? fieldRefs[firstField].current : verificationRef.current;
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const resetInquiry = () => {
    setFormState({
      name: '',
      companyName: '',
      companyWebsite: '',
      jobRole: '',
      email: '',
      phone: '',
      country: '',
      product,
      quantity: '',
      message: '',
      botField: '',
    });
    setFieldErrors({});
    setSubmitState({ status: 'idle', message: '' });
    setCaptchaToken('');
    submissionIdRef.current = createInquirySubmissionId();
    window.turnstile?.reset(captchaWidgetIdRef.current);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...formState,
      name: formState.name.trim(),
      email: formState.email.trim(),
      phone: formState.phone.trim(),
      product: formState.product.trim(),
      botField: formState.botField.trim(),
      captchaToken,
      submissionId: submissionIdRef.current,
      source,
      pageUrl: `${window.location.origin}${window.location.pathname}`,
      leadSource: getLeadAttribution(),
    };

    const now = Date.now();

    if (isSubmittingRef.current || submitState.status === 'loading' || now - lastSubmitAtRef.current < 2000) {
      return;
    }

    const validationErrors = validateInquiryFields(payload);
    if (!payload.captchaToken) {
      validationErrors.verification = 'Please complete the human verification.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setSubmitState({ status: 'idle', message: '' });
      window.requestAnimationFrame(() => focusFirstError(validationErrors));
      return;
    }

    lastSubmitAtRef.current = now;
    isSubmittingRef.current = true;
    setFieldErrors({});
    setSubmitState({ status: 'loading', message: 'Sending your inquiry...' });

    try {
      await submitInquiry(payload);

      const conversionParameters = {
        form_name: formName,
        product_interest: payload.product,
        country: payload.country,
      };
      const conversionOptions = { dedupeKey: payload.submissionId };

      trackB2BEvent('generate_lead', conversionParameters, conversionOptions);
      trackB2BEvent('form_submit_success', conversionParameters, conversionOptions);
      if (new URLSearchParams(window.location.search).get('request') === 'sample') {
        trackB2BEvent('request_sample', conversionParameters, conversionOptions);
      }
      trackMetaLead({
        formName,
        productInterest: payload.product,
        isSampleRequest: new URLSearchParams(window.location.search).get('request') === 'sample',
        submissionId: payload.submissionId,
      });

      setSubmitState({
        status: 'success',
        message: INQUIRY_SUCCESS_MESSAGE,
      });
      setCaptchaToken('');
      window.turnstile?.reset(captchaWidgetIdRef.current);
    } catch (error) {
      trackB2BEvent('form_error', {
        form_name: formName,
        product_interest: payload.product,
        country: payload.country,
      }, { dedupeKey: payload.submissionId });
      setCaptchaToken('');
      window.turnstile?.reset(captchaWidgetIdRef.current);
      setSubmitState({
        status: 'error',
        message: INQUIRY_FAILURE_MESSAGE,
      });
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const isLoading = submitState.status === 'loading';
  const availableProductOptions = inquiryProductOptions.includes(formState.product) || !formState.product
    ? inquiryProductOptions
    : [formState.product, ...inquiryProductOptions];

  const detailFields = (
    <div className="inquiry-more-details-fields">
      <label>
        <span>Company Name</span>
        <input type="text" name="companyName" maxLength="200" autoComplete="organization" placeholder="Company name" value={formState.companyName} onChange={updateField('companyName')} />
      </label>
      <label>
        <span>Company Website</span>
        <input type="url" name="companyWebsite" maxLength="200" autoComplete="url" placeholder="https://example.com" value={formState.companyWebsite} onChange={updateField('companyWebsite')} />
      </label>
      <label>
        <span>Job Role</span>
        <input type="text" name="jobRole" maxLength="120" autoComplete="organization-title" placeholder="Purchasing Manager" value={formState.jobRole} onChange={updateField('jobRole')} />
      </label>
      <label className={fieldErrors.email ? 'has-error' : ''}>
        <span>Work Email <strong className="required-mark" aria-hidden="true">*</strong></span>
        <input ref={fieldRefs.email} type="email" name="email" required maxLength="200" autoComplete="email" placeholder="name@company.com" value={formState.email} onChange={updateField('email')} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? 'inquiry-email-error' : undefined} />
        {fieldErrors.email && <small id="inquiry-email-error" className="field-error">{fieldErrors.email}</small>}
      </label>
      <label className={fieldErrors.phone ? 'has-error' : ''}>
        <span>Phone / WhatsApp <strong className="required-mark" aria-hidden="true">*</strong></span>
        <input ref={fieldRefs.phone} type="tel" name="phone" required maxLength="100" autoComplete="tel" placeholder="Country code and number" value={formState.phone} onChange={updateField('phone')} aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? 'inquiry-phone-error' : undefined} />
        {fieldErrors.phone && <small id="inquiry-phone-error" className="field-error">{fieldErrors.phone}</small>}
      </label>
      <label>
        <span>Country</span>
        <input type="text" name="country" maxLength="100" autoComplete="country-name" placeholder="Country / market" value={formState.country} onChange={updateField('country')} />
      </label>
      <label>
        <span>Estimated Quantity</span>
        <input type="text" name="quantity" maxLength="100" placeholder="Monthly or order quantity" value={formState.quantity} onChange={updateField('quantity')} />
      </label>
    </div>
  );

  return (
    <form className={`contact-form compact-inquiry-form ${className}`.trim()} aria-label="OEM inquiry form" onSubmit={handleSubmit} noValidate>
      <label className="form-honeypot" aria-hidden="true">
        <span>Leave blank</span>
        <input
          type="text"
          name="botField"
          tabIndex="-1"
          autoComplete="off"
          value={formState.botField}
          onChange={updateField('botField')}
        />
      </label>
      <div className={`inquiry-form-body${submitState.status === 'success' ? ' is-hidden' : ''}`} aria-hidden={submitState.status === 'success'}>
        <p className="required-fields-note"><span aria-hidden="true">*</span> Required fields</p>
        <div className="inquiry-fields">
        <label className={fieldErrors.name ? 'has-error' : ''}>
          <span>Your Name <strong className="required-mark" aria-hidden="true">*</strong></span>
          <input ref={fieldRefs.name} type="text" name="name" required maxLength="100" autoComplete="name" placeholder="Full name" value={formState.name} onChange={updateField('name')} aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? 'inquiry-name-error' : undefined} />
          {fieldErrors.name && <small id="inquiry-name-error" className="field-error">{fieldErrors.name}</small>}
        </label>
        {source === 'homepage-full-rfq' || source === 'product-plan-request' ? detailFields : (
          <details className="inquiry-more-details" open={moreDetailsOpen} onToggle={(event) => setMoreDetailsOpen(event.currentTarget.open)}>
            <summary>More project details <span aria-hidden="true">+</span></summary>
            {detailFields}
          </details>
        )}
        <label className={`inquiry-field-wide${fieldErrors.product ? ' has-error' : ''}`}>
          <span>Product Interest <strong className="required-mark" aria-hidden="true">*</strong></span>
          <select ref={fieldRefs.product} name="product" required value={formState.product} onChange={updateField('product')} aria-invalid={Boolean(fieldErrors.product)} aria-describedby={fieldErrors.product ? 'inquiry-product-error' : undefined}>
            <option value="">Select a product</option>
            {availableProductOptions.map((option) => <option key={option} value={option}>{formatInquiryProduct(option)}</option>)}
          </select>
          {fieldErrors.product && <small id="inquiry-product-error" className="field-error">{fieldErrors.product}</small>}
        </label>
        <label className="inquiry-field-wide">
          <span>Project Requirements</span>
          <textarea name="message" maxLength="5000" rows="4" placeholder="Share specifications, packaging, quantity, target market, or delivery requirements." value={formState.message} onChange={updateField('message')} />
        </label>
      </div>
      <div ref={verificationRef} className={`form-verification ${captchaStatus}${fieldErrors.verification ? ' has-error' : ''}`} tabIndex="-1" aria-invalid={Boolean(fieldErrors.verification)} aria-describedby={fieldErrors.verification ? 'inquiry-verification-error' : undefined}>
        <div className="form-verification-heading">
          <ShieldCheck size={18} aria-hidden="true" />
          <span>Human Verification</span>
        </div>
        {captchaSiteKey ? (
          <div ref={captchaContainerRef} className="turnstile-container" />
        ) : (
          <p>Verification is temporarily unavailable. Please contact us by email or WhatsApp.</p>
        )}
        {fieldErrors.verification && <small id="inquiry-verification-error" className="field-error">{fieldErrors.verification}</small>}
      </div>
      {submitState.status === 'error' && (
        <p className="form-message error" role="alert">{INQUIRY_FAILURE_MESSAGE}</p>
      )}
      <button type="submit" disabled={isLoading} aria-busy={isLoading}>
        {isLoading ? 'Sending...' : buttonLabel}
        <ArrowUpRight size={18} />
      </button>
      </div>
      {submitState.status === 'success' && (
        <section ref={successCardRef} className="inquiry-success-card" role="status" aria-live="polite" tabIndex="-1">
          <span className="inquiry-success-icon" aria-hidden="true"><Check size={28} /></span>
          <p className="inquiry-success-label">Inquiry Sent</p>
          <h3>Inquiry Sent Successfully!</h3>
          <p>{INQUIRY_SUCCESS_MESSAGE}</p>
          <button type="button" className="inquiry-sent-confirmation" disabled><Check size={18} aria-hidden="true" /> Inquiry Sent</button>
          <button type="button" className="submit-another-inquiry" onClick={resetInquiry}>Submit Another Inquiry</button>
        </section>
      )}
    </form>
  );
}

function ProductPlanInquiry() {
  const inquiryParams = new URLSearchParams(window.location.search);
  const productParam = inquiryParams.get('productName') || inquiryParams.get('product') || '';

  return (
    <section className="inquiry-page">
      <div className="inquiry-silk" aria-hidden="true">
        <SilkBoundary>
          <React.Suspense fallback={<div className="inquiry-silk-fallback" />}>
            <Silk
              speed={3.2}
              scale={1.18}
              color="#141e25"
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
            Select the product you are sourcing and leave your work email. Our team will follow up to confirm the detailed requirements.
          </p>
        </div>
        <InquiryForm
          className="inquiry-form"
          product={productParam}
          source="product-plan-request"
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
              color="#101a22"
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
            <em className="title-key">JINCHENG ZENCARE.</em>
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
  const localizedCompanyName = getLocalizedCompanyName();
  const aboutHighlights = [
    ['Company', `${localizedCompanyName} is a pet care absorbent product source factory serving OEM, ODM, and private-label programs.`],
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
  const localizedCompanyName = getLocalizedCompanyName();
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
            <h2 className="notranslate" translate="no">{localizedCompanyName}</h2>
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
            <input type="search" placeholder="Search help topics..." aria-label="Search help topics" />
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
      image: '/images/oem/production/factory-production-line-real-20260729.jpg',
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
            <a href="/request-product-plan?product=sample-kit&request=sample">
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
              <a href="/request-product-plan?product=sample-kit&request=sample">
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

function OemProcessBusinessContent() {
  return (
    <div className="oem-process-business-content">
      <section className="home-section home-customization" id="oem-customization">
        <div className="container">
          <header className="home-section-heading">
            <p className="section-kicker">OEM/ODM Customization</p>
            <h2>Built Around Your Product Brief</h2>
            <p>From product structure and absorbency to retail packaging and export cartons, each project starts with your target market and commercial requirements.</p>
          </header>
          <div className="home-capability-grid">
            {homeCustomizationCapabilities.map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <div className="home-section-cta">
            <p>Not sure which specification fits your market? Share your target price, sales channel, and intended use.</p>
            <a href="/request-product-plan?product=oem-process">Discuss Your Product Specification <ArrowUpRight size={18} /></a>
          </div>
        </div>
      </section>

      <section className="home-section home-partner-reasons">
        <div className="container">
          <header className="home-section-heading">
            <p className="section-kicker">Why JCZCARE</p>
            <h2>A Manufacturing Partner, Not Just a Product Catalog</h2>
          </header>
          <div className="home-reason-grid">
            {homePartnerReasons.map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-factory" id="factory-evidence">
        <div className="container home-factory-grid">
          <div className="home-factory-media">
            <video
              src="/videos/factory-profile-4-compressed.mp4"
              poster="/images/oem/hero/factory-campus.webp"
              controls
              playsInline
              preload="metadata"
              aria-label="JCZCARE factory profile video"
            />
          </div>
          <div className="home-factory-copy">
            <p className="section-kicker">Factory & Production</p>
            <h2>See the Manufacturing Behind Your Product</h2>
            <p>Review the production, material, inspection, warehouse, and export coordination behind each OEM/ODM project.</p>
            <ul>
              <li>8 automated production lines</li>
              <li>Specification-controlled production</li>
              <li>Material and in-process inspections</li>
              <li>Export packing and shipment coordination</li>
            </ul>
            <a href="/factory">Explore Our Factory <ArrowUpRight size={18} /></a>
          </div>
        </div>
      </section>

      <section className="home-section home-process" id="oem-process-steps">
        <div className="container">
          <header className="home-section-heading">
            <p className="section-kicker">OEM Cooperation</p>
            <h2>From Product Brief to Shipment</h2>
            <p>Timing is confirmed by product, specification, packaging, quantity, destination, and trade term.</p>
          </header>
          <ol className="home-process-grid">
            {homeProcessSteps.map(([number, title, text]) => (
              <li key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          <a className="home-inline-cta" href="/request-product-plan?product=oem-process">Start Your OEM Project <ArrowUpRight size={18} /></a>
        </div>
      </section>

      <section className="home-section home-quality" id="quality-preview">
        <div className="container home-quality-grid">
          <div className="home-quality-copy">
            <p className="section-kicker">Quality Control</p>
            <h2>Quality Control Connected to Your Approved Specification</h2>
            <p>Checks follow the approved product and packaging brief from incoming materials through finished-goods release.</p>
            <div className="home-quality-list">
              {homeQualityChecks.map((item) => <span key={item}><ShieldCheck size={18} /> {item}</span>)}
            </div>
            <a href="/quality-control">View Quality Control <ArrowUpRight size={18} /></a>
          </div>
          <OptimizedImage src="/images/oem/quality/factory-quality-control-01.webp" alt="Quality inspection for absorbent hygiene products" />
        </div>
      </section>

      <section className="home-section home-buyers">
        <div className="container">
          <header className="home-section-heading">
            <p className="section-kicker">Professional Buyers</p>
            <h2>Built for Professional Buyers</h2>
            <p>Whether you are developing a new private-label product, expanding an existing range, or coordinating multiple categories, start with your market, specification, quantity, and packaging requirements.</p>
          </header>
          <div className="home-buyer-grid">
            {homeBuyerTypes.map((buyer) => <span key={buyer}>{buyer}</span>)}
          </div>
        </div>
      </section>

      <section className="home-section home-scenarios">
        <div className="container">
          <header className="home-section-heading">
            <p className="section-kicker">Typical OEM Scenarios</p>
            <h2>Common Starting Points for Buyer Projects</h2>
          </header>
          <div className="home-scenario-grid">
            {homeProjectScenarios.map(([title, text]) => (
              <article key={title}><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
          <a className="home-inline-cta" href="/request-product-plan?product=oem-process">Discuss a Similar Project <ArrowUpRight size={18} /></a>
        </div>
      </section>

      <section className="home-section home-faq" id="faq">
        <div className="container home-faq-shell">
          <header className="home-section-heading">
            <p className="section-kicker">Buyer FAQ</p>
            <h2>Questions Before You Request a Quote</h2>
          </header>
          <div className="home-faq-list">
            {homeFaqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}<span aria-hidden="true">+</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function HomePage({ rootRef, navRef, ui }) {
  return (
    <main ref={rootRef} className="home-b2b home-rebuild">
      <HomeTrustBar items={[
        ['OEM/ODM', 'Manufacturing'],
        ['3-Day', 'Sampling'],
        ['Private Label', 'Packaging'],
        ['Global B2B', 'Supply'],
      ]} />
      <SiteNav navRef={navRef} ui={ui} />

      <HomeHeroCarousel
        emailHref={buildMailto('Website Inquiry', quotationEmailBody)}
        contactEmail={contactEmail}
        whatsappPhone={whatsappPhone}
        whatsappChatUrl={whatsappChatUrl}
      />

      <section className="home-trust-metrics" aria-label="Manufacturer trust data">
        <div className="container home-trust-grid">
          {[
            ['20 Years', 'Manufacturing Experience', 'Focused absorbent hygiene manufacturing.'],
            ['8 Lines', 'Automated Production', 'Production planning across automated lines.'],
            ['3-Day', 'Sampling', 'Sample development after the product brief is confirmed.'],
            ['Global', 'OEM/ODM Supply', 'Export packing and delivery coordination.'],
          ].map(([value, label, text]) => (
            <article key={label}>
              <strong>{value}</strong>
              <h2>{label}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <HomeProductShowcase />

      <section className="contact-page home-request-quote" id="contact">
        <div className="container contact-inner">
          <div className="contact-copy">
            <p className="section-kicker">Contact / RFQ</p>
            <h2>Tell Us About Your Product Project</h2>
            <p>Share your product, market, specification, packaging, and estimated quantity. Our team will help organize the next step.</p>
            <div className="contact-panel">
              <a className="contact-panel-whatsapp" href={whatsappChatUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="whatsapp-icon" size={20} />
                <span><strong>Talk to Our OEM Specialist</strong><small>{whatsappPhone}</small></span>
              </a>
              <a href={buildMailto('Website Inquiry', quotationEmailBody)}><Mail size={20} /><span>{contactEmail}</span></a>
            </div>
          </div>
          <InquiryForm product="" source="homepage-full-rfq" buttonLabel="Submit Your OEM/ODM Inquiry" />
        </div>
      </section>
      <SiteFooter ui={ui} />
    </main>
  );
}

function App() {
  const rootRef = useRef(null);
  const navRef = useRef(null);
  const currentPath = window.location.pathname;
  const [activeRegion, setActiveRegion] = useState(getInitialRegion);
  const ui = useMemo(() => getUiText(activeRegion), [activeRegion]);
  const materialTerminology = materialTerminologyTranslations[getInitialSiteLanguage()]
    ?? materialTerminologyTranslations.en;
  const productSlug = currentPath.match(/^\/products\/([^/]+)\/?$/)?.[1];
  const productDetailMatch = currentPath.match(/^\/products\/([^/]+)\/([^/]+)\/?$/);
  const isProductsCenterPage = currentPath === '/products' || currentPath === '/products/';
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
  const isPrivacyPolicyPage = currentPath === '/privacy-policy';
  const newsSlug = currentPath.match(/^\/pages\/news\/([^/]+)\/?$/)?.[1];
  const isNewsPage = currentPath === '/pages/news';
  const blogSlug = currentPath.match(/^\/blog\/([^/]+)\/?$/)?.[1];
  const isBlogPage = currentPath === '/blog';
  const isOemProcessPage = currentPath === '/oem-process';
  const isOemCapabilityPage = currentPath === '/oem-capability';
  const isCaseStudyPage = currentPath === '/case-study';
  const isQualityControlPage = currentPath === '/quality-control';
  const isPrivateLabelPage = currentPath === '/private-label';
  const isDownloadCenterPage = currentPath === '/download';
  const isManufacturingCapabilityPage = currentPath === '/factory';
  const currentAuthorityPage = getAuthorityPage(currentPath);
  const currentSeoPage = seoPageMap.get(currentPath);
  const currentStaticSeo = staticSeoPages[currentPath];
  const currentSeries = productSlug ? getProductSeries(productSlug) : null;
  const catalogProduct = productDetailMatch
    ? (() => {
        return getSeriesProduct(productDetailMatch[1], productDetailMatch[2]);
      })()
    : null;
  const currentProduct = productSlug && !currentSeries
    ? customProducts.find((product) => product.slug === productSlug)
    : null;
  const currentNewsArticle = newsSlug
    ? newsArticles.find((article) => article.slug === newsSlug)
    : null;
  const currentBlogArticle = blogSlug
    ? blogArticles.find((article) => article.slug === blogSlug)
    : null;

  useEffect(() => {
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

    if (isProductsCenterPage) {
      applyPageSeo({
        ...productCenterSeo,
        path: '/products',
        image: primaryProductCatalog[0].image,
        breadcrumbs: [
          ['Home', '/'],
          ['Products', '/products'],
        ],
      });
      return;
    }

    if (currentSeries) {
      applyPageSeo({
        title: currentSeries.seoTitle,
        description: currentSeries.seoDescription,
        keywords: productCenterSeo.keywords,
        path: `/products/${currentSeries.slug}`,
        image: currentSeries.image || primaryProductCatalog[0].image,
        breadcrumbs: [
          ['Home', '/'],
          ['Products', '/products'],
          [currentSeries.title, `/products/${currentSeries.slug}`],
        ],
      });
      return;
    }

    if (catalogProduct) {
      applyPageSeo({
        title: `${catalogProduct.name} | OEM/ODM Product Template`,
        description: `${catalogProduct.name} for OEM/ODM and private-label project discussion. Review available customization directions and submit a focused product inquiry.`,
        keywords: productCenterSeo.keywords,
        path: `/products/${catalogProduct.series.slug}/${catalogProduct.slug}`,
        image: catalogProduct.image || catalogProduct.series.image || primaryProductCatalog[0].image,
        product: catalogProduct,
        breadcrumbs: [
          ['Home', '/'],
          ['Products', '/products'],
          [catalogProduct.series.title, `/products/${catalogProduct.series.slug}`],
          [catalogProduct.name, `/products/${catalogProduct.series.slug}/${catalogProduct.slug}`],
        ],
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
        image: '/images/oem/factory/factory-campus-real-aerial-20260729.png',
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
        indexable: !isInquiryPage && !isSignInPage,
      });
      return;
    }

    applyPageSeo({
      title: 'Pet Pad & Disposable Hygiene Products OEM/ODM Manufacturer | JCZCARE',
      description: 'JCZCARE manufactures pet urine pads, absorbent paper sheets, pet diapers, adult underpads, cleaning products and garbage bags for OEM/ODM and private-label buyers.',
      path: currentPath === '/' ? '/' : currentPath,
      image: heroFallbackImage,
    });
  }, [currentAuthorityPage, currentSeoPage, currentProduct, currentSeries, catalogProduct, currentNewsArticle, currentBlogArticle, currentStaticSeo, isNewsPage, isBlogPage, isAdultUnderpadsPage, isProductsCenterPage, currentPath]);

  useEffect(() => {
    captureLeadAttribution();
    trackPageView();
    trackMetaPageView();
  }, [currentPath]);

  useEffect(() => installContactClickTracking(), []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (isPrivacyPolicyPage) {
      return undefined;
    }

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

      if (isProductsCenterPage || currentSeries || catalogProduct || currentProduct || currentNewsArticle || currentBlogArticle || currentAuthorityPage || currentSeoPage || isInquiryPage || isSignInPage || isAboutPage || isInvestorPage || isAffiliatesPage || isHelpPage || isLearnPage || isGiveBackPage || isGiftCardsPage || isNewsPage || isBlogPage) {
        gsap.set(nav, {
          y: 0,
          autoAlpha: 1,
          backgroundColor: 'rgba(19, 29, 34, 0.78)',
          borderColor: 'rgba(206, 229, 246, 0.22)',
          boxShadow: '0 24px 86px rgba(0, 0, 0, 0.42)',
        });
        gsap.set(navLinks, { backgroundColor: 'rgba(255, 255, 255, 0.09)' });
        gsap.set(navCta, { backgroundColor: '#84c2ee', color: '#0f191d' });
        const entryTargets = isProductsCenterPage
          ? '.products-center-page .products-center-hero-copy > *, .products-center-page .products-center-hero-index, .products-center-page .products-center-heading > *, .products-center-page .products-center-card'
          : currentSeries
            ? '.catalog-series-page .catalog-series-hero-copy > *, .catalog-series-page .catalog-series-hero-media, .catalog-series-page .series-product-card'
            : catalogProduct
              ? '.catalog-detail-template .catalog-detail-copy > *, .catalog-detail-template .catalog-detail-media'
              : currentProduct
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

        const entryElements = root.querySelectorAll(entryTargets);

        if (entryElements.length) {
          gsap.fromTo(
            entryElements,
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
        }

        return;
      }

      gsap.set(nav, {
        y: 0,
        autoAlpha: 1,
        backgroundColor: 'rgba(18, 26, 29, 0.34)',
        borderColor: 'rgba(255, 255, 255, 0.14)',
        boxShadow: '0 16px 58px rgba(0, 0, 0, 0.22)',
      });
      gsap.set(navLinks, { backgroundColor: 'rgba(255, 255, 255, 0.06)' });
      gsap.set(navCta, { backgroundColor: '#84c2ee', color: '#151d20' });

      gsap.to(nav, {
        backgroundColor: 'rgba(19, 29, 34, 0.78)',
        borderColor: 'rgba(206, 229, 246, 0.22)',
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
        backgroundColor: '#84c2ee',
        color: '#0f191d',
        ease: 'none',
        scrollTrigger: {
          trigger: '#home',
          start: 'top top',
          end: () => `+=${Math.max(420, window.innerHeight * 0.58)}`,
          scrub: 1.25,
          invalidateOnRefresh: true,
        },
      });

      if (root.querySelector('.hero')) {
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
      }

      const sectionConfigs = [
        {
          section: '#about',
          title: '#about .section-kicker',
          image: '#about .about-media',
          imageInner: '#about .about-media img',
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
        const sectionElement = root.querySelector(section);

        if (!sectionElement) {
          return;
        }

        const titleElements = root.querySelectorAll(title);
        const itemElements = root.querySelectorAll(items);
        const imageElements = image ? root.querySelectorAll(image) : [];
        const imageInnerElements = imageInner ? root.querySelectorAll(imageInner) : [];

        if (titleElements.length) {
          gsap.fromTo(
            titleElements,
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
                trigger: sectionElement,
                start: 'top 74%',
                once: true,
              },
            },
          );
        }

        if (itemElements.length) {
          gsap.fromTo(
            itemElements,
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
                trigger: sectionElement,
                start: 'top 66%',
                once: true,
              },
            },
          );
        }

        if (imageElements.length) {
          gsap.fromTo(
            imageElements,
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
                trigger: sectionElement,
                start: 'top 70%',
                once: true,
              },
            },
          );
        }

        if (imageInnerElements.length) {
          gsap.fromTo(
            imageInnerElements,
            { yPercent: -5, scale: 1.08 },
            {
              yPercent: 5,
              scale: 1.03,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionElement,
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
  }, [currentSeries, catalogProduct, currentProduct, currentNewsArticle, currentBlogArticle, currentAuthorityPage, currentSeoPage, isInquiryPage, isSignInPage, isAboutPage, isInvestorPage, isAffiliatesPage, isHelpPage, isLearnPage, isGiveBackPage, isGiftCardsPage, isNewsPage, isBlogPage, isProductsCenterPage, isPrivacyPolicyPage]);

  useEffect(() => {
    if (currentSeries || catalogProduct || currentProduct || currentNewsArticle || currentBlogArticle || currentAuthorityPage || currentSeoPage || isInquiryPage || isSignInPage || isAboutPage || isInvestorPage || isAffiliatesPage || isHelpPage || isLearnPage || isGiveBackPage || isGiftCardsPage || isNewsPage || isBlogPage || isPrivacyPolicyPage) {
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
  }, [currentSeries, catalogProduct, currentProduct, currentNewsArticle, currentBlogArticle, currentAuthorityPage, currentSeoPage, isInquiryPage, isSignInPage, isAboutPage, isInvestorPage, isAffiliatesPage, isHelpPage, isLearnPage, isGiveBackPage, isGiftCardsPage, isNewsPage, isBlogPage, isPrivacyPolicyPage]);

  if (isPrivacyPolicyPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <PrivacyPolicyPage />
        <SiteFooter ui={ui} topHref="#privacy-policy-top" />
      </main>
    );
  }

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

  if (isProductsCenterPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <ProductCenterPage />
        <SiteFooter ui={ui} />
      </main>
    );
  }

  if (currentSeries) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <ProductSeriesPage series={currentSeries} />
        <SiteFooter ui={ui} />
      </main>
    );
  }

  if (catalogProduct) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <CatalogProductDetailPage product={catalogProduct} />
        <SiteFooter ui={ui} />
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

  if (isOemProcessPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <OemProcessPage materialTerminology={materialTerminology} />
        <SiteFooter ui={ui} />
      </main>
    );
  }

  if (isOemCapabilityPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <OemCapabilityPage />
        <SiteFooter ui={ui} />
      </main>
    );
  }

  if (isCaseStudyPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <CaseStudyPage />
        <SiteFooter ui={ui} />
      </main>
    );
  }

  if (isQualityControlPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <QualityControlPage />
        <SiteFooter ui={ui} />
      </main>
    );
  }

  if (isPrivateLabelPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <PrivateLabelPage />
        <SiteFooter ui={ui} />
      </main>
    );
  }

  if (isDownloadCenterPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <DownloadCenterPage />
        <SiteFooter ui={ui} />
      </main>
    );
  }

  if (isManufacturingCapabilityPage) {
    return (
      <main ref={rootRef}>
        <SiteNav navRef={navRef} ui={ui} />
        <ManufacturingCapabilityPage />
        <SiteFooter ui={ui} />
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

  return <HomePage rootRef={rootRef} navRef={navRef} ui={ui} />;
/* Legacy homepage markup retained below for reference during the redesign. */
/*
  return (
    <main ref={rootRef} className="home-b2b">
      <SiteNav navRef={navRef} ui={ui} />

      <HomeHeroCarousel
        emailHref={buildMailto('Website Inquiry', quotationEmailBody)}
        contactEmail={contactEmail}
        whatsappPhone={whatsappPhone}
        whatsappChatUrl={whatsappChatUrl}
      />

      <HomeProductShowcase />

      <section className="section projects" id="projects">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-kicker">Factory Capability</p>
              <h2>
                Equipment, process, and warehousing for <em className="title-key">scalable OEM delivery</em>.
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

      <section className="section advantages" id="advantages">
        <div className="container">
          <div className="section-head compact">
            <div>
              <p className="section-kicker">Why Choose Us</p>
              <h2>
                Product and packaging options for <em className="title-key">private-label programs</em>.
              </h2>
            </div>
          </div>
          <div className="advantage-grid">
            {advantages.map(({ icon: Icon, title, text, image }) => (
              <article className="advantage-card" key={title}>
                <div className="advantage-card-media">
                  <OptimizedImage src={image} alt={`${title} for OEM customization`} />
                </div>
                <div className="advantage-card-body">
                  <div className="icon-box">
                    <Icon size={24} strokeWidth={1.7} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-trust-strip" aria-label="Manufacturer trust data">
        <div className="container home-trust-grid">
          {homepageTrustStats.map(([value, label, text]) => (
            <article key={label}>
              <strong>{value}</strong>
              <h2>{label}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section about" id="about">
        <div className="container about-shell">
          <div className="about-video" aria-label="Factory video">
            <video
              ref={aboutVideoRef}
              src="/videos/factory-profile-4-compressed.mp4"
              poster="/images/oem/hero/factory-campus.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </div>
          <div className="about-grid">
            <div className="about-media">
              <OptimizedImage
                src="/images/oem/factory/factory-campus-real-aerial-20260729.png"
                alt="Nantong JINCHENG ZENCARE factory exterior"
                loading="eager"
              />
            </div>
            <div className="about-copy">
              <p className="section-kicker">Manufacturing Capability</p>
              <h2>
                Manufacturing capacity for
                <br />
                <em className="title-key">repeatable global supply</em>.
              </h2>
              <p>
                20 years focused on pet training pads, adult underpads, absorbent hygiene products, and related private-label programs.
              </p>
              <p>
                A 12,000 sq.m manufacturing base, 8 automated lines, and 300M pcs annual capacity support sampling, mass production, packing, and export delivery.
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
              Request OEM Quote
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="contact-page" id="contact">
        <div className="container contact-inner">
          <div className="contact-copy">
            <p className="section-kicker">Contact / RFQ</p>
            <h2>
              <span>Discuss your next</span>
              <span><em className="title-key">OEM/ODM sourcing project</em>.</span>
            </h2>
            <p>
              Select your product and leave a work email. Our OEM team will follow up to confirm specifications, quantity, packaging, and delivery.
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
            buttonLabel="Send Inquiry"
          />
        </div>
      </section>
      <SiteFooter ui={ui} />
    </main>
  );
*/
}

createRoot(document.getElementById('root')).render(<App />);
