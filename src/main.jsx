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
import { blogArticles, getBlogReadTime, getRelatedBlogArticles } from './blogData.js';

const heroVideo = '/videos/hero-background-2-720p.webm';
const heroFallbackImage = '/images/factory-campus.jpeg';
const siteUrl = 'https://www.jczcare.com';
const contactEmail = 'hengtuo@nthengtuo.com';
const whatsappChatUrl =
  'https://wa.me/8618061305971?text=Hello%20Nantong%20JINCHENG%20ZENCARE%2C%20I%20would%20like%20to%20discuss%20a%20custom%20pet%20pad%20OEM%2FODM%20project.';
const Silk = React.lazy(() => import('./Silk'));

const buildMailto = (subject = 'Website Inquiry', body = '') => {
  const params = new URLSearchParams({ subject });

  if (body) {
    params.set('body', body);
  }

  return `mailto:${contactEmail}?${params.toString()}`;
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
    support: 'Vare eksperter er tilgjengelige 24/7ãMzÚÚ$z{-®éÜj×7F—fU&Vv–öã×¶7F—fU&Vv–öçÒöå&Vv–öä6†ævS×¶†æFÆU&Vv–öä6†ævWÒV“×·V—ÒóàĞ¢Äv–gD6&G5vRóàĞ¢ÂöÖ–ãàĞ¢“°Ğ¢ĞĞ Ğ¢–b†—4&ÆöuvR’°Ğ¢&WGW&â€Ğ¢ÆÖ–â&Vc×·&ö÷E&VgÓàĞ¢Å6—FTæbæe&Vc×¶æe&VgÒ7F—fU&Vv–öã×¶7F—fU&Vv–öçÒöå&Vv–öä6†ævS×¶†æFÆU&Vv–öä6†ævWÒV“×·V—ÒóàĞ¢Ä&ÆöuvRóàĞ¢ÂöÖ–ãàĞ¢“°Ğ¢ĞĞ Ğ¢–b†7W'&VçD&Æöt'F–6ÆR’°Ğ¢&WGW&â€Ğ¢ÆÖ–â&Vc×·&ö÷E&VgÓàĞ¢Å6—FTæbæe&Vc×¶æe&VgÒ7F—fU&Vv–öã×¶7F—fU&Vv–öçÒöå&Vv–öä6†ævS×¶†æFÆU&Vv–öä6†ævWÒV“×·V—ÒóàĞ¢Ä&Æöt'F–6ÆUvR'F–6ÆS×¶7W'&VçD&Æöt'F–6ÆWÒóàĞ¢ÂöÖ–ãàĞ¢“°Ğ¢ĞĞ Ğ¢–b†—4æWw5vR’°Ğ¢&WGW&â€Ğ¢ÆÖ–â&Vc×·&ö÷E&VgÓàĞ¢Å6—FTæbæe&Vc×¶æe&VgÒ7F—fU&Vv–öã×¶7F—fU&Vv–öçÒöå&Vv–öä6†ævS×¶†æFÆU&Vv–öä6†ævWÒV“×·V—ÒóàĞ¢ÄæWw5vRóàĞ¢ÂöÖ–ãàĞ¢“°Ğ¢ĞĞ Ğ¢–b†7W'&VçDæWw4'F–6ÆR’°¢&WGW&â€Ğ¢ÆÖ–â&Vc×·&ö÷E&VgÓàĞ¢Å6—FTæbæe&Vc×¶æe&VgÒ7F—fU&Vv–öã×¶7F—fU&Vv–öçÒöå&Vv–öä6†ævS×¶†æFÆU&Vv–öä6†ævWÒV“×·V—ÒóàĞ¢ÄæWw4'F–6ÆUvR'F–6ÆS×¶7W'&VçDæWw4'F–6ÆWÒóàĞ¢ÂöÖ–ãàĞ¢“°Ğ¢Ğ ¢–b†—4GVÇEVæFW'G5vRbb7W'&VçE&öGV7B’°¢&WGW&â€¢ÆÖ–â&Vc×·&ö÷E&VgÓà¢Å6—FTæbæe&Vc×¶æe&VgÒ7F—fU&Vv–öã×¶7F—fU&Vv–öçÒöå&Vv–öä6†ævS×¶†æFÆU&Vv–öä6†ævWÒV“×·V—Òóà¢ÄGVÇEVæFW'G5vRV“×·V—Òóà¢ÂöÖ–ãà¢“°¢Ğ ¢–b†7W'&VçE6VõvR’°¢&WGW&â€Ğ¢ÆÖ–â&Vc×·&ö÷E&VgÓàĞ¢Å6—FTæbæe&Vc×¶æe&VgÒ7F—fU&Vv–öã×¶7F—fU&Vv–öçÒöå&Vv–öä6†ævS×¶†æFÆU&Vv–öä6†ævWÒV“×·V—ÒóàĞ¢Ä'W6–æW756VõvRvS×¶7W'&VçE6VõvWÒóàĞ¢ÂöÖ–ãàĞ¢“°Ğ¢ĞĞ Ğ¢–b†7W'&VçE&öGV7B’°Ğ¢&WGW&â€Ğ¢ÆÖ–â&Vc×·&ö÷E&VgÓàĞ¢Å6—FTæbæe&Vc×¶æe&VgÒ7F—fU&Vv–öã×¶7F—fU&Vv–öçÒöå&Vv–öä6†ævS×¶†æFÆU&Vv–öä6†ævWÒV“×·V—ÒóàĞ¢Å&öGV7DFWF–Â&öGV7C×¶7W'&VçE&öGV7GÒóàĞ¢ÂöÖ–ãàĞ¢“°Ğ¢ĞĞ Ğ¢&WGW&â€Ğ¢ÆÖ–â&Vc×·&ö÷E&VgÓàĞ¢Å6—FTæbæe&Vc×¶æe&VgÒ7F—fU&Vv–öã×¶7F—fU&Vv–öçÒöå&Vv–öä6†ævS×¶†æFÆU&Vv–öä6†ævWÒV“×·V—ÒóàĞ Ğ¢Ç6V7F–öâ6Æ74æÖSÒ&†W&ò"–CÒ&†öÖR#àĞ¢¶†W&õf–FVôf–ÆVBò€Ğ¢Æ–Ör6Æ74æÖSÒ&†W&ò×f–FVò"7&3×¶†W&ôfÆÆ&6´–ÖvWÒÇCÒ""&–Ö†–FFVãÒ'G'VR"óàĞ¢’¢€Ğ¢Çf–FVğĞ¢&Vc×¶†W&õf–FVõ&VgĞĞ¢6Æ74æÖSÒ&†W&ò×f–FVò Ğ¢7&3×¶†W&õf–FV÷ĞĞ¢÷7FW#×¶†W&ôfÆÆ&6´–ÖvWĞĞ¢WFõÆĞ¢×WFV@Ğ¢Æö÷ Ğ¢Æ—4–æÆ–æPĞ¢öäW'&÷#×²‚’Óâ6WD†W&õf–FVôf–ÆVB‡G'VR—ĞĞ¢óàĞ¢—ĞĞ¢ÆF—b6Æ74æÖSÒ&†W&òÖ÷fW&Æ’"óàĞ¢ÆF—b6Æ74æÖSÒ&†W&òÖ6öçFVçB#àĞ¢ÆF—b6Æ74æÖSÒ&†W&òÖÖ–â#àĞ¢ÆF—b6Æ74æÖSÒ&†W&ò×F—FÆRÖ&Æö6²#àĞ¢Ç6Æ74æÖSÒ&W–V'&÷r#åUBE2ôTÒòôDÒÔåTd5EU$U#Â÷àĞ¢Æƒ6Æ74æÖSÒ&†W&ò×F—FÆR#àĞ¢Ç7â6Æ74æÖSÒ&†W&ò×F—FÆRÖfö7W2#åWBBôTÒôôDÓÂ÷7ãàĞ¢Ç7â6Æ74æÖSÒ&†W&ò×F—FÆR×6÷W&6R#å6÷W&6Rf7F÷'’ãÂ÷7ãàĞ¢ÂöƒàĞ¢Ç7â6Æ74æÖSÒ&†W&ò×F—FÆRÖÆ–æR"&–Ö†–FFVãÒ'G'VR"óàĞ¢ÂöF—càĞ¢ÆF—b6Æ74æÖSÒ&†W&ò×6–FR#àĞ¢Ç6Æ74æÖSÒ&†W&òÖ6÷’#àĞ¢Ç7ãä7W7FöÒ'6÷&&VçBWB6&R&öGV7G2f÷"vÆö&Â'&æG2Â&WF–ÆW'2ÂæB6†ææVÂ'FæW'2ãÂ÷7ãàĞ¢Â÷àĞ¢ÆF—b6Æ74æÖSÒ&†W&òÖ7F–öç2#àĞ¢Æ6Æ74æÖSÒ&†W&òÖ7F–öâ&–Ö'’"‡&VcÒ"6&÷WB#àĞ¢vF6‚f7F÷'’f–FVğĞ¢Ä6—&6ÆUÆ’6—¦S×³‡ÒóàĞ¢ÂöàĞ¢Æ6Æ74æÖSÒ&†W&òÖ7F–öâ6V6öæF'’"‡&Vc×·v†G66†EW&ÇÒF&vWCÒ%ö&Ææ²"&VÃÒ&æ÷&VfW'&W"#àĞ¢Å†öæR6—¦S×³‡ÒóàĞ¢Ç7ãàĞ¢Ç7G&öæsä6ÆÂW2æ÷sÂ÷7G&öæsàĞ¢Ç6ÖÆÃâ³ƒbƒc3S“sÂ÷6ÖÆÃàĞ¢Â÷7ãàĞ¢ÂöàĞ¢ÂöF—càĞ¢ÂöF—càĞ¢ÂöF—càĞ¢ÂöF—càĞ¢Â÷6V7F–öãàĞ Ğ¢Ç6V7F–öâ6Æ74æÖSÒ'6V7F–öâ&÷WB"–CÒ&&÷WB#àĞ¢ÆF—b6Æ74æÖSÒ&6öçF–æW"&÷WB×6†VÆÂ#àĞ¢ÆF—b6Æ74æÖSÒ&&÷WB×f–FVò"&–ÖÆ&VÃÒ$f7F÷'’f–FVò#àĞ¢Çf–FVğĞ¢7&3Ò"÷f–FV÷2öf7F÷'’×&öf–ÆRÓBÖ6ö×&W76VBæ×B Ğ¢÷7FW#Ò"ö–ÖvW2öf7F÷'’Ö6×W2æ§Vr Ğ¢WFõÆĞ¢×WFV@Ğ¢Æö÷ Ğ¢Æ—4–æÆ–æPĞ¢&VÆöCÒ&ÖWFFF Ğ¢óàĞ¢ÂöF—càĞ¢ÆF—b6Æ74æÖSÒ&&÷WBÖw&–B#àĞ¢ÆF—b6Æ74æÖSÒ&&÷WBÖÖVF–#àĞ¢Ä÷F–Ö—¦VD–ÖvPĞ¢7&3Ò"ö–ÖvW2öf7F÷'’Ö6×W2æ§Vr Ğ¢ÇCÒ$æçFöær¤”ä4„Tär¤Tä4$Rf7F÷'’W‡FW&–÷" Ğ¢ÆöF–æsÒ&VvW" Ğ¢óàĞ¢ÂöF—càĞ¢ÆF—b6Æ74æÖSÒ&&÷WBÖ6÷’#àĞ¢Ç6Æ74æÖSÒ'6V7F–öâÖ¶–6¶W"#äf7F÷'’&öf–ÆSÂ÷àĞ¢Æƒ#àĞ¢æçFöær¤”ä4„Tär¤Tä4$RÀĞ¢Æ'"óàĞ¢âÆVÒ6Æ74æÖSÒ'F—FÆRÖ¶W’#äôTÒôôDÒ6÷W&6Rf7F÷'“ÂöVÓâàĞ¢Âöƒ#àĞ¢ÇàĞ¢#–V'2fö7W6VBöâWBG2ÂWBF–W'2Â6&R&VBG2ÂæBGVÇBçW'6–ærG2àĞ¢Â÷àĞ¢ÇàĞ¢"Ã7æÒf7F÷'’Â‚WFöÖFVBÆ–æW2Â3Ò72æçVÂ66—G’àĞ¢Â÷àĞ¢ÆF—b6Æ74æÖSÒ&6öçF7B×7G&—#àĞ¢Æ‡&Vc×·v†G66†EW&ÇÒF&vWCÒ%ö&Ææ²"&VÃÒ&æ÷&VfW'&W"#ãÅ†öæR6—¦S×³‡Òóâ³ƒbƒc3S“sÂöàĞ¢Æ‡&Vc×¶'V–ÆDÖ–ÇFò‚uvV'6—FR–çV—'’rÂV÷FF–öäVÖ–Ä&öG’—Ò&–ÖÆ&VÃ×¶VÖ–ÂG¶6öçF7DVÖ–ÇÖÓãÄÖ–Â6—¦S×³‡Òóâ¶6öçF7DVÖ–ÇÓÂöàĞ¢ÂöF—càĞ¢ÂöF—càĞ¢ÂöF—càĞ¢ÆF—b6Æ74æÖSÒ'&öf–ÆRÖÖWG&–72Ö&""&–ÖÆ&VÃÒ$f7F÷'’6÷&R7G&VæwF‡2#àĞ¢ÆF—càĞ¢Ç7G&öæsã#–V'3Â÷7G&öæsàĞ¢Ç7ãä–æGW7G'’W‡W&–Væ6SÂ÷7ãàĞ¢ÂöF—càĞ¢ÆF—càĞ¢Ç7G&öæsã"Ã7æÓÂ÷7G&öæsàĞ¢Ç7ãäf7F÷'’&VÂ÷7ãàĞ¢ÂöF—càĞ¢ÆF—càĞ¢Ç7G&öæsã‚Æ–æW3Â÷7G&öæsàĞ¢Ç7ãäWFöÖFVB&öGV7F–öãÂ÷7ãàĞ¢ÂöF—càĞ¢Æ‡&VcÒ"66öçF7B#àĞ¢vWB7W7FöÒÆàĞ¢Ä'&÷uW&–v‡B6—¦S×³‡ÒóàĞ¢ÂöàĞ¢ÂöF—càĞ¢ÂöF—càĞ¢Â÷6V7F–öãàĞ Ğ¢Ç6V7F–öâ6Æ74æÖSÒ'6V7F–öâ&ö¦V7G2"–CÒ'&ö¦V7G2#àĞ¢ÆF—b6Æ74æÖSÒ&6öçF–æW"#àĞ¢ÆF—b6Æ74æÖSÒ'6V7F–öâÖ†VB#àĞ¢ÆF—càĞ¢Ç6Æ74æÖSÒ'6V7F–öâÖ¶–6¶W"#å6VÆV7FVB&ö¦V7G3Â÷àĞ¢Æƒ#àĞ¢&VÂ&öGV7F–öâ66VæW2f÷"ÆVÒ6Æ74æÖSÒ'F—FÆRÖ¶W’#ç66Æ&ÆRôTÒFVÆ—fW'“ÂöVÓâàĞ¢Âöƒ#àĞ¢ÂöF—càĞ¢ÂöF—càĞ¢ÆF—b6Æ74æÖSÒ'&ö¦V7BÖw&–B#àĞ¢¶f7F÷'”–ÖvW2æÖ‚†—FVÒÂ–æFW‚’Óâ€Ğ¢Æ'F–6ÆR6Æ74æÖS×¶&ö¦V7BÖ6&B&ö¦V7BÒG¶–æFW‚²ÖÒ¶W“×¶—FVÒçF—FÆWÓàĞ¢Ä÷F–Ö—¦VD–ÖvR7&3×¶—FVÒç7&7ÒÇC×¶G¶—FVÒçF—FÆWÒf7F÷'’&öGV7F–öâ66VæVÒóàĞ¢ÆF—b6Æ74æÖSÒ'&ö¦V7BÖ6öçFVçB#àĞ¢Ç7ãç¶—FVÒçFwÓÂ÷7ãàĞ¢Æƒ3ç¶—FVÒçF—FÆWÓÂöƒ3àĞ¢ÂöF—càĞ¢Âö'F–6ÆSàĞ¢’—ĞĞ¢ÂöF—càĞ¢ÂöF—càĞ¢Â÷6V7F–öãàĞ Ğ¢Ç6V7F–öâ6Æ74æÖSÒ'6V7F–öâ–ææ÷fF–öâ"–CÒ&–ææ÷fF–öâ#àĞ¢ÆF—b6Æ74æÖSÒ&6öçF–æW"–ææ÷fF–öâÖw&–B#àĞ¢ÆF—b6Æ74æÖSÒ&–ææ÷fF–öâÖ6÷’#àĞ¢Ç6Æ74æÖSÒ'6V7F–öâÖ¶–6¶W"#å&öGV7B–ææ÷fF–öãÂ÷àĞ¢Æƒ#àĞ¢ÆVÒ6Æ74æÖSÒ'F—FÆRÖ¶W’#å"dBÖÆVBWw&FW3ÂöVÓâf÷"Ö&¶WB×&VG’&öGV7G2àĞ¢Âöƒ#àĞ¢ÇàĞ¢g&öÒÖFW&–Ç2Fò6¶v–ærÂvR'V–ÆB66Æ&ÆR&öGV7B7—7FV×2àĞ¢Â÷àĞ¢ÂöF—càĞ¢ÆF—b6Æ74æÖSÒ&–ææ÷fF–öâÖ6&G2#àĞ¢¶–ææ÷fF–öç2æÖ‚‡²–6öã¢–6öâÂF—FÆRÂFW‡BÒ’Óâ€Ğ¢Æ'F–6ÆR6Æ74æÖSÒ&–ææ÷fF–öâÖ6&B"¶W“×·F—FÆWÓàĞ¢ÆF—b6Æ74æÖSÒ&–6öâÖ&÷‚#àĞ¢Ä–6öâ6—¦S×³#gÒ7G&ö¶Uv–GFƒ×³ãwÒóàĞ¢ÂöF—càĞ¢ÆF—càĞ¢Æƒ3ç·F—FÆWÓÂöƒ3àĞ¢Çç·FW‡GÓÂ÷àĞ¢ÂöF—càĞ¢Âö'F–6ÆSàĞ¢’—ĞĞ¢ÂöF—càĞ¢ÂöF—càĞ¢Â÷6V7F–öãàĞ Ğ¢Ç6V7F–öâ6Æ74æÖSÒ'6V7F–öâVÆ—G’"–CÒ'VÆ—G’#àĞ¢ÆF—b6Æ74æÖSÒ&6öçF–æW"VÆ—G’ÖÆ–÷WB#àĞ¢ÆF—b6Æ74æÖSÒ'VÆ—G’×f—7VÂ#àĞ¢Ä÷F–Ö—¦VD–ÖvPĞ¢7&3Ò"ö–ÖvW2÷VÆ—G’Ö–ç7V7F–öâÖÆ"ÖÖ6²çær Ğ¢ÇCÒ%WBBVÆ—G’–ç7V7F–öâæBÆ&÷&F÷'’FW7F–ær Ğ¢ÆöF–æsÒ&VvW" Ğ¢óàĞ¢ÆF—b6Æ74æÖSÒ'VÆ—G’Ö&FvR#àĞ¢ÄÖ–7&÷66÷R6—¦S×³#ÒóàĞ¢Ç7ãä&F6‚–ç7V7F–öãÂ÷7ãàĞ¢ÂöF—càĞ¢ÂöF—càĞ¢ÆF—b6Æ74æÖSÒ'VÆ—G’Ö6öçFVçB#àĞ¢Ç6Æ74æÖSÒ'6V7F–öâÖ¶–6¶W"#åVÆ—G’–ç7V7F–öãÂ÷àĞ¢Æƒ#àĞ¢&F6‚ÖÆWfVÂÆVÒ6Æ74æÖSÒ'F—FÆRÖ¶W’#çVÆ—G’6öçG&öÃÂöVÓâàĞ¢Âöƒ#àĞ¢ÇàĞ¢ÖFW&–Ç2Â&ö6W72ÂW&f÷&Öæ6RÂæB6†—ÖVçB&R6†V6¶VB&Vf÷&RFVÆ—fW'’àĞ¢Â÷àĞ¢ÆF—b6Æ74æÖSÒ&–ç7V7F–öâÖÆ—7B#àĞ¢¶–ç7V7F–öç2æÖ‚…·7FWÂF—FÆRÂFW‡EÒ’Óâ€Ğ¢Æ'F–6ÆR6Æ74æÖSÒ&–ç7V7F–öâÖ—FVÒ"¶W“×·F—FÆWÓàĞ¢Ç7G&öæsç·7FWÓÂ÷7G&öæsàĞ¢ÆF—càĞ¢Æƒ3ç·F—FÆWÓÂöƒ3àĞ¢Çç·FW‡GÓÂ÷àĞ¢ÂöF—càĞ¢Âö'F–6ÆSàĞ¢’—ĞĞ¢ÂöF—càĞ¢ÂöF—càĞ¢ÂöF—càĞ¢Â÷6V7F–öãàĞ Ğ¢Ç6V7F–öâ6Æ74æÖSÒ'6V7F–öâGfçFvW2"–CÒ&GfçFvW2#àĞ¢ÆF—b6Æ74æÖSÒ&6öçF–æW"#àĞ¢ÆF—b6Æ74æÖSÒ'6V7F–öâÖ†VB6ö×7B#àĞ¢ÆF—càĞ¢Ç6Æ74æÖSÒ'6V7F–öâÖ¶–6¶W"#åv‡’¤”ä4„Tär¤Tä4$SÂ÷àĞ¢Æƒ#àĞ¢6÷W&6Rf7F÷'’7G&VæwF‚f÷"ÆVÒ6Æ74æÖSÒ'F—FÆRÖ¶W’#äôTÒôôDÒ7WÇ’7W÷'CÂöVÓâàĞ¢Âöƒ#àĞ¢ÂöF—càĞ¢ÂöF—càĞ¢ÆF—b6Æ74æÖSÒ&GfçFvRÖw&–B#àĞ¢¶GfçFvW2æÖ‚‡²–6öã¢–6öâÂF—FÆRÂFW‡BÒ’Óâ€Ğ¢Æ'F–6ÆR6Æ74æÖSÒ&GfçFvRÖ6&B"¶W“×·F—FÆWÓàĞ¢ÆF—b6Æ74æÖSÒ&–6öâÖ&÷‚#àĞ¢Ä–6öâ6—¦S×³#gÒ7G&ö¶Uv–GFƒ×³ãwÒóàĞ¢ÂöF—càĞ¢Æƒ3ç·F—FÆWÓÂöƒ3àĞ¢Çç·FW‡GÓÂ÷àĞ¢Âö'F–6ÆSàĞ¢’—ĞĞ¢ÂöF—càĞ¢ÂöF—càĞ¢Â÷6V7F–öãàĞ Ğ¢Ç6V7F–öâ6Æ74æÖSÒ'6V7F–öâ7W7FöÖ—¦F–öâ"–CÒ&7W7FöÖ—¦F–öâ#àĞ¢ÆF—b6Æ74æÖSÒ&6öçF–æW"#àĞ¢ÆF—b6Æ74æÖSÒ'6V7F–öâÖ†VB7W7FöÖ—¦F–öâÖ†VB#àĞ¢ÆF—càĞ¢Ç6Æ74æÖSÒ'6V7F–öâÖ¶–6¶W"#å&öGV7B7W7FöÖ—¦F–öãÂ÷àĞ¢Æƒ#àĞ¢'V–ÆB–÷W"ÆVÒ6Æ74æÖSÒ'F—FÆRÖ¶W’#ç&—fFRÖÆ&VÂÆ–æSÂöVÓâàĞ¢Âöƒ#àĞ¢ÂöF—càĞ¢Æ6Æ74æÖSÒ'6V7F–öâÖ7F–öâ"‡&VcÒ"66öçF7B#àĞ¢&WVW7B&öGV7BÆàĞ¢Ä'&÷uW&–v‡B6—¦S×³‡ÒóàĞ¢ÂöàĞ¢ÂöF—càĞ Ğ¢ÆF—b6Æ74æÖSÒ&7W7FöÖ—¦F–öâ×FööÆ&""&–ÖÆ&VÃÒ%&öGV7B7W7FöÖ—¦F–öâ6FVv÷&–W2#àĞ¢ÆF—càĞ¢Ç7G&öæsäÆÂ6FVv÷&–W3Â÷7G&öæsàĞ¢Ç7ãä6÷&R&öGV7G2Â7G'V7GW&W2Âf÷&×VÆ2ÂæB&WF–Â×&VG’6·2ãÂ÷7ãàĞ¢ÂöF—càĞ¢ÆF—b6Æ74æÖSÒ&7W7FöÖ—¦F–öâ×F'2#àĞ¢Ç7ãåWBG3Â÷7ãàĞ¢Ç7ãä'6÷&&VçB6÷&SÂ÷7ãàĞ¢Ç7ãäöF÷"6öçG&öÃÂ÷7ãàĞ¢Ç7ãå6¶v–æsÂ÷7ãàĞ¢Ç7ãå&—fFRÆ&VÃÂ÷7ãàĞ¢ÂöF—càĞ¢ÂöF—càĞ Ğ¢ÆF—b6Æ74æÖSÒ&7W7FöÒ×&öGV7BÖw&–B#àĞ¢¶7W7FöÕ&öGV7G2æÖ‚‡&öGV7B’Óâ€Ğ¢Æ'F–6ÆR6Æ74æÖSÒ&7W7FöÒ×&öGV7BÖ6&B"¶W“×·&öGV7BçF—FÆWÓàĞ¢ÆF—b6Æ74æÖSÒ&7W7FöÒ×&öGV7BÖÖVF–#àĞ¢Ä÷F–Ö—¦VD–ÖvR7&3×·&öGV7Bæ–ÖvWÒÇC×¶G·&öGV7BçF—FÆWÒ7W7FöÖ—¦F–öâ÷F–öæÒóàĞ¢Ç7ãç·&öGV7Bæ&FvWÓÂ÷7ãàĞ¢ÂöF—càĞ¢ÆF—b6Æ74æÖSÒ&7W7FöÒ×&öGV7BÖ&öG’#àĞ¢Çç·&öGV7Bæ6FVv÷'—ÓÂ÷àĞ¢Æƒ3ç·&öGV7BçF—FÆWÓÂöƒ3àĞ¢ÆF—b6Æ74æÖSÒ&7W7FöÒ×7V72#àĞ¢·&öGV7Bç7V72æÖ‚‡7V2’Óâ€Ğ¢Ç7â¶W“×·7V7Óç·7V7ÓÂ÷7ãàĞ¢’—ĞĞ¢ÂöF—càĞ¢Æ‡&Vc×¶÷&öGV7G2òG·&öGV7Bç6ÇVwÖÓàĞ¢¶æ÷rÖ÷&RââàĞ¢Ä'&÷uW&–v‡B6—¦S×³gÒóàĞ¢ÂöàĞ¢ÂöF—càĞ¢Âö'F–6ÆSàĞ¢’—ĞĞ¢ÂöF—càĞ¢ÂöF—càĞ¢Â÷6V7F–öãàĞ Ğ¢Ç6V7F–öâ6Æ74æÖSÒ&6öçF7B×vR"–CÒ&6öçF7B#àĞ¢ÆF—b6Æ74æÖSÒ&6öçF–æW"6öçF7BÖ–ææW"#àĞ¢ÆF—b6Æ74æÖSÒ&6öçF7BÖ6÷’#àĞ¢Ç6Æ74æÖSÒ'6V7F–öâÖ¶–6¶W"#å7F'B–÷W"7W7FöÒ÷&FW#Â÷àĞ¢Æƒ#àĞ¢Ç7ãå7F'B–÷W#Â÷7ãàĞ¢Ç7ããÆVÒ6Æ74æÖSÒ'F—FÆRÖ¶W’#æ7W7FöÒWB&öGV7G2&öw&ÓÂöVÓâãÂ÷7ãàĞ¢Âöƒ#àĞ¢ÇàĞ¢6VæB–÷W"F&vWBÖ&¶WBÂ7V72Â6¶v–ærÂæB÷&FW"ÆââvRv–ÆÂ&W&RF†RôTÒôôDÒ6öÇWF–öâàĞ¢Â÷àĞ¢ÆF—b6Æ74æÖSÒ&6öçF7B×æVÂ#àĞ¢Æ‡&Vc×·v†G66†EW&ÇÒF&vWCÒ%ö&Ææ²"&VÃÒ&æ÷&VfW'&W"#àĞ¢Å†öæR6—¦S×³#ÒóàĞ¢Ç7ãâ³ƒbƒc3S“sÂ÷7ãàĞ¢ÂöàĞ¢Æ‡&Vc×¶'V–ÆDÖ–ÇFò‚uvV'6—FR–çV—'’rÂV÷FF–öäVÖ–Ä&öG’—Ò&–ÖÆ&VÃ×¶VÖ–ÂG¶6öçF7DVÖ–ÇÖÓàĞ¢ÄÖ–Â6—¦S×³#ÒóàĞ¢Ç7ãç¶6öçF7DVÖ–ÇÓÂ÷7ãàĞ¢ÂöàĞ¢ÂöF—càĞ¢ÂöF—càĞ¢Ä–çV—'”f÷&ĞĞ¢&öGV7CÒ$ôTÒôôDÒWB&öGV7G2 Ğ¢6÷W&6SÒ&6öçF7B×vR Ğ¢&÷w3×³GĞĞ¢'WGFöäÆ&VÃÒ%6VæB–çV—'’ Ğ¢óàĞ¢ÂöF—càĞ¢Â÷6V7F–öãàĞ¢Æfö÷FW"6Æ74æÖSÒ'6—FRÖfö÷FW"#àĞ¢ÆF—b6Æ74æÖSÒ&fö÷FW"×7W÷'B#àĞ¢ÆF—b6Æ74æÖSÒ&6öçF–æW"fö÷FW"×7W÷'BÖ–ææW"#àĞ¢Ç7G&öæsç·V’ç7W÷'GÓÂ÷7G&öæsàĞ¢Æ‡&Vc×·v†G66†EW&ÇÒF&vWCÒ%ö&Ææ²"&VÃÒ&æ÷&VfW'&W"#àĞ¢Å†öæR6—¦S×³#ÒóàĞ¢³ƒbƒc3S“sĞ¢ÂöàĞ¢Æ‡&Vc×·v†G66†EW&ÇÒF&vWCÒ%ö&Ææ²"&VÃÒ&æ÷&VfW'&W"#àĞ¢ÄÖW76vT6—&6ÆR6—¦S×³#ÒóàĞ¢·V’æ6†GĞĞ¢ÂöàĞ¢Æ6Æ74æÖSÒ&fö÷FW"×F÷ÖÆ–æ²"‡&VcÒ"6†öÖR#àĞ¢Ä'&÷uW6—¦S×³#ÒóàĞ¢·V’çF÷ĞĞ¢ÂöàĞ¢ÂöF—càĞ¢ÂöF—càĞ¢ÆF—b6Æ74æÖSÒ&fö÷FW"ÖÆ–æ·2Ö&æB#àĞ¢ÆF—b6Æ74æÖSÒ&6öçF–æW"fö÷FW"ÖÆ–æ·2Ö–ææW"#àĞ¢Ææb6Æ74æÖSÒ&fö÷FW"ÖÆ–æ·2"&–ÖÆ&VÃÒ$fö÷FW"Æ–æ·2#àĞ¢¶fö÷FW$Æ–æ·2æÖ‚†Æ–æ²Â–æFW‚’Óâ€Ğ¢Æ¶W“×¶Æ–æ²æÆ&VÇÒ‡&Vc×¶Æ–æ²æ‡&VgÓç·V’æfö÷FW%¶–æFW…ÒóòÆ–æ²æÆ&VÇÓÂöàĞ¢’—ĞĞ¢ÂöæcàĞ¢ÂöF—càĞ¢ÂöF—càĞ¢Âöfö÷FW#àĞ¢ÂöÖ–ãàĞ¢“°Ğ§ĞĞ Ğ¦7&VFU&ö÷B†Fö7VÖVçBævWDVÆVÖVçD'”–B‚w&ö÷Br’’ç&VæFW"ƒÄóâ“°Ğ Ğ 