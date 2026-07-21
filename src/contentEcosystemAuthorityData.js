import { blogArticles } from './blogData.js';
import {
  buildEcosystemFaqs,
  buildEcosystemSections,
  ecosystemCluster,
  ecosystemUpdatedAt,
} from './contentEcosystemUtils.js';

const reportReferences = [
  {
    label: 'FEDIAF Facts and Figures',
    url: 'https://europeanpetfood.org/about/statistics/',
    note: 'European pet population and market context published by FEDIAF for evidence-based category planning.',
  },
  {
    label: 'ISO 9001 Quality Management Systems',
    url: 'https://www.iso.org/standard/62085.html',
    note: 'Official ISO information on quality-management system requirements and continual improvement.',
  },
  {
    label: 'ICC Incoterms Rules',
    url: 'https://iccwbo.org/business-solutions/incoterms-rules/',
    note: 'Official ICC guidance for allocating delivery, cost, clearance, and risk responsibilities in trade.',
  },
  {
    label: 'GS1 Barcode Standards',
    url: 'https://www.gs1.org/standards/barcodes',
    note: 'Official standards information for product identification and supply-chain barcode use.',
  },
  {
    label: 'US EPA Recycling and Composting FAQ',
    url: 'https://www.epa.gov/trash-free-waters/frequently-asked-questions-about-plastic-recycling-and-composting',
    note: 'Government guidance that distinguishes common plastics and environmental claim terminology.',
  },
];

