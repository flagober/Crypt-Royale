from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path(r"E:\Projetos\MonsterCrypt\Crypt-Royale")
WORK = ROOT / "art-source" / "sprite-sheets" / "work" / "mc-0004" / "right"
APPROVED = ROOT / "art-source" / "sprite-sheets" / "approved" / "mc-0004"
QA = WORK / "qa-lateral-rows-v001"

FRAME_SIZE = 140
PIVOT = [70, 128]
PLAYBACK = [0, 1, 2, 1]

SOURCES = [
    WORK / "frame-00-contact-a_v004.png",
    WORK / "frame-01-passing_v002.png",
    WORK / "frame-02-contact-b_v004.png",
]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def pixel_diff(a: Image.Image, b: Image.Image) -> int:
    return sum(1 for left, right in zip(a.getdata(), b.getdata()) if left != right)


def make_row(frames: list[Image.Image]) -> Image.Image:
    row = Image.new("RGBA", (FRAME_SIZE * 3, FRAME_SIZE), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        row.alpha_composite(frame, (index * FRAME_SIZE, 0))
    return row


def save_preview(name: str, row: Image.Image) -> None:
    row.resize((1680, 560), Image.Resampling.NEAREST).save(QA / f"{name}_4x.png")
    frames = [row.crop((x * 140, 0, (x + 1) * 140, 140)) for x in PLAYBACK]
    frames[0].save(
        QA / f"{name}_anim.gif",
        save_all=True,
        append_images=frames[1:],
        duration=160,
        loop=0,
        disposal=2,
    )


def main() -> None:
    APPROVED.mkdir(parents=True, exist_ok=True)
    QA.mkdir(parents=True, exist_ok=True)

    frames_right = [Image.open(path).convert("RGBA") for path in SOURCES]
    if any(frame.size != (140, 140) for frame in frames_right):
        raise ValueError("All source frames must be exactly 140x140 RGBA cells")

    row_right = make_row(frames_right)
    frames_left = [frame.transpose(Image.Transpose.FLIP_LEFT_RIGHT) for frame in frames_right]
    row_left = make_row(frames_left)

    right_path = APPROVED / "cr_mc-0004_data-mouse_walk-right_row_v001.png"
    left_path = APPROVED / "cr_mc-0004_data-mouse_walk-left_row_v001.png"
    row_right.save(right_path)
    row_left.save(left_path)

    validations = {"right": [], "left": [], "reverse_flip_diff": []}
    for index, source in enumerate(frames_right):
        right_cell = row_right.crop((index * 140, 0, (index + 1) * 140, 140))
        left_cell = row_left.crop((index * 140, 0, (index + 1) * 140, 140))
        validations["right"].append(pixel_diff(right_cell, source))
        validations["left"].append(pixel_diff(left_cell, frames_left[index]))
        validations["reverse_flip_diff"].append(
            pixel_diff(left_cell.transpose(Image.Transpose.FLIP_LEFT_RIGHT), source)
        )

    if any(value != 0 for values in validations.values() for value in values):
        raise RuntimeError(f"Pixel validation failed: {validations}")

    source_hashes = {path.name: sha256(path) for path in SOURCES}
    common = {
        "sprite_id": "MC-0004",
        "sprite_name": "data-mouse",
        "status": "approved",
        "frame_specs": {
            "width": 140,
            "height": 140,
            "pivot": PIVOT,
            "baseline": 128,
        },
        "sequence": {
            "order": ["contact-a", "passing", "contact-b"],
            "playback_pattern": PLAYBACK,
            "frame_duration_ms": 160,
        },
        "source_files": [path.name for path in SOURCES],
        "source_hashes": source_hashes,
        "validation": validations,
    }

    right_meta = {
        **common,
        "facing_direction": "right",
        "movement_direction": "right",
        "visible_anatomical_side": "left",
        "files": {"row": right_path.name},
        "hashes": {"row": sha256(right_path)},
        "derivation": "direct assembly from approved V004 contacts and V002 passing frame",
    }
    left_meta = {
        **common,
        "facing_direction": "left",
        "movement_direction": "left",
        "visible_anatomical_side": "right",
        "files": {"row": left_path.name},
        "hashes": {"row": sha256(left_path)},
        "derived_from": right_path.name,
        "transformation": "horizontal_flip_per_cell",
    }

    (APPROVED / right_path.with_suffix(".json").name).write_text(
        json.dumps(right_meta, indent=2), encoding="utf-8"
    )
    (APPROVED / left_path.with_suffix(".json").name).write_text(
        json.dumps(left_meta, indent=2), encoding="utf-8"
    )

    contacts_path = WORK / "walk-right-contacts_v004.json"
    contacts = json.loads(contacts_path.read_text(encoding="utf-8"))
    contacts["status"] = "approved"
    contacts["approved_outputs"] = [right_path.name, left_path.name]
    contacts_path.write_text(json.dumps(contacts, indent=2), encoding="utf-8")

    save_preview("walk-right-v001", row_right)
    save_preview("walk-left-v001", row_left)

    print(json.dumps({
        "right": right_meta["hashes"]["row"],
        "left": left_meta["hashes"]["row"],
        "validation": validations,
    }, indent=2))


if __name__ == "__main__":
    main()
