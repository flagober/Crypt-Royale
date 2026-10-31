from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(r"E:\Projetos\MonsterCrypt\Crypt-Royale")
APPROVED = ROOT / "art-source" / "sprite-sheets" / "approved" / "mc-0004"
QA = ROOT / "art-source" / "sprite-sheets" / "work" / "mc-0004" / "qa-mega-sheet-v001"
ROWS = [
    ("down", APPROVED / "cr_mc-0004_data-mouse_walk-down_row_v001.png"),
    ("right", APPROVED / "cr_mc-0004_data-mouse_walk-right_row_v002.png"),
    ("left", APPROVED / "cr_mc-0004_data-mouse_walk-left_row_v002.png"),
    ("up", APPROVED / "cr_mc-0004_data-mouse_walk-up_row_v001.png"),
]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def pixel_diff(left: Image.Image, right: Image.Image) -> int:
    return sum(1 for a, b in zip(left.getdata(), right.getdata()) if a != b)


def alpha_components(image: Image.Image) -> int:
    alpha = image.getchannel("A")
    px = alpha.load()
    seen: set[tuple[int, int]] = set()
    count = 0
    for y in range(image.height):
        for x in range(image.width):
            if px[x, y] == 0 or (x, y) in seen:
                continue
            count += 1
            stack = [(x, y)]
            seen.add((x, y))
            while stack:
                cx, cy = stack.pop()
                for oy in (-1, 0, 1):
                    for ox in (-1, 0, 1):
                        if ox == oy == 0:
                            continue
                        point = (cx + ox, cy + oy)
                        if (
                            0 <= point[0] < image.width
                            and 0 <= point[1] < image.height
                            and px[point[0], point[1]] > 0
                            and point not in seen
                        ):
                            seen.add(point)
                            stack.append(point)
    return count


def main() -> None:
    QA.mkdir(parents=True, exist_ok=True)
    rows = [(name, Image.open(path).convert("RGBA")) for name, path in ROWS]
    if any(image.size != (420, 140) for _, image in rows):
        raise ValueError("Every approved direction row must be 420x140 RGBA")

    sheet = Image.new("RGBA", (420, 560), (0, 0, 0, 0))
    for index, (_, row) in enumerate(rows):
        sheet.alpha_composite(row, (0, index * 140))

    output = APPROVED / "cr_mc-0004_data-mouse_spritesheet_v001.png"
    sheet.save(output)

    row_diffs = []
    cells = []
    for row_index, (direction, row) in enumerate(rows):
        extracted = sheet.crop((0, row_index * 140, 420, (row_index + 1) * 140))
        row_diffs.append(pixel_diff(extracted, row))
        for column in range(3):
            cell = extracted.crop((column * 140, 0, (column + 1) * 140, 140))
            bbox = cell.getchannel("A").getbbox()
            cells.append({
                "direction": direction,
                "column": column,
                "components": alpha_components(cell),
                "bbox": list(bbox or ()),
                "safe_area_ok": bool(bbox and bbox[0] >= 10 and bbox[2] <= 130 and bbox[3] - 1 <= 128),
            })
    if any(row_diffs) or any(not cell["safe_area_ok"] for cell in cells):
        raise RuntimeError(f"Mega sheet validation failed: row_diffs={row_diffs}, cells={cells}")

    alpha = sheet.getchannel("A")
    alpha_values = list(alpha.getdata())
    metadata = {
        "sprite_id": "MC-0004",
        "sprite_name": "data-mouse",
        "status": "approved",
        "dimensions": [420, 560],
        "mode": "RGBA",
        "grid": {"columns": 3, "rows": 4, "cell": [140, 140]},
        "pivot": [70, 128],
        "baseline": 128,
        "row_order": [name for name, _ in ROWS],
        "frame_order": ["contact-a", "passing", "contact-b"],
        "playback_pattern": [0, 1, 2, 1],
        "frame_duration_ms": 160,
        "sources": {name: {"file": path.name, "sha256": sha256(path)} for name, path in ROWS},
        "file": output.name,
        "sha256": sha256(output),
        "alpha": {
            "transparent_pixels": alpha_values.count(0),
            "opaque_pixels": alpha_values.count(255),
            "intermediate_pixels": sum(1 for value in alpha_values if 0 < value < 255),
        },
        "validation": {"row_pixel_diffs": row_diffs, "cells": cells},
    }
    output.with_suffix(".json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")

    scale = 3
    preview = Image.new("RGBA", (420 * scale + 130, 560 * scale), (15, 23, 42, 255))
    preview.alpha_composite(sheet.resize((420 * scale, 560 * scale), Image.Resampling.NEAREST), (130, 0))
    draw = ImageDraw.Draw(preview)
    for index, (name, _) in enumerate(ROWS):
        draw.text((18, index * 140 * scale + 18), name.upper(), fill=(103, 232, 249, 255))
    preview.convert("RGB").save(QA / "cr_mc-0004_data-mouse_spritesheet_v001_qa-3x.png")

    print(json.dumps({
        "sha256": metadata["sha256"],
        "alpha": metadata["alpha"],
        "row_pixel_diffs": row_diffs,
        "cells_ok": all(cell["safe_area_ok"] for cell in cells),
    }, indent=2))


if __name__ == "__main__":
    main()
