import { topicClusterMap } from './topicClusters.js';

export const ecosystemUpdatedAt = '2026-07-21';
export const ecosystemAuthor = 'JCZCare Editorial Team';
export const ecosystemSiteUrl = 'https://www.jczcare.com';

const sectionFrames = [
  ['Define the purchasing decision', 'scope the business decision before comparing products or suppliers'],
  ['Translate market needs into a brief', 'connect channel, end use, price position, and customer expectations to a controlled requirement'],
  ['Build a measurable specification', 'replace broad quality language with dimensions, materials, performance methods, and tolerances'],
  ['Request comparable supplier evidence', 'ask every candidate for evidence that relates to the same SKU, process, and commercial assumption'],
  ['Plan samples and approval gates', 'use samples to answer defined questions and record which version becomes the production reference'],
  ['Model MOQ and commercial constraints', 'separate material, printing, line setup, pack-out, and SKU factors that influence minimum quantities'],
  ['Create a realistic lead-time plan', 'separate development, artwork, materials, production, inspection, and shipping dependencies'],
  ['Control quality before shipment', 'agree test methods, sampling rules, defect classes, release authority, and corrective-action expectations'],
  ['Align packaging and logistics', 'confirm pack dimensions, barcodes, cartons, marks, container use, and destination handling requirements'],
  ['Compare total landed value', 'evaluate product, packaging, freight, inventory, inspection, defect risk, and reorder efficiency together'],
  ['Manage changes and exceptions', 'record substitutions, artwork revisions, forecast changes, deviations, and approvals in one controlled trail'],
  ['Prepare the first production order', 'convert the approved brief into a pilot or commercial order with clear evidence checkpoints'],
  ['Review arrival and market feedback', 'connect receiving checks, complaints, sell-through, and packaging observations to the next order'],
  ['Scale a repeat-order program', 'protect approved quality while forecasts, SKU count, channels, and annual volume expand'],
  ['Use an executive buyer checklist', 'give purchasing, quality, product, logistics, finance, and sales one final approval view'],
  ['Assign ownership and escalation', 'make decision owners, response times, and escalation routes visible before an issue occurs'],
  ['Evaluate supplier resilience', 'review material continuity, maintenance, staffing, capacity allocation, and contingency planning'],
  ['Validate claims and documents', 'match performance, environmental, labeling, and certification statements to current evidence'],
  ['Negotiate with facts', 'use normalized specifications and documented cost drivers instead of relying on headline unit price'],
  ['Document the repeatable playbook', 'retain specifications, samples, artwork, records, lessons, and responsibilities for future teams'],
  ['Set management review metrics', 'track quality, delivery, communication, inventory, cost, and corrective-action performance'],
  ['Make the final go or no-go decision', 'approve only when evidence, economics, timing, and accountability support the intended launch'],
];

const buyerByCluster = {
  'oem-manufacturing': 'brand owners, importers, product managers, and sourcing teams building a controlled OEM program',
  'pet-training-pads': 'pet pad brands, distributors, retailers, and category managers comparing training-pad performance',
  'adult-underpads': 'healthcare distributors, institutional buyers, private-label brands, and care-product procurement teams',
  'dog-poop-bags': 'pet brands, retailers, distributors, and waste-bag buyers managing film, roll, and claim decisions',
  packaging: 'brand, packaging, quality, logistics, and procurement teams preparing a retail-ready pack system',
  materials: 'product engineers, quality managers, sourcing teams, and buyers evaluating raw-material trade-offs',
  'private-label': 'private-label brands, retailers, importers, and marketplace teams preparing a differentiated launch',
  'factory-audit': 'procurement, quality, compliance, and sourcing teams qualifying a manufacturing partner',
  'import-guide': 'importers, distributors, wholesalers, and commercial teams controlling international purchasing risk',
  'quality-control': 'quality managers, sourcing teams, brand owners, and inspection partners defining release evidence',
  shipping: 'importers, freight coordinators, warehouse teams, and buyers planning export orders and landed cost',
  customization: 'product, brand, purchasing, and technical teams deciding where customization creates market value',
  'sap-technology': 'absorbent-product engineers, quality teams, brands, and buyers evaluating polymer performance',
  'pe-film': 'product developers, quality managers, and sourcing teams evaluating leak-resistant backing materials',
  'industry-insights': 'commercial leaders, portfolio managers, procurement teams, and distributors planning long-term category growth',
};

export const ecosystemCluster = (slug) => topicClusterMap.get(slug) || topicClusterMap.get('oem-manufacturing');

