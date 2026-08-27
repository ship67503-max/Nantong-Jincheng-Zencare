from __future__ import annotations

import os
from pathlib import Path

import cv2
import numpy as np
from PIL import Image


SOURCE = Path(os.environ["TASK_IMAGE"])
OUTPUT = Path(os.environ["TASK_OUTPUT"])


def smoothstep(edge0: float, edge1: float, value: np.ndarray) -> np.ndarray:
    t = np.clip((value - edge0) / (edge1 - edge0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


rgb = np.asarray(Image.open(SOURCE).convert("RGB"), dtype=np.uint8)
height, width = rgb.shape[:2]

# Identify only the cool cyan/blue cast of the bottom sheet's sealed rim.
hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV).astype(np.float32)
hue_degrees = hsv[..., 0] * 2.0
saturation = hsv[..., 1] / 255.0

yy, xx = np.mgrid[0:height, 0:width]
lower_sheet_region = yy >= int(height * 0.68)
blue_cast = (hue_degrees >= 170.0) & (hue_degrees <= 245.0)
not_strong_package_blue = saturation <= 0.38

# The package blue is much more saturated than the pale sheet rim. Selecting
# only the low-saturation blue cast protects its printing while also reaching
# the visible rim behind the package and the folded stack.
mask = lower_sheet_region & blue_cast & not_strong_package_blue
# The far-left corner of the sheet is partially occluded by the package and
# has a stronger cyan cast; it is still outside the package silhouette.
left_visible_rim = (((xx < int(width * 0.145)) & (yy > int(height * 0.71))) |
                    ((xx < int(width * 0.20)) & (yy > int(height * 0.79))))
mask |= left_visible_rim & blue_cast

# Feather the selection so the retouch follows the photographed fibers and
# shadows without a hard digital edge.
strength = 0.88 + 0.12 * smoothstep(0.020, 0.16, saturation)
alpha = cv2.GaussianBlur((mask.astype(np.float32) * strength), (0, 0), 1.4)
alpha = np.clip(alpha, 0.0, 1.0)[..., None]

# Recolor to warm white paper while preserving local luminance, wrinkles,
# texture, and contact shadows.
rgb_f = rgb.astype(np.float32)
luminance = (
    0.2126 * rgb_f[..., 0]
    + 0.7152 * rgb_f[..., 1]
    + 0.0722 * rgb_f[..., 2]
)
luminance = np.clip(luminance + 2.0, 0.0, 255.0)
paper = np.stack(
    [
        np.clip(luminance * 1.035 + 2.0, 0.0, 255.0),
        np.clip(luminance * 1.010 + 1.0, 0.0, 255.0),
        np.clip(luminance * 0.985, 0.0, 255.0),
    ],
    axis=-1,
)

edited = np.clip(rgb_f * (1.0 - alpha) + paper * alpha, 0.0, 255.0).astype(np.uint8)
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
Image.fromarray(edited, mode="RGB").save(OUTPUT, quality=98)
