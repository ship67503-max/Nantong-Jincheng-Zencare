import fs from 'node:fs/promises';
import fssync from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { blogArticles } from '../src/blogData.js';

const root = process.cwd();
const promptDir = path.join(root, 'docs', 'blog-image-prompts');
const draftDir = path.join(root, 'public', 'images', 'generated-site', 'blog-nomiss-drafts');
const finalDir = path.join(root, 'public', 'images', 'generated-site', 'blog');
const auditDir = path.join(root, 'docs', 'blog-image-audit');
const manifestPath = path.join(auditDir, 'blog-image-regeneration-manifest.json');
const reportJsonPath = path.join(root, 'blog-image-regeneration-report.json');
const reportMdPath = path.join(root, 'blog-image-regeneration-report.md');

const pythonPath =
  process.env.CODEX_BUNDLED_PYTHON ||
  'C:\\Users\\Administrator\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe';
const nomissScript =
  process.env.NOMISS_IMAGE_SCRIPT ||
  'C:\\Users\\Administrator\\.codex\\skills\\nomiss-generate-images\\scripts\\generate_image.py';

const args = new Set(process.argv.slice(2));
const concurrencyArg = process.argv.find((arg) => arg.startsWith('--concurrency='));
const concurrency = Math.max(1, Number(concurrencyArg?.split('=')[1] || 3));
const timeoutArg = process.argv.find((arg) => arg.startsWith('--timeout-seconds='));
const requestTimeoutMs = Math.max(60, Number(timeoutArg?.split('=')[1] || 240)) * 1000;
const force = args.has('--force');

const categoryBriefs = {
  'OEM Manufacturing': 'clean absorbent-product manufacturing line, sample approval bench, material rolls, sealed blank cartons, process-control atmosphere',
  'Pet Training Pads': 'pet training pad samples, layered absorbent cores, nonwoven surface detail, neat product testing setup, soft pet-care retail mood',
  'Industry Insights': 'modern B2B pet product sourcing scene, procurement desk with blank papers, factory sample materials, neutral business lighting',
  'Adult Underpads': 'adult underpad product samples, clinical clean tabletop, absorbent sheet layers, hygiene-care procurement setting',
  'Dog Poop Bags': 'dog waste bag rolls, dispenser samples, blank retail packs, export carton preparation, clean pet accessory product styling',
  'Buying Guide': 'buyer comparison scene with physical product samples, blank specification sheets, packaging prototypes, calm sourcing workspace',
  Factory: 'bright hygienic factory floor, production equipment, organized material staging, export-ready operations',
  'Private Label': 'blank private-label packaging mockups, pet care product samples, color swatches without text, retail launch planning table',
  Packaging: 'blank flexible packaging, cartons, dieline-shaped plain paper, pack-out sample arrangement, no printed marks',
  'Quality Control': 'quality inspection lab, absorbency testing setup, gloved hands, calibrated instruments, clean sample review',
  'Factory Audit': 'factory audit walkthrough, production records represented by blank sheets, warehouse and line inspection atmosphere',
  Shipping: 'container loading plan, palletized blank cartons, moisture-control materials, export logistics environment',
  Materials: 'absorbent raw materials, nonwoven, pulp, SAP granules, PE film layers, macro material study',
  'Import Guide': 'international sourcing desk with blank documents, cartons, product samples, freight planning objects',
  'SAP Technology': 'super absorbent polymer granules and pet pad layer cross-section, controlled lab lighting',
  'PE Film': 'PE film roll detail, waterproof backing layer sample, lamination material inspection',
  Procurement: 'procurement comparison table with product samples, blank documents, calculator, cartons, supplier evaluation mood',
  'Supplier Qualification': 'supplier qualification review with factory samples, blank audit sheets, product materials, professional buyer desk',
  'Supplier Selection': 'supplier selection scene with factory exterior context, sample pads, blank checklist, B2B sourcing atmosphere',
  'OEM / ODM': 'OEM and ODM pet pad samples, customization prototypes, blank packaging, production planning setup',
  Manufacturing: 'absorbent product manufacturing line and controlled production workflow',
  Performance: 'absorbency performance test with clean liquid, pad layers, laboratory sample tray',
  Ordering: 'repeat-order planning scene with product samples, cartons, blank schedule sheets, procurement workspace',
};

