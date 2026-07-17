import { blogArticles, getBlogArticleText } from '../src/blogData.js';

export const siteUrl = 'https://www.jczcare.com';

export const defaultImage = '/images/factory-campus.jpeg';

export const organization = {
  name: 'Nantong JINCHENG ZENCARE Technology Company',
  alternateName: 'JCZCARE',
  email: 'hengtuo@nthengtuo.com',
  telephone: '+86 18962944556',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: '+86 18962944556',
    availableLanguage: ['English'],
    url: 'https://wa.me/8618962944556',
  },
  addressLocality: 'Nantong',
  addressRegion: 'Jiangsu',
  addressCountry: 'CN',
  sameAs: ['https://youtube.com/@nantongjinchengzencaretechnolo'],
};

export const baseSeo = {
  path: '/',
  title: 'Nantong JINCHENG ZENCARE | Pet Pad OEM/ODM Source Factory',
  description:
    'Nantong JINCHENG ZENCARE is a pet pad OEM/ODM source factory for pet pads, absorbent care products, private-label packaging, and B2B supply.',
  image: defaultImage,
  type: 'WebPage',
};

export const productSeo = [
  {
    path: '/products/disposable-pet-pads',
    title: 'Disposable Pet Pads OEM Manufacturer | JCZCARE',
    description:
      'Disposable pet pads for OEM/ODM buyers needing custom sizes, absorbency levels, embossing options, private-label packaging, and factory-side production support.',
    image: '/images/custom-disposable-pet-pads-premium.png',
    productName: 'Disposable Pet Pads',
    category: 'OEM pet pads',
  },
  {
    path: '/products/adult-underpads',
    title: 'Premium Adult Disposable Underpads OEM Manufacturer | JCZCare',
    description:
      'OEM adult disposable underpads manufacturer providing customizable absorbent underpads for hospitals, distributors and private label brands worldwide.',
    image: '/images/adult-underpads-hero.png',
    productName: 'Adult Disposable Underpads',
    category: 'Healthcare absorbent underpads',
    faqs: [
      ['Can I customize the package?', 'Yes. Private-label artwork, pack count, bag format, carton marks, and outer packaging can be reviewed for your target market.'],
      ['What is your MOQ?', 'MOQ is negotiated according to size, absorbency specification, packaging format, and production planning.'],
      ['Can you print my logo?', 'Yes. Logo printing and private-label presentation can be reviewed during packaging and artwork confirmation.'],
      ['Can you develop new sizes?', 'Yes. Size, weight, core configuration, and packing can be reviewed for new product programs before sampling.'],
      ['What certificates do you have?', 'Documentation should be confirmed against the destination market and specific product program.'],
      ['How long is production?', 'Timing depends on specification approval, raw-material planning, packaging confirmation, and order quantity.'],
      ['Do you provide samples?', 'Yes. Samples can be arranged for material feel, dimensions, absorbency direction, and packaging review.'],
      ['Can you support Amazon brands?', 'Yes. We can discuss private-label specifications, packaging, carton information, and supply planning for online brands.'],
    ],
  },
  {
    path: '/products/pet-care-pad-glove-wipes',
    title: 'Pet Care Pad & Glove Wipes OEM | JCZCARE',
    description:
      'Pet care pads and disposable glove wipes for private-label retail programs, custom pack counts, soft surface options, and B2B product development.',
    image: '/images/custom-care-pad-packaging-ai.png',
    productName: 'Pet Care Pad & Glove Wipes',
    category: 'Pet care absorbent products',
  },
  {
    path: '/products/pet-absorbent-paper-sheets',
    title: 'Pet Absorbent Paper Sheets Manufacturer | JCZCARE',
    description:
      'Pet absorbent paper sheets configured for SAP blend, layer material, bulk customization, and factory-direct absorbent core supply.',
    image: '/images/custom-absorbent-paper-ai.png',
    productName: 'Pet Absorbent Paper Sheets',
    category: 'Absorbent paper sheets',
  },
  {
    path: '/products/custom-pet-waste-bags',
    title: 'Custom Pet Waste Bags OEM Supplier | JCZCARE',
    description:
      'Custom pet waste bags with color, thickness, roll format, and OEM packaging support for brands, distributors, and retail channels.',
    image: '/images/custom-pet-waste-bags-ai.png',
    productName: 'Custom Pet Waste Bags',
    category: 'Pet waste bags',
  },
  {
    path: '/products/charcoal-pet-pads',
    title: 'Charcoal Pet Pads OEM Manufacturer | JCZCARE',
    description:
      'Charcoal pet pads with absorbent structure, carbon layer options, custom sizes, private-label packaging, and B2B sample development support.',
    image: '/images/custom-charcoal-pet-pad-ai.png',
    productName: 'Charcoal Pet Pads',
    category: 'Charcoal pet pads',
  },
  {
    path: '/products/adhesive-pet-pads',
    title: 'Adhesive Pet Pads OEM Manufacturer | JCZCARE',
    description:
      'Adhesive pet pads with custom backing, secure placement options, easy-removal design direction, private-label packaging, and factory production support.',
    image: '/images/custom-adhesive-pet-pad-ai.png',
    productName: 'Adhesive Pet Pads',
    category: 'Adhesive pet pads',
  },
];

