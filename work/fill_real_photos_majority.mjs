import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const inputPath = 'C:/Users/Administrator/Documents/xwechat_files/wxid_xbi9o0tdyhpq12_be07/msg/file/2026-08/独立站AI图-新增产品图片.xlsx';
const productDir = 'C:/Users/Administrator/Documents/独立站修改/work/prepared_all/product';
const labDir = 'C:/Users/Administrator/Documents/独立站修改/work/prepared_all/lab';
const businessDir = 'C:/Users/Administrator/Documents/独立站修改/work/prepared_all/business';
const outputDir = `C:/Users/Administrator/Documents/独立站修改/outputs/${randomUUID()}`;
const outputPath = `${outputDir}/独立站AI图-新增产品图片-实拍图大比例填充.xlsx`;

const productKeywords = /(pet pad|underpad|absorbent paper|material|structure|packaging|macro|detail|pe film|film|charcoal|adhesive|training pad|disposable|white background|roll|sheet|pad\b|product display|包装|材料|结构|尿垫|吸水纸|吸收芯|底膜|无纺布|折叠|主图|细节|片材|卷材|样品)/i;
const labKeywords = /(quality|inspection|test|laboratory|lab|qc|rewet|absorb|absorption|pressure|defect|measurement|sample approval|scorecard|inspection plan|retained sample|corrective action|检验|测试|实验|压力|尺寸|质量|缺陷|吸收|抽检|留样|纠正|复核|校验)/i;
const businessKeywords = /(business|meeting|office|supplier|buyer|forecast|sourcing|negotiation|contract|moq|lead time|review|audit|factory tour|warehouse|shipping|logistics|container|launch|customer|communication|quotation|quote|cost|incoterms|fcl|lcl|采购|洽谈|商务|会议|沟通|报价|供应商|买家|订单|货运|仓储|预测|审核|参观|样品|确认|方案|对接|洽谈)/i;

function chooseCategory(text) {
  const t = String(text ?? '');
  if (productKeywords.test(t)) return 'product';
  if (labKeywords.test(t)) return 'lab';
  if (businessKeywords.test(t)) return 'business';
  return 'lab';
}

async function listImages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(e.name))
    .map((e) => path.join(dir, e.name))
    .sort((a, b) => a.localeCompare(b));
}

function toDataUrl(buffer, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime =
    ext === '.png' ? 'image/png' :
    ext === '.webp' ? 'image/webp' :
    'image/jpeg';
  return `data:${mime};base64,${Buffer.from(buffer).toString('base64')}`;
}

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const sheet = workbook.worksheets.getItem('AI图片总表');
const values = sheet.getRange('A1:G217').values;
sheet.deleteAllDrawings();
sheet.getRange('A2:P217').format.rowHeightPx = 112;

const productFiles = await listImages(productDir);
const labFiles = await listImages(labDir);
const businessFiles = await listImages(businessDir);

if (!productFiles.length || !labFiles.length || !businessFiles.length) {
  throw new Error('One or more image folders are empty.');
}

const queues = {
  product: productFiles,
  lab: labFiles,
  business: businessFiles,
};
const indexes = { product: 0, lab: 0, business: 0 };
const records = [];

for (let row = 2; row <= 217; row++) {
  const rowValues = values[row - 1] ?? [];
  const text = [rowValues[2], rowValues[3], rowValues[4]].filter(Boolean).join(' ');
  const category = chooseCategory(text);
  const files = queues[category];
  const filePath = files[indexes[category] % files.length];
  indexes[category] += 1;

  const dataUrl = toDataUrl(await fs.readFile(filePath), filePath);
  sheet.images.add({
    dataUrl,
    anchor: {
      from: { row: row - 1, col: 5 },
      extent: { widthPx: 160, heightPx: 100 },
    },
  });
  records.push({
    row,
    category,
    file: path.basename(filePath),
    title: rowValues[2] ?? '',
  });
}

await fs.mkdir(outputDir, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
await fs.writeFile(`${outputDir}/real_photo_mapping.json`, JSON.stringify(records, null, 2), 'utf8');
console.log(JSON.stringify({
  outputPath,
  rowsFilled: records.length,
  productUsed: indexes.product,
  labUsed: indexes.lab,
  businessUsed: indexes.business,
}, null, 2));
