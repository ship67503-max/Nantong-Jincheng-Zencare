# -*- coding: utf-8 -*-
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps

src = Path(r"C:\Users\Administrator\Desktop\洽谈\去除时间水印")
out_dir = Path(r"C:\Users\Administrator\Documents\独立站修改\work\current_check")
out_dir.mkdir(parents=True, exist_ok=True)

files = sorted([p for p in src.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}])
thumb_w, thumb_h = 320, 220
cols = 3
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * thumb_w, rows * thumb_h), "#f7fafc")
draw = ImageDraw.Draw(sheet)

for idx, path in enumerate(files):
    im = Image.open(path).convert("RGB")
    im.thumbnail((thumb_w - 14, thumb_h - 42))
    cell = Image.new("RGB", (thumb_w, thumb_h), "white")
    cell_draw = ImageDraw.Draw(cell)
    cell_draw.rectangle([0, 0, thumb_w - 1, thumb_h - 1], outline="#cbd5e1", width=1)
    x = (thumb_w - im.width) // 2
    y = 10 + (thumb_h - 42 - im.height) // 2
    cell.paste(im, (x, y))
    cell_draw.text((10, thumb_h - 28), f"{idx + 1}. {path.stem}", fill="#0f172a")
    sheet.paste(cell, ((idx % cols) * thumb_w, (idx // cols) * thumb_h))

sheet.save(out_dir / "business_contact_sheet.jpg", quality=92)
print(f"saved {len(files)} images")
