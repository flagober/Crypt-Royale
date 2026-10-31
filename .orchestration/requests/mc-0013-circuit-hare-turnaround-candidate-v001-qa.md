# Role and objective

Perform read-only visual and technical QA on the MC-0013 Circuit Hare four-view turnaround candidate. Do not edit or promote the artwork.

# Canonical inputs

- Approved master and metadata: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\approved-masters\cr_mc-0013_circuit-hare_master_v001.png` and `.json`.
- Turnaround candidate and metadata: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds\cr_mc-0013_circuit-hare_turnaround-candidate_v001.png` and `.json`.

# Allowed changes

- Create QA previews only under `art-source/turnarounds/qa/` with basename `cr_mc-0013_circuit-hare_turnaround_candidate_v001_qa_*`.
- Create `.orchestration/reports/mc-0013-circuit-hare-turnaround-candidate-v001-qa.md`.

# Forbidden actions

- Do not modify the approved master, turnaround candidate, metadata, code, public assets or other characters.
- Do not promote or generate/repaint artwork.

# Acceptance criteria

- Verify 2172x724 RGBA, four equal 543x724 cells and view order front/right/left/back.
- Verify SHA-256, alpha counts, hidden RGB at alpha zero and visible bbox per cell.
- Create dark-gray, white and magenta composites, four isolated view crops and a 96px-per-view mobile preview.
- Visually confirm exactly four connected legs and two connected ears per view; exactly one tail; no floating fragments or duplicate anatomy.
- Front/back must preserve bilateral leg layout. Each profile must visibly account for two near and two far legs.
- Verify the cyan-magenta stored-charge route, small ear bridge and circular joints remain coherent across rotations.
- Front shows face and diamond chest node; back shows no face/chest node and preserves rear charge paths and single tail.
- Confirm uniform baseline/scale, no cropping, no overlap and mobile readability.
- Score anatomy, identity fidelity, cross-view consistency and animation suitability from 1-5, and document any risk.

# Required evidence

- List QA files, measurements, scores and unresolved risks.
- Explicitly confirm candidate remained unchanged and was not promoted.
