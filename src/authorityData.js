import { blogArticles, getBlogArticlesByCluster } from './blogData.js';
import { topicClusters, topicClusterMap } from './topicClusters.js';
import { factoryNavigationCards, factoryPages } from './factoryData.js';

const siteUrl = 'https://www.jczcare.com';
const updatedAt = '2026-07-17';

const officialReferences = [
  {
    label: 'FEDIAF European Pet Population and Market Data',
    url: 'https://europeanpetfood.org/about/statistics/',
    note: 'FEDIAF reports that 140 million European households, or 49%, own one or more of Europe’s 306 million pets in its 2024 market data.',
  },
  {
    label: 'ISO 9001 Quality Management Systems',
    url: 'https://www.iso.org/standard/62085.html',
    note: 'ISO describes ISO 9001 as a globally recognized quality-management standard used to establish, maintain, and continually improve a QMS.',
  },
  {
    label: 'GS1 Barcode Standards',
    url: 'https://www.gs1.org/standards/barcodes',
    note: 'GS1 explains how barcodes identify and track products, shipments, and logistics data across retail and supply chains.',
  },
  {
    label: 'ICC Incoterms 2020 Checklist',
    url: 'https://library.iccwbo.org/content/clp/Others/incoterms_2020_checklist_2024-update.pdf',
    note: 'The ICC checklist helps buyers distinguish delivery, cost, insurance, clearance, and risk responsibilities under current Incoterms rules.',
  },
  {
    label: 'US EPA Plastic Recycling and Composting FAQ',
    url: 'https://www.epa.gov/trash-free-waters/frequently-asked-questions-about-plastic-recycling-and-composting',
    note: 'The EPA distinguishes biodegradable, compostable, and biobased plastics and cautions against environmental claims that are not properly qualified.',
  },
];

const pillarBlueprints = [
  ['Commercial scope and buyer intent', 'define the commercial role of the category before discussing individual materials or price', 'document target channel, user scenario, price band, and annual demand range'],
  ['Market context and demand signals', 'separate durable market signals from short-lived product trends', 'combine external market sources with distributor feedback, sell-through data, and retailer requirements'],
  ['Product architecture', 'translate use cases into a complete product structure rather than a list of isolated features', 'lock dimensions, weight, performance, pack count, and acceptance limits in one specification'],
  ['Materials and measurable specifications', 'connect each material decision to a measurable buyer outcome', 'compare material options on performance, consistency, cost, and supply continuity'],
  ['Manufacturing workflow', 'understand how approved requirements move through material preparation, production, packing, and release', 'identify line setup, in-process checks, changeovers, and evidence needed for first production'],
  ['OEM, ODM, and private-label models', 'choose a development model that fits speed, differentiation, investment, and internal capability', 'assign decision ownership for product structure, packaging, claims, and final approval'],
  ['MOQ, sampling, and development gates', 'treat MOQ and sampling as planning constraints rather than isolated negotiation points', 'define sample purpose, approval criteria, pilot quantity, and scale-up decision gates'],
  ['Packaging and retail readiness', 'develop packaging with the product so dimensions, claims, barcodes, and carton plans remain aligned', 'approve dielines, artwork, barcode placement, pack count, carton strength, and shipping marks'],
  ['Quality control and acceptance criteria', 'convert general quality expectations into testable requirements and evidence', 'agree methods, sample size, tolerances, defect classes, corrective action, and release authority'],
  ['Supplier qualification and factory audit', 'verify capability from records and observed processes instead of relying on promotional claims', 'review production fit, material control, maintenance, warehouse practice, traceability, and export support'],
  ['Compliance and responsible claims', 'separate product performance, factory-system, environmental, and destination-market requirements', 'validate each claim with current evidence and confirm responsibility for market-specific review'],
  ['Cost structure and total landed value', 'compare quotations on a normalized specification and total commercial outcome', 'model product, packaging, inspection, freight, duties, inventory, and quality-risk costs'],
  ['Shipping and inventory planning', 'protect product condition and cash flow through practical carton, loading, lead-time, and reorder decisions', 'confirm Incoterms, carton data, container use, documents, safety stock, and arrival inspection'],
  ['Risk management and change control', 'identify where assumptions, substitutions, artwork changes, or forecast changes can destabilize an order', 'use version control, written approvals, escalation paths, and retained evidence'],
  ['Launch, measurement, and repeat orders', 'treat the first order as a controlled launch that creates evidence for the next order', 'review arrival condition, sell-through, complaints, returns, packaging, forecast accuracy, and improvement actions'],
  ['Executive procurement checklist', 'compress the complete decision into a review that commercial, quality, logistics, and finance teams can use', 'approve the product only when specification, evidence, cost, timeline, and responsibilities are aligned'],
];

