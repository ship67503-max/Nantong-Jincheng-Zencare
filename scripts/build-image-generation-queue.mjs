import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { allSeoEntries } from './seo-page-data.mjs';

const root = process.cwd();
const queuePath = path.join(root, 'docs', 'image-generation-queue.json');
const homepageBaselinePath = path.join(root, 'docs', 'homepage-image-protection-baseline.json');

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96) || 'page';

const classify = (entry) => {
  const route = entry.path.toLowerCase();
  const value = `${entry.title} ${entry.description}`.toLowerCase();

  if (route.includes('adult-underpad') || route.includes('hospital-underpad') || route.includes('nursing-home-underpad')) return 'adult-underpads';
  if (route.includes('dog-poop-bag') || route.includes('pet-waste-bag')) return 'dog-poop-bags';
  if (route.includes('pet-care-pad') || route.includes('glove-wipe')) return 'pet-pads';
  if (route.includes('absorbent-paper')) return 'materials';
  if (route.includes('pet-training-pad') || route.includes('puppy-pad') || route.includes('pet-pad')) return 'pet-pads';
  if (route.includes('quality-control') || route.includes('inspection') || route.includes('testing-laboratory')) return 'quality-control';
  if (route.includes('warehouse') || route.includes('container-loading') || route.includes('shipping') || route.includes('logistics')) return 'warehouse';
  if (route.includes('packaging') || route.includes('private-label') || route.includes('carton')) return 'packaging';
  if (route.includes('materials') || route.includes('sap-') || route.includes('fluff-pulp') || route.includes('pe-film') || route.includes('nonwoven')) return 'materials';
  if (route.startsWith('/factory/')) return 'factory';
  if (route.includes('oem') || route.includes('odm') || route.includes('customization')) return 'oem-odm';
  if (route.includes('contact')) return 'contact';
  if (route.includes('about') || route.includes('profile') || route.includes('team')) return 'about';
  if (route.startsWith('/blog/')) return 'blog';
  if (value.includes('adult underpad') || value.includes('hospital underpad') || value.includes('nursing')) return 'adult-underpads';
  if (value.includes('pet pad') || value.includes('puppy pad') || value.includes('training pad')) return 'pet-pads';
  return 'misc';
};

const readImageMetadata = async (publicPath) => {
  const relativePath = publicPath?.replace(/^\//, '');
  const filePath = relativePath ? path.join(root, 'public', relativePath) : '';

  if (!filePath || !fs.existsSync(filePath)) {
    return { width: null, height: null, aspectRatio: null, fileExists: false };
  }

  try {
    const metadata = await sharp(filePath).metadata();
    const width = metadata.width ?? null;
    const height = metadata.height ?? null;
    return {
      width,
      height,
      aspectRatio: width && height ? Number((width / height).toFixed(4)) : null,
      fileExists: true,
    };
  } catch {
    return { width: null, height: null, aspectRatio: null, fileExists: true };
  }
};

const usedNames = new Map();
const tasks = [];
const priorityPaths = [
  '/products/disposable-pet-pads',
  '/products/adult-underpads',
  '/products/pet-care-pad-glove-wipes',
  '/products/pet-absorbent-paper-sheets',
  '/products/custom-pet-waste-bags',
];
const entries = allSeoEntries
  .filter((item) => item.path !== '/')
  .sort((left, right) => {
    const leftPriority = priorityPaths.indexOf(left.path);
    const rightPriority = priorityPaths.indexOf(right.path);
    if (leftPriority !== -1 || rightPriority !== -1) {
      if (leftPriority === -1) return 1;
      if (rightPriority === -1) return -1;
      return leftPriority - rightPriority;
    }
    return 0;
  });

for (const [index, entry] of entries.entries()) {
  const category = classify(entry);
  const baseName = slugify(entry.path.replace(/^\//, '').replaceAll('/', '-'));
  const occurrence = (usedNames.get(baseName) ?? 0) + 1;
  usedNames.set(baseName, occurrence);
  const outputStem = occurrence === 1 ? baseName : `${baseName}-${occurrence}`;
  const metadata = await readImageMetadata(entry.image);
  const expectedSubject =
    entry.productName ||
    entry.authorityPage?.h1 ||
    entry.blogArticle?.title ||
    entry.title.replace(/\s*\|\s*JCZCARE.*$/i, '');

  tasks.push({
    task_id: `task-${String(index + 1).padStart(4, '0')}`,
    page_url: entry.path,
    page_title: entry.title,
    category,
    section_name: 'Primary content image',
    existing_image_path: entry.image || null,
    target_image_path: `/generated-images/${category}/${outputStem}.webp`,
    image_role: 'hero',
    width: metadata.width,
    height: metadata.height,
    aspect_ratio: metadata.aspectRatio,
    expected_subject: expectedSubject,
    expected_alt: entry.authorityPage?.imageAlt || entry.blogArticle?.imageAlt || expectedSubject,
    status: 'pending',
    source_download_file: null,
    output_filename: `${outputStem}.webp`,
    sha256: null,
    perceptual_hash: null,
    replacement_status: 'pending',
    validation_status: 'pending',
    retry_count: 0,
    notes: metadata.fileExists ? '' : 'Existing image file was not found during queue recovery.',
  });
}

const payload = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  source: 'Existing 393-route SEO registry; homepage excluded',
  homepage_protected: true,
  total_tasks: tasks.length,
  tasks,
};

fs.writeFileSync(queuePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

const protectedHomepageFiles = [
  'index.html',
  'src/Silk.jsx',
  'src/styles.css',
  'public/images/factory-campus.jpeg',
  'public/images/custom-disposable-pet-pads-premium.png',
  'public/images/pet-pad-layer-protection-premium.png',
  'public/images/quality-inspection-lab-mask.png',
  'public/images/contact-pets-grass-centered.png',
  'public/images/production-line-clean.png',
];

const protectedFiles = protectedHomepageFiles.map((relativePath) => {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) return { path: relativePath, exists: false, sha256: null };
  return {
    path: relativePath,
    exists: true,
    sha256: crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex'),
  };
});

fs.writeFileSync(
  homepageBaselinePath,
  `${JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      branch: 'codex/regenerate-non-homepage-images',
      note: 'Protected homepage assets and non-route-specific presentation files. src/main.jsx is shared by homepage and inner routes and must be reviewed by diff instead of whole-file hash.',
      files: protectedFiles,
    },
    null,
    2,
  )}\n`,
  'utf8',
);
console.log(`Wrote ${tasks.length} non-homepage image tasks to ${queuePath}`);
console.log(`Wrote homepage protection baseline to ${homepageBaselinePath}`);
