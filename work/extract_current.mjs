import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const inputPath = 'C:/Users/Administrator/Documents/xwechat_files/wxid_xbi9o0tdyhpq12_be07/msg/file/2026-08/独立站AI图-新增产品图片(1).xlsx';
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const rows = wb.worksheets.getItem('AI图片总表').getRange('A1:P217').values;
const out = rows.map((r, i) => ({
  row: i + 1,
  image: r[0] ?? null,
  aiGenerated: r[1] ?? null,
  desc: r[2] ?? null,
  pages: r[3] ?? null,
  links: r[4] ?? null,
  photo: r[5] ?? null,
  current: r[6] ?? null,
  extras: r.slice(7, 16),
}));
await fs.writeFile('C:/Users/Administrator/Documents/独立站修改/work/current_rows.json', JSON.stringify(out, null, 2), 'utf8');
console.log(JSON.stringify(out.slice(0, 35), null, 2));
