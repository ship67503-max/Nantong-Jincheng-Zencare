from PIL import Image, ImageOps, ImageDraw, ImageFont
from pathlib import Path
import math

def make_sheet(src, out, cols=5, thumb_w=260, thumb_h=190, label_h=44, per_sheet=50):
    files = sorted([p for p in Path(src).iterdir() if p.is_file() and p.suffix.lower() in {'.png','.jpg','.jpeg','.webp'}])
    font = ImageFont.load_default()
    for page_start in range(0, len(files), per_sheet):
        chunk = files[page_start:page_start+per_sheet]
        rows = math.ceil(len(chunk)/cols)
        sheet = Image.new('RGB', (cols*thumb_w, rows*(thumb_h+label_h)), 'white')
        draw = ImageDraw.Draw(sheet)
        for idx, p in enumerate(chunk):
            r, c = divmod(idx, cols)
            x, y = c*thumb_w, r*(thumb_h+label_h)
            try:
                im = Image.open(p).convert('RGB')
                im.thumbnail((thumb_w-10, thumb_h-10))
                tile = Image.new('RGB', (thumb_w-10, thumb_h-10), '#eeeeee')
                tile.paste(im, ((thumb_w-10-im.width)//2, (thumb_h-10-im.height)//2))
                sheet.paste(tile, (x+5,y+5))
            except Exception as e:
                draw.text((x+5,y+5), f'ERR {e}', fill='red', font=font)
            label = p.name
            # wrap labels into 2 lines where needed
            if len(label)>34:
                label = label[:34]+'\n'+label[34:]
            draw.multiline_text((x+5, y+thumb_h+4), label, fill='black', font=font, spacing=2)
        outp = Path(out)
        outp.mkdir(parents=True, exist_ok=True)
        sheet.save(outp / f'contact_{page_start//per_sheet+1:02d}.jpg', quality=88)

make_sheet(r'C:/Users/Administrator/Desktop/产品图和材料图新', r'work/contacts/products', cols=4, thumb_w=320, thumb_h=220, per_sheet=40)
make_sheet(r'C:/Users/Administrator/Desktop/实验-JPG', r'work/contacts/lab', cols=5, thumb_w=260, thumb_h=190, per_sheet=50)
