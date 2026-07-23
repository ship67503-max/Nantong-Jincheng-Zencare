import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { blogArticles } from '../src/blogData.js';
import { allSeoEntries } from './seo-page-data.mjs';

const root = process.cwd();
const sourceRoot = 'D:/WebsiteImages';
const auditDir = path.join(root, 'docs', 'image-audit');
const candidateIndexPath = path.join(auditDir, 'candidate-index.json');
const reportJsonPath = path.join(root, 'image-replacement-report.json');
const reportMdPath = path.join(root, 'image-replacement-report.md');
const statePath = path.join(root, 'docs', 'image-replacement-state.json');
const generatedRoot = path.join(root, 'public', 'images', 'generated-site');
const publicPrefix = '/images/generated-site';

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const candidates = readJson(candidateIndexPath);
const byIndex = new Map(candidates.map((item) => [item.index, item]));

const selectedAssets = [
  ['products-disposable-pads-01', 39, 'products', 'Dog beside a disposable pet training pad in a home setting'],
  ['products-disposable-pads-02', 113, 'products', 'Packaged disposable pet pad beside a dog in a bright room'],
  ['products-pet-pad-structure-01', 137, 'products', 'Folded disposable pet pads and absorbent sheet structure'],
  ['products-pet-pad-macro-01', 140, 'products', 'Close-up of quilted pet pad surface with liquid bead'],
  ['products-absorbent-paper-01', 141, 'materials', 'Absorbent paper and core material sample on a tray'],
  ['products-pe-film-01', 138, 'materials', 'Close-up of absorbent pad backing and layered edge'],
  ['products-underpads-01', 40, 'products', 'Absorbency pressure test on an adult disposable underpad'],
  ['products-underpads-02', 146, 'products', 'Adult underpad absorbency test with pressure block'],
  ['products-charcoal-pads-01', 138, 'products', 'Dark-backed absorbent pad edge for odor-control product reference'],
  ['products-adhesive-pads-01', 43, 'products', 'Disposable pet pad on wood floor during liquid absorption test'],
  ['private-label-packaging-01', 132, 'packaging', 'Private-label pet care packaging review meeting'],
  ['private-label-packaging-02', 133, 'packaging', 'Pet care packaging samples and absorbent products on a review table'],
  ['oem-sample-review-01', 33, 'oem', 'OEM product sample review with absorbent pad and packaging'],
  ['oem-meeting-01', 56, 'oem', 'Business team reviewing pet care product samples and packaging'],
  ['factory-campus-01', 15, 'factory', 'Modern factory campus exterior for JCZCARE company profile'],
  ['factory-office-01', 16, 'about', 'Bright reception and office space for company profile'],
  ['factory-production-line-01', 47, 'factory', 'Automated absorbent product production line with stacked pet pads'],
  ['factory-production-line-02', 49, 'factory', 'Wide view of automated pet pad production line'],
  ['factory-production-line-03', 129, 'factory', 'Pet pad converting line with blue absorbent products'],
  ['factory-lamination-01', 68, 'factory', 'Close-up of nonwoven roll material on production equipment'],
  ['factory-lamination-02', 80, 'factory', 'Absorbent sheet material running through production equipment'],
  ['factory-quality-control-01', 29, 'quality-control', 'Quality inspector testing disposable pet pads in a laboratory'],
  ['factory-quality-control-02', 53, 'quality-control', 'Technician measuring and inspecting disposable pet pads'],
  ['factory-quality-control-03', 134, 'quality-control', 'Laboratory absorbency test for pet pad quality control'],
  ['factory-testing-lab-01', 60, 'quality-control', 'Absorbency test performed on a disposable underpad'],
  ['warehouse-finished-goods-01', 85, 'warehouse', 'Finished pet care goods stored in an organized warehouse aisle'],
  ['warehouse-finished-goods-02', 76, 'warehouse', 'Warehouse aisle with finished cartons and pet pad pallets'],
  ['warehouse-pallet-01', 54, 'warehouse', 'Palletized pet care products ready in warehouse storage'],
  ['logistics-container-01', 136, 'logistics', 'Forklift loading pet care goods into an export container'],
  ['logistics-container-02', 90, 'logistics', 'Container loading operation with forklifts and palletized goods'],
  ['contact-business-office-01', 5, 'contact', 'Business discussion for OEM pet care product planning'],
  ['contact-pet-care-01', 118, 'contact', 'Family with dogs using disposable pet pads in a home'],
];

