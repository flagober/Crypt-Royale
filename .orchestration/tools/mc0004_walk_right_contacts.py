import os
import math
import json
import hashlib
from PIL import Image, ImageDraw, ImageChops, ImageSequence

def hash_img(im):
    h = hashlib.sha256()
    h.update(im.tobytes())
    return h.hexdigest().upper()

def hash_file(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        h.update(f.read())
    return h.hexdigest().upper()

base_dir = r'E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\sprite-sheets\work\mc-0004\right'
passing_path = os.path.join(base_dir, 'frame-01-passing_v002.png')
img = Image.open(passing_path).convert('RGBA')
w, h = img.size

# Extract masks with 3-pixel upward extension to hide seams under the body
nf_poly = [(74, 112), (86, 112), (86, 127), (80, 127), (74, 124)]
ff_poly = [(86, 112), (94, 112), (94, 126), (86, 126)]
nh_poly = [(50, 105), (61, 105), (61, 127), (47, 127), (47, 122), (50, 118)]
fh_poly = [(35, 111), (51, 111), (51, 126), (35, 126)]

def get_mask(poly):
    mask = Image.new('L', img.size, 0)
    ImageDraw.Draw(mask).polygon(poly, fill=255)
    return mask

masks = {'NF': get_mask(nf_poly), 'FF': get_mask(ff_poly), 'NH': get_mask(nh_poly), 'FH': get_mask(fh_poly)}

legs = {}
for name, mask in masks.items():
    leg = Image.new('RGBA', img.size, (0,0,0,0))
    leg.paste(img, (0,0), mask)
    legs[name] = leg

body_mask = Image.new('L', img.size, 255)
# Use the unextended polygons to cut out the body so holes aren't too big
ImageDraw.Draw(body_mask).polygon([(74, 115), (86, 115), (86, 127), (80, 127), (74, 124)], fill=0)
ImageDraw.Draw(body_mask).polygon([(86, 115), (94, 115), (94, 126), (86, 126)], fill=0)
ImageDraw.Draw(body_mask).polygon([(50, 108), (61, 108), (61, 127), (47, 127), (47, 122), (50, 118)], fill=0)
ImageDraw.Draw(body_mask).polygon([(35, 114), (51, 114), (51, 126), (35, 126)], fill=0)

body = Image.new('RGBA', img.size, (0,0,0,0))
body.paste(img, (0,0), body_mask)

def rotate_leg(leg_im, pivot, angle):
    a = math.radians(angle)
    cos_a = math.cos(a)
    sin_a = math.sin(a)
    c_inv = pivot[0] - pivot[0]*cos_a - pivot[1]*sin_a
    f_inv = pivot[1] + pivot[0]*sin_a - pivot[1]*cos_a
    return leg_im.transform(img.size, Image.AFFINE, (cos_a, sin_a, c_inv, -sin_a, cos_a, f_inv), resample=Image.NEAREST)

pivots = {'NF': (80, 115), 'FF': (90, 115), 'NH': (55, 110), 'FH': (45, 114)}

# Contact A
img_A = Image.new('RGBA', img.size, (0,0,0,0))
fh_a = rotate_leg(legs['FH'], pivots['FH'], 10)
img_A.paste(fh_a, (0, 1), fh_a)
ff_a = rotate_leg(legs['FF'], pivots['FF'], -10)
img_A.paste(ff_a, (0, 0), ff_a)
nh_a = rotate_leg(legs['NH'], pivots['NH'], -5)
img_A.paste(nh_a, (0, -2), nh_a)
nf_a = legs['NF']
img_A.paste(nf_a, (0, 1), nf_a)
img_A.paste(body, (0, 1), body)

# Contact B
img_B = Image.new('RGBA', img.size, (0,0,0,0))
fh_b = rotate_leg(legs['FH'], pivots['FH'], -10)
img_B.paste(fh_b, (0, 0), fh_b)
ff_b = rotate_leg(legs['FF'], pivots['FF'], 15)
img_B.paste(ff_b, (0, 1), ff_b)
nh_b = legs['NH']
img_B.paste(nh_b, (0, 1), nh_b)
nf_b = rotate_leg(legs['NF'], pivots['NF'], -10)
img_B.paste(nf_b, (0, -2), nf_b)
img_B.paste(body, (0, 1), body)

# Check and fix single-pixel joint closures just in case
def fix_1px_gap(im, bg_color=(0,0,0,0)):
    # Simple check for any internal transparent pixels surrounded by opaque ones
    pixels = im.load()
    closures = []
    for y in range(112, 118):
        for x in range(30, 95):
            if pixels[x, y][3] == 0:
                neighbors = [(x-1,y), (x+1,y), (x,y-1), (x,y+1)]
                opaque_neighbors = [n for n in neighbors if 0<=n[0]<w and 0<=n[1]<h and pixels[n][3] > 0]
                if len(opaque_neighbors) >= 3:
                    # Fill with the color of the pixel above it
                    pixels[x, y] = pixels[x, y-1]
                    closures.append((x,y))
    return closures

closures_A = fix_1px_gap(img_A)
closures_B = fix_1px_gap(img_B)

out_A = os.path.join(base_dir, 'frame-00-contact-a_v001.png')
out_B = os.path.join(base_dir, 'frame-02-contact-b_v001.png')
img_A.save(out_A)
img_B.save(out_B)

# QA files
qa_dir = os.path.join(base_dir, 'qa-contacts-v001')
os.makedirs(qa_dir, exist_ok=True)

# Sequence GIF
frames = [img_A, img, img_B, img]
frames[0].save(os.path.join(qa_dir, 'sequence.gif'), save_all=True, append_images=frames[1:], duration=200, loop=0, disposal=2)

def make_qa(suffix, bg_color):
    for name, f in [('A', img_A), ('B', img_B)]:
        bg = Image.new('RGBA', img.size, bg_color)
        bg.paste(f, (0,0), f)
        bg.save(os.path.join(qa_dir, f'{name}_{suffix}.png'))
        bg.resize((w*4, h*4), Image.NEAREST).save(os.path.join(qa_dir, f'{name}_{suffix}_4x.png'))

make_qa('magenta', (255, 0, 255, 255))
make_qa('dark', (30, 30, 30, 255))
make_qa('white', (255, 255, 255, 255))

# Side by side
sbs = Image.new('RGBA', (w*2, h))
sbs.paste(img_A, (0,0))
sbs.paste(img_B, (w,0))
sbs.save(os.path.join(qa_dir, 'side_by_side.png'))

# JSON
def get_stats(im):
    bbox = im.getbbox()
    colors = set()
    alpha_count = 0
    for y in range(h):
        for x in range(w):
            c = im.getpixel((x,y))
            if c[3] > 0:
                colors.add(c)
                alpha_count += 1
    return bbox, len(colors), alpha_count

bbox_a, c_a, a_a = get_stats(img_A)
bbox_b, c_b, a_b = get_stats(img_B)

data = {
    'version': '001',
    'source_passing': 'frame-01-passing_v002.png',
    'frames': {
        'Contact_A': {
            'file': 'frame-00-contact-a_v001.png',
            'hash': hash_file(out_A),
            'bbox': bbox_a,
            'colors_count': c_a,
            'alpha_pixels': a_a,
            'support_legs': ['NF', 'FH'],
            'swing_legs': ['FF', 'NH'],
            'rotations': {'NF': 0, 'FH': 10, 'FF': -10, 'NH': -5},
            'translations': {'NF': (0,1), 'FH': (0,1), 'FF': (0,0), 'NH': (0,-2)},
            'closures': closures_A
        },
        'Contact_B': {
            'file': 'frame-02-contact-b_v001.png',
            'hash': hash_file(out_B),
            'bbox': bbox_b,
            'colors_count': c_b,
            'alpha_pixels': a_b,
            'support_legs': ['FF', 'NH'],
            'swing_legs': ['NF', 'FH'],
            'rotations': {'FF': 15, 'NH': 0, 'NF': -10, 'FH': -10},
            'translations': {'FF': (0,1), 'NH': (0,1), 'NF': (0,-2), 'FH': (0,0)},
            'closures': closures_B
        }
    }
}
with open(os.path.join(base_dir, 'walk-right-contacts_v001.json'), 'w') as f:
    json.dump(data, f, indent=2)

print("Generated all files successfully.")
