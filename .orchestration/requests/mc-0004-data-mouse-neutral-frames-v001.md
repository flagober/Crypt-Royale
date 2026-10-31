# Role and objective

Act as a technical pixel-art pipeline engineer. Deterministically extract and normalize the four neutral/passing gameplay frames for MC-0004 Data Mouse from its approved turnaround. Produce review-ready work files only; do not animate yet.

# Canonical inputs

- Approved turnaround PNG: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_v001.png`
- Approved turnaround metadata: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_v001.json`
- Approved master metadata: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\approved-masters\cr_mc-0004_data-mouse_master_v001.json`
- Engine convention reference: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\sprite-sheets\approved\mc-0001\cr_mc-0001_bit-bug_spritesheet_v004.json`
- Bit Bug passing cells may be inspected only for canvas/pivot conventions, never copied visually.

# Allowed changes

- Create `art-source/sprite-sheets/work/mc-0004/front/frame-01-passing_v001.png`.
- Create corresponding cells under `right`, `left`, and `back` with the same filename.
- Create a shared palette asset under `art-source/sprite-sheets/work/mc-0004/data-mouse-palette-v001.png` with no more than 256 visible RGB colors.
- Create per-direction white, magenta, dark, 4x and 8x QA previews, plus one four-direction comparison preview.
- Create `art-source/sprite-sheets/work/mc-0004/neutral-frames_v001.json`.
- Create a reusable deterministic script under `.orchestration/tools/` and `.orchestration/reports/mc-0004-data-mouse-neutral-frames-v001.md`.

# Forbidden actions

- Do not use image generation, repainting, rotation, mirroring, limb movement or interpolation other than Nearest Neighbor.
- Do not modify approved master/turnaround files, MC-0001 assets, game code, public assets or unrelated files.
- Do not create contact frames, animation rows, GIFs, final sprite sheets or approved assets.
- Do not delete or overwrite history.

# Acceptance criteria

- Four canonical cells, exactly 140x140 RGBA: front=down, right=right, left=left, back=up.
- Source cells are the four 512x1024 regions of the official turnaround in order front/right/left/back.
- Crop each visible view, but apply ONE shared scale factor to every direction. Resize only with Nearest Neighbor.
- Preserve the approved anatomy and pixels structurally; no redraw and no generated pixels.
- Engine pivot is `(70,128)`. Align the character's body axis to x=70 and the lowest visible foot pixel to neutral baseline y=127 for every cell. Tail may extend laterally but must remain inside the safe region.
- Every visible bounding box must remain inside x=10..130 and y=6..132; target maximum width 116px and maximum height 110px, using the shared factor.
- Use a single shared quantized palette of at most 256 visible RGB colors, no dithering. Preserve alpha coverage; fully transparent pixels must have RGB(0,0,0).
- No detached components may be introduced by the extraction/scaling/quantization. Record 8-neighbor alpha component counts, but do not fabricate bridges to force connectivity; whiskers or a connector tip may be naturally separate only if they already are separate in the approved view, and must be reported.
- JSON must contain source turnaround SHA, shared scale, cell dimensions, mapping, pivot, baseline, per-cell SHA, bbox, alpha counts, visible RGB count and alpha component count.
- QA must be inspected at native 1x and enlarged 4x/8x.

# Required evidence

- List created files and exact commands.
- Report hashes, common scale, bboxes, baseline, palette counts, alpha counts, component counts and any unresolved visual risks.
- State explicitly that no animation or approval promotion occurred.