const excludedIndexes = new Set([36, 131, 143, 144, 148, 149, 150, 151, 152]);
const unsupportedPositions = [
  {
    location: 'Custom Pet Waste Bags product detail and SEO image',
    current_image: '/images/custom-pet-waste-bags-ai.png',
    reason: 'No clean dog-waste-bag material was found outside rejected; the only packaging-like candidates had visible third-party/Japanese promotional text.',
  },
  {
    location: 'Dog Poop Bags topic/category and generated guide source image',
    current_image: '/images/custom-pet-waste-bags-ai.png',
    reason: 'No clean dog-waste-bag material was found outside rejected; using unrelated pad/factory images would be a semantic mismatch.',
  },
];

const assetPublic = (name, category) => `${publicPrefix}/${category}/${name}.webp`;
const assetMap = new Map(selectedAssets.map(([name, , category, alt]) => [name, { path: assetPublic(name, category), alt }]));
const asset = (name) => assetMap.get(name).path;

const replacementByOldPath = {
  '/images/factory-campus.jpeg': asset('factory-campus-01'),
  '/images/production-line-clean.png': asset('factory-production-line-01'),
  '/images/production-line-enhanced.png': asset('factory-production-line-02'),
  '/images/production-line.png': asset('factory-production-line-02'),
  '/images/lamination-detail-clean.png': asset('factory-lamination-01'),
  '/images/lamination-detail.png': asset('factory-lamination-01'),
  '/images/lamination-detail-enhanced.png': asset('factory-lamination-02'),
  '/images/warehouse-storage-clean.png': asset('warehouse-finished-goods-01'),
  '/images/warehouse-storage.JPG': asset('warehouse-finished-goods-02'),
  '/images/quality-inspection-lab-mask.png': asset('factory-quality-control-01'),
  '/images/quality-inspection-lab.png': asset('factory-quality-control-03'),
  '/images/pet-pad-layer-protection-premium.png': asset('products-pet-pad-structure-01'),
  '/images/pet-pad-layer-protection.png': asset('products-pet-pad-macro-01'),
  '/images/pet-pad-product-studio.png': asset('products-disposable-pads-02'),
  '/images/custom-disposable-pet-pads-premium.png': asset('products-disposable-pads-01'),
  '/images/custom-disposable-pet-pads-ai.png': asset('products-disposable-pads-02'),
  '/images/custom-disposable-pet-pads.png': asset('products-disposable-pads-02'),
  '/images/custom-products-preview.png': asset('private-label-packaging-02'),
  '/images/adult-underpads-hero.png': asset('products-underpads-01'),
  '/images/custom-care-pad-packaging-ai.png': asset('private-label-packaging-01'),
  '/images/custom-care-pad-packaging.png': asset('private-label-packaging-02'),
  '/images/custom-care-pad-packaging-disposable.png': asset('private-label-packaging-02'),
  '/images/custom-absorbent-paper-ai.png': asset('products-absorbent-paper-01'),
  '/images/custom-absorbent-core-pad-ai.png': asset('products-pet-pad-structure-01'),
  '/images/custom-charcoal-pet-pad-ai.png': asset('products-charcoal-pads-01'),
  '/images/custom-adhesive-pet-pad-ai.png': asset('products-adhesive-pads-01'),
  '/images/contact-pets-grass-centered.png': asset('contact-business-office-01'),
  '/images/contact-pets-grass.png': asset('contact-pet-care-01'),
  '/generated-images/pet-pads/products-disposable-pet-pads.webp': asset('products-disposable-pads-01'),
  '/generated-images/adult-underpads/products-adult-underpads.webp': asset('products-underpads-01'),
};

const fileReplacementTargets = [
  'src/blogData.js',
  'src/blogExpansionData.js',
  'src/seoGrowthArticles.js',
  'src/topicClusters.js',
  'src/factoryData.js',
  'src/authorityData.js',
  'src/contentEcosystemAuthorityData.js',
  'src/contentEcosystemBlogData.js',
  'scripts/seo-page-data.mjs',
];