export const buildEcosystemSections = (spec, sectionCount = 10, paragraphsPerSection = 4) => {
  const cluster = ecosystemCluster(spec.clusterSlug);
  const buyer = spec.buyer || buyerByCluster[spec.clusterSlug] || buyerByCluster['oem-manufacturing'];
  const frames = sectionFrames.slice(0, sectionCount);

  return frames.map(([heading, objective], sectionIndex) => {
    const context = `${spec.title} is a focused purchasing decision for ${buyer}.`;
    const paragraphs = [
      `${context} In this stage, the team should ${objective}. The starting point is ${spec.decision}. A useful discussion identifies the target channel, use case, specification version, estimated order profile, destination, and decision owner. It also records assumptions that remain open. This keeps quotations and samples comparable and prevents the project from drifting into a collection of unapproved preferences.`,
      `For ${spec.title.toLowerCase()}, the ${heading.toLowerCase()} review should support a measurable commercial outcome by helping the team ${objective}. Relevant inputs include ${cluster.materials}. The buyer should ask how each proposed choice influences ${cluster.focus}, then request a method for checking the result. Descriptive terms such as premium, stronger, greener, or medical grade are not enough on their own; they need a defined product context and evidence appropriate to the destination market.`,
      `During ${heading.toLowerCase()} for ${spec.title.toLowerCase()}, the main risk is ${spec.risk}. That risk becomes harder to resolve when product, quality, packaging, logistics, and purchasing teams use different files or approval messages. A controlled project record should therefore include ${spec.evidence}. Evidence should identify the relevant sample, order, batch, artwork version, or shipment instead of relying on a general brochure or an unrelated test result.`,
      `A practical output from the ${heading.toLowerCase()} stage is ${spec.outcome}. The buyer should assign responsibility, an approval deadline, and a consequence if the requirement changes. When a decision affects MOQ, price, lead time, packaging, inspection, or compliance review, the commercial effect should be visible before approval. This discipline gives JCZCARE and the buyer a stable basis for sampling, production, release, and repeat-order improvement.`,
    ].slice(0, paragraphsPerSection);

    return {
      heading,
      paragraphs,
      comparisonRows: [2, 5, 9, 17].includes(sectionIndex)
        ? [
            ['Decision point', 'Lower-control route', 'Higher-control route', 'Evidence to retain'],
            ['Specification', 'Supplier standard', 'Buyer-approved parameters', `Controlled brief for ${spec.title}`],
            ['Sampling', 'Visual reference', 'Measured approval sample', 'Version, method, result, and approver'],
            ['Commercial terms', 'Headline unit price', 'Normalized landed-value model', 'Quote assumptions and exclusions'],
            ['Release', 'General factory check', 'Agreed inspection and exception process', spec.evidence],
          ]
        : undefined,
    };
  });
};

