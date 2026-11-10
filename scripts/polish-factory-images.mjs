import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const workspaceRoot = process.cwd();
const sourceRoots = [
  'public/images/oem/factory',
  'public/images/oem/production',
  'public/images/oem/warehouse',
  'public/images/oem/quality',
  'public/images/generated-site/factory',
  'public/images/generated-site/quality-control',
  'public/images/generated-site/b2b-optimization',
].map((relativePath) => path.join(workspaceRoot, relativePath));
const backupRoot = path.join(workspaceRoot, 'work', 'factory-image-polish-originals-20260808');
const outputRoot = path.join(workspaceRoot, 'work', 'factory-image-polish-output-20260808');
const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function listImages(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listImages(fullPath));
    } else if (supportedExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

function relativeBackupPath(filePath) {
  return path.join(backupRoot, path.relative(workspaceRoot, filePath));
}

async function polishImage(inputPath, outputPath) {
  const extension = path.extname(inputPath).toLowerCase();
  const sourceBuffer = await fs.readFile(inputPath);
  let pipeline = sharp(sourceBuffer, { failOn: 'none' })
    .rotate()
    .normalize({ lower: 1, upper: 99 })
    .modulate({ brightness: 1.035, saturation: 1.04 })
    .sharpen({ sigma: 0.65, m1: 0.9, m2: 1.2 });

  if (extension === '.jpg' || extension === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: 90, mozjpeg: true });
  } else if (extension === '.png') {
    pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
  } else {
    pipeline = pipeline.webp({ quality: 88, effort: 5 });
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await pipeline.toFile(outputPath);
}

const sourceFiles = (await Promise.all(sourceRoots.map(listImages))).flat().sort();
await fs.mkdir(backupRoot, { recursive: true });
await fs.mkdir(outputRoot, { recursive: true });

const results = [];
for (const sourcePath of sourceFiles) {
  const backupPath = relativeBackupPath(sourcePath);
  await fs.mkdir(path.dirname(backupPath), { recursive: true });
  try {
    await fs.access(backupPath);
  } catch {
    await fs.copyFile(sourcePath, backupPath);
  }
  const before = (await fs.stat(sourcePath)).size;
  const outputPath = path.join(outputRoot, path.relative(workspaceRoot, sourcePath));
  await polishImage(backupPath, outputPath);
  const after = (await fs.stat(outputPath)).size;
  results.push({ path: path.relative(workspaceRoot, sourcePath), before, after, outputPath });
}

console.log(`Polished ${results.length} factory-related images.`);
console.log(`Originals backed up to ${path.relative(workspaceRoot, backupRoot)}.`);
for (const result of results) {
  console.log(`${result.path}\t${result.before} -> ${result.after} bytes`);
}
