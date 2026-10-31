# Role and objective

Act as a senior game-audio/frontend engineer. Audit and complete the existing integration of the six canonical Crypt Royale MP3 tracks so every file is safely playable in the game, automatic mode selects the tracks appropriate to states the current engine actually exposes, and mobile browser autoplay restrictions are handled honestly. Make the smallest justified code changes.

# Canonical inputs

- Project root: `E:\Projetos\MonsterCrypt\Crypt-Royale`
- Existing implementation: `src/game/audio-manager.js`, `src/game/audio-manager.test.js`, `src/AudioControl.jsx`, `src/App.jsx`
- Canonical assets (do not rename, re-encode, overwrite, or relocate):
  - `public/assets/audio/bgm/cr_bgm_main-menu_v001.mp3`
  - `public/assets/audio/bgm/cr_bgm_vila-byte_battle_v001.mp3`
  - `public/assets/audio/bgm/cr_bgm_overtime_v001.mp3`
  - `public/assets/audio/bgm/cr_bgm_ranked-climax_v001.mp3`
  - `public/assets/audio/bgm/cr_bgm_arena-progression_v001.mp3`
  - `public/assets/audio/characters/cr_theme_mc-0001_bit-bug_v001.mp3`
- Current gameplay state authority: `src/game/engine.js` and `getHud()`.

# Allowed changes

- `src/game/audio-manager.js`
- `src/game/audio-manager.test.js`
- `src/AudioControl.jsx`
- `src/App.jsx` only if strictly necessary for audio state wiring
- New audio-focused tests under `src/`
- An audio integration report under `.orchestration/reports/`

# Forbidden actions

- Do not edit any MP3 bytes or filenames.
- Do not add a fake overtime mechanic or change match rules merely to trigger music.
- Do not alter rendering, towers, cards, Bit Bug art/animation, economy, wallet, Firebase, or production data.
- Do not delete or supersede history.
- Do not publish, deploy, upload, install packages, or contact external services.
- Do not replace the requested model or leave the project directory.

# Acceptance criteria

1. All six canonical files appear exactly once in the audio catalog with readable Portuguese labels and are accessible from the manual/test selector, so the user can immediately hear each track in-game.
2. Automatic mode is deterministic for current states: normal playing -> Vila Byte battle; final 30 seconds -> ranked climax; finished/player win -> arena progression; finished/loss or draw -> main menu. Overtime must be supported only when an explicit future-compatible state such as `status === 'overtime'` or `phase === 'overtime'` is supplied; do not fabricate that state in the engine.
3. Bit Bug theme remains directly selectable in manual mode. Do not interrupt battle BGM on every deployment unless there is an existing explicit design signal for doing so.
4. First user gesture unlocks audio on Android/desktop; rejected `play()` returns to a recoverable locked state. The control must clearly communicate when a gesture is still needed, what is playing, mute state, volume, and automatic/manual choice.
5. Switching tracks uses the existing safe crossfade behavior, does not leak timers/channels, and survives React StrictMode mount/unmount, visibility changes, mute during fade, and rapid state changes.
6. Preferences remain local, sanitized, and persisted. No telemetry.
7. Add/adjust tests for catalog file existence and non-zero size, all automatic mappings including future overtime, all six manual selections, unlock/rejection recovery, mute/visibility/crossfade lifecycle, and cleanup.
8. `npm test` and `npm run build` pass with no new warnings/errors.
9. Preserve the current responsive header and avoid enlarging it on mobile.

# Required evidence

Return a concise report containing:

- Exact changed-file list and why each changed.
- Automatic state-to-track mapping.
- Confirmation that every canonical MP3 path exists and its byte size.
- Tests added/updated and complete `npm test` / `npm run build` results.
- Any remaining design limitation, especially the fact that the current engine has no real overtime phase.
