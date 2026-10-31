# Role and objective

Act as the Crypt Royale asset librarian. The user has explicitly approved Guard Tower candidate v003. Promote it byte-for-byte to the official approved master and create complete lineage metadata. Perform no gameplay integration in this job.

# Canonical inputs

Authorized project root: `E:\Projetos\MonsterCrypt\Crypt-Royale`

Approved source candidate:
`art-source/exploration/cr_vila_byte_guard_tower_master-candidate_v003.png`

Canonical history that must be referenced but not modified:

- `art-source/exploration/cr_vila_byte_tower_exploration_v001.jpg`
- `art-source/references/towers/guard-tower_ref-v001-center.png`
- rejected candidate v001: background-grid contamination and unauthorized guns
- superseded candidate v002: white-matte edge fringe
- v003 QA: `art-source/exploration/qa-guard-tower-v003/`
- related style parent: `art-source/approved-masters/cr_vila_byte_operator_core_master_v001.png`

The independently confirmed v003 SHA-256 is:
`E25D6CF24DC79A66D071B53C2DCCD0954268D89481CC3BA1F363786760A6FDEE`

# Allowed changes

- Create `art-source/approved-masters/cr_vila_byte_guard_tower_master_v001.png` as an exact byte-for-byte copy of v003.
- Create `art-source/approved-masters/cr_vila_byte_guard_tower_master_v001.json`.

# Forbidden actions

- Do not alter, re-encode, resize, optimize, recolor, or re-save the PNG.
- Do not modify/delete any exploration, reference, QA, Operator Core, public asset, source-code, package, wallet, Firebase, token, or economy file.
- Do not copy to `public/` and do not integrate into the game in this job.
- No publication, upload, deployment, or external calls.

# Acceptance criteria

1. Source and approved destination must have exactly equal byte length and SHA-256.
2. Destination filename must be exactly `cr_vila_byte_guard_tower_master_v001.png`.
3. JSON must be valid UTF-8 and include at minimum:
   - asset ID `VILA-BYTE-GUARD-0001`;
   - display name `Vila Byte Guard Tower`;
   - status `approved`;
   - version `v001`;
   - approval date `2026-09-27`;
   - approved-by role `human-project-owner`;
   - exact source/destination paths and SHA-256;
   - 2048×2048, RGBA;
   - alpha counts: 0=`2839212`, 255=`1339818`, intermediate=`15274`;
   - tight bbox using an explicitly documented inclusive or exclusive convention;
   - recommended bottom-center pivot derived from the actual bbox;
   - neutral faction master flag;
   - visual identity markers;
   - lineage from exploration center -> v001 rejected -> v002 superseded -> v003 approved;
   - known minor risk: a very thin light edge remains detectable only under strong enlargement on black, acceptable at gameplay scale;
   - relation to Operator Core style parent.
4. Recalculate all hashes and image metrics from disk rather than trusting prior reports.
5. Do not claim game integration.

# Required evidence

Return exact created-file list, source and destination byte lengths/hashes, parsed image metrics, JSON validation result, and confirmation that no unrelated path changed.
