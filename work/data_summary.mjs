import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load('C:/Users/Administrator/Desktop/独立站AI图-新增产品图片.xlsx'));
const s = wb.worksheets.getItem('AI图片总表');
const v = s.getRange('A1:P217').values;
const rows = [];
for (let i = 0; i < v.length; i++) {
  const row = v[i] || [];
  rows.push({row:i+1, key:row[0], desc:row[2], pages:row[3], photo:row[5], current:row[6], extras:row.slice(7)});
}
await fs.writeFile('work/rows.json', JSON.stringify(rows, null, 2), 'utf8');
console.log(rows.map(x => [x.row, x.key, String(x.desc??'').replace(/\n/g,' / '), x.photo, x.current, ...x.extras].map(y=>String(y??'').replace(/\t/g,' ')).join('\t')).join('\n'));