const buildPillarParagraphs = (cluster, [heading, lens, buyerAction], index) => {
  const articleCount = getBlogArticlesByCluster(cluster.slug).length;
  const order = index + 1;
  return [
    `${cluster.title} sourcing should begin with a commercial decision, not a catalogue image. In this part of the guide, the objective is to ${lens}. For ${cluster.channels}, that means defining who will buy the product, where it will be sold, which performance problems must be prevented, and how the offer will be replenished. A disciplined brief gives the factory a stable basis for recommendations and helps the buyer avoid paying for features that do not support the intended channel.`,
    `The category depends on ${cluster.materials}. These inputs should never be evaluated as a generic “premium” or “economy” package. Each material has a function, a tolerance, a supply implication, and a relationship with the converting process. Buyers should ask how the proposed structure supports ${cluster.focus}. The answer should connect material choice to measurable requirements, production capability, packaging, and the evidence that will be available before shipment.`,
    `Commercial risk usually appears when teams work from different assumptions. The most important risks in this category include ${cluster.risks}. A buyer can reduce them by asking for ${cluster.evidence}. Evidence does not have to be complicated, but it should be traceable to the approved project. Screenshots from a chat, an unrelated sample, or a general factory brochure cannot replace a controlled specification and an agreed release process.`,
    `The practical buyer action for stage ${order} is to ${buyerAction}. Purchasing, product, quality, packaging, logistics, and sales teams should review the same information. When an issue changes cost or timing, the decision and its commercial effect should be recorded. This creates a usable audit trail for repeat orders and prevents a later disagreement about what the supplier was expected to produce. The ${articleCount} connected buyer article${articleCount === 1 ? '' : 's'} on this page provide the next level of detail for category-specific decisions.`,
  ];
};

const buildComparisonRows = (cluster) => [
  ['Decision area', 'Lower-complexity route', 'Higher-control route', 'Buyer implication'],
  ['Product structure', 'Existing factory platform', 'Buyer-defined specification', `Choose according to differentiation needs in ${cluster.title.toLowerCase()}.`],
  ['Packaging', 'Neutral or standard format', 'Printed private-label system', 'Custom printing can change MOQ, timing, and artwork responsibility.'],
  ['Quality evidence', 'Standard production checks', 'Buyer-specific inspection plan', `The evidence should address ${cluster.evidence}.`],
  ['Commercial planning', 'Trial or limited SKU launch', 'Multi-SKU annual program', 'Forecasting and change control become more important as the program scales.'],
  ['Risk profile', 'Faster development, less differentiation', 'More decisions, stronger control', `Monitor ${cluster.risks}.`],
];

