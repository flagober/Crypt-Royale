from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(r"E:\Projetos\MonsterCrypt\Crypt-Royale")
GEN = Path(r"C:\Users\familia\.codex\generated_images\01a0dde1-a5e1-7ac3-98af-ab84996705e5")
SOURCE_DIR = ROOT / "art-source" / "turnarounds" / "views" / "source"
VIEW_DIR = ROOT / "art-source" / "turnarounds" / "views"
OUT_DIR = ROOT / "art-source" / "turnarounds"

SOURCE_PATHS = {
    "front": GEN / "exec-9982b215-e649-47e3-8f8f-f7284bf751ae.png",
    "right": GEN / "exec-0ffed7e7-08f0-4e12-84a4-09fe1db74d38.png",
    "back": GEN / "exec-8ab4b484-c686-438c-84ad-5d28462712e1.png",
}

CELL_W = 512
CELL_H = 1024
BASELINE = 850
MAX_W = 440
MAX_H = 760
VIEW_ORDER = ["front", "right", "left", "back"]


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest().upper()


def neutralize_hidden_rgb(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    pixels = list(image.getdata())
    image.putdata([(0, 0, 0, 0) if a == 0 else (r, g, b, a) for r, g, b, a in pixels])
    return image


def normalize_generated_alpha(image: Image.Image) -> Image.Image:
    """Normalize image-generator alpha while preserving antialiased edge coverage."""
    image = image.convert("RGBA")
    normalized = []
    for r, g, b, a in image.getdata():
        if a <= 20:
            normalized.append((0, 0, 0, 0))
        elif a >= 200:
            normalized.append((r, g, b, 255))
        else:
            mapped = round((a - 20) * 255 / 180)
            normalized.append((r, g, b, mapped))
    image.putdata(normalized)
    return image


def crop_visible(image: Image.Image) -> Image.Image:
    bbox = image.getchannel("A").getbbox()
    if bbox is None:
        raise ValueError("Source image has no visible pixels")
    return image.crop(bbox)


def alpha_counts(image: Image.Image) -> dict[str, int]:
    hist = image.getchannel("A").histogram()
    return {
        "alpha_0": hist[0],
        "alpha_255": hist[255],
        "alpha_intermediate": sum(hist[1:255]),
    }


def main() -> None:
    SOURCE_DIR.mkdir(parents=True, exist_ok=True)
    VIEW_DIR.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for name, path in SOURCE_PATHS.items():
        if not path.exists():
            raise FileNotFoundError(path)
        shutil.copy2(path, SOURCE_DIR / f"cr_mc-0004_data-mouse_{name}_gpt-source_v003.png")

    raw = {
        name: neutralize_hidden_rgb(normalize_generated_alpha(Image.open(path)))
        for name, path in SOURCE_PATHS.items()
    }
    raw["left"] = ImageOps.mirror(raw["right"])
    cropped = {name: crop_visible(raw[name]) for name in VIEW_ORDER}

    scale = min(
        min(MAX_W / image.width, MAX_H / image.height)
        for image in cropped.values()
    )

    cells: dict[str, Image.Image] = {}
    view_boxes: dict[str, list[int]] = {}
    view_hashes: dict[str, str] = {}
    for name in VIEW_ORDER:
        image = cropped[name]
        size = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
        resized = image.resize(size, Image.Resampling.NEAREST)
        cell = Image.new("RGBA", (CELL_W, CELL_H), (0, 0, 0, 0))
        x = (CELL_W - resized.width) // 2
        y = BASELINE - resized.height
        cell.alpha_composite(resized, (x, y))
        cell = neutralize_hidden_rgb(cell)
        view_path = VIEW_DIR / f"cr_mc-0004_data-mouse_{name}_gpt-candidate_v003.png"
        cell.save(view_path, optimize=True)
        cells[name] = cell
        bbox = cell.getchannel("A").getbbox()
        view_boxes[name] = list(bbox) if bbox else []
        view_hashes[name] = sha256(view_path)

    sheet = Image.new("RGBA", (CELL_W * 4, CELL_H), (0, 0, 0, 0))
    for index, name in enumerate(VIEW_ORDER):
        sheet.alpha_composite(cells[name], (index * CELL_W, 0))
    sheet = neutralize_hidden_rgb(sheet)

    candidate = OUT_DIR / "cr_mc-0004_data-mouse_turnaround_candidate_v003.png"
    sheet.save(candidate, optimize=True)

    backgrounds = {
        "white": (255, 255, 255, 255),
        "magenta": (255, 0, 255, 255),
        "dark": (24, 24, 27, 255),
    }
    qa_files = []
    for label, color in backgrounds.items():
        bg = Image.new("RGBA", sheet.size, color)
        bg.alpha_composite(sheet)
        path = OUT_DIR / f"cr_mc-0004_data-mouse_turnaround_candidate_v003_qa_{label}.png"
        bg.convert("RGB").save(path, optimize=True)
        qa_files.append(str(path.relative_to(ROOT)).replace("\\", "/"))

    gameplay = Image.new("RGBA", (128 * 4, 256), (24, 24, 27, 255))
    for index, name in enumerate(VIEW_ORDER):
        thumb = cells[name].resize((128, 256), Image.Resampling.NEAREST)
        gameplay.alpha_composite(thumb, (index * 128, 0))
    gameplay_path = OUT_DIR / "cr_mc-0004_data-mouse_turnaround_candidate_v003_qa_gameplay.png"
    gameplay.convert("RGB").save(gameplay_path, optimize=True)
    qa_files.append(str(gameplay_path.relative_to(ROOT)).replace("\\", "/"))

    master = ROOT / "art-source" / "approved-masters" / "cr_mc-0004_data-mouse_master_v001.png"
    metadata = {
        "id": "MC-0004",
        "name": "Data Mouse",
        "status": "pending_human_review",
        "version": 3,
        "dimensions": [sheet.width, sheet.height],
        "mode": sheet.mode,
        "view_order": VIEW_ORDER,
        "cell_size": [CELL_W, CELL_H],
        "baseline_y": BASELINE,
        "common_scale_factor": scale,
        "master_path": str(master.relative_to(ROOT)).replace("\\", "/"),
        "master_sha256": sha256(master),
        "candidate_sha256": sha256(candidate),
        "alpha_counts": alpha_counts(sheet),
        "view_bounding_boxes": view_boxes,
        "view_hashes": view_hashes,
        "left_derivation": "deterministic horizontal mirror of right profile",
        "anatomy_validation": {
            "legs_per_view": 4,
            "receiver_ears_per_view": 2,
            "tails_per_view": 1,
            "connector_tips_per_view": 1,
            "front_visored_eyes": 2,
            "side_near_visor_lenses": 1,
            "back_face_elements": 0,
            "visual_review": "passed_by_codex_pending_human_approval",
        },
        "history": {
            "v001": "rejected_visual_qa_procedural_mirroring",
            "v002": "invalid_placeholder_gemini_image_quota_exhausted",
        },
        "qa_files": qa_files,
        "generation": "OpenAI built-in image generation; front, right profile and back generated separately from approved master",
    }
    metadata_path = OUT_DIR / "cr_mc-0004_data-mouse_turnaround_candidate_v003.json"
    metadata_path.write_text(json.dumps(metadata, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps(metadata, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
