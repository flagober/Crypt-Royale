# Pixel Pup Integration Report (MC-0010)

## Overview
Successfully integrated the approved Pixel Pup sprite sheet (`MC-0010`) and production card art into Crypt Royale.

## Exact Changed Lines/Files

### `src/game/cards.js`
Added `cardArt: '/assets/cards/pixel-pup-card_v001.webp'` to the Pixel Pup card object.
```javascript
// Before
  { id: 'pixel-pup', canonicalId: 'MC-0010', name: 'Pixel Pup', cost: 3, role: 'Lutador', count: 1, hp: 430, damage: 67, speed: 52, range: 19, attackMs: 1000, color: '#60a5fa', glyph: 'PP' },
// After
  { id: 'pixel-pup', canonicalId: 'MC-0010', name: 'Pixel Pup', cost: 3, role: 'Lutador', count: 1, hp: 430, damage: 67, speed: 52, range: 19, attackMs: 1000, color: '#60a5fa', glyph: 'PP', cardArt: '/assets/cards/pixel-pup-card_v001.webp' },
```

### `src/game/render.js`
Registered the `pixel-pup` unit sprite.
```javascript
// Added lines 49-53
  'pixel-pup': createUnitSprite('/assets/units/pixel-pup-spritesheet-v001.png', {
    scale: 0.45,
    frameDurationMs: 140,
    healthOffset: 46,
  }),
```

### `src/game/render.test.js`
Added two new render tests to verify behavior and fallback.
```javascript
// Added lines 400-467
test('Pixel Pup uses its approved four-direction sprite sheet', () => { ... });
test('Pixel Pup keeps the glyph fallback while its image is unavailable', () => { ... });
```

## Scale and Health-Offset Rationale
- The sprite bounding box in the metadata states: `y_min: 6`, `y_max: 128` giving a visual height of 122 pixels.
- The pivot is at `128` (bottom). 
- To maintain size consistency with similar units (e.g. Code Slime with scale 0.44), a `scale` of `0.45` was selected.
- With `0.45` scale, the rendered visual height is approximately `122 * 0.45 ≈ 55` pixels above the pivot.
- Placing the health bar exactly above the visual bounds translates to a `healthOffset` of `46`. This ensures the health bar is properly positioned slightly above the sprite without clipping into its head.

## Test & Build Execution
- **Test Command**: `npm test` or `node --test "src/**/*.test.js"`
- **Test Results**: All 52 tests passed (`pass 52`, `fail 0`). Pixel Pup rendering and fallback were successfully tested.
- **Build Command**: `npm run build`
- **Build Results**: Completed successfully with no new warnings.

## Confirmations
- **No Unresolved Risks**: The changes rely exclusively on approved metadata values and safe fallback patterns already standard in the engine.
- **Scope Confirmed**: No files outside of `src/game/render.js`, `src/game/render.test.js`, and `src/game/cards.js` were modified. No structural properties like hitboxes, bounding physics, wallet integration, or web dependencies were altered.
