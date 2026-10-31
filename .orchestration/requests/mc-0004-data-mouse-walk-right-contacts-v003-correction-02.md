# Role and objective

Perform the final surgical correction of MC-0004 right-walk contacts. Fix Contact A's one-pixel baseline violation, preserve the accepted V002 body/stride, and create fully audited candidate V003 contacts.

# Canonical inputs

- Approved Passing: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\sprite-sheets\work\mc-0004\right\frame-01-passing_v002.png`
- V002 contacts: `right/frame-00-contact-a_v002.png`, `right/frame-02-contact-b_v002.png`.
- V002 generator: `.orchestration/tools/mc0004_walk_right_contacts_v002.py`.
- V002 metadata/report and QA are diagnostic authorities for transforms and known results.

# Concrete failure evidence

- Contact A V002 bbox is `[12,29,127,130]` using PIL exclusive bounds, proving its lowest visible pixel is y=129. Required maximum is y=128.
- V002 Contact A Far-Hind support translation is `(-1,+2)`, while the intended body drop is only +1. Correct the support transform/root sampling so its lowest pixel is y=128 without moving the immutable body upward.
- V002 JSON omits required per-leg foot max-y, component sizes/bboxes, immutable-body diff count and complete alpha counts; the report asserts these without evidence.
- Contact B bbox `[12,29,127,129]` indicates lowest y=128 and may be carried forward byte-identically only if all other validators pass.

# Allowed changes

- Create a new V003 deterministic script without overwriting V001/V002 scripts.
- Create `right/frame-00-contact-a_v003.png`, `right/frame-02-contact-b_v003.png`, `right/walk-right-contacts_v003.json`.
- Create final candidate QA under `right/qa-contacts-v003/` and `.orchestration/reports/mc-0004-data-mouse-walk-right-contacts-v003.md`.

# Forbidden actions

- Do not overwrite/delete V001/V002 or any approved/neutral/other-direction asset.
- No image generation, repainting, DDA, closure pixels, gap filling, new RGB colors, dithering, non-Nearest interpolation or row assembly.
- Do not alter face, armor, ears, whiskers, tail, connector, chest emitter or overall scale.

# Acceptance criteria

- Contact A and B: 140x140 RGBA; bbox in safe region; lowest support pixel exactly y=128; each swing paw lowest y=124..126; pivot `(70,128)`.
- Correct Contact A by changing only the necessary Far-Hind/support transform or sampling. Immutable body remains exact Passing shifted y+1.
- Preserve Contact B V002 byte-identically if it passes every validator; otherwise make only the minimal validated correction and document it.
- Zero closure/newly painted pixels; use binary source masks, Nearest transforms and alpha-correct compositing.
- Visible RGB set difference versus Passing is zero. Do not palette-snap or modify immutable-body pixels globally after composition; any palette mapping required for transformed semitransparent leg edges must be restricted to leg masks.
- Outside union of transformed/original leg regions, RGBA diff against Passing y+1 is exactly zero.
- Component audit lists every component size/bbox. Required: one principal component containing body, tail, connector and all four legs, plus exactly the two authentic whisker components; no extra fragments.
- Per-leg audit records root, transform, support/swing group and final paw max-y. All four legs must remain continuous from root to paw.
- A/P/B side-by-side and A→P→B→P GIF must show a readable alternating stride at 1x with no face/armor contamination.
- JSON contains source/output hashes, bboxes, alpha counts, visible color counts/diffs, closure count zero, immutable-body diff zero, component audit and per-leg foot values.

# Required evidence

- List files/commands and a PASS/FAIL table for every criterion.
- Explicitly state V001 rejected, V002 superseded for baseline violation, V003 pending human review, and no row/promotion occurred.
