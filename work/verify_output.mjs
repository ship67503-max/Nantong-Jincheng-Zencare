import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const outputPath = 'outputs/019fda3e-27bd-7c42-a500-0654a578f42f/独立站AI图-新增产品图片-已补充实拍图.xlsx';
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(outputPath));
const sheet = wb.worksheets.getItem('AI图片总表');
const drawings = await wb.inspect({ kind: 'drawing', sheetId: 'AI图片总表', maxChars: 200000 });
await fs.writeFile('work/verify_drawings.ndjson', drawings.ndjson, 'utf8');
const drawingLines = drawings.ndjson.split('\n').filter(Boolean);
const inserted = drawingLines.filter(line => line.includes('widthPx":160') && line.includes('heightPx":100')).length;
console.log(`drawing records=${drawingLines.length}, 160x100 images=${inserted}`);

const errors = await wb.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A', options: { useRegex: true, maxResults: 40 }, maxChars: 6000, summary: 'final formula error scan' });
console.log(errors.ndjson);

for (const [range, name] of [['A1:P32','verify_top'], ['A190:P210','verify_bottom']]) {
  try {
    const preview = await wb.render({ sheetName: 'AI图片总表', range, scale: 1.0, format: 'png' });
    await fs.writeFile(`work/${name}.png`, new Uint8Array(await preview.arrayBuffer()));
    console.log(`rendered ${name}`);
  } catch (e) { console.error(`render failed ${name}`, e?.message || e); }
}

const values = sheet.getRange('A1:P217').values;
const targets = [3,4,5,6,12,19,20,23,24,29,30,46,199,200,209];
for (const row of targets) {
  const rowValues = values[row-1] || [];
  console.log(`row ${row}: extras ${rowValues.slice(7).map((v,i)=>`${String.fromCharCode(72+i)}=${v ?? ''}`).join(' | ')}`);
}