const buyerRows = [
  ['choose-oem-pet-pad-manufacturer', 'How to Choose an OEM Pet Pad Manufacturer', 'oem-manufacturing', 'qualifying product fit, manufacturing control, evidence, communication, and commercial alignment', 'the buyer selects from price and presentation without verifying repeatable capability'],
  ['oem-pet-product-sourcing-process', 'Complete OEM Pet Product Sourcing Process', 'oem-manufacturing', 'sequencing brief, supplier review, sampling, artwork, production, inspection, and shipment', 'teams release commitments before dependencies and owners are clear'],
  ['odm-pet-product-development-guide', 'ODM Pet Product Development Guide', 'customization', 'deciding how much factory platform, buyer adaptation, testing, and ownership the project needs', 'ODM is treated as instant customization without defining design responsibility'],
  ['oem-vs-odm-buyer-decision', 'OEM vs ODM: A Buyer Decision Guide', 'oem-manufacturing', 'matching control, speed, differentiation, investment, and internal capability to the right model', 'the development model does not match the buyer team or launch objective'],
  ['private-label-pet-products-launch', 'Private-Label Pet Products Launch Guide', 'private-label', 'aligning brand position, product, packaging, data, evidence, and repeat-order planning', 'artwork starts before the product and claims are technically stable'],
  ['pet-product-supplier-evaluation', 'Pet Product Supplier Evaluation Guide', 'import-guide', 'using weighted evidence for capability, quality, delivery, service, and total value', 'supplier selection depends on subjective impressions or non-comparable quotations'],
  ['pet-pad-factory-audit-checklist', 'Pet Pad Factory Audit Checklist', 'factory-audit', 'verifying process fit, equipment, materials, quality, warehouse, traceability, and export workflow', 'a polished visit replaces evidence of actual operational control'],
  ['remote-factory-audit-guide', 'Remote Factory Audit Guide for Pet Product Buyers', 'factory-audit', 'combining live video, documents, process tracing, interviews, and follow-up evidence', 'a remote review becomes a pre-recorded factory tour with no verification'],
  ['pet-product-moq-guide', 'Pet Product MOQ Guide', 'import-guide', 'understanding material, printing, setup, pack-out, carton, and SKU drivers of MOQ', 'the buyer negotiates one number without addressing the constraints behind it'],
  ['pet-pad-moq-negotiation', 'How to Negotiate Pet Pad MOQ', 'import-guide', 'reducing launch risk through shared materials, neutral packs, SKU staging, and forecast commitments', 'an artificially low MOQ creates cost, leftovers, or unstable supply later'],
  ['oem-sampling-guide', 'OEM Sampling Guide for Pet Products', 'oem-manufacturing', 'defining sample purpose, version, method, approval, and mass-production reference', 'samples are approved visually without a controlled specification'],
  ['pet-pad-sample-scorecard', 'Pet Pad Sample Evaluation Scorecard', 'quality-control', 'scoring dimensions, feel, intake, absorbency, rewet, leakage, folding, and packaging fit', 'teams compare samples inconsistently or forget which version was approved'],
  ['oem-lead-time-guide', 'OEM Pet Product Lead Time Guide', 'shipping', 'planning development, artwork, materials, production, inspection, booking, and transit', 'a single quoted lead time hides buyer approvals and external dependencies'],
  ['production-schedule-buyer-guide', 'How Buyers Should Review a Production Schedule', 'oem-manufacturing', 'checking milestones, capacity allocation, materials, changeovers, inspection, and dispatch', 'a schedule lists only a completion date and cannot explain delay exposure'],
  ['pet-product-packaging-guide', 'Pet Product Packaging Buyer Guide', 'packaging', 'aligning product fit, usability, claims, barcodes, cartons, and channel requirements', 'packaging is designed independently from the product and logistics plan'],
  ['private-label-artwork-approval', 'Private-Label Artwork Approval Guide', 'private-label', 'controlling copy, claims, language, barcode, dieline, color, proofs, and version release', 'an outdated or unverified artwork file reaches production'],
  ['pet-product-carton-guide', 'Export Carton Guide for Pet Products', 'packaging', 'balancing protection, dimensions, stack strength, marks, handling, and container efficiency', 'carton cost is reduced without considering transport and receiving damage'],
  ['pet-product-barcode-guide', 'Barcode Guide for Private-Label Pet Products', 'private-label', 'controlling GTIN ownership, symbol quality, placement, pack hierarchy, and master data', 'incorrect or untested barcodes cause retail and warehouse failures'],
  ['pet-product-quality-plan', 'How to Write a Pet Product Quality Plan', 'quality-control', 'defining incoming, in-process, finished-product, packaging, and shipment controls', 'quality expectations remain broad and inspectors use different criteria'],
  ['pre-shipment-inspection-guide', 'Pre-Shipment Inspection Guide for Pet Products', 'quality-control', 'setting sample plan, defect classes, tests, packaging checks, and disposition authority', 'inspection occurs without an agreed standard or enough time for correction'],
  ['supplier-corrective-action-guide', 'Supplier Corrective Action Guide for OEM Buyers', 'quality-control', 'reviewing containment, root cause, action, evidence, and effectiveness', 'temporary correction is accepted as a permanent solution'],
  ['pet-pad-specification-guide', 'How to Write a Pet Pad Specification', 'pet-training-pads', 'defining size, weight, materials, performance, tolerances, folding, packing, and tests', 'the purchase order uses a product name instead of a measurable specification'],
  ['adult-underpad-procurement-guide', 'Adult Underpad Procurement Guide', 'adult-underpads', 'matching care setting, dimensions, absorbency, rewet, backing, pack, and evidence', 'consumer-style claims replace institutional procurement requirements'],
  ['dog-poop-bag-procurement-guide', 'Dog Poop Bag Procurement Guide', 'dog-poop-bags', 'defining film, gauge, size, seal, perforation, count, core, print, and claims', 'roll and material details remain unclear until after production'],
  ['sap-buyer-specification-guide', 'SAP Specification Guide for Absorbent Products', 'sap-technology', 'linking polymer type, dosage, distribution, test method, and core balance', 'buyers treat SAP quantity as a complete guarantee of performance'],
  ['pe-film-buyer-guide', 'PE Film Buyer Guide for Pet Pads and Underpads', 'pe-film', 'balancing thickness, leak resistance, strength, noise, feel, print, and processing', 'average film thickness hides pinholes, weak sealing, or handling problems'],
  ['nonwoven-material-buyer-guide', 'Nonwoven Material Buyer Guide for Absorbent Products', 'materials', 'connecting basis weight, construction, feel, intake, integrity, and converting fit', 'one material number is used as a stand-alone quality claim'],
  ['fluff-pulp-buyer-guide', 'Fluff Pulp Buyer Guide for Absorbent Cores', 'materials', 'evaluating fiberization, distribution, core stability, absorption, supply, and cost', 'pulp terminology is accepted without finished-product evidence'],
  ['pet-product-incoterms-guide', 'Incoterms Guide for Pet Product Buyers', 'shipping', 'assigning delivery, risk, cost, clearance, insurance, and documentation responsibilities', 'a trade term is selected without a named place or operational understanding'],
  ['fob-cif-pet-products-guide', 'FOB vs CIF Guide for Pet Product Imports', 'shipping', 'comparing freight control, insurance, visibility, risk transfer, and landed cost', 'buyers compare freight-inclusive and freight-exclusive quotations as equivalent'],
  ['container-loading-buyer-guide', 'Container Loading Guide for Pet Products', 'shipping', 'planning carton dimensions, loading pattern, protection, sequence, count, and evidence', 'container utilization is optimized at the expense of product or carton condition'],
  ['pet-product-import-document-guide', 'Pet Product Import Document Guide', 'import-guide', 'reconciling commercial, packing, transport, origin, and buyer-required documents', 'document discrepancies appear after departure and delay clearance or payment'],
  ['landed-cost-pet-products-guide', 'Landed Cost Guide for Imported Pet Products', 'import-guide', 'combining product, packaging, inspection, freight, duty, inventory, finance, and risk', 'supplier price is treated as the total procurement cost'],
  ['pet-product-cost-reduction-guide', 'Pet Product Cost Reduction Guide', 'import-guide', 'removing non-value cost while protecting performance, compliance, usability, and supply', 'cost reduction quietly changes the product promise or increases failure cost'],
  ['supplier-payment-terms-guide', 'Supplier Payment Terms Guide for OEM Orders', 'import-guide', 'aligning payment milestones with evidence, production progress, documents, and risk', 'payment timing gives neither side clear protection or project discipline'],
  ['pet-product-forecast-guide', 'Forecasting Guide for Imported Pet Products', 'industry-insights', 'combining demand, promotions, lead time, variability, service level, and inventory', 'forecasts ignore development and transit stages or remain disconnected from suppliers'],
  ['multi-supplier-strategy-guide', 'Multi-Supplier Strategy Guide for Pet Product Brands', 'import-guide', 'balancing resilience, consistency, qualification cost, volume allocation, and change control', 'a second supplier is added without specification transfer or equivalence testing'],
  ['amazon-private-label-guide', 'Amazon Private-Label Pet Product Guide', 'private-label', 'aligning product, packaging, data, compliance review, inventory, and marketplace economics', 'listing speed is prioritized over evidence, differentiation, and supply stability'],
  ['retail-chain-pet-product-guide', 'Retail Chain Pet Product Sourcing Guide', 'industry-insights', 'meeting assortment, data, packaging, service, audit, and replenishment expectations', 'a product passes sample review but fails retailer operational requirements'],
  ['first-order-to-repeat-order-guide', 'From First Order to Stable Repeat Orders', 'oem-manufacturing', 'using arrival results, complaints, inventory, sales, and corrective actions to improve supply', 'the first shipment closes without a structured post-order review'],
];

