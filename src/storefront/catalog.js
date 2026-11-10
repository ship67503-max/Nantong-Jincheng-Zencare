const img = name => `/images/${name}`;
const slugify = value => value.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const variant = (name, image, purpose, review, slug) => ({name, slug:slug||slugify(name), image:img(image), purpose, review});

export const catalog = [
  {
    slug:'pet-training-pads', name:'Pet urine pads', short:'Pet pads', zh:'宠物尿垫', tag:'PET HYGIENE',
    image:img('oem/products/custom-disposable-pet-pads-premium.webp'),
    headline:'Little paws.\nA considered range.',
    intro:'Build a pet pad collection around the routines you serve. Choose the surface, core direction, backing and presentation for your market.',
    audience:'Pet brands · Retailers · Distributors',
    variants:[
      variant('Standard pads','products/pet-training-pads/standard-pet-urine-pad.webp','The everyday starting point with a non-woven topsheet and wood-pulp + SAP core.','Core weight, liquid intake, rewet and edge sealing.'),
      variant('Bamboo charcoal pads','oem/products/custom-charcoal-pet-pad-ai.webp','The second tissue layer is replaced by bamboo charcoal paper.','Material composition and any odor-related claim under agreed evidence.'),
      variant('Adhesive-backed pads','oem/products/custom-adhesive-pet-pad-ai.webp','A placement-stability direction for compatible floors and surfaces.','Adhesive holding, residue, removal and surface compatibility.'),
      variant('Fragrance pads','products/pet-training-pads/range/fragrance-product.webp','A scented option for your retail range, with fragrance added inside the package. The pad retains its familiar appearance; agree the scent profile separately from any odor-control requirement.','Scent preference, intensity after opening, packaging method and destination-market requirements.'),
      variant('Perforated-film pads','products/pet-training-pads/range/perforated-product.webp','A finely perforated film replaces the non-woven top surface, giving the finished pad a different texture and liquid-entry surface. The five-layer construction and intact PE backing remain; bamboo charcoal paper is also an option.','Aperture pattern, surface feel, liquid intake and rewet on the complete finished pad.'),
      variant('Tissue-printed pads','products/pet-training-pads/range/tissue-print-product.webp','The layer 02 tissue paper is printed before lamination. The artwork is visible through the unprinted top cover, creating a patterned surface appearance while the PE backing stays plain.','Artwork repeat, color through the cover, print transfer and absorption on the laminated sample.'),
      variant('Backsheet-printed pads','products/pet-training-pads/range/backsheet-print-product.webp','Artwork is printed directly on the layer 05 PE backing film. Turn the pad over to see the design; the absorbent face remains plain in this version, keeping backing artwork distinct from tissue printing.','Print position, color, rub resistance, film integrity and appearance after folding.'),
      variant('Attractant pads','products/pet-training-pads/range/attractant-product.webp','An attractant-added option intended to help dogs identify the pad as a toileting area. Designed for a training-focused range, it works alongside consistent placement and reward-based routines; individual responses vary.','Attractant specification, application method, storage stability and supervised use trials. Training outcomes are not guaranteed.'),
      variant('Odor-control pads','products/pet-training-pads/range/odor-control-product.webp','An odor-control additive option for indoor pet-care ranges. Review odor-management performance separately from packaging fragrance, alongside the wood-pulp + SAP core that absorbs liquid.','Additive specification, target odor, test conditions and results against a comparable pad without the additive.')
    ],
    specs:[['Standard sizes','33 × 45 cm · 45 × 60 cm · 60 × 60 cm · 60 × 90 cm · 80 × 120 cm. Custom sizes are supported.'],['Five-layer structure','Non-woven or perforated-film surface · tissue or bamboo charcoal paper · wood pulp + SAP · tissue paper · PE film.'],['Configurable options','Adhesive backing, fragrance added inside the package, printing on layer 02 tissue or layer 05 PE backing film, attractant and odor-control additives. Feature combinations are reviewed with our team.'],['Pack & carton','Pieces per pack, artwork, fold, carton dimensions and shipping marks are confirmed in the project brief.']],
    faq:[['What standard sizes are available?','33 × 45 cm, 45 × 60 cm, 60 × 60 cm, 60 × 90 cm and 80 × 120 cm are the listed standard references. Custom sizes can be reviewed.'],['What changes in the bamboo charcoal version?','The second layer changes from tissue paper to bamboo charcoal paper. The remaining layers are confirmed against the selected specification.'],['Can perforated film and bamboo charcoal be combined?','Yes. The perforated film replaces the first non-woven layer, while the second layer can be bamboo charcoal paper.'],['Where is fragrance added?','Fragrance is added inside the package as a presentation option. The fragrance type and packaging method should be confirmed for the destination market.'],['How are printed pads made?','The surface-view version uses tissue paper printed before lamination in layer 02; the pattern shows through the unprinted cover. The backing-view version is printed directly on the layer 05 PE backing film. Layer 04 remains plain tissue paper. These are two separate versions.'],['Does an attractant replace toilet training?','No. It is a training-aid option intended to support pad recognition. Consistent placement, supervision and rewards still matter, and individual dogs respond differently. Confirm the formulation and review samples before finalizing your range.'],['Is odor control the same as packaging fragrance?','No. Packaging fragrance concerns scent, while the odor-control additive is selected for an odor-management objective. Confirm its composition and application method, then review test results under agreed conditions. No specific ingredient, antibacterial effect or duration is implied.']]
  },
  {
    slug:'pet-absorbent-paper-sheets',name:'Pet absorbent paper',short:'Absorbent paper',zh:'宠物吸尿纸',tag:'PET CLEANUP',
    image:img('products/printed-pet-urine-absorbent-paper/pet-absorbent-paper-user-reference-v2.webp'),headline:'Little accidents.\nA simpler clean.',
    intro:'A finished cleanup sheet with SAP to absorb pet urine after an accident. Cover the liquid, let the paper absorb, then gather and dispose of the used sheet.',audience:'Pet brands · Distributors · Retailers',
    variants:[
      variant('Non-woven absorbent sheets','products/printed-pet-urine-absorbent-paper/pet-absorbent-paper-user-reference-v2.webp','A finished sheet with non-woven outer faces for cleaning pet urine from the floor after an accident.','Sheet dimensions, wood-pulp + SAP core, wet handling and packing.'),
      variant('Wet-strength paper sheets','products/printed-pet-urine-absorbent-paper/printed-pet-urine-absorbent-paper-showcase.webp','A finished sheet with thickened wet-strength tissue-paper outer faces; sheet printing is available.','Print position, color reference, sheet dimensions and packing.')
    ],
    specs:[['Sheet format','Review available dimensions and plain or printed formats.'],['SAP absorption','Discuss absorption and wet handling using product samples.'],['Packaging','Confirm available pack counts, presentation and carton details with our team.'],['MOQ & samples','A fixed MOQ applies. Request it through an inquiry or our existing WhatsApp contact.']],
    faq:[['How is it different from a pet pad?','Pet pads are placed before use. Absorbent paper is placed over pet urine after an accident to make cleanup easier.'],['How is it different from ordinary tissue?','The paper contains SAP, a superabsorbent polymer that helps absorb urine quickly and reduces the need for repeated wiping.'],['Which outer materials are available?','Choose non-woven fabric or thickened wet-strength tissue paper for the outer faces. Both use a wood-pulp + SAP middle core, and both can be made plain or printed.'],['What sizes can I order?','The standard references are 25 × 30 cm and 30 × 40 cm. Both materials support custom dimensions.'],['What packaging can be supplied?','Choose a resealable bag or a color-printed plastic bag. Custom bag artwork and custom packaging designs can be reviewed with the fixed MOQ.'],['What should I send for a sample?','Tell us your market, preferred material, sheet finish, dimensions and packing requirements. Review the sample under your intended use conditions.']]
  },
  {
    slug:'pet-diapers',name:'Pet diapers',short:'Pet diapers',zh:'宠物尿裤',tag:'FIT & DAILY CARE',image:img('products/pet-diapers/pet-diapers-series-cover.webp'),headline:'Care that fits.\nA range that’s yours.',
    intro:'Male wraps, female diapers and pull-up formats solve different fit requirements. Select the structure first, then shape the size range and packaging.',audience:'Pet-care brands · Retail buyers · Importers',
    variants:[
      variant('Male dog diapers','products/pet-diapers/male-dog-diapers.webp','A wrap-style product direction for male dogs.','Waist range, wrap overlap, fastening and absorbent-zone placement.'),
      variant('Female dog diapers','products/pet-diapers/female-dog-diapers.webp','A diaper format developed around a different coverage requirement.','Waist and leg fit, tail opening and fastening placement.'),
      variant('Pet pull-up diapers','products/pet-diapers/pet-pull-up-diapers.webp','A pull-up construction with an elastic fit direction.','Stretch range, donning, removal and sizing references.')
    ],
    specs:[['Fit & sizing','Waist measurements, coverage area, opening positions and size grading.'],['Fastening','Tab or elastic construction and repeated adjustment requirements.'],['Absorbent zone','Position, core structure and performance targets.'],['Retail presentation','Size labels, fitting instructions, pack count and private-label artwork.']],
    faq:[['Can I use one size chart for all three formats?','Each construction needs its own fit review. Use measured dimensions and fitting samples rather than transferring size labels directly.'],['Can we build several sizes in one range?','Share the required size mix and order forecast so sampling, packing and production planning can be reviewed together.']]
  },
  {
    slug:'adult-underpads',name:'Adult care products',short:'Adult care',zh:'成人护理',tag:'EVERYDAY PROTECTION',image:img('oem/products/adult-underpads-hero.webp'),headline:'Considered care.\nClearly specified.',
    intro:'Compare bed and surface protection with wearable adult care. Define the use setting and performance requirements before deciding on materials and pack formats.',audience:'Care-product brands · Healthcare distributors · Procurement teams',
    variants:[
      variant('Adult underpads','oem/products/adult-underpads-hero.webp','An absorbent surface-protection format for care programs.','Coverage, surface feel, rewet, backing and edge integrity.'),
      variant('Adult diapers','products/adult-underpads/adult-diapers.webp','A wearable adult-care format with fit and fastening requirements.','Sizing, fastening, comfort and absorbent-zone performance.')
    ],
    specs:[['Application','Care setting, surface protection or wearable format, and user requirements.'],['Construction','Topsheet, core weight, backing and product dimensions.'],['Performance review','Agree liquid, timing, pressure and rewet test conditions.'],['Pack program','Institutional or retail pack counts, labels and carton handling.']],
    faq:[['Can hospital and retail packs differ?','Yes. Pack count, labeling and handling needs can be reviewed for the intended distribution channel.'],['Are certifications or medical claims included automatically?','No. Documentation and permitted claims must be confirmed for the exact product and destination market.']]
  },
  {
    slug:'disposable-cleaning-products',name:'Disposable cleaning products',short:'Cleaning products',zh:'一次性清洁用品',tag:'DAILY CLEANUP',image:img('products/disposable-cleaning-products/disposable-cleaning-gloves-upload.webp'),headline:'Small routines.\nThoughtful formats.',
    intro:'Wipes, finger cots and gloves bring different handling options to daily cleaning. Compare shape, substrate and packing around the intended application.',audience:'Pet-care brands · Retailers · Private-label buyers',
    variants:[
      variant('Wet wipes','products/disposable-cleaning-products/pet-cleaning-wet-wipes.webp','A wipe format for everyday cleaning programs.','Substrate, sheet dimensions, liquid formulation and closure.'),
      variant('Disposable non-woven finger cots','products/disposable-cleaning-products/finger-cots-nonwoven-20260922.webp','Single-use non-woven finger cots for controlled, hygienic handling.','Non-woven substrate, finger fit, intended contact area and sealed pack format.','cleaning-finger-cots'),
      variant('Cleaning gloves','products/disposable-cleaning-products/disposable-cleaning-gloves-upload.webp','A hand-worn disposable cleaning format.','Glove dimensions, seams, material feel and packaging.')
    ],
    specs:[['Intended use','Body area, user handling and any application-specific restrictions.'],['Substrate','Material composition, texture, weight and product shape.'],['Formulation','If wet: ingredients, fragrance direction and required market review.'],['Packing','Individual or multi-piece packs, closure and labeling.']],
    faq:[['Can the same claims be used across all formats?','Claims must match the formulation, construction and evidence for the exact product. Cleaning language does not automatically support antibacterial claims.'],['What needs to be checked in a sample?','Review handling, material feel, seam or shape integrity, packing and suitability for the intended cleaning task.']]
  },
  {
    slug:'garbage-bags',name:'Garbage & pet waste bags',short:'Waste bags',zh:'垃圾袋与拾便袋',tag:'CLEANER ROUTINES',image:img('products/garbage-bags/garbage-bags-series-cover-v2.webp'),headline:'Carry the essentials.\nMake them your own.',
    intro:'Choose conventional or degradable material options, then review vest-style bags, dispenser kits, printed designs and fragrance options for your program.',audience:'Retailers · Pet brands · Household-product distributors',
    variants:[
      variant("HDPE","products/garbage-bags/standard-garbage-bags/standard-garbage-bags-06.webp","Conventional materials · High-density polyethylene for a durable bag program.","Film thickness, seal strength, perforation and storage requirements.","hdpe"),
      variant("LDPE","products/garbage-bags/multicolor-garbage-bags/multicolor-garbage-bags-02.webp","Conventional materials · Low-density polyethylene for a flexible bag format.","Film flexibility, dimensions, gauge and seal integrity.","ldpe"),
      variant("HDPE + EPI","products/garbage-bags/degradable-garbage-bag-hero.webp","Degradable material options · An oxo-biodegradable material direction requiring supporting evidence.","Additive specification, test conditions and destination-market labeling.","hdpe-epi"),
      variant("Cornstarch + PE","products/garbage-bags/degradable-garbage-bag-hero.webp","Degradable material options · Semi-biodegradable direction; reference shelf life approximately 1 year.","Composition, supporting evidence, storage conditions and confirmed shelf life.","cornstarch-pe"),
      variant("Cornstarch + PBAT + PLA","products/garbage-bags/fully-biodegradable-garbage-bags.webp","Degradable material options · Compostable direction; reference shelf life 6–8 months.","Applicable compostability standards, test evidence, disposal conditions and storage requirements.","cornstarch-pbat-pla"),
      variant("Vest-style bags","products/garbage-bags/standard-garbage-bags/standard-garbage-bags-06.webp","Bag styles & accessories · A handle-style bag format for easy tying and carrying.","Handle dimensions, bag size, film thickness and load requirements.","vest-style-bags"),
      variant("Dispenser kits","products/garbage-bags/waste-bag-dispenser-kits/waste-bag-dispenser-kits-01.webp","Bag styles & accessories · Bags and a portable dispenser in one kit.","Roll compatibility, accessory count and packaging.","dispenser-kits"),
      variant("Printed waste bags","products/garbage-bags/printed-pet-waste-bags/printed-pet-waste-bags-01.webp","Bag styles & accessories · Printed artwork for a branded bag program.","Artwork position, ink requirements, repeat length and sample approval.","printed-pet-waste-bags"),
      variant("Scented waste bags","products/garbage-bags/multicolor-garbage-bags/multicolor-garbage-bags-02.webp","Bag styles & accessories · A fragrance option for the selected bag formulation.","Fragrance reference, intensity, packaging and storage conditions.","scented-waste-bags")
    ],
    specs:[['Bag construction','Dimensions, gauge, seal strength and load direction.'],['Roll format','Bags per roll, core dimensions, perforation and dispenser fit.'],['Color & print','Color standards, artwork, repeat position and assortment.'],['Material & claims','Composition, intended disposal route and supporting documentation.']],
    faq:[['Are colored bags a separate product project?','They can be variants within a coordinated range. Confirm color, material and packing differences in the same specification matrix.'],['Can environmental claims go straight onto the pack?','Confirm the material, test evidence, disposal conditions and market requirements before approving any claim.']]
  }
].map(p=>({...p,path:`/products/${p.slug}`}))
  .sort((a,b)=>['pet-training-pads','garbage-bags','pet-diapers','adult-underpads','disposable-cleaning-products','pet-absorbent-paper-sheets'].indexOf(a.slug)-['pet-training-pads','garbage-bags','pet-diapers','adult-underpads','disposable-cleaning-products','pet-absorbent-paper-sheets'].indexOf(b.slug))
  .map((p,i)=>({...p,number:String(i+1).padStart(2,'0')}));

