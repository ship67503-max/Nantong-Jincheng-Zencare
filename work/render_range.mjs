import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load('C:/Users/Administrator/Desktop/独立站AI图-新增产品图片.xlsx'));
const ranges = [['A1:P20','top20'],['A190:P215','bottom'],['A1:G8','lefttop']];
for (const [range,name] of ranges) {
  try {
    const b = await wb.render({sheetName:'AI图片总表', range, scale:1.2, format:'png'});
    await fs.writeFile(`work/${name}.png`, new Uint8Array(await b.arrayBuffer()));
    console.log('rendered', name);
  } catch (e) { console.error('render failed', name, e?.stack || e); }
}
