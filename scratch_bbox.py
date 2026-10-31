import os
import json
import hashlib
from PIL import Image
from collections import Counter

# Paths
base_dir = r"E:\Projetos\MonsterCrypt\Crypt-Royale"
turnaround_path = os.path.join(base_dir, r"art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_v001.png")

work_dir = os.path.join(base_dir, r"art-source\sprite-sheets\work\mc-0004")
os.makedirs(work_dir, exist_ok=True)

# Load turnaround
img = Image.open(turnaround_path).convert("RGBA")

# 4 regions
regions = [
    ("front", img.crop((0, 0, 512, 1024))),
    ("right", img.crop((512, 0, 1024, 1024))),
    ("left", img.crop((1024, 0, 1536, 1024))),
    ("back", img.crop((1536, 0, 2048, 1024)))
]

# Find bounding boxes relative to 512x1024 regions
def get_bbox(image):
    bbox = image.getbbox()
    return bbox

# Calculate scale
# We need to find the common axis. For a turnaround, usually the center of the image (x=256) is the body axis.
# Let's verify by checking the bboxes.
bboxes = {}
for name, region in regions:
    bboxes[name] = get_bbox(region)
    print(f"{name} bbox: {bboxes[name]}")

# we will write this output to a file so we can inspect it.
with open(os.path.join(work_dir, "bboxes.json"), "w") as f:
    json.dump(bboxes, f)
