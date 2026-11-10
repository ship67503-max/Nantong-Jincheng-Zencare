// Customer-supplied photos; packaging stays visible without brand promotion.
export const customerGalleryPhotos = [
  {id:'01', label:'A little everyday care', alt:'White dog inside a home pen beside a pink pack of pet pads', src:'/images/customer-moments/2026-09-21/customer-white-dog-pet-pads.webp', width:338, height:447},
  {id:'02', label:'Right at home', alt:'Brown dog resting in a green pet bed beside a pink pet pad pack', src:'/images/customer-moments/brown-dog-pet-pad-pack.webp', width:1086, height:1448},
  {id:'03', label:'Their familiar spot', alt:'Cream puppy wearing an orange harness and sitting on charcoal pet pads', src:'/images/customer-moments/cream-puppy-charcoal-pet-pads.webp', width:941, height:1671},
  {id:'04', label:'Ready for the routine', alt:'Cream puppy beside folded charcoal pads and a pet pad pack', src:'/images/customer-moments/cream-puppy-folded-pet-pads.webp', width:941, height:1672},
  {id:'05', label:'Room to relax', alt:'White dog resting beside a charcoal pet pad pack and unfolded pads', src:'/images/customer-moments/white-dog-charcoal-pet-pads.webp', width:941, height:1672},
].map(photo=>({...photo, position:'center', shape:'portrait'}));
