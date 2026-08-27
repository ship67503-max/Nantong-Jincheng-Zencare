from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter


SOURCE = Path(r"C:\Users\Administrator\Desktop\独立站可用图片_V2\blog-banner-16x9\disposable-pet-cleanup-gloves-package-and-gloves-blog.jpg")
OUTPUT = SOURCE.parent / "premium-b2b-edits" / "disposable-pet-cleanup-gloves-premium-showcase.jpg"


def arr(image: Image.Image) -> np.ndarray:
    return np.asarray(image.convert("RGB"), dtype=np.float32) / 255.0


def img(values: np.ndarray) -> Image.Image:
    return Image.fromarray(np.clip(values * 255.0 + 0.5, 0, 255).astype(np.uint8), "RGB")


def smoothstep(a: float, b: float, x: np.ndarray) -> np.ndarray:
    t = np.clip((x - a) / (b - a), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


with Image.open(SOURCE) as source_image:
    source = source_image.convert("RGB").resize((1920, 1080), Image.Resampling.LANCZOS)

source_array = arr(source)
height, width = source_array.shape[:2]
yy, xx = np.mgrid[0:height, 0:width]
x = xx / (width - 1)
y = yy / (height - 1)

# Neutral laboratory wall and clean matte surface with a soft floor transition.
background = np.zeros_like(source_array)
background[:] = np.array([0.925, 0.935, 0.925], dtype=np.float32)
background += (0.022 * (1.0 - y) + 0.012 * (1.0 - x))[..., None]
floor = smoothstep(0.64, 0.84, y)
background -= (0.022 * floor)[..., None]
spot = np.exp(-(((x - 0.57) / 0.56) ** 2 + ((y - 0.48) / 0.74) ** 2))
background += (0.018 * spot)[..., None]
vignette = 1.0 - np.exp(-(((x - 0.5) / 0.74) ** 2 + ((y - 0.5) / 0.86) ** 2))
background -= (0.014 * vignette)[..., None]
background[..., 0] += 0.004
background[..., 2] -= 0.003
background = np.clip(background, 0.0, 1.0)

luma = 0.2126 * source_array[..., 0] + 0.7152 * source_array[..., 1] + 0.0722 * source_array[..., 2]
chroma = source_array.max(axis=2) - source_array.min(axis=2)
neutral = 1.0 - smoothstep(0.045, 0.18, chroma)
bright = smoothstep(0.70, 0.94, luma) * neutral

# Low-frequency backdrop lift, followed by high-frequency restoration. This keeps
# the gloves' perforation, stitching, and all package printing from being redrawn.
low = arr(source.filter(ImageFilter.GaussianBlur(32.0)))
high = source_array - low
mix = (0.33 * bright)[..., None]
result = source_array * (1.0 - mix) + background * mix
result += high * (0.22 * bright)[..., None]

# Commercial white balance, restrained saturation, and highlight rolloff.
result[..., 0] *= 1.008
result[..., 1] *= 1.004
result[..., 2] *= 0.992
result = 0.5 + (result - 0.5) * 1.055
result = np.clip(result, 0.0, 1.0)
result = result * 1.035 / (1.0 + 0.035 * result)

output = img(result)
output = ImageEnhance.Color(output).enhance(0.93)
output = output.filter(ImageFilter.UnsharpMask(radius=1.25, percent=62, threshold=3))
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
output.save(OUTPUT, quality=95, subsampling=0, optimize=True)
print(OUTPUT)
