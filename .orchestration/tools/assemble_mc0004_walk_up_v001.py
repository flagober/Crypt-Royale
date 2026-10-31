from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path(r"E:\Projetos\MonsterCrypt\Crypt-Royale")
WORK = ROOT / "art-source" / "sprite-sheets" / "work" / "mc-0004" / "back"
APPROVED = ROOT / "art-source" / "sprite-sheets" / "approved" / "mc-0004"
QA = WORK / "qa-approved-walk-up-v001"
SOURCES = [
    WORK / "frame-00-contact-a_v002.png",
    WORK / "frame-01-passing_v002.png",
    WORK / "frame-02-contact-b_v002.png",
]
PLAYBACK = [0, 1, 2, 1]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def pixel_diff(left: Image.Image, right: Image.Image) -> int:
    return sum(1 for a, b in zip(left.getdata(), right.getdata()) if a != b)


def main() -> None:
    APPROVED.mkdir(parents=True, exist_ok=True)
    QA.mkdir(parents=True, exist_ok=True)
    frames = [Image.open(path).convert("RGBA") for path in SOURCES]
    if any(frame.size != (140, 140) for frame in frames):
        raise ValueError("All source frames must be exactly 140x140")

    row = Image.new("RGBA", (420, 140), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        row.alpha_composite(frame, (index * 140, 0))

    row_path = APPROVED / "cr_mc-0004_data-mouse_walk-up_row_v001.png"
    row.save(row_path)
    diffs = [
        pixel_diff(row.crop((index * 140, 0, (index + 1) * 140, 140)), frame)
        for index, frame in enumerate(frames)
    ]
    if any(diffs):
        raise RuntimeError(f"Cell validation failed: {diffs}")

    metadata = {
        "sprite_id": "MC-0004",
        "sprite_name": "data-mouse",
        "status": "approved",
        "facing_direction": "up",
        "movement_direction": "up",
        "frame_specs": {"width": 140, "height": 140, "pivot": [70, 128], "baseline": 128},
        "sequence": {
            "order": ["contact-a", "passing", "contact-b"],
            "playback_pattern": PLAYBACK,
            "frame_duration_ms": 160,
        },
        "source_files": [path.name for path in SOURCES],
        "source_hashes": {path.name: sha256(path) for path in SOURCES},
        "files": {"row": row_path.name},
        "hashes": {"row": sha256(row_path)},
        "validation": {"cell_pixel_diffs": diffs},
        "motion": "V002 planted support foot with lateral hip transfer and protected tail band",
    }
    row_path.with_suffix(".json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")

    contacts_path = WORK / "walk-up-contacts_v002.json"
    contacts = json.loads(contacts_path.read_text(encoding="utf-8"))
    contacts["status"] = "approved"
    contacts["approved_output"] = row_path.name
    contacts_path.write_text(json.dumps(contacts, indent=2), encoding="utf-8")

    row.resize((1680, 560), Image.Resampling.NEAREST).save(QA / "walk-up-v001_4x.png")
    opaque_frames = []
    for index in PLAYBACK:
        background = Image.new("RGBA", (140, 140), (15, 23, 42, 255))
        background.alpha_composite(frames[index])
        opaque_frames.append(background.resize((560, 560), Image.Resampling.NEAREST).convert("RGB"))
    opaque_frames[0].save(
        QA / "walk-up-v001_anim.gif",
        save_all=True,
        append_images=opaque_frames[1:],
        duration=160,
        loop=0,
        disposal=2,
    )
    print(json.dumps({"row_sha256": metadata["hashes"]["row"], "cell_diffs": diffs}, indent=2))


if __name__ == "__main__":
    main()
