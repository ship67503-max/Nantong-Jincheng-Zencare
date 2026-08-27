from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps


def feather_mask(size: tuple[int, int], inset: int, blur: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((inset, inset, size[0] - inset, size[1] - inset), radius=32, fill=255)
    return mask.filter(ImageFilter.GaussianBlur(blur))


def shadow_layer(canvas_size: tuple[int, int], box: tuple[int, int, int, int], blur: int = 28) -> Image.Image:
    layer = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 8, y0 + 14, x1 + 8, y1 + 14), radius=28, fill=(25, 35, 35, 40))
    return layer.filter(ImageFilter.GaussianBlur(blur))


def product_main(background: Image.Image, source: Image.Image) -> Image.Image:
    canvas = ImageOps.fit(background.convert("RGB"), (1024, 1024), method=Image.Resampling.LANCZOS).convert("RGBA")
    photo = ImageOps.fit(source.convert("RGB"), (920, 690), method=Image.Resampling.LANCZOS)
    x, y = 52, 210
    canvas = Image.alpha_composite(canvas, shadow_layer(canvas.size, (x, y, x + photo.width, y + photo.height)))
    mask = feather_mask(photo.size, inset=24, blur=34)
    canvas.paste(photo, (x, y), mask)
    return canvas.convert("RGB")


def blog_header(background: Image.Image, source: Image.Image) -> Image.Image:
    canvas = ImageOps.fit(background.convert("RGB"), (1536, 1024), method=Image.Resampling.LANCZOS).convert("RGBA")
    photo = ImageOps.fit(source.convert("RGB"), (760, 570), method=Image.Resampling.LANCZOS)
    x, y = 720, 248
    canvas = Image.alpha_composite(canvas, shadow_layer(canvas.size, (x, y, x + photo.width, y + photo.height), blur=30))
    mask = Image.new("L", photo.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, photo.width - 1, photo.height - 1), radius=24, fill=255)
    canvas.paste(photo, (x, y), mask)
    return canvas.convert("RGB")


def save_outputs(image: Image.Image, jpg_path: Path, webp_path: Path) -> None:
    jpg_path.parent.mkdir(parents=True, exist_ok=True)
    webp_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(jpg_path, format="JPEG", quality=94, subsampling=0, optimize=True, progressive=True)
    image.save(webp_path, format="WEBP", quality=90, method=6)


def main() -> None:
    parser = argparse.ArgumentParser(description="Composite real product photos onto AI-generated website backgrounds")
    parser.add_argument("--product-background", type=Path, required=True)
    parser.add_argument("--blog-background", type=Path, required=True)
    parser.add_argument("--product-input", type=Path, required=True)
    parser.add_argument("--blog-input", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()

    with Image.open(args.product_background) as im:
        product_bg = im.convert("RGB")
    with Image.open(args.blog_background) as im:
        blog_bg = im.convert("RGB")

    product_paths = [
        path
        for path in sorted(args.product_input.glob("*.jpg"))
        if not path.name.startswith("puppy-pad-raw-material")
    ]
    blog_paths = sorted(args.blog_input.glob("*.jpg"))

    for path in product_paths:
        with Image.open(path) as source:
            output = product_main(product_bg, source)
        stem = path.stem.removesuffix("-product")
        save_outputs(
            output,
            args.output_dir / "product-main-jpg" / f"{stem}-ai-main.jpg",
            args.output_dir / "product-main-webp" / f"{stem}-ai-main.webp",
        )

    for path in blog_paths:
        with Image.open(path) as source:
            output = blog_header(blog_bg, source)
        stem = path.stem.removesuffix("-blog")
        save_outputs(
            output,
            args.output_dir / "blog-jpg" / f"{stem}-ai-blog.jpg",
            args.output_dir / "blog-webp" / f"{stem}-ai-blog.webp",
        )
    print(f"Created {len(product_paths)} AI-assisted product mains and {len(blog_paths)} AI-assisted Blog images")


if __name__ == "__main__":
    main()
