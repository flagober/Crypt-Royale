# Audio Integration Report

## Exact Changed-File List and Rationale
1. **`src/game/audio-manager.js`**
   - **Why**: Updated `update()` function to support the future-compatible `overtime` state via `status === 'overtime'` or `phase === 'overtime'`. Also updated automatic mode to select `main-menu` for `update(null)` and unknown states. Added a `playGeneration` token (request-generation protection) in `_applyDesiredTrack` and `dispose()` to prevent stale play promise rejections and resolutions from incorrectly locking the audio state or initiating obsolete crossfades during rapid track switching.
2. **`src/AudioControl.jsx`**
   - **Why**: Tracked `manager.unlocked` state to display a clear notification when an initial user gesture is still required to unlock audio on modern browsers, and added a visual pulse indicator to the audio toggle button to communicate this state properly.
3. **`src/game/audio-manager.test.js`**
   - **Why**: Added tests for the new `overtime` mappings. Added portable Node tests asserting catalog URL file existence and sizes > 0, manual mode track selection, automatic mode null state selection. Replaced the rapid-switch stale play promise bug test with a rigorous A1 -> B -> A2 generation protection test, and added a cleanup invalidation test to ensure callbacks pending during `dispose()` do not alter state.

## Automatic State-to-Track Mapping
- `status === 'playing'` (time remaining > 30s) -> **`vila-byte-battle`**
- `status === 'playing'` (time remaining <= 30s) -> **`ranked-climax`**
- `status === 'finished'` AND `winner === 'player'` -> **`arena-progression`**
- `status === 'finished'` AND `winner === 'enemy'` -> **`main-menu`**
- `status === 'finished'` AND `winner === 'draw'` -> **`main-menu`**
- `status === 'overtime'` OR `phase === 'overtime'` -> **`overtime`**
- _Default (outside of matches / unknown)_ -> **`main-menu`**

## Canonical MP3 Path Confirmation
The following files were confirmed to exist on disk exactly as requested, verified programmatically by the new tests:
- `public/assets/audio/bgm/cr_bgm_main-menu_v001.mp3`: 1,870,592 bytes
- `public/assets/audio/bgm/cr_bgm_vila-byte_battle_v001.mp3`: 3,402,203 bytes
- `public/assets/audio/bgm/cr_bgm_overtime_v001.mp3`: 1,432,361 bytes
- `public/assets/audio/bgm/cr_bgm_ranked-climax_v001.mp3`: 4,322,549 bytes
- `public/assets/audio/bgm/cr_bgm_arena-progression_v001.mp3`: 2,340,169 bytes
- `public/assets/audio/characters/cr_theme_mc-0001_bit-bug_v001.mp3`: 1,419,823 bytes

## Test and Build Results
- Added mappings for overtime to `audio-manager.test.js`.
- Added missing acceptance criteria tests for catalog verification, rigorous rigorous A1 -> B -> A2 rapid-switch state safety using request-generation protection, cleanup callback invalidation, manual mode, and unknown default.
- `npm test` completed successfully:
  - 39 total tests passing.
  - `AudioManager` suite passes (includes new tests).
  - No failures, errors, or warnings.
- `npm run build` completed successfully:
  - Built via Vite seamlessly with no warnings.

## Remaining Design Limitations
The current gameplay engine (`src/game/engine.js`) operates on a strict single-duration rule and lacks an implemented overtime phase logic. A match will currently end exactly when `remainingMs <= 0` resolving immediately to either a win, loss, or draw. The `overtime` track mapped in the audio manager will not trigger automatically in actual gameplay until the game engine implements true sudden-death capabilities yielding an `overtime` status or phase. The overtime track can currently only be validated via the manual menu or tests.
