# Role and objective

Act as a senior character model-sheet artist. Create one production turnaround candidate for the approved MC-0007 Code Slime, preserving its exact identity in four consistent orthographic views. This is a review candidate only.

# Canonical inputs

- Sole identity authority: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\approved-masters\cr_mc-0007_code-slime_master_v001.png`
- Approved metadata: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\approved-masters\cr_mc-0007_code-slime_master_v001.json`
- Canonical description: `E:\Projetos\MonsterCrypt\Crypt-Royale\docs\Prompts_Visuais_16_Cartas_v1.0.md`, section `03 — MC-0007 Code Slime`.
- Use the Bit Bug turnaround only for layout conventions, never for anatomy: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds\cr_mc-0001_bit-bug_turnaround_v001.png`.

# Allowed changes

- Create isolated view work files only under `art-source/turnarounds/views/` using names beginning `cr_mc-0007_code-slime_`.
- Create `art-source/turnarounds/cr_mc-0007_code-slime_turnaround_candidate_v001.png`.
- Create its matching candidate JSON and QA previews on transparent, white, magenta and dark backgrounds.
- Create `.orchestration/reports/mc-0007-code-slime-turnaround-candidate-v001.md`.

# Forbidden actions

- Do not modify or overwrite the approved master, exploration files, MC-0001/MC-0004 assets, source code, public assets or unrelated files.
- Do not name or mark the turnaround approved and do not create `cr_mc-0007_code-slime_turnaround_v001.png`.
- Do not generate animation frames, sprite sheets, card art, environments, text, labels, frames, shadows or scenery.
- Do not add legs, feet, bones, teeth, readable code, weapons, clothing, extra eyes, extra pseudopod arms, or extra data bubbles.

# Acceptance criteria

- Final candidate: 2048x1024 RGBA, four 512x1024 cells in one horizontal row.
- Exact order: FRONT, RIGHT SIDE, LEFT SIDE, BACK. No written labels inside the image.
- All four figures share one scale, neutral resting pose and baseline at y=850, with safe margins and no crop.
- Exactly two luminous eyes, exactly two small pseudopod arms, exactly three bright data bubbles, one darker graphite core suspended inside the translucent green-cyan gel, and one broad twin-lobed base.
- The graphite core and sparse square code fragments may shift visually with depth but must remain the same structures, never form readable text, and never multiply.
- Lateral views must be true opposite views. Back view may hide the eyes naturally but must preserve the two arms, twin-lobed base, core and three data bubbles in anatomically consistent positions.
- Preserve the approved pixel-art character identity, green-cyan/graphite palette, friendly elastic expression, silhouette and material language. Do not redesign or reinterpret the creature.
- Strict production reference: no perspective exaggeration, action pose, floor, shadow, UI, logo, watermark or typography.
- Background must be true transparent RGBA with all alpha-zero RGB neutralized; no checkerboard, opaque backdrop or colored fringe.
- Candidate JSON must record dimensions, view order, cell size, baseline, master SHA-256, candidate SHA-256, alpha statistics, per-view bounding boxes, identity-marker counts and status `pending_human_review`.
- Provide 96px or 128px per-view QA plus solid-background edge checks.

# Required evidence

- List every created file and exact generation/processing steps.
- Report hashes, dimensions, mode, alpha counts, per-view bounding boxes, identity checklist and unresolved visual risks.
- Explicitly state that nothing was promoted and that human review is still required.