const faqQuestionTemplates = [
  ['What should buyers define before requesting a quote?', 'Start with target market, channel, product use case, measurable specification, packaging, estimated quantity, destination, and required timing.'],
  ['How should buyers compare suppliers?', 'Compare the same specification and evaluate evidence for materials, production, quality, packing, communication, and repeat-order control.'],
  ['What affects MOQ?', 'MOQ can be affected by material purchasing, line setup, printed packaging, carton customization, and the number of SKUs.'],
  ['What should a useful sample prove?', 'A useful sample should represent the intended production direction and allow the buyer to evaluate dimensions, feel, performance, folding, and packaging fit.'],
  ['How should quality requirements be written?', 'Use measurable methods, tolerances, acceptance limits, sample plans, defect definitions, and clear release responsibility.'],
  ['Can packaging be developed at the same time?', 'Yes, but artwork should not be finalized until product dimensions, folding, pack count, claims, and bag or box format are stable.'],
  ['How can buyers reduce development delays?', 'Provide one controlled brief, appoint decision owners, limit late changes, approve evidence promptly, and keep technical and artwork versions aligned.'],
  ['What should be checked before shipment?', 'Review finished-product performance, dimensions, count, packaging, carton marks, documents, loading evidence, and any agreed inspection results.'],
  ['How should buyers handle environmental claims?', 'Use specific, qualified claims supported by relevant material and test evidence, and review them for the destination market before printing.'],
  ['What belongs in a factory audit?', 'Review process fit, equipment, material control, maintenance, warehouse practice, traceability, quality records, corrective action, and export workflow.'],
  ['How should total cost be compared?', 'Normalize the product specification, then include packaging, inspection, freight, duties, inventory, defect risk, and reorder efficiency.'],
  ['What information should be retained for repeat orders?', 'Keep the approved sample, specification, artwork, barcode, carton data, test method, inspection record, issue log, and final shipment evidence.'],
  ['When should a buyer use a pilot order?', 'Use a pilot order when market demand, production repeatability, packaging, or logistics need confirmation before a wider rollout.'],
  ['How are lead times made more reliable?', 'Separate development, packaging, material, production, inspection, and shipping stages, then confirm dependencies and approval deadlines.'],
  ['What is the buyer responsible for?', 'The buyer should provide accurate market, brand, claim, barcode, destination, forecast, approval, and logistics information.'],
  ['What is the best next step with JCZCARE?', 'Share the target market, product specification, benchmark sample, packaging idea, estimated quantity, and delivery destination for a project review.'],
];

const buildClusterFaqs = (cluster) => faqQuestionTemplates.map(([question, answer], index) => [
  question.replace('buyers', `${cluster.shortTitle} buyers`).replace('a buyer', `a ${cluster.shortTitle.toLowerCase()} buyer`),
  `${answer} For ${cluster.title.toLowerCase()}, the review should specifically support ${cluster.focus}.`,
  index,
]);

const buildPillarPage = (cluster) => {
  const articles = getBlogArticlesByCluster(cluster.slug);
  const sections = pillarBlueprints.slice(0, 15).map((blueprint, index) => ({
    heading: blueprint[0],
    paragraphs: buildPillarParagraphs(cluster, blueprint, index),
    comparisonRows: index === 2 || index === 11 ? buildComparisonRows(cluster) : undefined,
  }));
  const faqs = buildClusterFaqs(cluster).map(([question, answer]) => [question, answer]);

  return {
    kind: 'pillar',
    path: cluster.path,
    slug: cluster.slug,
    title: `${cluster.title} Resource Center`,
    seoTitle: `${cluster.title} B2B Buyer Guide | JCZCARE`,
    metaDescription: `B2B ${cluster.title.toLowerCase()} guide covering specifications, materials, quality control, MOQ, suppliers, cost, packaging, and OEM sourcing risks.`,
    kicker: `${cluster.title} Pillar Guide`,
    h1: `${cluster.title}: the complete B2B buyer framework`,
    intro: cluster.summary,
    image: cluster.image,
    imageAlt: `${cluster.title} OEM sourcing and manufacturing resource`,
    updatedAt,
    sections,
    faqs,
    articles,
    products: cluster.products,
    references: officialReferences,
    chart: [
      ['Specification clarity', 96],
      ['Quality evidence', 92],
      ['Commercial planning', 88],
      ['Change control', 84],
    ],
    breadcrumbs: [
      ['Home', '/'],
      ['Blog', '/blog'],
      [cluster.title, cluster.path],
    ],
  };
};

export const pillarPages = topicClusters.map(buildPillarPage);

