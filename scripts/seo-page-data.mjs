import { blogArticles, getBlogArticleText } from '../src/blogData.js';
import { getAuthoritySeoEntries } from '../src/authorityData.js';
import { productSeries } from '../src/productCatalogData.js';

export const siteUrl = 'https://www.jczcare.com';

export const defaultImage = '/images/oem/factory/factory-campus-real-aerial-20260729.png';

export const organization = {
  name: 'Nantong JINCHENG ZENCARE Technology Company',
  alternateName: ['JCZCARE', '\u5357\u901a\u9526\u7a0b\u81fb\u62a4\u79d1\u6280\u6709\u9650\u516c\u53f8'],
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
  ...productSeries.map((series) => ({
  path: `/products/${series.slug}`,
  title: series.seoTitle,
  description: series.seoDescription,
  image: series.image || defaultImage,
  productName: series.title,
  category: series.category,
  })),
  {
    path: '/products/adhesive-pet-pads',
    title: 'Legacy Adhesive Pet Pads Route | JCZCARE',
    description: 'Existing adhesive pet pad route retained for compatibility while the new six-series product center template is previewed.',
    image: defaultImage,
  },
  {
    path: '/products/charcoal-pet-pads',
    title: 'Legacy Charcoal Pet Pads Route | JCZCARE',
    description: 'Existing charcoal pet pad route retained for compatibility while the new six-series product center template is previewed.',
    image: defaultImage,
  },
  {
    path: '/products/custom-pet-waste-bags',
    title: 'Legacy Custom Pet Waste Bags Route | JCZCARE',
    description: 'Existing custom pet waste bags route retained for compatibility while the new six-series product center template is previewed.',
    image: defaultImage,
  },
  {
    path: '/products/disposable-pet-pads',
    title: 'Legacy Disposable Pet Pads Route | JCZCARE',
    description: 'Existing disposable pet pads route retained for compatibility while the new six-series product center template is previewed.',
    image: defaultImage,
  },
  {
    path: '/products/pet-care-pad-glove-wipes',
    title: 'Legacy Pet Care Pad and Glove Wipes Route | JCZCARE',
    description: 'Existing pet care pad and glove wipes route retained for compatibility while the new six-series product center template is previewed.',
    image: defaultImage,
  },
];

