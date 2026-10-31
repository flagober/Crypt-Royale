# Role and objective

Correct the failed MC-0004 right-walk contact generation. Produce Contact A/B V002 using alpha-correct compositing, zero fabricated closure pixels, clean anatomy, and a visibly readable diagonal quadruped stride.

# Canonical inputs

- Approved passing frame: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\sprite-sheets\work\mc-0004\right\frame-01-passing_v002.png`
- Passing SHA-256: `223A44D9958484836B699E88BB1A362AFB54342B426315DE7E1E1DA52CBB2AAE`
- Palette: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\sprite-sheets\work\mc-0004\data-mouse-palette-v002.png`
- Failed V001 script and outputs are diagnostic only: `.orchestration/tools/mc0004_walk_right_contacts.py` and `right/qa-contacts-v001/`.

# Concrete failure evidence

- V001 metadata records eight closure pixels for Contact A: `(61,112)`, `(61,113)`, `(43,114)`, `(61,114)`, `(61,115)`, `(52,116)`, `(53,116)`, `(53,117)`, violating the permitted maximum and contradicting the report's claim of no closures.
- The script uses `paste(source, mask=source)` after sources already contain alpha, multiplying alpha coverage repeatedly and changing RGBA combinations.
- `fix_1px_gap` scans a broad rectangle and paints pixels based on neighbor count rather than a proven anatomical root. It must be removed entirely.
- V001 `colors_count` is 311/309 RGBA combinations, while the report incorrectly calls this palette compliance and supplies no visible-RGB subset proof.
- Human-sized side-by-side QA shows Contact A and B are barely distinguishable; the stride must read clearly at native 1x.

# Allowed changes

- Create a new deterministic script under `.orchestration/tools/` without overwriting V001.
- Create `right/frame-00-contact-a_v002.png`, `right/frame-02-contact-b_v002.png`, `right/walk-right-contacts_v002.json`.
- Create versioned QA under `right/qa-contacts-v002/`, including A/P/B side-by-side, A→P→B→P GIF, 1x backgrounds, 4x/8x, diff maps, anatomy overlays, alpha-component visualization and palette-subset proof.
- Create `.orchestration/reports/mc-0004-data-mouse-walk-right-contacts-v002.md`.

# Forbidden actions

- Do not overwrite/delete V001, neutral V002, palette, approved art, other directions, code or unrelated assets.
- No image generation, repainting, DDA, gap-fill scans, closure pixels, new colors, dithering or non-Nearest interpolation.
- Do not assemble the walk row or derive left/front/back.

# Acceptance criteria

- 140x140 RGBA; pivot `(70,128)`; visible bbox inside safe region; lowest support pixels y=128; swing feet y=124..126.
- Exactly four legs segmented as near-front, far-front, near-hind, far-hind. Use disjoint binary extraction masks plus intentional source overlap only at each anatomical root. Composite layers with alpha-correct `Image.alpha_composite`, never `paste(..., mask=RGBA_source)`.
- Body/head/ears/visor/muzzle/whiskers/torso/emitter/rear armor/tail/connector are copied exactly from Passing and translated only y+1. Outside documented leg masks, RGBA diff versus Passing y+1 must equal zero.
- Zero closure pixels and zero newly painted pixels. Leg continuity must come from source-root overlap and correct z-order.
- Contact A: near-front + far-hind support; far-front + near-hind swing. Contact B: inverse. Add a controlled horizontal stride of 2–3px plus modest root rotation so A and B are visibly different at 1x without changing scale.
- Tail/connector remain in the main body component and identical apart from y+1. Preserve the same two authentic small whisker components; no new fragments. Report all component sizes/bboxes.
- Every visible RGB color in A/B must be a subset of visible RGB colors in Passing. Report set difference count exactly zero. Alpha combinations may change only from resampling coverage; report counts truthfully.
- JSON includes source hash, outputs, bboxes, visible RGB subset diff, alpha counts, component sizes, leg masks/pivots/transforms, foot max-y, body diff, closure count zero, and gait groups.
- QA A/P/B must make the stride readable at native 1x and enlarged 8x without face/armor contamination.

# Required evidence

- List files, commands and changed paths.
- Provide numeric and visual QA, explicitly identify whether each acceptance criterion passed.
- State that V001 is rejected, V002 remains pending human review, and no row/promotion occurred.
