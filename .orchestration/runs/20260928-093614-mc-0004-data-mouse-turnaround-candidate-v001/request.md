# Role and objective

Act as a senior character model-sheet artist. Create one production turnaround candidate for the approved MC-0004 Data Mouse, preserving its identity while resolving its four-legged anatomy in strict orthographic views. This is a review candidate only.

# Canonical inputs

- Sole identity authority: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\approved-masters\cr_mc-0004_data-mouse_master_v001.png`
- Approved metadata: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\approved-masters\cr_mc-0004_data-mouse_master_v001.json`
- Canonical description: `E:\Projetos\MonsterCrypt\Crypt-Royale\docs\Prompts_Visuais_16_Cartas_v1.0.md`, section `02 — MC-0004 Data Mouse`.
- Use the Bit Bug turnaround only for file/layout conventions, never for anatomy: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds\cr_mc-0001_bit-bug_turnaround_v001.png`.

# Allowed changes

- Create source or isolated view work files only under `art-source/turnarounds/views/` using names beginning `cr_mc-0004_data-mouse_`.
- Create `art-source/turnarounds/cr_mc-0004_data-mouse_turnaround_candidate_v001.png`.
- Create matching candidate JSON and QA previews on transparent, white, magenta and dark backgrounds.
- Create `.orchestration/reports/mc-0004-data-mouse-turnaround-candidate-v001.md`.

# Forbidden actions

- Do not modify or overwrite the approved master, exploration files, MC-0001 assets, code, public assets, or unrelated files.
- Do not name or mark the turnaround approved; do not create `cr_mc-0004_data-mouse_turnaround_v001.png`.
- Do not generate animation frames, sprite sheets, card art, environments, text, labels, frames, ground shadows, weapons or scenery.
- Do not add insect anatomy, humanoid limbs, extra tails, extra ears, extra eyes, teeth, or handheld equipment.

# Acceptance criteria

- Final candidate: 2048x1024 RGBA, four 512x1024 cells in one horizontal row.
- Exact order: FRONT, RIGHT SIDE, LEFT SIDE, BACK. No written labels inside the image.
- All four figures share the same scale, neutral stance and baseline at y=850, with comfortable margins and no cropping.
- Exactly four natural rodent legs in every view. Front/back: two legs on each side with clear symmetry. Each lateral view must show two near legs clearly and the two far legs subtly offset behind them; no limb may be mistaken for the connector tail.
- Exactly two round dish-like receiver ears, two eyes under one integrated amber visor, one short muzzle with whiskers and no visible teeth, one cyan chest checksum emitter where anatomically visible, and exactly one flexible cable tail ending in one small connector.
- Preserve the approved graphite/cyan/amber palette, chibi proportions, materials, armor panel language and friendly alert expression. The left/right views must be true opposite views, not duplicate three-quarter poses.
- Strict orthographic production reference: no perspective exaggeration, action pose, floor, shadow, UI, logo, watermark or typography.
- Background must be true transparency with hidden RGB neutralized; no checkerboard, white/magenta fringe or opaque backdrop.
- Candidate JSON must record dimensions, view order, cell size, baseline, master SHA-256, candidate SHA-256, alpha statistics, bounding boxes per view and status `pending_human_review`.
- Provide gameplay-size QA at 96px or 128px per view and solid-background edge checks.

# Required evidence

- List every created file and the exact generation/processing steps.
- Report hashes, dimensions, mode, alpha counts, per-view bounding boxes, anatomy checklist and unresolved visual risks.
- Explicitly state that nothing was promoted and that human review is still required.