const comparisonRows = [
  ['oem-platform-vs-custom-development', 'OEM Platform vs Fully Custom Product Development', 'oem-manufacturing', 'choosing between an established product platform and buyer-controlled development', 'development workload and differentiation are misunderstood'],
  ['single-supplier-vs-dual-sourcing', 'Single Supplier vs Dual Sourcing for Pet Products', 'import-guide', 'balancing consistency, resilience, leverage, qualification cost, and forecast allocation', 'a backup supplier is assumed equivalent without transfer controls'],
  ['fcl-vs-lcl-pet-products', 'FCL vs LCL Shipping for Pet Products', 'shipping', 'comparing freight, handling, damage, inventory, speed, and commercial flexibility', 'the lowest freight quote hides total handling and risk'],
  ['printed-bag-vs-neutral-packaging', 'Printed Bags vs Neutral Packaging for Market Testing', 'packaging', 'balancing brand presentation, MOQ, speed, flexibility, and leftover inventory', 'custom print is committed before demand and pack fit are proven'],
  ['bag-vs-box-pet-pad-packaging', 'Bag vs Box Packaging for Pet Pads', 'packaging', 'comparing protection, shelf impact, cost, cube, usability, and retail requirements', 'packaging format is chosen from appearance only'],
  ['standard-vs-custom-pet-pad-size', 'Standard vs Custom Pet Pad Sizes', 'customization', 'balancing speed, material use, differentiation, channel fit, and MOQ', 'a custom size adds complexity without a validated use case'],
  ['high-sap-vs-balanced-core', 'High-SAP vs Balanced Absorbent Core Design', 'sap-technology', 'comparing polymer emphasis with balanced liquid intake, distribution, retention, and structure', 'SAP quantity is treated as the only performance variable'],
  ['thin-vs-thick-pe-backing', 'Thin vs Thick PE Backing Film', 'pe-film', 'comparing leak protection, strength, noise, feel, cost, and converting behavior', 'nominal thickness replaces finished-product leak evidence'],
  ['spunbond-vs-other-nonwoven', 'Spunbond vs Alternative Nonwoven Topsheets', 'materials', 'comparing feel, intake, strength, lint, appearance, cost, and processing fit', 'material names are compared without construction and performance context'],
  ['virgin-vs-recycled-packaging', 'Virgin vs Recycled Packaging Materials', 'packaging', 'balancing performance, appearance, supply, evidence, claims, and cost', 'environmental language is used without fit-for-purpose verification'],
  ['domestic-vs-imported-pet-products', 'Domestic vs Imported Pet Product Sourcing', 'import-guide', 'comparing lead time, control, scale, cost, customization, inventory, and supply risk', 'country of origin is used as a substitute for supplier evidence'],
  ['direct-factory-vs-trading-company', 'Direct Factory vs Trading Company Sourcing', 'factory-audit', 'comparing process access, assortment, communication, consolidation, accountability, and evidence', 'the business model is assumed instead of verified'],
  ['pre-shipment-vs-arrival-inspection', 'Pre-Shipment vs Arrival Inspection', 'quality-control', 'using both inspection stages for different risks and evidence', 'one inspection stage is expected to detect every problem'],
  ['visual-inspection-vs-performance-testing', 'Visual Inspection vs Performance Testing', 'quality-control', 'separating appearance, construction, function, method, and acceptance decisions', 'visual conformity is treated as proof of absorbent performance'],
  ['pilot-order-vs-full-launch', 'Pilot Order vs Full Commercial Launch', 'oem-manufacturing', 'comparing learning value, cost, speed, inventory, and scale-up risk', 'full volume is released before production and packaging assumptions are proven'],
  ['one-sku-vs-multi-sku-launch', 'One-SKU vs Multi-SKU Private-Label Launch', 'private-label', 'balancing assortment, shelf coverage, complexity, cash, forecast, and shared inputs', 'range breadth is prioritized over evidence and working capital'],
  ['retail-pack-vs-bulk-pack', 'Retail Pack vs Bulk Pack for Pet Products', 'packaging', 'comparing channel, handling, protection, branding, cost, and replenishment', 'the pack format does not match the customer or logistics route'],
  ['air-freight-vs-ocean-freight-samples', 'Air Freight vs Ocean Freight for Launch Orders', 'shipping', 'comparing speed, cost, volume, inventory, handling, and launch risk', 'speed is purchased without calculating margin and stock impact'],
  ['fixed-forecast-vs-rolling-forecast', 'Fixed vs Rolling Forecasts for OEM Supply', 'industry-insights', 'comparing planning stability, responsiveness, material commitment, and communication', 'forecast updates arrive too late to influence supply decisions'],
  ['aql-inspection-vs-100-percent-check', 'AQL Sampling vs 100% Inspection', 'quality-control', 'matching inspection intensity to defect risk, process control, cost, and practicality', 'inspection quantity is chosen without a risk model'],
  ['manufacturer-standard-vs-buyer-spec', 'Manufacturer Standard vs Buyer-Owned Specification', 'oem-manufacturing', 'balancing speed, flexibility, ownership, differentiation, and repeat-order control', 'neither party knows which requirement is authoritative'],
  ['exclusive-formula-vs-open-platform', 'Exclusive Formula vs Open Product Platform', 'customization', 'comparing differentiation, development, control, investment, and continuity', 'exclusivity is discussed without defining scope or ownership'],
  ['annual-contract-vs-spot-buying', 'Annual Contract vs Spot Buying for Pet Products', 'import-guide', 'balancing price, flexibility, capacity, inventory, forecast, and relationship governance', 'commercial commitment is made without volume and review mechanisms'],
];

