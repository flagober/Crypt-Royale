# Role and objective

Act as MonsterCrypt character art director and production artist. Based on the user-selected CENTER direction, create one polished, isolated MC-0004 Data Mouse master candidate with corrected anatomy and production-ready transparency. This remains a candidate awaiting human approval.

# Canonical inputs

- Project: `E:\Projetos\MonsterCrypt\Crypt-Royale`
- Selected exploration sheet: `art-source/exploration/cr_mc-0004_data-mouse_exploration_v001.png`; use only the CENTER character as the primary visual direction.
- Legacy identity reference: `public/assets/units/data-mouse.png`
- Approved style/quality reference: `art-source/approved-masters/cr_mc-0001_bit-bug_master_v001.png`
- Canonical text: `docs/Prompts_Visuais_16_Cartas_v1.0.md`, section `02 — MC-0004 Data Mouse`
- User decision: center/balanced direction approved for master-candidate development.

# Allowed changes

- Create source generation at `art-source/exploration/source/cr_mc-0004_data-mouse_master-candidate_v001_source.png`
- Create transparent candidate at `art-source/exploration/cr_mc-0004_data-mouse_master-candidate_v001.png`
- Create metadata at `art-source/exploration/cr_mc-0004_data-mouse_master-candidate_v001.json`
- Create reproducible masking/QA tools and previews under `art-source/exploration/qa-mc-0004-master-v001/`
- Create `.orchestration/reports/mc-0004-data-mouse-master-candidate-v001.md`

# Forbidden actions

- Do not modify the exploration sheet, legacy reference, Bit Bug master, docs, runtime assets, code, or tests.
- Do not promote or copy the candidate into `approved-masters`, `turnarounds`, `sprite-sheets`, `card-art`, or `public/assets`.
- Do not generate multiple alternatives; this job is one refined candidate from the chosen center direction.
- Do not delete/supersede history, publish, deploy, upload, install dependencies, or select/claim final human approval.
- No humanoid posture, handheld weapon, readable text/code, crypto logo, card frame, UI, scenery, floor, shadow, checkerboard, watermark, extra equipment, or resemblance to existing IP.

# Identity and anatomy requirements

- MC-0004 Data Mouse; Metal element; Vigilante nature; common rarity; compact ranged sentinel.
- Preserve the center exploration silhouette/material balance: compact chibi mouse, rounded graphite armor, restrained cyan lighting, prominent integrated amber visor.
- EXACTLY four natural rodent legs. Pose in three-quarter front view facing screen-right: near front forepaw raised slightly; the other front paw and both hind paws must remain visibly identifiable and connected. Do not hide a whole limb behind the body.
- Exactly two large ROUND dish-like receiver ears. The far ear may be smaller in perspective but must remain unmistakably round, never pointed/rabbit-like.
- Exactly two visible eyes inside a single integrated amber tactical visor assembly: two distinct lenses joined by a narrow bridge, never a cyclops lens. Keep friendly-alert focus.
- One short mouse muzzle, one nose, visible whiskers, and no exposed teeth.
- Exactly one flexible segmented cable tail ending in one small neutral connector; no branching, floating pixels, or plug duplication.
- One small cyan checksum emitter centered on the chest; it must read as an integrated sensor, never a gun.
- Identity weighting: selected center exploration 75%, legacy Data Mouse identity 20%, approved Bit Bug finish/style consistency 5%. Do not import insect anatomy.

# Generation and cleanup

- Create one complete character centered on a square 2048x2048 composition, generous safe margin, three-quarter front view, neutral alert pose.
- Generate against a flat light warm-gray background close to `#D8D3C8`, never checkerboard. Preserve that untouched generation as the source file.
- Derive the transparent candidate deterministically with an edge-connected background mask. Do not recolor/despill the character unless separately documented and proven necessary.
- Candidate must be PNG RGBA 2048x2048 with true alpha: fully transparent exterior, opaque body, controlled intermediate alpha only at antialiased edges. Transparent pixels must have RGB `(0,0,0)`.
- Keep the original pixel/concept-art hybrid: crisp clusters, clean outer contour, controlled highlights, no excessive micro-detail, readable at 64/96/128 px.

# Acceptance criteria

1. One and only one complete mouse, not cropped; no background remnants or halo on white, black, mid-gray, magenta, or arena-color composites.
2. Human-readable anatomy checklist confirms 4 legs, 2 round ears, 2 eyes/2 visor lenses, whiskers, 1 cable tail/1 connector, 1 chest emitter. Flag any ambiguity honestly.
3. Dimensions 2048x2048 RGBA; report alpha 0/255/intermediate counts, visible bounding box and margins, unique visible colors, file size, SHA-256.
4. Generate unchanged-scale QA composites plus isolated 64, 96, 128, and 256px previews on dark/light/arena backgrounds. Do not call a resized image pixel-identical to the source.
5. Verify source and candidate lineage, masking script reproducibility, zero hidden non-black RGB under alpha 0, and no visible magenta/checkerboard/text/logo.
6. Compare candidate at 96px beside the approved Bit Bug at 96px for style/scale compatibility without modifying either canonical asset.
7. Status must remain `master-candidate`, `author_approval: pending`; stop for human review.

# Required evidence

Return exact paths, generation/model, source/candidate hashes, dimensions/mode/alpha/bbox/margins, anatomy checklist, QA preview paths, character-vs-background changed-pixel audit, and unresolved visual risks.
