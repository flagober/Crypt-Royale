# Tower Destruction VFX Report

## Exact Changed-File List
- `src/game/engine.js`: Imported new VFX functions, updated `createGame`, `damageEntity`, and `stepGame` to hook lifecycle events.
- `src/game/render.js`: Imported new VFX drawing function and invoked it for dead towers right before `drawOperatorRing` (for cores) or after checking if a guard is dead.
- `src/game/render.test.js`: Refined `ctx.translate` mock interceptor in the `ciclo de colapso` test so it doesn't falsely catch the new destruction footprint `y` coordinate (distinguishing `502 - 48 = 454` for ring vs `502` for wreckage).
- `src/game/vfx-tower-destruction.js`: (New) Procedural Canvas2D state machine and renderer. Updated to use angular Canvas2D fragments/plates using path geometry (moveTo/lineTo/closePath) for wreckage, along with a fractured central base/stump and restrained shadow/embers.
- `src/game/vfx-tower-destruction.test.js`: (New) Test suite for idempotency, timing progression, reset, reduced motion, and draw bounds. Updated to cover polygon paths and assert multiple angular fragments.

## State Machine/Timing and Draw Order
- **Timing:** 
  - `0 to 750ms`: Destructive explosion (burst, flying sparks, footprint scaling and fading in).
  - `> 750ms` (or instant if `prefers-reduced-motion`): "Settled" state where footprint remains persistent (always opaque debris) and embers gently pulsate using sine functions based on the monotonic game clock `nowMs`. Under reduced motion, all animations including embers pulsing, scaling, flashes, and sparks are strictly suppressed dynamically, leaving only a static readable ruin.
- **Draw Order:**
  - Standard live towers drawn as usual.
  - When dead:
    1. `drawTowerDestructionVFX(ctx, item, game.nowMs)` - procedural footprint debris, embers, and sparks are drawn on the ground plane (lowest depth for destroyed logic).
    2. `if (item.type === 'core') drawOperatorRing(ctx, ...)` - holograph ring collapse logic draws above the ground debris.
  
## Proof Gameplay Constants/Rules Were Not Changed
- No properties related to tower stats (`hp`, `damage`, `range`) were altered in `src/game/engine.js`.
- Coordinate space rules (targeting bounds, collision offsets) remain strictly untouched.
- Wreckage footprints scale explicitly based on tower type (approx 58x30px for cores and 46x24px for guards) via localized multipliers, preventing hit-box overlaps visually. No health bar triggers for dead towers due to `hp <= 0` exit early conditions.
- No asynchronous or non-deterministic state injected into `createGame` or `stepGame` (pure functions with isolated deterministic VFX modules, no `Math.random()`, seed unaffected).
- Memory is strictly bounded to max 6 towers in an isolated Map tracking integers/booleans; no arrays created or retained per tick.

## Test List, Full Totals, and Build Result
- **Test List (new):**
  - `VFX Tower Destruction - Idempotency and Reset`
  - `VFX Tower Destruction - Timing progression and Context Balance`
  - `VFX Tower Destruction - Reduced Motion identical frames`
  - `VFX Tower Destruction - Bounds Instrumentation`
  - `VFX Tower Destruction - Transient Sparks Bounds`
- **Totals:**
  - 44 tests passing, 0 failing.
  - Test suites: `AudioManager`, `engine/gameplay`, `vfx-operator-ring`, `vfx-tower-destruction`, `render`.
- **Build Result:** 
  - `vite build` completed in ~1.91s successfully without errors.

## Visual Risk Requiring Human Review
- The angular wreckage fragments use hardcoded path geometry and deterministic offsets to simulate broken plates and a fractured central stump. While bounding constraints are strictly respected, designers should review the resulting slate/graphite silhouettes on mobile resolutions to confirm it correctly reads as destroyed architecture.
- Embers are now reduced to 3 restrained points per wreckage, and their pulse rate (`Math.sin(nowMs/250)`) may need slight artistic adjustment to harmonize perfectly with the core ring's rotation speed.
