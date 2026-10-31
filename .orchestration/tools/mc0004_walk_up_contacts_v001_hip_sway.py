from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw


ROOT = Path(r"E:\Projetos\MonsterCrypt\Crypt-Royale")
WORK = ROOT / "art-source" / "sprite-sheets" / "work" / "mc-0004" / "back"
SOURCE_PATH = WORK / "frame-01-passing_v002.png"
QA = WORK / "qa-contacts-v002-tail-clean"
QA.mkdir(parents=True, exist_ok=True)

SIZE = (140, 140)
PIVOT = (70, 128)

# Only the lower legs are animated. The masks overlap the knee/hip armor; the
# original body is restored above y=109 after compositing to protect the face,
# torso, arms and upper joints pixel-for-pixel.
LEGS = {
    "image_left": {
        "polygon": [(18, 105), (50, 104), (53, 128), (48, 131), (17, 131)],
        "pivot": (36, 110),
    },
    "image_right": {
        "polygon": [(73, 105), (105, 104), (107, 131), (74, 131)],
        "pivot": (88, 110),
    },
}

# A true alternating stride seen from the front: the support foot opens gently
# and reaches y=128; the opposing foot closes toward the centre and lifts two
# pixels. Phase B mirrors the roles without flipping the character artwork.
POSES = {
    "A": {
        "image_left": {"dx": 0, "dy": 1, "target_y": 128, "role": "support-planted"},
        "image_right": {"dx": -2, "dy": -1, "target_y": 126, "role": "swing-forward"},
    },
    "B": {
        "image_left": {"dx": 2, "dy": -1, "target_y": 126, "role": "swing-forward"},
        "image_right": {"dx": 0, "dy": 1, "target_y": 128, "role": "support-planted"},
    },
}

BODY_SWAY_X = {"A": -1, "B": 1}


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


def binary_alpha(image: Image.Image) -> Image.Image:
    return image.getchannel("A").point(lambda value: 255 if value > 0 else 0)


def alpha_bbox(image: Image.Image):
    return image.getchannel("A").getbbox()


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
    dy = target_y - (bbox[3] - 1)
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
            found.append({"size": len(points), "bbox": [min(xs), min(ys), max(xs) + 1, max(ys) + 1]})
    return sorted(found, key=lambda item: item["size"], reverse=True)


def remove_tiny_orphans(image: Image.Image, max_size: int = 3) -> int:
    components = connected_components(image)
    alpha = image.getchannel("A")
    alpha_px = alpha.load()
    removed = 0
    # Preserve authentic whisker/antenna details already present in the source;
    # only remove tiny pieces outside the source's original alpha footprint.
    source_alpha = Image.open(SOURCE_PATH).convert("RGBA").getchannel("A")
    source_px = source_alpha.load()
    pixels = image.load()
    for component in components:
        if component["size"] > max_size:
            continue
        x0, y0, x1, y1 = component["bbox"]
        points = [
            (x, y)
            for y in range(y0, y1)
            for x in range(x0, x1)
            if alpha_px[x, y] > 0
        ]
        if all(source_px[x, max(0, y - 1)] == 0 for x, y in points):
            for point in points:
                pixels[point] = (0, 0, 0, 0)
                removed += 1
    return removed


def make_leg_layers(source: Image.Image):
    layers = {}
    masks = {}
    for name, spec in LEGS.items():
        mask = polygon_mask(spec["polygon"])
        visible = ImageChops.multiply(source.getchannel("A"), mask).point(
            lambda value: 255 if value > 0 else 0
        )
        layer = Image.new("RGBA", SIZE, (0, 0, 0, 0))
        layer.paste(source, (0, 0), visible)
        layers[name] = layer
        masks[name] = mask
    return layers, masks


def build_frame(source: Image.Image, phase: str):
    body_sway_x = BODY_SWAY_X[phase]
    base = shifted(source, body_sway_x, 1)
    result = base.copy()
    layers, masks = make_leg_layers(source)

    clear_mask = Image.new("L", SIZE, 0)
    for mask in masks.values():
        moved_mask = shifted(mask.convert("RGBA"), body_sway_x, 1).getchannel("R")
        clear_mask = ImageChops.lighter(clear_mask, moved_mask)
    result.paste(Image.new("RGBA", SIZE, (0, 0, 0, 0)), (0, 0), clear_mask)

    records = {}
    for name in ("image_left", "image_right"):
        pose = POSES[phase][name]
        positioned = shifted(layers[name], pose["dx"], pose["dy"])
        result.paste(positioned, (0, 0), binary_alpha(positioned))
        records[name] = {
            "angle_degrees": 0,
            "horizontal_adjustment": pose["dx"],
            "vertical_adjustment": pose["dy"],
            "target_max_y": pose["target_y"],
            "role": pose["role"],
            "bbox": list(alpha_bbox(positioned) or ()),
        }

    body_mask = Image.new("L", SIZE, 0)
    # Through y=113 the tail crosses behind the right leg; restoring this band
    # keeps the tail fully immutable while the lower feet animate beneath it.
    body_mask.paste(base.getchannel("A").crop((0, 0, 140, 114)), (0, 0))
    body_mask = body_mask.point(lambda value: 255 if value > 0 else 0)
    result.paste(base, (0, 0), body_mask)
    # The tail crosses in front of the lower body. Restore the entire RGBA band
    # unconditionally (including transparent negative space), preventing any
    # translated leg pixel from appearing above or alongside the tail.
    result.paste(base.crop((0, 0, 140, 114)), (0, 0))
    removed = remove_tiny_orphans(result)
    return result, records, masks, removed


