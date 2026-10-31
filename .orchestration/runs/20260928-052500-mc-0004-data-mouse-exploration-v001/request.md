# Role and objective

Act as MonsterCrypt concept artist and production coordinator. Generate one exploration sheet with exactly three coherent visual directions for MC-0004 Data Mouse, ready for human selection. This is exploration only, not an approved master.

# Canonical inputs

- Project: `E:\Projetos\MonsterCrypt\Crypt-Royale`
- Legacy character identity reference: `public/assets/units/data-mouse.png`
- Approved style/quality reference only: `art-source/approved-masters/cr_mc-0001_bit-bug_master_v001.png`
- Canonical design text: `docs/Prompts_Visuais_16_Cartas_v1.0.md`, section `02 — MC-0004 Data Mouse`
- Canonical combat/fantasy text: `docs/Crypt_Royale_Catalogo_16_Cartas_v1.0.gdd`, section `5.2 MC-0004 — Data Mouse`

# Allowed changes

- Create `art-source/exploration/cr_mc-0004_data-mouse_exploration_v001.png`
- Create matching lineage/technical metadata at `art-source/exploration/cr_mc-0004_data-mouse_exploration_v001.json`
- Create noncanonical QA previews under `art-source/exploration/qa-mc-0004-v001/`
- Create `.orchestration/reports/mc-0004-data-mouse-exploration-v001.md`

# Forbidden actions

- Do not modify or overwrite the legacy reference, Bit Bug master, docs, runtime assets, source code, tests, or other art.
- Do not promote anything into `approved-masters`, `turnarounds`, `sprite-sheets`, `card-art`, or `public/assets`.
- Do not choose a winner or call any option approved/master.
- Do not delete/supersede history, publish, deploy, upload, or install dependencies.
- No resemblance to an existing franchise; no medieval clothing, handheld gun, humanoid stance, crypto logo, readable text, card frame, UI, watermark, checkerboard, scenery, floor, or cast shadow.

# Canonical character requirements

- MC-0004 Data Mouse; Metal element; Vigilante nature; common rarity; ranged sentinel.
- Clearly a compact cyber mouse, not a generic robot: exactly four natural rodent legs, large round dish-like receiver ears, short mouse muzzle, whiskers, flexible segmented cable tail ending in one small connector.
- Rounded graphite armor; restrained cyan circuitry/checksum light; integrated amber tactical visor around both eyes; one small cyan checksum emitter on the chest, never a weapon.
- Alert, precise, friendly-but-battle-ready expression. One forepaw may be raised while tracking a distant target.
- Preserve the recognizable legacy identity: chibi compact proportions, huge ears, graphite/cyan body, pixel/connector tail language. Refine rather than replace it.
- Must remain readable at 96 px and visually compatible with the approved Bit Bug without copying its insect anatomy.

# Image composition

- Produce exactly THREE complete versions of the same character in one strict horizontal row, left/center/right, same three-quarter front view, scale, baseline, pose family, lighting, and palette.
- Left: slightly more biological mouse anatomy, technology restrained.
- Center: balanced biology/technology; recommended production-neutral direction.
- Right: slightly more engineered sentinel armor, while unmistakably a mouse.
- Variations must be moderate; all identity markers must remain identical across all three.
- Wide 3:1 canvas, ideally 3072x1024 or 1536x512, with generous separation and no cropping/overlap.
- Use a completely flat, uniform light warm-gray background such as `#D8D3C8`; no checkerboard and no simulated transparency. Do not attempt alpha removal in this exploration step.
- Premium cyber-fantasy anime pixel-art/concept-art hybrid, crisp clusters, controlled highlights, clean silhouette, no excessive micro-detail.

# Acceptance criteria

1. Exactly three and only three mice, one horizontal row, no text.
2. Every option visibly has exactly four legs, two ears, two eyes under one integrated amber visor treatment, whiskers, one cable tail and one connector tip; no extra/missing anatomy.
3. Chest checksum emitter is visible and cannot be mistaken for a gun.
4. Background is flat and uniform without checkerboard, gradients, props, shadows, or environment.
5. Output is PNG, minimum 1536px wide; record exact dimensions, mode, SHA-256, and source references in JSON.
6. Generate 96px-per-character and 192px-per-character QA previews on dark, light, and arena-color backgrounds without altering the source.
7. Report any anatomical ambiguity honestly. Stop for human selection; do not create a master candidate.

# Required evidence

Return exact output paths, dimensions/mode/hash, anatomy checklist for left/center/right, description of controlled differences, QA preview paths, and unresolved risks.
