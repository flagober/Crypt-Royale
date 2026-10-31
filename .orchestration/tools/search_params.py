import os
import math
from PIL import Image, ImageDraw

base_dir = r'E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\sprite-sheets\work\mc-0004\right'
passing_path = os.path.join(base_dir, 'frame-01-passing_v002.png')
img = Image.open(passing_path).convert('RGBA')

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

def transform_leg(leg_im, pivot, angle, translate=(0,0)):
    a = math.radians(angle)
    cos_inv = math.cos(-a)
    sin_inv = math.sin(-a)
    tx, ty = translate
    c = -cos_inv*(pivot[0]+tx) + sin_inv*(pivot[1]+ty) + pivot[0]
    f = -sin_inv*(pivot[0]+tx) - cos_inv*(pivot[1]+ty) + pivot[1]
    return leg_im.transform(leg_im.size, Image.AFFINE, (cos_inv, -sin_inv, c, sin_inv, cos_inv, f), resample=Image.NEAREST)

pivots = {'NF': (80, 115), 'FF': (90, 115), 'NH': (55, 110), 'FH': (45, 114)}

def make_contact(rotations, translations):
    res = Image.new('RGBA', img.size, (0,0,0,0))
    order = ['FH', 'FF', 'Body', 'NH', 'NF']
    layers = {}
    for l in ['FH', 'FF', 'NH', 'NF']:
        layers[l] = transform_leg(legs[l], pivots[l], rotations[l], translations[l])
    layers['Body'] = transform_leg(body, (0,0), 0, (0, 1))
    
    for l in order:
        res.alpha_composite(layers[l])
    return res

def get_closures(im):
    w, h = im.size
    pixels = im.load()
    closures = []
    for y in range(100, 130):
        for x in range(30, 100):
            if pixels[x, y][3] == 0:
                neighbors = [(x-1,y), (x+1,y), (x,y-1), (x,y+1)]
                opaque_neighbors = sum(1 for n in neighbors if 0<=n[0]<w and 0<=n[1]<h and pixels[n][3] > 0)
                if opaque_neighbors >= 3:
                    closures.append((x,y))
    return closures

def try_params(r, t, name):
    im = make_contact(r, t)
    cls = get_closures(im)
    if not cls:
        print(f"Success for {name}! rotations={r}, translations={t}")
    return len(cls) == 0

# Grid search for A
best_A = None
for nx in [0, -1, -2]:
    for hx in [0, -1, -2]:
        for nfx in [1, 2]:
            for hhx in [1, 2]:
                r = {'NF': 0, 'FH': 10, 'FF': -10, 'NH': -5}
                t = {'NF': (nx, 1), 'FH': (hx, 2), 'FF': (nfx, -1), 'NH': (hhx, -2)}
                if try_params(r, t, "A"):
                    best_A = (r, t)
                    break
            if best_A: break
        if best_A: break
    if best_A: break

# Grid search for B
best_B = None
for fx in [0, -1, -2]:
    for nhx in [0, -1, -2]:
        for nfx in [1, 2]:
            for fhx in [1, 2]:
                r = {'NF': -10, 'FH': -10, 'FF': 0, 'NH': 5}
                t = {'NF': (nfx, -2), 'FH': (fhx, -1), 'FF': (fx, 2), 'NH': (nhx, 1)}
                if try_params(r, t, "B"):
                    best_B = (r, t)
                    break
            if best_B: break
        if best_B: break
    if best_B: break

