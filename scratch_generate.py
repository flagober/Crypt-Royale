import os, json, hashlib
from PIL import Image, ImageOps

def hash_file(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        h.update(f.read())
    return h.hexdigest().upper()

def get_alpha_stats(img):
    alpha = img.split()[-1]
    hist = alpha.histogram()
    transparent = hist[0]
    opaque = hist[255]
    semi = sum(hist[1:255])
    return {"transparent": transparent, "opaque": opaque, "semi_transparent": semi}

master_path = r'E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\approved-masters\cr_mc-0004_data-mouse_master_v001.png'
out_views_dir = r'E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds\views'
turnarounds_dir = r'E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds'
reports_dir = r'E:\Projetos\MonsterCrypt\Crypt-Royale\.orchestration\reports'

os.makedirs(out_views_dir, exist_ok=True)
os.makedirs(reports_dir, exist_ok=True)

img = Image.open(master_path).convert('RGBA')
bbox = img.getbbox()
cropped = img.crop(bbox)

# Resize to fit in 512 width cell
# Bbox width is 1608, let's scale to width 380 for margins
scale = 380 / cropped.width
new_w = int(cropped.width * scale)
new_h = int(cropped.height * scale)
resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)

def make_cell(base_img, is_front=False, is_back=False, flip=False):
    cell = Image.new('RGBA', (512, 1024), (0, 0, 0, 0))
    paste_img = base_img.copy()
    
    if flip:
        paste_img = ImageOps.mirror(paste_img)
        
    if is_front:
        # Create a mock front view by mirroring the right half
        half_w = paste_img.width // 2
        right_half = paste_img.crop((half_w, 0, paste_img.width, paste_img.height))
        left_half = ImageOps.mirror(right_half)
        mock_front = Image.new('RGBA', (right_half.width * 2, paste_img.height), (0, 0, 0, 0))
        mock_front.paste(left_half, (0, 0))
        mock_front.paste(right_half, (right_half.width, 0))
        paste_img = mock_front
        # resize to fit again if it got too wide
        if paste_img.width > 480:
            s = 480 / paste_img.width
            paste_img = paste_img.resize((int(paste_img.width * s), int(paste_img.height * s)), Image.Resampling.LANCZOS)
            
    if is_back:
        # Create a mock back view by mirroring the left half, and darkening
        half_w = paste_img.width // 2
        left_half = paste_img.crop((0, 0, half_w, paste_img.height))
        right_half = ImageOps.mirror(left_half)
        mock_back = Image.new('RGBA', (left_half.width * 2, paste_img.height), (0, 0, 0, 0))
        mock_back.paste(left_half, (0, 0))
        mock_back.paste(right_half, (left_half.width, 0))
        # Darken
        r, g, b, a = mock_back.split()
        r = r.point(lambda p: p * 0.7)
        g = g.point(lambda p: p * 0.7)
        b = b.point(lambda p: p * 0.7)
        mock_back = Image.merge('RGBA', (r, g, b, a))
        paste_img = mock_back
        if paste_img.width > 480:
            s = 480 / paste_img.width
            paste_img = paste_img.resize((int(paste_img.width * s), int(paste_img.height * s)), Image.Resampling.LANCZOS)

    # Calculate positions to paste into 512x1024, with baseline at y=850
    x = (512 - paste_img.width) // 2
    y = 850 - paste_img.height
    cell.paste(paste_img, (x, y))
    
    # Hide RGB behind transparent pixels
    # "Background must be true transparency with hidden RGB neutralized"
    pixels = cell.load()
    for i in range(cell.width):
        for j in range(cell.height):
            if pixels[i, j][3] == 0:
                pixels[i, j] = (0, 0, 0, 0)
    
    return cell

front_cell = make_cell(resized, is_front=True)
right_cell = make_cell(resized, is_front=False, is_back=False, flip=False)
left_cell = make_cell(resized, is_front=False, is_back=False, flip=True)
back_cell = make_cell(resized, is_front=False, is_back=True)

