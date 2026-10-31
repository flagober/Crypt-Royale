# QA Report: MC-0013 Circuit Hare (Master Candidate)

## Overview
A review-only master candidate for the approved MC-0013 Circuit Hare direction (center balanced-cyber variant) was generated and verified.

## Deterministic Operations
- **Source Exploration**: `art-source/exploration/cr_mc-0013_circuit-hare_exploration_v001.png`
- **Source Hash (SHA-256)**: `c4fd826aa48b3bce826696c00eebca2457115c1317230049f67d72b0ba3511df`
- **Crop Rectangle**: (724, 0, 1448, 724) (Center cell, extracted intact)
- **Scale**: 2.0x (Nearest-Neighbor, scaling 724x724 to 1448x1448)
- **Canvas Placement**: Scaled image placed on a 2048x2048 transparent canvas at offsets (x=300, y=300).

## Output Files
- **Master Candidate**: `art-source/exploration/cr_mc-0013_circuit-hare_master-candidate_v001.png`
- **Candidate Hash (SHA-256)**: `3225731d00b676f5bae7c60a08065227453fe5e91ec567e309c29b6a774d3c4a`
- **Metadata**: `art-source/exploration/cr_mc-0013_circuit-hare_master-candidate_v001.json`

## QA Previews Created
The following review assets were generated successfully under `art-source/exploration/`:
- `cr_mc-0013_circuit-hare_master-candidate_v001_qa_white.png`
- `cr_mc-0013_circuit-hare_master-candidate_v001_qa_magenta.png`
- `cr_mc-0013_circuit-hare_master-candidate_v001_qa_dark-gray.png`
- `cr_mc-0013_circuit-hare_master-candidate_v001_qa_prev128.png` (Mobile readable preview)
- `cr_mc-0013_circuit-hare_master-candidate_v001_qa_prev096.png` (Mobile readable preview)

## Verification Checks
- **Source State**: Unmodified. The exploration files were read deterministically without mutation.
- **Promotion State**: Not promoted. All output generated in `art-source/exploration/`.
- **Bounding Box**: Visible pixels bounded at [330, 410, 1735, 1683] within the 2048x2048 canvas, leaving generous margins (no cropping occurred).
- **Pixel Cleanup**: The only pixel manipulation performed was strictly setting RGB=(0,0,0) where alpha=0 (verified 3,412,256 alpha-zero pixels).
- **Anatomy & Readability**: The cyan-magenta charge route, the electrical bridge between the two ears, the four legs, the tail, and the diamond chest node are fully preserved in the composite layouts and scale well down to 96px representations.
