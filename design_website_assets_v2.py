from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps


BG = np.array([248.0, 249.0, 247.0], dtype=np.float32)


def clean_edge_scaffold(image: Image.Image) -> Image.Image:
    rgb = np.asarray(image.convert("RGB"), dtype=np.float32)
    h, w = rgb.shape[:2]
    lum = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    edge = np.zeros((h, w), dtype=np.float32)
    edge[:, : max(1, int(w * 0.045))] = 1
    edge[:, w - max(1, int(w * 0.045)) :] = 1
    edge[: max(1, int(h * 0.08)), :] = 1
    # Only neutral, dim scaffold tones are eligible; colored packaging and black material stay untouched.
    mask = (edge > 0) & (lum < 170) & (sat < 26)
    if not mask.any():
        return image
    fill = np.empty_like(rgb)
    left_ref = rgb[:, min(w - 1, int(w * 0.10)), :]
    right_ref = rgb[:, max(0, int(w * 0.90)), :]
    top_ref = rgb[min(h - 1, int(h * 0.12)), :, :]
    fill[:, : w // 2, :] = left_ref[:, None, :]
    fill[:, w // 2 :, :] = right_ref[:, None, :]
    fill[: h // 2, :, :] = (fill[: h // 2, :, :] + top_ref[None, :, :]) / 2
    fill = np.clip(fill * 1.08, 0, 255)
    alpha = Image.fromarray((mask.astype(np.uint8) * 255), "L").filter(ImageFilter.GaussianBlur(28))
    alpha_arr = np.asarray(alpha, dtype=np.float32)[:, :, None] / 255.0
    result = rgb * (1 - alpha_arr) + fill * alpha_arr
    return Image.fromarray(np.clip(result, 0, 255).astype(np.uint8), "RGB")


def prepare(source: Image.Image) -> Image.Image:
    image = ImageOps.exif_transpose(source).convert("RGB")
    image = image.crop((140, 40, image.width - 140, image.height - 40))
    image = clean_edge_scaffold(image)
    image = ImageEnhance.Contrast(image).enhance(1.025)
    return image


def fit_on_canvas(source: Image.Image, canvas_size: tuple[int, int], image_size: tuple[int, int]) -> Image.Image:
    canvas = Image.new("RGB", canvas_size, tuple(BG.astype(np.uint8)))
    image = ImageOps.fit(source, image_size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    x = (canvas.width - image.width) // 2
    y = (canvas.height - image.height) // 2
    canvas.paste(image, (x, y))
    return canvas


def save_jpg(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, format="JPEG", quality=94, subsampling=0, optimize=True, progressive=True)


def save_webp(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, format="WEBP", quality=90, method=6)


def main() -> None:
    parser = argparse.ArgumentParser(description="Create ecommerce-ready product and blog assets")
    parser.add_argument("--input-dir", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()

    paths = sorted(args.input_dir.glob("*.jpg"))
    prepared: dict[str, Image.Image] = {}
    for path in paths:
        with Image.open(path) as source:
            prepared[path.name] = prepare(source)

    for name, source in prepared.items():
        stem = Path(name).stem
        card = fit_on_canvas(source, (1600, 1200), (1504, 1128))
        banner = fit_on_canvas(source, (1920, 1080), (1856, 1016))
        save_jpg(card, args.output_dir / "ecommerce-product-4x3" / f"{stem}-product.jpg")
        save_jpg(banner, args.output_dir / "blog-banner-16x9" / f"{stem}-blog.jpg")
        save_webp(card, args.output_dir / "ecommerce-product-4x3-webp" / f"{stem}-product.webp")
        save_webp(banner, args.output_dir / "blog-banner-16x9-webp" / f"{stem}-blog.webp")
    print(f"Created {len(prepared)} ecommerce product images and {len(prepared)} blog banners")


if __name__ == "__main__":
    main()
