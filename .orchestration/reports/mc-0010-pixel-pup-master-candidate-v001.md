# MC-0010 Pixel Pup - Master Candidate Extraction Report

**Date:** 2026-09-28
**Variant:** CENTER (balanced puppy/cyber variant)
**Status:** `pending_human_review`

## Extraction Steps
1. **Source Inspection:** Loaded the original exploration sheet (`cr_mc-0010_pixel-pup_exploration_v001.png`), ensuring RGBA processing to maintain legitimate alpha values.
2. **Target Isolation:** Cropped the approximate bounding region for the CENTER variant (`x=693..1293`, `y=125..677`). 
3. **Debris Cleaning:** Processed the cropped region using a 4-way connected components algorithm tracking all pixels with alpha > 0. The main character body, tail, and pixel-tip trail resolved as a single massive connected component (via soft alpha glow). All other disconnected debris particles (alpha=1 or alpha=2 smudges) outside this main structure were isolated and explicitly neutralized to pure transparent black (`0, 0, 0, 0`).
4. **Bounding & Scaling:** Calculated the exact tight bounding box of the cleaned character (`x=693..1292`, `y=125..676`). The 600x552 character was uniformly scaled by a factor of 2x using strict nearest-neighbor resampling (resulting in 1200x1104).
5. **Canvas Placement:** Centered the upscaled character into a final 2048x2048 canvas, leaving a minimum margin of 424px (exceeding the 180px requirement).
6. **QA & Output Generation:** Created required JSON metadata, 3 distinct background composites (white, magenta, dark-gray) to verify readability, and downscaled 128px/96px versions for mobile QA.

## File Hashes & Dimensions
- **Source Hash (SHA-256):** `5097f4d58f3e142c83c608651b3c205481687bfe5fb5a4c962354573deb1da1d`
- **Candidate Hash (SHA-256):** `1a9413ea8338d02cea6d354e56c4933d44f9e3b08a97af30c24d5de601ca9973`
- **Output Dimensions:** 2048x2048
- **Scale Factor:** 2x (Nearest-Neighbor)
- **Margins:** X-axis: 424px, Y-axis: 472px
- **Source Bounding Box:** `x=693..1292`, `y=125..676`

## Alpha Statistics
- **Zero Alpha:** 3,405,540 (All fully neutralized to `RGB=0,0,0`)
- **Intermediate Alpha:** 787,472 (Preserved soft glow)
- **Full Alpha:** 1,292

## Identity Checks
- [x] Exactly four canine legs
- [x] Two ears
- [x] Face (two eyes, two cheek marks)
- [x] Cyan collar
- [x] Tail
- [x] Controlled pixel-tip trail (3 disconnected cyan boxes properly linked via glow)
- [x] No disconnected debris or neighboring character pixels

## Unresolved Risks
- The soft pixel aura connecting the pixel-tip trail to the tail has very low alpha values. This is preserved accurately but could be slightly impacted by very aggressive alpha thresholding downstream.
- **No promotion occurred.** The resulting files are exclusively master candidates, and none have been promoted to `approved-masters`.

## Created Files
- `art-source/exploration/cr_mc-0010_pixel-pup_master-candidate_v001.png`
- `art-source/exploration/cr_mc-0010_pixel-pup_master-candidate_v001.json`
- `art-source/exploration/cr_mc-0010_pixel-pup_master-candidate_v001_qa_white.png`
- `art-source/exploration/cr_mc-0010_pixel-pup_master-candidate_v001_qa_magenta.png`
- `art-source/exploration/cr_mc-0010_pixel-pup_master-candidate_v001_qa_dark-gray.png`
- `art-source/exploration/cr_mc-0010_pixel-pup_master-candidate_v001_qa_128px.png`
- `art-source/exploration/cr_mc-0010_pixel-pup_master-candidate_v001_qa_96px.png`
- `.orchestration/reports/mc-0010-pixel-pup-master-candidate-v001.md`
