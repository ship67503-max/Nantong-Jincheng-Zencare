import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

const sourceDir = path.resolve(process.argv[2]);
const publicDir = path.resolve(process.argv[3] ?? "public");

if (!sourceDir) throw new Error("Usage: node replace_product_card_images.mjs <source-dir> [public-dir]");

const mappings = [
  {
    product: "Disposable Pet Training Pads",
    source: "f595b27f-81ec-4e4a-9a30-b332bd9db293.png",
    targets: [
      "images/oem/products/custom-disposable-pet-pads-premium.png",
      "images/oem/products/custom-disposable-pet-pads-premium.webp",
      "images/custom-disposable-pet-pads-premium.png",
      "images/custom-disposable-pet-pads-premium.webp",
    ],
  },
  {
    product: "Adult Underpads",
    source: "f19cfc3c-08d6-49cc-babe-188dfa7b42cc.png",
    targets: [
      "images/oem/products/adult-underpads-hero.png",
      "images/oem/products/adult-underpads-hero.webp",
      "images/adult-underpads-hero.png",
      "images/adult-underpads-hero.webp",
    ],
  },
  {
    product: "Pet Absorbent Paper",
    source: "f0e550d4-c506-442c-8b7c-02c9e09b3cc3.png",
    targets: [
      "images/oem/products/custom-absorbent-paper-ai.png",
      "images/oem/products/custom-absorbent-paper-ai.webp",
      "images/custom-absorbent-paper-ai.png",
      "images/custom-absorbent-paper-ai.webp",
    ],
  },
  {
    product: "Disposable Cleaning Products",
    source: "06dc5384-6fb5-4e94-954d-8636e4bf6d92.png",
    targets: [
      "images/custom-care-pad-packaging-ai.png",
      "images/custom-care-pad-packaging-ai.webp",
    ],
  },
  {
    product: "Custom Pet Waste Bags",
    source: "ChatGPT Image 2026年8月7日 16_07_34.png",
    targets: [
      "images/oem/products/custom-pet-waste-bags-ai.png",
      "images/oem/products/custom-pet-waste-bags-ai.webp",
      "images/custom-pet-waste-bags-ai.png",
      "images/custom-pet-waste-bags-ai.webp",
    ],
  },
  {
    product: "Charcoal Pet Pads",
    source: "4208873e-f8e2-4a03-b015-d8b5799b7cd1.png",
    targets: [
      "images/oem/products/custom-charcoal-pet-pad-ai.png",
      "images/oem/products/custom-charcoal-pet-pad-ai.webp",
      "images/custom-charcoal-pet-pad-ai.png",
      "images/custom-charcoal-pet-pad-ai.webp",
    ],
  },
  {
    product: "Adhesive Pet Pads",
    source: "6c9ce577-56c3-4a8c-9b7c-0ed0e00857fd.png",
    targets: [
      "images/oem/products/custom-adhesive-pet-pad-ai.png",
      "images/oem/products/custom-adhesive-pet-pad-ai.webp",
      "images/custom-adhesive-pet-pad-ai.png",
      "images/custom-adhesive-pet-pad-ai.webp",
    ],
  },
];

const sha256 = (data) => createHash("sha256").update(data).digest("hex");
const replaceFile = async (targetPath, data) => {
  const backupPath = `${targetPath}.codex-product-backup-${process.pid}-${Date.now()}`;
  let existed = false;
  try {
    await fs.access(targetPath);
    existed = true;
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }

  if (existed) await fs.rename(targetPath, backupPath);
  try {
    await fs.writeFile(targetPath, data);
    if (existed) await fs.unlink(backupPath);
  } catch (error) {
    try { await fs.unlink(targetPath); } catch (cleanupError) { if (cleanupError?.code !== "ENOENT") throw cleanupError; }
    if (existed) await fs.rename(backupPath, targetPath);
    throw error;
  }
};

const report = [];
for (const mapping of mappings) {
  const sourcePath = path.join(sourceDir, mapping.source);
  const sourceBuffer = await fs.readFile(sourcePath);
  const sourceMetadata = await sharp(sourceBuffer).metadata();
  for (const target of mapping.targets) {
    const targetPath = path.resolve(publicDir, target);
    const publicImagesDir = path.resolve(publicDir, "images");
    if (!targetPath.startsWith(`${publicImagesDir}${path.sep}`)) throw new Error(`Unsafe target: ${target}`);
    const extension = path.extname(targetPath).toLowerCase();
    const outputBuffer = extension === ".webp"
      ? await sharp(sourceBuffer).rotate().webp({ quality: 86, smartSubsample: true }).toBuffer()
      : sourceBuffer;
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await replaceFile(targetPath, outputBuffer);
    const outputMetadata = await sharp(outputBuffer).metadata();
    report.push({
      product: mapping.product,
      source: mapping.source,
      target,
      sourceFormat: sourceMetadata.format,
      sourceWidth: sourceMetadata.width,
      sourceHeight: sourceMetadata.height,
      outputFormat: outputMetadata.format,
      outputWidth: outputMetadata.width,
      outputHeight: outputMetadata.height,
      bytes: outputBuffer.length,
      sha256: sha256(outputBuffer),
    });
  }
}

const reportPath = path.resolve("work", "product-card-image-replacement-report.json");
await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify({ products: mappings.length, targets: report.length, reportPath }, null, 2));
