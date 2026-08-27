from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps


LIGHT = (248, 249, 247)
LINE = (224, 227, 224)


def add_shadow(canvas: Image.Image, box: tuple[int, int, int, int]) -> None:
    x0, y0, x1, y1 = box
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.rounded_rectangle((x0 + 10, y0 + 14, x1 + 10, y1 + 14), radius=6, fill=(25, 35, 35, 30))
    canvas.paste(layer.filter(ImageFilter.GaussianBlur(18)), (0, 0), layer.filter(ImageFilter.GaussianBlur(18)))


def save_jpg(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, format="JPEG", quality=94, subsampling=0, optimize=True, progressive=True)


def save_webp(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, format="WEBP", quality=90, method=6)


def make_product_main(source: Image.Image) -> Image.Image:
    canvas = Image.new("RGB", (1600, 1600), LIGHT)
    image = ImageOps.fit(source.convert("RGB"), (1480, 1110), method=Image.Resampling.LANCZOS)
    x = (1600 - image.width) // 2
    y = (1600 - image.height) // 2
    add_shadow(canvas, (x, y, x + image.width, y + image.height))
    canvas.paste(image, (x, y))
    ImageDraw.Draw(canvas).rectangle((x, y, x + image.width - 1, y + image.height - 1), outline=LINE, width=2)
    return canvas


def side_density(image: Image.Image, side: str) -> float:
    arr = np.asarray(image.convert("RGB"), dtype=np.float32)
    width = max(1, int(arr.shape[1] * 0.28))
    region = arr[:, :width] if side == "left" else arr[:, -width:]
    luminance = 0.2126 * region[:, :, 0] + 0.7152 * region[:, :, 1] + 0.0722 * region[:, :, 2]
    distance = np.abs(luminance - 245.0)
    return float(distance.mean() + luminance.std() * 0.35)


def make_blog_image(source: Image.Image) -> Image.Image:
    image = ImageOps.fit(source.convert("RGB"), (1920, 1080), method=Image.Resampling.LANCZOS)
    side = "left" if side_density(image, "left") < side_density(image, "right") else "right"
    panel_width = 520
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    if side == "left":
        draw.rectangle((0, 0, panel_width, image.height), fill=(*LIGHT, 204))
        draw.line((panel_width, 0, panel_width, image.height), fill=(*LINE, 220), width=2)
    else:
        draw.rectangle((image.width - panel_width, 0, image.width, image.height), fill=(*LIGHT, 204))
        draw.line((image.width - panel_width, 0, image.width - panel_width, image.height), fill=(*LINE, 220), width=2)
    return Image.alpha_composite(image.convert("RGBA"), overlay).convert("RGB")


def main() -> None:
    parser = argparse.ArgumentParser(description="Create blog and ecommerce main images")
    parser.add_argument("--product-input", type=Path, required=True)
    parser.add_argument("--blog-input", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()

    product_files = sorted(args.product_input.glob("*.jpg"))
    blog_files = sorted(args.blog_input.glob("*.jpg"))
    for product_path in product_files:
        with Image.open(product_path) as source:
            image = make_product_main(source)
        stem = product_path.stem.removesuffix("-product")
        save_jpg(image, args.output_dir / "product-main-images" / f"{stem}-main.jpg")
        save_webp(image, args.output_dir / "product-main-images-webp" / f"{stem}-main.webp")

    for blog_path in blog_files:
        with Image.open(blog_path) as source:
            image = make_blog_image(source)
        stem = blog_path.stem.removesuffix("-blog")
        save_jpg(image, args.output_dir / "blog-images" / f"{stem}-blog.jpg")
        save_webp(image, args.output_dir / "blog-images-webp" / f"{stem}-blog.webp")
    print(f"Created {len(product_files)} product mains and {len(blog_files)} blog images")


if __name__ == "__main__":
    main()