const additions=[['waste-accessories','Waste bag accessories','Dispensers and double-layer waste bags for pet cleanup.'],['pad-holders','Pet pad holders','Placement accessories for pet training pads.'],['cat-litter-liners','Cat litter liners','Drawstring liners for cat litter cleanup.'],['pet-toys','Pet toys','Pet play balls for dog and cat product ranges.']];
for(const [slug,name,intro] of additions)catalog.push({slug,name,short:name,zh:name,tag:'PET ACCESSORIES',intro,headline:name+'\nFor your range.',audience:'Pet brands · Retailers · Distributors',path:'/products/'+slug,number:String(catalog.length+1).padStart(2,'0'),image:`/images/products/category-covers/generated-20261028/${slug}.webp`,variants:[],specs:[],faq:[],sourceFamily:true});
const formats=[['waste-accessories','dispensers','Waste bag dispensers'],['waste-accessories','double-layer-bags','Double-layer waste bags'],['pad-holders','wall-pad-holders','Wall pad holders'],['cat-litter-liners','drawstring-liners','Drawstring litter liners'],['pet-toys','rolling-balls','Pet play balls'],['disposable-cleaning-products','bathing-gloves','Pet bathing gloves'],['disposable-cleaning-products','grooming-brushes','Grooming brushes']];
for(const [family,slug,name]of formats){let p=catalog.find(p=>p.slug===family);p.variants.push({slug,name,purpose:'Compare individual models, materials and OEM packing options.',review:'Confirm material, size, handling and packing on the selected sample.',sourceFormat:true});}
for(const [slug,name]of [['rope-chew-toys','Rope & chew toys'],['cat-teasers','Cat teaser wands']])catalog.find(p=>p.slug==='pet-toys').variants.push({slug,name,purpose:'Compare the listed designs, materials and packaging.',review:'Confirm size, material, durability and appropriate pet supervision.'});
catalog.find(p=>p.slug==='disposable-cleaning-products').variants.push({slug:'hair-removal-rollers',name:'Hair removal rollers',purpose:'Reusable tools for collecting loose pet hair.',review:'Review contact surfaces, cleaning and handling.'});
catalog.find(p=>p.slug==='disposable-cleaning-products').name='Pet cleaning & grooming';
catalog.find(p=>p.slug==='pet-toys').intro='Compare interactive play balls, rope and chew toys, and cat teaser wands.';
catalog.find(p=>p.slug==='pet-training-pads').variants.push({slug:'printed-pads',name:'Custom printed pad models',purpose:'Printed pad listings; confirm the printed layer and artwork on the selected sample.',review:'Print location, ink transfer, artwork, absorption and packing.'});
export const productVariants = catalog.flatMap(parent => parent.variants.map((variant,index) => ({
  ...variant,
  index,
  parent,
  path: `${parent.path}/${variant.slug}`,
})));

