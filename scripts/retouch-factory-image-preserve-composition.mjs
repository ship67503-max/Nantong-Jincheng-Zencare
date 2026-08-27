import path from 'node:path';
import sharp from 'sharp';

const [, , inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
  throw new Error('Usage: node scripts/retouch-factory-image-preserve-composition.mjs <input> <output>');
}

const metadata = await sharp(inputPath).metadata();

await sharp(inputPath, { failOn: 'none' })
  .rotate()
  .normalize({ lower: 0.8, upper: 99.2 })
  .modulate({ brightness: 1.035, saturation: 1.025 })
  .sharpen({ sigma: 0.72, m1: 0.85, m2: 1.15 })
  .webp({ quality: 92, effort: 6 })
  .toFile(outputPath);

const result = await sharp(outputPath).metadata();

if (metadata.width !== result.width || metadata.height !== result.height) {
  throw new Error(`Composition dimensions changed: ${metadata.width}x${metadata.height} -> ${result.width}x${result.height}`);
}

console.log(`${path.basename(outputPath)}: ${result.width}x${result.height}`);
