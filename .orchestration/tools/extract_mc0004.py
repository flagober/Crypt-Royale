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

def count_components(img):
    w, h = img.size
    data = img.load()
    visited = set()
    components = 0
    for y in range(h):
        for x in range(w):
            if data[x, y][3] > 0 and (x, y) not in visited:
                components += 1
                q = [(x, y)]
                visited.add((x, y))
                while q:
                    cx, cy = q.pop(0)
                    for dx in [-1, 0, 1]:
                        for dy in [-1, 0, 1]:
                            if dx == 0 and dy == 0: continue
                            nx, ny = cx + dx, cy + dy
                            if 0 <= nx < w and 0 <= ny < h:
                                if data[nx, ny][3] > 0 and (nx, ny) not in visited:
                                    visited.add((nx, ny))
                                    q.append((nx, ny))
    return components

def main():
    base_dir = r"E:\Projetos\MonsterCrypt\Crypt-Royale"
    turnaround_path = os.path.join(base_dir, r"art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_v001.png")
    work_dir = os.path.join(base_dir, r"art-source\sprite-sheets\work\mc-0004")
    
    # Create dirs
    for d in ['front', 'right', 'left', 'back', 'qa']:
        os.makedirs(os.path.join(work_dir, d), exist_ok=True)

    img = Image.open(turnaround_path).convert('RGBA')
    w, h = img.size
    
    # Scale by 0.25 (shared factor)
    scale = 0.25
    scaled = img.resize((int(w * scale), int(h * scale)), Image.NEAREST)
    
    # Quantize to 256 colors
    rgb_img = scaled.convert('RGB')
    quantized_rgb = rgb_img.quantize(colors=256, dither=Image.Dither.NONE).convert('RGB')
    
    result_data = []
    # getdata in Pillow 14 is get_flattened_data, but we will just use getdata
    alphas = [p[3] for p in scaled.getdata()]
    for (r, g, b), a in zip(quantized_rgb.getdata(), alphas):
        if a == 0:
            result_data.append((0, 0, 0, 0))
        else:
            result_data.append((r, g, b, a))
            
    final_scaled = Image.new("RGBA", scaled.size)
    final_scaled.putdata(result_data)
    
    # Save palette
    visible_colors = list(set((r,g,b) for r,g,b,a in result_data if a > 0))
    # Pad to 256
    while len(visible_colors) < 256:
        visible_colors.append((0,0,0))
    palette_img = Image.new("RGB", (16, 16))
    palette_img.putdata(visible_colors[:256])
    palette_img.save(os.path.join(work_dir, "data-mouse-palette-v001.png"))
    
    # Extract views
    views = ['front', 'right', 'left', 'back']
    cells = {}
    report_data = {
        "turnaround_sha256": hash_file(turnaround_path),
        "shared_scale": scale,
        "cell_dimensions": [140, 140],
        "pivot": [70, 128],
        "baseline_y": 127,
        "visible_rgb_count": len(set((r,g,b) for r,g,b,a in result_data if a > 0)),
        "mapping": {
            "front": "down",
            "right": "right",
            "left": "left",
            "back": "up"
        },
        "views": {}
    }
    
    for i, view in enumerate(views):
        region = final_scaled.crop((i*128, 0, (i+1)*128, 256))
        
        # Paste into 140x140
        cell = Image.new("RGBA", (140, 140), (0,0,0,0))
        cell.paste(region, (6, -85))
        
        # Save cell
        cell_path = os.path.join(work_dir, view, "frame-01-passing_v001.png")
        cell.save(cell_path)
        cells[view] = cell
        
        # QA previews
        bg_white = Image.new("RGBA", (140, 140), (255,255,255,255))
        bg_white.paste(cell, (0,0), cell)
        bg_white.save(os.path.join(work_dir, 'qa', f"{view}_white.png"))
        
        bg_magenta = Image.new("RGBA", (140, 140), (255,0,255,255))
        bg_magenta.paste(cell, (0,0), cell)
        bg_magenta.save(os.path.join(work_dir, 'qa', f"{view}_magenta.png"))
        
        bg_dark = Image.new("RGBA", (140, 140), (34,34,34,255))
        bg_dark.paste(cell, (0,0), cell)
        bg_dark.save(os.path.join(work_dir, 'qa', f"{view}_dark.png"))
        
        cell.resize((560, 560), Image.NEAREST).save(os.path.join(work_dir, 'qa', f"{view}_4x.png"))
        cell.resize((1120, 1120), Image.NEAREST).save(os.path.join(work_dir, 'qa', f"{view}_8x.png"))
        
        # Stats
        bbox = cell.getbbox()
        comps = count_components(cell)
        alphas_cell = [p[3] for p in cell.getdata()]
        alpha_counts = {
            "alpha_0": sum(1 for a in alphas_cell if a == 0),
            "alpha_255": sum(1 for a in alphas_cell if a == 255),
            "alpha_intermediate": sum(1 for a in alphas_cell if 0 < a < 255)
        }
        
        report_data["views"][view] = {
            "sha256": hash_file(cell_path),
            "bbox": bbox,
            "alpha_components": comps,
            "alpha_counts": alpha_counts
        }
        
    # Comparison
    comp_img = Image.new("RGBA", (140*4, 140))
    for i, view in enumerate(views):
        comp_img.paste(cells[view], (i*140, 0))
    comp_img.save(os.path.join(work_dir, 'qa', "comparison_4dir.png"))
    
    with open(os.path.join(work_dir, "neutral-frames_v001.json"), "w") as f:
        json.dump(report_data, f, indent=4)

if __name__ == '__main__':
    main()
