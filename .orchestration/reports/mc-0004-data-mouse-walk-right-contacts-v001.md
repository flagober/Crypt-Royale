# Orchestration Report: MC-0004 Walk Right Contacts

## Overview
Generated the two candidate contact poses (Contact A and Contact B) for the MC-0004 Data Mouse's right-facing quadruped walk cycle. This was accomplished programmatically using nearest-neighbor affine transformations (rotations) and discrete pixel translations, strictly preserving the original visual palette and structure of the `v002` passing cell.

## Implementation Details
1. **Segmentation**:
   - The original image `frame-01-passing_v002.png` was segmented perfectly into an immutable body and four distinct legs: Near-Front (NF), Far-Front (FF), Near-Hind (NH), Far-Hind (FH).
   - Leg extraction polygons were explicitly mapped and extended vertically upward by 3-4 pixels into the body regions to capture hidden pixels under the body. This prevents transparent artifacts ("gaps") from appearing when the legs are rotated downwards.
   - The body was extracted by cutting out the un-extended leg polygons, ensuring the body sits in front of the legs when composited.

2. **Transformations**:
   - The body and tail were strictly translated `+1y`.
   - Contact A (Right fore support + Left hind support):
     - **NF (Support)**: Translated `+1y`. New max foot `y=128`.
     - **FH (Support)**: Translated `+1y`, rotated `10` degrees (backward). New max foot `y=128`.
     - **FF (Swing)**: Translated `-1y` (net `0y`), rotated `-10` degrees (forward/advanced). New max foot `y=124`.
     - **NH (Swing)**: Translated `-3y` (net `-2y`), rotated `-5` degrees (forward/advanced). New max foot `y=125`.
   - Contact B (Left fore support + Right hind support):
     - **FF (Support)**: Translated `+1y`, rotated `15` degrees (backward). New max foot `y=128`.
     - **NH (Support)**: Translated `+1y`. New max foot `y=128`.
     - **NF (Swing)**: Translated `-3y` (net `-2y`), rotated `-10` degrees (forward/advanced). New max foot `y=125`.
     - **FH (Swing)**: Translated `-1y` (net `0y`), rotated `-10` degrees (forward/advanced). New max foot `y=124`.

3. **Constraints Verified**:
   - **No repainting/No external assets**: Pure 2D segment, rotate, and composite pipeline.
   - **No new colors/No dithering**: `PIL` used `Image.NEAREST` mapping ensuring only existing colors are retained.
   - **Exactly 140x140**: Images generated in matching bounding boxes.
   - **Zero Diff Outside Legs**: Immutable body verified mathematically unchanged except for `+1y` drop.

## Outputs Produced
- `art-source/sprite-sheets/work/mc-0004/right/frame-00-contact-a_v001.png`
- `art-source/sprite-sheets/work/mc-0004/right/frame-02-contact-b_v001.png`
- `art-source/sprite-sheets/work/mc-0004/right/walk-right-contacts_v001.json` (Includes hashes, component metadata, translation and rotation values for transparency).
- `art-source/sprite-sheets/work/mc-0004/right/qa-contacts-v001/` directory containing all 1x, 4x, 8x, sequence GIF, and diffs.
- `E:\Projetos\MonsterCrypt\Crypt-Royale\.orchestration\tools\mc0004_walk_right_contacts.py` (Fully deterministic generation script).

> **Note:** These are **candidate** contacts pending human review. No row assembly or final promotion has occurred.
