import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

const manifestPath = process.argv[2];
const publicDir = path.resolve(process.argv[3] ?? "public");
const applyChanges = process.argv.includes("--apply");

if (!manifestPath) {
  throw new Error("Usage: node prepare_site_replacements.mjs <manifest.json> [public-dir] [--apply]");
}

const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const report = [];
const publicImagesDir = path.resolve(publicDir, "images");
const sha256 = (data) => createHash("sha256").update(data).digest("hex");

const writeFileWithRetry = async (targetPath, data, attempts = 4) => {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await fs.writeFile(targetPath, data);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 200));
      }
    }
  }
  throw lastError;
};

const replaceFile = async (targetPath, data, existed) => {
  if (!existed) {
    await writeFileWithRetry(targetPath, data);
    return;
  }

  const backupPath = `${targetPath}.codex-replace-${process.pid}-${Date.now()}`;
  await fs.rename(targetPath, backupPath);
  try {
    await writeFileWithRetry(targetPath, data);
    await fs.unlink(backupPath);
  } catch (error) {
    try {
      await fs.unlink(targetPath);
    } catch (cleanupError) {
      if (cleanupError?.code !== "ENOENT") throw cleanupError;
    }
    await fs.rename(backupPath, targetPath);
    throw error;
  }
};

const outputOptions = (extension) => {
  if (extension === ".webp") return { format: "webp", options: { quality: 86, smartSubsample: true } };
  if (extension === ".jpg" || extension === ".jpeg") {
    return { format: "jpeg", options: { quality: 88, mozjpeg: true } };
  }
  if (extension === ".png") {
    return { format: "png", options: { compressionLevel: 9, adaptiveFiltering: true } };
  }
  throw new Error(`Unsupported target extension: ${extension}`);
};

for (const item of manifest) {
  const sourcePath = path.resolve(item.extractedFile);
  const sourceMetadata = await sharp(sourcePath).metadata();

  for (const sitePath of item.currentPaths) {
    if (!sitePath.startsWith("/images/")) {
      throw new Error(`Row ${item.row} has an unsafe target path: ${sitePath}`);
    }

    const relativePath = sitePath.replace(/^\/+/, "").split("/").join(path.sep);
    const targetPath = path.resolve(publicDir, relativePath);
    if (targetPath !== publicImagesDir && !targetPath.startsWith(`${publicImagesDir}${path.sep}`)) {
      throw new Error(`Resolved path escapes public/images: ${sitePath}`);
    }

    let previousMetadata = null;
    let previousBytes = null;
    let previousHash = null;
    try {
      const previousBuffer = await fs.readFile(targetPath);
      previousMetadata = await sharp(previousBuffer).metadata();
      previousBytes = previousBuffer.length;
      previousHash = sha256(previousBuffer);
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }

    const extension = path.extname(targetPath).toLowerCase();
    const { format, options } = outputOptions(extension);
    let pipeline = sharp(sourcePath).rotate().resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    });
    if (format === "jpeg") pipeline = pipeline.flatten({ background: "#ffffff" });
    const outputBuffer = await pipeline.toFormat(format, options).toBuffer();
    const outputMetadata = await sharp(outputBuffer).metadata();

    if (applyChanges) {
      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      await replaceFile(targetPath, outputBuffer, previousMetadata !== null);
    }

    report.push({
      row: item.row,
      description: item.description,
      sitePath,
      targetPath,
      existed: previousMetadata !== null,
      source: {
        path: sourcePath,
        format: sourceMetadata.format,
        width: sourceMetadata.width,
        height: sourceMetadata.height,
      },
      previous: previousMetadata
        ? {
            format: previousMetadata.format,
            width: previousMetadata.width,
            height: previousMetadata.height,
            bytes: previousBytes,
            sha256: previousHash,
          }
        : null,
      output: {
        format: outputMetadata.format,
        width: outputMetadata.width,
        height: outputMetadata.height,
        bytes: outputBuffer.length,
        sha256: sha256(outputBuffer),
      },
    });
  }
}

const reportPath = path.resolve(path.dirname(manifestPath), applyChanges ? "applied-report.json" : "dry-run-report.json");
await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

const sourceSizes = new Map();
for (const entry of report) {
  const key = `${entry.source.width}x${entry.source.height}`;
  sourceSizes.set(key, (sourceSizes.get(key) ?? 0) + 1);
}

console.log(
  JSON.stringify(
    {
      mode: applyChanges ? "apply" : "dry-run",
      rows: new Set(report.map((entry) => entry.row)).size,
      targets: report.length,
      createdTargets: report.filter((entry) => !entry.existed).length,
      sourceSizes: Object.fromEntries([...sourceSizes.entries()].sort()),
      reportPath,
    },
    null,
    2,
  ),
);