const caseRows = [
  ['european-private-label-pad-launch', 'European Private-Label Pet Pad Launch Scenario', 'private-label', 'coordinating a multi-language pack, controlled specification, and phased market launch', 'late claim and artwork changes threaten the launch'],
  ['us-distributor-underpad-program', 'US Distributor Adult Underpad Program Scenario', 'adult-underpads', 'building a distributor-ready underpad program with pack data and repeat-order controls', 'channel requirements are not translated into one supplier brief'],
  ['pet-pad-container-utilization-case', 'Pet Pad Container Utilization Improvement Scenario', 'shipping', 'reducing unused cube through fold, pack, carton, and loading analysis', 'cost pressure leads to carton changes without product-protection review'],
  ['private-label-packaging-recovery-case', 'Private-Label Packaging Error Recovery Scenario', 'packaging', 'containing an artwork issue and rebuilding version approval before print', 'multiple artwork versions create uncertainty about the released file'],
  ['pet-pad-leakage-improvement-case', 'Pet Pad Leakage Improvement Scenario', 'quality-control', 'moving from complaint symptoms to method, root cause, trial, and verification', 'a material change is made before the actual leakage path is confirmed'],
  ['supplier-audit-remediation-case', 'OEM Supplier Audit Remediation Scenario', 'factory-audit', 'turning audit gaps into owners, dates, evidence, and effectiveness review', 'findings are closed on paper without operational verification'],
  ['multi-sku-launch-recovery-case', 'Multi-SKU Launch Schedule Recovery Scenario', 'oem-manufacturing', 're-sequencing shared materials, artwork, sampling, and production gates', 'one delayed SKU blocks every item in the launch'],
  ['poop-bag-roll-count-case', 'Dog Poop Bag Roll Count Improvement Scenario', 'dog-poop-bags', 'controlling counter settings, winding, pack checks, and retained rolls', 'short rolls create retailer and consumer complaints'],
  ['adult-underpad-rewet-case', 'Adult Underpad Rewet Reduction Scenario', 'adult-underpads', 'reviewing core balance, intake, pressure method, and approved limits', 'capacity claims hide poor under-load dryness'],
  ['pet-product-landed-cost-case', 'Pet Product Landed Cost Reduction Scenario', 'import-guide', 'normalizing specification and redesigning pack, carton, and shipment economics', 'unit price savings increase freight or inventory cost'],
  ['retailer-barcode-case', 'Retailer Barcode Approval Scenario', 'private-label', 'reconciling GTIN, artwork, master data, print quality, and scan verification', 'an artwork-correct barcode fails operational scanning'],
  ['pe-film-pinhole-case', 'PE Film Pinhole Corrective Action Scenario', 'pe-film', 'tracing handling, film, tension, sealing, and leak-test evidence', 'average thickness data does not explain isolated leaks'],
  ['sap-dosing-variation-case', 'SAP Dosing Variation Control Scenario', 'sap-technology', 'using sample location, core weight, dosing records, and alarm response', 'average polymer use hides short-duration process drift'],
  ['warehouse-mixed-carton-case', 'Warehouse Mixed-Carton Prevention Scenario', 'factory-audit', 'improving status, location, identification, allocation, and dispatch checks', 'similar SKUs are mixed during order preparation'],
];

const factoryRows = [
  ['factory-material-receiving', 'Material Receiving and Incoming Control', 'factory-audit', 'connecting purchase, identity, inspection status, storage, and production issue', 'unverified material reaches a production order'],
  ['factory-line-changeover', 'Production Line Changeover Control', 'oem-manufacturing', 'clearing prior materials, setting the new SKU, checking first-off output, and releasing production', 'components or settings from the prior SKU affect the next order'],
  ['factory-preventive-maintenance', 'Preventive Maintenance for Absorbent Product Lines', 'factory-audit', 'planning critical equipment care, completion evidence, spares, and escalation', 'maintenance gaps create variation or missed delivery'],
  ['factory-in-process-inspection', 'In-Process Inspection on Pet Pad Lines', 'quality-control', 'checking dimensions, weight, alignment, seals, appearance, count, and reaction limits', 'finished inspection discovers issues after too much product is made'],
  ['factory-traceability-system', 'Order and Batch Traceability in the Factory', 'factory-audit', 'linking materials, production, inspection, packing, warehouse, and shipment records', 'records cannot reconstruct the history of a buyer order'],
  ['factory-nonconforming-product', 'Nonconforming Product Control', 'quality-control', 'identifying, segregating, reviewing, disposing, and learning from nonconforming output', 'held or rejected goods are mixed with released stock'],
  ['factory-pack-count-control', 'Pack Count and Carton Count Control', 'packaging', 'controlling automated or manual counts, label claims, carton quantities, and reconciliation', 'quantity errors pass through because checks focus only on appearance'],
  ['factory-export-document-control', 'Export Document Control Workflow', 'shipping', 'reconciling order, product, carton, invoice, packing, transport, and buyer data', 'document versions differ from the physical shipment'],
  ['factory-customer-sample-room', 'Approved Sample and Reference Control', 'oem-manufacturing', 'identifying, storing, issuing, replacing, and comparing buyer-approved references', 'production teams use an outdated or untraceable sample'],
  ['factory-continuous-improvement', 'Continuous Improvement in OEM Manufacturing', 'industry-insights', 'using defects, downtime, complaints, delivery, and project reviews to prioritize improvements', 'improvement activity is disconnected from buyer outcomes'],
];

