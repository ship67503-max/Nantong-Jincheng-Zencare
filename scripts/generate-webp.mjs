import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const rootDir = process.cwd();
const imagesDir = path.join(rootDir, 'public', 'images');
const sourceExtensions = new Set(['.png', '.jpg', '.jpeg']);

async function listImages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return listImages(fullPath);
    }
    return sourceExtensions.has(path.extname(entry.name).toLowerCase()) ? [fullPath] : [];
  }));
  return files.flat();
}

async function isOutdated(sourcePath, webpPath) {
  try {
    const [sourceStat, webpStat] = await Promise.all([fs.stat(sourcePath), fs.stat(webpPath)]);
    return sourceStat.mtimeMs > webpStat.mtimeMs;
  } catch {
    return true;
  }
}

const imagePaths = await listImages(imagesDir);
let generated = 0;

for (const imagePath of imagePaths) {
  const parsed = path.parse(imagePath);
  const webpPath = path.join(parsed.dir, `${parsed.name}.webp`);

  if (!(await isOutdated(imagePath, webpPath))) {
    continue;
  }

  await sharp(imagePath)
    .rotate()
    .webp({ quality: 78, effort: 5 })
    .toFile(webpPath);
  generated += 1;
}

console.log(`Generated ${generated} WebP image${generated === 1 ? '' : 's'}.`);
