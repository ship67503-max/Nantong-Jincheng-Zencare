from pathlib import Path
import json, re
from PIL import Image, ImageDraw, ImageFont
OUT=Path(r'C:\Users\Administrator\Documents\独立站修改\work\current_media')
rows=json.loads(Path(r'C:\Users\Administrator\Documents\独立站修改\work\current_rows.json').read_text(encoding='utf-8'))
items=[]; seen=set()
for row in rows[196:]:
    for col in ['photo','current']:
        v=row.get(col)
        if not isinstance(v,str): continue
        m=re.search(r'ID_([A-F0-9]+)',v)
        if not m: continue
        image_id='ID_'+m.group(1)
        if image_id in seen or not (OUT/f'{image_id}.jpeg').exists(): continue
        seen.add(image_id); items.append({'row':row['row'],'col':col,'id':image_id,'desc':row['desc']})
font=ImageFont.load_default(); cols=4; tw=300; th=200; lh=42
sheet=Image.new('RGB',(cols*tw,((len(items)+cols-1)//cols)*(th+lh)),'white'); draw=ImageDraw.Draw(sheet)
for i,s in enumerate(items):
    rr,cc=divmod(i,cols); x,y=cc*tw,rr*(th+lh)
    im=Image.open(OUT/f"{s['id']}.jpeg").convert('RGB'); im.thumbnail((tw-8,th-8)); tile=Image.new('RGB',(tw-8,th-8),'#eee'); tile.paste(im,((tw-8-im.width)//2,(th-8-im.height)//2)); sheet.paste(tile,(x+4,y+4)); draw.text((x+4,y+th+3),f"r{s['row']} {s['col']} {s['id'][-6:]}",fill='black',font=font)
sheet.save(OUT/'later_contact.jpg',quality=88)
print('items',len(items))
