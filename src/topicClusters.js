const clusterProfiles = [
  {
    slug: 'oem-manufacturing',
    title: 'OEM Manufacturing',
    shortTitle: 'OEM',
    primaryKeyword: 'OEM pet products manufacturing',
    image: '/images/generated-site/factory/factory-production-line-01.webp',
    summary: 'A complete procurement framework for developing, sampling, producing, and scaling OEM absorbent pet products.',
    focus: 'translating a buyer brief into a controlled, repeatable manufacturing program',
    materials: 'nonwoven topsheet, tissue, fluff pulp or absorbent paper, SAP, PE film, adhesives, printed bags, and export cartons',
    channels: 'pet brands, importers, distributors, retail chains, and marketplace operators',
    risks: 'unclear specifications, sample-to-production drift, uncontrolled material substitutions, artwork delays, and weak change control',
    evidence: 'approved samples, signed specification sheets, material records, in-process checks, packing proofs, and pre-shipment evidence',
    products: ['/products/disposable-pet-pads', '/products/adult-underpads'],
    keywords: ['oem', 'odm', 'manufactur', 'production', 'sample', 'specification', 'product brief', 'pilot order', 'timeline', 'handoff', 'nda'],
  },
  {
    slug: 'pet-training-pads',
    title: 'Pet Training Pads',
    shortTitle: 'Training Pads',
    primaryKeyword: 'pet training pads buyer guide',
    image: '/images/generated-site/products/products-disposable-pads-01.webp',
    summary: 'Technical and commercial guidance for sourcing puppy pads, training pads, charcoal pads, and adhesive pet pads.',
    focus: 'matching pad structure and performance to the intended training, travel, senior-pet, or retail use case',
    materials: 'soft nonwoven, tissue, SAP, fluff pulp, absorbent paper, PE backing, embossing, edge seals, charcoal layers, and adhesive strips',
    channels: 'private-label brands, supermarkets, pet specialty chains, wholesalers, and online sellers',
    risks: 'slow absorption, high rewet, weak edge sealing, unstable pad weight, misleading absorbency claims, and poor carton protection',
    evidence: 'absorption-speed results, rewet checks, size and weight records, seal inspection, packaging review, and retained batch samples',
    products: ['/products/disposable-pet-pads', '/products/charcoal-pet-pads', '/products/adhesive-pet-pads'],
    keywords: ['puppy pad', 'training pad', 'pet pad', 'charcoal', 'adhesive', 'rewet', 'absorbency', 'leak', 'emboss', 'five-layer'],
  },
  {
    slug: 'adult-underpads',
    title: 'Adult Underpads',
    shortTitle: 'Underpads',
    primaryKeyword: 'OEM adult disposable underpads',
    image: '/images/generated-site/products/products-underpads-01.webp',
    summary: 'B2B sourcing knowledge for disposable underpads used in healthcare, nursing, distribution, and home-care channels.',
    focus: 'building an underpad specification around care setting, absorbency, skin-contact expectations, packing, and procurement controls',
    materials: 'skin-contact nonwoven, tissue, SAP, fluff pulp or absorbent paper, leak-resistant PE film, and reinforced edge construction',
    channels: 'hospital suppliers, nursing-home distributors, home-care brands, medical wholesalers, and retail healthcare programs',
    risks: 'inappropriate performance claims, weak backing film, excessive rewet, inconsistent dimensions, and documentation gaps',
    evidence: 'buyer-approved specifications, absorbency and rewet methods, backing-film review, pack-count checks, and destination-market documentation',
    products: ['/products/adult-underpads', '/products/pet-absorbent-paper-sheets'],
    keywords: ['adult underpad', 'hospital underpad', 'nursing', 'medical', 'home care', 'incontinence', 'skin contact'],
  },
  {
    slug: 'dog-poop-bags',
    title: 'Dog Poop Bags',
    shortTitle: 'Poop Bags',
    primaryKeyword: 'OEM dog poop bags',
    image: '/images/custom-pet-waste-bags-ai.png',
    summary: 'Material, roll, packaging, claim, and supplier guidance for private-label dog waste bag programs.',
    focus: 'defining film material, thickness, tear behavior, roll geometry, dispensing, packaging, and environmental claim controls',
    materials: 'HDPE, LDPE, certified compostable compounds where applicable, pigments, perforation profiles, paper cores, labels, and cartons',
    channels: 'pet brands, municipal programs, subscription sellers, retail chains, distributors, and online marketplaces',
    risks: 'unsupported environmental claims, weak seals, difficult perforation, inconsistent roll counts, color variation, and packaging misfit',
    evidence: 'film specification, thickness tolerance, seal and tear checks, roll-count verification, claim substantiation, and packaging proofs',
    products: ['/products/custom-pet-waste-bags'],
    keywords: ['poop bag', 'waste bag', 'hdpe', 'ldpe', 'compost', 'roll core', 'tear resistance', 'dog bag'],
  },
  {
    slug: 'packaging',
    title: 'Packaging',
    shortTitle: 'Packaging',
    primaryKeyword: 'OEM pet product packaging',
    image: '/images/generated-site/packaging/private-label-packaging-01.webp',
    summary: 'A complete B2B guide to private-label bags, cartons, pack counts, artwork, barcodes, shipping marks, and retail readiness.',
    focus: 'connecting product dimensions and channel requirements to accurate, efficient, and brand-ready packaging',
    materials: 'printed film, pouches, labels, closures, inserts, retail boxes, corrugated cartons, barcodes, and shipping marks',
    channels: 'private-label brands, retail chains, distributors, supermarkets, marketplace sellers, and import programs',
    risks: 'artwork errors, pack-count mismatches, weak cartons, unsupported claims, barcode failures, excess empty space, and late approvals',
    evidence: 'approved dielines, artwork proofs, barcode verification, pack-out samples, carton specifications, drop-test plans, and loading data',
    products: ['/products/disposable-pet-pads', '/products/custom-pet-waste-bags'],
    keywords: ['packaging', 'pack count', 'artwork', 'carton', 'barcode', 'retail pack', 'bag format', 'label'],
  },
  {
    slug: 'materials',
    title: 'Materials',
    shortTitle: 'Materials',
    primaryKeyword: 'pet pad materials buyer guide',
    image: '/images/generated-site/products/products-pet-pad-structure-01.webp',
    summary: 'Technical sourcing guidance for nonwoven, tissue, pulp, absorbent paper, SAP, PE backing, adhesives, and packaging inputs.',
    focus: 'linking every raw-material choice to measurable product performance, production consistency, cost, and supply continuity',
    materials: 'nonwoven topsheets, tissue, virgin or recycled pulp, absorbent paper, SAP, PE film, hot-melt adhesive, pigments, and packaging stocks',
    channels: 'product engineers, sourcing teams, quality managers, private-label brands, distributors, and retail buyers',
    risks: 'uncontrolled substitutions, unclear basis weight, inconsistent raw materials, misleading terminology, supply disruption, and specification drift',
    evidence: 'material specifications, supplier declarations, incoming inspection records, approved references, change notices, and performance comparisons',
    products: ['/products/pet-absorbent-paper-sheets', '/products/disposable-pet-pads'],
    keywords: ['material', 'pulp', 'nonwoven', 'tissue', 'absorbent paper', 'raw material', 'adhesive', 'basis weight'],
  },
  {
    slug: 'private-label',
    title: 'Private Label',
    shortTitle: 'Private Label',
    primaryKeyword: 'private label pet products',
    image: '/images/generated-site/packaging/private-label-packaging-01.webp',
    summary: 'A launch system for buyers developing branded pet products without owning manufacturing infrastructure.',
    focus: 'connecting product positioning, specification, artwork, packaging, compliance review, and repeat-order planning',
    materials: 'channel-appropriate product structures, printed retail packaging, labels, barcodes, outer cartons, inserts, and sample presentation materials',
    channels: 'new pet brands, established retailers, importers, distributors, Amazon sellers, and category expansion teams',
    risks: 'starting artwork before the product is fixed, unverified claims, barcode errors, packaging MOQ surprises, and inconsistent reorder control',
    evidence: 'brand brief, approved product sample, packaging dieline, artwork proof, barcode verification, carton specification, and launch checklist',
    products: ['/products/disposable-pet-pads', '/products/pet-care-pad-glove-wipes'],
    keywords: ['private label', 'brand launch', 'artwork', 'packaging', 'retail', 'amazon', 'label'],
  },
  {
    slug: 'factory-audit',
    title: 'Factory Audit',
    shortTitle: 'Factory Audit',
    primaryKeyword: 'pet products factory audit',
    image: '/images/generated-site/factory/factory-campus-01.webp',
    summary: 'Factory evaluation resources covering production lines, raw materials, warehouse control, capacity, maintenance, and export readiness.',
    focus: 'verifying whether a supplier can consistently convert approved specifications into export-ready orders',
    materials: 'incoming raw materials, machine-compatible rolls, absorbent-core inputs, packaging stocks, cartons, labels, and retained reference samples',
    channels: 'procurement teams, quality managers, sourcing agents, distributors, retail buyers, and long-term OEM programs',
    risks: 'capacity claims without evidence, weak maintenance, uncontrolled warehouse conditions, poor traceability, and limited export coordination',
    evidence: 'factory tour records, line lists, production schedules, warehouse zoning, maintenance logs, QC records, and shipment documentation',
    products: ['/products/disposable-pet-pads', '/products/adult-underpads'],
    keywords: ['factory', 'production capacity', 'warehouse', 'maintenance', 'tour', 'audit', 'certificate', 'traceability'],
  },
  {
    slug: 'import-guide',
    title: 'Import Guide',
    shortTitle: 'Import Guide',
    primaryKeyword: 'pet products import guide',
    image: '/images/generated-site/factory/factory-campus-01.webp',
    summary: 'Practical procurement playbooks for supplier selection, quotations, MOQ, samples, Incoterms, inspections, and landed cost.',
    focus: 'making supplier and order decisions from comparable evidence instead of headline price alone',
    materials: 'comparable specification sheets, sample records, quotations, packaging data, carton dimensions, inspection criteria, and freight assumptions',
    channels: 'importers, distributors, wholesalers, retail buying teams, sourcing managers, and brand operations teams',
    risks: 'non-comparable quotations, hidden specification differences, unrealistic lead times, weak inspection scope, and incomplete landed-cost models',
    evidence: 'normalized quote comparisons, sample scorecards, supplier audit records, Incoterm confirmation, shipment plans, and post-arrival reviews',
    products: ['/products/disposable-pet-pads', '/products/custom-pet-waste-bags'],
    keywords: ['buying guide', 'supplier', 'sourcing', 'procurement', 'import', 'moq', 'lead time', 'incoterm', 'fob', 'cif', 'inspection', 'cost', 'negotiation'],
  },
  {
    slug: 'quality-control',
    title: 'Quality Control',
    shortTitle: 'Quality',
    primaryKeyword: 'pet products quality control',
    image: '/images/generated-site/quality-control/factory-quality-control-01.webp',
    summary: 'A quality framework for incoming materials, in-process control, performance testing, packaging inspection, and corrective action.',
    focus: 'turning buyer expectations into measurable checks at incoming, in-process, finished-product, and shipment stages',
    materials: 'incoming nonwoven, absorbent inputs, film, adhesives, packaging materials, finished samples, inspection tools, and retained records',
    channels: 'quality teams, sourcing managers, brand owners, distributors, retailers, and third-party inspection partners',
    risks: 'visual-only inspection, unclear test methods, missing tolerances, sample drift, weak corrective action, and incomplete shipment evidence',
    evidence: 'inspection plans, test methods, acceptance limits, batch records, nonconformance reports, corrective actions, and retained samples',
    products: ['/products/disposable-pet-pads', '/products/adult-underpads'],
    keywords: ['quality control', 'inspection', 'testing', 'qc', 'defect', 'rewet', 'certificate', 'audit'],
  },
  {
    slug: 'shipping',
    title: 'Shipping',
    shortTitle: 'Shipping',
    primaryKeyword: 'pet products export shipping',
    image: '/images/generated-site/factory/factory-campus-01.webp',
    summary: 'Export planning for cartons, palletization, container loading, Incoterms, documentation, and arrival-condition control.',
    focus: 'protecting product and commercial value from final packing through destination receipt',
    materials: 'retail packs, export cartons, labels, pallet materials, container loading plans, shipping marks, commercial documents, and inspection photos',
    channels: 'importers, freight coordinators, distributors, retail supply teams, marketplaces, and multi-country buying programs',
    risks: 'weak cartons, unused container space, moisture exposure, incorrect marks, document mismatches, and unclear risk transfer',
    evidence: 'carton specifications, loading calculations, photos, packing lists, invoice data, Incoterm confirmation, and receiving inspection records',
    products: ['/products/disposable-pet-pads', '/products/custom-pet-waste-bags'],
    keywords: ['shipping', 'container', 'loading', 'export', 'incoterm', 'fob', 'cif', 'freight', 'carton', 'landed cost'],
  },
  {
    slug: 'customization',
    title: 'Customization',
    shortTitle: 'Customization',
    primaryKeyword: 'custom pet products OEM',
    image: '/images/generated-site/products/products-pet-pad-structure-01.webp',
    summary: 'A product-development framework for custom sizes, performance, materials, packaging, labeling, and channel differentiation.',
    focus: 'deciding which custom features create buyer value and which add cost or risk without improving the market offer',
    materials: 'custom topsheets, absorbent cores, SAP levels, colors, scents where suitable, backing options, packaging, labels, and cartons',
    channels: 'private-label brands, retailers, distributors, marketplace sellers, specialty channels, and regional exclusivity programs',
    risks: 'over-customization, incompatible materials, excessive SKU count, unclear claims, packaging delays, and unplanned MOQ increases',
    evidence: 'product brief, benchmark sample, development matrix, approved prototypes, packaging proof, testing plan, and change-control record',
    products: ['/products/disposable-pet-pads', '/products/charcoal-pet-pads', '/products/adhesive-pet-pads'],
    keywords: ['custom', 'customization', 'formula', 'size', 'packaging', 'product development', 'specification'],
  },
  {
    slug: 'sap-technology',
    title: 'SAP Technology',
    shortTitle: 'SAP',
    primaryKeyword: 'SAP technology in pet pads',
    image: '/images/generated-site/products/products-pet-pad-structure-01.webp',
    summary: 'A technical and commercial guide to super absorbent polymer selection, dosage, distribution, absorption speed, capacity, and rewet control.',
    focus: 'specifying SAP as part of a balanced absorbent core rather than treating polymer quantity as a stand-alone quality claim',
    materials: 'super absorbent polymer, fluff pulp, absorbent paper, tissue, acquisition layers, core adhesives, and controlled dosing systems',
    channels: 'pet pad brands, adult-underpad buyers, product engineers, importers, distributors, and quality teams',
    risks: 'uneven polymer distribution, misleading capacity claims, gel blocking, dust, high rewet, unstable dosing, and sample-to-production drift',
    evidence: 'SAP specification, dosing records, core-weight checks, absorption-speed testing, retention and rewet methods, and retained batch samples',
    products: ['/products/disposable-pet-pads', '/products/adult-underpads', '/products/pet-absorbent-paper-sheets'],
    keywords: ['sap', 'super absorbent polymer', 'polymer', 'absorbency', 'rewet', 'gel', 'absorbent core'],
  },
  {
    slug: 'pe-film',
    title: 'PE Film',
    shortTitle: 'PE Film',
    primaryKeyword: 'PE film for pet pads',
    image: '/images/generated-site/products/products-pet-pad-structure-01.webp',
    summary: 'Buyer guidance for leak-resistant PE backing film, thickness, embossing, softness, tensile behavior, sealing, and responsible claims.',
    focus: 'balancing leak protection, handling, noise, converting performance, cost, and destination-market requirements',
    materials: 'PE backing film, pigments, embossing patterns, masterbatch, adhesives, edge-seal materials, and optional anti-slip treatments',
    channels: 'pet pad brands, underpad distributors, quality teams, product developers, retailers, and sourcing managers',
    risks: 'pinholes, weak seals, excessive noise, inconsistent thickness, tearing, blocking, color variation, and unsupported environmental claims',
    evidence: 'film specification, thickness records, leak checks, tensile or handling review, seal inspection, color standard, and supplier change control',
    products: ['/products/disposable-pet-pads', '/products/adult-underpads', '/products/adhesive-pet-pads'],
    keywords: ['pe film', 'pe backing', 'backsheet', 'leak proof', 'waterproof film', 'film thickness', 'edge seal'],
  },
  {
    slug: 'industry-insights',
    title: 'Industry Insights',
    shortTitle: 'Insights',
    primaryKeyword: 'pet products industry insights',
    image: '/images/generated-site/contact/contact-business-office-01.webp',
    summary: 'Market, material, retail, sustainability, supply-chain, and manufacturing intelligence for B2B pet product decision makers.',
    focus: 'turning market signals into cautious, evidence-based sourcing and portfolio decisions',
    materials: 'market reports, raw-material trends, supplier intelligence, retail feedback, packaging developments, regulatory sources, and internal sales data',
    channels: 'brand strategy teams, importers, distributors, retail buyers, product managers, and long-range sourcing planners',
    risks: 'chasing trends without channel evidence, overstating sustainability, reacting to short-term cost changes, and launching undifferentiated SKUs',
    evidence: 'authoritative industry sources, buyer data, controlled trials, retailer feedback, supplier documentation, and scenario-based forecasts',
    products: ['/products/disposable-pet-pads', '/products/adult-underpads', '/products/custom-pet-waste-bags'],
    keywords: ['industry', 'market', 'trend', 'sustainability', 'supply chain', 'raw material', 'future', 'retail', 'ecommerce'],
  },
];

