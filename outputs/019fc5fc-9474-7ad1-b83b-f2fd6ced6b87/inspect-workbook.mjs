import fs from 'node:fs/promises';
import path from 'node:path';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const sourcePath = 'C:/Users/Administrator/Documents/独立站修改/outputs/019fc602-1aef-7e23-8279-c94da4a1aa94/独立站AI图.xlsx';
const outputDir = 'C:/Users/Administrator/Documents/独立站修改/outputs/019fc5fc-9474-7ad1-b83b-f2fd6ced6b87/previews-before';

await fs.mkdir(outputDir, { recursive: true });
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(sourcePath));

const overview = await workbook.inspect({ kind: 'workbook,sheet', maxChars: 4000 });
console.log('OVERVIEW');
console.log(overview.ndjson);

for (const sheet of workbook.worksheets.items) {
  const used = sheet.getUsedRange();
  const rangeAddress = used?.address ?? 'A1:Z30';
  const match = rangeAddress.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/);
  const startCol = match?.[1] ?? 'A';
  const firstRow = Number(match?.[2] ?? 1);
  const endCol = match?.[3] ?? 'Z';
  const lastRow = Number(match?.[4] ?? 30);
  const topRange = `${startCol}${firstRow}:${endCol}${Math.min(lastRow, firstRow + 24)}`;
  const bottomRange = `${startCol}${Math.max(firstRow, lastRow - 24)}:${endCol}${lastRow}`;
  const region = await workbook.inspect({
    kind: 'region',
    sheetId: sheet.name,
    range: topRange,
    maxChars: 6000,
    tableMaxRows: 25,
    tableMaxCols: 15,
    tableMaxCellChars: 120,
  });
  const style = await workbook.inspect({
    kind: 'computedStyle',
    sheetId: sheet.name,
    range: topRange,
    maxChars: 3000,
  });
  console.log(`SHEET ${sheet.name} RANGE ${rangeAddress} TOP ${topRange} BOTTOM ${bottomRange}`);
  console.log(region.ndjson);
  console.log(style.ndjson);

  const safeName = sheet.name.replace(/[\\/:*?"<>|]/g, '_');
  for (const [label, range] of [['top', topRange], ['bottom', bottomRange]]) {
    const preview = await workbook.render({ sheetName: sheet.name, range, scale: 1, format: 'png' });
    await fs.writeFile(
      path.join(outputDir, `${safeName}-${label}.png`),
      new Uint8Array(await preview.arrayBuffer()),
    );
  }
}