const comparisonSpecs = [
  ['oem-vs-odm', 'OEM vs ODM Pet Products', 'OEM and ODM differ in who controls product design, development speed, differentiation, and project responsibility.', 'OEM program', 'ODM platform', 'oem-manufacturing'],
  ['sap-vs-fluff-pulp', 'SAP vs Fluff Pulp in Absorbent Products', 'SAP and fluff pulp perform different jobs in absorbency, diffusion, structure, thickness, and cost.', 'Higher SAP emphasis', 'Higher fluff-pulp emphasis', 'sap-technology'],
  ['china-vs-vietnam-manufacturers', 'China vs Vietnam Pet Product Manufacturers', 'A sourcing comparison should use product fit, supply depth, communication, logistics, evidence, and total value instead of country stereotypes.', 'China sourcing model', 'Vietnam sourcing model', 'import-guide'],
  ['virgin-vs-recycled-pulp', 'Virgin Pulp vs Recycled Pulp', 'Pulp sourcing decisions should consider cleanliness, consistency, performance, price, supply, and claim substantiation.', 'Virgin pulp', 'Recycled pulp', 'materials'],
  ['hdpe-vs-biodegradable-bags', 'HDPE vs Compostable Dog Waste Bags', 'Material choice affects film behavior, evidence requirements, environmental claims, cost, and disposal communication.', 'HDPE film', 'Certified compostable route', 'dog-poop-bags'],
  ['adult-underpads-vs-pet-pads', 'Adult Underpads vs Pet Training Pads', 'Both are absorbent products, but user context, dimensions, surface expectations, packaging, and claim review differ.', 'Adult underpads', 'Pet training pads', 'adult-underpads'],
  ['private-label-vs-wholesale', 'Private Label vs Wholesale Pet Products', 'Private label offers brand control while wholesale can reduce development work; the right route depends on channel strategy and capability.', 'Private label', 'Wholesale', 'private-label'],
];

const buildComparisonPage = ([slug, title, intro, left, right, clusterSlug]) => {
  const cluster = topicClusterMap.get(clusterSlug);
  const rows = [
    ['Decision factor', left, right, 'Buyer question'],
    ['Development control', 'More buyer-defined decisions', 'More supplier-defined parameters', 'How much differentiation is commercially necessary?'],
    ['Speed to market', 'More approval stages', 'Can use an established route', 'Which launch deadline is realistic?'],
    ['MOQ and setup', 'May require custom inputs', 'May use shared materials', 'What drives the quoted MOQ?'],
    ['Evidence', 'Buyer-specific acceptance plan', 'Standard supplier evidence', 'Which tests and records are required?'],
    ['Long-term fit', 'Stronger ownership and repeatability', 'Efficient for simpler programs', 'How will the range scale across SKUs and markets?'],
  ];
  return {
    kind: 'comparison',
    path: `/comparisons/${slug}`,
    slug,
    title,
    seoTitle: `${title} | B2B Sourcing Comparison`,
    metaDescription: `B2B comparison of ${left} and ${right}, covering specification, cost, MOQ, quality evidence, lead time, risk, and sourcing decisions.`,
    kicker: 'B2B Comparison',
    h1: title,
    intro,
    image: cluster.image,
    imageAlt: `${title} sourcing comparison`,
    updatedAt,
    sections: [
      { heading: 'Executive decision', paragraphs: [`${intro} The correct choice depends on the specification, target channel, evidence available, and the buyer’s ability to manage development.`, `Professional buyers should compare like with like. A lower quotation is not meaningful if product structure, packaging, inspection, logistics, or commercial responsibility differs.`], comparisonRows: rows },
      { heading: 'Specification and performance', paragraphs: [`Define measurable requirements before comparing ${left.toLowerCase()} with ${right.toLowerCase()}. Keep dimensions, material structure, performance, packaging, quantity, and destination assumptions consistent.`, `Use samples to confirm the most important differences, but connect every sample to a written specification so the mass-production reference remains clear.`] },
      { heading: 'Cost, MOQ, and lead time', paragraphs: ['Compare total landed value rather than unit price. Include setup, custom materials, packaging, inspection, freight, duties, inventory, and quality risk.', 'A realistic timeline separates development, sample approval, packaging, production, inspection, and shipping. Late buyer approvals should be visible in the plan.'] },
      { heading: 'Buyer recommendation', paragraphs: [`Choose ${left.toLowerCase()} when its control and differentiation justify the additional work. Choose ${right.toLowerCase()} when speed, simplicity, or established supply is more valuable.`, `Use the ${cluster.title} pillar guide and linked articles to validate the final route before placing a pilot or production order.`] },
    ],
    faqs: [
      [`Is ${left} always better than ${right}?`, 'No. The stronger choice is the one that fits the buyer’s channel, specification, evidence, timeline, and commercial model.'],
      ['How should samples be compared?', 'Use the same methods, conditions, dimensions, and documented acceptance criteria for both options.'],
      ['Should price decide the comparison?', 'Price is one input. Performance, consistency, packaging, lead time, quality evidence, and reorder risk also affect total value.'],
      ['Can JCZCARE support a comparison sample?', 'Share your benchmark and target specification so the team can review suitable development and sampling options.'],
    ],
    products: cluster.products,
    relatedLinks: [cluster.path, '/resources', '/contact'],
    breadcrumbs: [['Home', '/'], ['Comparisons', '/comparisons'], [title, `/comparisons/${slug}`]],
  };
};