export const variantForPath = path => productVariants.find(item => item.path === path);

export const reviewPages=[
  {path:'/',name:'Home',zh:'首页',purpose:'B2B制造商定位、产品选型、定制范围、工厂审核与报价样品入口'},
  {path:'/products',name:'Products',zh:'产品总览',purpose:'产品系列统一目录'},
  ...catalog.map(p=>({path:p.path,name:p.name,zh:p.zh,purpose:p.intro})),
  {path:'/factory',name:'Our factory',zh:'工厂与公司',purpose:'生产实拍、公司信息与供应能力'},
  {path:'/oem-process',name:'OEM / ODM',zh:'定制与合作流程',purpose:'定制范围、打样、包装与交付'},
  {path:'/quality-control',name:'Quality control',zh:'质量控制',purpose:'检验环节、验收方式与证据'},
  {path:'/contact',name:'Contact & inquiry',zh:'联系与询价',purpose:'报价、样品、资料申请共用一个入口'},
  ...catalog.flatMap(p=>p.variants.map(v=>({path:`${p.path}/${v.slug}`,name:v.name,zh:v.name,purpose:v.purpose}))),
  {path:'/privacy-policy',name:'Privacy policy',zh:'隐私说明',purpose:'隐私文案草案，待核实实际处理方式'}
];
