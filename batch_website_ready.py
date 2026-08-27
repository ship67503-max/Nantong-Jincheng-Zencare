from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

from retouch_product_photos import retouch, smoothstep, to_array, to_image, preset_for


ROOT = Path(__file__).resolve().parent
SOURCE = Path(r"C:\Users\Administrator\Desktop\独立站可用图片_V2\blog-banner-16x9")
OUTPUT = ROOT / "website_ready"
BACKGROUNDS = {
    "A_lifestyle": OUTPUT / "backgrounds" / "lifestyle.png",
    "B_studio": OUTPUT / "backgrounds" / "studio.png",
    "C_oem": OUTPUT / "backgrounds" / "oem.png",
}


def fit_background(path: Path) -> np.ndarray:
    with Image.open(path) as image:
        image = ImageOps.fit(image.convert("RGB"), (1920, 1080), Image.Resampling.LANCZOS)
        return to_array(image)


def low_frequency_background_mix(source: Image.Image, background: np.ndarray, strength: float) -> Image.Image:
    """Blend generated scenery into low-detail regions while retaining real product detail."""
    original = to_array(source)
    height, width = original.shape[:2]
    yy, xx = np.mgrid[0:height, 0:width]
    x = xx / max(width - 1, 1)
    y = yy / max(height - 1, 1)
    distance = np.sqrt(((x - 0.5) / 0.72) ** 2 + ((y - 0.52) / 0.72) ** 2)
    # Restrict the generated scene to the outer margin. This avoids ghosting over
    # pale products whose edges are close in tone to the original sweep.
    edge_priority = smoothstep(0.70, 1.02, distance)

    blurred = to_array(to_image(original).filter(ImageFilter.GaussianBlur(24)))
    detail = np.mean(np.abs(original - blurred), axis=2)
    low_detail = 1.0 - smoothstep(0.012, 0.055, detail)
    luminance = 0.2126 * original[..., 0] + 0.7152 * original[..., 1] + 0.0722 * original[..., 2]
    chroma = original.max(axis=2) - original.min(axis=2)
    neutral = 1.0 - smoothstep(0.07, 0.26, chroma)
    # Keep the middle of the frame mostly photographic; replace scenery primarily at edges.
    weight = strength * edge_priority * (0.28 + 0.72 * low_detail * neutral)
    # Dark/colored packaging and printed regions are always protected.
    weight *= 1.0 - 0.52 * smoothstep(0.10, 0.42, chroma)
    # Very bright product highlights are only lightly influenced.
    weight *= 1.0 - 0.22 * smoothstep(0.78, 0.98, luminance)
    weight = np.clip(weight, 0.0, 0.42)[..., None]
    result = original * (1.0 - weight) + background * weight
    return to_image(result)


def finish(image: Image.Image, style: str) -> Image.Image:
    image = image.convert("RGB")
    if style == "A_lifestyle":
        image = ImageEnhance.Color(image).enhance(0.96)
        image = ImageEnhance.Contrast(image).enhance(1.035)
        image = ImageEnhance.Brightness(image).enhance(1.012)
        arr = to_array(image)
        arr[..., 0] *= 1.012
        arr[..., 2] *= 0.982
        image = to_image(np.clip(arr, 0.0, 1.0))
    elif style == "B_studio":
        image = ImageEnhance.Color(image).enhance(0.93)
        image = ImageEnhance.Contrast(image).enhance(1.025)
        image = ImageEnhance.Brightness(image).enhance(1.025)
    else:
        image = ImageEnhance.Color(image).enhance(0.91)
        image = ImageEnhance.Contrast(image).enhance(1.06)
        arr = to_array(image)
        arr[..., 2] *= 1.015
        arr[..., 0] *= 0.995
        image = to_image(np.clip(arr, 0.0, 1.0))
    return image.filter(ImageFilter.UnsharpMask(radius=1.15, percent=48, threshold=3))


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    backgrounds = {name: fit_background(path) for name, path in BACKGROUNDS.items()}
    files = sorted(SOURCE.glob("*.jpg"))
    manifest: list[str] = []
    for path in files:
        with Image.open(path) as image:
            preset = preset_for(path.name)
            base = retouch(image, preset)
        for style, background in backgrounds.items():
            strength = {"A_lifestyle": 0.18, "B_studio": 0.12, "C_oem": 0.15}[style]
            result = low_frequency_background_mix(base, background, strength)
            result = finish(result, style)
            output = OUTPUT / f"{path.stem}_{style}.jpg"
            result.save(output, format="JPEG", quality=95, subsampling=0, optimize=True, progressive=True)
            manifest.append(f"{path.name}\t{style}\t{output.name}\t{result.size[0]}x{result.size[1]}")
    (OUTPUT / "manifest.tsv").write_text("source\tversion\toutput\tsize\n" + "\n".join(manifest) + "\n", encoding="utf-8")
    print(f"Generated {len(manifest)} website-ready images in {OUTPUT}")


if __name__ == "__main__":
    main()
