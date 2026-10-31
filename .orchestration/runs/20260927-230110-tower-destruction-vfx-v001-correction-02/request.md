# Role and objective

Perform the final visual correction to make settled tower wreckage unmistakably read as broken cyber-structure debris at mobile gameplay size, not as a smooth puddle. Preserve all verified lifecycle/accessibility behavior.

# Canonical inputs

- Project: `E:\Projetos\MonsterCrypt\Crypt-Royale`
- Current VFX: `src/game/vfx-tower-destruction.js`
- Current tests: `src/game/vfx-tower-destruction.test.js`
- Mobile QA evidence: `.orchestration/qa/tower-destruction-vfx-preview.html`; the current settled result visually reads as one smooth graphite oval with colored dots.

# Allowed changes

- `src/game/vfx-tower-destruction.js`
- `src/game/vfx-tower-destruction.test.js`
- `.orchestration/reports/tower-destruction-vfx-report.md`

# Forbidden actions

- Do not change engine/render integration, gameplay, approved assets, audio, dependencies, wallet/Firebase, or QA page.
- Do not use raster assets, random numbers, text, or large particle counts.
- No deletion, deployment, publication, upload, or install.

# Acceptance criteria

1. Keep at most one restrained shadow/scorch ellipse. Replace the smooth overlapping-ellipse debris mass with 5-8 deterministic angular Canvas2D fragments/plates using path geometry (`moveTo/lineTo/closePath`) and graphite/slate tones.
2. Include a small visibly fractured central base/stump so the silhouette reads as a collapsed structure. Core wreckage should have a slightly stronger broken central mass than guard wreckage, while both remain clearly dead and low-profile.
3. Use 2-4 restrained team-colored ember points, not a decorative dotted ring. Preserve optional pulse only when reduced motion is off; reduced motion remains pixel-identical across time.
4. Preserve bounds: settled guard approximately <=46.5x24.5 px; core <=58.5x30.5 px. Keep transient effect bounded.
5. Maintain deterministic/idempotent state, 750ms animation, static reduced-motion path, balanced context, reset behavior, no health bar, and core-ring draw order.
6. Extend mocks/tests to cover polygon paths and assert multiple angular fragments are drawn for guard/core, not only ellipses/arcs.
7. All tests and build pass. Update the report to describe the angular debris design and exact totals.

# Required evidence

Return exact visual geometry changes, tests/build results, and remaining visual risk.
