import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';
const a = await SpreadsheetFile.importXlsx(await FileBlob.load('C:/Users/Administrator/Desktop/独立站AI图-新增产品图片.xlsx'));
const b = await SpreadsheetFile.importXlsx(await FileBlob.load('outputs/019fda3e-27bd-7c42-a500-0654a578f42f/独立站AI图-新增产品图片-已补充实拍图.xlsx'));
const av = a.worksheets.getItem('AI图片总表').getRange('A1:P217').formulas;
const bv = b.worksheets.getItem('AI图片总表').getRange('A1:P217').formulas;
let changed = 0, present = 0;
for (let r=0;r<av.length;r++) for (let c=0;c<16;c++) { const x=av[r]?.[c]??'', y=bv[r]?.[c]??''; if (x) present++; if (x!==y) changed++; }
console.log(JSON.stringify({formulaCells:present, changed}));
