# Role and objective

Create the review candidate for the production four-direction walking sprite sheet of approved MC-0010 Pixel Pup. Use deterministic raster processing based on the approved turnaround; deliver work files and QA previews only.

# Canonical inputs

- Approved master: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\approved-masters\cr_mc-0010_pixel-pup_master_v001.png` and `.json`.
- Approved turnaround: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds\cr_mc-0010_pixel-pup_turnaround_v001.png` and `.json`.
- Engine convention reference only: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\sprite-sheets\approved\mc-0004\cr_mc-0004_data-mouse_spritesheet_v001.json`.

# Allowed changes

- Create scripts and work assets only under `art-source/sprite-sheets/work/mc-0010/`.
- Create the candidate PNG/JSON and QA previews under that same directory.
- Create `.orchestration/reports/mc-0010-pixel-pup-spritesheet-candidate-v001.md`.

# Forbidden actions

- Do not edit the approved master, turnaround, source code, public assets, cards, or any existing character.
- Do not write into `art-source/sprite-sheets/approved/`.
- Do not generate or redraw the character with an image model. Derive frames from the approved turnaround by deterministic nearest-neighbor raster operations.
- Do not add/remove legs, ears, eyes, cheek marks, collar, tail or tail-tip pixels.
- No DDA bridges, artificial cables, floating pixels, blur, bilinear interpolation, scenery, shadow, labels, cell borders or opaque background.

# Acceptance criteria

- Candidate sheet exactly 420x560 RGBA, 3 columns x 4 rows, cells 140x140.
- Row order: DOWN/front, RIGHT, LEFT, UP/back.
- Column order: `contact-a`, `passing`, `contact-b`; playback `[0,1,2,1]`; recommended duration 140 ms.
- Pivot every cell `[70,128]`; visible bounds within x=10..130 and y=6..128; no visible pixel below y=128.
- Each passing frame is directly normalized from its corresponding approved turnaround view using one consistent scale across all directions and nearest-neighbor only.
- Preserve the approved compact, wide puppy proportions and all markings.
- Walking gait must read as genuine quadruped locomotion, not merely body bobbing. Contact A and Contact B use alternating diagonal pairs: near-front + far-rear versus far-front + near-rear. Stance legs extend toward travel while swing legs lift and advance. Keep movement restrained enough to avoid tearing joints.
- Exactly four legs in every frame. Side views visibly preserve two near legs and two slightly offset far legs. Front/back preserve bilateral anatomy.
- Rigid body, face and collar remain pixel-identical to the passing frame except an allowed whole-body vertical translation of at most 1 px on contacts. Leg articulation is confined below natural shoulder/hip roots.
- One tail only. Tail may bob by at most 1 px as a rigid connected unit; pixel-square tip remains intact with no duplicate tail or fragment.
- Both ears remain attached; optional symmetric 1 px bounce only. Front has two eyes and exactly two cheek marks; profiles have one visible eye and one visible cheek mark; back has no face.
- True transparency; alpha-zero RGB neutralized. Every visible frame must have one 8-connected alpha component, or document with coordinate evidence why a canonical transparent gap is unavoidable. No components of 1-8 pixels.
- Candidate JSON records dimensions, rows, columns, playback, duration, pivot, per-cell bbox, per-cell alpha-component count, turnaround hash and candidate hash.
- QA outputs: 4x sheet on dark gray, white and magenta; one animated GIF per direction; a combined 4-direction animation preview; component maps for all contact frames.

# Required evidence

- List every created file and processing step.
- Re-crop and compare all 12 cells against source frames with zero pixel difference.
- Report dimensions, mode, hashes, visible bounds, per-cell alpha connectivity, alpha distribution and any unresolved visual risk.
- State explicitly that nothing was integrated or promoted.