const materialRows = [
  ['nonwoven-topsheet', 'Nonwoven Topsheets for Pet Pads and Underpads', 'materials', 'evaluating construction, basis weight, softness, intake, integrity, and converting fit', 'material terminology is used without finished-product context'],
  ['tissue-distribution-layer', 'Tissue Distribution Layers in Absorbent Products', 'materials', 'understanding liquid guidance, core support, integrity, weight, and process compatibility', 'tissue is specified by name but not by function or outcome'],
  ['fluff-pulp-absorbent-core', 'Fluff Pulp in Absorbent Cores', 'materials', 'balancing fiberization, liquid movement, structure, SAP interaction, thickness, and supply', 'pulp source is changed without finished-product comparison'],
  ['absorbent-paper-core', 'Absorbent Paper Core Technology', 'materials', 'evaluating sheet structure, consistency, converting, performance, thickness, and cost', 'a paper core is assumed equivalent to every pulp-and-SAP construction'],
  ['super-absorbent-polymer', 'Super Absorbent Polymer for Pet and Adult Pads', 'sap-technology', 'linking polymer properties, dosage, distribution, intake, retention, and rewet', 'headline capacity claims are accepted without a relevant test method'],
  ['pe-backing-film', 'PE Backing Film for Leak Protection', 'pe-film', 'controlling thickness, pinholes, strength, flexibility, noise, color, and sealing', 'nominal gauge replaces leak and handling evidence'],
  ['hot-melt-adhesive', 'Hot-Melt Adhesives in Pad Construction', 'materials', 'balancing bond strength, application, compatibility, odor, stiffness, and processing', 'adhesive variation causes delamination or unwanted stiffness'],
  ['embossing-technology', 'Embossing Technology for Absorbent Pads', 'materials', 'connecting pattern, liquid guidance, surface stability, appearance, and line feasibility', 'decorative preference undermines intake or structure'],
  ['acquisition-distribution-layer', 'Acquisition and Distribution Layers', 'materials', 'improving fast intake and liquid movement before storage in the absorbent core', 'capacity is increased without solving slow surface intake'],
  ['charcoal-odor-control-layer', 'Charcoal and Odor-Control Layers', 'materials', 'evaluating material placement, odor-control claims, appearance, dust, and core performance', 'odor language is used without a defined test or product context'],
  ['adhesive-backing-strips', 'Adhesive Backing Strips for Pet Pads', 'materials', 'balancing hold, removal, residue, placement, liner, and packaging behavior', 'adhesive strength is increased without evaluating floor contact and removal'],
  ['printed-pe-film', 'Printed PE Film for Private-Label Pads', 'pe-film', 'controlling artwork, registration, ink, strength, sealing, MOQ, and brand consistency', 'printing affects film performance or creates unstable presentation'],
  ['paper-and-plastic-roll-cores', 'Paper and Plastic Roll Cores for Dog Waste Bags', 'dog-poop-bags', 'matching diameter, width, strength, dispenser fit, winding, and claim requirements', 'the roll core is selected without testing the intended dispenser'],
  ['color-masterbatch-film', 'Color Masterbatch for Pet Product Films', 'materials', 'controlling color target, dispersion, consistency, processing, documentation, and claims', 'color variation or material interaction appears after scale-up'],
  ['corrugated-export-cartons', 'Corrugated Export Cartons for Pet Products', 'packaging', 'selecting board, dimensions, closure, print, stack performance, and container use', 'carton savings create compression or transit damage'],
];

const faqRows = [
  ['oem-manufacturing-faq', 'OEM Manufacturing FAQ', 'oem-manufacturing', 'answering ownership, brief, sample, production, change, and repeat-order questions', 'buyers begin projects without a shared manufacturing model'],
  ['pet-training-pad-faq', 'Pet Training Pad Buyer FAQ', 'pet-training-pads', 'answering structure, absorbency, rewet, leakage, size, fold, and packaging questions', 'performance terms are used without measurable definitions'],
  ['adult-underpad-faq', 'Adult Disposable Underpad FAQ', 'adult-underpads', 'answering care setting, material, absorbency, backing, pack, and sourcing questions', 'institutional needs are reduced to consumer-style claims'],
  ['dog-poop-bag-faq', 'Dog Poop Bag OEM FAQ', 'dog-poop-bags', 'answering film, gauge, size, seal, perforation, roll, core, print, and claim questions', 'critical roll and film details remain unconfirmed'],
  ['private-label-faq', 'Private-Label Pet Product FAQ', 'private-label', 'answering brand, ownership, artwork, barcode, pack, evidence, and launch questions', 'private label is treated as logo placement only'],
  ['customization-faq', 'Pet Product Customization FAQ', 'customization', 'answering size, weight, structure, material, performance, packaging, and MOQ questions', 'custom features add cost without a defined market value'],
  ['quality-control-faq', 'Pet Product Quality Control FAQ', 'quality-control', 'answering methods, tolerances, sampling, defects, testing, release, and corrective action', 'quality language remains general and unenforceable'],
  ['factory-audit-faq', 'Pet Product Factory Audit FAQ', 'factory-audit', 'answering process, equipment, materials, warehouse, records, capacity, and continuity questions', 'audit presentation replaces operational evidence'],
  ['packaging-faq', 'Private-Label Packaging FAQ', 'packaging', 'answering dieline, print, claims, barcode, bag, box, carton, and approval questions', 'packaging is finalized before product and data are stable'],
  ['shipping-faq', 'Pet Product Shipping and Import FAQ', 'shipping', 'answering freight, Incoterms, cartons, loading, documents, insurance, and arrival questions', 'responsibilities and costs remain unclear at shipment'],
  ['materials-faq', 'Absorbent Product Materials FAQ', 'materials', 'answering nonwoven, tissue, pulp, paper, adhesive, film, and substitution questions', 'material names are mistaken for complete quality evidence'],
  ['sap-technology-faq', 'SAP Technology FAQ for Buyers', 'sap-technology', 'answering polymer type, dosage, distribution, gel blocking, retention, and testing questions', 'SAP quantity is treated as the only absorbency variable'],
  ['pe-film-faq', 'PE Film and Leak Protection FAQ', 'pe-film', 'answering thickness, pinholes, strength, noise, sealing, print, and testing questions', 'average thickness hides finished-product leak risk'],
  ['import-procurement-faq', 'Pet Product Import and Procurement FAQ', 'import-guide', 'answering supplier, quote, MOQ, lead time, payment, inspection, cost, and risk questions', 'commercial decisions are made on non-comparable information'],
];

