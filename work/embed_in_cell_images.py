from __future__ import annotations

import html
import re
import shutil
import uuid
import zipfile
from pathlib import Path

SOURCE = Path(r'C:/Users/Administrator/Desktop/独立站AI图-新增产品图片.xlsx')
OUTPUT = Path(r'outputs/019fda3e-27bd-7c42-a500-0654a578f42f/独立站AI图-新增产品图片-单元格内实拍图.xlsx')
PREPARED = Path('work/prepared')

ASSIGNMENTS = [
    (3, ['497e8aed-0a86-4ac6-9c4e-e7ac8039dbba', '635b333e-d808-490a-97a1-073745495b15']),
    (4, ['297e7d56-6052-4322-bfa0-397eaf026db9', 'c188c885-a92d-4026-8cfb-3a58480439a6']),
    (5, ['e2c58bc0-9965-43dd-82c9-b4cb53be1ab0']),
    (6, ['573cf695-75f3-4013-9b91-53f767e8335d', '5f12246d-9740-48b2-8030-502a970451db', '619be7ce-cb5d-40b3-8a7f-5bab1b6da093', '8b883acd-b203-47fa-8dca-ae73f2911635']),
    (12, ['ca82bd11-11c4-4e76-b3c7-3892910279cf', 'e8bf62de-048e-4ea2-8590-d4b90a02419b', 'f1bec61a-99ba-45b3-840d-77280a671e92', 'f757d590-8eca-4374-acef-7084889fa0e3']),
    (23, ['b345f6f6-2b6d-4f5f-9576-9888abf18e1e']),
    (19, ['2026-08-06_132741', '2026-08-06_132845', '2026-08-06_132859']),
    (20, ['2026-08-06_133505', '2026-08-06_133620', '2026-08-06_133632', '2026-08-06_133641']),
    (24, ['2026-08-06_133401']),
    (29, ['2026-08-06_134554', '2026-08-06_134602', '2026-08-06_134723', '2026-08-06_134757', '2026-08-06_134801', '2026-08-06_134826']),
    (30, ['2026-08-06_134125', '2026-08-06_134131', '2026-08-06_134148', '2026-08-06_134149']),
    (46, ['2026-08-06_133505', '2026-08-06_133620']),
    (199, ['2026-08-06_133632']),
    (200, ['2026-08-06_134125', '2026-08-06_134131']),
    (209, ['2026-08-06_133135', '2026-08-06_133209']),
]


def col_index(letter: str) -> int:
    value = 0
    for char in letter:
        value = value * 26 + ord(char) - 64
    return value


def col_letter(index: int) -> str:
    out = ''
    while index:
        index, rem = divmod(index - 1, 26)
        out = chr(65 + rem) + out
    return out


def cell_xml(address: str, image_id: str) -> str:
    formula = f'_xlfn.DISPIMG(&quot;{image_id}&quot;,1)'
    displayed = f'=DISPIMG(&quot;{image_id}&quot;,1)'
    return f'<c r="{address}" t="str"><f>{formula}</f><v>{displayed}</v></c>'


def insert_cell(row_xml: str, address: str, image_id: str) -> str:
    target_col = col_index(re.match(r'([A-Z]+)', address).group(1))
    cell_re = re.compile(r'<c r="([A-Z]+)\d+"[^>]*>.*?</c>')
    insert_at = row_xml.rfind('</row>')
    for match in cell_re.finditer(row_xml):
        current_col = col_index(match.group(1))
        if current_col > target_col:
            insert_at = match.start()
            break
    return row_xml[:insert_at] + cell_xml(address, image_id) + row_xml[insert_at:]


def free_image_cells(sheet_xml: str, row_number: int, count: int) -> list[str]:
    row_match = re.search(rf'<row\b[^>]*\br="{row_number}"[^>]*>.*?</row>', sheet_xml)
    if not row_match:
        raise ValueError(f'Row {row_number} was not found')
    row_xml = row_match.group(0)
    occupied = set(re.findall(r'<c r="([A-Z]+)\d+"', row_xml))
    result = []
    for number in range(8, 17):  # H:P are the existing image reserve cells.
        col = col_letter(number)
        if col not in occupied:
            result.append(f'{col}{row_number}')
            if len(result) == count:
                return result
    raise ValueError(f'Row {row_number} does not have enough unused image cells')


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


with zipfile.ZipFile(SOURCE, 'r') as source_zip:
    files = {info.filename: source_zip.read(info.filename) for info in source_zip.infolist() if not info.is_dir()}

sheet_name = 'xl/worksheets/sheet1.xml'
cell_images_name = 'xl/cellimages.xml'
cell_images_rels_name = 'xl/_rels/cellimages.xml.rels'
sheet_xml = files[sheet_name].decode('utf-8')
cell_images_xml = files[cell_images_name].decode('utf-8')
cell_images_rels_xml = files[cell_images_rels_name].decode('utf-8')

existing_drawing_ids = [int(value) for value in re.findall(r'<xdr:cNvPr id="(\d+)"', cell_images_xml)]
next_drawing_id = max(existing_drawing_ids) + 1
existing_rel_ids = [int(value) for value in re.findall(r'Id="rId(\d+)"', cell_images_rels_xml)]
next_rel_id = max(existing_rel_ids) + 1

new_cells: list[tuple[int, str]] = []
new_cell_images: list[str] = []
new_relationships: list[str] = []
new_media: dict[str, bytes] = {}
mapping_lines = []

for row, stems in ASSIGNMENTS:
    for stem in stems:
        image_id = 'ID_' + uuid.uuid4().hex.upper()
        relationship_id = f'rId{next_rel_id}'
        drawing_id = next_drawing_id
        media_name = f'xl/media/embedded_real_{drawing_id}.jpeg'
        prepared_file = PREPARED / f'{stem}.jpg'
        if not prepared_file.exists():
            raise FileNotFoundError(prepared_file)
        new_media[media_name] = prepared_file.read_bytes()
        new_cells.append((row, image_id))
        new_cell_images.append(create_cell_image(image_id, relationship_id, drawing_id))
        new_relationships.append(
            f'<Relationship Id="{relationship_id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/{Path(media_name).name}"/>'
        )
        mapping_lines.append(f'{row}\t{stem}\t{image_id}')
        next_drawing_id += 1
        next_rel_id += 1

sheet_xml = add_images_to_sheet(sheet_xml, new_cells)
cell_images_xml = cell_images_xml.replace('</etc:cellImages>', ''.join(new_cell_images) + '</etc:cellImages>')
cell_images_rels_xml = cell_images_rels_xml.replace('</Relationships>', ''.join(new_relationships) + '</Relationships>')

files[sheet_name] = sheet_xml.encode('utf-8')
files[cell_images_name] = cell_images_xml.encode('utf-8')
files[cell_images_rels_name] = cell_images_rels_xml.encode('utf-8')
files.update(new_media)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(OUTPUT, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as output_zip:
    for name, data in files.items():
        output_zip.writestr(name, data)

Path('work/in_cell_mapping.tsv').write_text('\n'.join(mapping_lines) + '\n', encoding='utf-8')
print(f'Created {OUTPUT} with {len(new_cells)} in-cell images.')
