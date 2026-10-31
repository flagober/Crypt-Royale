from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw


ROOT = Path(r"E:\Projetos\MonsterCrypt\Crypt-Royale")
WORK = ROOT / "art-source" / "sprite-sheets" / "work" / "mc-0004" / "right"
SOURCE_PATH = WORK / "frame-01-passing_v002.png"
QA = WORK / "qa-contacts-v004-r3-bitbug-gait"
QA.mkdir(parents=True, exist_ok=True)

SIZE = (140, 140)
PIVOT = (70, 128)

# The side view has two complete primary legs. Masks deliberately overlap the
# hip armor; that overlap is restored later by the immutable body layer.
LEGS = {
    "rear": {
        "polygon": [
            (36, 111), (46, 110), (54, 114), (62, 117), (70, 119),
            (70, 128), (44, 129), (37, 126),
        ],
        "pivot": (46, 113),
    },
    "front": {
        "polygon": [
            (67, 111), (81, 110), (89, 115), (102, 119),
            (102, 128), (73, 129), (67, 125),
        ],
        "pivot": (78, 113),
    },
}

POSES = {
    "A": {
        "rear": {"angle": 6, "target_y": 128, "role": "support-back"},
        "front": {"angle": -6, "target_y": 125, "role": "swing-forward"},
    },
    "B": {
        "rear": {"angle": -6, "target_y": 125, "role": "swing-forward"},
        "front": {"angle": 6, "target_y": 128, "role": "support-back"},
    },
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def shifted(source: Image.Image, dx: int, dy: int) -> Image.Image:
    output = Image.new("RGBA", source.size, (0, 0, 0, 0))
    output.alpha_composite(source, (dx, dy))
    return output


def polygon_mask(points: list[tuple[int, int]]) -> Image.Image:
    mask = Image.new("L", SIZE, 0)
    ImageDraw.Draw(mask).polygon(points, fill=255)
    return mask


def alpha_bbox(image: Image.Image):
    return image.getchannel("A").getbbox()


def binary_alpha(image: Image.Image) -> Image.Image:
    return image.getchannel("A").point(lambda value: 255 if value > 0 else 0)


def rotate_about(layer: Image.Image, angle: float, pivot: tuple[int, int]) -> Image.Image:
    return layer.rotate(
        angle,
        resample=Image.Resampling.NEAREST,
        center=pivot,
        expand=False,
        fillcolor=(0, 0, 0, 0),
    )


def translate_to_baseline(layer: Image.Image, target_y: int) -> tuple[Image.Image, int]:
    bbox = alpha_bbox(layer)
    if bbox is None:
        raise RuntimeError("Rotated leg became empty")
    current_max_y = bbox[3] - 1
    dy = target_y - current_max_y
    return shifted(layer, 0, dy), dy


def connected_components(image: Image.Image) -> list[dict]:
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
    return sorted(found, key=lambda item: item["size"], reverse=True)


def remove_tiny_orphans(image: Image.Image, max_size: int = 3) -> int:
    alpha = image.getchannel("A")
    alpha_px = alpha.load()
    seen: set[tuple[int, int]] = set()
    remove: list[tuple[int, int]] = []
    for y in range(image.height):
        for x in range(image.width):
            if alpha_px[x, y] == 0 or (x, y) in seen:
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
                            and alpha_px[point[0], point[1]] > 0
                            and point not in seen
                        ):
                            seen.add(point)
                            stack.append(point)
            if len(points) <= max_size:
                remove.extend(points)

    pixels = image.load()
    for point in remove:
        pixels[point] = (0, 0, 0, 0)
    return len(remove)


def make_leg_layers(source: Image.Image):
    layers = {}
    masks = {}
    for name, spec in LEGS.items():
        mask = polygon_mask(spec["polygon"])
        layer = Image.new("RGBA", SIZE, (0, 0, 0, 0))
        visible = ImageChops.multiply(source.getchannel("A"), mask).point(
            lambda value: 255 if value > 0 else 0
        )
        layer.paste(source, (0, 0), visible)
        layers[name] = layer
        masks[name] = mask
    return layers, masks


