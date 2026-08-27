import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const outputPath = 'C:/Users/Administrator/Documents/独立站修改/outputs/019fda95-e8d0-7192-a0c4-4330435c4ed5/独立站AI图-新增产品图片(1)-已补充实拍图.xlsx';
const outDir = 'C:/Users/Administrator/Documents/独立站修改/work/final_previews';
await fs.mkdir(outDir, { recursive: true });
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(outputPath));
const sheet = wb.worksheets.getItem('AI图片总表');
const key1 = await wb.inspect({ kind: 'table', sheetId: 'AI图片总表', range: 'A1:P47', include: 'values,formulas', tableMaxRows: 47, tableMaxCols: 16, tableMaxCellChars: 200 });
const key2 = await wb.inspect({ kind: 'table', sheetId: 'AI图片总表', range: 'A198:P217', include: 'values,formulas', tableMaxRows: 20, tableMaxCols: 16, tableMaxCellChars: 200 });
await fs.writeFile(`${outDir}/key_rows_1_47.ndjson`, key1.ndjson, 'utf8');
await fs.writeFile(`${outDir}/key_rows_198_217.ndjson`, key2.ndjson, 'utf8');
const drawings = await wb.inspect({ kind: 'drawing', sheetId: 'AI图片总表', maxChars: 120000 });
await fs.writeFile(`${outDir}/drawings.ndjson`, drawings.ndjson, 'utf8');
for (const [name, range] of [['top','A1:P47'], ['bottom','A198:P217']]) {
  const preview = await wb.render({ sheetName: 'AI图片总表', range, scale: 0.9, format: 'png' });
  await fs.writeFile(`${outDir}/${name}.png`, new Uint8Array(await preview.arrayBuffer()));
}
const errors = await wb.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A', options: { useRegex: true, maxResults: 300 }, summary: 'final formula error scan' });
await fs.writeFile(`${outDir}/formula_errors.ndjson`, errors.ndjson, 'utf8');
console.log('images', sheet.images.items?.length, 'drawings chars', drawings.ndjson.length, 'errors', errors.ndjson.slice(0,500));
