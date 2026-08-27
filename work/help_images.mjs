import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';
const inputPath = 'C:/Users/Administrator/Documents/xwechat_files/wxid_xbi9o0tdyhpq12_be07/msg/file/2026-08/独立站AI图-新增产品图片(1).xlsx';
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
console.log(wb.help('image', {include:'index,examples,notes', maxChars:8000}).ndjson);
