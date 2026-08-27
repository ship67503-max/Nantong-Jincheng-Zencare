from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter


PRODUCT_SHOTS = {
    "bamboo-charcoal-puppy-pads-package-and-open-pad-blog.jpg",
    "cartoon-pet-training-pads-package-and-white-pads-blog.jpg",
    "disposable-pet-cleanup-gloves-package-and-gloves-blog.jpg",
    "blue-puppy-pads-package-and-stacked-pads-blog.jpg",
    "white-disposable-underpads-package-and-stacked-pads-blog.jpg",
    "bamboo-charcoal-puppy-pads-package-and-stacked-pads-blog.jpg",
}

BLACK_BACKING = {
    "puppy-pad-raw-material-layers-with-black-backing-closeup-01-blog.jpg",
    "puppy-pad-raw-material-layers-with-black-backing-overhead-01-blog.jpg",
    "puppy-pad-raw-material-layers-with-black-backing-overhead-02-blog.jpg",
    "puppy-pad-raw-material-layers-with-black-backing-three-quarter-01-blog.jpg",
    "puppy-pad-raw-material-layers-with-black-backing-three-quarter-02-blog.jpg",
}


def smoothstep(edge0: float, edge1: float, value: np.ndarray) -> np.ndarray:
    value = np.clip((value - edge0) / (edge1 - edge0), 0.0, 1.0)
    return value * value * (3.0 - 2.0 * value)


def to_image(array: np.ndarray) -> Image.Image:
    return Image.fromarray(np.clip(array * 255.0 + 0.5, 0, 255).astype(np.uint8), "RGB")


def to_array(image: Image.Image) -> np.ndarray:
    return np.asarray(image.convert("RGB"), dtype=np.float32) / 255.0


def premium_backdrop(height: int, width: int) -> np.ndarray:
    yy, xx = np.mgrid[0:height, 0:width]
    x = xx / max(width - 1, 1)
    y = yy / max(height - 1, 1)

    base = np.array([0.946, 0.939, 0.922], dtype=np.float32)
    daylight = 0.030 * (1.0 - x) + 0.018 * (1.0 - y)
    center = np.exp(-(((x - 0.53) / 0.63) ** 2 + ((y - 0.46) / 0.80) ** 2))
    vignette = -0.020 * (1.0 - center)
    result = base[None, None, :] + daylight[..., None] + vignette[..., None]
    result[..., 2] -= 0.004
    return np.clip(result, 0.0, 1.0)


