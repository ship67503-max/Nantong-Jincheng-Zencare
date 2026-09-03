import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { blogExpansionSpecs } from '../src/blogExpansionData.js';

const rootDir = process.cwd();
const outputDir = path.join(rootDir, 'public', 'images', 'blog');
const force = process.argv.includes('--force');
const width = 1600;
const height = 900;
const positions = ['centre', 'north', 'south', 'east', 'west'];

const escapeXml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const hashText = (value) =>
  [...value].reduce((total, character) => ((total * 31) + character.charCodeAt(0)) >>> 0, 7);

const wrapTitle = (title, maxLength = 31) => {
  const words = title.split(/\s+/);
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (nextLine.length > maxLength && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines.slice(0, 3);
};

const buildOverlay = (article) => {
  const lines = wrapTitle(article.title);
  const startY = 570 - ((lines.length - 1) * 54);
  const lineMarkup = lines
    .map((line, index) => `<tspan x="92" dy="${index === 0 ? 0 : 74}">${escapeXml(line)}</tspan>`)
    .join('');

  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#06150e" stop-opacity="0.94"/>
          <stop offset="0.55" stop-color="#06150e" stop-opacity="0.56"/>
          <stop offset="1" stop-color="#06150e" stop-opacity="0.08"/>
        </linearGradient>
        <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.35" stop-color="#06150e" stop-opacity="0"/>
          <stop offset="1" stop-color="#06150e" stop-opacity="0.65"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#shade)"/>
      <rect width="${width}" height="${height}" fill="url(#bottom)"/>
      <rect x="92" y="90" width="132" height="6" rx="3" fill="#D9FB76"/>
      <text x="92" y="146" fill="#D9FB76" font-size="24" font-weight="700" font-family="Arial, Helvetica, sans-serif" letter-spacing="2">${escapeXml(article.category.toUpperCase())}</text>
      <text x="92" y="${startY}" fill="#F6F8ED" font-size="62" font-weight="700" font-family="Arial, Helvetica, sans-serif" letter-spacing="0">${lineMarkup}</text>
      <text x="92" y="810" fill="#F6F8ED" fill-opacity="0.76" font-size="24" font-family="Arial, Helvetica, sans-serif">Practical sourcing insight for OEM / ODM buyers</text>
    </svg>
  `);
};

await fs.mkdir(outputDir, { recursive: true });

let generated = 0;
let skipped = 0;

for (const article of blogExpansionSpecs) {
  const sourcePath = path.join(rootDir, 'public', article.profile.sourceImage.replace(/^\//, ''));
  const outputPath = path.join(outputDir, `${article.slug}.webp`);

  if (!force) {
    try {
      await fs.access(outputPath);
      skipped += 1;
      continue;
    } catch {
      // Generate missing cover.
    }
  }

  const position = positions[hashText(article.slug) % positions.length];
  await sharp(sourcePath)
    .rotate()
    .resize(width, height, { fit: 'cover', position })
    .modulate({ saturation: 0.9, brightness: 0.92 })
    .composite([{ input: buildOverlay(article), top: 0, left: 0 }])
    .webp({ quality: 79, effort: 5 })
    .toFile(outputPath);

  generated += 1;
}

console.log(`Generated ${generated} blog cover${generated === 1 ? '' : 's'}; skipped ${skipped}.`);

