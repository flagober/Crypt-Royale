from PIL import Image
import json
import hashlib
import os

# inputs
source_img_path = r"E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0013_circuit-hare_exploration_v001.png"

# outputs
out_dir = r"E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration"
out_img_name = "cr_mc-0013_circuit-hare_master-candidate_v001.png"
out_img_path = os.path.join(out_dir, out_img_name)
out_json_path = os.path.join(out_dir, "cr_mc-0013_circuit-hare_master-candidate_v001.json")

os.makedirs(out_dir, exist_ok=True)

# Extract the center 724x724 cell (x=724..1447)
with Image.open(source_img_path) as img:
    img = img.convert("RGBA")
    source_hash = hashlib.sha256(open(source_img_path, 'rb').read()).hexdigest()
    crop_rect = (724, 0, 1448, 724)
    cell = img.crop(crop_rect)

# Scale 2x with nearest-neighbor to 1448x1448
scaled = cell.resize((1448, 1448), Image.Resampling.NEAREST)

# Place centered on 2048x2048 transparent canvas
canvas = Image.new("RGBA", (2048, 2048), (0, 0, 0, 0))
offset_x = (2048 - 1448) // 2
offset_y = (2048 - 1448) // 2
canvas.paste(scaled, (offset_x, offset_y))

# Process pixels: set RGB=(0,0,0) wherever alpha=0
pixels = canvas.load()
width, height = canvas.size
alpha_counts = {}
bbox_min_x, bbox_min_y = width, height
bbox_max_x, bbox_max_y = -1, -1

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        if a == 0:
            pixels[x, y] = (0, 0, 0, 0)
        
        # after potential modification
        r, g, b, a = pixels[x, y]
        alpha_counts[a] = alpha_counts.get(a, 0) + 1
        
        if a > 0:
            if x < bbox_min_x: bbox_min_x = x
            if x > bbox_max_x: bbox_max_x = x
            if y < bbox_min_y: bbox_min_y = y
            if y > bbox_max_y: bbox_max_y = y

if bbox_min_x > bbox_max_x:
    visible_bbox = None
else:
    visible_bbox = [bbox_min_x, bbox_min_y, bbox_max_x, bbox_max_y]

canvas.save(out_img_path)
out_hash = hashlib.sha256(open(out_img_path, 'rb').read()).hexdigest()

# Composites
def make_composite(bg_color, suffix):
    bg = Image.new("RGBA", canvas.size, bg_color)
    bg.paste(canvas, (0, 0), canvas)
    bg = bg.convert("RGB")
    bg.save(os.path.join(out_dir, f"cr_mc-0013_circuit-hare_master-candidate_v001_qa_{suffix}.png"))

make_composite((255, 255, 255, 255), "white")
make_composite((255, 0, 255, 255), "magenta")
make_composite((64, 64, 64, 255), "dark-gray")

# Previews 128px and 96px
prev_128 = canvas.resize((128, 128), Image.Resampling.LANCZOS)
prev_128.save(os.path.join(out_dir, "cr_mc-0013_circuit-hare_master-candidate_v001_qa_prev128.png"))

prev_96 = canvas.resize((96, 96), Image.Resampling.LANCZOS)
prev_96.save(os.path.join(out_dir, "cr_mc-0013_circuit-hare_master-candidate_v001_qa_prev096.png"))

# JSON metadata
metadata = {
    "source_crop": crop_rect,
    "scale": 2.0,
    "placement_offsets": (offset_x, offset_y),
    "dimensions": (2048, 2048),
    "mode": canvas.mode,
    "alpha_distribution": alpha_counts,
    "visible_bbox": visible_bbox,
    "source_hash": source_hash,
    "output_hash": out_hash,
    "identity_contract": "MC-0013 Circuit Hare: Center balanced-cyber variant. 4 legs, 2 ears (arc electrical bridge), 1 tail, cyan-magenta route, diamond chest node."
}

with open(out_json_path, 'w') as f:
    json.dump(metadata, f, indent=2)

print(json.dumps(metadata, indent=2))
