from __future__ import annotations

import os
from pathlib import Path

import cv2
import numpy as np
from PIL import Image


SOURCE = Path(os.environ["TASK_IMAGE"])
STYLE = Path(os.environ["TASK_STYLE"])
BACKGROUND = Path(os.environ["TASK_BACKGROUND"])
OUTPUT = Path(os.environ["TASK_OUTPUT"])

source = np.asarray(Image.open(SOURCE).convert("RGB"), dtype=np.uint8)
style = np.asarray(Image.open(STYLE).convert("RGB").resize((1920, 1080), Image.Resampling.LANCZOS), dtype=np.uint8)
background = np.asarray(Image.open(BACKGROUND).convert("RGB").resize((1920, 1080), Image.Resampling.LANCZOS), dtype=np.uint8)

# Remove the reference package only; the sofa, plant, wooden tabletop, paper
# stack, and unfolded paper remain as the desired lifestyle scene.
cover = np.zeros(style.shape[:2], dtype=np.uint8)
cv2.rectangle(cover, (145, 0), (960, 900), 255, -1)
cover = cv2.GaussianBlur(cover, (0, 0), 22.0).astype(np.float32) / 255.0
scene = style.astype(np.float32) * (1.0 - cover[..., None]) + background.astype(np.float32) * cover[..., None]
scene = np.clip(scene, 0, 255).astype(np.uint8)

# Restore the reference paper stack after clearing the old package, so no part
# of the clean white paper is removed by the background plate.
stack_mask = np.zeros(style.shape[:2], dtype=np.uint8)
cv2.fillPoly(stack_mask, [np.asarray([
    (850, 460), (1110, 438), (1455, 505), (1500, 560),
    (1505, 750), (1460, 802), (1210, 820), (900, 785),
    (850, 735),
], dtype=np.int32)], 255)
hsv_stack = cv2.cvtColor(style, cv2.COLOR_RGB2HSV)
white_paper = ((hsv_stack[..., 1] < 58) & (hsv_stack[..., 2] > 135)).astype(np.uint8) * 255
stack_mask = cv2.bitwise_and(stack_mask, white_paper)
stack_mask[:, :920] = 0
stack_mask = cv2.morphologyEx(stack_mask, cv2.MORPH_CLOSE, np.ones((5, 5), dtype=np.uint8))
stack_mask = cv2.GaussianBlur(stack_mask, (0, 0), 1.5).astype(np.float32) / 255.0
scene = style.astype(np.float32) * stack_mask[..., None] + scene.astype(np.float32) * (1.0 - stack_mask[..., None])
scene = np.clip(scene, 0, 255).astype(np.uint8)

# Add a soft contact shadow where the replacement package meets the tabletop.
package_shadow = np.zeros(scene.shape[:2], dtype=np.float32)
cv2.ellipse(package_shadow, (515, 790), (315, 24), 0, 0, 360, 0.16, -1)
package_shadow = cv2.GaussianBlur(package_shadow, (0, 0), 18)
scene = np.clip(scene.astype(np.float32) * (1.0 - package_shadow[..., None]), 0, 255).astype(np.uint8)

# Extract the original Chinese package with a conservative polygon. No AI or
# geometric warping is applied: only uniform resizing to match the reference
# layout, so all package artwork and typography remain intact.
crop_box = (389, 31, 1064, 810)
x0, y0, x1, y1 = crop_box
package_crop = source[y0:y1, x0:x1]
mask = np.zeros(package_crop.shape[:2], dtype=np.uint8)
polygon = np.asarray([
    (0, 0), (675, 0), (665, 100), (648, 300), (628, 554),
    (619, 689), (596, 719), (58, 781), (41, 759),
    (29, 529), (12, 249),
], dtype=np.int32)
cv2.fillPoly(mask, [polygon], 255)
mask = cv2.GaussianBlur(mask, (0, 0), 1.0)

# Target footprint approximates the requested reference composition.
target_w = 650
scale = target_w / package_crop.shape[1]
target_h = int(round(package_crop.shape[0] * scale))
package = cv2.resize(package_crop, (target_w, target_h), interpolation=cv2.INTER_LANCZOS4)
package_mask = cv2.resize(mask, (target_w, target_h), interpolation=cv2.INTER_LINEAR).astype(np.float32) / 255.0

px, py = 190, 31
ph, pw = package.shape[:2]
region = scene[py:py + ph, px:px + pw].astype(np.float32)
alpha = package_mask[..., None]
scene[py:py + ph, px:px + pw] = (
    package.astype(np.float32) * alpha + region * (1.0 - alpha)
).astype(np.uint8)

# Match the warmer reference lighting while keeping the original package
# colors and printed details recognizable.
graded = scene.astype(np.float32)
graded[..., 0] = np.clip(graded[..., 0] * 1.008 + 0.8, 0, 255)
graded[..., 2] = np.clip(graded[..., 2] * 0.994, 0, 255)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
Image.fromarray(graded.astype(np.uint8), mode="RGB").save(OUTPUT, quality=97, optimize=True)
