from __future__ import annotations

import os
from pathlib import Path

import cv2
import numpy as np
from PIL import Image


SOURCE = Path(os.environ["TASK_IMAGE"])
REFERENCE = Path(os.environ["TASK_STYLE"])
BACKGROUND = Path(os.environ["TASK_BACKGROUND"])
OUTPUT = Path(os.environ["TASK_OUTPUT"])

W, H = 1920, 1080
source = np.asarray(Image.open(SOURCE).convert("RGB"), dtype=np.uint8)
reference = np.asarray(
    Image.open(REFERENCE).convert("RGB").resize((W, H), Image.Resampling.LANCZOS),
    dtype=np.uint8,
)
canvas = np.asarray(
    Image.open(BACKGROUND).convert("RGB").resize((W, H), Image.Resampling.LANCZOS),
    dtype=np.uint8,
).astype(np.float32)


def feathered_polygon(points: list[tuple[int, int]], sigma: float = 1.5) -> np.ndarray:
    mask = np.zeros((H, W), dtype=np.uint8)
    cv2.fillPoly(mask, [np.asarray(points, dtype=np.int32)], 255)
    if sigma:
        mask = cv2.GaussianBlur(mask, (0, 0), sigma)
    return mask.astype(np.float32) / 255.0


# One single, completely flat sheet. It has no raised rim, sealed border,
# quilting, fold, crease, or stacked layers.
sheet_points = [(900, 735), (1585, 690), (1775, 835), (1045, 1005)]
sheet_mask = feathered_polygon(sheet_points, 1.3)

shadow_mask = np.zeros((H, W), dtype=np.uint8)
cv2.fillPoly(
    shadow_mask,
    [np.asarray([(904, 742), (1589, 697), (1779, 842), (1049, 1012)], dtype=np.int32)],
    255,
)
shadow = cv2.GaussianBlur(shadow_mask, (0, 0), 10).astype(np.float32) / 255.0
canvas *= (1.0 - 0.12 * shadow[..., None])

rng = np.random.default_rng(17)
noise = cv2.GaussianBlur(rng.normal(0.0, 0.75, (H, W)).astype(np.float32), (0, 0), 0.7)
vertical = np.linspace(1.5, -1.5, H, dtype=np.float32)[:, None]
paper_luma = np.clip(246.0 + noise + vertical, 238.0, 250.0)
paper = np.stack([paper_luma + 1.5, paper_luma + 0.2, paper_luma - 2.0], axis=-1)
canvas = paper * sheet_mask[..., None] + canvas * (1.0 - sheet_mask[..., None])

# Replace only the reference package's front artwork with the original Chinese
# artwork. The reference bag supplies the real 3D silhouette, crinkles, side
# panel, and perspective, so the package remains physically natural.
src_quad = np.asarray(
    [(389, 31), (1064, 31), (985, 748), (447, 810)], dtype=np.float32
)
dst_quad = np.asarray(
    [(270, 100), (920, 132), (872, 760), (368, 814)], dtype=np.float32
)
homography = cv2.getPerspectiveTransform(src_quad, dst_quad)
warped_front = cv2.warpPerspective(
    source,
    homography,
    (W, H),
    flags=cv2.INTER_LANCZOS4,
    borderMode=cv2.BORDER_CONSTANT,
)
front_mask = feathered_polygon([tuple(map(int, point)) for point in dst_quad], 1.2)
reference_product = (
    warped_front.astype(np.float32) * front_mask[..., None]
    + reference.astype(np.float32) * (1.0 - front_mask[..., None])
).astype(np.uint8)

package_points = [(250, 52), (930, 100), (916, 610), (885, 750), (815, 820), (327, 852), (276, 796)]
package_mask = feathered_polygon(package_points, 1.2)

# The reference photograph contains a pale tabletop sliver touching the bag's
# lower edge. Remove that low-saturation remnant while retaining the blue bag.
hsv_product = cv2.cvtColor(reference_product, cv2.COLOR_RGB2HSV)
retain_bottom = ((hsv_product[..., 1] > 34) | (hsv_product[..., 2] < 165)).astype(np.float32)
bottom_zone = np.zeros((H, W), dtype=np.float32)
bottom_zone[775:, :] = 1.0
package_mask *= (1.0 - bottom_zone) + bottom_zone * retain_bottom
package_mask = cv2.GaussianBlur(package_mask, (0, 0), 0.8)

package_shadow = np.zeros((H, W), dtype=np.float32)
cv2.ellipse(package_shadow, (585, 842), (310, 28), 0, 0, 360, 0.16, -1)
package_shadow = cv2.GaussianBlur(package_shadow, (0, 0), 18)
canvas *= (1.0 - package_shadow[..., None])

canvas = (
    reference_product.astype(np.float32) * package_mask[..., None]
    + canvas * (1.0 - package_mask[..., None])
)

# Subtle warm integration only; no geometric change to the product.
canvas[..., 0] = np.clip(canvas[..., 0] * 1.006 + 0.5, 0, 255)
canvas[..., 2] = np.clip(canvas[..., 2] * 0.996, 0, 255)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
Image.fromarray(np.clip(canvas, 0, 255).astype(np.uint8), mode="RGB").save(
    OUTPUT, quality=97, optimize=True
)
