import fs from 'node:fs/promises';
import fssync from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const sourceRoot = 'D:\\WebsiteImages';
const outputDir = path.join(root, 'public', 'images', 'generated-site', 'b2b-optimization');
const auditDir = path.join(root, 'docs', 'b2b-optimization');
const manifestPath = path.join(auditDir, 'image-manifest.json');
const allowed = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const slugs = [
  'download-center-catalog',
  'oem-sample-review',
  'private-label-packaging-review',
  'factory-capability-workshop',
  'quality-control-lab',
  'production-process-line',
  'product-specification-samples',
  'packaging-customization-options',
  'warehouse-export-prep',
  'business-meeting-oem',
  'material-inspection',
  'absorbency-testing',
];

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else if (allowed.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
};

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(auditDir, { recursive: true });

if (!fssync.existsSync(sourceRoot)) {
  await fs.writeFile(manifestPath, JSON.stringify({ sourceRoot, converted: [], note: 'Source directory not found.' }, null, 2), 'utf8');
  console.log('No D:\\WebsiteImages directory found.');
  process.exit(0);
}

const sourceFiles = (await walk(sourceRoot)).sort((a, b) => a.localeCompare(b, 'en'));
const selected = sourceFiles.slice(0, slugs.length);
const converted = [];

for (const [index, sourcePath] of selected.entries()) {
  const slug = slugs[index] || `b2b-source-${index + 1}`;
  const outputPath = path.join(outputDir, `${slug}.webp`);
  const image = sharp(sourcePath).rotate();
  const metadata = await image.metadata();
  await image
    .resize(1536, 1024, { fit: 'cover', position: 'attention' })
    .webp({ quality: 84, effort: 5 })
    .toFile(outputPath);
  converted.push({
    role: slug,
    sourcePath,
    outputPath,
    publicPath: `/images/generated-site/b2b-optimization/${slug}.webp`,
    originalWidth: metadata.width,
    originalHeight: metadata.height,
  });
}

await fs.writeFile(manifestPath, JSON.stringify({ sourceRoot, convertedAt: new Date().toISOString(), converted }, null, 2), 'utf8');

const thumbWidth = 256;
const thumbHeight = 171;
const cols = 4;
const rows = Math.ceil(converted.length / cols);
const composites = [];
for (const [index, item] of converted.entries()) {
  const thumb = await sharp(item.outputPath).resize(thumbWidth, thumbHeight, { fit: 'cover' }).jpeg({ quality: 82 }).toBuffer();
  composites.push({
    input: thumb,
    left: (index % cols) * thumbWidth,
    top: Math.floor(index / cols) * thumbHeight,
  });
}

if (converted.length) {
  await sharp({
    create: {
      width: cols * thumbWidth,
      height: rows * thumbHeight,
      channels: 3,
      background: '#f5f5f0',
    },
  })
    .composite(composites)
    .jpeg({ quality: 86 })
    .toFile(path.join(auditDir, 'b2b-source-contact-sheet.jpg'));
}

console.log(`Converted ${converted.length} images from ${sourceRoot}.`);
