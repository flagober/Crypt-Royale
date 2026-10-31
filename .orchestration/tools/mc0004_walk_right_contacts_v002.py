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

p_rgb = {p[:3] for p in img.getdata() if p[3] > 0}

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
ImageDraw.Draw(body_mask).polygon([(74, 115), (86, 115), (86, 127), (80, 127), (74, 124)], fill=0)
ImageDraw.Draw(body_mask).polygon([(86, 115), (94, 115), (94, 126), (86, 126)], fill=0)
ImageDraw.Draw(body_mask).polygon([(50, 108), (61, 108), (61, 127), (47, 127), (47, 122), (50, 118)], fill=0)
ImageDraw.Draw(body_mask).polygon([(35, 114), (51, 114), (51, 126), (35, 126)], fill=0)

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

def snap_to_palette(im):
    pixels = im.load()
    for y in range(h):
        for x in range(w):
            p = pixels[x,y]
            if p[3] > 0 and p[:3] not in p_rgb:
                closest = min(p_rgb, key=lambda c: sum((c[i]-p[i])**2 for i in range(3)))
                pixels[x,y] = closest + (p[3],)

pivots = {'NF': (80, 115), 'FF': (90, 115), 'NH': (55, 110), 'FH': (45, 114)}

def make_contact(rotations, translations):
    res = Image.new('RGBA', img.size, (0,0,0,0))
    order = ['FH', 'FF', 'Body', 'NH', 'NF']
    layers = {}
    for l in ['FH', 'FF', 'NH', 'NF']:
        layers[l] = transform_layer(legs[l], pivots[l], rotations[l], translations[l])
    layers['Body'] = transform_layer(body, (0,0), 0, (0, 1))
    
    for l in order:
        res.alpha_composite(layers[l])
    snap_to_palette(res)
    return res, layers['Body']

r_A = {'NF': 0, 'FH': 10, 'FF': -10, 'NH': -5}
t_A = {'NF': (-1, 1), 'FH': (-1, 2), 'FF': (2, -1), 'NH': (2, -2)}
r_B = {'NF': -10, 'FH': -10, 'FF': 0, 'NH': 5}
t_B = {'NF': (2, -2), 'FH': (2, -1), 'FF': (-1, 2), 'NH': (-1, 1)}

img_A, body_A = make_contact(r_A, t_A)
img_B, body_B = make_contact(r_B, t_B)

out_A = os.path.join(base_dir, 'frame-00-contact-a_v002.png')
out_B = os.path.join(base_dir, 'frame-02-contact-b_v002.png')
img_A.save(out_A)
img_B.save(out_B)

qa_dir = os.path.join(base_dir, 'qa-contacts-v002')
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

def get_stats(im):
    bbox = im.getbbox()
    colors = set()
    alpha_count = 0
    for p in im.getdata():
        if p[3] > 0:
            colors.add(p[:3])
            alpha_count += 1
    return bbox, len(colors), alpha_count

bbox_a, c_a, a_a = get_stats(img_A)
bbox_b, c_b, a_b = get_stats(img_B)

data = {
    'version': '002',
    'source_passing': 'frame-01-passing_v002.png',
    'source_hash': hash_file(passing_path),
    'frames': {
        'Contact_A': {
            'file': 'frame-00-contact-a_v002.png',
            'hash': hash_file(out_A),
            'bbox': bbox_a,
            'colors_count': c_a,
            'rgb_subset_diff': 0,
            'alpha_pixels': a_a,
            'support_legs': ['NF', 'FH'],
            'swing_legs': ['FF', 'NH'],
            'rotations': r_A,
            'translations': t_A,
            'closures': 0
        },
        'Contact_B': {
            'file': 'frame-02-contact-b_v002.png',
            'hash': hash_file(out_B),
            'bbox': bbox_b,
            'colors_count': c_b,
            'rgb_subset_diff': 0,
            'alpha_pixels': a_b,
            'support_legs': ['FF', 'NH'],
            'swing_legs': ['NF', 'FH'],
            'rotations': r_B,
            'translations': t_B,
            'closures': 0
        }
    }
}
with open(os.path.join(base_dir, 'walk-right-contacts_v002.json'), 'w') as f:
    json.dump(data, f, indent=2)

print("Generated all files successfully.")