const styleVariants = [
  'editorial product photography',
  'cinematic realistic industrial photography',
  'premium B2B website cover image',
  'clean macro product photography',
  'documentary factory photography',
  'polished procurement desk still life',
  'bright commercial studio photography',
  'technical material close-up',
];

const paletteVariants = [
  'cool white, stainless steel, fresh green accent',
  'warm daylight, soft blue-gray, natural green accent',
  'neutral white, charcoal, muted teal accent',
  'clean ivory, light gray, restrained yellow-green accent',
  'soft daylight, pale aqua, graphite accent',
  'factory white, aluminum gray, calm blue accent',
  'matte white, sage green, soft shadow',
  'clinical white, transparent blue liquid, gentle green accent',
];

const cameraVariants = [
  'three-quarter overhead composition with strong depth',
  'low-angle close product foreground with factory context behind',
  'macro foreground detail with softly focused workspace background',
  'wide horizontal composition with clear negative space',
  'hands-in-frame professional review scene, faces not visible',
  'organized tabletop flat lay with layered materials',
  'warehouse aisle perspective with product samples in foreground',
  'clean lab bench perspective with test samples and instruments',
];

const hashNumber = (value) => {
  const hash = crypto.createHash('sha256').update(value).digest();
  return hash.readUInt32BE(0);
};

const pick = (list, seed, offset = 0) => list[(seed + offset) % list.length];

const compact = (value = '', max = 260) =>
  String(value)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

const promptForArticle = (article, index) => {
  const seed = hashNumber(article.slug);
  const categoryBrief = categoryBriefs[article.category] || categoryBriefs['Industry Insights'];
  const subject = [
    categoryBrief,
    `specific article topic: ${article.title}`,
    `primary buyer keyword: ${article.primaryKeyword}`,
    `core message: ${compact(article.coreAngle || article.metaDescription, 220)}`,
    `buyer scenario: ${compact(article.buyerScenario || article.intro, 180)}`,
    `risk to imply visually: ${compact(article.riskFocus || '', 160)}`,
  ]
    .filter(Boolean)
    .join('; ');

  return [
    `Create one unique landscape blog cover image for a professional B2B pet-care manufacturing website.`,
    `Article ${index + 1} of ${blogArticles.length}: "${article.title}".`,
    `Visual subject: ${subject}.`,
    `Composition: ${pick(cameraVariants, seed)}; ${pick(styleVariants, seed, 2)}; realistic clean commercial image, not an illustration.`,
    `Palette and lighting: ${pick(paletteVariants, seed, 4)}, bright controlled lighting, high clarity, trustworthy manufacturing mood.`,
    `Make this image visibly different from other blog covers by using article-specific objects, angle, background, material focus, and color accents.`,
    `No people posing; if hands appear, only professional gloved hands interacting with products or samples.`,
    `Strict exclusions: no visible text, no labels, no screen content, no readable marks, no pseudo text, no letters, no numbers, no logos, no watermarks, blank documents only, blank packaging only, blank cartons only.`,
    `Avoid homepage hero styling, dark blurry stock-photo atmosphere, decorative graphics, icons, UI mockups, and collage layouts.`,
  ].join('\n');
};

const ensureDirs = async () => {
  await fs.mkdir(promptDir, { recursive: true });
  await fs.mkdir(draftDir, { recursive: true });
  await fs.mkdir(finalDir, { recursive: true });
  await fs.mkdir(auditDir, { recursive: true });
};

const createManifest = async () => {
  await ensureDirs();
  const entries = [];
  for (const [index, article] of blogArticles.entries()) {
    const prompt = promptForArticle(article, index);
    const promptPath = path.join(promptDir, `${article.slug}.txt`);
    const draftPath = path.join(draftDir, `${article.slug}.webp`);
    const finalPath = path.join(finalDir, `${article.slug}.webp`);
    await fs.writeFile(promptPath, prompt, 'utf8');
    entries.push({
      index: index + 1,
      slug: article.slug,
      title: article.title,
      category: article.category,
      primaryKeyword: article.primaryKeyword,
      promptPath,
      draftPath,
      finalPath,
      publicPath: `/images/generated-site/blog/${article.slug}.webp`,
      articlePath: article.path,
    });
  }
  await fs.writeFile(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), entries }, null, 2), 'utf8');
  console.log(`Prepared ${entries.length} blog image prompts.`);
  console.log(`Manifest: ${manifestPath}`);
  return entries;
};

