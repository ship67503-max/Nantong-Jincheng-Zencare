from __future__ import annotations

import json
import re
import sys
from pathlib import Path, PurePosixPath
from zipfile import ZipFile
import xml.etree.ElementTree as ET


NS = {
    "etc": "http://www.wps.cn/officeDocument/2017/etCustomData",
    "xdr": "http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}
ID_PATTERN = re.compile(r'ID_[A-F0-9]+')


def media_path(target: str) -> str:
    normalized = PurePosixPath("xl") / PurePosixPath(target.replace("\\", "/"))
    parts: list[str] = []
    for part in normalized.parts:
        if part == "..":
            if parts:
                parts.pop()
        elif part not in ("", "."):
            parts.append(part)
    return "/".join(parts)


def main() -> None:
    if len(sys.argv) != 4:
        raise SystemExit("Usage: extract_user_replacements.py <xlsx> <sheets.json> <output-dir>")

    workbook_path = Path(sys.argv[1])
    sheets_path = Path(sys.argv[2])
    output_dir = Path(sys.argv[3])
    media_dir = output_dir / "media"
    media_dir.mkdir(parents=True, exist_ok=True)

    sheets = json.loads(sheets_path.read_text(encoding="utf-8"))
    summary_sheet = next(sheet for sheet in sheets if sheet["name"] == "AI图片总表")
    rows = summary_sheet["values"]

    with ZipFile(workbook_path) as archive:
        rel_root = ET.fromstring(archive.read("xl/_rels/cellimages.xml.rels"))
        relationships = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rel_root}
        image_root = ET.fromstring(archive.read("xl/cellimages.xml"))

        image_files: dict[str, str] = {}
        for cell_image in image_root.findall("etc:cellImage", NS):
            name_element = cell_image.find(".//xdr:cNvPr", NS)
            blip = cell_image.find(".//a:blip", NS)
            if name_element is None or blip is None:
                continue
            image_id = name_element.attrib.get("name")
            relationship_id = blip.attrib.get(f"{{{NS['r']}}}embed")
            target = relationships.get(relationship_id or "")
            if image_id and target:
                image_files[image_id] = media_path(target)

        replacements = []
        for row_number, row in enumerate(rows[1:], start=2):
            photo_value = row[5] if len(row) > 5 else None
            current_value = row[6] if len(row) > 6 else None
            if not isinstance(photo_value, str) or not isinstance(current_value, str):
                continue
            match = ID_PATTERN.search(photo_value)
            if not match:
                continue
            image_id = match.group(0)
            source_name = image_files.get(image_id)
            if not source_name:
                raise RuntimeError(f"No media relationship found for {image_id} on row {row_number}")
            data = archive.read(source_name)
            suffix = Path(source_name).suffix.lower() or ".bin"
            output_name = f"row-{row_number:03d}-{image_id}{suffix}"
            (media_dir / output_name).write_bytes(data)
            replacements.append(
                {
                    "row": row_number,
                    "imageId": image_id,
                    "sourceMedia": source_name,
                    "extractedFile": str((media_dir / output_name).resolve()),
                    "description": row[2] if len(row) > 2 else None,
                    "pages": row[3] if len(row) > 3 else None,
                    "links": row[4] if len(row) > 4 else None,
                    "currentPaths": [line.strip() for line in current_value.splitlines() if line.strip()],
                }
            )

    manifest_path = output_dir / "replacements.json"
    manifest_path.write_text(json.dumps(replacements, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"replacementRows": len(replacements), "manifest": str(manifest_path.resolve())}, ensure_ascii=False))


if __name__ == "__main__":
    main()