def composite_background(image: Image.Image, color: tuple[int, int, int, int]):
    background = Image.new("RGBA", image.size, color)
    background.alpha_composite(image)
    return background


def pixel_diff_count(left: Image.Image, right: Image.Image, box: tuple[int, int, int, int]) -> int:
    diff = ImageChops.difference(left.crop(box), right.crop(box))
    return sum(1 for pixel in diff.getdata() if pixel != (0, 0, 0, 0))


def main() -> None:
    source = Image.open(SOURCE_PATH).convert("RGBA")
    frame_a, records_a, masks, removed_a = build_frame(source, "A")
    frame_b, records_b, _, removed_b = build_frame(source, "B")

    path_a = WORK / "frame-00-contact-a_v002.png"
    path_b = WORK / "frame-02-contact-b_v002.png"
    frame_a.save(path_a)
    frame_b.save(path_b)

    row = Image.new("RGBA", (420, 140), (0, 0, 0, 0))
    for index, frame in enumerate((frame_a, source, frame_b)):
        row.alpha_composite(frame, (index * 140, 0))
    row.save(QA / "A_P_B.png")
    row.resize((1680, 560), Image.Resampling.NEAREST).save(QA / "A_P_B_4x.png")

    playback = [frame_a, source, frame_b, source]
    frames_4x = []
    for frame in playback:
        opaque = composite_background(frame, (15, 23, 42, 255))
        frames_4x.append(opaque.resize((560, 560), Image.Resampling.NEAREST).convert("RGB"))
    frames_4x[0].save(
        QA / "walk-up-v002_anim.gif",
        save_all=True,
        append_images=frames_4x[1:],
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
    mask_preview.paste((255, 64, 64, 210), (0, 0), masks["image_left"])
    mask_preview.paste((64, 128, 255, 210), (0, 0), masks["image_right"])
    mask_preview.resize((1120, 1120), Image.Resampling.NEAREST).save(QA / "leg_masks_8x.png")

    source_colors = {pixel[:3] for pixel in source.getdata() if pixel[3] > 0}
    metadata = {
        "id": "MC-0004",
        "name": "Data Mouse",
        "direction": "up",
        "status": "pending_human_review",
        "version": "2",
        "motion_reference": "approved lateral V004-R4 human-like gait",
        "method": "planted support foot plus one-pixel lateral body/hip weight transfer",
        "body_sway_pixels": BODY_SWAY_X,
        "tail_protection": "full RGBA band y=0..113 restored unconditionally, including negative space",
        "source": SOURCE_PATH.name,
        "source_sha256": sha256(SOURCE_PATH),
        "pivot": list(PIVOT),
        "frames": {},
    }
    for label, phase, frame, path, records, removed in (
        ("contact_a", "A", frame_a, path_a, records_a, removed_a),
        ("contact_b", "B", frame_b, path_b, records_b, removed_b),
    ):
        colors = {pixel[:3] for pixel in frame.getdata() if pixel[3] > 0}
        metadata["frames"][label] = {
            "file": path.name,
            "sha256": sha256(path),
            "bbox": list(alpha_bbox(frame) or ()),
            "components": connected_components(frame),
            "new_rgb_colors": len(colors - source_colors),
            "tiny_orphan_pixels_removed": removed,
            "immutable_body_and_tail_diff_y0_113": pixel_diff_count(
                frame, shifted(source, BODY_SWAY_X[phase], 1), (0, 0, 140, 114)
            ),
            "safe_area_ok": bool(
                alpha_bbox(frame)
                and alpha_bbox(frame)[0] >= 10
                and alpha_bbox(frame)[2] <= 130
                and alpha_bbox(frame)[3] - 1 <= 128
            ),
            "legs": records,
        }
    metadata_path = WORK / "walk-up-contacts_v002.json"
    metadata_path.write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    print(json.dumps(metadata, indent=2))


if __name__ == "__main__":
    main()
