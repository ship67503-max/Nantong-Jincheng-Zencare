export const productCenterSeo = {
  title: 'Disposable Hygiene & Cleaning Products Manufacturer | JCZCARE',
  description: 'Explore six disposable hygiene, absorbent material, and cleaning product categories for wholesale, private label, and OEM/ODM manufacturing projects.',
  keywords: [
    'disposable hygiene products manufacturer',
    'OEM hygiene products supplier',
    'private label disposable products',
    'wholesale cleaning products',
  ],
};

const placeholder = (label) => ({
  image: null,
  imageAlt: `${label} product image placeholder pending approved photography`,
  imageStatus: 'placeholder',
});

const product = ({ name, slug, features, image = null, imageAlt = '', imageStatus = 'existing', imageFit = null, imagePosition = null, gallery = null, detailGallery = null }) => ({
  name,
  title: name,
  slug,
  features,
  summary: features.join('. '),
  image,
  imageAlt: imageAlt || `${name} product presentation`,
  imageStatus,
  imageFit,
  imagePosition,
  gallery,
  detailGallery,
  oem: true,
});

export const productSeries = [
  {
    slug: 'pet-training-pads',
    title: 'Pet Urine Pads',
    shortTitle: 'Pet Urine Pads',
    category: 'Absorbent Pet Hygiene',
    summary: 'Disposable urine pad formats for pet care, daily floor protection, and private-label product programs.',
    intro: 'Develop a focused pet urine pad range with configurable format, materials, functional options, print direction, and packaging.',
    image: '/images/oem/products/custom-disposable-pet-pads-premium.png',
    imageAlt: 'Packaged pet training pads with a folded product stack in a home setting',
    imageStatus: 'existing',
    featured: true,
    productTypes: ['Standard', 'Charcoal', 'Thickened Charcoal', 'Non-Slip'],
    customization: ['Custom Size', 'Custom Absorbency', 'Custom Materials', 'Printed Design', 'Private Label Packaging', 'Functional Customization'],
    products: [
      product({
        name: 'Standard Pet Urine Pads',
        slug: 'standard-pet-urine-pads',
        features: ['Standard pet urine pad format', 'Custom size, absorbency, pack count, and packaging available'],
        image: '/images/products/pet-training-pads/standard-pet-urine-pad.webp',
        imageAlt: 'Standard pet urine pads with white and blue retail packaging',
      }),
      product({
        name: 'Bamboo Charcoal Pet Urine Pads',
        slug: 'bamboo-charcoal-pet-training-pads',
        features: ['Charcoal product format', 'Custom size and packaging direction'],
        image: '/images/oem/products/custom-charcoal-pet-pad-ai.webp',
        imageAlt: 'Bamboo charcoal pet training pad product presentation',
      }),
      product({
        name: 'Thickened Bamboo Charcoal Pet Pads',
        slug: 'thickened-bamboo-charcoal-pet-pads',
        features: ['Bamboo-charcoal odor-control format', 'Thickened pad and private-label packaging direction'],
        image: '/images/products/pet-training-pads/thickened-bamboo-charcoal-pet-pads.webp',
        imageAlt: 'Thickened bamboo charcoal pet pads with retail packaging and two dogs',
        imageFit: 'contain',
        imagePosition: 'center',
      }),
      product({
        name: 'Non-Slip Pet Urine Pads',
        slug: 'adhesive-pet-training-pads',
        features: ['Non-slip backing for stable placement', 'Custom size and absorbency direction'],
        image: '/images/oem/products/custom-adhesive-pet-pad-ai.webp',
        imageAlt: 'Non-slip pet urine pads with purple retail packaging',
      }),
    ],
    seoTitle: 'Pet Urine Pads Manufacturer | OEM & Private Label',
    seoDescription: 'Explore standard, charcoal, non-slip, and antibacterial pet urine pads for OEM/ODM and private-label projects.',
  },
  {
    slug: 'pet-absorbent-paper-sheets',
    title: 'Pet Absorbent Paper Sheets',
    shortTitle: 'Urine Absorbent Paper',
    category: 'Pet Urine Absorbent Paper',
    summary: 'Plain and printed pet urine absorbent paper supplied as a standalone range for retail, private-label, and bulk sourcing programs.',
    intro: 'Source pet urine absorbent paper independently from finished pet training pads, with plain or printed surfaces, custom dimensions, absorbency direction, packaging, and bulk supply options.',
    image: '/images/oem/products/custom-absorbent-paper-ai.webp',
    imageAlt: 'Standard white pet urine absorbent paper with blue retail packaging',
    imageStatus: 'existing',
    featured: false,
    productTypes: ['Standard Absorbent Paper', 'Printed Absorbent Paper'],
    customization: ['Custom Sheet Size', 'Custom Basis Weight', 'Absorbency Direction', 'Printed Design', 'Private Label Packaging', 'Bulk Packaging'],
    products: [
      product({
        name: 'Standard Pet Urine Absorbent Paper',
        slug: 'standard-pet-urine-absorbent-paper',
        features: ['Standard white absorbent paper format', 'Custom pack count and private-label packaging available'],
        image: '/images/oem/products/custom-absorbent-paper-ai.webp',
        imageAlt: 'Standard white pet urine absorbent paper with blue retail packaging',
      }),
      product({
        name: 'Printed Pet Urine Absorbent Paper',
        slug: 'printed-pet-urine-absorbent-paper',
        features: ['Custom printed absorbent paper surface', 'Private-label retail packaging available'],
        image: '/images/products/printed-pet-urine-absorbent-paper/printed-pet-urine-absorbent-paper-showcase.webp',
        imageAlt: 'Printed pet urine absorbent paper displayed with retail packaging and a small dog',
        imageFit: 'cover',
        imagePosition: 'center',
      }),
    ],
    seoTitle: 'Pet Urine Absorbent Paper Manufacturer | OEM & Private Label',
    seoDescription: 'Source standard and printed pet urine absorbent paper with configurable dimensions, absorbency, private-label packaging, and bulk supply options.',
  },
  {
    slug: 'pet-diapers',
    title: 'Pet Diapers',
    shortTitle: 'Pet Diapers',
    category: 'Disposable Pet Care',
    summary: 'Disposable diaper formats for male dogs, female dogs, and pull-up pet care product programs.',
    intro: 'Review the three pet diaper formats available for wholesale, private-label, and OEM/ODM project discussion.',
    image: '/images/products/pet-diapers/pet-diapers-series-cover.webp',
    imageAlt: 'Male and female pet diaper retail packages displayed on white podiums',
    imageStatus: 'existing',
    imageFit: 'cover',
    imagePosition: 'center',
    featured: false,
    productTypes: ['Male Dog Diapers', 'Female Dog Diapers', 'Pet Pull-Up Diapers'],
    customization: ['Custom Size', 'Custom Materials', 'Fit and Fastening Direction', 'Pack Count', 'Private Label Packaging'],
    products: [
      product({
        name: 'Male Dog Diapers',
        slug: 'male-dog-diapers',
        features: ['Male dog diaper format', 'Custom size and packaging direction'],
        image: '/images/products/pet-diapers/male-dog-diapers.webp',
        imageAlt: 'Male dog diapers in blue and white retail packaging',
        imageFit: 'cover',
        imagePosition: 'center',
      }),
      product({
        name: 'Female Dog Diapers',
        slug: 'female-dog-diapers',
        features: ['Female dog diaper format', 'Custom size and packaging direction'],
        image: '/images/products/pet-diapers/female-dog-diapers.webp',
        imageAlt: 'Female dog diapers in blue and white retail packaging',
        imageFit: 'cover',
        imagePosition: 'center',
      }),
      product({
        name: 'Pet Pull-Up Diapers',
        slug: 'pet-pull-up-diapers',
        features: ['Pull-up pet diaper format', 'Custom materials and packaging direction'],
        image: '/images/products/pet-diapers/pet-pull-up-diapers.webp',
        imageAlt: 'Disposable pet pull-up diapers in white and yellow retail packaging',
        imageFit: 'cover',
        imagePosition: 'center',
      }),
    ],
    seoTitle: 'Pet Diapers Manufacturer | OEM Dog Diapers Supplier',
    seoDescription: 'Explore male dog diapers, female dog diapers, and pet pull-up diapers for wholesale, OEM/ODM, and private-label manufacturing projects.',
  },
  {
    slug: 'adult-underpads',
    title: 'Adult Underpads',
    shortTitle: 'Adult Underpads',
    category: 'Adult Care Protection',
    summary: 'Disposable adult underpads and adult diapers with configurable size, absorbency, materials, and private-label packaging.',
    intro: 'Review adult underpads and adult diapers for wholesale, private-label, and OEM/ODM adult-care product programs.',
    image: '/images/oem/products/adult-underpads-hero.png',
    imageAlt: 'Packaged adult nursing pads with folded and unfolded underpads',
    imageStatus: 'existing',
    featured: false,
    productTypes: ['Adult Underpads', 'Adult Diapers'],
    customization: ['Different Sizes', 'Different Absorbency Levels', 'Custom SAP and Fluff Pulp Ratios', 'Non-Slip Back Sheet', 'Custom Packaging', 'Private Label Manufacturing'],
    products: [
      product({
        name: 'Adult Underpads',
        slug: 'adult-underpads',
        features: ['Size and absorbency customization', 'Back sheet and packaging options'],
        image: '/images/oem/products/adult-underpads-hero.png',
        imageAlt: 'Packaged adult nursing pads with folded and unfolded underpads',
      }),
      product({
        name: 'Adult Diapers',
        slug: 'adult-diapers',
        features: ['Adult diaper size and absorbency options', 'Materials, fastening, and private-label packaging available'],
        image: '/images/products/adult-underpads/adult-diapers.webp',
        imageAlt: 'Blue adult diaper retail package with two folded white adult diapers in a bright bedroom',
        imageFit: 'cover',
        imagePosition: 'center',
      }),
    ],
    seoTitle: 'Adult Underpads & Diapers Manufacturer | OEM Private Label Supplier',
    seoDescription: 'Custom adult underpads and adult diapers with size, absorbency, materials, backing, fastening, packaging, and private-label manufacturing options.',
  },
  {
    slug: 'disposable-cleaning-products',
    title: 'Disposable Cleaning Products',
    shortTitle: 'Cleaning Products',
    category: 'Single-Use Cleaning',
    summary: 'Wet wipes, disposable cleaning finger cots, gloves, and other single-use cleaning product formats.',
    intro: 'Build coordinated disposable cleaning ranges with product-format, material, packaging, and private-label options.',
    image: '/images/products/disposable-cleaning-products/disposable-cleaning-gloves-upload.png',
    imageAlt: 'Disposable cleaning products arranged for a clean product presentation',
    imageStatus: 'existing',
    featured: false,
    productTypes: ['Wet Wipes', 'Cleaning Finger Cots', 'Cleaning Gloves', 'Other Cleaning Products'],
    customization: ['Custom Product Format', 'Custom Materials', 'Custom Size', 'Pack Count', 'Private Label Packaging'],
    products: [
      product({
        name: 'Wet Wipes',
        slug: 'wet-wipes',
        features: ['Disposable wet wipe format', 'Custom materials and packaging direction'],
        image: '/images/products/disposable-cleaning-products/pet-cleaning-wet-wipes.webp',
        imageAlt: 'Pet cleaning wet wipes in green retail packaging',
        imageFit: 'contain',
        imagePosition: 'center',
      }),
      product({
        name: 'Disposable Cleaning Finger Cots',
        slug: 'disposable-cleaning-finger-cots',
        features: ['Disposable finger-cot format', 'Custom size and packaging direction'],
        image: '/images/products/disposable-cleaning-products/disposable-cleaning-finger-cots.webp',
        imageAlt: 'Two-sided pet dental cleaning finger wipes with blue and white retail tub',
        imageFit: 'cover',
        imagePosition: '70% center',
      }),
      product({ name: 'Disposable Cleaning Gloves', slug: 'disposable-cleaning-gloves', features: ['Disposable cleaning glove format', 'Private-label packaging available'], image: '/images/products/disposable-cleaning-products/disposable-cleaning-gloves-upload.png', imageAlt: 'Disposable cleaning gloves product presentation' }),
    ],
    seoTitle: 'Disposable Cleaning Products Manufacturer | OEM Supplier',
    seoDescription: 'Explore wet wipes, disposable cleaning finger cots, and disposable cleaning gloves for OEM and private-label projects.',
  },
  {
    slug: 'garbage-bags',
    title: 'Garbage Bags',
    shortTitle: 'Garbage Bags',
    category: 'Disposable Bag Products',
    summary: 'Standard, degradable, and fully biodegradable garbage bag formats for wholesale and private-label programs.',
    intro: 'Discuss material, dimensions, bag format, print direction, and packaging without unconfirmed environmental certification claims.',
    image: '/images/products/garbage-bags/garbage-bags-series-cover.webp',
    imageAlt: 'Colorful garbage bag rolls displayed beside premium retail packaging',
    imageStatus: 'existing',
    featured: false,
    productTypes: ['Standard', 'Degradable', 'Fully Biodegradable'],
    customization: ['Custom Size', 'Material Direction', 'Bag Format', 'Printed Design', 'Private Label Packaging'],
    products: [
      product({ name: 'Standard Garbage Bags', slug: 'standard-garbage-bags', features: ['Standard garbage bag format', 'Custom size and packaging direction'], image: '/images/products/garbage-bags/pet-waste-bags-dispenser.webp', imageAlt: 'Pet waste bag packaging with a bone-shaped dispenser and bag roll' }),
      product({
        name: 'Degradable Garbage Bags',
        slug: 'degradable-garbage-bags',
        features: ['Degradable product format', 'Material specification requires project confirmation'],
        image: '/images/products/garbage-bags/degradable-garbage-bag-01.webp',
        imageAlt: 'Degradable pet waste bag retail packaging in a green product setting',
        imagePosition: 'center 28%',
        gallery: [
          { src: '/images/products/garbage-bags/degradable-garbage-bag-01.webp', alt: 'Degradable pet waste bag retail packaging in a green product setting', position: 'center 28%' },
          { src: '/images/products/garbage-bags/degradable-garbage-bag-02.webp', alt: 'Blue and pink printed pet waste bag design options' },
          { src: '/images/products/garbage-bags/degradable-garbage-bag-03.webp', alt: 'Thick leak-resistant printed pet waste bag in use' },
          { src: '/images/products/garbage-bags/degradable-garbage-bag-04.webp', alt: 'Degradable pet waste bag shown in a green outdoor setting' },
          { src: '/images/products/garbage-bags/degradable-garbage-bag-05.webp', alt: 'Perforated pet waste bag being separated by hand' },
        ],
        detailGallery: [
          { src: '/images/products/garbage-bags/degradable-garbage-bag-03.webp', alt: 'Thick leak-resistant printed pet waste bag in use', title: 'Material & Leak Protection' },
          { src: '/images/products/garbage-bags/degradable-garbage-bag-04.webp', alt: 'Degradable pet waste bag shown in a green outdoor setting', title: 'Degradable Format Presentation' },
          { src: '/images/products/garbage-bags/degradable-garbage-bag-02.webp', alt: 'Blue and pink printed pet waste bag design options', title: 'Printed Design Options' },
          { src: '/images/products/garbage-bags/degradable-garbage-bag-05.webp', alt: 'Perforated pet waste bag being separated by hand', title: 'Easy-Tear Perforation' },
        ],
      }),
      product({
        name: 'Fully Biodegradable Garbage Bags',
        slug: 'fully-biodegradable-garbage-bags',
        features: ['Fully biodegradable product format', 'Material specification requires project confirmation'],
        image: '/images/products/garbage-bags/fully-biodegradable-garbage-bags.webp',
        imageAlt: 'Fully biodegradable green garbage bags with a roll and kraft paper packaging',
        imageFit: 'cover',
        imagePosition: 'center',
      }),
    ],
    seoTitle: 'Garbage Bags Manufacturer | OEM & Private Label Supplier',
    seoDescription: 'Explore standard, degradable, and fully biodegradable garbage bags with custom size, format, print, and private-label packaging options.',
  },
];

export const primaryProductCatalog = productSeries;

export const uploadedProductLines = productSeries.flatMap((series) => series.products.map((item) => ({
  ...item,
  title: item.name,
  category: series.title,
  intro: item.features.join('. '),
  href: `/products/${series.slug}/${item.slug}`,
  seriesSlug: series.slug,
})));

export const getProductSeries = (slug) => productSeries.find((series) => series.slug === slug) || null;

export const getSeriesProduct = (seriesSlug, productSlug) => {
  const series = getProductSeries(seriesSlug);
  const item = series?.products.find((entry) => entry.slug === productSlug) || null;
  return item ? { ...item, series } : null;
};

export const getCatalogProduct = (slug) => getProductSeries(slug);

export const buildProductQuoteHref = (series, item = null) => {
  const params = new URLSearchParams({
    productCategory: series.title,
    product: item?.name || series.title,
  });

  if (item) {
    params.set('productName', item.name);
  }

  return `/request-product-plan?${params.toString()}`;
};
