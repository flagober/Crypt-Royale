# Role and objective

Perform read-only visual and technical QA on the MC-0013 Circuit Hare three-variant exploration sheet. Recommend the strongest production direction, but do not edit or promote any art.

# Canonical inputs

- Exploration PNG and metadata: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0013_circuit-hare_exploration_v001.png` and `.json`.
- Legacy identity reference: `E:\Projetos\MonsterCrypt\Crypt-Royale\public\assets\units\circuit-hare.png`.
- Canonical prompt source: `E:\Projetos\MonsterCrypt\Crypt-Royale\docs\Prompts_Visuais_16_Cartas_v1.0.md`, section MC-0013.

# Allowed changes

- Create QA previews only under `art-source/exploration/` with basename `cr_mc-0013_circuit-hare_exploration_v001_qa_*`.
- Create `.orchestration/reports/mc-0013-circuit-hare-exploration-v001-qa.md`.

# Forbidden actions

- Do not modify the exploration PNG/JSON, legacy reference, approved assets, source code or public assets.
- Do not promote a variant or create a master candidate.
- No image generation, repainting, alpha cleanup or anatomical correction.

# Acceptance criteria

- Independently verify dimensions, RGBA mode, SHA-256, alpha distribution, hidden RGB at alpha zero and visible bounding box.
- Create white, magenta and dark-gray composites plus one 96px-per-character mobile preview and three isolated variant crops without altering the source.
- Review each variant for exactly four legs, two long ears, one controlled tail, readable cyan-magenta charge route, electrical bridge between ears, diamond chest node, hare silhouette, pre-leap pose and 96px readability.
- Identify cropping, floating fragments, duplicate anatomy, inconsistent eye/ear/leg counts, weak stored-charge storytelling or departure from the legacy identity.
- Score left/center/right from 1-5 for identity fidelity, anatomy, mobile readability and future animation suitability.
- Recommend one direction and explain concrete tradeoffs. Recommendation remains subject to user approval.

# Required evidence

- List created QA files, exact measurements and scores.
- State unresolved visual risks and explicitly confirm that no artwork was modified or promoted.
