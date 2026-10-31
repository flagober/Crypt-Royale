import numpy as np
from PIL import Image
import cv2
import os

def process():
    master_path = r'E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\approved-masters\cr_mc-0007_code-slime_master_v001.png'
    img = Image.open(master_path).convert('RGBA')
    
    bbox = img.getbbox()
    cropped = img.crop(bbox)
    
    w, h = cropped.size
    scale = 460.0 / max(w, h)
    new_w, new_h = int(w * scale), int(h * scale)
    cropped = cropped.resize((new_w, new_h), Image.Resampling.NEAREST)
    
    arr = np.array(cropped)
    rgba = arr.astype(np.float32) / 255.0
    alpha = rgba[:, :, 3]
    
    r, g, b = rgba[:, :, 0], rgba[:, :, 1], rgba[:, :, 2]
    # Bright pixels for face (eyes and smile)
    face_mask = ((g > 0.6) & (b > 0.6) & (r > 0.3)).astype(np.uint8)
    
    kernel = np.ones((15, 15), np.uint8)
    face_mask_dilated = cv2.dilate(face_mask, kernel, iterations=2)
    
    y_indices, x_indices = np.indices(alpha.shape)
    face_mask_dilated[y_indices > new_h * 0.6] = 0
    face_mask_dilated[x_indices < new_w * 0.2] = 0
    face_mask_dilated[x_indices > new_w * 0.8] = 0
    
    rgb_8u = (rgba[:, :, :3] * 255).astype(np.uint8)
    inpainted_rgb = cv2.inpaint(rgb_8u, face_mask_dilated * 255, 15, cv2.INPAINT_TELEA)
    alpha_8u = (alpha * 255).astype(np.uint8)
    inpainted_rgba = np.dstack((inpainted_rgb, alpha_8u))
    
    _, binary = cv2.threshold(alpha_8u, 127, 255, cv2.THRESH_BINARY)
    dist = cv2.distanceTransform(binary, cv2.DIST_L2, 5)
    
    max_dist = np.max(dist)
    R = max_dist * 1.5
    D = np.clip(dist, 0, R)
    Z = np.sqrt(R**2 - (R - D)**2)
    Z = Z * 1.0
    
    def render_view(angle_deg, is_back=False):
        theta = np.radians(angle_deg)
        cos_t = np.cos(theta)
        sin_t = np.sin(theta)
        
        out_w, out_h = 512, 1024
        out_rgba = np.zeros((out_h, out_w, 4), dtype=np.uint8)
        z_buf = np.full((out_h, out_w), -10000.0)
        
        splat_size = 2
        y_offset = 850 - new_h
        
        for y in range(new_h):
            for x in range(new_w):
                if alpha[y, x] < 0.1:
                    continue
                    
                X = x - new_w / 2.0
                z_val = Z[y, x]
                
                # Front and back surfaces
                points = [(X, z_val, 'front'), (X, -z_val, 'back')]
                
                for X_orig, Z_orig, surf in points:
                    if surf == 'front':
                        color = rgb_8u[y, x]
                        if is_back:
                           color = inpainted_rgb[y, x]
                    else:
                        color = inpainted_rgb[y, x]
                        
                    a = alpha_8u[y, x]
                    
                    X_new = X_orig * cos_t + Z_orig * sin_t
                    Z_new = -X_orig * sin_t + Z_orig * cos_t
                    
                    u = int(X_new + out_w / 2.0)
                    v = int(y + y_offset)
                    
                    if 0 <= u < out_w and 0 <= v < out_h:
                        if Z_new > z_buf[v, u]:
                            z_buf[v, u] = Z_new
                            out_rgba[v, u, :3] = color
                            out_rgba[v, u, 3] = a
                            
                            for dy in range(-splat_size, splat_size+1):
                                for dx in range(-splat_size, splat_size+1):
                                    uu = u + dx
                                    vv = v + dy
                                    if 0 <= uu < out_w and 0 <= vv < out_h:
                                        if Z_new > z_buf[vv, uu]:
                                            z_buf[vv, uu] = Z_new
                                            out_rgba[vv, uu, :3] = color
                                            out_rgba[vv, uu, 3] = a
        return out_rgba

    front_img_exact = np.zeros((1024, 512, 4), dtype=np.uint8)
    y_offset = 850 - new_h
    x_offset = (512 - new_w) // 2
    exact_rgba = arr.astype(np.uint8)
    for y in range(new_h):
        for x in range(new_w):
            if exact_rgba[y, x, 3] > 0:
                front_img_exact[y + y_offset, x + x_offset] = exact_rgba[y, x]

    right_img = render_view(-90)
    left_img = render_view(90)
    
    back_img_exact = np.zeros((1024, 512, 4), dtype=np.uint8)
    inpainted_flipped = cv2.flip(inpainted_rgba, 1)
    for y in range(new_h):
        for x in range(new_w):
            if inpainted_flipped[y, x, 3] > 0:
                back_img_exact[y + y_offset, x + x_offset] = inpainted_flipped[y, x]

    os.makedirs(r'E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds\views', exist_ok=True)
    Image.fromarray(front_img_exact).save(r'E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds\views\cr_mc-0007_code-slime_v002_front.png')
    Image.fromarray(right_img).save(r'E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds\views\cr_mc-0007_code-slime_v002_right.png')
    Image.fromarray(left_img).save(r'E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds\views\cr_mc-0007_code-slime_v002_left.png')
    Image.fromarray(back_img_exact).save(r'E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds\views\cr_mc-0007_code-slime_v002_back.png')
    
    turnaround = np.zeros((1024, 2048, 4), dtype=np.uint8)
    turnaround[:, 0:512] = front_img_exact
    turnaround[:, 512:1024] = right_img
    turnaround[:, 1024:1536] = left_img
    turnaround[:, 1536:2048] = back_img_exact
    
    # Hide RGB where alpha is 0
    turnaround[turnaround[:, :, 3] == 0] = [0, 0, 0, 0]
    
    Image.fromarray(turnaround).save(r'E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds\cr_mc-0007_code-slime_turnaround_candidate_v002.png')

process()
print("Done!")
