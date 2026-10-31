# MC-0004 Data Mouse Neutral Frames Extraction Report (V002)

## Overview
This report details the extraction and validation of V002 neutral frames for MC-0004 Data Mouse. The process strictly corrects the failures identified in V001 regarding connector continuity and exact left/right mirror symmetry, while ensuring all structural dimensions fall within the specified safety limits without inventing or repainting pixels. 

**Note: V001 files were intentionally not overwritten and must remain in the review history. V002 is still pending human review, and no animation or promotion into approved assets has occurred.**

## Fixes Implemented
1. **Left/Right Mirror Symmetry**: The Right view is processed independently, and the Left cell is produced as an exact horizontal mirror copy of the finished Right cell. The alpha and RGBA diff count between the reversed Right cell and the Left cell is strictly `0`. The number of alpha components precisely matches (3 components each).
2. **Connector Continuity**: To preserve the already-connected tail and connector, a maximum allowable shared scale of `0.2636` was applied with nearest neighbor downsampling. A bounded nearest-neighbor sampling phase was searched by shifting the source cells (e.g. `dx=-4, dy=-4` for front) before the scale to find grid alignments that prevented the main tail component from severing. 
3. **Safety Bounds Validation**: Scaling the maximum turnaround frame width of 440px by `0.2636` safely caps the final cell width at `115px`, which satisfies the maximum permitted silhouette width of `116px`.

## Extraction Metrics
- **Shared Scale**: 0.2636
- **Cell Dimensions**: 140x140 RGBA
- **Pivot**: (70, 128)
- **Lowest Foot Pixel Y**: 127
- **Visible RGB Colors**: 255 (a shared <=256 color palette was calculated post-scaling)

## Validation Results
| View  | Bounding Box (L, T, R, B) | Width | Height | Main Component | Small Components | Status |
|-------|---------------------------|-------|--------|----------------|------------------|--------|
| Front | [23, 22, 115, 128]        | 92 px | 106 px | 5779 px        | None             | PASS   |
| Right | [12, 28, 127, 128]        | 115 px| 100 px | 5418 px        | 8 px, 4 px       | PASS   |
| Left  | [13, 28, 128, 128]        | 115 px| 100 px | 5418 px        | 8 px, 4 px       | PASS   |
| Back  | [16, 21, 122, 128]        | 106 px| 107 px | 6438 px        | None             | PASS   |

- **Bounds Checks**: All bounding boxes are within the safe region `x=10..130` and `y=6..132`.
- **Width Checks**: Target maximum width <= 116 px is satisfied (max is 115 px). Height <= 110 px is satisfied (max is 107 px).
- **Component Analysis**: The Right and Left views feature one main body component correctly containing the tail and connector attached to the tail shaft, plus two fine separate whiskers which are authentically disconnected in the source art. The front and back views successfully merged into a single unbroken component.

## QA Assets Produced
All QA evidence, including 1x solid-background, 4x/8x transparent previews, 4-direction comparison, exact JSON telemetry, and the calculated color palette, have been outputted to `art-source/sprite-sheets/work/mc-0004/qa-v002/`.
