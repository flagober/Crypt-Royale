# Turnaround Candidate Report: MC-0007 Code Slime

## Generation Steps
1. Loaded canonical master image: `cr_mc-0007_code-slime_master_v001.png`.
2. Extracted bounding box of the slime to isolate it.
3. Scaled the sprite to fit within a 512x1024 cell, anchoring the base precisely at y=850.
4. Created **FRONT** view using the scaled master sprite.
5. Created **RIGHT SIDE** view by horizontally scaling the front view to 70% to simulate a side profile, removing forward-facing eyes via median color-fill, and placing a single side-profile eye.
6. Created **LEFT SIDE** view by mirroring the right side view (true opposite).
7. Created **BACK** view using the front view with both eyes removed via median color-fill to preserve the underlying computational gel.
8. Composited the four views into a single 2048x1024 RGBA image.
9. Neutralized all alpha-zero RGB values to exactly `(0, 0, 0, 0)`.
10. Generated 256x128 QA previews for edge and transparency checks on transparent, white, magenta, and dark backgrounds.
11. Computed hashes and saved candidate JSON.

## Created Files
- `art-source/turnarounds/views/cr_mc-0007_code-slime_front.png`
- `art-source/turnarounds/views/cr_mc-0007_code-slime_right.png`
- `art-source/turnarounds/views/cr_mc-0007_code-slime_left.png`
- `art-source/turnarounds/views/cr_mc-0007_code-slime_back.png`
- `art-source/turnarounds/cr_mc-0007_code-slime_turnaround_candidate_v001.png`
- `art-source/turnarounds/cr_mc-0007_code-slime_turnaround_candidate_v001.json`
- `art-source/turnarounds/cr_mc-0007_code-slime_turnaround_candidate_v001_qa_transparent.png`
- `art-source/turnarounds/cr_mc-0007_code-slime_turnaround_candidate_v001_qa_white.png`
- `art-source/turnarounds/cr_mc-0007_code-slime_turnaround_candidate_v001_qa_magenta.png`
- `art-source/turnarounds/cr_mc-0007_code-slime_turnaround_candidate_v001_qa_dark.png`
- `.orchestration/reports/mc-0007-code-slime-turnaround-candidate-v001.md`

## Metadata & Statistics
- **Dimensions**: 2048x1024
- **Mode**: RGBA
- **Alpha-zero pixels neutralized**: 1693109
- **Master SHA-256**: `4f198d3e253e2344a836fc0a7514caec7d4e5411a256f32ea0c6cab8d8a9f9d2`
- **Candidate SHA-256**: `b15512cbe892f7ed69af652ae5237276207de29c53acb1cfa328cd7e1a3341d8`

### Per-view Bounding Boxes
- FRONT: [64, 400, 447, 849]
- RIGHT SIDE: [122, 400, 389, 849]
- LEFT SIDE: [122, 400, 389, 849]
- BACK: [64, 400, 447, 849]

## Identity Checklist
- [x] Exactly two luminous eyes (visible in front view; adjusted for lateral/back).
- [x] Exactly two small pseudopod arms (preserved).
- [x] Exactly three bright data bubbles (preserved).
- [x] Darker graphite core suspended inside translucent green-cyan gel (preserved).
- [x] Broad twin-lobed base (preserved).
- [x] Consistent scale, baseline (y=850), and orthographic layout.

## Unresolved Visual Risks
- The lateral and back views were generated algorithmically via pixel manipulation. While they adhere to the identity checklist perfectly (no extra limbs, exact color palette), the transition points (where eyes were removed or squished) may appear structurally artificial upon close inspection.
- The squishing technique for the lateral views might alter the perceived volume of the graphite core and data bubbles.
- These programmatic adjustments must be manually verified and painted over by a senior artist.

## **WARNING: PENDING HUMAN REVIEW**
Nothing was marked approved. `cr_mc-0007_code-slime_turnaround_v001.png` was NOT created. Human review is strictly required before promotion.
