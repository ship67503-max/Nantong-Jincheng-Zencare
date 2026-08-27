from __future__ import annotations
from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as ET
import json, re
from PIL import Image, ImageDraw, ImageFont

SRC = next(Path(r'C:\Users\Administrator\Documents\xwechat_files\wxid_xbi9o0tdyhpq12_be07\msg\file\2026-08').glob('*独立站AI图-新增产品图片(1).xlsx'))
OUT = Path(r'C:\Users\Administrator\Documents\独立站修改\work\current_media')
OUT.mkdir(parents=True, exist_ok=True)
NS = {'etc':'http://www.wps.cn/officeDocument/2017/etCustomData', 'xdr':'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing', 'a':'http://schemas.openxmlformats.org/drawingml/2006/main', 'r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
with ZipFile(SRC) as z:
    rel_root = ET.fromstring(z.read('xl/_rels/cellimages.xml.rels'))
    rels = {rel.attrib['Id']: rel.attrib['Target'] for rel in rel_root}
    root = ET.fromstring(z.read('xl/cellimages.xml'))
    mapping = {}
    for cell in root.findall('etc:cellImage', NS):
        name_el = cell.find('.//xdr:cNvPr', NS)
        blip = cell.find('.//a:blip', NS)
        if name_el is None or blip is None:
            continue
        image_id = name_el.attrib.get('name')
        rid = blip.attrib.get('{%s}embed' % NS['r'])
        target = rels.get(rid)
        if image_id and target:
            target = target.replace('..\\','').replace('../','')
            mapping[image_id] = {'rid':rid,'target':target}
            source_name = 'xl/' + target if not target.startswith('xl/') else target
            try:
                data = z.read(source_name)
            except KeyError:
                data = z.read('xl/' + target.lstrip('/'))
            (OUT / f'{image_id}.jpeg').write_bytes(data)

rows = json.loads(Path(r'C:\Users\Administrator\Documents\独立站修改\work\current_rows.json').read_text(encoding='utf-8'))
selected = []
for row in rows[1:]:
    for col in ['photo','current']:
        v = row.get(col)
        if isinstance(v,str):
            m = re.search(r'ID_([A-F0-9]+)', v)
            if m:
                image_id = 'ID_' + m.group(1)
                selected.append({'row':row['row'],'col':col,'id':image_id,'desc':row['desc']})

Path(OUT/'mapping.json').write_text(json.dumps(mapping, ensure_ascii=False, indent=2), encoding='utf-8')
Path(OUT/'selected.json').write_text(json.dumps(selected, ensure_ascii=False, indent=2), encoding='utf-8')

font = ImageFont.load_default()
items = []
seen = set()
for s in selected:
    if s['id'] in seen or not (OUT/f"{s['id']}.jpeg").exists():
        continue
    seen.add(s['id'])
    items.append(s)
    if len(items) >= 50:
        break
cols=5; thumb_w=230; thumb_h=160; label_h=45
sheet = Image.new('RGB',(cols*thumb_w, ((len(items)+cols-1)//cols)*(thumb_h+label_h)), 'white')
draw = ImageDraw.Draw(sheet)
for idx,s in enumerate(items):
    rr,cc=divmod(idx,cols); x,y=cc*thumb_w,rr*(thumb_h+label_h)
    im=Image.open(OUT/f"{s['id']}.jpeg").convert('RGB'); im.thumbnail((thumb_w-8,thumb_h-8))
    tile=Image.new('RGB',(thumb_w-8,thumb_h-8),'#eee'); tile.paste(im,((thumb_w-8-im.width)//2,(thumb_h-8-im.height)//2)); sheet.paste(tile,(x+4,y+4))
    draw.text((x+4,y+thumb_h+3),f"r{s['row']} {s['col']} {s['id'][-6:]}",fill='black',font=font)
sheet.save(OUT/'selected_contact.jpg',quality=88)
print('extracted',len(mapping),'images; selected',len(selected),'refs')
