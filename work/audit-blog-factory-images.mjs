import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sourceDir = path.resolve('public/images/generated-site/blog');
const allMode = process.argv.includes('--all');
const outputDir = path.resolve(allMode ? 'work/blog-image-audit-all' : 'work/blog-factory-audit');
const pattern = /factory|manufactur|production|automation|capacity|maintenance|supplier|oem/i;
const files = (await fs.readdir(sourceDir))
  .filter((name) => name.endsWith('.webp') && (allMode || pattern.test(name)))
  .sort();

await fs.mkdir(outputDir, { recursive: true });

const columns = 4;
const rows = 4;
const cardWidth = 380;
const cardHeight = 250;
const imageWidth = 356;
const imageHeight = 200;
const pageSize = columns * rows;

const escapeXml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

for (let page = 0; page * pageSize < files.length; page += 1) {
  const pageFiles = files.slice(page * pageSize, (page + 1) * pageSize);
  const composites = [];

  for (let index = 0; index < pageFiles.length; index += 1) {
    const file = pageFiles[index];
    const left = (index % columns) * cardWidth + 12;
    const top = Math.floor(index / columns) * cardHeight + 12;
    const thumbnail = await sharp(path.join(sourceDir, file))
      .resize(imageWidth, imageHeight, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();
    const label = Buffer.from(`
      <svg width="${imageWidth}" height="34" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#ffffff"/>
        <text x="2" y="22" font-family="Arial" font-size="15" fill="#111111">${escapeXml(file.replace('.webp', ''))}</text>
      </svg>
    `);
    composites.push({ input: thumbnail, left, top });
    composites.push({ input: label, left, top: top + imageHeight + 4 });
  }

  await sharp({
    create: {
      width: columns * cardWidth,
      height: rows * cardHeight,
      channels: 3,
      background: '#e8edf0',
    },
  })
    .composite(composites)
    .png()
    .toFile(path.join(outputDir, `factory-candidates-${page + 1}.png`));
}

console.log(JSON.stringify({ files: files.length, pages: Math.ceil(files.length / pageSize), outputDir }));
