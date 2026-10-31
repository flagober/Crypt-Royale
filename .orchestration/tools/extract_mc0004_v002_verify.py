import os
from PIL import Image

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

scale = 0.2636
base_dir = r"E:\Projetos\MonsterCrypt\Crypt-Royale"
turnaround_path = os.path.join(base_dir, r"art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_v001.png")
img = Image.open(turnaround_path).convert('RGBA')

source_cells = {
    'front': img.crop((0, 0, 512, 1024)),
    'right': img.crop((512, 0, 1024, 1024)),
    'back': img.crop((1536, 0, 2048, 1024))
}

params = {
    'front': (-4, -4),
    'right': (-3, 0),
    'back': (-4, -4)
}

for view in ['front', 'right', 'back']:
    dx, dy = params[view]
    shifted = Image.new("RGBA", (512, 1024), (0,0,0,0))
    shifted.paste(source_cells[view], (dx, dy))
    scaled = shifted.resize((int(512 * scale), int(1024 * scale)), Image.NEAREST)
    comps = get_components(scaled)
    comps.sort(key=len, reverse=True)
    print(f"{view}: {len(comps)} components")
    for i, c in enumerate(comps):
        print(f"  Comp {i}: {len(c)} pixels")