const fileReady = (file) => {
  try {
    return fssync.statSync(file).size > 20_000;
  } catch {
    return false;
  }
};

const runOne = (entry) =>
  new Promise((resolve) => {
    let settled = false;
    const child = spawn(
      pythonPath,
      [
        nomissScript,
        '--prompt-file',
        entry.promptPath,
        '--output',
        entry.draftPath,
        '--size',
        '1536x1024',
        '--quality',
        'medium',
        '--format',
        'webp',
      ],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill('SIGTERM');
      resolve({
        entry,
        code: -1,
        stdout: stdout.trim(),
        stderr: `${stderr.trim()}\nTimed out after 240 seconds.`.trim(),
        ok: false,
      });
    }, requestTimeoutMs);
    child.on('close', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve({ entry, code, stdout: stdout.trim(), stderr: stderr.trim(), ok: code === 0 && fileReady(entry.draftPath) });
    });
  });

const generateDrafts = async () => {
  const entries = await createManifest();
  const queue = entries.filter((entry) => force || !fileReady(entry.draftPath));
  const skipped = entries.length - queue.length;
  const failures = [];
  let completed = 0;

  console.log(`Generating ${queue.length} images with concurrency ${concurrency}; skipped ${skipped} existing drafts.`);

  let cursor = 0;
  const worker = async (workerIndex) => {
    while (cursor < queue.length) {
      const entry = queue[cursor++];
      const started = Date.now();
      console.log(`[${entry.index}/${entries.length}] start ${entry.slug} (worker ${workerIndex})`);
      let result = await runOne(entry);
      if (!result.ok) {
        console.log(`[${entry.index}/${entries.length}] retry ${entry.slug}`);
        result = await runOne(entry);
      }
      const seconds = Math.round((Date.now() - started) / 1000);
      if (result.ok) {
        completed += 1;
        console.log(`[${entry.index}/${entries.length}] ok ${entry.slug} ${seconds}s`);
      } else {
        failures.push({
          slug: entry.slug,
          title: entry.title,
          code: result.code,
          stderr: result.stderr.slice(-1000),
          stdout: result.stdout.slice(-1000),
        });
        console.log(`[${entry.index}/${entries.length}] failed ${entry.slug} ${seconds}s`);
      }
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, (_, index) => worker(index + 1)));
  await fs.writeFile(path.join(auditDir, 'blog-image-generation-failures.json'), JSON.stringify(failures, null, 2), 'utf8');
  console.log(`Generation complete. New: ${completed}; skipped: ${skipped}; failures: ${failures.length}`);
  if (failures.length) process.exitCode = 1;
};

const sha256 = async (file) => crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex');

const replaceFinals = async () => {
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  const missing = manifest.entries.filter((entry) => !fileReady(entry.draftPath));
  if (missing.length) {
    throw new Error(`Refusing to replace final images; ${missing.length} drafts are missing.`);
  }
  for (const entry of manifest.entries) {
    await sharp(entry.draftPath)
      .rotate()
      .resize(1536, 1024, { fit: 'cover', position: 'attention' })
      .webp({ quality: 86, effort: 5 })
      .toFile(entry.finalPath);
  }
  console.log(`Replaced ${manifest.entries.length} final blog images.`);
};

const makeContactSheets = async (entries) => {
  const thumbWidth = 256;
  const thumbHeight = 171;
  const cols = 5;
  const rows = 6;
  const perSheet = cols * rows;
  const sheets = [];

  for (let start = 0; start < entries.length; start += perSheet) {
    const batch = entries.slice(start, start + perSheet);
    const sheet = sharp({
      create: {
        width: cols * thumbWidth,
        height: rows * thumbHeight,
        channels: 3,
        background: '#f4f4f0',
      },
    });
    const composites = [];
    for (const [batchIndex, entry] of batch.entries()) {
      const left = (batchIndex % cols) * thumbWidth;
      const top = Math.floor(batchIndex / cols) * thumbHeight;
      const thumb = await sharp(entry.finalPath).resize(thumbWidth, thumbHeight, { fit: 'cover' }).jpeg({ quality: 82 }).toBuffer();
      composites.push({ input: thumb, left, top });
    }
    const output = path.join(auditDir, `blog-final-sheet-${Math.floor(start / perSheet) + 1}.jpg`);
    await sheet.composite(composites).jpeg({ quality: 86 }).toFile(output);
    sheets.push(output);
  }
  return sheets;
};

