from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(r"E:\Projetos\MonsterCrypt\Crypt-Royale")
SOURCE = (
    ROOT
    / "art-source"
    / "sprite-sheets"
    / "work"
    / "mc-0004"
    / "front"
    / "frame-01-passing_v002.png"
)
OUTPUT = SOURCE.parent / "qa-front-leg-coordinate-grid.png"
CROP_BOX = (10, 78, 132, 136)
SCALE = 8


source = Image.open(SOURCE).convert("RGBA")
crop = source.crop(CROP_BOX).resize(
    ((CROP_BOX[2] - CROP_BOX[0]) * SCALE, (CROP_BOX[3] - CROP_BOX[1]) * SCALE),
    Image.Resampling.NEAREST,
)
canvas = Image.new("RGBA", crop.size, (255, 0, 255, 255))
canvas.alpha_composite(crop)
draw = ImageDraw.Draw(canvas)

for source_x in range(10, 133, 5):
    x = (source_x - CROP_BOX[0]) * SCALE
    draw.line((x, 0, x, canvas.height), fill=(255, 255, 0, 120), width=1)
    draw.text((x + 2, 2), str(source_x), fill=(255, 255, 0, 255))

for source_y in range(80, 136, 5):
    y = (source_y - CROP_BOX[1]) * SCALE
    draw.line((0, y, canvas.width, y), fill=(255, 255, 0, 120), width=1)
    draw.text((2, y + 2), str(source_y), fill=(255, 255, 0, 255))

canvas.save(OUTPUT)
print(OUTPUT)
