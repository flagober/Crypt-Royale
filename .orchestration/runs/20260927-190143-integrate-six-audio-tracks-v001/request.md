# Role and objective

Act as a senior React/Vite game-audio engineer. Integrate the six already-created MP3 tracks into the Crypt Royale prototype so they can be heard immediately in the game, with a safe automatic soundtrack mode plus a compact manual audition selector. Produce one cohesive, tested implementation only.

# Canonical inputs

Authorized project root: `E:\Projetos\MonsterCrypt\Crypt-Royale`

The exact authoritative audio files are:

- `public/assets/audio/bgm/cr_bgm_main-menu_v001.mp3`
- `public/assets/audio/bgm/cr_bgm_vila-byte_battle_v001.mp3`
- `public/assets/audio/bgm/cr_bgm_overtime_v001.mp3`
- `public/assets/audio/bgm/cr_bgm_ranked-climax_v001.mp3`
- `public/assets/audio/bgm/cr_bgm_arena-progression_v001.mp3`
- `public/assets/audio/characters/cr_theme_mc-0001_bit-bug_v001.mp3`

Authoritative application/game files include `src/App.jsx`, `src/game/engine.js`, and existing tests under `src/**/*.test.js`. Inspect them before editing. Do not rename, transcode, or rewrite the MP3 assets.

# Allowed changes

- Create a focused audio module and its tests under `src/game/` (for example `audio-manager.js` and `audio-manager.test.js`).
- Create a focused React audio-control component under `src/` if it improves separation.
- Edit `src/App.jsx` only as needed to synchronize soundtrack state and expose compact controls.
- Edit CSS only if needed for those controls.
- Edit existing tests or add focused tests when required.

# Forbidden actions

- Do not edit or replace any image, approved art, MP3, wallet, token, Firebase, marketplace, package lock, or economy file.
- Do not alter combat rules, match duration, card statistics, tower behavior, rendering, VFX, or arena geometry.
- Do not delete or supersede historical assets.
- Do not install dependencies, publish, deploy, access external services, or make network calls.
- Do not add a fake overtime state to the engine merely to use the overtime music.

# Acceptance criteria

1. Maintain one canonical catalog for all six tracks with stable IDs, human-readable Portuguese labels, URL paths, loop behavior, and intended role.
2. Default mode is `automatic`:
   - during a normal playing match, use Vila Byte battle;
   - during the final 30 seconds of a still-playing match, use ranked climax;
   - after a player victory, use arena progression;
   - after an enemy victory or draw, use main menu;
   - overtime and Bit Bug theme remain available in manual audition mode until those gameplay states genuinely exist.
3. Add a compact accessible soundtrack control that works on desktop and mobile without covering the arena permanently. It must provide:
   - mute/unmute;
   - volume control;
   - selection of Automatic plus each of the six tracks, so the user can listen to every track now;
   - clear current-track labeling.
4. Respect browser/mobile autoplay policy: audio starts only after a real user gesture and all rejected `play()` promises are handled without console errors. The first interaction anywhere in the app should unlock playback when possible.
5. Use smooth crossfades between different tracks (target 500-800 ms), never play more than the two crossfade channels, avoid duplicate restarts when the desired track has not changed, and loop BGM/manual audition tracks appropriately.
6. Restarting the game must return automatic mode to the battle track without leaking intervals, animation frames, or Audio instances.
7. Pause or safely reduce work while the page is hidden and resume the desired track after visibility returns, subject to autoplay restrictions.
8. Persist mute, volume, and selected soundtrack mode in `localStorage`, with defensive parsing and safe behavior when storage is unavailable.
9. The implementation must be SSR/Node-test safe: importing the audio module without `window`, `document`, or `Audio` must not throw.
10. Add deterministic unit tests covering at minimum: catalog integrity/URLs, automatic track selection, preference sanitization, no restart for unchanged desired track, rejected play handling, and cleanup/disposal. Existing tests must continue to pass.
11. Run `npm test` and `npm run build` successfully.

# Required evidence

Return:

- exact changed-file list;
- concise explanation of the runtime behavior and autoplay unlocking;
- commands executed and full pass/fail totals;
- any limitations, especially that overtime and the Bit Bug theme are manual previews until corresponding game events exist;
- confirmation that no MP3 or unrelated gameplay/art file was modified.
