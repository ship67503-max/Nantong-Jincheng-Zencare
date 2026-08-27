import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const outputPath = 'C:/Users/Administrator/Documents/独立站修改/outputs/019fc5fc-9474-7ad1-b83b-f2fd6ced6b87/独立站AI图-新增产品图片.xlsx';
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(outputPath));

const summary = await workbook.inspect({
  kind: 'table',
  sheetId: 'AI图片总表',
  range: 'A198:G217',
  include: 'values,formulas',
  tableMaxRows: 25,
  tableMaxCols: 7,
  maxChars: 16000,
});
const details = await workbook.inspect({
  kind: 'table',
  sheetId: '页面明细',
  range: 'A722:F749',
  include: 'values,formulas',
  tableMaxRows: 30,
  tableMaxCols: 6,
  maxChars: 16000,
});
const errors = await workbook.inspect({
  kind: 'match',
  searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',
  options: { useRegex: true, maxResults: 300 },
  summary: 'final formula error scan',
});
const drawings = await workbook.inspect({
  kind: 'drawing',
  sheetId: 'AI图片总表',
  maxChars: 120000,
});

const drawingRecords = drawings.ndjson
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => JSON.parse(line))
  .filter((item) => item.kind === 'drawing' && item.drawingType === 'image');
const newDrawingRecords = drawingRecords.filter((item) => item.anchor?.from?.row >= 197);

console.log('SUMMARY_RANGE');
console.log(summary.ndjson);
console.log('DETAIL_RANGE');
console.log(details.ndjson);
console.log('FORMULA_ERRORS');
console.log(errors.ndjson);
console.log('DRAWING_COUNTS');
console.log(JSON.stringify({ totalImages: drawingRecords.length, newImages: newDrawingRecords.length, newAnchors: newDrawingRecords.map((item) => item.anchor.from.row) }, null, 2));
