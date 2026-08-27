from __future__ import annotations

import os
from pathlib import Path

import cv2
import numpy as np
from PIL import Image


SOURCE = Path(os.environ["TASK_IMAGE"])
OUTPUT = Path(os.environ["TASK_OUTPUT"])

image = np.asarray(Image.open(SOURCE).convert("RGB"), dtype=np.uint8)
height, width = image.shape[:2]
base = image.astype(np.float32)

# A large-radius copy removes the horizontal studio artifacts while retaining
# the original composition and every product pixel outside the side bands.
smooth = cv2.GaussianBlur(image, (0, 0), 24).astype(np.float32)
yy, xx = np.mgrid[0:height, 0:width]

def band_mask(points: list[tuple[int, int]], blur: float = 18.0) -> np.ndarray:
    m = np.zeros((height, width), dtype=np.uint8)
    cv2.fillPoly(m, [np.asarray(points, dtype=np.int32)], 255)
    return cv2.GaussianBlur(m, (0, 0), blur).astype(np.float32) / 255.0


# Only the empty left and right backdrop areas are cleaned. The package and
# all paper sheets are outside these polygons, so their pixels remain exact.
left = band_mask([(0, 505), (365, 505), (402, 820), (0, 820)])
# Keep the cleanup safely outside the paper stack's far-right edge.
right = band_mask([(1745, 520), (1919, 520), (1919, 850), (1745, 850)])
alpha = np.clip(np.maximum(left, right) * 0.88, 0.0, 0.88)[..., None]
base = base * (1.0 - alpha) + smooth * alpha

# Gentle warm-neutral grading, kept deliberately subtle so the package colors
# and Chinese typography are not altered.
base[..., 0] = np.clip(base[..., 0] * 1.008 + 0.8, 0, 255)
base[..., 2] = np.clip(base[..., 2] * 0.994, 0, 255)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
Image.fromarray(np.clip(base, 0, 255).astype(np.uint8), mode="RGB").save(
    OUTPUT, quality=97, optimize=True
)
