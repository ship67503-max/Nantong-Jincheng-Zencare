from __future__ import annotations

import os
from pathlib import Path

import cv2
import numpy as np
from PIL import Image


SOURCE = Path(os.environ["TASK_IMAGE"])
BACKGROUND = Path(os.environ["TASK_BACKGROUND"])
OUTPUT = Path(os.environ["TASK_OUTPUT"])

source = np.asarray(Image.open(SOURCE).convert("RGB"), dtype=np.uint8)
background = np.asarray(Image.open(BACKGROUND).convert("RGB").resize((1920, 1080), Image.Resampling.LANCZOS), dtype=np.uint8)

height, width = source.shape[:2]
canvas = background.astype(np.float32)


def polygon_mask(points: list[tuple[int, int]], blur: float = 1.2) -> np.ndarray:
    mask = np.zeros((height, width), dtype=np.uint8)
    cv2.fillPoly(mask, [np.asarray(points, dtype=np.int32)], 255)
    if blur:
        mask = cv2.GaussianBlur(mask, (0, 0), blur)
    return mask.astype(np.float32) / 255.0


# Tight silhouettes traced from the supplied photograph. The package is kept
# pixel-faithful so all Chinese typography and artwork remain unchanged.
package = polygon_mask([
    (389, 0), (1064, 0), (1051, 126), (1038, 318), (1020, 580),
    (1005, 719), (985, 748), (448, 811), (431, 790), (418, 590),
    (401, 280),
])

paper_stack = polygon_mask([
    (646, 685), (1099, 610), (1624, 741), (1663, 766), (1676, 803),
    (1651, 877), (1622, 968), (1591, 1047), (712, 1054), (680, 1032),
    (650, 972), (632, 914), (639, 842), (638, 770),
])

# Add restrained contact shadows on the new tabletop before compositing, so the
# shadows ground the products without darkening their white paper surfaces.
shadow = np.zeros((height, width), dtype=np.float32)
cv2.ellipse(shadow, (1120, 1025), (555, 55), 0, 0, 360, 0.18, -1)
cv2.ellipse(shadow, (685, 800), (300, 28), 0, 0, 360, 0.12, -1)
shadow = cv2.GaussianBlur(shadow, (0, 0), 28)
canvas *= (1.0 - shadow[..., None])

# Composite the original subjects over the new set.
for mask in (package, paper_stack):
    alpha = mask[..., None]
    canvas = source.astype(np.float32) * alpha + canvas * (1.0 - alpha)

# A subtle warm grade makes the retained white paper read as clean nonwoven
# absorbent paper against the warmer wood, without altering printed colors.
canvas = np.clip(canvas, 0, 255).astype(np.uint8)
rgb = canvas.astype(np.float32)
rgb[..., 0] = np.clip(rgb[..., 0] * 1.012 + 1.0, 0, 255)
rgb[..., 2] = np.clip(rgb[..., 2] * 0.992, 0, 255)
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
Image.fromarray(rgb.astype(np.uint8), mode="RGB").save(OUTPUT, quality=96, optimize=True)
