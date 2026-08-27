import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const inputPath = 'C:/Users/Administrator/Documents/xwechat_files/wxid_xbi9o0tdyhpq12_be07/msg/file/2026-08/独立站AI图-新增产品图片(1).xlsx';
const outDir = 'C:/Users/Administrator/Documents/独立站修改/work/current_chunks';
await fs.mkdir(outDir, { recursive: true });
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const ranges = ['A1:P35','A36:P70','A71:P105','A106:P140','A141:P175','A176:P217'];
for (let i=0;i<ranges.length;i++) {
  const preview = await wb.render({ sheetName:'AI图片总表', range:ranges[i], scale:0.8, format:'png' });
  await fs.writeFile(`${outDir}/chunk_${i+1}.png`, new Uint8Array(await preview.arrayBuffer()));
}
