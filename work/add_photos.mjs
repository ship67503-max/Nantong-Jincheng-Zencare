import fs from 'node:fs/promises';
import path from 'node:path';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const inputPath = 'C:/Users/Administrator/Desktop/独立站AI图-新增产品图片.xlsx';
const outputDir = 'outputs/019fda3e-27bd-7c42-a500-0654a578f42f';
const outputPath = `${outputDir}/独立站AI图-新增产品图片-已补充实拍图.xlsx`;
const preparedDir = 'work/prepared';

const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const sheet = wb.worksheets.getItem('AI图片总表');
const values = sheet.getRange('A1:P217').values;

const product = (name) => `work/prepared/${name}.jpg`;
const assignments = [
  // Product and material images
  { row: 3, files: ['497e8aed-0a86-4ac6-9c4e-e7ac8039dbba', '635b333e-d808-490a-97a1-073745495b15'] },
  { row: 4, files: ['297e7d56-6052-4322-bfa0-397eaf026db9', 'c188c885-a92d-4026-8cfb-3a58480439a6'] },
  { row: 5, files: ['e2c58bc0-9965-43dd-82c9-b4cb53be1ab0'] },
  { row: 6, files: ['573cf695-75f3-4013-9b91-53f767e8335d', '5f12246d-9740-48b2-8030-502a970451db', '619be7ce-cb5d-40b3-8a7f-5bab1b6da093', '8b883acd-b203-47fa-8dca-ae73f2911635'] },
  { row: 12, files: ['ca82bd11-11c4-4e76-b3c7-3892910279cf', 'e8bf62de-048e-4ea2-8590-d4b90a02419b', 'f1bec61a-99ba-45b3-840d-77280a671e92', 'f757d590-8eca-4374-acef-7084889fa0e3'] },
  { row: 23, files: ['b345f6f6-2b6d-4f5f-9576-9888abf18e1e'] },

  // Laboratory and absorbency test photos
  { row: 19, files: ['2026-08-06_132741', '2026-08-06_132845', '2026-08-06_132859'] },
  { row: 20, files: ['2026-08-06_133505', '2026-08-06_133620', '2026-08-06_133632', '2026-08-06_133641'] },
  { row: 24, files: ['2026-08-06_133401'] },
  { row: 29, files: ['2026-08-06_134554', '2026-08-06_134602', '2026-08-06_134723', '2026-08-06_134757', '2026-08-06_134801', '2026-08-06_134826'] },
  { row: 30, files: ['2026-08-06_134125', '2026-08-06_134131', '2026-08-06_134148', '2026-08-06_134149'] },
  { row: 46, files: ['2026-08-06_133505', '2026-08-06_133620'] },
  { row: 199, files: ['2026-08-06_133632'] },
  { row: 200, files: ['2026-08-06_134125', '2026-08-06_134131'] },
  { row: 209, files: ['2026-08-06_133135', '2026-08-06_133209'] },
];

function isBlank(v) { return v === null || v === undefined || v === ''; }
function nextEmptyExtraCols(row, count) {
  const rowValues = values[row - 1] ?? [];
  const cols = [];
  for (let col = 7; col <= 15 && cols.length < count; col++) {
    if (isBlank(rowValues[col])) cols.push(col);
  }
  return cols;
}

const inserted = [];
for (const assignment of assignments) {
  const targetCols = nextEmptyExtraCols(assignment.row, assignment.files.length);
  if (targetCols.length < assignment.files.length) {
    console.warn(`Skipped ${assignment.row}: only ${targetCols.length} empty slots for ${assignment.files.length} files`);
  }
  for (let i = 0; i < Math.min(targetCols.length, assignment.files.length); i++) {
    const fileStem = assignment.files[i];
    const preparedPath = product(fileStem);
    const bytes = await fs.readFile(preparedPath);
    const dataUrl = `data:image/jpeg;base64,${bytes.toString('base64')}`;
    const col = targetCols[i];
    sheet.images.add({
      dataUrl,
      anchor: {
        from: { row: assignment.row - 1, col },
        extent: { widthPx: 160, heightPx: 100 },
      },
    });
    inserted.push({ row: assignment.row, col: col + 1, fileStem });
  }
}

await fs.mkdir(outputDir, { recursive: true });
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(outputPath);
await fs.writeFile('work/inserted.json', JSON.stringify(inserted, null, 2), 'utf8');
console.log(`saved ${outputPath}`);
console.log(JSON.stringify(inserted, null, 2));
