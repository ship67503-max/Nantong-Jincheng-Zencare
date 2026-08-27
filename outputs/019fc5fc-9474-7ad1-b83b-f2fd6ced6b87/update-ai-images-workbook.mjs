import fs from 'node:fs/promises';
import path from 'node:path';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const sourcePath = 'C:/Users/Administrator/Documents/独立站修改/outputs/019fc602-1aef-7e23-8279-c94da4a1aa94/独立站AI图.xlsx';
const projectRoot = 'C:/Users/Administrator/Documents/独立站修改';
const outputDir = 'C:/Users/Administrator/Documents/独立站修改/outputs/019fc5fc-9474-7ad1-b83b-f2fd6ced6b87';
const outputPath = path.join(outputDir, '独立站AI图-新增产品图片.xlsx');
const previewDir = path.join(outputDir, 'previews-after');
const siteBase = 'https://www.jczcare.com';

const page = (title, route) => ({ title, url: `${siteBase}${route}` });

const imageRecords = [
  {
    file: 'public/images/products/pet-training-pads/pet-training-pad-main.jpg',
    webPath: '/images/products/pet-training-pads/pet-training-pad-main.jpg',
    description: '一次性宠物训练尿垫白底主图',
    pages: [page('首页', '/'), page('Pet Hygiene Products Manufacturer', '/products'), page('Disposable Pet Training Pads', '/products/pet-training-pads')],
  },
  {
    file: 'public/images/products/pet-training-pads/pet-training-pad-home.jpg',
    webPath: '/images/products/pet-training-pads/pet-training-pad-home.jpg',
    description: '欧美家庭宠物训练尿垫使用场景',
    pages: [page('Disposable Pet Training Pads', '/products/pet-training-pads')],
  },
  {
    file: 'public/images/products/pet-training-pads/pet-training-pad-detail.jpg',
    webPath: '/images/products/pet-training-pads/pet-training-pad-detail.jpg',
    description: '宠物训练尿垫表层与封边微距细节',
    pages: [page('Disposable Pet Training Pads', '/products/pet-training-pads')],
  },
  {
    file: 'public/images/products/pet-training-pads/pet-training-pad-structure.jpg',
    webPath: '/images/products/pet-training-pads/pet-training-pad-structure.jpg',
    description: '宠物训练尿垫五层结构分解展示',
    pages: [page('Disposable Pet Training Pads', '/products/pet-training-pads')],
  },
  {
    file: 'public/images/products/pet-training-pads/pet-training-pad-package.jpg',
    webPath: '/images/products/pet-training-pads/pet-training-pad-package.jpg',
    description: '宠物训练尿垫私牌包装展示',
    pages: [page('Disposable Pet Training Pads', '/products/pet-training-pads')],
  },
  {
    file: 'public/images/products/adult-underpads/adult-underpad-main.jpg',
    webPath: '/images/products/adult-underpads/adult-underpad-main.jpg',
    description: '成人护理垫白底主图',
    pages: [page('首页', '/'), page('Pet Hygiene Products Manufacturer', '/products'), page('Adult Underpads', '/products/adult-underpads')],
  },
  {
    file: 'public/images/products/adult-underpads/adult-underpad-home-care.jpg',
    webPath: '/images/products/adult-underpads/adult-underpad-home-care.jpg',
    description: '成人护理垫家庭护理使用场景',
    pages: [page('Adult Underpads', '/products/adult-underpads')],
  },
  {
    file: 'public/images/products/adult-underpads/adult-underpad-core-detail.jpg',
    webPath: '/images/products/adult-underpads/adult-underpad-core-detail.jpg',
    description: '成人护理垫吸收芯材料微距细节',
    pages: [page('Adult Underpads', '/products/adult-underpads')],
  },
  {
    file: 'public/images/products/adult-underpads/adult-underpad-size.jpg',
    webPath: '/images/products/adult-underpads/adult-underpad-size.jpg',
    description: '成人护理垫不同尺寸对比展示',
    pages: [page('Adult Underpads', '/products/adult-underpads')],
  },
  {
    file: 'public/images/products/adult-underpads/adult-underpad-package.jpg',
    webPath: '/images/products/adult-underpads/adult-underpad-package.jpg',
    description: '成人护理垫私牌包装展示',
    pages: [page('Adult Underpads', '/products/adult-underpads')],
  },
  {
    file: 'public/images/products/pet-absorbent-paper/pet-absorbent-paper-main.jpg',
    webPath: '/images/products/pet-absorbent-paper/pet-absorbent-paper-main.jpg',
    description: '宠物吸水纸卷材与片材白底主图',
    pages: [page('首页', '/'), page('Pet Hygiene Products Manufacturer', '/products'), page('Pet Absorbent Paper', '/products/pet-absorbent-paper')],
  },
  {
    file: 'public/images/products/pet-absorbent-paper/pet-absorbent-paper-pet-care.jpg',
    webPath: '/images/products/pet-absorbent-paper/pet-absorbent-paper-pet-care.jpg',
    description: '宠物吸水纸护理应用场景',
    pages: [page('Pet Absorbent Paper', '/products/pet-absorbent-paper')],
  },
  {
    file: 'public/images/products/pet-absorbent-paper/pet-absorbent-paper-material.jpg',
    webPath: '/images/products/pet-absorbent-paper/pet-absorbent-paper-material.jpg',
    description: '宠物吸水纸纤维材料微距细节',
    pages: [page('Pet Absorbent Paper', '/products/pet-absorbent-paper')],
  },
  {
    file: 'public/images/products/pet-absorbent-paper/pet-absorbent-paper-roll-package.jpg',
    webPath: '/images/products/pet-absorbent-paper/pet-absorbent-paper-roll-package.jpg',
    description: '宠物吸水纸卷材与批量包装展示',
    pages: [page('Pet Absorbent Paper', '/products/pet-absorbent-paper')],
  },
  {
    file: 'public/images/products/pet-absorbent-paper/pet-absorbent-paper-application.jpg',
    webPath: '/images/products/pet-absorbent-paper/pet-absorbent-paper-application.jpg',
    description: '宠物吸水纸尿垫转换应用场景',
    pages: [page('Pet Absorbent Paper', '/products/pet-absorbent-paper')],
  },
  {
    file: 'public/images/products/disposable-cleaning-products/disposable-cleaning-products-main.jpg',
    webPath: '/images/products/disposable-cleaning-products/disposable-cleaning-products-main.jpg',
    description: '一次性宠物清洁用品白底主图',
    pages: [page('首页', '/'), page('Pet Hygiene Products Manufacturer', '/products'), page('Disposable Cleaning Products', '/products/disposable-cleaning-products')],
  },
  {
    file: 'public/images/products/disposable-cleaning-products/disposable-cleaning-products-pet-care.jpg',
    webPath: '/images/products/disposable-cleaning-products/disposable-cleaning-products-pet-care.jpg',
    description: '一次性宠物清洁用品护理使用场景',
    pages: [page('Disposable Cleaning Products', '/products/disposable-cleaning-products')],
  },
  {
    file: 'public/images/products/disposable-cleaning-products/disposable-cleaning-products-package.jpg',
    webPath: '/images/products/disposable-cleaning-products/disposable-cleaning-products-package.jpg',
    description: '一次性宠物清洁用品私牌包装展示',
    pages: [page('Disposable Cleaning Products', '/products/disposable-cleaning-products')],
  },
  {
    file: 'public/images/products/disposable-cleaning-products/disposable-cleaning-products-use.jpg',
    webPath: '/images/products/disposable-cleaning-products/disposable-cleaning-products-use.jpg',
    description: '一次性宠物清洁用品家庭使用场景',
    pages: [page('Disposable Cleaning Products', '/products/disposable-cleaning-products')],
  },
  {
    file: 'public/images/products/disposable-cleaning-products/disposable-cleaning-products-detail.jpg',
    webPath: '/images/products/disposable-cleaning-products/disposable-cleaning-products-detail.jpg',
    description: '一次性宠物清洁用品无纺布材料微距细节',
    pages: [page('Disposable Cleaning Products', '/products/disposable-cleaning-products')],
  },
];

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

