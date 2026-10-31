# Role and objective

Act as a production-asset cleanup engineer. Create Guard Tower candidate v003 by performing a surgical white-matte despill on v002's silhouette edges. Preserve the approved v002 tower design and geometry exactly. This is correction run 3 and the final automated correction for this Guard Tower candidate objective.

# Canonical input and concrete evidence

Project: `E:\Projetos\MonsterCrypt\Crypt-Royale`

Input candidate:
`art-source/exploration/cr_vila_byte_guard_tower_master-candidate_v002.png`

v002 successfully removed the grid and guns, but independent visual review found:

- `qa-guard-tower-v002/composite_black.png` shows a thin white/light-gray matte outline around much of the tower silhouette.
- `qa-guard-tower-v002/preview_38px_arena_target_NN.png` converts the fringe into conspicuous white pixels at the left/right sides and base.
- Independent 4-neighbor boundary analysis found 4,997 visible edge pixels, including at least 60 pixels with all RGB channels above 200 and 112 near-neutral bright pixels (`min RGB >160`, channel spread <30). Numeric counts understate the visually continuous light fringe.

# Allowed changes

- Preserve v001 and v002 untouched.
- Create `art-source/exploration/cr_vila_byte_guard_tower_master-candidate_v003.png`.
- Create fresh QA and scripts under `art-source/exploration/qa-guard-tower-v003/`.

# Forbidden actions

- Do not redraw, regenerate, resize, crop, recolor, sharpen, or change the tower design.
- Do not change opaque interior pixels except when an objectively detected one-pixel matte fringe requires nearest-interior color propagation.
- Do not alter the alpha channel, canvas dimensions, bbox, pivot, or component topology unless absolutely required; target alpha diff = 0 pixels.
- No promotion, public copy, code changes, deletion, deployment, or unrelated edits.

# Acceptance criteria

1. Start byte-for-pixel from v002 and preserve exact 2048×2048 RGBA geometry.
2. Remove white-background contamination from semi-transparent edge RGB using mathematically correct unmatting/despill against white where possible.
3. For remaining near-white/neutral matte pixels on the outer 1–2 px boundary, replace RGB using nearest valid interior silhouette colors while preserving the original alpha value. Protect intentional cyan/orange emissive pixels by hue/saturation and neighborhood checks.
4. Alpha channel difference v002 -> v003 must be exactly zero. Bbox, pivot, alpha counts, and connected-component count must remain identical.
5. Interior RGB pixels away from the detected edge band must have diff = 0. Report changed RGB pixel count and maximum inward distance from transparency.
6. On black, dark-gray, white, and magenta composites there must be no white/light-gray halo.
7. The 38 px nearest-neighbor QA preview must show no isolated white fringe pixels at sides or base; also provide 64/128 px dark/light previews.
8. Rebuild an arena mock using correct procedural faction presentation: upper/enemy Guards use restrained rose lighting/tint, lower/player Guards use restrained cyan lighting/tint. Do not bake these faction colors into the neutral master.
9. Create an edge comparison sheet v002 vs v003 at 8× on black, including top/base/left/right and a red diff overlay.
10. Report SHA-256, exact alpha diff, RGB changed-pixel count, unchanged bbox/component counts, near-white boundary counts before/after, and source hashes.

# Required evidence

Return exact files created, cleanup formula/method, measured before/after edge statistics, visual risks, and explicit confirmation that only the v003 candidate/QA folder were created. Label the result `MASTER CANDIDATE — AWAITING HUMAN APPROVAL`.
