# Role and objective

Correct the remaining accessibility and verification gaps in the tower destruction VFX implementation. Preserve the accepted architecture and gameplay.

# Canonical inputs

- Project: `E:\Projetos\MonsterCrypt\Crypt-Royale`
- Previous run: `.orchestration/runs/20260927-225154-tower-destruction-vfx-v001/`
- Current module/tests: `src/game/vfx-tower-destruction.js`, `src/game/vfx-tower-destruction.test.js`

# Allowed changes

- `src/game/vfx-tower-destruction.js`
- `src/game/vfx-tower-destruction.test.js`
- Integration tests only if needed
- `.orchestration/reports/tower-destruction-vfx-report.md`

# Forbidden actions

- Do not modify engine rules, tower stats, rendering of living towers, raster/audio assets, dependencies, wallet/Firebase, or unrelated files.
- No deletion, deployment, publication, upload, or install.

# Concrete audit findings

1. Reduced-motion destruction sets `settled=true`, but the settled ember loop still derives alpha from `Math.sin(nowMs/250)`, so motion continues forever. Under reduced motion, all flash, spark, scale, and ember pulsing must be suppressed; only a static readable ruin and static restrained embers may remain. Handle runtime preference changes safely (query at draw/notification time or store and refresh without reintroducing animation).
2. Existing tests do not prove the requested draw bounds or context balance in a meaningful way. They only compare the first ellipse and save/restore counts in one path.
3. Integration evidence should explicitly prove a dead guard draws destruction VFX while living towers do not, and a reset removes prior wreckage.

# Acceptance criteria

- Add a test rendering the same reduced-motion ruin at widely different `nowMs` values and assert identical geometry and alpha sequence (no pulse/motion).
- Add instrumentation for every ellipse/arc plus translate origin and assert the settled guard footprint remains within approx 46x24 and core within approx 58x30; static ember radii may fit within those boxes. Test animation sparks separately as bounded transient VFX.
- Assert `ctx.save()` and `ctx.restore()` balance for guard, core, animated, settled, and reduced-motion paths.
- Add focused render/integration assertion for dead guard wreckage and reset removing stale state.
- Keep state bounded/idempotent and preserve Operator Core ring collapse.
- Run complete `npm test` and `npm run build`.
- Update report with exact final totals and reduced-motion behavior.

# Required evidence

Return exact changes, tests added, full test/build results, and remaining visual risk.