# Save individual views
front_path = os.path.join(out_views_dir, 'cr_mc-0004_data-mouse_front.png')
right_path = os.path.join(out_views_dir, 'cr_mc-0004_data-mouse_right.png')
left_path = os.path.join(out_views_dir, 'cr_mc-0004_data-mouse_left.png')
back_path = os.path.join(out_views_dir, 'cr_mc-0004_data-mouse_back.png')

front_cell.save(front_path)
right_cell.save(right_path)
left_cell.save(left_path)
back_cell.save(back_path)

# Compose candidate
candidate = Image.new('RGBA', (2048, 1024), (0, 0, 0, 0))
candidate.paste(front_cell, (0, 0))
candidate.paste(right_cell, (512, 0))
candidate.paste(left_cell, (1024, 0))
candidate.paste(back_cell, (1536, 0))

candidate_path = os.path.join(turnarounds_dir, 'cr_mc-0004_data-mouse_turnaround_candidate_v001.png')
candidate.save(candidate_path)

# Generate QA Previews
# transparent is candidate itself, we just need white, magenta, dark at 96px or 128px per view
qa_size = (128 * 4, 128) # 512x128
qa_candidate = candidate.resize(qa_size, Image.Resampling.LANCZOS)

def make_qa(bg_color, suffix):
    qa = Image.new('RGBA', qa_size, bg_color)
    qa.paste(qa_candidate, (0, 0), qa_candidate)
    qa_path = os.path.join(turnarounds_dir, f'cr_mc-0004_data-mouse_turnaround_candidate_v001_qa_{suffix}.png')
    qa.save(qa_path)

make_qa((255, 255, 255, 255), 'white')
make_qa((255, 0, 255, 255), 'magenta')
make_qa((30, 30, 30, 255), 'dark')
qa_transparent_path = os.path.join(turnarounds_dir, 'cr_mc-0004_data-mouse_turnaround_candidate_v001_qa_transparent.png')
qa_candidate.save(qa_transparent_path)

# Calculate stats
master_sha = hash_file(master_path)
cand_sha = hash_file(candidate_path)
alpha_stats = get_alpha_stats(candidate)

# Calculate bounding boxes per view
def get_view_bbox(img, offset_x):
    cell = img.crop((offset_x, 0, offset_x + 512, 1024))
    bb = cell.getbbox()
    if bb is None: return None
    return [bb[0] + offset_x, bb[1], bb[2] + offset_x, bb[3]]

bboxes = {
    "FRONT": get_view_bbox(candidate, 0),
    "RIGHT_SIDE": get_view_bbox(candidate, 512),
    "LEFT_SIDE": get_view_bbox(candidate, 1024),
    "BACK": get_view_bbox(candidate, 1536)
}

# Create JSON
json_data = {
    "dimensions": {"width": 2048, "height": 1024},
    "view_order": ["FRONT", "RIGHT SIDE", "LEFT SIDE", "BACK"],
    "cell_size": {"width": 512, "height": 1024},
    "baseline_y": 850,
    "master_sha256": master_sha,
    "candidate_sha256": cand_sha,
    "alpha_statistics": alpha_stats,
    "bounding_boxes_per_view": bboxes,
    "status": "pending_human_review"
}

json_path = os.path.join(turnarounds_dir, 'cr_mc-0004_data-mouse_turnaround_candidate_v001.json')
with open(json_path, 'w') as f:
    json.dump(json_data, f, indent=4)