export const comparisonPages = comparisonSpecs.map(buildComparisonPage);

const caseStudySpecs = [
  ['european-private-label-launch', 'Private-Label Launch Framework for a European Pet Brand', 'A representative project framework for moving from target-market brief to sample, packaging, pilot order, and repeat-order review.', 'private-label'],
  ['landed-cost-reduction-framework', 'A Structured Approach to Reducing Pet Product Landed Cost', 'An illustrative sourcing scenario showing how specification normalization, carton planning, and risk review can improve cost decisions without inventing a savings claim.', 'import-guide'],
  ['container-optimization', 'Container Optimization for Absorbent Pet Products', 'A planning scenario for balancing pack count, carton dimensions, compression risk, loading efficiency, and arrival condition.', 'shipping'],
  ['oem-manufacturing-process', 'From Product Brief to OEM Production Release', 'A representative gated workflow for specification, sample approval, artwork, pilot production, inspection, and shipment.', 'oem-manufacturing'],
  ['quality-improvement', 'Quality Improvement Through Measurable Acceptance Criteria', 'A scenario explaining how a buyer can replace subjective quality discussions with test methods, limits, retained samples, and corrective action.', 'quality-control'],
  ['factory-audit-success', 'Turning a Factory Audit into an Actionable Sourcing Decision', 'An audit scenario that converts observations about process, materials, maintenance, warehouse, and export control into clear approval conditions.', 'factory-audit'],
];

export const caseStudyPages = caseStudySpecs.map(([slug, title, intro, clusterSlug]) => {
  const cluster = topicClusterMap.get(clusterSlug);
  return {
    kind: 'case-study',
    path: `/case-studies/${slug}`,
    slug,
    title,
    seoTitle: `${cluster.title} Sourcing Case Scenario | JCZCARE`,
    metaDescription: `Representative ${cluster.title.toLowerCase()} case scenario covering buyer decisions, evidence, quality, risks, and next steps for OEM sourcing.`,
    kicker: 'Representative Buyer Scenario',
    h1: title,
    intro: `${intro} This is an educational, representative scenario rather than a claim about a named customer or guaranteed result.`,
    image: cluster.image,
    imageAlt: `${title} representative B2B sourcing scenario`,
    updatedAt,
    sections: [
      { heading: 'Situation', paragraphs: [`The buyer needs to ${cluster.focus}. The commercial team has a target channel but needs a manufacturing brief that quality, packaging, and logistics teams can use.`, `The initial risk is ${cluster.risks}. The project therefore starts with a controlled fact-finding stage rather than an immediate production quotation.`] },
      { heading: 'Decision framework', paragraphs: [`The buyer prepares a channel brief, product benchmark, estimated volume, packaging direction, and destination assumptions. JCZCARE reviews ${cluster.materials}.`, `The team records open questions, assigns owners, and separates must-have requirements from options that can be tested in a later development round.`] },
      { heading: 'Evidence and control points', paragraphs: [`The project uses ${cluster.evidence}. Each approval is connected to a version, date, owner, and next action.`, 'A pilot or first order is released only after product, packaging, quality, and shipping assumptions are aligned. Issues are documented so the repeat order can be improved.'] },
      { heading: 'Transferable buyer lesson', paragraphs: ['The main lesson is that better sourcing outcomes come from better decision structure, not from a dramatic claim or an unverified percentage. Buyers can apply the same gates to other suppliers and product categories.', `Review the ${cluster.title} pillar page for the detailed checklists and related articles behind this scenario.`] },
    ],
    faqs: [
      ['Is this a named customer case study?', 'No. It is a transparent representative scenario designed to explain a repeatable B2B sourcing method without inventing customer claims.'],
      ['Can the process be adapted to a live project?', 'Yes. The gates can be adjusted according to product, market, packaging, quantity, and quality requirements.'],
      ['What should a buyer share first?', 'Share the target channel, product benchmark, specification, quantity, destination, and packaging direction.'],
    ],
    products: cluster.products,
    relatedLinks: [cluster.path, '/resources', '/contact'],
    breadcrumbs: [['Home', '/'], ['Case Studies', '/case-studies'], [title, `/case-studies/${slug}`]],
  };
});

