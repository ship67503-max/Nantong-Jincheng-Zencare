import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load('C:/Users/Administrator/Desktop/独立站AI图-新增产品图片.xlsx'));
const sheet = wb.worksheets.getItem('AI图片总表');
const b = await fs.readFile('work/prepared/297e7d56-6052-4322-bfa0-397eaf026db9.jpg');
sheet.images.add({ dataUrl:`data:image/jpeg;base64,${b.toString('base64')}`, anchor:{from:{row:3,col:7},extent:{widthPx:160,heightPx:100}} });
const preview = await wb.render({sheetName:'AI图片总表', range:'A1:J6', scale:1.5, format:'png'});
await fs.writeFile('work/test_added.png', new Uint8Array(await preview.arrayBuffer()));
console.log('done');
