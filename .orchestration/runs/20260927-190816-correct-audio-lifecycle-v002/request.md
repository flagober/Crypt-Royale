# Role and objective

Act as a senior React/Vite game-audio engineer. Correct the already-integrated audio system so it is lifecycle-safe under React 18 StrictMode and mute/autoplay behavior remains correct during transitions. This is correction run 2 for the same audio objective.

# Canonical inputs and observed evidence

Project root: `E:\Projetos\MonsterCrypt\Crypt-Royale`

Inspect the current implementation in:

- `src/game/audio-manager.js`
- `src/game/audio-manager.test.js`
- `src/AudioControl.jsx`
- `src/App.jsx`
- `src/main.jsx`

Independent review found these concrete defects:

1. `src/main.jsx` wraps the application in `React.StrictMode`. `App` calls `getAudioManager().dispose()` from an effect cleanup. React's development Strict Effects cycle performs setup -> cleanup -> setup without guaranteeing a new manager binding in `AudioControl`. `dispose()` removes all unlock/visibility listeners and the singleton remains the same disposed object, so the second setup can leave playback permanently unable to unlock in the exact Vite development environment the user uses.
2. `_crossfade()` captures `targetVol`. If the user mutes or changes volume while `fadeIntervalId` exists, `_updateChannels()` deliberately skips direct volume changes, and the active fade can finish at the old captured volume. Mute must be immediate and authoritative even during a crossfade.
3. When `play()` rejects because autoplay is still blocked, the implementation leaves `unlocked=true`, removes all gesture listeners, and sets `currentTrackId` to the desired track. Later user gestures cannot retry playback.
4. When a tab becomes hidden during a fade, only the currently active channel is immediately paused; the other crossfade channel and interval may continue briefly. Both channels and timers should stop safely while hidden, then the desired track should resume cleanly when visible.

# Allowed changes

- Edit `src/game/audio-manager.js`, `src/game/audio-manager.test.js`, `src/AudioControl.jsx`, and `src/App.jsx` only as needed for the correction.
- Add focused deterministic tests for the four cases above.

# Forbidden actions

- Do not edit MP3 files, images, game engine/combat/render/VFX, package files, lockfiles, or unrelated UI.
- Do not add dependencies, publish, deploy, delete history, or make network calls.
- Preserve the six-track catalog, automatic mapping, selector, persistence, and 600 ms crossfade UX.

# Acceptance criteria

1. Define an explicit idempotent attach/start and detach/dispose lifecycle, or an equivalent robust design. After a StrictMode-like sequence `attach -> dispose/detach -> attach`, unlock and visibility listeners must be active exactly once and audio must still unlock/play.
2. React ownership must be clear: avoid one component disposing a singleton still referenced by another. No leaked event listeners, intervals, or Audio instances after genuine final unmount.
3. Muting during an active crossfade must synchronously set every existing channel volume to zero and keep it zero after the fade timer would have completed. Unmuting/volume changes must apply consistently.
4. A rejected `play()` must not produce an unhandled rejection and must re-arm a safe retry on a later genuine user gesture. The UI must not falsely claim that a rejected track is currently playing.
5. Hiding the document must clear/pause transition work and pause both channels. Returning visible must resume only the desired track, subject to autoplay rules, with at most two channels.
6. Add deterministic regression tests for StrictMode lifecycle reattachment, mute-during-crossfade, rejected-play retry, and hidden-during-crossfade. Tests must not rely on long real timers.
7. Run `npm test` and `npm run build`; all existing and new tests must pass.

# Required evidence

Return the exact changed-file list, explanation of each fix, full test totals, build result, and confirmation that no unrelated file or asset changed.