const mainJsTargetedReplacements = [
  ...Object.entries(replacementByOldPath),
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const replaceAll = (content, from, to) => content.replace(new RegExp(escapeRegExp(from), 'g'), to);

const normalizeMainJs = (content) => {
  let next = content;
  const productDetailAdditions = [
    [
      "image: '/images/custom-care-pad-packaging-ai.png',\r\n    specs:",
      `image: '/images/custom-care-pad-packaging-ai.png',\r\n    detailImage: '${asset('private-label-packaging-01')}',\r\n    detailImageAlt: '${assetMap.get('private-label-packaging-01').alt}',\r\n    specs:`,
    ],
    [
      "image: '/images/custom-absorbent-paper-ai.png',\r\n    specs:",
      `image: '/images/custom-absorbent-paper-ai.png',\r\n    detailImage: '${asset('products-absorbent-paper-01')}',\r\n    detailImageAlt: '${assetMap.get('products-absorbent-paper-01').alt}',\r\n    specs:`,
    ],
    [
      "image: '/images/custom-charcoal-pet-pad-ai.png',\r\n    specs:",
      `image: '/images/custom-charcoal-pet-pad-ai.png',\r\n    detailImage: '${asset('products-charcoal-pads-01')}',\r\n    detailImageAlt: '${assetMap.get('products-charcoal-pads-01').alt}',\r\n    specs:`,
    ],
    [
      "image: '/images/custom-adhesive-pet-pad-ai.png',\r\n    specs:",
      `image: '/images/custom-adhesive-pet-pad-ai.png',\r\n    detailImage: '${asset('products-adhesive-pads-01')}',\r\n    detailImageAlt: '${assetMap.get('products-adhesive-pads-01').alt}',\r\n    specs:`,
    ],
    [
      "detailImage: '/generated-images/pet-pads/products-disposable-pet-pads.webp'",
      `detailImage: '${asset('products-disposable-pads-01')}'`,
    ],
    [
      "detailImage: '/generated-images/adult-underpads/products-adult-underpads.webp'",
      `detailImage: '${asset('products-underpads-01')}'`,
    ],
  ];

  for (const [from, to] of productDetailAdditions) {
    next = replaceAll(next, from, to);
  }

  const ranges = [
    ['const newsArticles = [', 'const seoPageMap = new Map'],
    ['const staticSeoPages = {', 'const buildAbsoluteUrl ='],
    ['function AffiliatesPage()', 'function HelpCenterPage()'],
    ['function LearnCenterPage()', 'function GiveBackPage()'],
    ['function GiftCardsPage()', 'function App()'],
    ['if (isBlogPage)', 'if (currentNewsArticle)'],
  ];

  for (const [startMarker, endMarker] of ranges) {
    const start = next.indexOf(startMarker);
    const end = next.indexOf(endMarker, start);
    if (start === -1 || end === -1) continue;
    let segment = next.slice(start, end);
    for (const [from, to] of mainJsTargetedReplacements) {
      segment = replaceAll(segment, from, to);
    }
    next = `${next.slice(0, start)}${segment}${next.slice(end)}`;
  }

  return next;
};

const writeIfChanged = (relativePath, transform) => {
  const filePath = path.join(root, relativePath);
  const original = fs.readFileSync(filePath, 'utf8');
  const updated = transform(original);
  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
    return true;
  }
  return false;
};

const generateAsset = async ([name, sourceIndex, category, alt]) => {
  const candidate = byIndex.get(sourceIndex);
  if (!candidate) {
    throw new Error(`Missing candidate index ${sourceIndex} for ${name}`);
  }
  const outDir = path.join(generatedRoot, category);
  const outPath = path.join(outDir, `${name}.webp`);
  fs.mkdirSync(outDir, { recursive: true });
  await sharp(candidate.file)
    .rotate()
    .resize(1600, 900, { fit: 'cover', position: 'attention' })
    .webp({ quality: 82, effort: 5 })
    .toFile(outPath);
  const outputMeta = await sharp(outPath).metadata();
  return {
    key: name,
    category,
    source_index: sourceIndex,
    source_file: candidate.file,
    output_path: assetPublic(name, category),
    alt,
    width: outputMeta.width,
    height: outputMeta.height,
    bytes: fs.statSync(outPath).size,
    sha256: crypto.createHash('sha256').update(fs.readFileSync(outPath)).digest('hex'),
  };
};