const reportRows = [
  ['global-pet-pad-market-procurement-report', 'Global Pet Pad Market Procurement Report', 'industry-insights', 'interpreting demand, channel, specification, supply, and buyer implications without inventing forecasts', 'market headlines are converted into purchasing decisions without source and scenario review'],
  ['private-label-pet-products-trends-report', 'Private-Label Pet Products Trends Report', 'private-label', 'reviewing differentiation, retailer expectations, packaging, evidence, and portfolio implications', 'brands copy visible features without a defensible commercial position'],
  ['absorbent-materials-supply-report', 'Absorbent Materials Supply and Risk Report', 'materials', 'mapping nonwoven, tissue, pulp, paper, SAP, film, adhesive, and packaging dependencies', 'raw-material risk remains invisible until an order is delayed or changed'],
  ['pet-product-retail-readiness-report', 'Pet Product Retail Readiness Report', 'industry-insights', 'analyzing data, packaging, service, supply, quality, and retailer operating requirements', 'a product is commercially launched before operational readiness is proven'],
  ['oem-manufacturing-risk-report', 'OEM Pet Product Manufacturing Risk Report', 'oem-manufacturing', 'prioritizing specification, material, process, packaging, quality, schedule, and governance risks', 'risk reviews focus on price and ignore controllability'],
  ['pet-product-packaging-trends-report', 'Pet Product Packaging Trends and Buyer Implications', 'packaging', 'reviewing pack efficiency, usability, claims, data, materials, and logistics trade-offs', 'packaging trends are adopted without product or channel fit'],
  ['pet-product-logistics-resilience-report', 'Pet Product Logistics and Resilience Report', 'shipping', 'assessing cartons, routes, modes, inventory, documents, continuity, and receiving controls', 'resilience is reduced to holding more stock'],
  ['pet-care-sustainability-claims-report', 'Pet Care Sustainability Claims Risk Report', 'industry-insights', 'reviewing material evidence, qualified language, disposal context, packaging, and buyer governance', 'broad environmental claims outrun evidence and market-specific review'],
  ['pet-product-quality-benchmark-report', 'Pet Product Quality Benchmarking Report', 'quality-control', 'comparing methods, defects, evidence, supplier systems, and buyer acceptance practices', 'benchmarks use inconsistent products or test conditions'],
  ['pet-product-procurement-outlook-report', 'Pet Product Procurement Outlook', 'import-guide', 'connecting cost, capacity, materials, inventory, private label, quality, and supplier strategy', 'annual planning relies on last price rather than a full risk and demand review'],
];

const resourceRows = [
  ['oem-project-brief-template', 'OEM Project Brief Template', 'oem-manufacturing', 'structuring market, product, specification, packaging, quantity, timing, and ownership inputs', 'an incomplete inquiry produces non-comparable supplier responses'],
  ['pet-pad-specification-template', 'Pet Pad Specification Sheet', 'pet-training-pads', 'recording construction, dimensions, weight, performance, fold, pack, and acceptance requirements', 'product approval depends on a photo or product name'],
  ['adult-underpad-specification-template', 'Adult Underpad Specification Sheet', 'adult-underpads', 'recording care setting, dimensions, surface, core, backing, performance, packing, and evidence', 'institutional requirements are not translated into measurable product data'],
  ['dog-poop-bag-specification-template', 'Dog Poop Bag Specification Sheet', 'dog-poop-bags', 'recording material, gauge, dimensions, seal, perforation, count, roll, core, print, and pack', 'quotations use different bag and roll assumptions'],
  ['supplier-audit-checklist-download', 'Pet Product Supplier Audit Checklist', 'factory-audit', 'organizing business, process, equipment, materials, quality, warehouse, traceability, and continuity review', 'important audit evidence is missed or not assigned follow-up ownership'],
  ['sample-evaluation-scorecard', 'OEM Sample Evaluation Scorecard', 'quality-control', 'scoring appearance, dimensions, materials, performance, packaging, risk, and approval status', 'sample decisions are subjective and cannot be reconstructed'],
  ['packaging-artwork-checklist', 'Packaging Artwork Approval Checklist', 'packaging', 'checking dieline, copy, claims, language, barcode, color, version, and production release', 'an incorrect file is approved or printed'],
  ['landed-cost-calculator-guide', 'Landed Cost Calculator Guide', 'import-guide', 'organizing product, packaging, inspection, freight, duty, finance, inventory, and risk assumptions', 'unit cost is mistaken for total procurement value'],
  ['pre-shipment-inspection-checklist', 'Pre-Shipment Inspection Checklist', 'quality-control', 'preparing sample plan, defects, tests, pack checks, documents, and disposition rules', 'inspection starts without a complete brief'],
  ['container-loading-planner', 'Container Loading Planning Sheet', 'shipping', 'organizing carton dimensions, quantities, sequence, protection, marks, photos, and reconciliation', 'loading decisions are improvised at dispatch'],
];

