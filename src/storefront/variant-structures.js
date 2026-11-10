// Images explain confirmed layers or conceptual components, not unverified BOMs.
const newImage = name => `/images/products/structure-visuals/${name}.webp`;
const padImage = name => `/images/products/pet-training-pads/ai-details-20260918/${name}.webp`;
const paperImage = name => `/images/products/pet-absorbent-paper-sheets/ai-details-20260918/${name}.webp`;
const basePadLayers = [
  ['Non-woven topsheet', 'The unprinted contact surface above the absorbent layers.'],
  ['Tissue paper', 'The second layer sits between the topsheet and the absorbent core.'],
  ['Wood pulp + SAP', 'The absorbent middle core. Review intake, retention and rewet on a finished sample.'],
  ['Tissue paper', 'The fourth layer lies below the absorbent core and above the backing.'],
  ['PE backing film', 'The bottom film of the five-layer pad. Confirm sealing and backing integrity on the sample.'],
];
const padChanges = {
  'standard-pads': {image:padImage('layers-nonwoven-tissue'),note:'Standard five-layer construction with a non-woven surface and plain tissue layers.'},
  'bamboo-charcoal-pads': {image:padImage('layers-nonwoven-charcoal'),layer:1,value:['Bamboo charcoal paper','Replaces the second tissue layer. This is charcoal paper, not a separate sixth layer.'],note:'The material change is in layer 02; confirm any odor-related performance claim separately.'},
  'adhesive-backed-pads': {image:padImage('layers-nonwoven-tissue'),note:'This view shows the base five-layer pad. Adhesive is a backing option, not an additional absorbent layer. Confirm adhesive position, release protection and floor compatibility on a sample.'},
  'fragrance-pads': {image:padImage('layers-nonwoven-tissue'),note:'Fragrance is added inside the package. It is not a new pad layer; confirm the scent and packaging method separately.'},
  'perforated-film-pads': {image:padImage('layers-perforated-tissue'),layer:0,value:['Perforated-film topsheet','Replaces the ordinary non-woven surface rather than being added on top.'],note:'This view uses tissue in layer 02. Bamboo charcoal paper can also be combined with the perforated-film surface.'},
  'tissue-printed-pads': {image:padImage('printed-tissue-layer02'),layer:1,value:['Printed tissue paper','Artwork is printed on layer 02 tissue before lamination and seen through the unprinted top cover.'],note:'Layer 04 remains plain tissue. Tissue printing and PE backsheet printing are separate versions.'},
  'backsheet-printed-pads': {image:newImage('pad-backing-print'),layer:4,value:['Printed PE backing film','The artwork is printed on layer 05, the bottom PE film. The absorbent face remains plain in this version.'],note:'The patterned bottom layer distinguishes this format from tissue-printed pads.'},
  'attractant-pads': {image:padImage('layers-nonwoven-tissue'),note:'This view shows the base construction. The attractant formulation and application location require confirmation; no extra layer is implied. Training outcomes vary.'},
  'odor-control-pads': {image:padImage('layers-nonwoven-tissue'),note:'This view shows the base construction. Confirm the odor-control additive and application method separately. Packaging fragrance is a different option.'},
};
const bagDetails = {
  'standard-bags':['bag-film','Film, seal and roll',['Bag film','Specify the material grade and thickness for the intended use.'],['Seal & perforation','Review the bottom seal and separation between consecutive bags.'],['Finished roll','Specify bag count, roll dimensions and core requirements.']],
  'multicolor-bags':['bag-colors','Color assortment & film',['Colored film','The illustration separates blue, orange and pink film references. The approved assortment may differ.'],['Assortment','Agree color references and the number of rolls of each color per pack.'],['Roll specification','Confirm bag dimensions, film thickness, bag count and dispenser fit.']],
  'printed-pet-waste-bags':['bag-print','Print on the bag film',['Film substrate','Confirm the film composition and thickness before approving artwork.'],['Surface print','Artwork appears on the film; it is not a separate material layer.'],['Repeat & separation','Match the artwork repeat to bag length and tear perforations.']],
  'bags-with-dispenser':['bag-kit','Roll & dispenser assembly',['Dispenser body & closure','The separated shell and end cap illustrate how a refill fits inside a dispenser.'],['Refill roll','Match roll width, diameter and core to the selected dispenser.'],['Attachment & opening','Review attachment, loading and dispensing on the finished kit.']],
  'color-block-bags':['bag-colorblock','Color blocks on film',['Color layout','A two-color surface design distinguishes this option; color blocks do not imply different material layers.'],['Bag construction','Confirm film material, dimensions, gauge and bottom sealing.'],['Production artwork','Review color separation and alignment on the finished roll.']],
  'dispenser-kits':['bag-kit','Kit components',['Dispenser & closure','Confirm the supplied dispenser model and assembly. The illustration shows a generic component concept.'],['Refill rolls','Agree refill compatibility and rolls per kit.'],['Attachment & pack','Confirm accessory count, mounting style and pack contents.']],
  'degradable-material-direction':['bag-film','Film format & material review',['Material specification','Request the exact composition for the proposed bag. Color or appearance cannot establish degradation behavior.'],['Converted bag','Dimensions, gauge, seals and perforations still require sample review.'],['Disposal evidence','Agree the intended degradation conditions and destination-market labeling; no particular formulation is implied by this drawing.']],
  'biodegradable-material-direction':['bag-film','Film format & disposal conditions',['Material composition','Confirm the proposed formulation and supporting product documentation.'],['Roll construction','Review gauge, seal integrity, perforation and dispenser compatibility.'],['Claim scope','Biodegradability and compostability are different claims. Match evidence and disposal conditions to the exact product.']],
};
const components = {
  'male-dog-diapers':['diaper-male','Male wrap components',['Contact surface','The inner face sits against the body inside an elongated belly wrap.'],['Absorbent zone','Review absorbent-zone position and coverage for the male wrap format.'],['Outer wrap & fastening','Confirm waist range, overlap and tab placement. This format is not a female diaper with tail and leg openings.']],
  'female-dog-diapers':['diaper-female','Female diaper components',['Inner contact area','Review surface feel and the position of the tail opening.'],['Absorbent zone','Agree core position and coverage under the body.'],['Outer body & fastening','Check waist and leg fit, tail-opening alignment and tab placement on a fitting sample.']],
  'pet-pull-up-diapers':['diaper-pullup','Elastic pull-up construction',['Continuous waist','An elastic waist distinguishes the pull-up format from tab-fastened diapers.'],['Inner absorbent area','Review core placement and contact-surface feel on the finished sample.'],['Openings & outer body','Confirm stretch range, tail and leg openings, donning and removal.']],
  'adult-underpads':['adult-underpad','Surface-care components',['Contact surface','Review topsheet feel and suitability for the care setting.'],['Absorbent area','Confirm the core material, weight and agreed absorption and rewet criteria.'],['Protective backing','Review backing material, edge integrity and coverage. The three groups shown are not an exact layer count.']],
  'adult-diapers':['adult-diaper','Wearable-care components',['Inner contact surface','Review feel and contact suitability for the intended care setting.'],['Absorbent zone','Confirm material composition, core position and agreed test criteria.'],['Outer body & fastening','Review waist and leg fit, fastening and ease of changing. This illustration is a tab-fastened construction concept.']],
  'wet-wipes':['wipe','Sheet & pack components',['Cleaning sheet','Specify substrate composition, texture, dimensions and weight. The illustration shows sheet texture, not a tested material formula.'],['Wet formulation','Confirm ingredients and intended contact areas separately; no formulation is inferred from the image.'],['Stack & closure','Agree count, fold, pouch and resealable closure requirements.']],
  'cleaning-finger-cots':['finger-cot','Disposable non-woven finger cot',['Non-woven cleaning surface','A single-use non-woven substrate provides the contact surface. Confirm basis weight, texture and intended cleaning task on the sample.'],['Finger-cot shape','Confirm finger fit, closed tip, opening and edge/seam integrity for one-time use.'],['Hygienic packing','Agree individual or multi-piece sealed packaging and disposal labeling; this format is disposable, not a reusable textile sleeve.']],
  'cleaning-gloves':['cleaning-glove','Cleaning mitt construction',['Textile panels','The illustration separates front and back panels to explain assembly. Confirm the actual substrate and shape.'],['Perimeter seam','Review seam strength, opening and hand fit on a sample.'],['Finish & packing','Confirm wet or dry supply, applicable formulation and pack format for the project.']],
};
export function structureFor(v){
  if(v.parent.slug==='pet-training-pads'){
    const config=padChanges[v.slug];
    const items=basePadLayers.map(row=>[...row]);
    if(config.layer!==undefined)items[config.layer]=config.value;
    return {image:config.image,title:'Inside the five-layer pad.',items,note:config.note,caption:'AI construction illustration · layers shown from top to bottom; not to scale.'};
  }
  if(v.parent.slug==='pet-absorbent-paper-sheets'){
    const nonwoven=v.slug==='non-woven-absorbent-sheets',outer=nonwoven?'Non-woven':'Wet-strength paper';
    return {image:paperImage(nonwoven?'nonwoven-structure':'wet-strength-structure'),title:'Outer faces. Absorbent core.',items:[[outer+' outer face',nonwoven?'A fibrous non-woven face covers the middle core.':'Thickened wet-strength tissue paper forms the outer face.'],['Wood pulp + SAP','Both formats share a wood-pulp and SAP middle core for post-accident urine cleanup.'],[outer+' lower face','The lower face uses the same outer-material direction. Both formats support plain or printed presentation.']],note:'Standard sizes: 25 × 30 cm and 30 × 40 cm. Custom dimensions and custom bag artwork are supported.',caption:'AI construction illustration · three-part arrangement; not to scale.'};
  }
  const data=v.parent.slug==='garbage-bags'?(bagDetails[v.slug] || ['bag-film','Bag material & format',['Material formulation',v.purpose],['Construction',v.review],['Approval','Confirm the selected formulation, storage requirements and packaging on a sample.']]):components[v.slug];
  if(!data)throw new Error('Missing structure for '+v.path);
  const [asset,title,...items]=data;
  return {image:newImage(v.slug==='cleaning-finger-cots'?'finger-cot-nonwoven-20260922':asset),title,items,note:v.review,caption:'AI component illustration · configuration and materials subject to sample confirmation.'};
}
