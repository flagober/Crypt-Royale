# Role and objective

Correct the rejected MC-0007 Code Slime turnaround by creating genuine orthographic side and back views. The V001 candidate failed human-independent review because its sides are visibly compressed front views and its back still contains the face. Produce a V002 review candidate, not an approved asset.

# Canonical inputs

- Sole identity authority: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\approved-masters\cr_mc-0007_code-slime_master_v001.png`
- Approved metadata: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\approved-masters\cr_mc-0007_code-slime_master_v001.json`
- Rejected candidate only as evidence of what not to repeat: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds\cr_mc-0007_code-slime_turnaround_candidate_v001.png`
- Canonical description: `E:\Projetos\MonsterCrypt\Crypt-Royale\docs\Prompts_Visuais_16_Cartas_v1.0.md`, section `03 — MC-0007 Code Slime`.

# Allowed changes

- Create new V002 isolated views under `art-source/turnarounds/views/` with prefix `cr_mc-0007_code-slime_v002_`.
- Create `art-source/turnarounds/cr_mc-0007_code-slime_turnaround_candidate_v002.png`, matching JSON, white/magenta/dark QA previews and 128px per-view QA.
- Create `.orchestration/reports/mc-0007-code-slime-turnaround-candidate-v002.md`.

# Forbidden actions

- Do not overwrite V001 or any approved master, exploration, code, public, sprite, card-art or unrelated files.
- Do not create or mark an approved turnaround.
- Do not obtain side/back views by horizontal compression, mirroring a front view without actual profile anatomy, median filtering, patching the face, or copying the front body unchanged.
- No text, labels, scenery, floor, shadows, extra eyes, extra arms, extra bubbles, legs, feet, teeth, weapons or readable code.

# Acceptance criteria

- 2048x1024 RGBA, four 512x1024 cells: FRONT, RIGHT SIDE, LEFT SIDE, BACK; baseline y=850; same visual scale.
- FRONT: preserve the approved master identity exactly with two eyes and the smile.
- RIGHT SIDE: genuine right profile with one visible eye and profile mouth at most; body volume, core, arms, base lobes and bubbles must rotate coherently in depth. It must not look like a narrow front view.
- LEFT SIDE: genuine opposite profile, consistent with the right view, not merely a front view squeezed horizontally.
- BACK: absolutely no eyes, no smile and no face pixels. Show the rear gel surface, rear-consistent graphite core depth, both pseudopod arms, twin-lobed base and exactly three data bubbles.
- Every view preserves exactly two total pseudopod arms, exactly three bubbles, one graphite core and twin-lobed base. Eyes: front=2, right=1 visible, left=1 visible, back=0.
- Preserve the same pixel-art cluster style and green-cyan/graphite palette. No blur or smooth-vector reinterpretation.
- True transparent background; hidden RGB at alpha=0 must be black. No fringe.
- V002 JSON must include per-view facial-feature counts and state `pending_human_review`.

# Required evidence

- Provide a per-view crop at 256px or larger so face/back inspection is possible.
- Report a pixel comparison demonstrating that the side silhouettes are not simple x-scaled front silhouettes and that the back face region differs from the front and contains zero eye/mouth clusters.
- List files, hashes, dimensions, alpha statistics, bounding boxes, anatomy checklist and risks.
- Explicitly state that V002 is not promoted and requires human approval.