const hubPageSpecs = [
  {
    path: '/resources',
    kind: 'resource-hub',
    title: 'Buyer Resource Center',
    seoTitle: 'Pet Product OEM Buyer Resources | JCZCARE',
    description: 'Buying guides, OEM planning, factory-audit, MOQ, lead-time, packaging, shipping, certificate, quality-inspection, and supplier-checklist resources.',
    kicker: 'Buyer Resource Center',
    h1: 'Practical sourcing resources for pet product buyers',
    intro: 'Use these structured guides to prepare supplier briefs, compare quotations, evaluate factories, control quality, and plan imports.',
    image: '/images/factory-campus.jpeg',
    cards: [
      ['Import Guides', '/blog/category/import-guide'], ['OEM Guides', '/blog/category/oem-manufacturing'],
      ['Factory Audit', '/blog/category/factory-audit'], ['MOQ Guide', '/blog/oem-pet-pad-moq-sampling-lead-time'],
      ['Lead Time Guide', '/blog/category/shipping'], ['Packaging Guide', '/blog/category/packaging'],
      ['Shipping Guide', '/blog/category/shipping'], ['Certificates', '/certifications'],
      ['Quality Inspection', '/blog/category/quality-control'], ['Supplier Checklist', '/blog/choose-reliable-pet-pad-manufacturer'],
    ],
  },
  {
    path: '/factory',
    kind: 'factory-hub',
    title: 'Factory Resource Center',
    seoTitle: 'Pet Pad Factory Resources | JCZCARE',
    description: 'Explore JCZCARE factory resources covering production lines, warehouse control, materials, SAP, PE film, container loading, QC, certificates, and testing.',
    kicker: 'Factory Resource Center',
    h1: 'See how an OEM program moves through the factory',
    intro: 'A buyer-focused view of production, materials, quality evidence, warehouse control, and export preparation.',
    image: '/images/factory-campus.jpeg',
    video: '/videos/factory-profile-4-compressed.mp4',
    cards: factoryNavigationCards,
  },
  {
    path: '/academy',
    kind: 'academy',
    title: 'JCZCARE Learning Center',
    seoTitle: 'Pet Product OEM Learning Center | JCZCARE',
    description: 'Learn OEM manufacturing, absorbent materials, pet product technology, supplier evaluation, quality control, and B2B sourcing fundamentals.',
    kicker: 'Learning Center',
    h1: 'Build stronger OEM knowledge before you source',
    intro: 'Start with beginner guides, then move into materials, technology, manufacturing, quality, and commercial decisions.',
    image: '/images/pet-pad-layer-protection-premium.png',
    cards: [
      ['Import Guides', '/blog/category/import-guide'], ['OEM Knowledge', '/blog/category/oem-manufacturing'],
      ['Industry Knowledge', '/blog/category/industry-insights'], ['Materials', '/blog/category/materials'],
      ['Technology', '/blog/category/pet-training-pads'], ['Frequently Asked Questions', '/faq'],
    ],
  },
  {
    path: '/comparisons',
    kind: 'comparisons',
    title: 'B2B Product and Sourcing Comparisons',
    seoTitle: 'Pet Product OEM Comparisons | JCZCARE',
    description: 'Compare OEM vs ODM, materials, manufacturing countries, absorbent products, private label, wholesale, and dog waste bag options.',
    kicker: 'Decision Comparisons',
    h1: 'Compare sourcing options on evidence, not labels',
    intro: 'Use controlled comparison frameworks to evaluate cost, performance, MOQ, lead time, quality evidence, and risk.',
    image: '/images/pet-pad-layer-protection-premium.png',
    cards: comparisonPages.map((page) => [page.title, page.path]),
  },
  {
    path: '/case-studies',
    kind: 'case-studies',
    title: 'B2B Sourcing Case Scenarios',
    seoTitle: 'Pet Product OEM Case Scenarios | JCZCARE',
    description: 'Representative pet product sourcing scenarios covering private label launches, landed cost, container planning, OEM production, quality, and factory audits.',
    kicker: 'Case Scenarios',
    h1: 'Apply repeatable sourcing methods to real buyer decisions',
    intro: 'These transparent educational scenarios do not invent customer claims. They show how buyers can structure decisions, evidence, and next actions.',
    image: '/images/production-line-clean.png',
    cards: caseStudyPages.map((page) => [page.title, page.path]),
  },
  {
    path: '/media',
    kind: 'media',
    title: 'Factory Media Library',
    seoTitle: 'Factory Photos, Product Media & Videos | JCZCARE',
    description: 'Browse JCZCARE factory photos, production lines, product structures, packaging, container loading, testing, materials, certificates, and videos.',
    kicker: 'Media Library',
    h1: 'Factory and product evidence in one media library',
    intro: 'Explore existing JCZCARE production, product, quality, warehouse, packaging, and factory visual assets.',
    image: '/images/factory-campus.jpeg',
    gallery: [
      ['/images/factory-campus.jpeg', 'Factory campus and production building'],
      ['/images/production-line-clean.png', 'Automated absorbent product production line'],
      ['/images/warehouse-storage-clean.png', 'Finished-product warehouse and storage'],
      ['/images/quality-inspection-lab-mask.png', 'Quality inspection in laboratory setting'],
      ['/images/pet-pad-layer-protection-premium.png', 'Absorbent pet pad layer structure'],
      ['/images/factory-campus.jpeg', 'Factory logistics and shipment preparation'],
    ],
  },
  {
    path: '/downloads',
    kind: 'downloads',
    title: 'OEM Buyer Downloads',
    seoTitle: 'OEM Catalogs and Buyer Downloads | JCZCARE',
    description: 'Request JCZCARE OEM catalogs, product specifications, size charts, packaging guides, MOQ guides, certificate packs, and factory profiles.',
    kicker: 'Downloads',
    h1: 'Request the documents your sourcing team needs',
    intro: 'Select a resource and submit your business details. Our team will confirm the current document for your product and market.',
    image: '/images/custom-care-pad-packaging-ai.png',
    includeInquiryForm: true,
    cards: [
      ['OEM Catalog', '/request-product-plan?product=oem-catalog'], ['Product Catalog', '/request-product-plan?product=product-catalog'],
      ['Size Charts', '/request-product-plan?product=size-charts'], ['Packaging Guide', '/request-product-plan?product=packaging-guide'],
      ['Specification Sheets', '/request-product-plan?product=specification-sheets'], ['Certificates', '/request-product-plan?product=certificate-pack'],
      ['MOQ Guide', '/request-product-plan?product=moq-guide'], ['Factory Profile', '/request-product-plan?product=factory-profile'],
    ],
  },
  {
    path: '/authors/jczcare-editorial-team',
    kind: 'author',
    title: 'JCZCARE Editorial Team',
    seoTitle: 'JCZCARE Editorial Team | Manufacturing Expertise',
    description: 'Meet the JCZCARE editorial team sharing practical knowledge from product development, manufacturing, quality, packaging, sourcing, and export workflows.',
    kicker: 'Author & Expertise',
    h1: 'Manufacturing knowledge written for professional buyers',
    intro: 'JCZCARE content is prepared from practical product, quality, packaging, sourcing, and factory workflow knowledge, then reviewed for clear B2B use.',
    image: '/images/quality-inspection-lab-mask.png',
    cards: topicClusters.map((cluster) => [cluster.title, cluster.path]),
  },
];