const auditFinals = async () => {
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  const entries = manifest.entries;
  const finalRecords = [];
  const missing = [];
  for (const entry of entries) {
    if (!fileReady(entry.finalPath)) {
      missing.push(entry);
      continue;
    }
    const meta = await sharp(entry.finalPath).metadata();
    finalRecords.push({
      slug: entry.slug,
      title: entry.title,
      category: entry.category,
      publicPath: entry.publicPath,
      articlePath: entry.articlePath,
      bytes: fssync.statSync(entry.finalPath).size,
      width: meta.width,
      height: meta.height,
      sha256: await sha256(entry.finalPath),
    });
  }

  const hashGroups = new Map();
  for (const record of finalRecords) {
    const group = hashGroups.get(record.sha256) || [];
    group.push(record.slug);
    hashGroups.set(record.sha256, group);
  }
  const duplicateHashes = [...hashGroups.entries()]
    .filter(([, slugs]) => slugs.length > 1)
    .map(([hash, slugs]) => ({ hash, slugs }));

  const sheets = await makeContactSheets(entries.filter((entry) => fileReady(entry.finalPath)));
  const payload = {
    generatedAt: new Date().toISOString(),
    source: 'Nomiss gpt-image-2 via nomiss-generate-images skill',
    size: '1536x1024',
    quality: 'medium',
    totalBlogArticles: blogArticles.length,
    regeneratedImages: finalRecords.length,
    missingImages: missing.map((entry) => ({ slug: entry.slug, title: entry.title })),
    duplicateHashGroups: duplicateHashes,
    uniqueSha256Count: hashGroups.size,
    promptDirectory: promptDir,
    draftDirectory: draftDir,
    finalDirectory: finalDir,
    contactSheets: sheets,
    entries: finalRecords,
  };

  await fs.writeFile(reportJsonPath, JSON.stringify(payload, null, 2), 'utf8');
  const md = [
    '# Blog Image Regeneration Report',
    '',
    `- Generated at: ${payload.generatedAt}`,
    `- Source: ${payload.source}`,
    `- Blog articles: ${payload.totalBlogArticles}`,
    `- Regenerated final images: ${payload.regeneratedImages}`,
    `- Missing images: ${payload.missingImages.length}`,
    `- Duplicate SHA-256 groups: ${payload.duplicateHashGroups.length}`,
    `- Unique SHA-256 count: ${payload.uniqueSha256Count}`,
    `- Prompt directory: \`${promptDir}\``,
    `- Draft directory: \`${draftDir}\``,
    `- Final directory: \`${finalDir}\``,
    '',
    '## Contact Sheets',
    ...sheets.map((sheet) => `- \`${sheet}\``),
    '',
    '## Missing Images',
    ...(payload.missingImages.length ? payload.missingImages.map((item) => `- ${item.slug}: ${item.title}`) : ['- None']),
    '',
    '## Duplicate Hash Groups',
    ...(payload.duplicateHashGroups.length
      ? payload.duplicateHashGroups.map((item) => `- ${item.hash}: ${item.slugs.join(', ')}`)
      : ['- None']),
  ].join('\n');
  await fs.writeFile(reportMdPath, `${md}\n`, 'utf8');
  console.log(`Audited ${payload.regeneratedImages} final images.`);
  console.log(`Report: ${reportMdPath}`);
  if (missing.length || duplicateHashes.length) process.exitCode = 1;
};

if (args.has('--prepare')) {
  await createManifest();
} else if (args.has('--generate')) {
  await generateDrafts();
} else if (args.has('--replace')) {
  await replaceFinals();
} else if (args.has('--audit')) {
  await auditFinals();
} else {
  console.log('Usage: node scripts/regenerate-blog-images-nomiss.mjs --prepare|--generate|--replace|--audit [--concurrency=3] [--force]');
}
