# Role and objective

Act as the Crypt Royale senior environment artist and production-asset engineer. Rebuild the Guard Tower candidate as v002, correcting the visibly opaque circuit-grid background and removing unauthorized top weapons. This is correction run 2 for the Guard Tower master-candidate objective.

# Canonical inputs and rejection evidence

Project root: `E:\Projetos\MonsterCrypt\Crypt-Royale`

Canonical identity inputs remain:

- Approved center reference: `art-source/references/towers/guard-tower_ref-v001-center.png`
- Original exploration: `art-source/exploration/cr_vila_byte_tower_exploration_v001.jpg` — CENTER design only
- Style/scale reference: `art-source/approved-masters/cr_vila_byte_operator_core_master_v001.png`

The following candidate is REJECTED and must not be promoted:
`art-source/exploration/cr_vila_byte_guard_tower_master-candidate_v001.png`

Concrete independent visual evidence:

1. v001 contains a large, plainly visible white/gray circuit-grid rectangle behind and around the tower. Those grid pixels are opaque and are visible in the master itself, `preview_mobile_64px_dark.png`, `mock_arena.png`, `scale_comparison.png`, and `edge_crops_8x.png`.
2. The reported bbox `(512,512,1536,1536)` represents the contaminated square/grid extent, not a tight tower silhouette.
3. The top platform contains two small conventional gun/turret shapes. The approved center exploration does not require them, and the brief explicitly prohibited a conventional cannon or moving turret.
4. Binary alpha is not the primary failure; the visible opaque background is. Do not solve this by merely feathering v001.

# Allowed changes

- Preserve v001 and its QA history untouched.
- Create `art-source/exploration/cr_vila_byte_guard_tower_master-candidate_v002.png`.
- Create new isolated QA under `art-source/exploration/qa-guard-tower-v002/`.
- Create local scripts only within the v002 QA folder.

# Forbidden actions

- Do not promote into `approved-masters/`, copy into `public/`, or edit application code.
- Do not delete or overwrite v001.
- Do not use v001 as a direct pixel source for the new tower or its alpha mask.
- No grid, circuit-board backdrop, checkerboard, white rectangle, scenery, floor, cast shadow, halo box, pedestal, text, labels, UI, watermark, conventional cannon, gun barrels, or small mounted weapons.
- Do not edit canonical inputs or unrelated files.

# Acceptance criteria

## Reconstruction

- Generate/edit from the approved center reference on a truly plain isolated background (prefer native alpha; otherwise use a uniform solid neutral background that does not occur in the tower, then perform careful matte extraction).
- Preserve the center design: compact cylindrical graphite defensive node, recessed hexagonal top platform, cyan front hexagonal energy aperture, wide layered base, sparse orange alerts, restrained cyan circuitry.
- The top must be an abstract sealed/recessed energy-emitter platform with **zero gun/turret/barrel shapes**.
- Maintain the same slightly top-down orthographic camera and visual family as the Operator Core while remaining clearly shorter and simpler.

## Technical requirements

- Exact 2048×2048 RGBA PNG.
- Transparent background with RGB `(0,0,0)` under alpha 0.
- The nontransparent bbox must be a tight silhouette bbox around the tower itself, not a perfect 1024×1024/rectangular background artifact.
- Outside the tower silhouette there must be zero visible grid lines, disconnected white segments, rectangular framing, or opaque background pixels.
- Preserve edge antialiasing where practical; intermediate alpha is expected unless a documented pixel-art reason exists.
- Target one connected primary tower silhouette. Any additional alpha component must be justified as intentional glow and must not resemble background debris; report component count and sizes.
- Zero unintended violet/chroma contamination.

## Mandatory QA v002

Create fresh:

- white, black, neutral-gray, and magenta composites;
- 64 px and 128 px previews on dark/light backgrounds;
- 38 px arena-target preview enlarged with nearest-neighbor for inspection;
- arena mock with two approved Operator Cores and four v002 Guards, with no grid rectangles around any tower;
- scale comparison;
- alpha-mask preview showing visible pixels as solid white on black;
- connected-component visualization and component-size table;
- tight 8× crops around the actual top/base/left/right silhouette edges;
- `relatorio_qa_guard_tower_v002.md` with SHA-256, dimensions, RGBA counts, bbox, pivot, component counts, contamination checks, and explicit answers: `background grid present? NO`; `conventional weapons present? NO`.

Human-visible QA is mandatory. Do not state success if any circuit-grid backdrop remains, even if numeric alpha tests pass.

# Required evidence

Return exact files created, reconstruction method, full metrics, source hash integrity, and unresolved risks. Clearly label v002 `MASTER CANDIDATE — AWAITING HUMAN APPROVAL`.
