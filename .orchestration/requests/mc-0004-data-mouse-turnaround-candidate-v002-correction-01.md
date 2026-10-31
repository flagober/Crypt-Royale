# Role and objective

Act as a senior character model-sheet artist. Replace the failed procedural approach with genuinely redrawn orthographic views and create MC-0004 Data Mouse turnaround candidate V002 for human review.

# Canonical inputs

- Sole character authority: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\approved-masters\cr_mc-0004_data-mouse_master_v001.png`
- Metadata: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\approved-masters\cr_mc-0004_data-mouse_master_v001.json`
- Canonical description: `E:\Projetos\MonsterCrypt\Crypt-Royale\docs\Prompts_Visuais_16_Cartas_v1.0.md`, section `02 — MC-0004 Data Mouse`.
- Failed V001 is diagnostic evidence only: `art-source/turnarounds/cr_mc-0004_data-mouse_turnaround_candidate_v001_qa_dark.png`.

# Concrete failure evidence to correct

- V001 used slicing/mirroring of the 3/4 master instead of drawing real orthographic views.
- RIGHT and LEFT are still three-quarter poses, not strict 90-degree profiles.
- BACK visibly has two cable tails, violating the exact-one-tail rule.
- FRONT/BACK contain artificial center seams and mirrored lighting/anatomy.
- Therefore V001's anatomy checklist is not credible and V001 must not be promoted or overwritten.

# Allowed changes

- Use the available image-generation/editing capability to REDRAW four views from the approved master identity. Do not solve this with image slicing or half-mirroring.
- Create versioned view sources under `art-source/turnarounds/views/` named with `_v002`.
- Create `art-source/turnarounds/cr_mc-0004_data-mouse_turnaround_candidate_v002.png`, matching JSON, transparent/white/magenta/dark QA previews and gameplay-size per-view QA.
- Create `.orchestration/reports/mc-0004-data-mouse-turnaround-candidate-v002.md`.

# Forbidden actions

- Do not alter V001 history, the approved master, exploration files, MC-0001 assets, code or public assets.
- Do not mark V002 approved and do not create the final non-candidate turnaround filename.
- Do not use a script to fabricate new viewpoints by reflecting or stitching halves of the 3/4 master. Postprocessing may only isolate alpha, normalize scale and assemble genuinely generated views.
- No animation, sprite sheet, card art, text, labels, environment, floor, shadows, UI, weapons, extra limbs, extra ears, extra eyes or extra tails.

# Acceptance criteria

- 2048x1024 RGBA; four 512x1024 cells; order FRONT, RIGHT SIDE, LEFT SIDE, BACK; common scale and baseline y=850.
- FRONT must be a true centered head-on view with bilateral anatomy, exactly four legs visible as two on each side, two ears, one visor around two eyes, one muzzle, and one tail only if naturally visible behind.
- RIGHT and LEFT must be strict 90-degree profiles, not 3/4. Show exactly two near legs plus two far legs subtly offset. One head, one near ear plus the far ear visible behind, one visor, and exactly one connector tail.
- BACK must be a true rear view: no eyes/visor lenses or muzzle visible; exactly two ears from behind, four legs, rear armor, and EXACTLY ONE cable tail with one connector tip. Never mirror a tail onto both sides.
- Preserve approved chibi silhouette, round receiver ears, graphite armor, cyan accents, amber visor, short whiskered muzzle, chest emitter placement where visible, and friendly alert proportions.
- Neutral static stance, strict orthographic reference, no action perspective.
- True transparent background with clean edges. No rendered checkerboard or source-color halo.
- Inspect every view visually at full size and 128px before claiming compliance. Metadata status `pending_human_review` with hashes, alpha counts, per-view bounding boxes and source master hash.

# Required evidence

- List files and describe the image-generation method/model, source images supplied, alpha cleanup and assembly method.
- Provide a truthful per-view anatomy checklist, hashes, dimensions, alpha metrics and unresolved risks.
- State clearly that V001 failed, V002 is not promoted, and human approval remains required.
