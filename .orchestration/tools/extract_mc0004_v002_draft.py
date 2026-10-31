import os
import json
import hashlib
from PIL import Image
from collections import Counter

def hash_file(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        h.update(f.read())
    return h.hexdigest()

def get_components(img):
    w, h = img.size
    data = img.load()
    visited = set()
    components = []
    for y in range(h):
        for x in range(w):
            if data[x, y][3] > 0 and (x, y) not in visited:
                comp = []
                q = [(x, y)]
                visited.add((x, y))
                while q:
                    cx, cy = q.pop(0)
                    comp.append((cx, cy))
                    for dx in [-1, 0, 1]:
                        for dy in [-1, 0, 1]:
                            if dx == 0 and dy == 0: continue
                            nx, ny = cx + dx, cy + dy
                            if 0 <= nx < w and 0 <= ny < h:
                                if data[nx, ny][3] > 0 and (nx, ny) not in visited:
                                    visited.add((nx, ny))
                                    q.append((nx, ny))
                components.append(comp)
    return components

def test_scale_phase(cell_img, scale, dx, dy):
    w, h = cell_img.size
    shifted = Image.new("RGBA", (w, h), (0,0,0,0))
    shifted.paste(cell_img, (dx, dy))
    scaled = shifted.resize((int(w * scale), int(h * scale)), Image.NEAREST)
    return scaled

def evaluate_view(cell_img, scale, dx, dy):
    scaled = test_scale_phase(cell_img, scale, dx, dy)
    bbox = scaled.getbbox()
    if not bbox:
        return None
    bw = bbox[2] - bbox[0]
    bh = bbox[3] - bbox[1]
    if bw > 116 or bh > 110:
        return None
    
    comps = get_components(scaled)
    return len(comps), scaled, bbox

def process():
    base_dir = r"E:\Projetos\MonsterCrypt\Crypt-Royale"
    turnaround_path = os.path.join(base_dir, r"art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_v001.png")
    
    img = Image.open(turnaround_path).convert('RGBA')
    views = ['front', 'right', 'left', 'back']
    source_cells = {}
    for i, view in enumerate(views):
        source_cells[view] = img.crop((i*512, 0, (i+1)*512, 1024))
        
    process_views = ['front', 'right', 'back']
    scale_steps = [s / 10000.0 for s in range(2636, 2400, -1)]
    
    best_scale = None
    best_params = {}
    
    for scale in scale_steps:
        works_for_all = True
        view_results = {}
        max_pad = int(1.0 / scale) + 1
        
        for view in process_views:
            cell_img = source_cells[view]
            best_view_comps = float('inf')
            best_view_result = None
            
            for dx in range(-max_pad, max_pad + 1):
                for dy in range(-max_pad, max_pad + 1):
                    res = evaluate_view(cell_img, scale, dx, dy)
                    if res:
                        num_comps, scaled, bbox = res
                        if num_comps < best_view_comps:
                            best_view_comps = num_comps
                            best_view_result = (dx, dy, scaled, bbox, num_comps)
            
            if best_view_result is None:
                works_for_all = False
                break
                
            view_results[view] = best_view_result
            
        if works_for_all:
            # Let's say we found a scale that fits bounds
            best_scale = scale
            for v in process_views:
                best_params[v] = view_results[v]
            break
            
    print(f"Best scale: {best_scale}")
    if best_scale:
        for v in process_views:
            print(f"{v}: {best_params[v][4]} comps, dx={best_params[v][0]}, dy={best_params[v][1]}")

process()
