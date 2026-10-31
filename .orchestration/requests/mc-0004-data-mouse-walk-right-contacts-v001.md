# Role and objective

Act as a pixel-animation rigging engineer. Create the two candidate contact poses for MC-0004 Data Mouse's right-facing quadruped walk cycle, using the approved neutral V002 cell as the immutable structural base. Produce review assets only; do not assemble or approve a row yet.

# Canonical inputs

- Approved right-facing neutral cell: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\sprite-sheets\work\mc-0004\right\frame-01-passing_v002.png`
- Exact neutral SHA-256: `223A44D9958484836B699E88BB1A362AFB54342B426315DE7E1E1DA52CBB2AAE`
- Approved neutral metadata: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\sprite-sheets\work\mc-0004\neutral-frames_v002.json`
- Shared palette: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\sprite-sheets\work\mc-0004\data-mouse-palette-v002.png`
- Approved turnaround for anatomical reference: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_v001.png`

# Allowed changes

- Create `art-source/sprite-sheets/work/mc-0004/right/frame-00-contact-a_v001.png`.
- Create `art-source/sprite-sheets/work/mc-0004/right/frame-02-contact-b_v001.png`.
- Create versioned QA files under `art-source/sprite-sheets/work/mc-0004/right/qa-contacts-v001/`: 1x white/magenta/dark, 4x/8x, anatomy overlays, diff maps, side-by-side and A→P→B→P preview GIF or PNG sequence.
- Create `art-source/sprite-sheets/work/mc-0004/right/walk-right-contacts_v001.json`.
- Create a reusable deterministic script under `.orchestration/tools/` and `.orchestration/reports/mc-0004-data-mouse-walk-right-contacts-v001.md`.

# Forbidden actions

- Do not use image generation or repaint the character.
- Do not alter the neutral V002 cell, palette, approved turnaround/master, V001 extraction history, MC-0001 assets, game code, public assets or unrelated files.
- Do not assemble the final walk-right row, derive the left direction, create front/back contacts, or create a final sprite sheet.
- No DDA cables/bridges, arbitrary stretching, interpolation other than Nearest Neighbor, dithering, new colors, extra pixels outside legitimate one-pixel root overlap, or deletion of whiskers/tail details.

# Acceptance criteria

- Both outputs are exactly 140x140 RGBA and remain within safe region x=10..130, y=6..132; pivot `(70,128)`.
- The Data Mouse has exactly four natural rodent legs. Segment and label: near-front, far-front, near-hind, far-hind. Do not mistake tail, chest, armor or whiskers for legs.
- Use a diagonal quadruped gait:
  - Contact A support pair: near-front + far-hind, feet at y=128. Swing pair: far-front + near-hind, clearly advanced and lifted with lowest pixels y=124..126.
  - Contact B support pair: far-front + near-hind, feet at y=128. Swing pair: near-front + far-hind, clearly advanced and lifted with lowest pixels y=124..126.
- Move the complete immutable upper body exactly y+1 relative to Passing: head, ears, visor, eyes, muzzle, whiskers, torso, chest emitter, rear armor, tail and connector. Outside the four leg masks, RGBA diff against Passing shifted y+1 must be zero.
- Rotate/reposition each leg only around its own anatomical root using Nearest Neighbor and controlled overlap at the root. Preserve each leg continuously from coxa/root to paw. Do not draw artificial bridges. If a one-pixel joint closure is unavoidable, allow at most one per leg, inside 2px of the original root, using an existing palette color, and report exact coordinates and reason.
- Tail and connector remain structurally identical to Passing and move only with the immutable body y+1. Visor, face, whiskers, ears and emitter must have zero structural/color changes beyond y+1.
- Preserve the exact shared palette as a subset; zero dithering and zero new visible RGB colors.
- Alpha structure must contain one principal component with body/tail/all four legs, plus only the same two small whisker components already present in Passing. No new detached fragments. Report component sizes/bboxes.
- Contact poses must be visibly distinct at native 1x, while preserving scale and identity.
- JSON records hashes, bboxes, alpha/color counts, component data, per-leg roots, rotations/translations, foot max-y, support/swing groups, immutable-body diff and any joint closures.

# Required evidence

- List files, exact commands and changed paths.
- Provide numeric validation and enlarged visual QA for both frames and the full A→P→B→P sequence.
- State clearly that these remain candidate contacts pending human review and no row/promotion occurred.
