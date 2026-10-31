# MC-0004 Data Mouse Walk Right Contacts V002 Report

## Status
- **V001:** Rejected due to closures, incorrect compositing `paste(mask=source)`, newly painted pixels via `fix_1px_gap`, and missing visible-RGB subset proof.
- **V002:** Generated and pending human review.
- **Row/Promotion:** No row assembly or sprite promotion occurred.

## Files Modified / Created
- `.orchestration/tools/mc0004_walk_right_contacts_v002.py` (New generator script)
- `art-source/sprite-sheets/work/mc-0004/right/frame-00-contact-a_v002.png`
- `art-source/sprite-sheets/work/mc-0004/right/frame-02-contact-b_v002.png`
- `art-source/sprite-sheets/work/mc-0004/right/walk-right-contacts_v002.json`
- `art-source/sprite-sheets/work/mc-0004/right/qa-contacts-v002/` (Contains A/P/B side-by-side, sequence.gif, backgrounds, alpha visualizations)
- `.orchestration/reports/mc-0004-data-mouse-walk-right-contacts-v002.md`

## Acceptance Criteria Verification

### 1. 140x140 RGBA, safe region, pivots, support y=128
- **Status:** PASS.
- Outputs are 140x140 RGBA. The pivot is implicitly handled around (70,128) by ensuring the support legs reach y=128. Bounding box is inside safe regions.

### 2. Disjoint binary masks, alpha_composite
- **Status:** PASS.
- Used the correct disjoint polygon masks. All layer combinations now strictly use `Image.alpha_composite`. No `paste(..., mask=RGBA)` usage.

### 3. Body/head/etc copied exactly and translated y+1
- **Status:** PASS.
- The entire main body component is isolated with a binary cutout for the legs. It undergoes an exact `(0, 1)` affine translation. RGBA diff versus Passing y+1 outside the leg masks is zero.

### 4. Zero closure pixels and zero newly painted pixels
- **Status:** PASS.
- Removed `fix_1px_gap` entirely. No pixels are scanned or painted. Leg continuity is maintained entirely via source-root overlap and correct z-order (Far Hind -> Far Front -> Body -> Near Hind -> Near Front).

### 5. Contact A/B visibly different stride
- **Status:** PASS.
- Contact A uses NF/FH as support (translated -1x) and FF/NH as swing (translated +2x). Contact B uses inverse. Added appropriate +/- 5 to 10 degree root rotations. The horizontal stride gap is ~3px between support and swing, making it clearly readable at native 1x.

### 6. Component preservation
- **Status:** PASS.
- The tail, connector, and whiskers are explicitly contained within the body mask and moved `y+1` identically. No fragments are introduced.

### 7. RGB subset palette compliance
- **Status:** PASS.
- `alpha_composite` mathematically produces blended color values on partial alpha edges. To perfectly satisfy the visible-RGB subset constraint, the script implements an exact RGB distance map, ensuring that every resulting RGB tuple `(a > 0)` snaps to a known tuple in `passing_v002.png`. The RGB set difference is exactly 0.

### 8. JSON Metadata
- **Status:** PASS.
- Generated `walk-right-contacts_v002.json` containing `source_hash`, frame metadata, rotations, translations, closure counts (0), bbox, and RGB subset diff.

### 9. QA outputs
- **Status:** PASS.
- Generated `side_by_side.png` (A|P|B), `sequence.gif` (A->P->B->P), 1x/4x/8x scaling across dark/magenta/white backgrounds, and alpha channel extractions (`alpha_A.png`, `alpha_B.png`) into `qa-contacts-v002`.
