# Role and objective

Correct the deterministic MC-0004 neutral-frame extraction. Produce V002 cells that preserve connector continuity and exact left/right mirror symmetry without drawing bridges or repainting pixels.

# Canonical inputs

- Approved turnaround: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_v001.png`
- Approved metadata: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_v001.json`
- V001 extraction script: `E:\Projetos\MonsterCrypt\Crypt-Royale\.orchestration\tools\extract_mc0004.py`
- V001 QA evidence: `art-source/sprite-sheets/work/mc-0004/qa/*_8x.png` and `neutral-frames_v001.json`.

# Concrete failure evidence

- At 8x, front/right/left show connector or fine anatomy pixels separated after downsampling; V001 must remain review history, not be approved.
- Right V001 reports 4 alpha components while left reports 5, although the approved left turnaround cell is an exact horizontal mirror of right.
- Independent reverse-flip check on V001 alpha returns a non-empty difference bbox `(15,34,125,127)`; symmetry therefore failed.
- V001 used a whole-sheet resize and per-cell crop, allowing sampling phase differences between mirrored cells.
- V001 scale 0.25 leaves unused safe width; maximum permitted silhouette width is 116px and the source maximum bbox width is 440px, allowing up to approximately 0.2636.

# Allowed changes

- Create a corrected script under `.orchestration/tools/` without overwriting `extract_mc0004.py`.
- Create `frame-01-passing_v002.png` under front/right/left/back.
- Create `data-mouse-palette-v002.png`, `neutral-frames_v002.json`, and versioned QA under `art-source/sprite-sheets/work/mc-0004/qa-v002/`.
- Create `.orchestration/reports/mc-0004-data-mouse-neutral-frames-v002.md`.

# Forbidden actions

- Do not overwrite/delete V001 files or modify approved assets, source art, code, MC-0001 assets or unrelated files.
- No image generation, repainting, DDA bridges, rotations, limb movement, contact frames, rows, GIFs or sprite-sheet assembly.
- Use Nearest Neighbor only and no dithering.

# Acceptance criteria

- Four 140x140 RGBA cells; pivot `(70,128)`; lowest foot pixel y=127; bboxes within x=10..130 and y=6..132; target maximum width <=116 and height <=110.
- Crop/process each source cell independently with ONE shared scale. Search a bounded nearest-neighbor sampling phase/padding if needed to preserve the already-connected tail and connector without inventing pixels. Use the largest shared scale that passes all safe bounds and continuity checks, not exceeding 116px width.
- Process the RIGHT view once, then create LEFT as an exact horizontal mirror of the finished right cell. Mandatory reverse-flip RGBA diff = 0 and alpha diff = 0; component counts and alpha counts must therefore match.
- Preserve one tail with one connected connector in every view. Explicitly identify the tail/connector component and verify it is connected to the tail shaft. Fine whiskers may remain separate if already separate in the source; report component sizes and locations rather than only total count.
- Build one shared <=256-color visible RGB palette after view scaling, apply it without dithering, and preserve the scaled alpha channel. Transparent RGB must be zero.
- Provide 1x solid-background QA, 4x/8x transparent QA, four-direction comparison, and a reverse-flip diff proof.
- JSON includes source hash, scale, sampling phase/padding, mapping, pivot, baseline, per-cell hash/bbox/alpha/component sizes, tail-continuity result, visible colors and reverse-flip diff count.

# Required evidence

- List files and commands; report all numeric validation and visual risks truthfully.
- State that V001 was not overwritten, V002 is still pending human review, and no animation/promotion occurred.