const slugCategory = (article) => {
  const haystack = `${article.slug} ${article.title} ${article.category} ${article.primaryKeyword || ''}`.toLowerCase();
  if (haystack.includes('adult') || haystack.includes('hospital') || haystack.includes('nursing') || haystack.includes('underpad')) return 'adult';
  if (haystack.includes('warehouse') || haystack.includes('shipment') || haystack.includes('shipping') || haystack.includes('container') || haystack.includes('logistics') || haystack.includes('landed')) return 'logistics';
  if (haystack.includes('quality') || haystack.includes('inspection') || haystack.includes('test') || haystack.includes('rewet') || haystack.includes('absorbency')) return 'quality';
  if (haystack.includes('pack') || haystack.includes('private-label') || haystack.includes('label') || haystack.includes('artwork') || haystack.includes('ecommerce')) return 'packaging';
  if (haystack.includes('factory') || haystack.includes('manufactur') || haystack.includes('production') || haystack.includes('automation') || haystack.includes('audit')) return 'factory';
  if (haystack.includes('sap') || haystack.includes('fluff') || haystack.includes('pulp') || haystack.includes('film') || haystack.includes('material') || haystack.includes('layer') || haystack.includes('core')) return 'materials';
  if (haystack.includes('charcoal')) return 'charcoal';
  if (haystack.includes('adhesive')) return 'adhesive';
  return 'product';
};

const blogSourcePools = {
  adult: ['products-underpads-02', 'products-underpads-01', 'factory-quality-control-02'],
  logistics: ['logistics-container-01', 'warehouse-finished-goods-01', 'warehouse-pallet-01'],
  quality: ['factory-quality-control-03', 'factory-quality-control-01', 'factory-testing-lab-01'],
  packaging: ['private-label-packaging-01', 'private-label-packaging-02', 'oem-sample-review-01'],
  factory: ['factory-production-line-02', 'factory-production-line-03', 'factory-campus-01'],
  materials: ['products-absorbent-paper-01', 'products-pet-pad-structure-01', 'factory-lamination-01'],
  charcoal: ['products-charcoal-pads-01', 'products-pet-pad-macro-01'],
  adhesive: ['products-adhesive-pads-01', 'products-disposable-pads-02'],
  product: ['products-disposable-pads-02', 'products-pet-pad-macro-01', 'products-disposable-pads-01'],
};

const hashText = (value) => [...value].reduce((sum, char) => ((sum * 33) + char.charCodeAt(0)) >>> 0, 5381);

const generateBlogCover = async (article) => {
  const category = slugCategory(article);
  const pool = blogSourcePools[category];
  const key = pool[hashText(article.slug) % pool.length];
  const sourceAsset = selectedAssets.find(([name]) => name === key);
  const candidate = byIndex.get(sourceAsset[1]);
  const outDir = path.join(generatedRoot, 'blog');
  const outPath = path.join(outDir, `${article.slug}.webp`);
  fs.mkdirSync(outDir, { recursive: true });
  await sharp(candidate.file)
    .rotate()
    .resize(1200, 675, { fit: 'cover', position: 'attention' })
    .webp({ quality: 80, effort: 5 })
    .toFile(outPath);
  return {
    slug: article.slug,
    category,
    source_asset: key,
    source_file: candidate.file,
    output_path: `${publicPrefix}/blog/${article.slug}.webp`,
    bytes: fs.statSync(outPath).size,
    sha256: crypto.createHash('sha256').update(fs.readFileSync(outPath)).digest('hex'),
  };
};

