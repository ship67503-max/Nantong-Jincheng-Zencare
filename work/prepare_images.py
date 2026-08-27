from PIL import Image
from pathlib import Path

product_names = [
    '297e7d56-6052-4322-bfa0-397eaf026db9.png',
    '497e8aed-0a86-4ac6-9c4e-e7ac8039dbba.png',
    '573cf695-75f3-4013-9b91-53f767e8335d.png',
    '5f12246d-9740-48b2-8030-502a970451db.png',
    '619be7ce-cb5d-40b3-8a7f-5bab1b6da093.png',
    '635b333e-d808-490a-97a1-073745495b15.png',
    '8b883acd-b203-47fa-8dca-ae73f2911635.png',
    'b345f6f6-2b6d-4f5f-9576-9888abf18e1e.png',
    'c188c885-a92d-4026-8cfb-3a58480439a6.png',
    'ca82bd11-11c4-4e76-b3c7-3892910279cf.png',
    'e2c58bc0-9965-43dd-82c9-b4cb53be1ab0.png',
    'e8bf62de-048e-4ea2-8590-d4b90a02419b.png',
    'f1bec61a-99ba-45b3-840d-77280a671e92.png',
    'f757d590-8eca-4374-acef-7084889fa0e3.png',
]
lab_names = [
    '2026-08-06 132741.jpg', '2026-08-06 132845.jpg', '2026-08-06 132859.jpg',
    '2026-08-06 133135.jpg', '2026-08-06 133209.jpg', '2026-08-06 133401.jpg',
    '2026-08-06 133505.jpg', '2026-08-06 133620.jpg', '2026-08-06 133632.jpg',
    '2026-08-06 133641.jpg', '2026-08-06 134125.jpg', '2026-08-06 134131.jpg',
    '2026-08-06 134148.jpg', '2026-08-06 134149.jpg', '2026-08-06 134554.jpg',
    '2026-08-06 134602.jpg', '2026-08-06 134723.jpg', '2026-08-06 134757.jpg',
    '2026-08-06 134801.jpg', '2026-08-06 134826.jpg',
]

def resize_one(src, dst):
    im = Image.open(src).convert('RGB')
    im.thumbnail((480, 300), Image.Resampling.LANCZOS)
    canvas = Image.new('RGB', (480, 300), 'white')
    canvas.paste(im, ((480-im.width)//2, (300-im.height)//2))
    canvas.save(dst, 'JPEG', quality=86, optimize=True)

out = Path('work/prepared')
out.mkdir(parents=True, exist_ok=True)
for folder, names in [
    (Path(r'C:/Users/Administrator/Desktop/产品图和材料图新'), product_names),
    (Path(r'C:/Users/Administrator/Desktop/实验-JPG'), lab_names),
]:
    for name in names:
        src = folder / name
        dst = out / (name.rsplit('.', 1)[0].replace(' ', '_') + '.jpg')
        resize_one(src, dst)
