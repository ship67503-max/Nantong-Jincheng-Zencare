import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const inputPath = 'C:/Users/Administrator/Documents/xwechat_files/wxid_xbi9o0tdyhpq12_be07/msg/file/2026-08/独立站AI图-新增产品图片(1).xlsx';
const outDir = 'C:/Users/Administrator/Documents/独立站修改/work/current_inspect';
await fs.mkdir(outDir, { recursive: true });
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const summary = await wb.inspect({ kind: 'workbook,sheet,table,drawing', maxChars: 24000, tableMaxRows: 10, tableMaxCols: 20, tableMaxCellChars: 140 });
console.log(summary.ndjson);
for (const sheet of wb.worksheets.items) {
  const used = sheet.getUsedRange();
  console.log(`SHEET ${sheet.name} used=${used?.address ?? 'none'}`);
  if (!used) continue;
  const region = await wb.inspect({ kind: 'region', sheetId: sheet.name, range: used.address, maxChars: 50000, tableMaxRows: 240, tableMaxCols: 20, tableMaxCellChars: 600 });
  await fs.writeFile(`${outDir}/${sheet.name.replace(/[\\/:*?"<>|]/g,'_')}.region.ndjson`, region.ndjson, 'utf8');
  const draws = await wb.inspect({ kind: 'drawing', sheetId: sheet.name, maxChars: 60000 });
  await fs.writeFile(`${outDir}/${sheet.name.replace(/[\\/:*?"<>|]/g,'_')}.drawings.ndjson`, draws.ndjson, 'utf8');
  const preview = await wb.render({ sheetName: sheet.name, autoCrop: 'all', scale: 0.7, format: 'png' });
  await fs.writeFile(`${outDir}/${sheet.name.replace(/[\\/:*?"<>|]/g,'_')}.png`, new Uint8Array(await preview.arrayBuffer()));
}
