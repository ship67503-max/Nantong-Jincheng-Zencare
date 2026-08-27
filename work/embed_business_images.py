# -*- coding: utf-8 -*-
from __future__ import annotations

import re
import uuid
import zipfile
from pathlib import Path

SOURCE = Path(r"C:/Users/Administrator/Documents/xwechat_files/wxid_xbi9o0tdyhpq12_be07/msg/file/2026-08/独立站AI图-新增产品图片.xlsx")
PREPARED = Path(r"C:/Users/Administrator/Desktop/洽谈/去除时间水印")

# Row 26: 宠物护理OEM项目商务沟通场景
ASSIGNMENTS = [
    (26, [
        "08635cea1f18ab4cd3c4907feabf94e9",
        "11bf933316c8c550bdd1cc51d9ac8bb1",
        "1af3525dd4f385742637915f67501578",
        "40ae82589e7718d6934c6c194780fcf1",
        "446779b34658a4a680bfccf0df8149ee",
        "52fe39dc22e23f401832db8c059132be",
        "aeb3e6e6af759fea2458c681e4546a68",
        "e5f1c5f9b904523e7795e76bb7275007",
        "f2a461873e319238c5f5f9c22e7a2842",
    ]),
]


def col_index(letter: str) -> int:
    value = 0
    for char in letter:
        value = value * 26 + ord(char) - 64
    return value


def col_letter(index: int) -> str:
    out = ""
    while index:
        index, rem = divmod(index - 1, 26)
        out = chr(65 + rem) + out
    return out


def cell_xml(address: str, image_id: str) -> str:
    formula = f'_xlfn.DISPIMG(&quot;{image_id}&quot;,1)'
    displayed = f'=DISPIMG(&quot;{image_id}&quot;,1)'
    return f'<c r="{address}" t="str"><f>{formula}</f><v>{displayed}</v></c>'


def insert_cell(row_xml: str, address: str, image_id: str) -> str:
    target_col = col_index(re.match(r"([A-Z]+)", address).group(1))
    cell_re = re.compile(r'<c r="([A-Z]+)\d+"[^>]*>.*?</c>')
    insert_at = row_xml.rfind("</row>")
    for match in cell_re.finditer(row_xml):
        current_col = col_index(match.group(1))
        if current_col > target_col:
            insert_at = match.start()
            break
    return row_xml[:insert_at] + cell_xml(address, image_id) + row_xml[insert_at:]


def free_image_cells(sheet_xml: str, row_number: int, count: int) -> list[str]:
    row_match = re.search(rf'<row\b[^>]*\br="{row_number}"[^>]*>.*?</row>', sheet_xml)
    if not row_match:
        raise ValueError(f"Row {row_number} was not found")
    row_xml = row_match.group(0)
    occupied = set(re.findall(r'<c r="([A-Z]+)\d+"', row_xml))
    result = []
    for number in range(8, 17):  # H:P are reserved image cells.
        col = col_letter(number)
        if col not in occupied:
            result.append(f"{col}{row_number}")
            if len(result) == count:
                return result
    raise ValueError(f"Row {row_number} does not have enough unused image cells")


def add_images_to_sheet(sheet_xml: str, additions: list[tuple[int, str]]) -> str:
    additions_by_row: dict[int, list[str]] = {}
    for row, image_id in additions:
        additions_by_row.setdefault(row, []).append(image_id)

    for row_number in sorted(additions_by_row):
        image_ids = additions_by_row[row_number]
        addresses = free_image_cells(sheet_xml, row_number, len(image_ids))
        row_match = re.search(rf'<row\b[^>]*\br="{row_number}"[^>]*>.*?</row>', sheet_xml)
        row_xml = row_match.group(0)
        for address, image_id in zip(addresses, image_ids):
            row_xml = insert_cell(row_xml, address, image_id)
        sheet_xml = sheet_xml[:row_match.start()] + row_xml + sheet_xml[row_match.end():]
    return sheet_xml


def create_cell_image(image_id: str, relationship_id: str, drawing_id: int) -> str:
    return (
        '<etc:cellImage><xdr:pic><xdr:nvPicPr>'
        f'<xdr:cNvPr id="{drawing_id}" name="{image_id}" descr="embedded_real_photo"/>'
        '<xdr:cNvPicPr/></xdr:nvPicPr><xdr:blipFill>'
        f'<a:blip r:embed="{relationship_id}"/><a:stretch><a:fillRect/></a:stretch>'
        '</xdr:blipFill><xdr:spPr><a:xfrm><a:off x="0" y="0"/>'
        '<a:ext cx="8096250" cy="4552950"/></a:xfrm>'
        '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>'
        '</xdr:spPr></xdr:pic></etc:cellImage>'
    )


with zipfile.ZipFile(SOURCE, "r") as source_zip:
    files = {
        info.filename: source_zip.read(info.filename)
        for info in source_zip.infolist()
        if not info.is_dir()
    }

sheet_name = "xl/worksheets/sheet1.xml"
cell_images_name = "xl/cellimages.xml"
cell_images_rels_name = "xl/_rels/cellimages.xml.rels"

sheet_xml = files[sheet_name].decode("utf-8")
cell_images_xml = files[cell_images_name].decode("utf-8")
cell_images_rels_xml = files[cell_images_rels_name].decode("utf-8")

existing_drawing_ids = [int(value) for value in re.findall(r'<xdr:cNvPr id="(\d+)"', cell_images_xml)]
next_drawing_id = max(existing_drawing_ids) + 1
existing_rel_ids = [int(value) for value in re.findall(r'Id="rId(\d+)"', cell_images_rels_xml)]
next_rel_id = max(existing_rel_ids) + 1

new_cells: list[tuple[int, str]] = []
new_cell_images: list[str] = []
new_relationships: list[str] = []
new_media: dict[str, bytes] = {}

for row, stems in ASSIGNMENTS:
    for stem in stems:
        image_id = "ID_" + uuid.uuid4().hex.upper()
        relationship_id = f"rId{next_rel_id}"
        drawing_id = next_drawing_id
        media_name = f"xl/media/embedded_real_{drawing_id}.jpeg"
        prepared_file = PREPARED / f"{stem}.jpg"
        if not prepared_file.exists():
            raise FileNotFoundError(prepared_file)
        new_media[media_name] = prepared_file.read_bytes()
        new_cells.append((row, image_id))
        new_cell_images.append(create_cell_image(image_id, relationship_id, drawing_id))
        new_relationships.append(
            f'<Relationship Id="{relationship_id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/{Path(media_name).name}"/>'
        )
        next_drawing_id += 1
        next_rel_id += 1

sheet_xml = add_images_to_sheet(sheet_xml, new_cells)
cell_images_xml = cell_images_xml.replace("</etc:cellImages>", "".join(new_cell_images) + "</etc:cellImages>")
cell_images_rels_xml = cell_images_rels_xml.replace("</Relationships>", "".join(new_relationships) + "</Relationships>")

files[sheet_name] = sheet_xml.encode("utf-8")
files[cell_images_name] = cell_images_xml.encode("utf-8")
files[cell_images_rels_name] = cell_images_rels_xml.encode("utf-8")
files.update(new_media)

out_dir = Path("outputs") / str(uuid.uuid4())
out_dir.mkdir(parents=True, exist_ok=True)
output = out_dir / "独立站AI图-新增产品图片-商务洽谈已补充实拍图.xlsx"
with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as output_zip:
    for name, data in files.items():
        output_zip.writestr(name, data)

print(output)
