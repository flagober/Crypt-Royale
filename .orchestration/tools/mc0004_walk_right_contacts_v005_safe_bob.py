from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path(r"E:\Projetos\MonsterCrypt\Crypt-Royale")
WORK = ROOT / "art-source" / "sprite-sheets" / "work" / "mc-0004" / "right"
SOURCE_PATH = WORK / "frame-01-passing_v002.png"
QA = WORK / "qa-contacts-v005-safe-bob"
QA.mkdir(parents=True, exist_ok=True)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def shifted_down(source: Image.Image) -> Image.Image:
    result = Image.new("RGBA", source.size, (0, 0, 0, 0))
    result.alpha_composite(source, (0, 1))
    return result


def components(image: Image.Image) -> list[dict]:
    alpha = image.getchannel("A")
    px = alpha.load()
    seen: set[tuple[int, int]] = set()
    found = []
    for y in range(image.height):
        for x in range(image.width):
            if px[x, y] == 0 or (x, y) in seen:
                continue
            stack = [(x, y)]
            seen.add((x, y))
            points = []
            while stack:
                cx, cy = stack.pop()
                points.append((cx, cy))
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
            xs = [point[0] for point in points]
            ys = [point[1] for point in points]
            found.append({
                "size": len(points),
                "bbox": [min(xs), min(ys), max(xs) + 1, max(ys) + 1],
            })
    return sorted(found, key=lambda component: component["size"], reverse=True)


def main() -> None:
    source = Image.open(SOURCE_PATH).convert("RGBA")

    # Deliberately move the complete, already-approved silhouette as one rigid
    # object. No leg mask, joint cut, pixel repaint, rotation or alpha rewrite.
    # At game scale this produces a clean two-phase running bob and guarantees
    # that the paws retain their approved anatomy.
    contact_a = shifted_down(source)
    contact_b = shifted_down(source)

    path_a = WORK / "frame-00-contact-a_v005-safe.png"
    path_b = WORK / "frame-02-contact-b_v005-safe.png"
    contact_a.save(path_a)
    contact_b.save(path_b)

    row = Image.new("RGBA", (420, 140), (0, 0, 0, 0))
    for index, frame in enumerate((contact_a, source, contact_b)):
        row.alpha_composite(frame, (index * 140, 0))
    row.save(QA / "walk-right-v005-safe-row.png")
    row.resize((1680, 560), Image.Resampling.NEAREST).save(
        QA / "walk-right-v005-safe-row_4x.png"
    )

    playback = [contact_a, source, contact_b, source]
    playback[0].save(
        QA / "walk-right-v005-safe-anim.gif",
        save_all=True,
        append_images=playback[1:],
        duration=140,
        loop=0,
        disposal=2,
    )
    playback_4x = [
        frame.resize((560, 560), Image.Resampling.NEAREST)
        for frame in playback
    ]
    playback_4x[0].save(
        QA / "walk-right-v005-safe-anim_4x.gif",
        save_all=True,
        append_images=playback_4x[1:],
        duration=140,
        loop=0,
        disposal=2,
    )
    playback_left_4x = [
        frame.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        for frame in playback_4x
    ]
    playback_left_4x[0].save(
        QA / "walk-left-v005-safe-anim_4x.gif",
        save_all=True,
        append_images=playback_left_4x[1:],
        duration=140,
        loop=0,
        disposal=2,
    )
    comparison = []
    for right, left in zip(playback_4x, playback_left_4x):
        canvas = Image.new("RGBA", (1120, 560), (0, 0, 0, 0))
        canvas.alpha_composite(left, (0, 0))
        canvas.alpha_composite(right, (560, 0))
        comparison.append(canvas)
    comparison[0].save(
        QA / "walk-left-right-v005-safe-comparison_4x.gif",
        save_all=True,
        append_images=comparison[1:],
        duration=140,
        loop=0,
        disposal=2,
    )

    metadata = {
        "id": "MC-0004",
        "name": "Data Mouse",
        "status": "pending_human_review",
        "version": 5,
        "method": "rigid full-silhouette one-pixel contact bob",
        "reason": "visual-safety replacement for rejected V004 articulated leg masks",
        "source": SOURCE_PATH.name,
        "source_sha256": sha256(SOURCE_PATH),
        "guarantees": {
            "leg_pixels_modified": 0,
            "joint_masks": 0,
            "painted_pixels": 0,
            "new_colors": 0,
            "alpha_rewrites": 0,
        },
        "frames": {
            "contact_a": {
                "file": path_a.name,
                "sha256": sha256(path_a),
                "bbox": list(contact_a.getchannel("A").getbbox()),
                "components": components(contact_a),
            },
            "passing": {
                "file": SOURCE_PATH.name,
                "sha256": sha256(SOURCE_PATH),
                "bbox": list(source.getchannel("A").getbbox()),
                "components": components(source),
            },
            "contact_b": {
                "file": path_b.name,
                "sha256": sha256(path_b),
                "bbox": list(contact_b.getchannel("A").getbbox()),
                "components": components(contact_b),
            },
        },
        "playback_pattern": [0, 1, 2, 1],
        "frame_duration_ms": 140,
    }
    metadata_path = WORK / "walk-right-contacts_v005-safe.json"
    metadata_path.write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    print(json.dumps(metadata, indent=2))


if __name__ == "__main__":
    main()
