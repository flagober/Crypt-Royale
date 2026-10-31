import os
import math
import json
import hashlib
from PIL import Image, ImageDraw

def hash_file(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        h.update(f.read())
    return h.hexdigest().upper()

passing_path = r'E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\sprite-sheets\work\mc-0004\right\frame-01-passing_v002.png'
img = Image.open(passing_path).convert('RGBA')
w, h = img.size

# Extract masks
def get_mask(poly):
    mask = Image.new('L', img.size, 0)
    ImageDraw.Draw(mask).polygon(poly, fill=255)
    return mask

# Improved polygons
nf_poly = [(74, 115), (86, 115), (86, 127), (80, 127), (74, 124)]
ff_poly = [(86, 115), (94, 115), (94, 126), (86, 126)]
nh_poly = [(52, 108), (61, 108), (61, 127), (47, 127), (47, 120), (52, 115)]
fh_poly = [(35, 114), (51, 114), (51, 126), (35, 126)]

# Actually, the right block of hind is 53..59, left is 42..50.
# So NH left edge is around 50 at y=110.
nh_poly = [(50, 108), (61, 108), (61, 127), (47, 127), (47, 122), (50, 118)]

masks = {
    'NF': get_mask(nf_poly),
    'FF': get_mask(ff_poly),
    'NH': get_mask(nh_poly),
    'FH': get_mask(fh_poly)
}

legs = {}
for name, mask in masks.items():
    leg = Image.new('RGBA', img.size, (0,0,0,0))
    leg.paste(img, (0,0), mask)
    legs[name] = leg

# Body is everything else
body_mask = Image.new('L', img.size, 255)
for m in masks.values():
    body_mask = Image.eval(body_mask, lambda p: p) # Need to subtract masks
    # actually better:
for name, mask in masks.items():
    ImageDraw.Draw(body_mask).bitmap((0,0), mask, fill=0)

body = Image.new('RGBA', img.size, (0,0,0,0))
body.paste(img, (0,0), body_mask)

# Rotator
def rotate_leg(leg_im, pivot, angle):
    a = math.radians(angle)
    cos_a = math.cos(a)
    sin_a = math.sin(a)
    c_inv = pivot[0] - pivot[0]*cos_a - pivot[1]*sin_a
    f_inv = pivot[1] + pivot[0]*sin_a - pivot[1]*cos_a
    return leg_im.transform(img.size, Image.AFFINE, (cos_a, sin_a, c_inv, -sin_a, cos_a, f_inv), resample=Image.NEAREST)

def get_max_y(im):
    bbox = im.getbbox()
    return bbox[3] - 1 if bbox else 0

pivots = {
    'NF': (80, 115),
    'FF': (90, 115),
    'NH': (55, 110),
    'FH': (45, 114)
}

def find_best_angle(leg_name, target_y_range, prefer_advanced=True):
    best_angle = None
    leg_im = legs[leg_name]
    pivot = pivots[leg_name]
    
    # search angles
    search_range = range(-45, 46) if prefer_advanced else range(45, -46, -1)
    
    for angle in search_range:
        r = rotate_leg(leg_im, pivot, angle)
        my = get_max_y(r)
        if my in target_y_range:
            return angle
            
    return 0

# Generate Contact A
# NF: 127, FH: 127
# FF: 123..125 (advanced -> negative angle)
# NH: 123..125 (advanced -> negative angle)
fh_a_angle = find_best_angle('FH', [127], prefer_advanced=False) # trailing
ff_a_angle = find_best_angle('FF', [123, 124, 125], prefer_advanced=True) # advanced
nh_a_angle = find_best_angle('NH', [123, 124, 125], prefer_advanced=True) # advanced

img_A = Image.new('RGBA', img.size, (0,0,0,0))
# Paste far legs first
img_A.paste(rotate_leg(legs['FH'], pivots['FH'], fh_a_angle), (0, 1))
img_A.paste(rotate_leg(legs['FF'], pivots['FF'], ff_a_angle), (0, 1), rotate_leg(legs['FF'], pivots['FF'], ff_a_angle))
img_A.paste(body, (0, 1), body)
img_A.paste(rotate_leg(legs['NH'], pivots['NH'], nh_a_angle), (0, 1), rotate_leg(legs['NH'], pivots['NH'], nh_a_angle))
img_A.paste(legs['NF'], (0, 1), legs['NF'])

# Generate Contact B
# FF: 127, NH: 127
# NF: 123..125 (advanced)
# FH: 123..125 (advanced)
ff_b_angle = find_best_angle('FF', [127], prefer_advanced=False) # trailing
nf_b_angle = find_best_angle('NF', [123, 124, 125], prefer_advanced=True) # advanced
fh_b_angle = find_best_angle('FH', [123, 124, 125], prefer_advanced=True) # advanced

img_B = Image.new('RGBA', img.size, (0,0,0,0))
img_B.paste(rotate_leg(legs['FH'], pivots['FH'], fh_b_angle), (0, 1))
img_B.paste(rotate_leg(legs['FF'], pivots['FF'], ff_b_angle), (0, 1), rotate_leg(legs['FF'], pivots['FF'], ff_b_angle))
img_B.paste(body, (0, 1), body)
img_B.paste(legs['NH'], (0, 1), legs['NH'])
img_B.paste(rotate_leg(legs['NF'], pivots['NF'], nf_b_angle), (0, 1), rotate_leg(legs['NF'], pivots['NF'], nf_b_angle))

scratch = r'C:\Users\familia\.gemini\antigravity-cli\brain\b012c3ef-fd58-4897-9caf-64583fd610bc\scratch'
img_A.save(os.path.join(scratch, 'Contact_A.png'))
img_B.save(os.path.join(scratch, 'Contact_B.png'))

print(f"Contact A angles: FH={fh_a_angle}, FF={ff_a_angle}, NH={nh_a_angle}")
print(f"Contact B angles: FF={ff_b_angle}, NF={nf_b_angle}, FH={fh_b_angle}")
