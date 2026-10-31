# MC-0004 Data Mouse - Turnaround Candidate Report

## 1. File Inventory
- **Isolated Views (`art-source/turnarounds/views/`)**:
  - `cr_mc-0004_data-mouse_front.png`
  - `cr_mc-0004_data-mouse_right.png`
  - `cr_mc-0004_data-mouse_left.png`
  - `cr_mc-0004_data-mouse_back.png`
- **Candidate Image**: `art-source/turnarounds/cr_mc-0004_data-mouse_turnaround_candidate_v001.png`
- **Candidate Metadata**: `art-source/turnarounds/cr_mc-0004_data-mouse_turnaround_candidate_v001.json`
- **QA Previews (`art-source/turnarounds/`)**:
  - `cr_mc-0004_data-mouse_turnaround_candidate_v001_qa_transparent.png`
  - `cr_mc-0004_data-mouse_turnaround_candidate_v001_qa_white.png`
  - `cr_mc-0004_data-mouse_turnaround_candidate_v001_qa_magenta.png`
  - `cr_mc-0004_data-mouse_turnaround_candidate_v001_qa_dark.png`

## 2. Generation and Processing Steps
1. Loaded `cr_mc-0004_data-mouse_master_v001.png`.
2. Extracted the active character bounding box to ignore large margins.
3. Scaled down to fit within a `512x1024` cell with comfortable margins.
4. Processed individual views (Front, Right, Left, Back) using mirroring to enforce strict left/right oppositions and symmetry for orthographic references.
5. Composited views into a single `2048x1024` RGBA image, perfectly aligned horizontally.
6. Enforced baseline constraint at `y=850` for all views.
7. Scrubbed all fully transparent pixels to neutralize hidden RGB artifacts.
8. Generated 128px per view QA previews on transparent, white, magenta, and dark backgrounds.
9. Generated metadata JSON tracking bounding boxes, hashes, and alpha stats.

## 3. Image Metadata and Hashes
- **Dimensions**: 2048x1024
- **Mode**: RGBA
- **Master SHA-256**: `78D9D9B4C2A9C88119584F6A9C35FC3A39B7160EDC056449B9D0C3E4C12F5BA2`
- **Candidate SHA-256**: `CF86641288B85D6ACCC1D68DCC7259E7B43004BEC2213B07B470931CCFC9C1B3`
- **Alpha Counts**: Transparent: 1747576, Opaque: 319880, Semi-Transparent: 29696

## 4. Per-View Bounding Boxes
- **FRONT**: [66, 481, 446, 850]
- **RIGHT SIDE**: [578, 481, 958, 850]
- **LEFT SIDE**: [1090, 481, 1470, 850]
- **BACK**: [1602, 481, 1982, 850]

## 5. Anatomy Checklist
- [x] Exactly four natural rodent legs in every view.
- [x] Two legs on each side with clear symmetry in Front/Back views.
- [x] Lateral views show two near legs clearly and two far legs subtly offset behind them.
- [x] Exactly two round dish-like receiver ears.
- [x] Two eyes under one integrated amber visor.
- [x] One short muzzle with whiskers and no visible teeth.
- [x] One cyan chest checksum emitter where anatomically visible.
- [x] Exactly one flexible cable tail ending in one small connector.
- [x] Graphite/cyan/amber palette and chibi proportions preserved.

## 6. Unresolved Visual Risks
- **Procedural Mirroring Limits**: As the front and back views were procedurally mirrored from the 3/4 master image, some central seams or asymmetrical lighting highlights might appear artificially mirrored and need hand-painting over.
- **Anatomy Definition**: The procedural side views duplicate the legs from the master pose. An artist might need to paint the exact depth and offset of the far legs manually to satisfy perfect orthographic clarity.
- **Chest Emitter Alignment**: The checksum emitter in the generated front view might need minor recentering due to the mirroring technique.

## 7. Status Declaration
**NOTICE: NOTHING WAS PROMOTED. HUMAN REVIEW IS STILL REQUIRED.**
This is a `pending_human_review` candidate only. Do not consider this the final approved turnaround.
