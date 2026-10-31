# Role and objective

Act as the MonsterCrypt asset librarian. Promote the explicitly human-approved MC-0004 Data Mouse turnaround candidate V003 to the official turnaround V001, preserving the PNG byte-for-byte and recording full lineage.

# Canonical inputs

- Human-approved candidate: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_candidate_v003.png`
- Candidate metadata: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_candidate_v003.json`
- Approved master: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\approved-masters\cr_mc-0004_data-mouse_master_v001.png`
- Approved master metadata: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\approved-masters\cr_mc-0004_data-mouse_master_v001.json`
- Approval date: 2026-09-28.

# Allowed changes

- Create `art-source/turnarounds/cr_mc-0004_data-mouse_turnaround_v001.png` as a byte-identical copy of candidate V003.
- Create `art-source/turnarounds/cr_mc-0004_data-mouse_turnaround_v001.json` with status approved, approval date, direct source, candidate lineage, dimensions, view order, cell size, baseline, hashes, alpha counts, view bounding boxes, view hashes and anatomy counts.
- Copy the V003 white, magenta and dark QA previews to official `_v001_qa_*` names without modifying the candidate history.
- Add a `turnaround` reference to the approved master JSON while preserving all existing fields.
- Create `.orchestration/reports/mc-0004-data-mouse-promote-turnaround-v001.md`.

# Forbidden actions

- Do not regenerate, resize, recolor, resave or alter any pixel in the approved turnaround PNG.
- Do not modify or delete candidate V001/V002/V003, source views, the approved master PNG, MC-0001 assets, code, public assets or unrelated files.
- Do not create animation frames or sprite sheets in this job.
- Do not publish or deploy anything.

# Acceptance criteria

- Source and official turnaround SHA-256 must both equal `8A3B9B3D540411EF09DA41749C683ABFAD46FB7EC1DBE8C14D01AA56CF9D75A4`.
- Byte comparison source/destination must be true.
- Official PNG remains 2048x1024 RGBA, order front/right/left/back, four 512x1024 cells, baseline y=850.
- JSON records exactly four legs, two receiver ears and one connector tail per view; back face elements zero.
- JSON records V001 rejected visual QA, V002 invalid quota placeholder and V003 as the approved direct source.
- Master JSON turnaround path and SHA must match the official files.

# Required evidence

- List changed files, commands and exact source/destination hashes.
- Report byte comparison, dimensions, mode, alpha counts and unresolved risks.