const faqFrames = [
  ['What should be defined before requesting a quotation?', 'Define the market, application, measurable specification, packaging, estimated quantity, destination, timing, and approval responsibilities.'],
  ['Which supplier evidence should a buyer request?', 'Request evidence tied to the proposed SKU and process, including controlled specifications, samples, relevant records, packaging proofs, and release checks.'],
  ['How should MOQ be evaluated?', 'Separate MOQ drivers for materials, printing, line setup, pack count, cartons, and the number of SKUs instead of treating MOQ as one fixed number.'],
  ['What makes a sample useful?', 'A useful sample answers defined performance and packaging questions, is linked to a versioned specification, and can become the mass-production reference.'],
  ['How should lead time be planned?', 'Plan development, sample approval, artwork, material preparation, production, inspection, and shipping as separate dependent stages.'],
  ['How can buyers compare quotations fairly?', 'Normalize size, weight, materials, performance, pack count, packaging, Incoterm, inspection scope, and destination before comparing price.'],
  ['What should be checked before shipment?', 'Check the approved specification, performance evidence, dimensions, count, packaging, carton marks, documents, and any agreed inspection result.'],
  ['How should specification changes be managed?', 'Record the proposed change, reason, expected effect, evidence, cost, timing, approver, and whether a new sample is required.'],
  ['Can packaging be developed in parallel?', 'Yes, but final artwork should wait until dimensions, folding, pack count, claims, barcode data, and pack format are stable.'],
  ['How should environmental claims be handled?', 'Use specific qualified claims supported by current material or test evidence and review them for the destination market before printing.'],
  ['When is a pilot order appropriate?', 'Use a pilot when performance, production repeatability, packaging, logistics, or market response needs confirmation before broader scale.'],
  ['What should a factory audit verify?', 'Verify process fit, equipment condition, material control, maintenance, warehouse practice, traceability, quality records, and export workflow.'],
  ['How should total cost be calculated?', 'Include product, packaging, inspection, freight, duty, inventory, payment timing, defect exposure, and reorder efficiency.'],
  ['What information should be retained for repeat orders?', 'Retain the approved sample, specification, artwork, barcode, carton data, test method, inspection evidence, issue log, and shipment record.'],
  ['How can buyers reduce avoidable delays?', 'Use one controlled brief, name decision owners, respond to approval gates, and prevent late unreviewed specification or artwork changes.'],
  ['What is the supplier responsible for?', 'The supplier should confirm feasibility, assumptions, production controls, evidence, changes, exceptions, and delivery commitments in a usable form.'],
  ['What is the buyer responsible for?', 'The buyer should provide accurate market, product, claim, barcode, destination, forecast, approval, and logistics information.'],
  ['How should quality criteria be written?', 'Use defined methods, tolerances, sample plans, defect classes, acceptance limits, and release responsibility.'],
  ['Can the same specification serve every channel?', 'Not always. Retail, institutional, marketplace, wholesale, and distributor channels can require different packs, claims, evidence, and service levels.'],
  ['What is the best next step with JCZCARE?', 'Share the target market, product benchmark, performance needs, packaging direction, estimated quantity, and delivery destination for review.'],
  ['How often should supplier performance be reviewed?', 'Review each first order and then use a risk-based cadence covering quality, delivery, communication, change control, and corrective actions.'],
  ['Should the lowest quotation be selected?', 'Only when it also meets the approved specification, evidence, delivery, service, and risk requirements.'],
  ['How are exceptions approved?', 'The responsible buyer and supplier representatives should document the exception, effect, containment, disposition, and follow-up action.'],
  ['What supports a stable repeat order?', 'A frozen specification, retained reference, controlled artwork, forecast visibility, material continuity, and documented lessons support repeatability.'],
  ['Can JCZCARE support private-label development?', 'JCZCARE can review product, specification, packaging, quantity, and timing requirements for an OEM or private-label project.'],
  ['Does this guide replace legal or regulatory advice?', 'No. Destination-market labeling, claims, certification, import, and compliance obligations should be reviewed by qualified specialists.'],
  ['How should confidential files be controlled?', 'Use named versions, restricted access, clear approval ownership, and a written record of which files are released for production.'],
  ['What should be discussed after delivery?', 'Review arrival condition, quantity, defects, customer feedback, sales, inventory, and improvement actions before the next order.'],
  ['How should corrective action be evaluated?', 'Confirm root cause, containment, corrective action, responsible owner, completion evidence, and effectiveness on a later batch.'],
  ['Where should a buyer start?', 'Start with the highest-risk unresolved decision, gather comparable evidence, and do not release an order until ownership and acceptance are clear.'],
];

export const buildEcosystemFaqs = (spec, count = 8) => faqFrames.slice(0, count).map(([question, answer]) => [
  question,
  `${answer} For ${spec.title.toLowerCase()}, this should specifically address ${spec.decision}.`,
]);

export const buildEcosystemChecklist = (spec, count = 8) => [
  `Confirm the decision scope for ${spec.title.toLowerCase()} and name the buyer-side owner.`,
  `Document ${spec.decision} in a versioned requirement rather than an informal message.`,
  `Request ${spec.evidence} from every shortlisted supplier on the same basis.`,
  `Evaluate the specific risk that ${spec.risk}.`,
  `Record how product, packaging, quality, logistics, and commercial decisions affect one another.`,
  `Set a sample purpose, approval method, approver, and retained production reference.`,
  `Confirm MOQ, lead-time, Incoterm, inspection, payment, and change-control assumptions in writing.`,
  `Approve ${spec.outcome} before releasing the relevant order or artwork.`,
  `Review arrival evidence and create a documented action list before the next production run.`,
  `Link the final decision to relevant product, factory, customization, advantages, and contact resources.`,
].slice(0, count);

export const ecosystemWordCount = (page) => [
  page.h1 || page.title,
  page.intro,
  ...(page.sections || []).flatMap((section) => [section.heading, ...(section.paragraphs || []), ...(section.comparisonRows || []).flat()]),
  ...(page.faqs || []).flat(),
  ...(page.checklist || []),
].filter(Boolean).join(' ').trim().split(/\s+/).filter(Boolean).length;
