# Role and objective

Create the production four-direction movement sprite sheet for approved MC-0007 Code Slime. Animate elastic slime locomotion, not walking legs. Deliver work files and a review candidate only.

# Canonical inputs

- Approved master: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\approved-masters\cr_mc-0007_code-slime_master_v001.png`
- Approved turnaround and metadata: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds\cr_mc-0007_code-slime_turnaround_v001.png` and `.json`.
- Engine convention reference only: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\sprite-sheets\approved\mc-0004\cr_mc-0004_data-mouse_spritesheet_v001.json`.

# Allowed changes

- Create work assets only under `art-source/sprite-sheets/work/mc-0007/`.
- Create review candidate PNG/JSON and QA previews under `art-source/sprite-sheets/work/mc-0007/`.
- Create `.orchestration/reports/mc-0007-code-slime-spritesheet-v001.md`.

# Forbidden actions

- Do not modify approved masters, turnaround, existing characters, source code, public assets or card art.
- Do not place anything in `art-source/sprite-sheets/approved/` yet.
- No legs, feet, walking gait, new face, extra arms, extra core or extra/missing bubbles.
- No blur, bilinear interpolation, scenery, shadows, labels, frame lines or opaque background.

# Acceptance criteria

- Candidate sheet: exactly 420x560 RGBA, 3 columns x 4 rows, cells 140x140.
- Row order: DOWN/front, RIGHT, LEFT, UP/back.
- Column order: `squash/contact-a`, `neutral/passing`, `squash/contact-b`.
- Playback pattern is `[0,1,2,1]`, recommended frame duration 150 ms.
- Pivot in every cell `[70,128]`; safe visible bounds x=10..130 and y=6..128; no pixels below y=128.
- Neutral cells derive from corresponding approved turnaround view with identical relative scale. Preserve the wide/chubby silhouette.
- Movement is an elastic gel cycle: Contact A leans/compresses 2-3 px toward the travel direction while the lower lobe on that side spreads slightly; Passing is neutral and 1-2 px taller; Contact B mirrors the compression/lean. Up/down use alternating left/right lobe compression to show forward travel.
- Keep face/core/arms readable and coherent. Exactly one graphite core, exactly two pseudopod arms and exactly three data bubbles in every frame. Front has two eyes; profiles have one visible eye; back has no face.
- Use nearest-neighbor only and preserve crisp pixel clusters. True transparent background with alpha-zero RGB neutralized.
- Candidate JSON records dimensions, rows, columns, playback, duration, pivot, baselines, per-cell bbox, alpha connectivity, turnaround hash and sheet hash.
- QA must include 4x static sheet and one animated GIF per direction plus a combined gameplay-scale preview.

# Required evidence

- List all created files and processing steps.
- Verify by re-cropping all 12 cells, bounds, mode, alpha, frame identity counts and hashes.
- State unresolved visual risks and explicitly state that nothing was integrated or promoted.
