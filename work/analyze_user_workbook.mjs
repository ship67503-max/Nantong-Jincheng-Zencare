import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = process.argv[2];
const outputDir = process.argv[3];

if (!inputPath || !outputDir) {
  throw new Error("Usage: node analyze_user_workbook.mjs <input.xlsx> <output-dir>");
}

await fs.mkdir(outputDir, { recursive: true });
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));

const summary = await workbook.inspect({
  kind: "workbook,sheet,table,drawing",
  maxChars: 20000,
  tableMaxRows: 10,
  tableMaxCols: 16,
  tableMaxCellChars: 200,
});
await fs.writeFile(path.join(outputDir, "summary.ndjson"), summary.ndjson, "utf8");

const columnName = (columnNumber) => {
  let result = "";
  let value = columnNumber;
  while (value > 0) {
    value -= 1;
    result = String.fromCharCode(65 + (value % 26)) + result;
    value = Math.floor(value / 26);
  }
  return result;
};

const sheets = [];
for (let index = 0; index < workbook.worksheets.items.length; index += 1) {
  const sheet = workbook.worksheets.getItemAt(index);
  const usedRange = sheet.getUsedRange();
  const values = usedRange?.values ?? [];
  const sheetInfo = {
    index,
    name: sheet.name,
    usedAddress: usedRange?.address ?? null,
    rowCount: values.length,
    columnCount: values.reduce((max, row) => Math.max(max, row.length), 0),
    imageCount: sheet.images.items.length,
    values,
  };
  sheets.push(sheetInfo);
}

await fs.writeFile(path.join(outputDir, "sheets.json"), JSON.stringify(sheets, null, 2), "utf8");

for (const sheetInfo of sheets) {
  const lastColumn = columnName(Math.max(sheetInfo.columnCount, 1));
  for (let startRow = 1; startRow <= sheetInfo.rowCount; startRow += 40) {
    const endRow = Math.min(startRow + 39, sheetInfo.rowCount);
    const preview = await workbook.render({
      sheetName: sheetInfo.name,
      range: `A${startRow}:${lastColumn}${endRow}`,
      scale: 0.8,
      format: "png",
    });
    await fs.writeFile(
      path.join(
        outputDir,
        `sheet-${String(sheetInfo.index + 1).padStart(2, "0")}-rows-${String(startRow).padStart(3, "0")}-${String(endRow).padStart(3, "0")}.png`,
      ),
      new Uint8Array(await preview.arrayBuffer()),
    );
  }
}

console.log(JSON.stringify(sheets.map(({ values, ...sheet }) => sheet), null, 2));