def build_frame(source: Image.Image, phase: str):
    base = shifted(source, 0, 1)
    result = base.copy()
    layers, masks = make_leg_layers(source)

    # Remove the original two legs from their y+1 positions using only their
    # exact alpha silhouettes, never a rectangular clear operation.
    clear_mask = Image.new("L", SIZE, 0)
    for mask in masks.values():
        clear_mask = ImageChops.lighter(clear_mask, shifted(mask.convert("RGBA"), 0, 1).getchannel("R"))
    transparent = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    result.paste(transparent, (0, 0), clear_mask)

    records = {}
    # Rear leg is visually farther away; front leg is composited last.
    for name in ("rear", "front"):
        pose = POSES[phase][name]
        rotated = rotate_about(layers[name], pose["angle"], LEGS[name]["pivot"])
        positioned, dy = translate_to_baseline(rotated, pose["target_y"])
        result.paste(positioned, (0, 0), binary_alpha(positioned))
        records[name] = {
            "angle_degrees": pose["angle"],
            "vertical_adjustment": dy,
            "target_max_y": pose["target_y"],
            "role": pose["role"],
            "bbox": list(alpha_bbox(positioned) or ()),
        }

    # Restore the immutable torso/hip armor over the rotated roots. Only rows
    # through y=114 participate, so feet and lower legs remain animated.
    body_mask = Image.new("L", SIZE, 0)
    body_alpha = base.getchannel("A")
    body_mask.paste(body_alpha.crop((0, 0, 140, 115)), (0, 0))
    body_mask = body_mask.point(lambda value: 255 if value > 0 else 0)
    result.paste(base, (0, 0), body_mask)

    removed_orphans = remove_tiny_orphans(result)
    return result, records, masks, removed_orphans


def composite_background(image: Image.Image, color: tuple[int, int, int, int]):
    background = Image.new("RGBA", image.size, color)
    background.alpha_composite(image)
    return background


def main() -> None:
    source = Image.open(SOURCE_PATH).convert("RGBA")
    frame_a, records_a, masks, removed_a = build_frame(source, "A")
    frame_b, records_b, _, removed_b = build_frame(source, "B")

    path_a = WORK / "frame-00-contact-a_v004-r3.png"
    path_b = WORK / "frame-02-contact-b_v004-r3.png"
    frame_a.save(path_a)
    frame_b.save(path_b)

    row = Image.new("RGBA", (420, 140), (0, 0, 0, 0))
    for index, frame in enumerate((frame_a, source, frame_b)):
        row.alpha_composite(frame, (index * 140, 0))
    row.save(QA / "A_P_B.png")
    row.resize((1680, 560), Image.Resampling.NEAREST).save(QA / "A_P_B_4x.png")

    playback = [frame_a, source, frame_b, source]
    right_4x = [frame.resize((560, 560), Image.Resampling.NEAREST) for frame in playback]
    left_4x = [frame.transpose(Image.Transpose.FLIP_LEFT_RIGHT) for frame in right_4x]
    comparison = []
    for left, right in zip(left_4x, right_4x):
        canvas = Image.new("RGBA", (1120, 560), (0, 0, 0, 0))
        canvas.alpha_composite(left, (0, 0))
        canvas.alpha_composite(right, (560, 0))
        comparison.append(canvas)
    comparison[0].save(
        QA / "left-right-comparison_4x.gif",
        save_all=True,
        append_images=comparison[1:],
        duration=150,
        loop=0,
        disposal=2,
    )

    for label, frame in (("A", frame_a), ("B", frame_b)):
        for bg_name, color in {
            "magenta": (255, 0, 255, 255),
            "dark": (24, 24, 27, 255),
            "white": (255, 255, 255, 255),
        }.items():
            composite_background(frame, color).resize(
                (1120, 1120), Image.Resampling.NEAREST
            ).save(QA / f"{label}_{bg_name}_8x.png")

    mask_preview = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    mask_preview.paste((255, 64, 64, 210), (0, 0), masks["rear"])
    mask_preview.paste((64, 128, 255, 210), (0, 0), masks["front"])
    mask_preview.resize((1120, 1120), Image.Resampling.NEAREST).save(QA / "leg_masks_8x.png")

    source_colors = {pixel[:3] for pixel in source.getdata() if pixel[3] > 0}
    metadata = {
        "id": "MC-0004",
        "name": "Data Mouse",
        "status": "pending_human_review",
        "version": "4-R3",
        "reference_motion": "MC-0001 Bit Bug approved alternating support/swing gait",
        "method": "two lower-leg masks rotated around anatomical knee pivots",
        "source": SOURCE_PATH.name,
        "source_sha256": sha256(SOURCE_PATH),
        "pivot": list(PIVOT),
        "frames": {},
    }
    for label, frame, path, records, removed_orphans in (
        ("contact_a", frame_a, path_a, records_a, removed_a),
        ("contact_b", frame_b, path_b, records_b, removed_b),
    ):
        colors = {pixel[:3] for pixel in frame.getdata() if pixel[3] > 0}
        metadata["frames"][label] = {
            "file": path.name,
            "sha256": sha256(path),
            "bbox": list(alpha_bbox(frame) or ()),
            "components": connected_components(frame),
            "new_rgb_colors": len(colors - source_colors),
            "tiny_orphan_pixels_removed": removed_orphans,
            "legs": records,
        }
    metadata_path = WORK / "walk-right-contacts_v004-r3.json"
    metadata_path.write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    print(json.dumps(metadata, indent=2))


if __name__ == "__main__":
    main()
