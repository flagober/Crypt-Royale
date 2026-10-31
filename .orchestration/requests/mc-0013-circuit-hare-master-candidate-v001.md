# Role and objective

Create the review-only master candidate for approved MC-0013 Circuit Hare direction: the center balanced-cyber variant from the exploration sheet. Perform deterministic extraction and cleanup only; do not redraw or reinterpret the character.

# Canonical inputs

- Exploration PNG: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0013_circuit-hare_exploration_v001.png`.
- Exploration metadata: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0013_circuit-hare_exploration_v001.json`.
- Approved user choice: center variant, cell x=724..1447 on the 2172x724 sheet.
- Canonical identity source: `E:\Projetos\MonsterCrypt\Crypt-Royale\docs\Prompts_Visuais_16_Cartas_v1.0.md`, MC-0013 section.

# Allowed changes

- Create `art-source/exploration/cr_mc-0013_circuit-hare_master-candidate_v001.png` and matching JSON.
- Create QA previews with basename `cr_mc-0013_circuit-hare_master-candidate_v001_qa_*` under `art-source/exploration/`.
- Create `.orchestration/reports/mc-0013-circuit-hare-master-candidate-v001.md`.

# Forbidden actions

- Do not modify the exploration source or metadata.
- Do not generate/repaint any pixels, alter colors, change anatomy, remove the ear arc, or invent details.
- Do not promote into `approved-masters`.
- Do not touch code, public assets, other characters, cards or sprite sheets.

# Acceptance criteria

- Extract exactly the center 724x724 cell from the source.
- Scale the complete extracted cell exactly 2x with nearest-neighbor to 1448x1448; do not stretch independently by axis.
- Place it centered on a 2048x2048 transparent RGBA canvas, preserving all visible pixels and generous margins. No cropping.
- Preserve every original visible RGBA sample through nearest-neighbor replication. The only permitted pixel cleanup is setting RGB=(0,0,0) wherever alpha=0; alpha values must remain unchanged after scale replication.
- Preserve exactly four legs, two ears, one tail, the cyan-magenta charge route, electrical bridge between ears and diamond chest node.
- Write JSON with source crop, scale, placement offsets, dimensions, mode, alpha distribution, visible bbox, source and output hashes, and identity contract.
- Generate white, magenta and dark-gray composites, plus 128px and 96px mobile previews.
- Verify no visible magenta contamination, no hidden nonblack RGB at alpha zero, no cropping and no extra/disconnected anatomy introduced.

# Required evidence

- Report created files, exact crop rectangle, scale, offsets, hashes, dimensions, alpha counts, bbox and mobile-readability observations.
- Confirm source remains unchanged and candidate was not promoted.
