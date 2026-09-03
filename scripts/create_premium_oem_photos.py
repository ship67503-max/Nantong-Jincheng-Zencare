"""Create premium OEM website photos without altering the photographed subject.

This intentionally uses deterministic pixel operations only. It does not use
generative fill, object removal, relighting masks, or content-aware resizing.
The source photo remains the sole source of product, packaging, logos, and text.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps


PHOTO_SOURCES = {
    "factory-campus-premium": "public/images/oem/factory/factory-campus-real-aerial-20260729.png",
    "production-line-premium": "public/images/oem/production/factory-production-line-real-20260729.jpg",
    "warehouse-storage-premium": "public/images/warehouse-storage.JPG",
}


def white_balance(rgb: np.ndarray) -> np.ndarray:
    sample = rgb[::8, ::8].astype(np.float32)
    luminance = (
        0.2126 * sample[:, :, 0]
        + 0.7152 * sample[:, :, 1]
        + 0.0722 * sample[:, :, 2]
    )
    high = np.percentile(luminance, 68)
    spread = sample.max(axis=2) - sample.min(axis=2)
    neutral = (luminance >= high) & (spread <= 26)
    pixels = sample[neutral]
    if pixels.shape[0] < 300:
        pixels = sample.reshape(-1, 3)
    reference = np.percentile(pixels, 65, axis=0)
    target = float(reference.mean())
    return np.clip(target / np.maximum(reference, 1.0), 0.965, 1.035)


def premium_retouch(image: Image.Image) -> Image.Image:
    """Lift a factory photo while keeping every source pixel semantically intact."""
    source = ImageOps.exif_transpose(image).convert("RGB")
    rgb = np.asarray(source, dtype=np.uint8)
    balanced = np.clip(rgb.astype(np.float32) * white_balance(rgb), 0, 255)

    luminance = (
        0.2126 * balanced[:, :, 0]
        + 0.7152 * balanced[:, :, 1]
        + 0.0722 * balanced[:, :, 2]
    )
    white_point = min(250.0, float(np.percentile(luminance[::8, ::8], 99.6)) * 1.02)
    normalized = np.clip(luminance / max(white_point, 1.0), 0.0, 1.0)
    corrected_luminance = 246.0 * np.power(normalized, 0.93)
    ratio = corrected_luminance / np.maximum(luminance, 1.0)
    corrected = np.clip(balanced * ratio[:, :, None], 0, 255).astype(np.uint8)

    result = Image.fromarray(corrected, "RGB")
    result = ImageEnhance.Color(result).enhance(1.025)
    result = ImageEnhance.Contrast(result).enhance(1.025)
    return result.filter(ImageFilter.UnsharpMask(radius=1.0, percent=42, threshold=3))


def save_webp(image: Image.Image, path: Path, max_width: int) -> None:
    output = image
    if output.width > max_width:
        height = round(output.height * max_width / output.width)
        output = output.resize((max_width, height), Image.Resampling.LANCZOS)
        output = output.filter(ImageFilter.UnsharpMask(radius=0.75, percent=28, threshold=3))
    path.parent.mkdir(parents=True, exist_ok=True)
    output.save(path, format="WEBP", quality=92, method=6)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--workspace", type=Path, default=Path.cwd())
    parser.add_argument("--output-dir", type=Path, default=Path("public/images/oem/premium"))
    parser.add_argument("--max-width", type=int, default=2400)
    args = parser.parse_args()

    workspace = args.workspace.resolve()
    output_dir = (workspace / args.output_dir).resolve() if not args.output_dir.is_absolute() else args.output_dir.resolve()
    report = []
    for name, relative_source in PHOTO_SOURCES.items():
        source_path = workspace / relative_source
        if not source_path.exists():
            raise FileNotFoundError(source_path)
        with Image.open(source_path) as original:
            polished = premium_retouch(original)
            source_size = polished.size
            destination = output_dir / f"{name}.webp"
            save_webp(polished, destination, args.max_width)
        report.append(
            {
                "output": str(destination),
                "source": str(source_path),
                "source_size": list(source_size),
                "operations": ["EXIF orientation", "conservative white balance", "tone lift", "subtle color/contrast", "unsharp mask", "downsample to web width"],
                "content_policy": "source pixels only; no generative redraw, removal, replacement, or text/logo edits",
            }
        )

    report_path = output_dir / "retouch-report.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    for entry in report:
        print(entry["output"])


if __name__ == "__main__":
    main()