const kindConfig = {
  'buyer-guide': { prefix: '/buyer-guides', hub: ['Buyer Guide Center', '/buyer-guides'], kicker: 'Professional Buyer Guide', sections: 8, faqs: 10, schemaType: 'Article' },
  comparison: { prefix: '/comparisons', hub: ['Comparisons', '/comparisons'], kicker: 'B2B Decision Comparison', sections: 8, faqs: 8, schemaType: 'Article' },
  'case-study': { prefix: '/case-studies', hub: ['Case Studies', '/case-studies'], kicker: 'Representative B2B Scenario', sections: 8, faqs: 8, schemaType: 'Article' },
  'factory-detail': { prefix: '/factory', hub: ['Factory', '/factory'], kicker: 'Factory Knowledge', sections: 8, faqs: 8, schemaType: 'Article' },
  'material-detail': { prefix: '/materials', hub: ['Materials', '/materials'], kicker: 'Material Knowledge', sections: 8, faqs: 8, schemaType: 'Article' },
  'faq-landing': { prefix: '/faq', hub: ['FAQ', '/faq'], kicker: 'Buyer FAQ', sections: 4, faqs: 24, schemaType: 'FAQPage' },
  report: { prefix: '/reports', hub: ['Industry Reports', '/reports'], kicker: 'Industry Report', sections: 20, faqs: 10, schemaType: 'Report' },
  resource: { prefix: '/resources', hub: ['Resource Center', '/resources'], kicker: 'Buyer Resource', sections: 7, faqs: 8, schemaType: 'Article' },
};

const buildPages = (rows, kind) => {
  const config = kindConfig[kind];
  return rows.map(([slug, title, clusterSlug, decision, risk], index) => {
    const cluster = ecosystemCluster(clusterSlug);
    const spec = {
      slug,
      title,
      clusterSlug,
      decision,
      risk,
      evidence: cluster.evidence,
      outcome: `a documented ${title.toLowerCase()} decision that can be reviewed before order release`,
    };
    const sections = buildEcosystemSections(spec, config.sections, 4);
    const faqs = buildEcosystemFaqs(spec, config.faqs);
    const clusterArticles = blogArticles.filter((article) => article.clusterSlug === clusterSlug);
    const rotatedClusterArticles = clusterArticles.length
      ? [...clusterArticles.slice(index % clusterArticles.length), ...clusterArticles.slice(0, index % clusterArticles.length)]
      : [];
    const selectedArticleSlugs = new Set(rotatedClusterArticles.slice(0, 6).map((article) => article.slug));
    const relevantArticles = [
      ...rotatedClusterArticles.slice(0, 6),
      ...blogArticles.filter((article) => !selectedArticleSlugs.has(article.slug)),
    ].slice(0, 6);

    return {
      kind,
      schemaType: config.schemaType,
      path: `${config.prefix}/${slug}`,
      slug,
      clusterSlug,
      title,
      seoTitle: `${title} | JCZCARE`.slice(0, 68),
      metaDescription: `${title} for B2B buyers: specifications, evidence, quality, MOQ, cost, risk controls, and practical procurement actions.`.slice(0, 175),
      kicker: config.kicker,
      h1: title,
      intro: `${title} gives professional buyers a controlled framework for ${decision}. It is designed for practical supplier decisions, not consumer-level product promotion.`,
      image: cluster.image,
      imageAlt: `${title} for professional OEM and private-label pet product buyers`,
      updatedAt: ecosystemUpdatedAt,
      sections,
      faqs,
      articles: relevantArticles,
      products: cluster.products,
      timeline: kind === 'case-study' || kind === 'factory-detail'
        ? [
            ['01', 'Scope', `Define ${decision}.`],
            ['02', 'Evidence', `Collect ${cluster.evidence}.`],
            ['03', 'Decision', `Evaluate the risk that ${risk}.`],
            ['04', 'Control', 'Assign actions, owners, dates, approvals, and effectiveness checks.'],
            ['05', 'Review', 'Use shipment, arrival, and repeat-order evidence to confirm the result.'],
          ]
        : undefined,
      specifications: ['buyer-guide', 'factory-detail', 'material-detail', 'resource'].includes(kind)
        ? [
            ['Decision scope', decision],
            ['Primary risk', risk],
            ['Evidence package', cluster.evidence],
            ['Related materials', cluster.materials],
            ['Commercial review', 'Specification, MOQ, lead time, packaging, inspection, landed cost, and change control'],
          ]
        : undefined,
      chart: kind === 'report'
        ? [['Specification clarity', 94], ['Evidence quality', 90], ['Commercial control', 86], ['Supply resilience', 82]]
        : undefined,
      references: kind === 'report' ? reportReferences : undefined,
      breadcrumbs: [['Home', '/'], config.hub, [title, `${config.prefix}/${slug}`]],
      downloadPath: kind === 'resource' || kind === 'buyer-guide'
        ? `/request-product-plan?product=${slug}`
        : undefined,
    };
  });
};

const wireSiblingCards = (pages) => pages.map((page, index) => ({
  ...page,
  cards: [...pages.slice(index + 1, index + 5), ...pages.slice(0, Math.max(0, index + 5 - pages.length))]
    .filter((candidate) => candidate.path !== page.path)
    .slice(0, 4)
    .map((candidate) => [candidate.title, candidate.path]),
}));