def neutral_masks(array: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    luminance = (
        0.2126 * array[..., 0]
        + 0.7152 * array[..., 1]
        + 0.0722 * array[..., 2]
    )
    chroma = array.max(axis=2) - array.min(axis=2)
    bright_neutral = smoothstep(0.73, 0.93, luminance) * (1.0 - smoothstep(0.055, 0.19, chroma))
    dark_neutral = (1.0 - smoothstep(0.18, 0.44, luminance)) * (1.0 - smoothstep(0.09, 0.24, chroma))
    return luminance, chroma, np.clip(bright_neutral, 0.0, 1.0)


def clean_edge_artifacts(array: np.ndarray, backdrop: np.ndarray) -> np.ndarray:
    height, width = array.shape[:2]
    luminance, chroma, _ = neutral_masks(array)
    x = np.linspace(0.0, 1.0, width, dtype=np.float32)[None, :]
    left = 1.0 - smoothstep(0.015, 0.18, x)
    right = smoothstep(0.82, 0.985, x)
    edge = np.maximum(left, right)

    # The source sweep has gray side panels and horizontal export streaks. Restrict
    # cleanup to neutral mid/high tones at the outer edges so products remain intact.
    neutral = 1.0 - smoothstep(0.055, 0.18, chroma)
    mid_high = smoothstep(0.38, 0.70, luminance)
    mask = (edge * neutral * mid_high)[..., None]
    mask = to_array(to_image(np.repeat(mask, 3, axis=2)).filter(ImageFilter.GaussianBlur(18.0)))[..., :1]
    result = array * (1.0 - 0.92 * mask) + backdrop * (0.92 * mask)

    # Smooth the remaining scanline blocks in darker neutral side-wall areas. A
    # local-detail gate protects product fibers, seams, folds, and printed matter.
    local_blur = to_array(to_image(array).filter(ImageFilter.GaussianBlur(5.0)))
    side_blur = to_array(to_image(array).filter(ImageFilter.GaussianBlur(46.0)))
    detail = np.mean(np.abs(array - local_blur), axis=2)
    low_detail = 1.0 - smoothstep(0.010, 0.042, detail)
    above_black = smoothstep(0.16, 0.34, luminance)
    smooth_mask = (edge * neutral * low_detail * above_black)[..., None]
    smooth_mask = to_array(
        to_image(np.repeat(smooth_mask, 3, axis=2)).filter(ImageFilter.GaussianBlur(15.0))
    )[..., :1]
    result = result * (1.0 - 0.78 * smooth_mask) + side_blur * (0.78 * smooth_mask)
    return result


def retouch(source: Image.Image, preset: str) -> Image.Image:
    source = source.convert("RGB")
    if source.size != (1920, 1080):
        source = source.resize((1920, 1080), Image.Resampling.LANCZOS)

    original = to_array(source)
    height, width = original.shape[:2]
    backdrop = premium_backdrop(height, width)
    array = clean_edge_artifacts(original, backdrop)

    luminance, chroma, bright_neutral = neutral_masks(array)
    low_frequency = to_array(to_image(array).filter(ImageFilter.GaussianBlur(34.0)))
    high_frequency = array - low_frequency

    if preset == "materials":
        background_strength = 0.30
        texture_strength = 1.18
        exposure = 1.015
        contrast = 1.055
        saturation = 0.90
    elif preset == "black":
        background_strength = 0.25
        texture_strength = 1.13
        exposure = 1.005
        contrast = 1.075
        saturation = 0.92
    else:
        background_strength = 0.20
        texture_strength = 1.08
        exposure = 1.008
        contrast = 1.045
        saturation = 0.95

    # Replace only low-frequency neutral highlights. High-frequency fibers, folds,
    # seams, printing, and label detail are restored from the original photograph.
    neutral_mix = (bright_neutral * background_strength)[..., None]
    array = array * (1.0 - neutral_mix) + backdrop * neutral_mix
    array += high_frequency * (texture_strength - 1.0) * bright_neutral[..., None]

    # Warm-neutral commercial balance with a conservative highlight rolloff.
    array[..., 0] *= 1.010
    array[..., 1] *= 1.002
    array[..., 2] *= 0.987
    array *= exposure
    array = 0.5 + (array - 0.5) * contrast
    array = np.clip(array, 0.0, 1.0)
    array = array * 1.035 / (1.0 + 0.035 * array)

    image = to_image(array)
    image = ImageEnhance.Color(image).enhance(saturation)
    image = image.filter(ImageFilter.UnsharpMask(radius=1.35, percent=68, threshold=3))

    # A very light global grain prevents the retouched backdrop from looking synthetic.
    rng = np.random.default_rng(20260807)
    result = to_array(image)
    grain = rng.normal(0.0, 0.0014, (height, width, 1)).astype(np.float32)
    result = np.clip(result + grain, 0.0, 1.0)
    return to_image(result)


def preset_for(filename: str) -> str:
    if filename in PRODUCT_SHOTS:
        return "product"
    if filename in BLACK_BACKING:
        return "black"
    return "materials"


def make_contact_sheet(files: list[Path], output: Path) -> None:
    thumbs: list[Image.Image] = []
    for path in files:
        image = Image.open(path).convert("RGB")
        image.thumbnail((480, 270), Image.Resampling.LANCZOS)
        thumbs.append(image)

    columns = 3
    rows = (len(thumbs) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * 480, rows * 270), (235, 233, 228))
    for index, image in enumerate(thumbs):
        x = (index % columns) * 480
        y = (index // columns) * 270
        sheet.paste(image, (x, y))
    sheet.save(output, quality=92, subsampling=0)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    args.output.mkdir(parents=True, exist_ok=True)
    files = sorted(args.source.glob("*.jpg"))
    outputs: list[Path] = []
    for path in files:
        if path.name not in PRODUCT_SHOTS and "puppy-pad-raw-material-layers" not in path.name:
            continue
        destination = args.output / path.name
        with Image.open(path) as image:
            result = retouch(image, preset_for(path.name))
            result.save(destination, quality=94, subsampling=0, optimize=True)
        outputs.append(destination)
        print(f"{path.name}: {preset_for(path.name)} -> {destination}")

    make_contact_sheet(outputs, args.output / "_contact-sheet.jpg")
    print(f"Processed {len(outputs)} images")


if __name__ == "__main__":
    main()
