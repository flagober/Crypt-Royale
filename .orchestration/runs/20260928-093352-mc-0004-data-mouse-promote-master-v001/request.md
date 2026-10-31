# Role and objective

Act as the MonsterCrypt asset librarian. Promote the explicitly human-approved MC-0004 Data Mouse candidate to the approved master catalog, preserving the PNG byte-for-byte and recording complete provenance.

# Canonical inputs

- Approved source candidate: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0004_data-mouse_master-candidate_v001.png`
- Candidate metadata: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0004_data-mouse_master-candidate_v001.json`
- Canonical design: `E:\Projetos\MonsterCrypt\Crypt-Royale\docs\Prompts_Visuais_16_Cartas_v1.0.md`, section `02 — MC-0004 Data Mouse`
- Catalog conventions: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\approved-masters\cr_mc-0001_bit-bug_master_v001.json`
- Human approval date: 2026-09-28.

# Allowed changes

- Create `art-source/approved-masters/cr_mc-0004_data-mouse_master_v001.png` as a byte-identical copy.
- Create `art-source/approved-masters/cr_mc-0004_data-mouse_master_v001.json` with status approved, version, date, anatomy, identity markers, direct source, approved path, dimensions/mode, SHA-256 and a turnaround note.
- Create `.orchestration/reports/mc-0004-data-mouse-promote-master-v001.md`.

# Forbidden actions

- Do not modify or delete the source candidate, exploration history, MC-0001 assets, game code, public assets, or any unrelated file.
- Do not generate a turnaround, sprite sheet, card art, or promote anything else in this job.
- Do not publish, deploy, or access external services.

# Acceptance criteria

- Source and destination SHA-256 must both equal `78D9D9B4C2A9C88119584F6A9C35FC3A39B7160EDC056449B9D0C3E4C12F5BA2`.
- Approved PNG must remain 2048x2048 RGBA with no pixel changes.
- JSON must state: id MC-0004, name Data Mouse, element Metal, nature Vigilante, rarity Common, exactly 4 legs, 2 receiver ears, 1 connector tail, 1 integrated amber visor covering 2 eyes, and 1 cyan chest emitter.
- Turnaround note must require exact front, right, left, back views and unambiguous four-leg anatomy.

# Required evidence

- List changed files.
- Report source and destination hashes, byte comparison result, dimensions/mode, commands used, and unresolved risks.