const buildHubSections = (spec) => [
  {
    heading: 'How to use this center',
    paragraphs: [
      `${spec.intro} Start with the page that matches your current decision, then follow the linked category and article resources for deeper technical or commercial detail.`,
      'Each resource connects back to products, factory information, customization support, and the contact route so research can move into a controlled project brief.',
    ],
  },
  {
    heading: 'Built for professional buyers',
    paragraphs: [
      'The content is written for brands, importers, distributors, wholesalers, retail teams, and sourcing professionals. It avoids consumer-level filler and focuses on specifications, evidence, MOQ, samples, packaging, quality, cost, and supply risk.',
      'Where a claim depends on product, market, or certification status, buyers should confirm the current evidence for the exact SKU and destination before making a commercial decision.',
    ],
  },
];

export const hubPages = hubPageSpecs.map((spec) => ({
  ...spec,
  metaDescription: spec.description,
  imageAlt: `${spec.title} for OEM and private-label buyers`,
  updatedAt,
  sections: buildHubSections(spec),
  faqs: [
    ['Who is this resource for?', 'It is for professional pet product brands, importers, distributors, wholesalers, retailers, and sourcing teams.'],
    ['Can I use these resources to prepare an inquiry?', 'Yes. Use the linked checklists and guides, then submit your product, specification, quantity, market, and packaging direction.'],
    ['Does a guide replace market-specific review?', 'No. Product, claim, labeling, compliance, and documentation requirements should be confirmed for the exact market and SKU.'],
  ],
  products: ['/products/disposable-pet-pads', '/products/adult-underpads'],
  breadcrumbs: [['Home', '/'], [spec.title, spec.path]],
}));