for (const record of imageRecords) {
  await fs.access(path.join(projectRoot, record.file));
}

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(sourcePath));
const summarySheet = workbook.worksheets.getItem('AI图片总表');
const detailSheet = workbook.worksheets.getItem('页面明细');

const summaryStartNumber = 197;
const summaryStartExcelRow = 198;
const summaryRows = imageRecords.map((record, index) => [
  summaryStartNumber + index,
  null,
  record.description,
  record.pages.map((item) => item.title).join('\n'),
  record.pages.map((item) => item.url).join('\n'),
  null,
  record.webPath,
]);
const summaryEndExcelRow = summaryStartExcelRow + imageRecords.length - 1;
const summaryRange = summarySheet.getRange(`A${summaryStartExcelRow}:G${summaryEndExcelRow}`);
summaryRange.values = summaryRows;
summaryRange.format.rowHeightPx = 100;
summaryRange.format.wrapText = true;
summaryRange.format.verticalAlignment = 'center';
summarySheet.getRange(`A${summaryStartExcelRow}:A${summaryEndExcelRow}`).format = {
  font: { fontSize: 10, typeface: 'Microsoft YaHei', color: '#263238' },
  horizontalAlignment: 'center',
};
summarySheet.getRange(`C${summaryStartExcelRow}:D${summaryEndExcelRow}`).format = {
  font: { fontSize: 10, typeface: 'Microsoft YaHei', color: '#263238' },
  horizontalAlignment: 'center',
  wrapText: true,
};
summarySheet.getRange(`E${summaryStartExcelRow}:E${summaryEndExcelRow}`).format = {
  font: { fontSize: 9, typeface: 'Microsoft YaHei', color: '#0A6C74' },
  horizontalAlignment: 'center',
  wrapText: true,
};
summarySheet.getRange(`F${summaryStartExcelRow}:F${summaryEndExcelRow}`).format = {
  fill: '#FFF6D8',
};
summarySheet.getRange(`G${summaryStartExcelRow}:G${summaryEndExcelRow}`).format = {
  font: { fontSize: 8, typeface: 'Microsoft YaHei', color: '#607D75' },
  horizontalAlignment: 'center',
  wrapText: true,
};

