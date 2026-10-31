from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw


ROOT = Path(r"E:\Projetos\MonsterCrypt\Crypt-Royale")
WORK = ROOT / "art-source" / "sprite-sheets" / "work" / "mc-0004" / "right"
SOURCE_PATH = WORK / "frame-01-passing_v002.png"
QA_DIR = WORK / "qa-contacts-v004-r2"
QA_DIR.mkdir(parents=True, exist_ok=True)

FRAME_SIZE = (140, 140)
PIVOT = (70, 128)

# Tight, non-overlapping source-coordinate regions containing only the distal
# portions of the four legs. Upper armor and torso are never removed.
SEGMENTS = {
    "FH": {"box": (34, 111, 50, 128), "move_y": 121, "clear_y": 123, "root": (45, 121)},
    "NH": {"box": (50, 104, 70, 129), "move_y": 121, "clear_y": 123, "root": (55, 121)},
    "NF": {"box": (73, 111, 87, 129), "move_y": 120, "clear_y": 122, "root": (80, 120)},
    "FF": {"box": (87, 111, 103, 128), "move_y": 121, "clear_y": 123, "root": (90, 121)},
}

TRANSFORMS = {
    "A": {
        "FH": (0, 1, "support"),
        "NH": (0, 0, "swing"),
        "NF": (0, 1, "support"),
        "FF": (0, 0, "swing"),
    },
    "B": {
        "FH": (0, 0, "swing"),
        "NH": (0, 1, "support"),
        "NF": (0, 0, "swing"),
        "FF": (0, 1, "support"),
    },
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def visible_bbox(image: Image.Image) -> tuple[int, int, int, int] | None:
    return image.getchannel("A").getbbox()


def shifted_down_one(source: Image.Image) -> Image.Image:
    out = Image.new("RGBA", source.size, (0, 0, 0, 0))
    out.alpha_composite(source, (0, 1))
    return out


def exact_visible_pixels(source: Image.Image, box: tuple[int, int, int, int]):
    x0, y0, x1, y1 = box
    pixels = []
    src = source.load()
    for y in range(y0, y1):
        for x in range(x0, x1):
            rgba = src[x, y]
            if rgba[3] > 0:
                pixels.append((x, y, rgba))
    return pixels


def components(image: Image.Image):
    alpha = image.getchannel("A")
    px = alpha.load()
    width, height = image.size
    seen = set()
    found = []
    for y in range(height):
        for x in range(width):
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
                        if ox == 0 and oy == 0:
                            continue
                        nx, ny = cx + ox, cy + oy
                        if (
                            0 <= nx < width
                            and 0 <= ny < height
                            and px[nx, ny] > 0
                            and (nx, ny) not in seen
                        ):
                            seen.add((nx, ny))
                            stack.append((nx, ny))
            xs = [p[0] for p in points]
            ys = [p[1] for p in points]
            found.append(
                {
                    "size": len(points),
                    "bbox": [min(xs), min(ys), max(xs) + 1, max(ys) + 1],
                }
            )
    return sorted(found, key=lambda item: item["size"], reverse=True)


def alpha_counts(image: Image.Image):
    hist = image.getchannel("A").histogram()
    return {
        "alpha_0": hist[0],
        "alpha_255": hist[255],
        "alpha_intermediate": sum(hist[1:255]),
    }


def build_contact(source: Image.Image, phase: str):
    base = shifted_down_one(source)
    result = base.copy()
    dst = result.load()
    allowed = Image.new("1", source.size, 0)
    allowed_px = allowed.load()
    leg_records = {}

    extracted = {
        name: exact_visible_pixels(source, spec["box"])
        for name, spec in SEGMENTS.items()
    }

    # Remove only exact source pixels belonging to the distal portions in their
    # y+1 base positions. No polygon or rectangular transparency is applied.
    for name, pixels in extracted.items():
        clear_y = SEGMENTS[name]["clear_y"]
        for x, y, _rgba in pixels:
            if y >= clear_y and y + 1 < FRAME_SIZE[1]:
                dst[x, y + 1] = (0, 0, 0, 0)
                allowed_px[x, y + 1] = 1

    # Far legs first, then near legs. Pixel replacement uses the exact source
    # RGBA value and a binary presence test, so alpha is never multiplied.
    for name in ("FH", "FF", "NH", "NF"):
        dx, dy, group = TRANSFORMS[phase][name]
        move_y = SEGMENTS[name]["move_y"]
        max_y = -1
        visible_written = 0
        for x, y, rgba in extracted[name]:
            if y < move_y:
                continue
            tx, ty = x + dx, y + dy
            if 0 <= tx < FRAME_SIZE[0] and 0 <= ty < FRAME_SIZE[1]:
                dst[tx, ty] = rgba
                allowed_px[tx, ty] = 1
                max_y = max(max_y, ty)
                visible_written += 1
        leg_records[name] = {
            "root": list(SEGMENTS[name]["root"]),
            "translation": [dx, dy],
            "group": group,
            "max_y": max_y,
            "pixels_written": visible_written,
        }

    # Prove the immutable region is byte-identical to Passing shifted y+1.
    immutable_diff = 0
    base_px = base.load()
    out_px = result.load()
    for y in range(FRAME_SIZE[1]):
        for x in range(FRAME_SIZE[0]):
            if not allowed_px[x, y] and out_px[x, y] != base_px[x, y]:
                immutable_diff += 1

    return result, allowed, leg_records, immutable_diff


def save_qa(label: str, image: Image.Image):
    for name, color in {
        "white": (255, 255, 255, 255),
        "magenta": (255, 0, 255, 255),
        "dark": (30, 30, 30, 255),
    }.items():
        bg = Image.new("RGBA", image.size, color)
        bg.alpha_composite(image)
        bg.save(QA_DIR / f"{label}_{name}_1x.png")
        bg.resize((560, 560), Image.Resampling.NEAREST).save(
            QA_DIR / f"{label}_{name}_4x.png"
        )
        bg.resize((1120, 1120), Image.Resampling.NEAREST).save(
            QA_DIR / f"{label}_{name}_8x.png"
        )


def main():
    source = Image.open(SOURCE_PATH).convert("RGBA")
    passing_hash = sha256(SOURCE_PATH)
    source_colors = {rgba[:3] for rgba in source.getdata() if rgba[3] > 0}

    frame_a, allowed_a, legs_a, diff_a = build_contact(source, "A")
    frame_b, allowed_b, legs_b, diff_b = build_contact(source, "B")

    path_a = WORK / "frame-00-contact-a_v004-r2.png"
    path_b = WORK / "frame-02-contact-b_v004-r2.png"
    frame_a.save(path_a)
    frame_b.save(path_b)

    save_qa("A", frame_a)
    save_qa("P", source)
    save_qa("B", frame_b)

    side = Image.new("RGBA", (420, 140), (0, 0, 0, 0))
    side.alpha_composite(frame_a, (0, 0))
    side.alpha_composite(source, (140, 0))
    side.alpha_composite(frame_b, (280, 0))
    side.save(QA_DIR / "side_by_side_A_P_B.png")
    side.resize((1680, 560), Image.Resampling.NEAREST).save(
        QA_DIR / "side_by_side_A_P_B_4x.png"
    )

    frame_a.save(
        QA_DIR / "sequence.gif",
        save_all=True,
        append_images=[source, frame_b, source],
        duration=160,
        loop=0,
        disposal=2,
    )
    playback = [frame_a, source, frame_b, source]
    playback_4x = [
        frame.resize((560, 560), Image.Resampling.NEAREST)
        for frame in playback
    ]
    playback_4x[0].save(
        QA_DIR / "sequence_4x.gif",
        save_all=True,
        append_images=playback_4x[1:],
        duration=150,
        loop=0,
        disposal=2,
    )
    playback_left_4x = [
        frame.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        for frame in playback_4x
    ]
    comparison = []
    for left, right in zip(playback_left_4x, playback_4x):
        canvas = Image.new("RGBA", (1120, 560), (0, 0, 0, 0))
        canvas.alpha_composite(left, (0, 0))
        canvas.alpha_composite(right, (560, 0))
        comparison.append(canvas)
    comparison[0].save(
        QA_DIR / "left-right-comparison_4x.gif",
        save_all=True,
        append_images=comparison[1:],
        duration=150,
        loop=0,
        disposal=2,
    )

    for label, allowed in (("A", allowed_a), ("B", allowed_b)):
        overlay = Image.new("RGBA", FRAME_SIZE, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        apx = allowed.load()
        for y in range(FRAME_SIZE[1]):
            for x in range(FRAME_SIZE[0]):
                if apx[x, y]:
                    draw.point((x, y), fill=(255, 0, 0, 180))
        overlay.resize((1120, 1120), Image.Resampling.NEAREST).save(
            QA_DIR / f"{label}_allowed_change_mask_8x.png"
        )

    metadata = {
        "id": "MC-0004",
        "name": "Data Mouse",
        "status": "pending_human_review",
        "version": "4-R2",
        "method": "corrected manual distal-leg rig; vertical lift only; toe silhouettes preserved",
        "source_passing": SOURCE_PATH.name,
        "source_hash": passing_hash,
        "pivot": list(PIVOT),
        "closures": 0,
        "newly_painted_pixels": 0,
        "frames": {},
    }
    for label, image, path, legs, immutable_diff in (
        ("Contact_A", frame_a, path_a, legs_a, diff_a),
        ("Contact_B", frame_b, path_b, legs_b, diff_b),
    ):
        colors = {rgba[:3] for rgba in image.getdata() if rgba[3] > 0}
        metadata["frames"][label] = {
            "file": path.name,
            "sha256": sha256(path),
            "dimensions": list(image.size),
            "mode": image.mode,
            "bbox": list(visible_bbox(image) or ()),
            "alpha_counts": alpha_counts(image),
            "visible_rgb_count": len(colors),
            "rgb_subset_diff": len(colors - source_colors),
            "immutable_body_diff": immutable_diff,
            "components": components(image),
            "per_leg": legs,
        }

    metadata_path = WORK / "walk-right-contacts_v004-r2.json"
    metadata_path.write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    print(json.dumps(metadata, indent=2))


if __name__ == "__main__":
    main()