export const faqGroups = topicClusters.map((cluster) => ({
  slug: cluster.slug,
  title: cluster.title,
  path: cluster.path,
  faqs: buildClusterFaqs(cluster).map(([question, answer]) => [question, answer]),
  products: cluster.products,
}));

export const faqPage = {
  kind: 'faq',
  path: '/faq',
  title: 'OEM Pet Products FAQ Center',
  seoTitle: 'OEM Pet Products FAQ | 240 Buyer Questions',
  metaDescription: 'Explore 240 B2B answers about OEM pet products, training pads, underpads, dog bags, private label, factory audits, quality, shipping, and sourcing.',
  kicker: 'Buyer FAQ Center',
  h1: '240 practical answers for OEM and private-label buyers',
  intro: 'Browse questions by category, then follow the linked pillar guide, products, factory resources, and contact route.',
  image: '/images/quality-inspection-lab-mask.png',
  imageAlt: 'JCZCARE buyer FAQ and quality resource center',
  updatedAt,
  groups: faqGroups,
  faqs: faqGroups.flatMap((group) => group.faqs),
  sections: [],
  products: ['/products/disposable-pet-pads', '/products/adult-underpads'],
  breadcrumbs: [['Home', '/'], ['FAQ', '/faq']],
};

export const authorityPages = [
  ...pillarPages,
  ...hubPages,
  ...factoryPages,
  ...comparisonPages,
  ...caseStudyPages,
  faqPage,
];

export const authorityPageMap = new Map(authorityPages.map((page) => [page.path, page]));
export const authorityRoutes = authorityPages.map((page) => page.path);

export const getAuthorityPage = (path) => authorityPageMap.get(path);

export const getRelatedProductsForArticle = (article) => {
  const cluster = topicClusterMap.get(article.clusterSlug);
  return (cluster?.products || ['/products/disposable-pet-pads']).slice(0, 2);
};

export const getAuthoritySeoEntries = () => authorityPages.map((page) => ({
  path: page.path,
  title: page.seoTitle,
  description: page.metaDescription,
  image: page.image,
  type: page.kind === 'faq'
    ? 'FAQPage'
    : page.kind === 'pillar' || page.kind === 'factory-detail'
      ? 'Article'
      : 'CollectionPage',
  faqs: page.faqs,
  breadcrumbs: page.breadcrumbs,
  authorityPage: page,
}));

export const authorityStats = {
  categoryPages: pillarPages.length,
  pillarPages: pillarPages.length,
  faqs: faqGroups.reduce((total, group) => total + group.faqs.length, 0),
  comparisonPages: comparisonPages.length,
  caseStudies: caseStudyPages.length,
  articleConnections: blogArticles.reduce((total, article) => total + Math.min(5, (article.relatedSlugs || []).length + 2), 0),
  productConnections: blogArticles.length * 2,
  canonicalBase: siteUrl,
};
