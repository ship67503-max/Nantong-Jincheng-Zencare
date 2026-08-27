import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const inputPath = 'C:/Users/Administrator/Desktop/独立站AI图-新增产品图片.xlsx';
const outDir = 'work/inspect';
await fs.mkdir(outDir, { recursive: true });
const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const summary = await workbook.inspect({ kind: 'workbook,sheet,table,drawing', maxChars: 20000, tableMaxRows: 12, tableMaxCols: 20, tableMaxCellChars: 120 });
console.log(summary.ndjson);
const sheets = workbook.worksheets.items;
for (const sheet of sheets) {
  const used = sheet.getUsedRange();
  console.log(`SHEET ${sheet.name} used=${used?.address ?? 'none'}`);
  if (used) {
    const region = await workbook.inspect({ kind: 'region', sheetId: sheet.name, range: used.address, maxChars: 20000, tableMaxRows: 80, tableMaxCols: 40, tableMaxCellChars: 200 });
    await fs.writeFile(`${outDir}/${sheet.name.replace(/[\\/:*?"<>|]/g,'_')}.region.ndjson`, region.ndjson, 'utf8');
    const draws = await workbook.inspect({ kind: 'drawing', sheetId: sheet.name, maxChars: 30000 });
    await fs.writeFile(`${outDir}/${sheet.name.replace(/[\\/:*?"<>|]/g,'_')}.drawings.ndjson`, draws.ndjson, 'utf8');
    const preview = await workbook.render({ sheetName: sheet.name, autoCrop: 'all', scale: 0.7, format: 'png' });
    await fs.writeFile(`${outDir}/${sheet.name.replace(/[\\/:*?"<>|]/g,'_')}.png`, new Uint8Array(await preview.arrayBuffer()));
  }
}
