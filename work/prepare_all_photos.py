# -*- coding: utf-8 -*-
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageOps

sources = {
    "product": Path(r"C:\Users\Administrator\Desktop\产品图和材料图新"),
    "lab": Path(r"C:\Users\Administrator\Desktop\实验-JPG"),
    "business": Path(r"C:\Users\Administrator\Desktop\洽谈\去除时间水印"),
}
out_root = Path(r"C:\Users\Administrator\Documents\独立站修改\work\prepared_all")
out_root.mkdir(parents=True, exist_ok=True)

manifest_lines = []
max_side = 1200
quality = 82

for category, src_dir in sources.items():
    dst_dir = out_root / category
    dst_dir.mkdir(parents=True, exist_ok=True)
    files = sorted(
        p for p in src_dir.rglob("*")
        if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
    )
    for idx, src in enumerate(files, start=1):
        dst = dst_dir / f"{idx:03d}.jpg"
        with Image.open(src) as im:
            im = im.convert("RGB")
            im.thumbnail((max_side, max_side))
            canvas = Image.new("RGB", im.size, "white")
            canvas.paste(im)
            canvas.save(dst, format="JPEG", quality=quality, optimize=True)
        manifest_lines.append(f"{category}\t{src}\t{dst}")

(out_root / "manifest.tsv").write_text("\n".join(manifest_lines) + "\n", encoding="utf-8")
print(f"saved {len(manifest_lines)} prepared photos")
