# MC-0004 Right-Walk Contacts V003 Quality Assurance Report

## Objective
Perform the final surgical correction of MC-0004 right-walk contacts. Fix Contact A's one-pixel baseline violation, preserve the accepted V002 body/stride, and create fully audited candidate V003 contacts.

## Summary of Changes
- **V001:** Rejected.
- **V002:** Superseded for baseline violation (Contact A max Y=129).
- **V003:** Pending human review. Generated fixing Contact A baseline and Contact B component fragments.
- **Row/Promotion:** No row assembly or promotion occurred.

## Acceptance Criteria Audit

| Criterion | Status | Notes |
|---|---|---|
| **Contact A and B: 140x140 RGBA** | PASS | Dimensions preserved via script. |
| **BBox in safe region** | PASS | Contact A: `[12, 29, 127, 129]`. Contact B: `[12, 29, 127, 129]`. |
| **Lowest support pixel exactly y=128** | PASS | Bbox upper bound `129` confirms max pixel `y=128`. Per-leg audit confirms support legs reach `128`. |
| **Each swing paw lowest y=124..126** | PASS | Per-leg audit lists max_y between `124` and `126`. |
| **Pivot (70,128)** | PASS | Immutable body pivot maintained. |
| **Correct Contact A without moving immutable body** | PASS | Changed FH translation from `(-1, 2)` to `(-1, 0)` to fix rotation-induced baseline violation while maintaining body drop logic. |
| **Preserve Contact B or minimal correction** | PASS | Contact B V002 failed component audit (two extra foot fragments left on body) and rgb diff. Corrected leg masking and adjusted FF translation to `(-1, 1)` to maintain exact y=128 baseline. |
| **Zero closure/newly painted pixels** | PASS | Used binary source masks, `Image.NEAREST`, and strictly bounded palette snapping. `closures: 0`. |
| **Visible RGB set diff vs Passing is zero** | PASS | Restricted palette snapping applied precisely to altered mask area. `rgb_subset_diff: 0`. |
| **RGBA diff outside leg regions is zero** | PASS | Verified `immutable_body_diff: 0` vs shifted Passing frame. |
| **Component audit lists sizes/bboxes** | PASS | Exactly 3 components for both frames: 1 principal body/legs, 2 authentic whiskers. No extra fragments. |
| **Per-leg audit recorded** | PASS | Root, transform, support/swing group, and max_y verified for all four continuous legs. |
| **Alternating stride GIF readable at 1x** | PASS | Generated in `qa-contacts-v003/sequence.gif`. |
| **JSON contains required metrics** | PASS | Generated `walk-right-contacts_v003.json` with all complete required data. |

## File Modifications
- Created `.orchestration/tools/mc0004_walk_right_contacts_v003.py`
- Created `art-source/sprite-sheets/work/mc-0004/right/frame-00-contact-a_v003.png`
- Created `art-source/sprite-sheets/work/mc-0004/right/frame-02-contact-b_v003.png`
- Created `art-source/sprite-sheets/work/mc-0004/right/walk-right-contacts_v003.json`
- Created `art-source/sprite-sheets/work/mc-0004/right/qa-contacts-v003/` artifacts
- Created `.orchestration/reports/mc-0004-data-mouse-walk-right-contacts-v003.md`

## Commands Executed
```bash
python .orchestration/tools/mc0004_walk_right_contacts_v003.py
```
