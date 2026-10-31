import os
import json
import hashlib
from PIL import Image

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

def get_component_stats(img):
    comps = get_components(img)
    comps.sort(key=len, reverse=True)
    stats = []
    for c in comps:
        xs = [p[0] for p in c]
        ys = [p[1] for p in c]
        stats.append({
            "size": len(c),
            "bbox": [min(xs), min(ys), max(xs)+1, max(ys)+1]
        })
    return stats

def main():
    base_dir = r"E:\Projetos\MonsterCrypt\Crypt-Royale"
    turnaround_path = os.path.join(base_dir, r"art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_v001.png")
    work_dir = os.path.join(base_dir, r"art-source\sprite-sheets\work\mc-0004")
    qa_dir = os.path.join(work_dir, "qa-v002")
    
    for d in ['front', 'right', 'left', 'back']:
        os.makedirs(os.path.join(work_dir, d), exist_ok=True)
    os.makedirs(qa_dir, exist_ok=True)

    img = Image.open(turnaround_path).convert('RGBA')
    source_cells = {
        'front': img.crop((0, 0, 512, 1024)),
        'right': img.crop((512, 0, 1024, 1024)),
        'back': img.crop((1536, 0, 2048, 1024))
    }
    
    scale = 0.2636
    params = {
        'front': (-4, -4),
        'right': (-3, 0),
        'back': (-4, -4)
    }
    
    raw_cells = {}
    for view in ['front', 'right', 'back']:
        dx, dy = params[view]
        shifted = Image.new("RGBA", (512, 1024), (0,0,0,0))
        shifted.paste(source_cells[view], (dx, dy))
        scaled = shifted.resize((int(512 * scale), int(1024 * scale)), Image.NEAREST)
        
        bbox = scaled.getbbox()
        paste_x = 3
        paste_y = 128 - bbox[3]
        
        cell = Image.new("RGBA", (140, 140), (0,0,0,0))
        cell.paste(scaled, (paste_x, paste_y))
        raw_cells[view] = cell
        
    # Combine for quantization
    combined = Image.new("RGBA", (140 * 3, 140))
    combined.paste(raw_cells['front'], (0, 0))
    combined.paste(raw_cells['right'], (140, 0))
    combined.paste(raw_cells['back'], (280, 0))
    
    rgb_img = combined.convert('RGB')
    quantized_rgb = rgb_img.quantize(colors=256, dither=Image.Dither.NONE).convert('RGB')
    
    alphas = [p[3] for p in combined.getdata()]
    result_data = []
    for (r, g, b), a in zip(quantized_rgb.getdata(), alphas):
        if a == 0:
            result_data.append((0, 0, 0, 0))
        else:
            result_data.append((r, g, b, a))
            
    final_combined = Image.new("RGBA", combined.size)
    final_combined.putdata(result_data)
    
    finished_cells = {}
    finished_cells['front'] = final_combined.crop((0, 0, 140, 140))
    finished_cells['right'] = final_combined.crop((140, 0, 280, 140))
    finished_cells['back'] = final_combined.crop((280, 0, 420, 140))
    finished_cells['left'] = finished_cells['right'].transpose(Image.FLIP_LEFT_RIGHT)
    
    views = ['front', 'right', 'left', 'back']
    
    # Save palette
    visible_colors = list(set((r,g,b) for r,g,b,a in result_data if a > 0))
    visible_rgb_count = len(visible_colors)
    while len(visible_colors) < 256:
        visible_colors.append((0,0,0))
    palette_img = Image.new("RGB", (16, 16))
    palette_img.putdata(visible_colors[:256])
    palette_img.save(os.path.join(qa_dir, "data-mouse-palette-v002.png"))
    
    report_data = {
        "turnaround_sha256": hash_file(turnaround_path),
        "shared_scale": scale,
        "cell_dimensions": [140, 140],
        "pivot": [70, 128],
        "baseline_y": 127,
        "visible_rgb_count": visible_rgb_count,
        "mapping": {
            "front": "down",
            "right": "right",
            "left": "left",
            "back": "up"
        },
        "sampling_phase": params,
        "views": {}
    }
    
    # Reverse-flip diff check
    diff_count = 0
    rf = finished_cells['right'].transpose(Image.FLIP_LEFT_RIGHT)
    for p1, p2 in zip(rf.getdata(), finished_cells['left'].getdata()):
        if p1 != p2:
            diff_count += 1
    report_data["reverse_flip_diff_count"] = diff_count
    
    for view in views:
        cell = finished_cells[view]
        cell_path = os.path.join(work_dir, view, "frame-01-passing_v002.png")
        cell.save(cell_path)
        
        # QA previews
        bg_white = Image.new("RGBA", (140, 140), (255,255,255,255))
        bg_white.paste(cell, (0,0), cell)
        bg_white.save(os.path.join(qa_dir, f"{view}_white.png"))
        
        bg_magenta = Image.new("RGBA", (140, 140), (255,0,255,255))
        bg_magenta.paste(cell, (0,0), cell)
        bg_magenta.save(os.path.join(qa_dir, f"{view}_magenta.png"))
        
        bg_dark = Image.new("RGBA", (140, 140), (34,34,34,255))
        bg_dark.paste(cell, (0,0), cell)
        bg_dark.save(os.path.join(qa_dir, f"{view}_dark.png"))
        
        cell.resize((560, 560), Image.NEAREST).save(os.path.join(qa_dir, f"{view}_4x.png"))
        cell.resize((1120, 1120), Image.NEAREST).save(os.path.join(qa_dir, f"{view}_8x.png"))
        
        # Stats
        bbox = cell.getbbox()
        alphas_cell = [p[3] for p in cell.getdata()]
        alpha_counts = {
            "alpha_0": sum(1 for a in alphas_cell if a == 0),
            "alpha_255": sum(1 for a in alphas_cell if a == 255),
            "alpha_intermediate": sum(1 for a in alphas_cell if 0 < a < 255)
        }
        
        report_data["views"][view] = {
            "sha256": hash_file(cell_path),
            "bbox": bbox,
            "components": get_component_stats(cell),
            "alpha_counts": alpha_counts
        }
        
    comp_img = Image.new("RGBA", (140*4, 140))
    for i, view in enumerate(views):
        comp_img.paste(finished_cells[view], (i*140, 0))
    comp_img.save(os.path.join(qa_dir, "comparison_4dir.png"))
    
    with open(os.path.join(qa_dir, "neutral-frames_v002.json"), "w") as f:
        json.dump(report_data, f, indent=4)
        
    print("V002 generation complete. Reverse-flip diff:", diff_count)

if __name__ == '__main__':
    main()
