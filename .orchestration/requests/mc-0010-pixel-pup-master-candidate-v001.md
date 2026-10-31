# Role and objective

Create one review-only master candidate for approved CENTER variant of MC-0010 Pixel Pup by deterministic extraction from the existing exploration sheet. Preserve visible pixels; do not redesign or regenerate the character.

# Canonical inputs

- Approved direction source: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0010_pixel-pup_exploration_v001.png`
- Exploration metadata: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0010_pixel-pup_exploration_v001.json`
- Canonical legacy reference: `E:\Projetos\MonsterCrypt\Crypt-Royale\public\assets\units\pixel-pup.png`
- Canonical description: `E:\Projetos\MonsterCrypt\Crypt-Royale\docs\Prompts_Visuais_16_Cartas_v1.0.md`, section `04 — MC-0010 Pixel Pup`.
- The user explicitly selected the CENTER balanced puppy/cyber variant.

# Allowed changes

- Create `art-source/exploration/cr_mc-0010_pixel-pup_master-candidate_v001.png` and matching JSON.
- Create white, magenta, dark-gray, 128px and 96px QA previews with prefix `cr_mc-0010_pixel-pup_master-candidate_v001_qa_`.
- Create `.orchestration/reports/mc-0010-pixel-pup-master-candidate-v001.md`.

# Forbidden actions

- Do not edit the exploration sheet, legacy reference, approved masters, turnarounds, sprites, card art, public assets, code or unrelated files.
- Do not create or promote `art-source/approved-masters/cr_mc-0010_pixel-pup_master_v001.png`.
- Do not redraw, recolor, inpaint, add/remove anatomy or use generative image tools. This is deterministic extraction only.
- Do not include any pixels from left or right variants.

# Acceptance criteria

- Extract only the center variant, whose main visible bounds in the sheet are approximately x=693..1293 and y=125..677. Include its complete four-legged body, two ears, face, collar, tail and controlled pixel-tip trail.
- Result: exactly 2048x2048 RGBA with transparent background, centered and fully inside safe bounds with at least 180 px transparent margin on every side.
- Scale uniformly with nearest-neighbor only; no independent stretching, blur or crop.
- Preserve exactly four canine legs, two ears, two eyes, two cheek marks, one cyan collar and one tail with pixel tip. No neighboring character pixels or disconnected debris.
- Neutralize all alpha-zero RGB to 0,0,0. Preserve any legitimate intermediate alpha.
- Candidate JSON records source/candidate SHA-256, dimensions, mode, alpha counts, visible bbox, scale factor, offset, identity checklist and `pending_human_review`.
- QA composites must use correct alpha compositing and show mobile readability at 96px and 128px.

# Required evidence

- List every created file and exact extraction steps.
- Report hashes, dimensions, alpha statistics, bbox, margins and identity checks.
- State unresolved risks and explicitly state that no promotion occurred.
