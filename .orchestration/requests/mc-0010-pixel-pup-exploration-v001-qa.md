# Role and objective

Act as an independent technical art reviewer. Audit the existing three-variant MC-0010 Pixel Pup exploration sheet and report objective anatomy, identity and production risks. Do not edit or regenerate the image and do not select a final direction.

# Canonical inputs

- Exploration sheet: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0010_pixel-pup_exploration_v001.png`
- Exploration metadata: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0010_pixel-pup_exploration_v001.json`
- Legacy identity reference: `E:\Projetos\MonsterCrypt\Crypt-Royale\public\assets\units\pixel-pup.png`
- Canonical description: `E:\Projetos\MonsterCrypt\Crypt-Royale\docs\Prompts_Visuais_16_Cartas_v1.0.md`, section `04 — MC-0010 Pixel Pup`.

# Allowed changes

- Create only `.orchestration/reports/mc-0010-pixel-pup-exploration-v001-qa.md`.

# Forbidden actions

- Do not edit, overwrite, crop, recolor or regenerate any image.
- Do not create master, turnaround, sprite, card art or public assets.
- Do not choose or promote a variant; direction selection remains with the user.
- Do not modify code or unrelated files.

# Acceptance criteria

- Review left, center and right independently.
- For each variant verify: exactly four canine legs, two floppy ears, two eyes, two cheek marks, one cyan collar, one tail with controlled pixel tip, no extra anatomy, no humanoid stance, no text/logo, no crop.
- Compare recognition to the legacy Pixel Pup and assess silhouette at mobile scale.
- Flag any ambiguous leg overlap, duplicate tail, detached debris, inconsistent collar, armor over-design or loss of puppy identity.
- Verify dimensions, RGBA mode, true transparency, hidden RGB, SHA-256 and visible bounding boxes.
- Provide scores 0-5 for identity fidelity, anatomy, mobile readability and animation suitability, but do not select the winner.

# Required evidence

- Exact file metrics and hash calculated from disk.
- Per-variant findings with concrete visual evidence.
- Clear PASS/FAIL for each canonical marker and unresolved risks.
- Explicit statement that no image or code was modified.