export const buyerGuidePages = wireSiblingCards(buildPages(buyerRows, 'buyer-guide'));
export const ecosystemComparisonPages = wireSiblingCards(buildPages(comparisonRows, 'comparison'));
export const ecosystemCaseStudyPages = wireSiblingCards(buildPages(caseRows, 'case-study'));
export const ecosystemFactoryPages = wireSiblingCards(buildPages(factoryRows, 'factory-detail'));
export const materialKnowledgePages = wireSiblingCards(buildPages(materialRows, 'material-detail'));
export const faqLandingPages = wireSiblingCards(buildPages(faqRows, 'faq-landing'));
export const industryReportPages = wireSiblingCards(buildPages(reportRows, 'report'));
export const resourcePages = wireSiblingCards(buildPages(resourceRows, 'resource'));

const authorityCollections = [
  buyerGuidePages,
  ecosystemComparisonPages,
  ecosystemCaseStudyPages,
  ecosystemFactoryPages,
  materialKnowledgePages,
  faqLandingPages,
  industryReportPages,
  resourcePages,
];

authorityCollections.flat().forEach((page) => {
  const cluster = ecosystemCluster(page.clusterSlug);
  const buyerGuide = buyerGuidePages.find((candidate) => candidate.clusterSlug === page.clusterSlug && candidate.path !== page.path);
  const comparison = ecosystemComparisonPages.find((candidate) => candidate.clusterSlug === page.clusterSlug && candidate.path !== page.path);
  const semanticLinks = [
    [`${cluster.title} Pillar Guide`, cluster.path],
    buyerGuide && [buyerGuide.title, buyerGuide.path],
    comparison && [comparison.title, comparison.path],
    ...(page.cards || []),
  ].filter(Boolean);
  const seen = new Set();
  page.cards = semanticLinks.filter(([, href]) => {
    if (seen.has(href) || href === page.path) return false;
    seen.add(href);
    return true;
  }).slice(0, 6);
});

const hubSpecs = [
  ['buyer-guide-hub', '/buyer-guides', 'Buyer Guide Center', 'Professional Pet Product Buyer Guides | JCZCARE', 'Solve supplier, OEM, MOQ, lead time, packaging, quality, shipping, import, and cost decisions with controlled B2B guides.', 'Professional Procurement Center', 'Make stronger pet product purchasing decisions', buyerGuidePages],
  ['material-hub', '/materials', 'Material Knowledge Center', 'Pet Product Material Knowledge | JCZCARE', 'Understand SAP, nonwoven, tissue, pulp, absorbent paper, PE film, adhesive, embossing, cores, and export packaging.', 'Material Knowledge Center', 'Connect every material choice to product performance', materialKnowledgePages],
  ['report-hub', '/reports', 'Pet Product Industry Reports', 'Pet Product Industry Reports for B2B Buyers | JCZCARE', 'Long-form reports on pet products, OEM manufacturing, materials, quality, packaging, retail, logistics, claims, and procurement.', 'B2B Industry Reports', 'Use market intelligence without losing procurement discipline', industryReportPages],
];

export const ecosystemHubPages = hubSpecs.map(([kind, path, title, seoTitle, metaDescription, kicker, h1, pages]) => ({
  kind,
  path,
  title,
  seoTitle,
  metaDescription,
  kicker,
  h1,
  intro: metaDescription,
  image: pages[0].image,
  imageAlt: `${title} for professional pet product sourcing teams`,
  updatedAt: ecosystemUpdatedAt,
  sections: [
    { heading: 'Built around real purchasing decisions', paragraphs: ['Each resource starts from a commercial or technical decision and shows what to define, which evidence to request, how to compare options, and which risks to control.', 'Use the guides with related product, factory, customization, quality, and contact pages to move research into a complete project brief.'] },
    { heading: 'How to use this center', paragraphs: ['Choose the page closest to the current decision, save the relevant checklist, and align product, quality, packaging, logistics, and purchasing teams before contacting suppliers.', 'These resources support professional preparation but do not replace destination-market legal, regulatory, customs, or certification advice.'] },
  ],
  cards: pages.map((page) => [page.title, page.path]),
  faqs: [
    ['Who are these resources for?', 'They are for pet brands, importers, distributors, wholesalers, retail chains, marketplace operators, and professional sourcing teams.'],
    ['Can the resources support an OEM inquiry?', 'Yes. Use them to prepare the product, specification, packaging, quantity, evidence, destination, and timeline information needed for review.'],
    ['Do the resources replace market-specific advice?', 'No. Confirm current labeling, claims, import, certification, and compliance obligations for the exact SKU and destination.'],
  ],
  products: pages[0].products,
  breadcrumbs: [['Home', '/'], [title, path]],
}));

export const ecosystemAuthorityPages = [
  ...ecosystemHubPages,
  ...buyerGuidePages,
  ...ecosystemComparisonPages,
  ...ecosystemCaseStudyPages,
  ...ecosystemFactoryPages,
  ...materialKnowledgePages,
  ...faqLandingPages,
  ...industryReportPages,
  ...resourcePages,
];

export const ecosystemAuthorityStats = {
  buyerGuides: buyerGuidePages.length,
  comparisons: ecosystemComparisonPages.length,
  caseStudies: ecosystemCaseStudyPages.length,
  factoryPages: ecosystemFactoryPages.length,
  materialPages: materialKnowledgePages.length,
  faqPages: faqLandingPages.length,
  reports: industryReportPages.length,
  resources: resourcePages.length,
};
