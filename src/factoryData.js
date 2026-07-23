import { blogArticles } from './blogData.js';

const updatedAt = '2026-07-17';

const commonGallery = {
  production: [
    ['/images/generated-site/factory/factory-production-line-01.webp', 'Automated absorbent product converting line'],
    ['/images/generated-site/factory/factory-lamination-01.webp', 'Lamination and material-guiding detail'],
    ['/images/generated-site/factory/factory-production-line-02.webp', 'Production equipment and controlled line environment'],
  ],
  warehouse: [
    ['/images/generated-site/warehouse/warehouse-finished-goods-01.webp', 'Finished-product warehouse and organized storage'],
    ['/images/generated-site/factory/factory-campus-01.webp', 'Factory dispatch and logistics area'],
    ['/images/generated-site/packaging/private-label-packaging-01.webp', 'Private-label packing format reference'],
  ],
  quality: [
    ['/images/generated-site/quality-control/factory-quality-control-01.webp', 'Product inspection in a laboratory setting'],
    ['/images/generated-site/products/products-pet-pad-structure-01.webp', 'Absorbent product layer structure'],
    ['/images/generated-site/factory/factory-production-line-01.webp', 'In-process production control environment'],
  ],
  materials: [
    ['/images/generated-site/products/products-pet-pad-structure-01.webp', 'Layered absorbent product construction'],
    ['/images/generated-site/materials/products-absorbent-paper-01.webp', 'Absorbent paper sheet product format'],
    ['/images/generated-site/factory/factory-lamination-01.webp', 'Material-guiding and lamination process'],
  ],
};

