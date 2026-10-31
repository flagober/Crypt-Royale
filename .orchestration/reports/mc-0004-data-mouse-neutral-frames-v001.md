# MC-0004 Data Mouse - Neutral Frames Extraction Report (v001)

## Overview
This report documents the deterministic extraction and normalization of the four neutral/passing gameplay frames for MC-0004 Data Mouse from its approved turnaround (`cr_mc-0004_data-mouse_turnaround_v001.png`). 

**Note: No animation or approval promotion occurred. These are review-ready work files only.**

## Source Material
- **Turnaround SHA-256**: `8a3b9b3d540411ef09da41749c683abfad46fb7ec1dbe8c14d01aa56cf9d75a4`
- Source dimensions: 2048x1024, containing four 512x1024 regions (front, right, left, back).

## Extraction Parameters
- **Shared Scale Factor**: 0.25 (1/4 scale applied globally to all frames).
- **Cell Dimensions**: 140x140
- **Engine Pivot**: (70, 128)
- **Neutral Baseline Y**: 127
- **Interpolation**: Nearest Neighbor
- **Palette**: Single shared quantized palette of 255 visible RGB colors. Fully transparent pixels set to `(0,0,0,0)`. No dithering applied.

## Per-Direction Bounding Boxes & Component Counts

All visible bounding boxes successfully fit within the safe engine region limits (`10 <= x <= 130` and `6 <= y <= 132`). Target max width (116px) and max height (110px) constraints were respected.

### Front
- **BBox**: `[26, 26, 114, 127]` (Width: 88px, Height: 101px)
- **SHA-256**: `e5901a7cb989473ecb1a333bcaf14f579913e794c4cc24d0bccd958a78ecf8cb`
- **Alpha Counts**: Alpha 0: `14350`, Alpha 255: `5181`, Intermediate: `69`
- **Alpha Components**: 3

### Right
- **BBox**: `[15, 32, 125, 127]` (Width: 110px, Height: 95px)
- **SHA-256**: `29a7bdb9a2cec485b22fda407981b6baf92a1d5e527014563a8785c33b60ecff`
- **Alpha Counts**: Alpha 0: `14620`, Alpha 255: `4872`, Intermediate: `108`
- **Alpha Components**: 4

### Left
- **BBox**: `[15, 32, 125, 127]` (Width: 110px, Height: 95px)
- **SHA-256**: `a58c16e08d3be8ff43df77b531103a0ee3330b7b510a98d8e535bd9232a78390`
- **Alpha Counts**: Alpha 0: `14639`, Alpha 255: `4857`, Intermediate: `104`
- **Alpha Components**: 5

### Back
- **BBox**: `[19, 26, 120, 127]` (Width: 101px, Height: 101px)
- **SHA-256**: `dc1c8735e09566162aca7209e87f837273c23937f8fd3b8f968fe5330575f5f9`
- **Alpha Counts**: Alpha 0: `13763`, Alpha 255: `5763`, Intermediate: `74`
- **Alpha Components**: 1

## Visual Risks & Component Analysis
- **Detached Components**: The nearest-neighbor downscaling resolved faint/semi-transparent anti-aliasing bridges from the original turnaround into separated pixels. The disconnected components (whiskers, tail/connector tip) are structurally separated at the solid-pixel (alpha >= 255) level in the approved master view. In adherence to pipeline rules, **no artificial bridges or redraws were fabricated to force connectivity.** This accounts for the multiple component counts in the front, right, and left frames.
- **Quantization limits**: Exactly 255 visible RGB colors were mapped. No dithering was used, which correctly preserves structural edges.

## Generated Artifacts
1. **Extraction Script**: `.orchestration/tools/extract_mc0004.py`
2. **Metadata**: `art-source/sprite-sheets/work/mc-0004/neutral-frames_v001.json`
3. **Palette Asset**: `art-source/sprite-sheets/work/mc-0004/data-mouse-palette-v001.png`
4. **Output Sprites**: 
   - `art-source/sprite-sheets/work/mc-0004/front/frame-01-passing_v001.png`
   - `art-source/sprite-sheets/work/mc-0004/right/frame-01-passing_v001.png`
   - `art-source/sprite-sheets/work/mc-0004/left/frame-01-passing_v001.png`
   - `art-source/sprite-sheets/work/mc-0004/back/frame-01-passing_v001.png`
5. **QA Previews**: 
   - Found under `art-source/sprite-sheets/work/mc-0004/qa/` (includes `white`, `magenta`, `dark`, `4x`, `8x` versions per view, plus `comparison_4dir.png`).
