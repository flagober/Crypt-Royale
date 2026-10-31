# Role and objective

Act as a senior 2D game VFX engineer. Implement deterministic destruction feedback for all Crypt Royale towers: a brief lightweight destruction animation followed by a persistent, readable wreckage/debris footprint for the rest of the match. Preserve gameplay and approved tower art.

# Canonical inputs

- Project: `E:\Projetos\MonsterCrypt\Crypt-Royale`
- Tower state/damage authority: `src/game/engine.js`
- Tower rendering authority: `src/game/render.js`
- Existing core-ring lifecycle: `src/game/vfx-operator-ring.js`
- Existing approved runtime sprites under `public/assets/towers/` must remain untouched.
- Arena is 360x560 canvas and must stay performant on Android/mobile browsers.

# Allowed changes

- New isolated module and tests under `src/game/`, preferably `vfx-tower-destruction.js` and `.test.js`
- `src/game/engine.js` only to notify/tick/reset the new VFX lifecycle
- `src/game/render.js` only to draw destruction VFX/wreckage for dead towers
- Existing focused tests if necessary
- `.orchestration/reports/tower-destruction-vfx-report.md`

# Forbidden actions

- Do not edit, rename, regenerate, or delete any raster/audio asset.
- Do not change tower HP, damage, range, targeting, collision, scoring, timing, coordinates, match rules, wallet/economy, Firebase, or audio.
- Do not install dependencies, publish, deploy, upload, or contact external services.
- Do not use nondeterministic `Math.random()` in rendering.
- Do not add large particle arrays to canonical game state or create unbounded memory growth.

# Acceptance criteria

1. On the exact live-to-dead transition, trigger a deterministic effect by tower ID/type/team. Repeated notifications for the same destruction must be idempotent.
2. Animation should be compact (roughly 500-900ms): initial flash/energy burst, a few sparks/fragments, then settle. No screen shake and no opaque overlay.
3. After animation, leave persistent wreckage until `createGame()`/reset: guards get a small debris pile within roughly 46x24 px; cores get a slightly larger collapsed footprint within roughly 58x30 px. It must not resemble a living tower and must not show a health bar.
4. Team readability remains subtle: player wreckage may retain restrained cyan embers; enemy wreckage restrained rose embers. Use muted graphite for most debris.
5. `prefers-reduced-motion` immediately skips moving/expanding animation but still shows the persistent wreckage.
6. Rendering is procedural Canvas2D only, deterministic and bounded. Save/restore context must balance. Do not alter hitboxes or targeting.
7. Existing Operator Core ring collapse continues to work. Establish and test an explicit dead-core draw order that produces a coherent result.
8. Reset removes all prior wreckage state so a restarted match begins clean.
9. Add tests for trigger idempotency, timing progression, persistent state, reset, reduced motion, draw bounds, context balance, guard/core sizes, and integration notification/reset.
10. All existing tests plus new tests pass; `npm run build` passes without warnings/errors.

# Required evidence

Return:

- Exact changed-file list.
- State machine/timing and draw order.
- Proof gameplay constants/rules were not changed.
- Test list, full totals, and build result.
- Any visual risk requiring human review.
