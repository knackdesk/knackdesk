"""Generate site/public/apple-touch-icon.png and site/public/og.png.

The mark mirrors site/public/icon.svg (a K in the accent colour on a dark
rounded square). Shapes are drawn directly with Pillow rather than by
rasterising the SVG, so no extra system libraries are needed.

Run from the repo root:  .venv/bin/python scripts/make-icons.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "site" / "public"
BG = (20, 20, 19)
ACCENT = (95, 211, 185)
FG = (241, 239, 233)
MUTED = (163, 162, 155)
SVG_SIZE = 64
# Polygons from icon.svg's path, in its 64-unit viewBox: stem, upper arm, lower arm.
K_POLYGONS = [
    [(18, 14), (26, 14), (26, 50), (18, 50)],
    [(26, 29), (39, 14), (49, 14), (26, 40)],
    [(31, 34), (37, 27), (50, 50), (40, 50)],
]
FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]
SUPERSAMPLE = 4


def load_font(size):
    for path in FONT_CANDIDATES:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default(size=size)


def draw_mark(img, x, y, size, rounded=True):
    """Draw the K mark into img with its top-left at (x, y), size px square."""
    draw = ImageDraw.Draw(img)
    scale = size / SVG_SIZE
    radius = round(14 * scale) if rounded else 0
    draw.rounded_rectangle([x, y, x + size - 1, y + size - 1], radius=radius, fill=BG)
    for poly in K_POLYGONS:
        draw.polygon([(x + px * scale, y + py * scale) for px, py in poly], fill=ACCENT)


def render(width, height, paint):
    big = Image.new("RGB", (width * SUPERSAMPLE, height * SUPERSAMPLE), BG)
    paint(big, SUPERSAMPLE)
    return big.resize((width, height), Image.LANCZOS)


def apple_touch_icon():
    # Apple applies its own corner mask, so the square stays opaque edge to edge.
    return render(180, 180, lambda img, s: draw_mark(img, 0, 0, 180 * s, rounded=False))


def og_image():
    def paint(img, s):
        draw = ImageDraw.Draw(img)
        mark = 200 * s
        draw_mark(img, 100 * s, 140 * s, mark)
        # Thin frame around the mark so it reads on the equally dark background.
        draw.rounded_rectangle([100 * s, 140 * s, 100 * s + mark, 140 * s + mark], radius=44 * s, outline=(44, 44, 41), width=3 * s)
        draw.text((350 * s, 150 * s), "Knackdesk", font=load_font(120 * s), fill=FG)
        draw.text((354 * s, 300 * s), "Small, useful tools and kits", font=load_font(48 * s), fill=ACCENT)
        draw.text((354 * s, 360 * s), "for freelancers", font=load_font(48 * s), fill=ACCENT)
        draw.text((100 * s, 520 * s), "knackdesk.com", font=load_font(32 * s), fill=MUTED)

    return render(1200, 630, paint)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    apple_touch_icon().save(OUT / "apple-touch-icon.png", optimize=True)
    og = og_image().quantize(colors=64, method=Image.Quantize.MEDIANCUT)
    og.save(OUT / "og.png", optimize=True)
    for name in ("apple-touch-icon.png", "og.png"):
        path = OUT / name
        with Image.open(path) as im:
            print(f"{name}: {im.size[0]}x{im.size[1]}, {path.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
