import os
from PIL import Image
import math

passing_path = r'E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\sprite-sheets\work\mc-0004\right\frame-01-passing_v002.png'
img = Image.open(passing_path).convert('RGBA')

# We need the full un-cut legs. My previous extraction cut NH too flat.
# Let's extract the legs perfectly. I will just define polygons for the legs.
# For near legs, they are in front, so polygon covers them exactly.
nh_poly = [(42, 108), (56, 108), (61, 127), (47, 127)]
nf_poly = [(74, 115), (86, 115), (86, 127), (80, 127), (74, 124)]

def extract_poly(im, poly):
    mask = Image.new('L', im.size, 0)
    from PIL import ImageDraw
    ImageDraw.Draw(mask).polygon(poly, fill=255)
    res = Image.new('RGBA', im.size, (0,0,0,0))
    res.paste(im, (0,0), mask)
    return res

nh_leg = extract_poly(img, nh_poly)

# Let's see if rotating nh_leg around (53, 110) changes its maxY.
# We will rotate the image around the pivot.
def rotate_leg(leg_img, pivot, angle):
    # translate pivot to center
    # rotate
    # translate back
    # But PIL rotate rotates around center.
    # We can use affine transform.
    import math
    a = math.radians(angle)
    cos_a = math.cos(a)
    sin_a = math.sin(a)
    # Affine matrix:
    # x' = a*x + b*y + c
    # y' = d*x + e*y + f
    # to rotate around px, py:
    # x' - px = cos(x-px) - sin(y-py) => x' = cos*x - sin*y + px - px*cos + py*sin
    c_val = pivot[0] - pivot[0]*cos_a + pivot[1]*sin_a
    f_val = pivot[1] - pivot[0]*sin_a - pivot[1]*cos_a
    # PIL expects inverse transform
    # The inverse of rotation is rotation by -a
    cos_inv = math.cos(-a)
    sin_inv = math.sin(-a)
    c_inv = pivot[0] - pivot[0]*cos_inv + pivot[1]*sin_inv
    f_inv = pivot[1] - pivot[0]*sin_inv - pivot[1]*cos_inv
    
    return leg_img.transform(leg_img.size, Image.AFFINE, (cos_inv, -sin_inv, c_inv, sin_inv, cos_inv, f_inv), resample=Image.NEAREST)

os.makedirs(r'C:\Users\familia\.gemini\antigravity-cli\brain\b012c3ef-fd58-4897-9caf-64583fd610bc\scratch', exist_ok=True)
out = Image.new('RGBA', (140*5, 140))
for i, angle in enumerate([-20, -10, 0, 10, 20]):
    r = rotate_leg(nh_leg, (53, 110), angle)
    out.paste(r, (i*140, 0))

out.save(r'C:\Users\familia\.gemini\antigravity-cli\brain\b012c3ef-fd58-4897-9caf-64583fd610bc\scratch\rotations.png')

