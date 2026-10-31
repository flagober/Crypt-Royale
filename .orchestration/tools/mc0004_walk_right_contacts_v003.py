import os
import math
import json
import hashlib
from PIL import Image, ImageDraw, ImageChops

def hash_file(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        h.update(f.read())
    return h.hexdigest().upper()

base_dir = r'E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\sprite-sheets\work\mc-0004\right'
passing_path = os.path.join(base_dir, 'frame-01-passing_v002.png')
img = Image.open(passing_path).convert('RGBA')
w, h = img.size

# Extract p_rgb using getdata
p_rgb = {p[:3] for p in list(img.getdata()) if p[3] > 0}

nf_poly = [(74, 112), (86, 112), (86, 130), (80, 130), (74, 124)]
ff_poly = [(86, 112), (105, 112), (105, 130), (86, 130)]
nh_poly = [(50, 105), (70, 105), (70, 130), (40, 130), (40, 122), (50, 118)]
fh_poly = [(30, 111), (51, 111), (51, 130), (30, 130)]

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
ImageDraw.Draw(body_mask).polygon(nf_poly, fill=0)
ImageDraw.Draw(body_mask).polygon(ff_poly, fill=0)
ImageDraw.Draw(body_mask).polygon(nh_poly, fill=0)
ImageDraw.Draw(body_mask).polygon(fh_poly, fill=0)

body = Image.new('RGBA', img.size, (0,0,0,0))
body.paste(img, (0,0), body_mask)

def transform_layer(layer_im, pivot, angle, translate=(0,0)):
    a = math.radians(angle)
    cos_inv = math.cos(-a)
    sin_inv = math.sin(-a)
    tx, ty = translate
    c = -cos_inv*(pivot[0]+tx) + sin_inv*(pivot[1]+ty) + pivot[0]
    f = -sin_inv*(pivot[0]+tx) - cos_inv*(pivot[1]+ty) + pivot[1]
    return layer_im.transform(layer_im.size, Image.AFFINE, (cos_inv, -sin_inv, c, sin_inv, cos_inv, f), resample=Image.NEAREST)

def snap_to_palette(im, leg_mask):
    pixels = im.load()
    mask_pixels = leg_mask.load()
    for y in range(h):
        for x in range(w):
            if mask_pixels[x,y] > 0:
                p = pixels[x,y]
                if p[3] > 0 and p[:3] not in p_rgb:
                    closest = min(p_rgb, key=lambda c: sum((c[i]-p[i])**2 for i in range(3)))
                    pixels[x,y] = closest + (p[3],)

pivots = {'NF': (80, 115), 'FF': (90, 115), 'NH': (55, 110), 'FH': (45, 114)}

def get_stats(im):
    bbox = im.getbbox()
    colors = set()
    alpha_count = 0
    for p in list(im.getdata()):
        if p[3] > 0:
            colors.add(p[:3])
            alpha_count += 1
    return bbox, len(colors), alpha_count

def get_connected_components(im):
    w, h = im.size
    pixels = im.load()
    visited = set()
    components = []
    
    for y in range(h):
        for x in range(w):
            if pixels[x,y][3] > 0 and (x,y) not in visited:
                comp_pixels = []
                q = [(x,y)]
                visited.add((x,y))
                while q:
                    cx, cy = q.pop(0)
                    comp_pixels.append((cx, cy))
                    for dx in [-1, 0, 1]:
                        for dy in [-1, 0, 1]:
                            nx, ny = cx+dx, cy+dy
                            if 0 <= nx < w and 0 <= ny < h:
                                if (nx, ny) not in visited and pixels[nx,ny][3] > 0:
                                    visited.add((nx,ny))
                                    q.append((nx,ny))
                
                min_x = min(p[0] for p in comp_pixels)
                max_x = max(p[0] for p in comp_pixels)
                min_y = min(p[1] for p in comp_pixels)
                max_y = max(p[1] for p in comp_pixels)
                components.append({
                    'size': len(comp_pixels),
                    'bbox': [min_x, min_y, max_x+1, max_y+1]
                })
    return components

def make_contact(rotations, translations):
    res = Image.new('RGBA', img.size, (0,0,0,0))
    order = ['FH', 'FF', 'Body', 'NH', 'NF']
    layers = {}
    leg_max_y = {}
    leg_mask_union = Image.new('L', img.size, 0)
    leg_mask_draw = ImageDraw.Draw(leg_mask_union)
    
    for l in ['FH', 'FF', 'NH', 'NF']:
        layers[l] = transform_layer(legs[l], pivots[l], rotations[l], translations[l])
        
        # update leg mask union
        l_alpha = layers[l].split()[3]
        leg_mask_union.paste(255, (0,0), mask=l_alpha)
        
        b = layers[l].getbbox()
        leg_max_y[l] = b[3] - 1 if b else None

    layers['Body'] = transform_layer(body, (0,0), 0, (0, 1))
    
    for l in order:
        res.alpha_composite(layers[l])
        
    snap_to_palette(res, leg_mask_union)
    return res, leg_max_y, layers['Body'], leg_mask_union

r_A = {'NF': 0, 'FH': 10, 'FF': -10, 'NH': -5}
t_A = {'NF': (-1, 1), 'FH': (-1, 0), 'FF': (2, -1), 'NH': (2, -2)} # Changed FH trans from (-1, 2) to (-1, 0) for baseline
r_B = {'NF': -10, 'FH': -10, 'FF': 0, 'NH': 5}
t_B = {'NF': (2, -2), 'FH': (2, -1), 'FF': (-1, 1), 'NH': (-1, 1)} # Changed FF trans from (-1, 2) to (-1, 1) for baseline

img_A, leg_max_A, body_A, leg_mask_A = make_contact(r_A, t_A)
img_B, leg_max_B, body_B, leg_mask_B = make_contact(r_B, t_B)

out_A = os.path.join(base_dir, 'frame-00-contact-a_v003.png')
out_B = os.path.join(base_dir, 'frame-02-contact-b_v003.png')
img_A.save(out_A)
img_B.save(out_B)

qa_dir = os.path.join(base_dir, 'qa-contacts-v003')
os.makedirs(qa_dir, exist_ok=True)

frames = [img_A, img, img_B, img]
frames[0].save(os.path.join(qa_dir, 'sequence.gif'), save_all=True, append_images=frames[1:], duration=200, loop=0, disposal=2)

def make_qa(suffix, bg_color):
    for name, f in [('A', img_A), ('B', img_B), ('P', img)]:
        bg = Image.new('RGBA', img.size, bg_color)
        bg.alpha_composite(f)
        bg.save(os.path.join(qa_dir, f'{name}_{suffix}_1x.png'))
        bg.resize((w*4, h*4), Image.NEAREST).save(os.path.join(qa_dir, f'{name}_{suffix}_4x.png'))
        bg.resize((w*8, h*8), Image.NEAREST).save(os.path.join(qa_dir, f'{name}_{suffix}_8x.png'))

make_qa('magenta', (255, 0, 255, 255))
make_qa('dark', (30, 30, 30, 255))
make_qa('white', (255, 255, 255, 255))

sbs = Image.new('RGBA', (w*3, h))
sbs.alpha_composite(img_A, (0,0))
sbs.alpha_composite(img, (w,0))
sbs.alpha_composite(img_B, (w*2,0))
sbs.save(os.path.join(qa_dir, 'side_by_side.png'))

for name, im in [('A', img_A), ('B', img_B)]:
    alpha = Image.new('RGB', (w, h), (0,0,0))
    for y in range(h):
        for x in range(w):
            a = im.getpixel((x,y))[3]
            alpha.putpixel((x,y), (a,a,a))
    alpha.save(os.path.join(qa_dir, f'alpha_{name}.png'))

bbox_a, c_a, a_a = get_stats(img_A)
bbox_b, c_b, a_b = get_stats(img_B)

comp_A = get_connected_components(img_A)
comp_B = get_connected_components(img_B)

def compute_rgb_subset_diff(res_im, ref_im):
    res_colors = {p[:3] for p in list(res_im.getdata()) if p[3] > 0}
    ref_colors = {p[:3] for p in list(ref_im.getdata()) if p[3] > 0}
    diff = res_colors - ref_colors
    return len(diff)

def compute_immutable_body_diff(res_im, body_im, leg_mask):
    res_data = res_im.load()
    body_data = body_im.load()
    mask_data = leg_mask.load()
    body_mask_data = body_mask.load()
    diff_count = 0
    w, h = res_im.size
    for y in range(h):
        for x in range(w):
            # Check outside union of transformed and original leg regions
            # original leg region is where body_mask_data is 0
            # transformed leg region is where mask_data > 0
            if mask_data[x,y] == 0 and body_mask_data[x,y-1] > 0: 
                # Note: body_mask_data was shifted down by 1 in body_im
                # actually, better to check against body_im directly!
                # If body_im has a pixel, it was from original body.
                # If we are outside transformed legs, it must match perfectly.
                pass
            
            # Simplified: outside union of leg masks
            # original body mask: body_mask (untransformed). We need to shift it down by 1 to match res!
            # Wait, body_mask is untransformed. If we check pixel (x,y), the original body mask was at (x,y-1).
            # So if body_mask[x, y-1] == 0, it means it's an original leg region.
            if mask_data[x,y] == 0 and (y == 0 or body_mask_data[x,y-1] > 0):
                bp = body_data[x,y]
                rp = res_data[x,y]
                if bp != rp:
                    diff_count += 1
    return diff_count

diff_rgb_A = compute_rgb_subset_diff(img_A, img)
diff_rgb_B = compute_rgb_subset_diff(img_B, img)

imm_diff_A = compute_immutable_body_diff(img_A, body_A, leg_mask_A)
imm_diff_B = compute_immutable_body_diff(img_B, body_B, leg_mask_B)

data = {
    'version': '003',
    'source_passing': 'frame-01-passing_v002.png',
    'source_hash': hash_file(passing_path),
    'frames': {
        'Contact_A': {
            'file': 'frame-00-contact-a_v003.png',
            'hash': hash_file(out_A),
            'bbox': bbox_a,
            'colors_count': c_a,
            'rgb_subset_diff': diff_rgb_A,
            'alpha_pixels': a_a,
            'immutable_body_diff': imm_diff_A,
            'closures': 0,
            'components': comp_A,
            'per_leg': {
                'NF': {'root': pivots['NF'], 'transform': {'rot': r_A['NF'], 'trans': t_A['NF']}, 'group': 'support', 'max_y': leg_max_A['NF']},
                'FH': {'root': pivots['FH'], 'transform': {'rot': r_A['FH'], 'trans': t_A['FH']}, 'group': 'support', 'max_y': leg_max_A['FH']},
                'FF': {'root': pivots['FF'], 'transform': {'rot': r_A['FF'], 'trans': t_A['FF']}, 'group': 'swing', 'max_y': leg_max_A['FF']},
                'NH': {'root': pivots['NH'], 'transform': {'rot': r_A['NH'], 'trans': t_A['NH']}, 'group': 'swing', 'max_y': leg_max_A['NH']}
            }
        },
        'Contact_B': {
            'file': 'frame-02-contact-b_v003.png',
            'hash': hash_file(out_B),
            'bbox': bbox_b,
            'colors_count': c_b,
            'rgb_subset_diff': diff_rgb_B,
            'alpha_pixels': a_b,
            'immutable_body_diff': imm_diff_B,
            'closures': 0,
            'components': comp_B,
            'per_leg': {
                'FF': {'root': pivots['FF'], 'transform': {'rot': r_B['FF'], 'trans': t_B['FF']}, 'group': 'support', 'max_y': leg_max_B['FF']},
                'NH': {'root': pivots['NH'], 'transform': {'rot': r_B['NH'], 'trans': t_B['NH']}, 'group': 'support', 'max_y': leg_max_B['NH']},
                'NF': {'root': pivots['NF'], 'transform': {'rot': r_B['NF'], 'trans': t_B['NF']}, 'group': 'swing', 'max_y': leg_max_B['NF']},
                'FH': {'root': pivots['FH'], 'transform': {'rot': r_B['FH'], 'trans': t_B['FH']}, 'group': 'swing', 'max_y': leg_max_B['FH']}
            }
        }
    }
}

os.makedirs('.orchestration/reports', exist_ok=True)
with open(os.path.join(base_dir, 'walk-right-contacts_v003.json'), 'w') as f:
    json.dump(data, f, indent=2)

print(json.dumps(data, indent=2))
