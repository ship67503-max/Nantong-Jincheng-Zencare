from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps


BG = (246, 247, 245)
LINE = (224, 227, 224)


def fit_image(source: Image.Image, size: tuple[int, int]) -> Image.Image:
    source = source.convert("RGB")
    fitted = ImageOps.contain(source, size, method=Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", size, BG)
    canvas.paste(fitted, ((size[0] - fitted.width) // 2, (size[1] - fitted.height) // 2))
    return canvas


def paste_with_shadow(canvas: Image.Image, image: Image.Image, xy: tuple[int, int]) -> None:
    x, y = xy
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rectangle((x + 10, y + 12, x + image.width + 10, y + image.height + 12), fill=(25, 35, 35, 30))
    shadow = shadow.filter(ImageFilter.GaussianBlur(16))
    canvas.paste(shadow, (0, 0), shadow)
    canvas.paste(image, (x, y))
    draw = ImageDraw.Draw(canvas)
    draw.rectangle((x - 1, y - 1, x + image.width, y + image.height), outline=LINE, width=2)


def save_jpg(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, format="JPEG", quality=93, subsampling=0, optimize=True, progressive=True)


def make_product_card(source: Image.Image) -> Image.Image:
    canvas = Image.new("RGB", (1600, 1200), BG)
    image = fit_image(source, (1504, 846))
    paste_with_shadow(canvas, image, ((1600 - image.width) // 2, (1200 - image.height) // 2))
    return canvas


def make_blog_banner(source: Image.Image) -> Image.Image:
    canvas = Image.new("RGB", (1920, 1080), BG)
    image = fit_image(source, (1856, 1016))
    paste_with_shadow(canvas, image, ((1920 - image.width) // 2, (1080 - image.height) // 2))
    return canvas


def make_collection_cover(sources: list[Image.Image]) -> Image.Image:
    canvas = Image.new("RGB", (1920, 1080), BG)
    tile_w, tile_h, gap = 576, 900, 32
    total_w = tile_w * 3 + gap * 2
    start_x = (1920 - total_w) // 2
    y = (1080 - tile_h) // 2
    for index, source in enumerate(sources[:3]):
        image = ImageOps.fit(source.convert("RGB"), (tile_w, tile_h), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
        paste_with_shadow(canvas, image, (start_x + index * (tile_w + gap), y))
    return canvas


def main() -> None:
    parser = argparse.ArgumentParser(description="Create website-ready layouts from polished product photos")
    parser.add_argument("--input-dir", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()

    paths = sorted(args.input_dir.glob("*.jpg"))
    images: dict[str, Image.Image] = {}
    for path in paths:
        with Image.open(path) as source:
            images[path.name] = source.convert("RGB")

    for name, source in images.items():
        stem = Path(name).stem
        save_jpg(make_product_card(source), args.output_dir / "product-card-4x3" / f"{stem}-card.jpg")
        save_jpg(make_blog_banner(source), args.output_dir / "blog-banner-16x9" / f"{stem}-banner.jpg")

    raw_names = [name for name in images if name.startswith("puppy-pad-raw-material")]
    finished_names = [name for name in images if not name.startswith("puppy-pad-raw-material")]
    save_jpg(
        make_collection_cover([images[name] for name in raw_names]),
        args.output_dir / "collection-covers" / "raw-materials-collection-cover.jpg",
    )
    save_jpg(
        make_collection_cover([images[name] for name in finished_names]),
        args.output_dir / "collection-covers" / "finished-products-collection-cover.jpg",
    )
    print(f"Created {len(images)} product cards, {len(images)} blog banners, and 2 collection covers")


if __name__ == "__main__":
    main()