for (let index = 0; index < imageRecords.length; index += 1) {
  const bytes = await fs.readFile(path.join(projectRoot, imageRecords[index].file));
  summarySheet.images.add({
    dataUrl: `data:image/jpeg;base64,${bytes.toString('base64')}`,
    anchor: {
      from: { row: summaryStartExcelRow - 1 + index, col: 1 },
      extent: { widthPx: 160, heightPx: 100 },
    },
  });
}

const existingDetailCount = 720;
let detailNumber = existingDetailCount + 1;
const detailRows = [];
for (let imageIndex = 0; imageIndex < imageRecords.length; imageIndex += 1) {
  const record = imageRecords[imageIndex];
  const imageNumber = summaryStartNumber + imageIndex;
  for (const usage of record.pages) {
    detailRows.push([
      detailNumber,
      imageNumber,
      record.description,
      usage.title,
      usage.url,
      record.webPath,
    ]);
    detailNumber += 1;
  }
}
const detailStartExcelRow = existingDetailCount + 2;
const detailEndExcelRow = detailStartExcelRow + detailRows.length - 1;
const detailRange = detailSheet.getRange(`A${detailStartExcelRow}:F${detailEndExcelRow}`);
detailRange.values = detailRows;
detailRange.format.rowHeightPx = 52;
detailRange.format.wrapText = true;
detailRange.format.verticalAlignment = 'center';
detailSheet.getRange(`A${detailStartExcelRow}:D${detailEndExcelRow}`).format = {
  font: { fontSize: 10, typeface: 'Microsoft YaHei', color: '#263238' },
  horizontalAlignment: 'center',
  wrapText: true,
};
detailSheet.getRange(`E${detailStartExcelRow}:E${detailEndExcelRow}`).format = {
  font: { fontSize: 9, typeface: 'Microsoft YaHei', color: '#0A6C74' },
  horizontalAlignment: 'center',
  wrapText: true,
};
detailSheet.getRange(`F${detailStartExcelRow}:F${detailEndExcelRow}`).format = {
  font: { fontSize: 8, typeface: 'Microsoft YaHei', color: '#607D75' },
  horizontalAlignment: 'center',
  wrapText: true,
};

const summaryPreview = await workbook.render({
  sheetName: 'AI图片总表',
  range: `A${summaryStartExcelRow - 2}:G${summaryEndExcelRow}`,
  scale: 1,
  format: 'png',
});
await fs.writeFile(path.join(previewDir, 'AI图片总表-新增产品图片.png'), new Uint8Array(await summaryPreview.arrayBuffer()));

const detailPreview = await workbook.render({
  sheetName: '页面明细',
  range: `A${detailStartExcelRow - 2}:F${detailEndExcelRow}`,
  scale: 1,
  format: 'png',
});
await fs.writeFile(path.join(previewDir, '页面明细-新增产品图片.png'), new Uint8Array(await detailPreview.arrayBuffer()));

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(outputPath);

console.log(JSON.stringify({
  outputPath,
  summaryRowsAdded: summaryRows.length,
  detailRowsAdded: detailRows.length,
  summaryRange: `A${summaryStartExcelRow}:G${summaryEndExcelRow}`,
  detailRange: `A${detailStartExcelRow}:F${detailEndExcelRow}`,
}, null, 2));
