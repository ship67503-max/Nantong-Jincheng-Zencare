import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load('C:/Users/Administrator/Desktop/独立站AI图-新增产品图片.xlsx'));
for (const sheet of wb.worksheets.items) {
  const used = sheet.getUsedRange();
  console.log(sheet.name, used?.address);
  if (sheet.name === '页面明细' && used) {
    const rows = sheet.getRange(used.address).values;
    console.log(JSON.stringify(rows.slice(0, 20), null, 2));
  }
}
