# Exploration Report: MC-0004 Data Mouse

## Output Paths
- **Exploration Image:** `art-source/exploration/cr_mc-0004_data-mouse_exploration_v001.png`
- **Metadata JSON:** `art-source/exploration/cr_mc-0004_data-mouse_exploration_v001.json`
- **QA Previews Directory:** `art-source/exploration/qa-mc-0004-v001/`

## Technical Details
- **Dimensions:** 1536x857 (upscaled from 1376x768 to meet >= 1536px requirement)
- **Mode:** Format32bppArgb (PNG)
- **Background Method:** edge-connected flood selection
- **SHA-256 Hash:** 7BF3C8F942E5A3BBC0417E82324BDBCECFE060FA6DEC859FDB26B7E84783484A
- **Lineage:** background-normalized via process.py script
- **Source References:**
  - Legacy: public/assets/units/data-mouse.png
  - Approved Style: `art-source/approved-masters/cr_mc-0001_bit-bug_master_v001.png`
- **Model:** Google Imagen 3 (via Gemini 3.1 Pro High)

## Anatomy Checklist
| Requirement | Left (Bio) | Center (Balanced) | Right (Tech) |
| :--- | :---: | :---: | :---: |
| Exactly four legs | ✅ | ✅ | ✅ |
| Two large dish-like receiver ears | ✅ | ✅ | ✅ |
| Two eyes under integrated amber visor | ✅ | ✅ | ✅ |
| Visible whiskers | ✅ | ✅ | ✅ |
| One flexible cable tail w/ connector | ✅ | ✅ | ✅ |
| Chest cyan checksum emitter | ✅ | ✅ | ✅ |
| NO extra/missing anatomy | ✅ | ✅ | ✅ |
| NO handheld gun | ✅ | ✅ | ✅ |

*Note: Anatomy was not revalidated or changed in this background normalization step; explicitly retaining the visual-review note that far ears/legs may be perspective-occluded.*

## Description of Controlled Differences
The exploration sheet presents three variations on a single row, all sharing the same chibi proportions, scale, lighting, and palette:
- **Left (Biological Bias):** Emphasizes natural rodent curves. Armor plating is softer and reads more like protective fur or smooth carapace. Technology is more restrained, blending closely with the biological form.
- **Center (Balanced):** The recommended production-neutral direction. Strikes an even split between organic mouse shape and graphite cyber-armor plating. Clear separation of mechanical joints and biological core.
- **Right (Engineered Bias):** More angular and heavily armored. Prioritizes the "sentinel" aspect of the character, with pronounced panel lines and reinforced graphite plating, while retaining the unmistakable mouse silhouette.

## QA Preview Paths
Previews were generated at 96px and 192px width on three background types (dark, light, arena) to test silhouette and readability:
- `art-source/exploration/qa-mc-0004-v001/left_96px_dark.png`, `...light.png`, `...arena.png`
- `art-source/exploration/qa-mc-0004-v001/left_192px_dark.png`, `...light.png`, `...arena.png`
- `art-source/exploration/qa-mc-0004-v001/center_96px_dark.png`, `...light.png`, `...arena.png`
- `art-source/exploration/qa-mc-0004-v001/center_192px_dark.png`, `...light.png`, `...arena.png`
- `art-source/exploration/qa-mc-0004-v001/right_96px_dark.png`, `...light.png`, `...arena.png`
- `art-source/exploration/qa-mc-0004-v001/right_192px_dark.png`, `...light.png`, `...arena.png`

## Unresolved Risks & Next Steps
- **Alpha Transparency:** The exploration image uses a solid warm-gray background (#D8D3C8). The QA previews successfully applied alpha masking based on the edge-connected flood mask, but the exploration source image itself remains opaque.
- **Human Selection Required:** The current state is strictly exploratory. Do not promote any of these versions to `approved-masters` or `sprite-sheets` yet. A human art director must select one direction (Left, Center, or Right) and provide feedback on anatomy/materials before the master is generated.