export const pageSeo = [
  baseSeo,
  {
    path: '/profile',
    title: 'Factory Profile | Nantong JINCHENG ZENCARE',
    description:
      'Factory profile for Nantong JINCHENG ZENCARE, a pet care absorbent product source manufacturer with OEM/ODM support, automated lines, and export-oriented production.',
    image: defaultImage,
  },
  {
    path: '/projects',
    title: 'Factory Projects & Production Scenes | JCZCARE',
    description:
      'Explore production scenes, warehouse organization, packaging workflows, and factory visuals for JCZCARE OEM/ODM pet care absorbent product programs.',
    image: '/images/production-line-clean.png',
  },
  {
    path: '/innovation',
    title: 'Pet Pad Product Innovation | JCZCARE OEM/ODM',
    description:
      'Product innovation for pet pad OEM/ODM projects, including absorbent structure planning, performance customization, and brand-ready development.',
    image: '/images/pet-pad-layer-protection-premium.png',
  },
  {
    path: '/quality',
    title: 'Pet Pad Quality Inspection | JCZCARE',
    description:
      'Batch-level quality inspection for pet pads, absorbent sheets, materials, production checks, performance review, and shipment readiness.',
    image: '/images/quality-inspection-lab-mask.png',
  },
  {
    path: '/advantages',
    title: 'Factory Advantages | JCZCARE OEM Pet Pads',
    description:
      'Source factory advantages for OEM/ODM pet pad buyers, including production coordination, sample support, quality system, and export supply planning.',
    image: '/images/factory-campus.jpeg',
  },
  {
    path: '/customization',
    title: 'Product Customization | Private Label Pet Pads | JCZCARE',
    description:
      'Customize pet pads, absorbent cores, charcoal pads, adhesive pads, care products, and retail-ready packs with JCZCARE factory-side OEM/ODM support.',
    image: '/images/custom-disposable-pet-pads-premium.png',
  },
  {
    path: '/news',
    title: 'JCZCARE News & Factory Ideas',
    description:
      'Factory ideas, product planning notes, and B2B pet care absorbent product updates from Nantong JINCHENG ZENCARE.',
    image: '/images/contact-pets-grass-centered.png',
  },
  {
    path: '/about',
    title: 'About JCZCARE | Pet Pad Source Factory',
    description:
      'Learn about JCZCARE as a pet care absorbent product source factory supporting OEM/ODM manufacturing, private-label packaging, and B2B supply.',
    image: defaultImage,
  },
  {
    path: '/contact',
    title: 'Contact JCZCARE | OEM Pet Pad Manufacturer Inquiry',
    description:
      'Contact Nantong JINCHENG ZENCARE for OEM pet pads, private-label packaging, samples, product planning, absorbent core development, and B2B factory cooperation.',
    image: '/images/contact-pets-grass-centered.png',
    type: 'ContactPage',
    faqs: [
      ['What should I include in my inquiry?', 'Please include product type, target market, size, absorbency, packaging idea, quantity, and delivery expectation.'],
      ['Can I contact by WhatsApp?', 'Yes. You can contact JCZCARE by WhatsApp for OEM/ODM pet pad project discussion.'],
    ],
  },
  {
    path: '/oem-pet-pee-pads',
    title: 'OEM Pet Pee Pads Manufacturer | Nantong JINCHENG ZENCARE',
    description:
      'OEM pet pee pads manufacturer for overseas brands, wholesalers, importers, supermarkets, and distributors needing custom size, absorbency, and packaging.',
    image: '/images/custom-disposable-pet-pads-premium.png',
    faqs: [
      ['Can you customize OEM pet pee pads?', 'Yes. We can customize size, absorbency, surface material, embossing, packaging, carton marks, and pack count.'],
      ['Can you prepare samples before production?', 'Yes. Samples can be prepared for specification review, absorbency testing, and packaging confirmation.'],
    ],
  },
  {
    path: '/private-label-pet-pads',
    title: 'Private Label Pet Pads Manufacturer | OEM Packaging & Supply',
    description:
      'Private label pet pads manufacturer supporting brand packaging, custom specifications, absorbency options, sample development, and export supply for B2B pet care buyers.',
    image: '/images/custom-care-pad-packaging-ai.png',
  },
  {
    path: '/pet-pee-pad-manufacturer',
    title: 'Pet Pee Pad Manufacturer in China | JCZCARE OEM Factory',
    description:
      'China pet pee pad manufacturer for OEM/ODM orders, custom absorbency, private-label packaging, automated production, and export-ready B2B supply.',
    image: defaultImage,
  },
  {
    path: '/pet-pad-factory',
    title: 'Pet Pad Factory | Automated OEM Pet Care Manufacturing',
    description:
      'Pet pad factory with automated production, custom specifications, absorbent core development, private-label packaging, and B2B export coordination.',
    image: '/images/production-line-clean.png',
  },
  {
    path: '/about-factory',
    title: 'About JCZCARE Factory | Nantong JINCHENG ZENCARE',
    description:
      'Learn about Nantong JINCHENG ZENCARE, a pet care absorbent product manufacturer focused on OEM/ODM pet pads, private-label support, quality control, and export service.',
    image: defaultImage,
  },
  {
    path: '/quality-control',
    title: 'Pet Pad Quality Control | OEM Absorbency & Batch Inspection',
    description:
      'Quality control process for OEM pet pads covering raw materials, production checks, absorbency testing, rewet review, leakage performance, packaging, and shipment inspection.',
    image: '/images/quality-inspection-lab-mask.png',
  },
  {
    path: '/oem-process',
    title: 'OEM Pet Pad Process | From Brief to Production',
    description:
      'OEM pet pad process for B2B buyers: project brief, specification planning, sample development, testing, packaging confirmation, production, inspection, and shipment.',
    image: '/images/warehouse-storage-clean.png',
  },
  {
    path: '/certifications',
    title: 'Pet Pad Factory Certifications & Compliance Support | JCZCARE',
    description:
      'Certification and compliance support for pet pad OEM buyers, including factory documentation, material information, packaging coordination, and B2B export requirements.',
    image: '/images/production-line-enhanced.png',
  },
  {
    path: '/faq',
    title: 'OEM Pet Pad FAQ | Private Label, MOQ, Samples & Quality',
    description:
      'Frequently asked questions for OEM pet pad buyers covering customization, private label, samples, MOQ planning, quality control, packaging, delivery, and factory cooperation.',
    image: '/images/pet-pad-product-studio.png',
    faqs: [
      ['Do you offer OEM and ODM service?', 'Yes. JCZCARE offers OEM and ODM support for pet pads, absorbent sheets, pet diapers, dog poop bags, and related products.'],
      ['Can we customize the package?', 'Yes. Private-label packaging, pack count, carton marks, labels, and brand presentation can be customized.'],
      ['Can you ship overseas?', 'Yes. We support export-oriented B2B projects and coordinate packing and shipment requirements with buyers.'],
    ],
  },
  {
    path: '/blog',
    title: 'Pet Pad OEM Blog | Factory Ideas, Product Development & B2B Supply',
    description:
      'Read JCZCARE blog insights about OEM pet pads, private-label packaging, absorbent core development, quality control, factory supply, and B2B pet care product planning.',
    image: '/images/contact-pets-grass-centered.png',
  },
  {
    path: '/pages/news',
    title: 'News & Ideas | Pet Pad OEM Factory Insights | JCZCARE',
    description:
      'Factory ideas and B2B insights about OEM pet pads, private-label packaging, absorbent core development, quality control, and export supply.',
    image: '/images/contact-pets-grass-centered.png',
  },
  {
    path: '/request-product-plan',
    title: 'OEM Product Plan Request | JCZCARE Pet Pad Factory',
    description:
      'Submit your OEM/ODM pet pad project details to Nantong JINCHENG ZENCARE for specification planning, samples, packaging direction, and B2B factory support.',
    image: '/images/pet-pad-layer-protection-premium.png',
  },
  {
    path: '/sign-in',
    title: 'Business Sign In | JCZCARE',
    description: 'Sign in to the JCZCARE business portal for OEM pet pad project communication and account registration.',
    image: defaultImage,
  },
  {
    path: '/pages/about',
    title: 'About Nantong JINCHENG ZENCARE | Pet Pad Source Factory',
    description:
      'Learn about Nantong JINCHENG ZENCARE, a pet care absorbent products source factory supporting OEM/ODM pet pads, private-label packaging, and export supply.',
    image: defaultImage,
  },
  {
    path: '/pages/investor-relations',
    title: 'Business Overview | JCZCARE Pet Care Manufacturing',
    description:
      'A business overview of JCZCARE manufacturing capability, production capacity, quality focus, and B2B absorbent pet care product supply.',
    image: defaultImage,
  },
  {
    path: '/pages/affiliates',
    title: 'Distributor & Partner Program | JCZCARE OEM Pet Pads',
    description:
      'Partner with JCZCARE as a distributor or sourcing partner for OEM pet pads, private-label absorbent products, packaging support, and factory supply.',
    image: '/images/contact-pets-grass-centered.png',
  },
  {
    path: '/pages/help',
    title: 'Help Center | OEM Pet Pad Orders, Samples & Packaging',
    description:
      'Find answers about OEM pet pad orders, sample development, packaging support, quality control, production scheduling, and factory communication.',
    image: '/images/quality-inspection-lab-mask.png',
  },
  {
    path: '/pages/learn',
    title: 'Learn Center | Pet Pad OEM Knowledge & Product Planning',
    description:
      'Learn about pet pad absorbency, private-label packaging, product structure, factory supply, quality control, and OEM/ODM development decisions.',
    image: '/images/pet-pad-layer-protection-premium.png',
  },
  {
    path: '/pages/give-back',
    title: 'Responsible Pet Care Manufacturing | JCZCARE',
    description:
      'Explore JCZCARE responsible manufacturing principles for practical absorbent pet care products, quality planning, and long-term B2B cooperation.',
    image: '/images/contact-pets-grass-centered.png',
  },
  {
    path: '/pages/gift-cards',
    title: 'OEM Sample Kits | Pet Pad Material & Packaging Review',
    description:
      'Request OEM sample kits for pet pads, absorbent sheets, packaging swatches, material review, and buyer-ready private-label product planning.',
    image: '/images/custom-disposable-pet-pads-premium.png',
  },
];

