import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const sourcePath = 'C:/Users/Administrator/Documents/独立站修改/outputs/019fc602-1aef-7e23-8279-c94da4a1aa94/独立站AI图.xlsx';
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(sourcePath));
const tables = await workbook.inspect({ kind: 'table', maxChars: 6000, tableMaxRows: 2, tableMaxCols: 8 });
console.log(tables.ndjson);
console.log(workbook.help('table.rows.add', { include: 'index,examples,notes', maxChars: 4000 }).ndjson);
