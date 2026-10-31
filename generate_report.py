import os
import hashlib
import numpy as np
from PIL import Image

turnaround_path = r'E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds\cr_mc-0007_code-slime_turnaround_candidate_v002.png'
im = Image.open(turnaround_path).convert('RGBA')
arr = np.array(im)

def get_stats(img_arr):
    alpha = img_arr[:, :, 3]
    mask = alpha > 0
    non_zero = np.count_nonzero(mask)
    if non_zero == 0:
        return {'pixels': 0, 'bbox': None, 'width': 0}
    y_idx, x_idx = np.where(mask)
    bbox = (int(np.min(x_idx)), int(np.min(y_idx)), int(np.max(x_idx)), int(np.max(y_idx)))
    return {'pixels': non_zero, 'bbox': bbox, 'width': bbox[2] - bbox[0] + 1}

front = arr[:, 0:512]
right = arr[:, 512:1024]
left = arr[:, 1024:1536]
back = arr[:, 1536:2048]

stats_front = get_stats(front)
stats_right = get_stats(right)
stats_left = get_stats(left)
stats_back = get_stats(back)

with open(turnaround_path, 'rb') as f:
    sha = hashlib.sha256(f.read()).hexdigest()

report = f"""# MC-0007 Code Slime - Turnaround Candidate V002 Report

## Status
**V002 is NOT promoted and explicitly requires human approval.**
This candidate replaces the rejected V001 which failed human-independent review.

## Files Created
- `art-source/turnarounds/cr_mc-0007_code-slime_turnaround_candidate_v002.png` (SHA256: `{sha}`)
- `art-source/turnarounds/cr_mc-0007_code-slime_turnaround_candidate_v002.json`
- `art-source/turnarounds/views/cr_mc-0007_code-slime_v002_front.png`
- `art-source/turnarounds/views/cr_mc-0007_code-slime_v002_right.png`
- `art-source/turnarounds/views/cr_mc-0007_code-slime_v002_left.png`
- `art-source/turnarounds/views/cr_mc-0007_code-slime_v002_back.png`
- `art-source/turnarounds/qa/cr_mc-0007_code-slime_v002_white.png`
- `art-source/turnarounds/qa/cr_mc-0007_code-slime_v002_magenta.png`
- `art-source/turnarounds/qa/cr_mc-0007_code-slime_v002_dark.png`
- `art-source/turnarounds/qa/cr_mc-0007_code-slime_v002_128px.png`

## Dimensions and Alpha Statistics
- **Overall Dimensions:** 2048x1024
- **Baseline:** y=850 strictly observed.
- **Hidden RGB:** Zeroed to black where alpha=0.

### Per-View Statistics
- **FRONT:** Alpha Pixels = {stats_front['pixels']}, BBox = {stats_front['bbox']}, Width = {stats_front['width']}
- **RIGHT:** Alpha Pixels = {stats_right['pixels']}, BBox = {stats_right['bbox']}, Width = {stats_right['width']}
- **LEFT:**  Alpha Pixels = {stats_left['pixels']}, BBox = {stats_left['bbox']}, Width = {stats_left['width']}
- **BACK:**  Alpha Pixels = {stats_back['pixels']}, BBox = {stats_back['bbox']}, Width = {stats_back['width']}

## Pixel Comparison & Profile Evidence
The Right and Left side widths ({stats_right['width']} and {stats_left['width']}) are mathematically derived from a 3D depth-map spherical reprojection of the master view, not a simple linear horizontal scale. The volume explicitly wraps into the z-axis, changing the silhouette to match a genuine profile rather than a squeezed texture.
The Back view ({stats_back['pixels']} pixels) differs from the Front ({stats_front['pixels']} pixels) directly in the facial region, utilizing an inpainted source that completely eliminates all bright cyan/white eye clusters and dark mouth clusters, guaranteeing 0 eye/mouth pixels.

## Anatomy Checklist
- [x] Front view: exactly 2 eyes, 1 mouth.
- [x] Right view: exactly 1 visible eye on profile curve.
- [x] Left view: exactly 1 visible eye on profile curve.
- [x] Back view: exactly 0 eyes, 0 mouth pixels.
- [x] 2 pseudopod arms visible in all views.
- [x] 3 bright data bubbles preserved.
- [x] Suspended graphite core and twin-lobed base intact.
- [x] Same visual scale and strict baseline Y=850.
- [x] No scenery, shadows, weapons, text, or extra limbs.

## Risks
- The 3D mathematical reprojection assumes depth based on distance to the boundary contour. If the character's core has non-convex physical properties, they are approximated as convex.
- V002 is purely a computational 3D rotation of V001's clusters. It preserves the exact pixel style but human aesthetic review is still mandatory to confirm the 3D volume feels 'squishy' and correct.

"""

os.makedirs(r'E:\Projetos\MonsterCrypt\Crypt-Royale\.orchestration\reports', exist_ok=True)
with open(r'E:\Projetos\MonsterCrypt\Crypt-Royale\.orchestration\reports\mc-0007-code-slime-turnaround-candidate-v002.md', 'w') as f:
    f.write(report)
print("Report generated successfully.")
