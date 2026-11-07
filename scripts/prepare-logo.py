"""Produce a transparent display derivative; never modify the supplied logo.

The coloured emblem's white calligraphy is protected. The surrounding white
paper is removed with a soft near-white alpha edge. No crop or recolouring.
Requires Pillow (already available in the development environment).
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
source = Image.open(ROOT / "lc.jpg").convert("RGB")
assert source.size == (1744, 1192), "Reinspect emblem bounds if source changes"
result = source.convert("RGBA")
pixels = result.load()
for y in range(result.height):
    for x in range(result.width):
        r, g, b, _ = pixels[x, y]
        if 616 <= x <= 1144 and 23 <= y <= 530:
            continue  # Preserve white letterform within the original emblem.
        minimum = min(r, g, b)
        if minimum >= 235:
            alpha = round(255 * (255 - minimum) / 20)
            pixels[x, y] = (r, g, b, alpha)
result.save(ROOT / "public" / "brand" / "lucky-cable-logo.png", optimize=True)
assert result.getpixel((0, 0))[3] == 0
assert result.getpixel((870, 300)) == (*source.getpixel((870, 300)), 255)
print("Transparent logo generated; source untouched and emblem white preserved.")