const relatedArticlesFor = (keywords, limit = 6) => {
  const normalizedKeywords = keywords.map((keyword) => keyword.toLowerCase());
  const scored = blogArticles
    .map((article) => {
      const haystack = [
        article.title,
        article.primaryKeyword,
        ...(article.secondaryKeywords || []),
        article.category,
      ].join(' ').toLowerCase();
      const score = normalizedKeywords.reduce(
        (total, keyword) => total + (haystack.includes(keyword) ? 1 : 0),
        0,
      );
      return { article, score };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score);

  const selected = scored.map(({ article }) => article).slice(0, limit);
  if (selected.length >= limit) {
    return selected;
  }

  const selectedSlugs = new Set(selected.map((article) => article.slug));
  return [
    ...selected,
    ...blogArticles.filter((article) => !selectedSlugs.has(article.slug)).slice(0, limit - selected.length),
  ];
};

const sharedFaqs = [
  [
    'Can buyers review this process before placing an order?',
    'Yes. The appropriate review can combine a project brief, current factory evidence, samples, video communication, records, and an on-site visit where needed.',
  ],
  [
    'Does the process stay the same for every OEM project?',
    'No. Product structure, packaging, quantity, destination, and buyer inspection requirements can change the control points and approval sequence.',
  ],
  [
    'What should be included in an inquiry?',
    'Share the target market, product type, specification or benchmark, estimated quantity, packaging direction, destination, and expected schedule.',
  ],
];

const factoryProfiles = [
  {
    slug: 'production-line',
    title: 'Production Line',
    seoTitle: 'Pet Pad Production Line & OEM Process | JCZCARE',
    metaDescription: 'Explore the JCZCARE pet pad production line, converting workflow, process controls, specifications, buyer evidence, and related OEM products.',
    kicker: 'Factory Process',
    h1: 'Pet pad production line: from roll materials to packed goods',
    intro: 'A buyer-focused view of how absorbent product materials are aligned, converted, checked, folded, and prepared for private-label packing.',
    image: '/images/generated-site/factory/factory-production-line-01.webp',
    imageAlt: 'Automated pet pad production line for OEM manufacturing',
    gallery: commonGallery.production,
    keywords: ['production', 'manufactur', 'automation', 'line'],
    products: ['/products/disposable-pet-pads', '/products/adult-underpads'],
    timeline: [
      ['01', 'Specification release', 'Approved dimensions, weight, absorbency direction, packing, and inspection requirements are released to production.'],
      ['02', 'Material preparation', 'Roll materials and absorbent-core inputs are identified and prepared for the planned SKU.'],
      ['03', 'Converting and forming', 'Layers are guided, combined, embossed, cut, folded, and counted according to the production setup.'],
      ['04', 'In-process control', 'Operators and quality personnel review dimensions, weight, alignment, sealing, appearance, and packing consistency.'],
      ['05', 'Packing and release', 'Finished packs and cartons are checked against the approved order before warehouse transfer.'],
    ],
    specifications: [
      ['Product formats', 'Pet pads, adult underpads, absorbent sheet programs'],
      ['Configurable items', 'Size, pad weight, absorbent structure, embossing, fold, pack count'],
      ['Key controls', 'Material identity, alignment, dimensions, weight, sealing, count'],
      ['Buyer evidence', 'Approved specification, samples, in-process records, packing photos'],
      ['Change control', 'Buyer review before material or specification changes affecting the approved product'],
    ],
    sections: [
      ['What buyers should understand', 'Production capability is not only machine speed. Professional buyers should confirm whether the line can repeat the approved structure, control changeovers, and connect quality checks to the exact SKU. The most useful factory discussion follows one product from material preparation through finished-carton release.'],
      ['How the converting workflow is controlled', 'Roll tension, layer alignment, core distribution, cutting, folding, and packing all influence the finished result. A practical OEM brief defines measurable outcomes while allowing the production team to explain which setup choices support stability.'],
      ['Evidence for a first order', 'Ask for an approved specification, representative sample, packaging proof, production-stage checks, and pre-shipment evidence. The evidence should identify the order or SKU rather than relying on unrelated promotional images.'],
      ['Common sourcing risks', 'Late artwork, unclear absorbency targets, unapproved material substitutions, and poorly controlled multi-SKU changeovers can cause sample-to-production drift. Version control and written approvals reduce these risks.'],
    ],
  },
  {
    slug: 'warehouse',
    title: 'Warehouse',
    seoTitle: 'Pet Product Warehouse & Order Control | JCZCARE',
    metaDescription: 'Review warehouse zoning, material identification, finished-goods control, traceability, dispatch preparation, and B2B buyer evidence at JCZCARE.',
    kicker: 'Storage & Traceability',
    h1: 'Warehouse control for materials, finished goods, and export orders',
    intro: 'How organized storage, identification, status control, and dispatch planning support repeatable OEM supply.',
    image: '/images/generated-site/warehouse/warehouse-finished-goods-01.webp',
    imageAlt: 'Organized pet product warehouse with finished goods storage',
    gallery: commonGallery.warehouse,
    keywords: ['warehouse', 'inventory', 'traceability', 'storage'],
    products: ['/products/disposable-pet-pads', '/products/custom-pet-waste-bags'],
    timeline: [
      ['01', 'Receipt', 'Materials or finished goods are received against the relevant order and identification information.'],
      ['02', 'Status identification', 'Items are marked or located according to their receipt, inspection, release, or issue status.'],
      ['03', 'Controlled storage', 'Products are protected from avoidable moisture, contamination, damage, and order mixing.'],
      ['04', 'Order allocation', 'Released goods are connected to the correct SKU, packaging version, quantity, and destination.'],
      ['05', 'Dispatch handover', 'Cartons, marks, documents, and loading requirements are reviewed before shipment.'],
    ],
    specifications: [
      ['Storage scope', 'Raw materials, packaging components, work in progress, finished cartons'],
      ['Control focus', 'Identification, status, location, lot or order connection, damage prevention'],
      ['Export preparation', 'Carton count, shipping marks, packing list data, loading sequence'],
      ['Buyer evidence', 'Warehouse photos, finished-goods identification, carton and loading records'],
      ['Review point', 'How released, held, and nonconforming goods are distinguished'],
    ],
    sections: [
      ['Why warehouse control matters', 'A consistent product can still arrive incorrectly if cartons are mixed, packaging versions are confused, or goods are damaged before loading. Warehouse control is therefore part of product quality and not only a logistics activity.'],
      ['Material and product identification', 'The exact method can vary, but staff should be able to explain what an item is, which order it belongs to, and whether it is approved for use or shipment. Clear identification is especially important when similar SKUs share materials or cartons.'],
      ['Finished-goods release', 'Buyers should understand who authorizes release, how open quality issues are separated, and how final quantities connect to commercial documents. A retained record improves repeat-order comparison and complaint investigation.'],
      ['Dispatch readiness', 'Before loading, verify carton count, marks, packing list information, product condition, and any pallet or moisture-protection requirements. Photos can support communication but should be connected to the shipment.'],
    ],
  },
  {
    slug: 'raw-materials',
    title: 'Raw Materials',
    seoTitle: 'Pet Pad Raw Materials & Incoming Control | JCZCARE',
    metaDescription: 'Understand nonwoven, tissue, pulp, absorbent paper, SAP, PE film, packaging inputs, incoming checks, and OEM material change control.',
    kicker: 'Material Control',
    h1: 'Raw materials behind a controlled absorbent product specification',
    intro: 'A practical guide to material function, incoming identification, approved references, and change control for OEM buyers.',
    image: '/images/generated-site/products/products-pet-pad-structure-01.webp',
    imageAlt: 'Layered pet pad structure showing absorbent raw materials',
    gallery: commonGallery.materials,
    keywords: ['raw material', 'nonwoven', 'tissue', 'pulp', 'absorbent paper'],
    products: ['/products/pet-absorbent-paper-sheets', '/products/disposable-pet-pads'],
    timeline: [
      ['01', 'Material definition', 'The buyer brief and sample direction identify the required function and measurable product outcome.'],
      ['02', 'Supplier and lot receipt', 'Material identity and purchasing information are connected to the intended production requirement.'],
      ['03', 'Incoming review', 'Relevant appearance, dimensions, basis weight, or supporting documents are reviewed according to the material type.'],
      ['04', 'Storage and issue', 'Materials are protected and issued to the correct production order.'],
      ['05', 'Change approval', 'A proposed change affecting the approved product is evaluated before use.'],
    ],
    specifications: [
      ['Top layer', 'Soft nonwoven selected around feel, liquid intake, and converting compatibility'],
      ['Core carriers', 'Tissue, fluff pulp, or absorbent paper depending on product architecture'],
      ['Absorbent input', 'SAP level and distribution planned around performance targets'],
      ['Backing layer', 'PE film selected around leak resistance, feel, print, and converting needs'],
      ['Packaging inputs', 'Printed bag or label, carton, barcode, and shipment-mark materials'],
    ],
    sections: [
      ['Function before terminology', 'A material should be selected because it performs a defined role, not because a broad term sounds premium. Buyers should connect topsheet, core, SAP, tissue, pulp, and film decisions to absorption speed, total capacity, rewet, leakage, comfort, and cost.'],
      ['Incoming material controls', 'Incoming review should reflect material risk. Identity and visual checks may be appropriate for one input, while another may require dimensions, basis weight, declarations, or a controlled reference. The method should be clear and repeatable.'],
      ['Substitution and continuity', 'Supply conditions can change, but an input that affects the approved product should not be silently substituted. A change notice should explain the proposed material, likely effect, evidence, and whether a new sample is needed.'],
      ['Buyer specification strategy', 'Define measurable finished-product requirements and record critical material parameters where they are necessary. Over-specifying every input can reduce flexibility, while under-specifying performance creates ambiguity.'],
    ],
  },
  {
    slug: 'quality-control',
    title: 'Quality Control',
    seoTitle: 'Pet Pad Quality Control & Batch Release | JCZCARE',
    metaDescription: 'Explore incoming, in-process, finished-product, packaging, and shipment quality controls for OEM pet pads and absorbent products.',
    kicker: 'Quality System',
    h1: 'Quality control connected to the approved OEM specification',
    intro: 'A staged quality framework covering incoming materials, production controls, performance checks, packing, and release evidence.',
    image: '/images/generated-site/quality-control/factory-quality-control-01.webp',
    imageAlt: 'Quality inspector reviewing an absorbent pet pad in a laboratory',
    gallery: commonGallery.quality,
    keywords: ['quality control', 'qc', 'inspection', 'batch'],
    products: ['/products/disposable-pet-pads', '/products/adult-underpads'],
    timeline: [
      ['01', 'Incoming control', 'Critical materials and packaging components are identified and reviewed before use.'],
      ['02', 'First-piece confirmation', 'The initial output is compared with the released specification and approved direction.'],
      ['03', 'In-process checks', 'Dimensions, weight, alignment, sealing, count, and appearance are monitored during production.'],
      ['04', 'Performance review', 'Agreed absorbency, rewet, leakage, or other product checks are completed using defined methods.'],
      ['05', 'Final release', 'Product, packing, cartons, marks, and open issues are reviewed before shipment authorization.'],
    ],
    specifications: [
      ['Reference', 'Approved sample and controlled product specification'],
      ['Physical checks', 'Size, pad weight, appearance, embossing, edge condition, fold and count'],
      ['Performance checks', 'Method-dependent absorption, diffusion, rewet, pressure and leakage observations'],
      ['Packaging checks', 'Pack count, print version, barcode, seal, carton count and marks'],
      ['Records', 'Inspection results, retained samples, issue disposition and release evidence'],
    ],
    sections: [
      ['Quality begins with a clear specification', 'Inspection cannot compensate for an unclear brief. Size, weight, absorbency direction, packing, test method, tolerances, and approval responsibility should be defined before production starts.'],
      ['Control at the right stage', 'A problem is cheaper to correct when it is found early. Incoming review prevents unsuitable inputs from entering production, first-piece checks confirm setup, and in-process controls identify drift before an entire order is packed.'],
      ['Performance methods', 'A test result only has meaning when the method is understood. Buyers and factories should align liquid type and volume, timing, sample conditioning, pressure, measurement, and acceptance criteria where relevant.'],
      ['Nonconformance and corrective action', 'When a result falls outside the agreed requirement, the record should identify the issue, affected quantity, disposition, immediate correction, and any action intended to prevent recurrence.'],
    ],
  },
  {
    slug: 'testing-laboratory',
    title: 'Testing Laboratory',
    seoTitle: 'Pet Pad Testing Laboratory & Methods | JCZCARE',
    metaDescription: 'See how absorbency, rewet, dimensions, weight, leakage, sealing, and packaging tests can support an OEM pet pad approval plan.',
    kicker: 'Testing & Evidence',
    h1: 'Laboratory testing for measurable absorbent product decisions',
    intro: 'How defined test conditions help buyers compare samples, approve specifications, and review production evidence.',
    image: '/images/generated-site/quality-control/factory-quality-control-01.webp',
    imageAlt: 'Absorbent product testing laboratory and inspection equipment',
    gallery: commonGallery.quality,
    keywords: ['testing', 'laboratory', 'absorbency', 'rewet'],
    products: ['/products/disposable-pet-pads', '/products/adult-underpads'],
    timeline: [
      ['01', 'Method agreement', 'The buyer and technical team define the performance question and test conditions.'],
      ['02', 'Sample conditioning', 'Samples are identified and prepared so comparisons use a consistent basis.'],
      ['03', 'Controlled test', 'The agreed liquid, volume, timing, pressure, and measurement process are applied.'],
      ['04', 'Result review', 'Results are compared with the target, benchmark, or acceptance range.'],
      ['05', 'Record and decision', 'The method, result, sample identity, and approval decision are retained for the project.'],
    ],
    specifications: [
      ['Physical measurement', 'Dimensions, weight, thickness direction, pack count'],
      ['Absorption', 'Intake speed, diffusion, total capacity direction'],
      ['Surface performance', 'Rewet or liquid return under defined timing and pressure'],
      ['Barrier performance', 'Leakage observation and backing-film integrity'],
      ['Packaging', 'Seal, print, barcode, pack count, carton and transit-related checks'],
    ],
    sections: [
      ['Tests should answer buyer questions', 'A laboratory method should connect to the use case and purchasing decision. Total absorption alone does not describe speed, surface dryness, pressure resistance, or leakage behavior, so a balanced plan may need several checks.'],
      ['Repeatable conditions', 'Comparisons require the same sample size, conditioning, liquid, volume, timing, pressure, and calculation. Without these controls, two numbers can appear precise while describing different tests.'],
      ['From sample to mass production', 'The method used to approve a development sample should be practical enough to support production review. Retained samples and controlled records help investigate changes between orders.'],
      ['Responsible communication', 'Test results should be described with their method and scope. Buyers should avoid turning a limited internal test into a broad market claim without appropriate evidence and destination-market review.'],
    ],
  },
  {
    slug: 'packaging',
    title: 'Packaging',
    seoTitle: 'Private-Label Pet Product Packaging Process | JCZCARE',
    metaDescription: 'Explore private-label bag, label, barcode, pack-count, carton, artwork approval, and export packaging controls for OEM pet products.',
    kicker: 'Private Label Packing',
    h1: 'Packaging that connects brand presentation to factory execution',
    intro: 'A controlled workflow for pack format, artwork, barcode, carton, proofing, line packing, and shipment preparation.',
    image: '/images/generated-site/warehouse/warehouse-finished-goods-01.webp',
    imageAlt: 'Private-label pet product packaging and finished-goods preparation',
    gallery: commonGallery.warehouse,
    keywords: ['packaging', 'artwork', 'private label', 'carton'],
    products: ['/products/disposable-pet-pads', '/products/pet-care-pad-glove-wipes'],
    timeline: [
      ['01', 'Pack brief', 'Confirm folded product size, pack count, bag or box format, channel, and destination requirements.'],
      ['02', 'Dieline and artwork', 'Design is prepared within real print, seal, safe-area, barcode, and material constraints.'],
      ['03', 'Proof approval', 'Text, claims, colors, barcode, dimensions, version, and print feasibility are reviewed.'],
      ['04', 'Pack-out control', 'Finished product, count, seal, print version, and carton configuration are checked on line.'],
      ['05', 'Shipment verification', 'Cartons, marks, quantities, packing-list data, and loading condition are confirmed.'],
    ],
    specifications: [
      ['Primary pack', 'Printed bag, neutral bag with label, pouch, or retail box subject to project feasibility'],
      ['Information control', 'Brand, product name, count, size, barcode, claims, market language'],
      ['Carton planning', 'Units per carton, dimensions, strength direction, marks and destination data'],
      ['Approval evidence', 'Dieline, artwork version, print proof or sample, barcode review'],
      ['MOQ drivers', 'Printed material setup, colors, format, SKU count, and packaging supplier requirements'],
    ],
    sections: [
      ['Product and package must be developed together', 'Folded dimensions, compression, pack count, shelf format, fulfillment, and carton efficiency affect packaging feasibility. Artwork should not be finalized from a generic template before the physical product is stable.'],
      ['Version and claim control', 'The approved file should have a clear name, version, and date. Brand owners remain responsible for market language and claims, while the factory confirms print and packing feasibility.'],
      ['Barcode and carton readiness', 'Barcode placement, contrast, quiet zone, and packaging shape can affect scanning. Cartons should protect the retail pack and support efficient storage, loading, and destination handling.'],
      ['First-order evidence', 'Request a controlled proof or packaging sample where appropriate, then verify the actual print version, count, seal, carton, and marks before shipment.'],
    ],
  },
  {
    slug: 'container-loading',
    title: 'Container Loading',
    seoTitle: 'Pet Product Container Loading & Export Planning | JCZCARE',
    metaDescription: 'Plan pet product carton data, container utilization, loading sequence, moisture protection, shipment evidence, and export handover.',
    kicker: 'Export Logistics',
    h1: 'Container loading planned around product protection and landed value',
    intro: 'How carton dimensions, loading estimates, shipment controls, and documentation support reliable B2B delivery.',
    image: '/images/generated-site/factory/factory-campus-01.webp',
    imageAlt: 'Factory container loading and export shipment preparation',
    gallery: commonGallery.warehouse,
    keywords: ['container', 'loading', 'shipping', 'export'],
    products: ['/products/disposable-pet-pads', '/products/custom-pet-waste-bags'],
    timeline: [
      ['01', 'Carton data confirmation', 'Final carton dimensions, gross weight, units, marks, and total quantity are recorded.'],
      ['02', 'Loading estimate', 'Container use is calculated with allowances for real carton dimensions, handling, and product protection.'],
      ['03', 'Pre-loading review', 'Released goods, container condition, documents, sequence, and any moisture precautions are checked.'],
      ['04', 'Physical loading', 'Cartons are loaded to reduce avoidable crushing, movement, mixing, and count errors.'],
      ['05', 'Shipment evidence', 'Loading photos, seal information, quantities, and document handover are connected to the shipment.'],
    ],
    specifications: [
      ['Required carton data', 'Length, width, height, gross weight, net weight, units and SKU'],
      ['Planning inputs', 'Container type, route, pallet requirement, loading method and destination handling'],
      ['Protection', 'Carton strength direction, moisture precautions, movement and crushing risk'],
      ['Evidence', 'Count records, loading photos, container and seal information'],
      ['Commercial alignment', 'Packing list, invoice, marks, Incoterm and freight-provider instructions'],
    ],
    sections: [
      ['Loading starts with packaging design', 'Absorbent products can be bulky relative to value. Pack count, compression, carton dimensions, and carton strength should be considered during product planning rather than after production is complete.'],
      ['Estimates versus actual use', 'Container calculators are planning tools. Real utilization depends on final cartons, loading pattern, pallets if used, container condition, handling constraints, and the need to protect goods.'],
      ['Loading controls', 'Released goods should be counted and identified before loading. Mixed SKUs need a clear sequence, and cartons should not be forced into a pattern that creates unacceptable crushing or instability.'],
      ['Buyer and logistics handover', 'Confirm who provides the booking, customs information, shipping marks, document instructions, and destination requirements under the agreed Incoterm. Loading evidence supports communication but does not replace carrier or customs documents.'],
    ],
  },
  {
    slug: 'sap',
    title: 'SAP Technology',
    seoTitle: 'SAP Technology in Pet Pads & Underpads | JCZCARE',
    metaDescription: 'Understand super absorbent polymer function, liquid lock-in, diffusion balance, rewet, dosage trade-offs, testing, and OEM specification planning.',
    kicker: 'Absorbent Core',
    h1: 'SAP technology: balancing intake, lock-in, rewet, and cost',
    intro: 'A technical buyer guide to the role of super absorbent polymer inside pet pads and adult underpads.',
    image: '/images/generated-site/products/products-pet-pad-structure-01.webp',
    imageAlt: 'Super absorbent polymer layer inside a pet pad structure',
    gallery: commonGallery.materials,
    keywords: ['sap', 'super absorbent polymer', 'absorbency'],
    products: ['/products/disposable-pet-pads', '/products/adult-underpads'],
    timeline: [
      ['01', 'Use-case target', 'Define liquid volume, intake speed, surface dryness, pressure, pad size, and cost direction.'],
      ['02', 'Core proposal', 'SAP is balanced with tissue, pulp, or absorbent paper and the chosen pad architecture.'],
      ['03', 'Development sample', 'Samples are compared under agreed absorption, diffusion, rewet, and leakage conditions.'],
      ['04', 'Production control', 'Core weight, distribution, product weight, and relevant performance checks are monitored.'],
      ['05', 'Repeat-order review', 'Retained evidence and field feedback support future specification improvements.'],
    ],
    specifications: [
      ['Primary function', 'Absorb and retain liquid by forming a gel-like structure'],
      ['Performance interactions', 'Intake speed, diffusion, core distribution, pressure and rewet'],
      ['Specification approach', 'Define finished-product targets rather than relying on SAP quantity alone'],
      ['Testing direction', 'Controlled liquid volume, timing, pressure, absorption and rewet method'],
      ['Commercial trade-off', 'Performance, pad weight, thickness, process stability and material cost'],
    ],
    sections: [
      ['SAP is one part of the core', 'A higher SAP number does not automatically create a better product. Liquid must reach the particles, spread through the core, and remain controlled under handling or pressure. Tissue, pulp, absorbent paper, embossing, and pad geometry all influence the result.'],
      ['Define the performance target', 'Buyers should describe use case, liquid load, desired intake speed, surface dryness, pressure conditions, pad dimensions, and price band. The factory can then propose a practical structure for sampling.'],
      ['Test the complete pad', 'Raw-material data can support technical review, but the finished pad should be tested because converting, distribution, seals, and backing influence field performance. Use the same method when comparing suppliers.'],
      ['Control claims and cost', 'Avoid unsupported claims based only on a material name or quantity. Commercial decisions should consider measured performance, repeatability, product weight, production stability, and total cost.'],
    ],
  },
  {
    slug: 'pe-film',
    title: 'PE Film',
    seoTitle: 'PE Film Backing for Pet Pads & Underpads | JCZCARE',
    metaDescription: 'Review PE film backing for pet pads and underpads, including leak resistance, thickness direction, feel, printing, sealing, testing, and OEM trade-offs.',
    kicker: 'Leak-Proof Backing',
    h1: 'PE film backing designed around leakage, feel, and production stability',
    intro: 'What professional buyers should confirm about film function, specification, converting behavior, and finished-product testing.',
    image: '/images/generated-site/products/products-pet-pad-structure-01.webp',
    imageAlt: 'Leak-resistant PE film backing layer in an absorbent pad',
    gallery: commonGallery.materials,
    keywords: ['pe film', 'backing', 'leak proof', 'film'],
    products: ['/products/disposable-pet-pads', '/products/adult-underpads'],
    timeline: [
      ['01', 'Functional brief', 'Define leakage protection, feel, color, print, noise, strength, and application needs.'],
      ['02', 'Film proposal', 'Material direction is matched to the pad structure and converting requirements.'],
      ['03', 'Sample conversion', 'The complete pad is produced so film behavior can be reviewed with seals and layers.'],
      ['04', 'Barrier and handling review', 'Leakage observation, integrity, feel, folding, and packing compatibility are checked.'],
      ['05', 'Specification control', 'The approved film direction and finished-product requirements are recorded for production.'],
    ],
    specifications: [
      ['Function', 'Liquid barrier and structural backing for the absorbent product'],
      ['Buyer variables', 'Thickness direction, basis weight where used, color, print, feel and noise'],
      ['Production variables', 'Web handling, adhesion, sealing, cutting, folding and packing compatibility'],
      ['Finished-product checks', 'Leakage observation, edge integrity, holes, wrinkles and bond consistency'],
      ['Claims', 'Use qualified product language supported by finished-product evidence'],
    ],
    sections: [
      ['Film should be evaluated in the finished pad', 'A backing material may look suitable as a roll but behave differently after adhesive, embossing, cutting, folding, or compression. Review leakage protection and physical integrity on the converted product.'],
      ['Thickness is not the only decision', 'Polymer formulation, process, texture, color, printing, feel, noise, bonding, and web stability can affect the result. Buyers should define functional needs instead of selecting film by one number alone.'],
      ['Production compatibility', 'Film must run consistently with the line and other layers. Wrinkles, poor adhesion, edge damage, or pinholes can create leakage risk even when the nominal material appears adequate.'],
      ['Specification and change control', 'Record the approved direction and relevant finished-product checks. A proposed change should be reviewed for barrier performance, feel, converting behavior, and any packaging or claim effect.'],
    ],
  },
  {
    slug: 'certificates',
    title: 'Certificates',
    seoTitle: 'Factory Certificates & Buyer Document Review | JCZCARE',
    metaDescription: 'Learn how B2B buyers should review certificate scope, validity, issuing body, product relevance, test reports, material documents, and market requirements.',
    kicker: 'Documentation Center',
    h1: 'Certificate and compliance documents reviewed by scope, not logo',
    intro: 'A responsible framework for confirming current factory, product, material, and destination-market evidence before purchase.',
    image: '/images/generated-site/factory/factory-campus-01.webp',
    imageAlt: 'JCZCARE factory campus for certificate and compliance document review',
    gallery: [
      ['/images/generated-site/factory/factory-campus-01.webp', 'Factory profile and operating-site reference'],
      ['/images/generated-site/quality-control/factory-quality-control-01.webp', 'Product inspection and test-evidence context'],
      ['/images/generated-site/factory/factory-production-line-01.webp', 'Manufacturing process connected to buyer documentation'],
    ],
    keywords: ['certificate', 'iso', 'bsci', 'compliance', 'document'],
    products: ['/products/disposable-pet-pads', '/products/adult-underpads'],
    timeline: [
      ['01', 'Requirement definition', 'The buyer identifies the exact factory, product, material, market, channel, and claim requirement.'],
      ['02', 'Document request', 'The relevant current certificate, report, declaration, or specification is requested.'],
      ['03', 'Scope verification', 'Names, addresses, products, standards, dates, issuer, and validity are compared with the project.'],
      ['04', 'Gap review', 'Missing or mismatched evidence is identified before artwork or order approval.'],
      ['05', 'Controlled record', 'The verified document version and any market-specific review are retained with the project file.'],
    ],
    specifications: [
      ['Factory-system documents', 'Confirm entity, site, standard, scope, issuer, validity and current status'],
      ['Product evidence', 'Confirm exact SKU or representative scope, method, result, date and laboratory'],
      ['Material documents', 'Confirm material identity, supplier, batch or specification relationship where relevant'],
      ['Market documentation', 'Confirm destination, channel, labeling, claim and importer responsibilities'],
      ['Buyer action', 'Request current copies for the exact project rather than relying on website badges'],
    ],
    sections: [
      ['A certificate logo is not enough', 'Professional review checks the legal entity, operating site, scope, standard, issuing body, dates, and relevance to the exact product. A document for one company or category should not be assumed to cover another.'],
      ['Separate evidence types', 'Management-system certificates, social-audit documents, product test reports, material declarations, and market registrations answer different questions. One document cannot substitute for every requirement.'],
      ['Verify before artwork and purchase', 'Claims, certification marks, and compliance language should not be printed until the responsible buyer team confirms current evidence and permission for use in the destination market. Requirements can change.'],
      ['Request a current project pack', 'JCZCARE buyers should request the documentation relevant to their exact SKU, market, and order. Availability and applicability must be confirmed during project review; this page does not claim that every document applies to every product.'],
    ],
  },
];

const buildFactoryPage = (profile) => ({
  ...profile,
  kind: 'factory-detail',
  path: `/factory/${profile.slug}`,
  updatedAt,
  sections: profile.sections.map(([heading, paragraph]) => ({
    heading,
    paragraphs: [paragraph],
  })),
  articles: relatedArticlesFor(profile.keywords),
  faqs: [
    ...sharedFaqs,
    [
      `What evidence is most useful for ${profile.title.toLowerCase()} review?`,
      `Use the specifications, timeline, project-linked records, representative samples, and current visual evidence shown or requested for the exact ${profile.title.toLowerCase()} scope.`,
    ],
    [
      'Can the requirements be customized for a private-label order?',
      'Yes. The practical scope depends on product specification, packaging, order quantity, destination, and the controls needed for repeat production.',
    ],
    [
      'How can I request more detailed factory information?',
      'Submit an inquiry with your company, target product, market, estimated quantity, and the factory evidence your procurement or quality team needs.',
    ],
  ],
  breadcrumbs: [
    ['Home', '/'],
    ['Factory Center', '/factory'],
    [profile.title, `/factory/${profile.slug}`],
  ],
});

export const factoryPages = factoryProfiles.map(buildFactoryPage);
export const factoryRoutes = factoryPages.map((page) => page.path);
export const factoryPageMap = new Map(factoryPages.map((page) => [page.path, page]));
export const getFactoryPage = (path) => factoryPageMap.get(path);

export const factoryNavigationCards = factoryPages.map((page) => [page.title, page.path]);
