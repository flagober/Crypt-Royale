from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(r"E:\Projetos\MonsterCrypt\Crypt-Royale")
WORK = ROOT / "art-source" / "sprite-sheets" / "work" / "mc-0004" / "front"
QA = WORK / "qa-contacts-v001-human-gait"
FILES = [
    ("A", WORK / "frame-00-contact-a_v001.png"),
    ("P", WORK / "frame-01-passing_v002.png"),
    ("B", WORK / "frame-02-contact-b_v001.png"),
]


def make_strip(box: tuple[int, int, int, int], name: str) -> None:
    scale = 16
    width = (box[2] - box[0]) * scale
    height = (box[3] - box[1]) * scale
    output = Image.new("RGBA", (width * len(FILES), height + 32), (255, 0, 255, 255))
    draw = ImageDraw.Draw(output)
    for index, (label, path) in enumerate(FILES):
        image = Image.open(path).convert("RGBA").crop(box).resize((width, height), Image.Resampling.NEAREST)
        output.alpha_composite(image, (index * width, 32))
        draw.text((index * width + 6, 6), label, fill=(255, 255, 255, 255))
    output.save(QA / name)


make_strip((20, 94, 72, 134), "left-paw_A-P-B_16x.png")
make_strip((14, 38, 48, 112), "tail_A-P-B_16x.png")
