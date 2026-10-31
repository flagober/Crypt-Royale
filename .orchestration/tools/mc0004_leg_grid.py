from pathlib import Path

from PIL import Image, ImageDraw


root = Path(r"E:\Projetos\MonsterCrypt\Crypt-Royale")
source = Image.open(
    root / "art-source/sprite-sheets/work/mc-0004/right/frame-01-passing_v002.png"
).convert("RGBA")

crop_box = (25, 88, 110, 134)
crop = source.crop(crop_box).resize((85 * 10, 46 * 10), Image.Resampling.NEAREST)
canvas = Image.new("RGBA", crop.size, (255, 0, 255, 255))
canvas.alpha_composite(crop)
draw = ImageDraw.Draw(canvas)

for source_x in range(25, 111, 5):
    x = (source_x - crop_box[0]) * 10
    draw.line((x, 0, x, canvas.height), fill=(255, 255, 0, 100), width=1)
    draw.text((x + 2, 2), str(source_x), fill=(255, 255, 0, 255))

for source_y in range(90, 134, 5):
    y = (source_y - crop_box[1]) * 10
    draw.line((0, y, canvas.width, y), fill=(255, 255, 0, 100), width=1)
    draw.text((2, y + 2), str(source_y), fill=(255, 255, 0, 255))

output = root / "art-source/sprite-sheets/work/mc-0004/right/qa-leg-coordinate-grid.png"
canvas.save(output)
print(output)