const countImageLocations = () => {
  const scanFiles = [
    'src/main.jsx',
    'src/blogData.js',
    'src/blogExpansionData.js',
    'src/seoGrowthArticles.js',
    'src/topicClusters.js',
    'src/factoryData.js',
    'src/authorityData.js',
    'src/contentEcosystemAuthorityData.js',
    'src/contentEcosystemBlogData.js',
    'scripts/seo-page-data.mjs',
    'index.html',
    'src/styles.css',
  ];
  return scanFiles.reduce((total, relativePath) => {
    const content = fs.readFileSync(path.join(root, relativePath), 'utf8');
    return total + (content.match(/\/(?:images|generated-images)\/[^'")\s]+/g) || []).length;
  }, 0);
};

const beforeLocations = countImageLocations();
const generatedAssets = [];
for (const assetSpec of selectedAssets) {
  generatedAssets.push(await generateAsset(assetSpec));
}
const generatedBlogCovers = [];
for (const article of blogArticles) {
  generatedBlogCovers.push(await generateBlogCover(article));
}

const changedFiles = [];
for (const relativePath of fileReplacementTargets) {
  const changed = writeIfChanged(relativePath, (content) => {
    let next = content;
    for (const [from, to] of Object.entries(replacementByOldPath)) {
      next = replaceAll(next, from, to);
    }
    next = replaceAll(next, 'image: `/images/blog/${slug}.webp`', `image: \`${publicPrefix}/blog/\${slug}.webp\``);
    return next;
  });
  if (changed) changedFiles.push(relativePath);
}

if (writeIfChanged('src/main.jsx', normalizeMainJs)) {
  changedFiles.push('src/main.jsx');
}

const afterLocations = countImageLocations();
const generatedSiteReferences = fileReplacementTargets.concat('src/main.jsx').reduce((total, relativePath) => {
  const content = fs.readFileSync(path.join(root, relativePath), 'utf8');
  return total + (content.match(/\/images\/generated-site\//g) || []).length;
}, 0);

const payload = {
  generated_at: new Date().toISOString(),
  homepage_protected: true,
  source_root: sourceRoot,
  scanned_images_total: candidates.length,
  usable_images_total: candidates.length - excludedIndexes.size,
  excluded_images_total: excludedIndexes.size,
  excluded_images: [...excludedIndexes].map((index) => ({
    index,
    file: byIndex.get(index)?.file || null,
    reason: index >= 148 ? 'Contact sheet or QA screenshot, not a website material' : 'Visible text/third-party promotional content or unsafe crop',
  })),
  site_image_locations_scanned: beforeLocations,
  changed_files: changedFiles,
  generated_assets_count: generatedAssets.length,
  generated_blog_covers_count: generatedBlogCovers.length,
  replacement_references_count: generatedSiteReferences,
  before_image_location_count: beforeLocations,
  after_image_location_count: afterLocations,
  generated_assets: generatedAssets,
  generated_blog_covers: generatedBlogCovers,
  unsupported_positions: unsupportedPositions,
  homepage_protection: {
    homepage_route: '/',
    files_not_modified_by_script: ['index.html', 'src/styles.css', 'src/Silk.jsx'],
    homepage_data_preserved: ['heroFallbackImage', 'factoryImages', 'customProducts.image'],
  },
  notes: [
    'Homepage JSX and homepage image data were intentionally preserved.',
    'Generated images are new WebP files under public/images/generated-site; original images were not overwritten.',
    'Dog waste bag imagery was left unchanged where no clean matching source was available.',
  ],
};

fs.writeFileSync(reportJsonPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
fs.writeFileSync(statePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

const md = [
  '# Image Replacement Report',
  '',
  `Generated at: ${payload.generated_at}`,
  '',
  '## Summary',
  '',
  `- Scanned candidate images: ${payload.scanned_images_total}`,
  `- Usable candidate images: ${payload.usable_images_total}`,
  `- Excluded candidate images: ${payload.excluded_images_total}`,
  `- Site image locations scanned: ${payload.site_image_locations_scanned}`,
  `- Generated reusable assets: ${payload.generated_assets_count}`,
  `- Generated blog covers: ${payload.generated_blog_covers_count}`,
  `- Replacement references written: ${payload.replacement_references_count}`,
  `- Changed source/data files: ${payload.changed_files.length}`,
  '',
  '## Homepage Protection',
  '',
  '- Homepage route `/` was treated as protected.',
  '- `index.html`, `src/styles.css`, and `src/Silk.jsx` were not modified by the replacement script.',
  '- `heroFallbackImage`, `factoryImages`, and `customProducts.image` were preserved for homepage rendering.',
  '',
  '## Unsupported / Unreplaced Positions',
  '',
  ...unsupportedPositions.map((item) => `- ${item.location}: kept ${item.current_image}. ${item.reason}`),
  '',
  '## Changed Files',
  '',
  ...changedFiles.map((file) => `- ${file}`),
  '',
  '## Excluded Images',
  '',
  ...payload.excluded_images.map((item) => `- #${item.index} ${item.file}: ${item.reason}`),
  '',
].join('\n');

fs.writeFileSync(reportMdPath, `${md}\n`, 'utf8');

console.log(`Generated ${generatedAssets.length} reusable assets and ${generatedBlogCovers.length} blog covers.`);
console.log(`Replacement references written: ${generatedSiteReferences}`);
console.log(`Report: ${reportJsonPath}`);
