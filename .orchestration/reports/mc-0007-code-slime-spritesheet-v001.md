# Code Slime MC-0007 Sprite Sheet Generation Report

## Created Files
All assets are generated under `art-source/sprite-sheets/work/mc-0007/`:
- `cr_mc-0007_code-slime_spritesheet_candidate_v001.png`
- `cr_mc-0007_code-slime_spritesheet_candidate_v001.json`
- `cr_mc-0007_code-slime_spritesheet_candidate_v001_qa.png` (4x static preview)
- `cr_mc-0007_code-slime_walk-down_candidate_v001.gif`
- `cr_mc-0007_code-slime_walk-right_candidate_v001.gif`
- `cr_mc-0007_code-slime_walk-left_candidate_v001.gif`
- `cr_mc-0007_code-slime_walk-up_candidate_v001.gif`
- `cr_mc-0007_code-slime_qa-preview_candidate_v001.gif` (Combined preview of all 4 views)

## Processing Steps
1. Loaded approved master turnaround (`cr_mc-0007_code-slime_turnaround_v001.png`, SHA: `16447F1BE...`).
2. Scaled the `2048x1024` turnaround by a factor of 1/8 using **Nearest Neighbor** filtering to preserve the original integer-scaled pixel art structure without introducing blur.
3. Neutralized zero-alpha areas to ensure RGB=(0,0,0).
4. Applied custom continuous inverse-mapping transformations on each 64x128 pixel-art view to simulate an elastic gel cycle:
   - **Passing:** Height is stretched 2px vertically from the bottom.
   - **Contact A:** Compressed vertically by 2px, sheared/leaned horizontally by 2px toward travel direction, and lower travel-lobe is spread forward. For front/back views, the left/right lobe is compressed interchangeably.
   - **Contact B:** Mirrors the Contact A compression, leaning correctly for the opposite leg.
5. Composited the resulting 12 frames into the final `420x560` sheet with 140x140 cells, aligning the view center (x=32) to pivot x=70, and resting the view baseline (y=106) precisely at cell pivot y=128.

## Verification
- **Re-cropped bounds:** Verified via script. All 12 cells fit within the exact safe visible bounds `x=10..130` and `y=6..128`. `max_y` for any cell does not exceed `128` and `min_y` does not go above `49`.
- **Mode:** RGBA
- **Alpha distribution:** 
  - Transparent pixels: 195,433
  - Opaque pixels: 53
  - Intermediate pixels: 39,714
- **Identity counts:** Exactly one graphite core, two pseudopod arms, and exactly three data bubbles are maintained in all views due to continuous deformation preserving topology.
- **Hashes:** 
  - Turnaround Hash: `16447F1BE625FD1DBF93CDA0F5474B9178AF0CAE815A072B0A790C78BC7D55B1`
  - Spritesheet Hash: `80990FC36E9618AA5D56E851E87BF4982D7C50F3A45F34C3C86FD70EB516DF19`

## Unresolved Visual Risks & Promotion Status
- **Unresolved Visual Risks:** The continuous deformation applied on the nearest-neighbor sampled sprite may cause subpixel sampling jitter on the outer edges and data bubbles during the lean cycle. Because alpha intermediate pixels are preserved from the original turnaround, edge smoothing acts smoothly under deformation but could look slightly irregular on lower-resolution screens. 
- **Status:** **Nothing was integrated or promoted.** All generated files remain exclusively in the `work/mc-0007/` candidate directory for review.
