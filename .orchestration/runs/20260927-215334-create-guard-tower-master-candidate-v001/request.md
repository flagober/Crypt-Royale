# Role and objective

Act as the Crypt Royale senior environment concept artist and production-asset engineer. Using the user-approved **center design** from the existing Guard Tower exploration sheet, create one production-ready Guard Tower master candidate plus objective QA material. Do not integrate or promote it yet.

# Canonical inputs

Authorized project root: `E:\Projetos\MonsterCrypt\Crypt-Royale`

Authoritative visual inputs:

1. Approved Guard Tower direction — **the CENTER tower only** in:
   `art-source/exploration/cr_vila_byte_tower_exploration_v001.jpg`
2. Approved Operator Core master, used only to match the Vila Byte art family and to ensure the Guard Tower remains visually subordinate:
   `art-source/approved-masters/cr_vila_byte_operator_core_master_v001.png`
3. Operator Core metadata:
   `art-source/approved-masters/cr_vila_byte_operator_core_master_v001.json`

The left and right designs from the exploration sheet are explicitly rejected as production directions. Isolate the center design into:
`art-source/references/towers/guard-tower_ref-v001-center.png`

# Allowed changes

- Create the isolated center reference under `art-source/references/towers/`.
- Create versioned candidate files under `art-source/exploration/`.
- Create QA previews and a technical report under `art-source/exploration/qa-guard-tower-v001/`.
- Use local scripts under that QA folder if deterministic alpha cleanup, measurements, or mock composition are needed.

# Forbidden actions

- Do not edit or replace the source exploration sheet or Operator Core master.
- Do not use the rejected left or right tower designs as identity references.
- Do not promote anything into `approved-masters/`.
- Do not copy anything into `public/`, and do not edit application source code.
- Do not delete historical candidates, reports, or assets.
- Do not add text, faction logos, crown shapes, medieval motifs, weapons resembling real firearms, characters, scenery, ground, shadows, card frames, UI, or watermarks.
- Do not publish, upload, deploy, or access wallets/tokens/Firebase/economy files.

# Acceptance criteria

## Visual identity

- Preserve the center design's identity: a compact, squat cylindrical defensive node; wide reinforced graphite base; recessed hexagonal top platform; central front-facing cyan hexagonal energy aperture/core; layered armor blocks; sparse orange alert accents; restrained cyan circuit lights.
- Match the approved Operator Core's cyber-fantasy/polished 2D concept-art language, materials, line quality, cyan/orange palette, and slightly top-down orthographic camera.
- The Guard Tower must remain clearly smaller, wider, simpler, and less prestigious than the tall Operator Core. It must not acquire an Operator avatar platform or holographic ring.
- Keep the silhouette readable at the gameplay target of roughly 38 px and at 64 px. Avoid tiny noisy surface detail that disappears on mobile.
- The top platform may function as an abstract energy-emitter surface, but do not add a conventional cannon or moving turret. Projectile VFX will be handled later by the engine.
- Create one neutral canonical tower. Do not bake player/enemy faction recolors into the master.

## Technical output

- Candidate path: `art-source/exploration/cr_vila_byte_guard_tower_master-candidate_v001.png`
- Exact canvas: 2048 × 2048 px.
- PNG RGBA with genuine transparency; transparent pixels must have neutral RGB `(0,0,0)`.
- One complete centered tower, fully inside canvas, no crop, no opaque/checkerboard/chroma background, no floor or cast shadow.
- Keep balanced margins suitable for deterministic engine anchoring; report the exact nontransparent bounding box and recommended bottom-center pivot.
- Preserve controlled antialiasing only on silhouette edges and cyan emissive details. No white/magenta/green matte fringe.
- No strong visible violet contamination using the same audit logic applied to the Operator Core (`R > G+20` and `B > G+20`) unless a pixel is demonstrably intentional; target zero unintended visible violet pixels.

## Mandatory QA assets

Create:

- white, black, neutral gray, and magenta alpha-composite previews;
- 128 px and 64 px mobile previews on dark and light backgrounds;
- an arena-scale mock showing two approved Operator Cores and all four Guard Tower candidates in their approximate current game positions, with neutral player-cyan/enemy-rose procedural overlays only in the mock;
- a side-by-side scale comparison: Guard Tower candidate versus approved Operator Core;
- an 8× edge crop sheet for top, base, left, and right silhouette inspection;
- `relatorio_qa_guard_tower_v001.md` containing SHA-256, dimensions, mode, file size, alpha=0/255/intermediate counts, bbox, pivot recommendation, visible/hidden chroma contamination counts, and a concise visual-risk assessment.

Do not claim approval. Clearly label the result as `MASTER CANDIDATE — AWAITING HUMAN APPROVAL`.

# Required evidence

Return:

- exact created/changed-file list;
- which generation and deterministic cleanup steps were used;
- all measured QA data from disk;
- confirmation that the original exploration and approved Operator Core hashes did not change;
- unresolved visual risks at 38 px and whether another candidate iteration is recommended before approval.
