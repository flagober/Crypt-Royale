# Role and objective

Correct only the technical background/QA defect in the MC-0004 exploration sheet. Preserve all three generated character designs pixel-for-pixel wherever they are not edge-connected background.

# Canonical inputs

- Project: `E:\Projetos\MonsterCrypt\Crypt-Royale`
- Source exploration: `art-source/exploration/cr_mc-0004_data-mouse_exploration_v001.png`
- Metadata/report and QA directory from run `.orchestration/runs/20260928-052500-mc-0004-data-mouse-exploration-v001/`

# Allowed changes

- Replace the exploration PNG only with a deterministically background-normalized version of the same composition
- Update its JSON, QA previews under `art-source/exploration/qa-mc-0004-v001/`, and report
- Add a reproducible processing script inside the QA directory

# Forbidden actions

- Do not regenerate, repaint, crop, rescale, move, select, or alter any of the three mice.
- Do not create a master candidate or promote anything.
- Do not modify references, docs, code, runtime assets, or unrelated files.
- No deletion, publication, deployment, upload, or install.

# Independent audit evidence

The current report says the background is flat `#D8D3C8`, but direct inspection found:
- size `1536x857`, RGBA
- alpha extrema `(190,255)`, zero fully transparent pixels
- corner samples differ, e.g. `(209,205,191,221)`, `(211,203,189,205)`, `(209,201,187,190)`
- top-left 64x64 contains 59 distinct RGBA colors
Therefore the source contains a subtle vignette/noise and partially transparent border, not a flat uniform background.

# Acceptance criteria

1. Use edge-connected flood selection based on the existing light warm-gray background, bounded by the dark character outlines. Do not use a broad global color replace that could touch visor/highlights inside a mouse.
2. Set every selected background pixel to exact RGBA `(216,211,200,255)` (`#D8D3C8`) while leaving every non-background RGBA pixel byte-identical to the current source.
3. Prove in a machine-readable audit: dimensions unchanged, count of changed pixels, every changed pixel belonged to the edge-connected mask, zero changed pixels outside it, all four corners exact `#D8D3C8` alpha 255, and representative border strips uniform.
4. Rebuild QA previews by using that same edge-connected mask as transparency and compositing the untouched mice onto actual dark/light/arena backgrounds. The source exploration itself must remain opaque with the flat warm-gray background.
5. Update SHA-256, mode, background method, and lineage in JSON/report. Keep status draft/pending human selection.
6. Do not claim anatomy was revalidated or changed; explicitly retain the visual-review note that far ears/legs may be perspective-occluded.

# Required evidence

Return output hash, exact changed-pixel count, mask/background verification, QA paths, and confirmation of zero non-mask changes.