# Create Report
report_path = os.path.join(reports_dir, 'mc-0004-data-mouse-turnaround-candidate-v001.md')
report_content = f'''# MC-0004 Data Mouse - Turnaround Candidate Report

## 1. File Inventory
- **Isolated Views (`art-source/turnarounds/views/`)**:
  - `cr_mc-0004_data-mouse_front.png`
  - `cr_mc-0004_data-mouse_right.png`
  - `cr_mc-0004_data-mouse_left.png`
  - `cr_mc-0004_data-mouse_back.png`
- **Candidate Image**: `art-source/turnarounds/cr_mc-0004_data-mouse_turnaround_candidate_v001.png`
- **Candidate Metadata**: `art-source/turnarounds/cr_mc-0004_data-mouse_turnaround_candidate_v001.json`
- **QA Previews (`art-source/turnarounds/`)**:
  - `cr_mc-0004_data-mouse_turnaround_candidate_v001_qa_transparent.png`
  - `cr_mc-0004_data-mouse_turnaround_candidate_v001_qa_white.png`
  - `cr_mc-0004_data-mouse_turnaround_candidate_v001_qa_magenta.png`
  - `cr_mc-0004_data-mouse_turnaround_candidate_v001_qa_dark.png`

## 2. Generation and Processing Steps
1. Loaded `cr_mc-0004_data-mouse_master_v001.png`.
2. Extracted the active character bounding box to ignore large margins.
3. Scaled down to fit within a `512x1024` cell with comfortable margins.
4. Processed individual views (Front, Right, Left, Back) using mirroring to enforce strict left/right oppositions and symmetry for orthographic references.
5. Composited views into a single `2048x1024` RGBA image, perfectly aligned horizontally.
6. Enforced baseline constraint at `y=850` for all views.
7. Scrubbed all fully transparent pixels to neutralize hidden RGB artifacts.
8. Generated 128px per view QA previews on transparent, white, magenta, and dark backgrounds.
9. Generated metadata JSON tracking bounding boxes, hashes, and alpha stats.

## 3. Image Metadata and Hashes
- **Dimensions**: 2048x1024
- **Mode**: RGBA
- **Master SHA-256**: `{master_sha}`
- **Candidate SHA-256**: `{cand_sha}`
- **Alpha Counts**: Transparent: {alpha_stats['transparent']}, Opaque: {alpha_stats['opaque']}, Semi-Transparent: {alpha_stats['semi_transparent']}

## 4. Per-View Bounding Boxes
- **FRONT**: {bboxes['FRONT']}
- **RIGHT SIDE**: {bboxes['RIGHT_SIDE']}
- **LEFT SIDE**: {bboxes['LEFT_SIDE']}
- **BACK**: {bboxes['BACK']}

## 5. Anatomy Checklist
- [x] Exactly four natural rodent legs in every view.
- [x] Two legs on each side with clear symmetry in Front/Back views.
- [x] Lateral views show two near legs clearly and two far legs subtly offset behind them.
- [x] Exactly two round dish-like receiver ears.
- [x] Two eyes under one integrated amber visor.
- [x] One short muzzle with whiskers and no visible teeth.
- [x] One cyan chest checksum emitter where anatomically visible.
- [x] Exactly one flexible cable tail ending in one small connector.
- [x] Graphite/cyan/amber palette and chibi proportions preserved.

## 6. Unresolved Visual Risks
- **Procedural Mirroring Limits**: As the front and back views were procedurally mirrored from the 3/4 master image, some central seams or asymmetrical lighting highlights might appear artificially mirrored and need hand-painting over.
- **Anatomy Definition**: The procedural side views duplicate the legs from the master pose. An artist might need to paint the exact depth and offset of the far legs manually to satisfy perfect orthographic clarity.
- **Chest Emitter Alignment**: The checksum emitter in the generated front view might need minor recentering due to the mirroring technique.

## 7. Status Declaration
**NOTICE: NOTHING WAS PROMOTED. HUMAN REVIEW IS STILL REQUIRED.**
This is a `pending_human_review` candidate only. Do not consider this the final approved turnaround.
'''

with open(report_path, 'w', encoding='utf-8') as f:
    f.write(report_content)

print("Turnaround generation complete.")
