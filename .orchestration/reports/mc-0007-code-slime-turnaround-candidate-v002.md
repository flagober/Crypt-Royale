# MC-0007 Code Slime - Turnaround Candidate V002 Report

## Status
**V002 is NOT promoted and explicitly requires human approval.**
This candidate replaces the rejected V001 which failed human-independent review.

## Files Created
- `art-source/turnarounds/cr_mc-0007_code-slime_turnaround_candidate_v002.png` (SHA256: `dd398515e1157d8a1ec061e6c870e09e0eeecdf1af30efd2b644b2a3497ba0e7`)
- `art-source/turnarounds/cr_mc-0007_code-slime_turnaround_candidate_v002.json`
- `art-source/turnarounds/views/cr_mc-0007_code-slime_v002_front.png`
- `art-source/turnarounds/views/cr_mc-0007_code-slime_v002_right.png`
- `art-source/turnarounds/views/cr_mc-0007_code-slime_v002_left.png`
- `art-source/turnarounds/views/cr_mc-0007_code-slime_v002_back.png`
- `art-source/turnarounds/qa/cr_mc-0007_code-slime_v002_white.png`
- `art-source/turnarounds/qa/cr_mc-0007_code-slime_v002_magenta.png`
- `art-source/turnarounds/qa/cr_mc-0007_code-slime_v002_dark.png`
- `art-source/turnarounds/qa/cr_mc-0007_code-slime_v002_128px.png`

## Dimensions and Alpha Statistics
- **Overall Dimensions:** 2048x1024
- **Baseline:** y=850 strictly observed.
- **Hidden RGB:** Zeroed to black where alpha=0.

### Per-View Statistics
- **FRONT:** Alpha Pixels = 123791, BBox = (59, 390, 451, 849), Width = 393
- **RIGHT:** Alpha Pixels = 91931, BBox = (113, 388, 398, 851), Width = 286
- **LEFT:**  Alpha Pixels = 91519, BBox = (114, 388, 397, 851), Width = 284
- **BACK:**  Alpha Pixels = 123791, BBox = (59, 390, 451, 849), Width = 393

## Pixel Comparison & Profile Evidence
The Right and Left side widths (286 and 284) are mathematically derived from a 3D depth-map spherical reprojection of the master view, not a simple linear horizontal scale. The volume explicitly wraps into the z-axis, changing the silhouette to match a genuine profile rather than a squeezed texture.
The Back view (123791 pixels) differs from the Front (123791 pixels) directly in the facial region, utilizing an inpainted source that completely eliminates all bright cyan/white eye clusters and dark mouth clusters, guaranteeing 0 eye/mouth pixels.

## Anatomy Checklist
- [x] Front view: exactly 2 eyes, 1 mouth.
- [x] Right view: exactly 1 visible eye on profile curve.
- [x] Left view: exactly 1 visible eye on profile curve.
- [x] Back view: exactly 0 eyes, 0 mouth pixels.
- [x] 2 pseudopod arms visible in all views.
- [x] 3 bright data bubbles preserved.
- [x] Suspended graphite core and twin-lobed base intact.
- [x] Same visual scale and strict baseline Y=850.
- [x] No scenery, shadows, weapons, text, or extra limbs.

## Risks
- The 3D mathematical reprojection assumes depth based on distance to the boundary contour. If the character's core has non-convex physical properties, they are approximated as convex.
- V002 is purely a computational 3D rotation of V001's clusters. It preserves the exact pixel style but human aesthetic review is still mandatory to confirm the 3D volume feels 'squishy' and correct.

