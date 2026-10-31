# Role and objective

Act as a senior Canvas 2D/Vite game engineer. Integrate the newly approved neutral Vila Byte Guard Tower master into all four guard-tower positions, replacing the `T` placeholders while preserving gameplay geometry and clear player/enemy team identification.

# Canonical inputs

Authorized project root: `E:\Projetos\MonsterCrypt\Crypt-Royale`

Approved immutable asset:
`art-source/approved-masters/cr_vila_byte_guard_tower_master_v001.png`

Metadata:
`art-source/approved-masters/cr_vila_byte_guard_tower_master_v001.json`

Approved SHA-256:
`E25D6CF24DC79A66D071B53C2DCCD0954268D89481CC3BA1F363786760A6FDEE`

Relevant code:

- `src/game/render.js`
- `src/game/render.test.js`
- `src/game/engine.js` only for reading current tower positions/types; do not change it.

Current guard positions and hitboxes remain authoritative. The approved master is neutral and its metadata gives a 2048×2048 canvas, exclusive bbox `(371,514,1677,1980)`, and bottom-center pivot `(1024,1980)`.

# Allowed changes

- Copy the approved PNG byte-for-byte to:
  `public/assets/towers/cr_vila_byte_guard_tower_master_v001.png`
- Edit `src/game/render.js` to load and render the Guard Tower sprite.
- Edit/add focused tests under `src/game/render.test.js`.

# Forbidden actions

- Do not edit/re-encode the approved PNG or its JSON.
- Do not change engine tower coordinates, hitboxes, HP, attack rules/ranges, match rules, card rules, Operator Core rendering/VFX, Bit Bug rendering, audio system, UI layout, package files, wallet, tokens, Firebase, or economy.
- Do not add destruction rubble in this task; a destroyed Guard Tower may continue to disappear as before. Rubble is a later dedicated art/state task.
- Do not add dependencies, delete history, publish, deploy, or make external calls.

# Acceptance criteria

1. Public asset and approved master must be byte-for-byte identical with the exact approved SHA-256.
2. Add one reusable Guard Tower image descriptor in `render.js` with canonical pivot `(1024,1980)`.
3. Calibrate the neutral master for approximately 39 px visible width and 44 px visible height using scale about `0.03`; use one constant and verify from the actual bbox. It must remain smaller and visually subordinate to the Operator Core.
4. Anchor each sprite by its bottom-center pivot to the existing tower `(x,y)` so attack targeting and collision positions do not change.
5. Render all four living guard towers using the same neutral master. Apply faction identity procedurally without recoloring the approved file:
   - player: restrained cyan base aura/ground ellipse or outline;
   - enemy: restrained rose base aura/ground ellipse or outline;
   - keep the original graphite/cyan/orange art legible;
   - faction styling must be cosmetic only and not change hitboxes.
6. Recommended draw order: faction aura behind -> neutral Guard sprite -> health/shield bar. Health bar should be positioned clearly above the visible Guard silhouette rather than across its face. Preserve existing Operator Core draw order.
7. Use appropriate canvas image smoothing for a polished downscale and restore canvas state afterwards.
8. If the image is unavailable, keep the existing rounded-rectangle `T` fallback with no runtime exception.
9. Destroyed guards must not draw sprite, aura, fallback, or health; do not add rubble yet.
10. Add deterministic tests proving:
    - exactly four Guard sprite draws when all six towers live and assets are loaded;
    - bottom-center pivot/baseline placement and scale use the approved metadata;
    - visible bboxes for all four guards stay strictly inside the 360×560 arena;
    - aura -> sprite -> guard-health ordering;
    - team auras differ without altering entity data;
    - fallback remains when Guard asset is incomplete;
    - destroyed Guard sprite/aura/health are absent;
    - existing Operator Core and collapse tests still pass.
11. Run `npm test` and `npm run build` successfully.

# Required evidence

Return exact changed-file list, copied-file hash/length comparison, chosen scale with calculated visible dimensions, pivot/draw-coordinate calculations for all four towers, tests/build totals, and unresolved mobile-layout risks. Confirm no unrelated files changed.