export const pageSeo = [
  baseSeo,
  {
    path: '/products',
    title: 'Disposable Hygiene & Cleaning Products Manufacturer | JCZCARE',
    description:
      'Explore six disposable hygiene, absorbent material, and cleaning product categories for wholesale, private label, and OEM/ODM manufacturing projects.',
    keywords: 'disposable hygiene products manufacturer, OEM hygiene products supplier, private label disposable products',
    image: '/images/products/pet-training-pads/pet-training-pad-main.jpg',
  },
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
    image: '/images/oem/production/factory-production-line-real-20260729.jpg',
  },
  {
    path: '/innovation',
    title: 'Pet Pad Product Innovation | JCZCARE OEM/ODM',
    description:
      'Product innovation for pet pad OEM/ODM projects, including absorbent structure planning, performance customization, and brand-ready development.',
    image: '/images/generated-site/products/products-pet-pad-structure-01.webp',
  },
  {
    path: '/quality',
    title: 'Pet Pad Quality Inspection | JCZCARE',
    description:
      'Batch-level quality inspection for pet pads, absorbent sheets, materials, production checks, performance review, and shipment readiness.',
    image: '/images/generated-site/quality-control/factory-quality-control-01.webp',
  },
  {
    path: '/advantages',
    title: 'Factory Advantages | JCZCARE OEM Pet Pads',
    description:
      'Source factory advantages for OEM/ODM pet pad buyers, including production coordination, sample support, quality system, and export supply planning.',
    image: '/images/oem/factory/factory-campus-real-aerial-20260729.png',
  },
  {
    path: '/customization',
    title: 'Product Customization | Private Label Pet Pads | JCZCARE',
    description:
      'Customize pet pads, absorbent cores, charcoal pads, adhesive pads, care products, and retail-ready packs with JCZCARE factory-side OEM/ODM support.',
    image: '/images/generated-site/products/products-disposable-pads-01.webp',
  },
  {
    path: '/news',
    title: 'JCZCARE News & Factory Ideas',
    description:
      'Factory ideas, product planning notes, and B2B pet care absorbent product updates from Nantong JINCHENG ZENCARE.',
    image: '/images/generated-site/contact/contact-business-office-01.webp',
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
    image: '/images/generated-site/contact/contact-business-office-01.webp',
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
    image: '/images/generated-site/products/products-disposable-pads-01.webp',
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
    image: '/images/generated-site/packaging/private-label-packaging-01.webp',
  },
  {
    path: '/private-label',
    title: 'Private Label Pet Pads OEM Program | JCZCARE',
    description:
      'Private label pet pads for brands, retailers, distributors, and wholesalers needing custom size, absorbency, packaging, printing, materials, and OEM manufacturing support.',
    image: '/images/generated-site/b2b-optimization/private-label-packaging-review.webp',
  },
  {
    path: '/download',
    title: 'OEM Pet Pad Download Center | JCZCARE',
    description:
      'Request JCZCARE product catalog, factory profile, OEM capability overview, and packaging options for pet pad private-label and OEM sourcing projects.',
    image: '/images/generated-site/b2b-optimization/download-center-catalog.webp',
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
    image: '/images/oem/production/factory-production-line-real-20260729.jpg',
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
    image: '/images/generated-site/b2b-optimization/quality-control-lab.webp',
  },
  {
    path: '/oem-process',
    title: 'OEM Pet Pad Process | From Brief to Production',
    description:
      'OEM pet pad process for B2B buyers: project brief, specification planning, sample development, testing, packaging confirmation, production, inspection, and shipment.',
    image: '/images/generated-site/b2b-optimization/oem-sample-review.webp',
  },
  {
    path: '/oem-capability',
    title: 'Pet Hygiene OEM Manufacturing Capability | JCZCARE',
    description:
      'Evaluate JCZCARE pet hygiene OEM manufacturing capability, production workflow, customization, quality control, and global supply support for European and American buyers.',
    image: '/images/oem/factory/factory-campus-real-aerial-20260729.png',
  },
  {
    path: '/case-study',
    title: 'OEM Pet Hygiene Case Studies | Global B2B Projects | JCZCARE',
    description:
      'Review five anonymous OEM pet hygiene project examples covering private-label pet pads, adult underpads, charcoal pads, adhesive pads, and coordinated category supply.',
    image: '/images/oem/production/factory-production-line-03.webp',
  },
  {
    path: '/certifications',
    title: 'Pet Pad Factory Certifications & Compliance Support | JCZCARE',
    description:
      'Certification and compliance support for pet pad OEM buyers, including factory documentation, material information, packaging coordination, and B2B export requirements.',
    image: '/images/generated-site/factory/factory-production-line-02.webp',
  },
  {
    path: '/faq',
    title: 'OEM Pet Pad FAQ | Private Label, MOQ, Samples & Quality',
    description:
      'Frequently asked questions for OEM pet pad buyers covering customization, private label, samples, MOQ planning, quality control, packaging, delivery, and factory cooperation.',
    image: '/images/generated-site/products/products-disposable-pads-02.webp',
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
    image: '/images/generated-site/contact/contact-business-office-01.webp',
  },
  {
    path: '/pages/news',
    title: 'News & Ideas | Pet Pad OEM Factory Insights | JCZCARE',
    description:
      'Factory ideas and B2B insights about OEM pet pads, private-label packaging, absorbent core development, quality control, and export supply.',
    image: '/images/generated-site/contact/contact-business-office-01.webp',
  },
  {
    path: '/request-product-plan',
    title: 'OEM Product Plan Request | JCZCARE Pet Pad Factory',
    description:
      'Submit your OEM/ODM pet pad project details to Nantong JINCHENG ZENCARE for specification planning, samples, packaging direction, and B2B factory support.',
    image: '/images/generated-site/products/products-pet-pad-structure-01.webp',
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
    image: '/images/generated-site/contact/contact-business-office-01.webp',
  },
  {
    path: '/pages/help',
    title: 'Help Center | OEM Pet Pad Orders, Samples & Packaging',
    description:
      'Find answers about OEM pet pad orders, sample development, packaging support, quality control, production scheduling, and factory communication.',
    image: '/images/generated-site/quality-control/factory-quality-control-01.webp',
  },
  {
    path: '/pages/learn',
    title: 'Learn Center | Pet Pad OEM Knowledge & Product Planning',
    description:
      'Learn about pet pad absorbency, private-label packaging, product structure, factory supply, quality control, and OEM/ODM development decisions.',
    image: '/images/generated-site/products/products-pet-pad-structure-01.webp',
  },
  {
    path: '/pages/give-back',
    title: 'Responsible Pet Care Manufacturing | JCZCARE',
    description:
      'Explore JCZCARE responsible manufacturing principles for practical absorbent pet care products, quality planning, and long-term B2B cooperation.',
    image: '/images/generated-site/contact/contact-business-office-01.webp',
  },
  {
    path: '/pages/gift-cards',
    title: 'OEM Sample Kits | Pet Pad Material & Packaging Review',
    description:
      'Request OEM sample kits for pet pads, absorbent sheets, packaging swatches, material review, and buyer-ready private-label product planning.',
    image: '/images/generated-site/products/products-disposable-pads-01.webp',
  },
];

export const newsSeo = [
  {
    path: '/pages/news/private-label-pet-pad-ideas',
    title: 'Private-label pet pad ideas for sharper product lines | JCZCARE News',
    description:
      'Practical private-label pet pad ideas for brands planning differentiated sizes, packaging, absorbency, and channel-ready product lines.',
    image: '/images/generated-site/products/products-disposable-pads-01.webp',
  },
  {
    path: '/pages/news/absorbent-core-development-notes',
    title: 'Absorbent Core Development Notes | JCZCARE News',
    description:
      'Factory notes on absorbent core structure, SAP balance, material selection, and product planning for OEM pet pad development.',
    image: '/images/generated-site/products/products-pet-pad-structure-01.webp',
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
  breadcrumbs: [
    ['Home', '/'],
    ['Blog', '/blog'],
    [article.clusterTitle, article.clusterPath],
    [article.title, article.path],
  ],
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

const authoritySeoEntries = getAuthoritySeoEntries();
const authorityPaths = new Set(authoritySeoEntries.map((entry) => entry.path));

export const allSeoEntries = [
  ...authoritySeoEntries,
  ...pageSeo.filter((entry) => !authorityPaths.has(entry.path)),
  ...productSeo,
  ...newsSeo,
  ...blogSeo,
  ...regions,
];

export const getSeoEntry = (path = '/') => allSeoEntries.find((entry) => entry.path === path) || {
  ...baseSeo,
  path,
  title: `${path.split('/').filter(Boolean).join(' ').replace(/\b\w/g, (char) => char.toUpperCase()) || 'JCZCARE'} | Nantong JINCHENG ZENCARE`,
};

