import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const inputPath = 'C:/Users/Administrator/Documents/xwechat_files/wxid_xbi9o0tdyhpq12_be07/msg/file/2026-08/独立站AI图-新增产品图片(1).xlsx';
const outputDir = 'C:/Users/Administrator/Documents/独立站修改/outputs/019fda95-e8d0-7192-a0c4-4330435c4ed5';
const outputPath = `${outputDir}/独立站AI图-新增产品图片(1)-已补充实拍图.xlsx`;
const preparedDir = 'C:/Users/Administrator/Documents/独立站修改/work/prepared';

const assignments = {
  3: ['497e8aed-0a86-4ac6-9c4e-e7ac8039dbba', '297e7d56-6052-4322-bfa0-397eaf026db9', '635b333e-d808-490a-97a1-073745495b15'],
  4: ['c188c885-a92d-4026-8cfb-3a58480439a6'],
  5: ['e2c58bc0-9965-43dd-82c9-b4cb53be1ab0', 'c188c885-a92d-4026-8cfb-3a58480439a6'],
  6: ['573cf695-75f3-4013-9b91-53f767e8335d', '5f12246d-9740-48b2-8030-502a970451db', '619be7ce-cb5d-40b3-8a7f-5bab1b6da093', '8b883acd-b203-47fa-8dca-ae73f2911635'],
  12: ['573cf695-75f3-4013-9b91-53f767e8335d', '619be7ce-cb5d-40b3-8a7f-5bab1b6da093', '5f12246d-9740-48b2-8030-502a970451db'],
  19: ['2026-08-06_132741', '2026-08-06_132845', '2026-08-06_133401'],
  20: ['2026-08-06_133505', '2026-08-06_133620', '2026-08-06_133641'],
  21: ['5f12246d-9740-48b2-8030-502a970451db', '8b883acd-b203-47fa-8dca-ae73f2911635'],
  22: ['573cf695-75f3-4013-9b91-53f767e8335d', '5f12246d-9740-48b2-8030-502a970451db', '8b883acd-b203-47fa-8dca-ae73f2911635'],
  23: ['b345f6f6-2b6d-4f5f-9576-9888abf18e1e', '573cf695-75f3-4013-9b91-53f767e8335d'],
  24: ['2026-08-06_132859', '2026-08-06_133401', '2026-08-06_133505'],
  25: ['2026-08-06_134723', '2026-08-06_134757', '2026-08-06_134801'],
  29: ['ca82bd11-11c4-4e76-b3c7-3892910279cf', 'e8bf62de-048e-4ea2-8590-d4b90a02419b', 'f1bec61a-99ba-45b3-840d-77280a671e92', 'f757d590-8eca-4374-acef-7084889fa0e3'],
  30: ['2026-08-06_134723', '2026-08-06_134757', '2026-08-06_134826'],
  40: ['573cf695-75f3-4013-9b91-53f767e8335d', '619be7ce-cb5d-40b3-8a7f-5bab1b6da093', '5f12246d-9740-48b2-8030-502a970451db'],
  41: ['573cf695-75f3-4013-9b91-53f767e8335d', '619be7ce-cb5d-40b3-8a7f-5bab1b6da093'],
  42: ['573cf695-75f3-4013-9b91-53f767e8335d'],
  44: ['5f12246d-9740-48b2-8030-502a970451db', '8b883acd-b203-47fa-8dca-ae73f2911635'],
  45: ['c188c885-a92d-4026-8cfb-3a58480439a6'],
  46: ['2026-08-06_133505', '2026-08-06_133620', '2026-08-06_133641'],
  47: ['2026-08-06_133135'],
  198: ['497e8aed-0a86-4ac6-9c4e-e7ac8039dbba', '297e7d56-6052-4322-bfa0-397eaf026db9', '635b333e-d808-490a-97a1-073745495b15'],
  200: ['8b883acd-b203-47fa-8dca-ae73f2911635', '5f12246d-9740-48b2-8030-502a970451db'],
  201: ['b345f6f6-2b6d-4f5f-9576-9888abf18e1e', '573cf695-75f3-4013-9b91-53f767e8335d', '619be7ce-cb5d-40b3-8a7f-5bab1b6da093'],
  202: ['497e8aed-0a86-4ac6-9c4e-e7ac8039dbba', '635b333e-d808-490a-97a1-073745495b15', 'c188c885-a92d-4026-8cfb-3a58480439a6'],
  203: ['c188c885-a92d-4026-8cfb-3a58480439a6'],
  205: ['5f12246d-9740-48b2-8030-502a970451db', '8b883acd-b203-47fa-8dca-ae73f2911635'],
  207: ['c188c885-a92d-4026-8cfb-3a58480439a6'],
  208: ['5f12246d-9740-48b2-8030-502a970451db', '8b883acd-b203-47fa-8dca-ae73f2911635'],
  210: ['5f12246d-9740-48b2-8030-502a970451db', '8b883acd-b203-47fa-8dca-ae73f2911635', 'ca82bd11-11c4-4e76-b3c7-3892910279cf'],
  213: ['e2c58bc0-9965-43dd-82c9-b4cb53be1ab0'],
  215: ['e2c58bc0-9965-43dd-82c9-b4cb53be1ab0'],
};

const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const sheet = wb.worksheets.getItem('AI图片总表');
const values = sheet.getRange('A1:P217').values;
const isBlank = (v) => v === null || v === undefined || v === '';
const records = [];

for (const [rowKey, stems] of Object.entries(assignments)) {
  const row = Number(rowKey);
  const rowValues = values[row - 1] ?? [];
  const targets = [5, ...Array.from({length: 9}, (_, i) => 7 + i)];
  const chosen = [];
  for (const col of targets) {
    if (col === 5 || isBlank(rowValues[col])) chosen.push(col);
    if (chosen.length === stems.length) break;
  }
  // When F already contains an image or placeholder, overlay the best-matching
  // new photo at the same anchor; remaining candidates use empty H:P slots.
  if (chosen.length < stems.length) throw new Error(`Row ${row} has only ${chosen.length} available image anchors`);
  for (let i = 0; i < stems.length; i++) {
    const stem = stems[i];
    const preparedPath = `${preparedDir}/${stem}.jpg`;
    const bytes = await fs.readFile(preparedPath);
    const dataUrl = `data:image/jpeg;base64,${bytes.toString('base64')}`;
    const col = chosen[i];
    sheet.images.add({ dataUrl, anchor: { from: { row: row - 1, col }, extent: { widthPx: 160, heightPx: 100 } } });
    records.push({ row, col: col + 1, stem, description: rowValues[2] ?? '' });
  }
}

await fs.mkdir(outputDir, { recursive: true });
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(outputPath);
await fs.writeFile(`${outputDir}/photo_mapping.json`, JSON.stringify(records, null, 2), 'utf8');
console.log(`saved ${outputPath}`);
console.log(`inserted ${records.length} images into ${new Set(records.map((r) => r.row)).size} rows`);
