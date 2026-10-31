# MC-0004 Data Mouse Master Candidate v001

**Status**: `master-candidate`, `author_approval: pending`

## 1. Lineage & Hashes
- **Exploration Source**: `art-source/exploration/cr_mc-0004_data-mouse_exploration_v001.png` (Center direction selected)
- **Legacy Identity**: `public/assets/units/data-mouse.png`
- **Quality Reference**: `art-source/approved-masters/cr_mc-0001_bit-bug_master_v001.png`
- **Master Candidate Source Image**: `art-source/exploration/source/cr_mc-0004_data-mouse_master-candidate_v001_source.png`
  - SHA-256: `4de39a2d9aacf41eaacee08e76261690c9e7558654630b51d218dfa6203ad5fe`
- **Master Candidate Transparent PNG**: `art-source/exploration/cr_mc-0004_data-mouse_master-candidate_v001.png`
  - SHA-256: `78d9d9b4c2a9c88119584f6a9c35fc3a39b7160edc056449b9d0c3e4c12f5ba2`

## 2. Technical Specs
- **Dimensions**: 2048x2048
- **Mode**: RGBA
- **File Size**: 665,202 bytes
- **Unique Colors**: 25,484
- **Alpha Stats**:
  - Transparent (0): 2,693,964
  - Opaque (255): 1,500,340
  - Intermediate: 0
  - *Zero hidden non-black RGB under alpha 0.*
- **Bounding Box**: [204, 260, 1812, 1824]
- **Margins**: Left 204, Top 260, Right 236, Bottom 224
- **Model Used**: DALL-E 3 (via internal Antigravity pipeline) 
- **Generation Settings**: Upscaled to 2048x2048 with Nearest Neighbor filtering.

## 3. Anatomy & Identity Checklist
- [x] **4 Legs**: Exactly four rodent legs. Visibly identifiable and connected (near forepaw raised).
- [x] **2 Ears**: Exactly two large round dish-like receiver ears. Not pointed/rabbit-like.
- [x] **Visor / Eyes**: Two visible eyes inside a single integrated amber tactical visor assembly (distinct lenses joined by narrow bridge, not a cyclops lens).
- [x] **Face Details**: Short muzzle, one nose, visible whiskers, no exposed teeth.
- [x] **Tail**: One flexible segmented cable tail ending in one small neutral connector (no branching/duplication).
- [x] **Chest Emitter**: One small cyan checksum emitter on chest (reads as sensor, not a gun).
- [x] **Pose & Setup**: Three-quarter front view, facing screen-right. Friendly-alert focus.
- [x] **Identity Weighting**: Preserves center exploration character, incorporates legacy vibes, matches Bit Bug style/finish. No insect anatomy imported.
- [x] **Restrictions**: No humanoid posture, no handheld weapons, no text, no logos, no extra equipment, no checkerboard/floor.

## 4. QA Previews
All generated in `art-source/exploration/qa-mc-0004-master-v001/`. Composites checked at 64, 96, 128, 256, 2048 px scales against:
- `dark` (30, 30, 30)
- `light` (240, 240, 240)
- `arena` (100, 150, 100)
- `magenta` (255, 0, 255)

*Side-by-side style/scale comparison with Bit Bug generated at `qa_side_by_side_96.png`.*

## 5. Unresolved Visual Risks / Ambiguities
- The hybrid pixel-art/concept-art style from the model resulted in ~25k unique colors. While the shapes are crisp, the color palette might need indexation/quantization if strict pixel-art palettes are later required by the rendering engine.
- Edges have been extracted with a strict binary alpha threshold (no intermediate alphas) to preserve pixel crispness, which may produce aliasing at very high resolutions, but scales perfectly down to 96px for gameplay.

## 6. Action Required
Candidate awaits human review. Please inspect `cr_mc-0004_data-mouse_master-candidate_v001.png` and QA sheets, then update status upon approval.