export const newsSeo = [
  {
    path: '/pages/news/private-label-pet-pad-ideas',
    title: 'Private-label pet pad ideas for sharper product lines | JCZCARE News',
    description:
      'Practical private-label pet pad ideas for brands planning differentiated sizes, packaging, absorbency, and channel-ready product lines.',
    image: '/images/custom-disposable-pet-pads-premium.png',
  },
  {
    path: '/pages/news/absorbent-core-development-notes',
    title: 'Absorbent Core Development Notes | JCZCARE News',
    description:
      'Factory notes on absorbent core structure, SAP balance, material selection, and product planning for OEM pet pad development.',
    image: '/images/pet-pad-layer-protection-premium.png',
  },
  {
    path: '/pages/news/factory-visual-content-for-b2b-brands',
    title: 'Factory Visual Content for B2B Pet Care Brands | JCZCARE News',
    description:
      'Why factory visuals, production photos, quality scenes, and packaging documentation support B2B buyer trust in pet care OEM projects.',
    image: defaultImage,
  },
];

export const blogSeo = blogArticles.map((article) => ({
  path: article.path,
  title: article.seoTitle,
  description: article.metaDescription,
  image: article.image,
  type: 'Article',
  article,
  faqs: article.faqs,
  articleBody: getBlogArticleText(article),
}));

export const regions = [
  'united-states',
  'canada',
  'united-kingdom',
  'germany',
  'france',
  'italy',
  'spain',
  'netherlands',
  'poland',
  'sweden',
  'denmark',
  'norway',
  'finland',
  'belgium',
  'switzerland',
  'austria',
  'ireland',
  'portugal',
].map((slug) => ({
  path: `/region/${slug}`,
  title: `JCZCARE OEM Pet Pads for ${slug.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ')} Buyers`,
  description:
    `OEM/ODM pet pad and absorbent product support for ${slug.split('-').join(' ')} B2B buyers seeking private-label packaging and export coordination.`,
  image: defaultImage,
}));

export const allSeoEntries = [...pageSeo, ...productSeo, ...newsSeo, ...blogSeo, ...regions];

export const getSeoEntry = (path = '/') => allSeoEntries.find((entry) => entry.path === path) || {
  ...baseSeo,
  path,
  title: `${path.split('/').filter(Boolean).join(' ').replace(/\b\w/g, (char) => char.toUpperCase()) || 'JCZCARE'} | Nantong JINCHENG ZENCARE`,
};