export const topicClusters = clusterProfiles.map((cluster) => ({
  ...cluster,
  path: `/blog/category/${cluster.slug}`,
}));

export const topicClusterMap = new Map(topicClusters.map((cluster) => [cluster.slug, cluster]));

const categoryOverrides = {
  'OEM / ODM': 'oem-manufacturing',
  Manufacturing: 'oem-manufacturing',
  Ordering: 'oem-manufacturing',
  'Supplier Qualification': 'import-guide',
  'Supplier Selection': 'import-guide',
  'Buying Guide': 'import-guide',
  'Factory Audit': 'factory-audit',
  Factory: 'factory-audit',
  Packaging: 'packaging',
  Procurement: 'import-guide',
  Materials: 'materials',
  Performance: 'pet-training-pads',
  'Quality Control': 'quality-control',
  'Private Label': 'private-label',
  'Industry Insights': 'industry-insights',
  'Adult Underpads': 'adult-underpads',
  'Dog Poop Bags': 'dog-poop-bags',
  'Pet Training Pads': 'pet-training-pads',
  'OEM Manufacturing': 'oem-manufacturing',
};

export const resolveArticleClusterSlug = (article) => {
  const searchable = [
    article.title,
    article.primaryKeyword,
    ...(article.secondaryKeywords || []),
    article.category,
  ].join(' ').toLowerCase();

  if (/\b(super absorbent polymer|sap)\b/.test(searchable)) {
    return 'sap-technology';
  }

  if (/\b(pe film|pe backing|backsheet|waterproof film)\b/.test(searchable)) {
    return 'pe-film';
  }

  if (/\b(container loading|export documents|incoterms|fob vs cif|export shipment)\b/.test(searchable)) {
    return 'shipping';
  }

  if (/\b(custom absorbency|multi-sku|technical specification sheet|custom size|custom weight)\b/.test(searchable)) {
    return 'customization';
  }

  if (categoryOverrides[article.category]) {
    return categoryOverrides[article.category];
  }

  let bestCluster = topicClusters[0];
  let bestScore = -1;

  topicClusters.forEach((cluster) => {
    const score = cluster.keywords.reduce(
      (total, keyword) => total + (searchable.includes(keyword.toLowerCase()) ? 1 : 0),
      0,
    );
    if (score > bestScore) {
      bestCluster = cluster;
      bestScore = score;
    }
  });

  return bestCluster.slug;
};

export const getTopicCluster = (slug) => topicClusterMap.get(slug);
