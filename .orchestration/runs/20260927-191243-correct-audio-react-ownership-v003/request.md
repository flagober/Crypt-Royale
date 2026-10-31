# Role and objective

Act as a senior React 18 engineer. Make the smallest final correction to the audio lifecycle ownership so the existing manager is actually reattached during React StrictMode's effect setup -> cleanup -> setup sequence. This is correction run 3 and the final automated run for this audio objective.

# Canonical inputs and exact defect

Project: `E:\Projetos\MonsterCrypt\Crypt-Royale`

Inspect current:

- `src/App.jsx`
- `src/AudioControl.jsx`
- `src/game/audio-manager.js`
- `src/game/audio-manager.test.js`
- `src/main.jsx`

The previous correction added idempotent `AudioManager.attach()`, but the React ownership bug remains:

- `src/main.jsx` uses `React.StrictMode`.
- `AudioControl` obtains `const manager = getAudioManager()` during render.
- `App`'s interval effect cleanup calls `getAudioManager().dispose()`.
- During Strict Effects simulation, React reruns effect setup after cleanup without requiring a new render. The current `App` effect setup only creates the HUD interval and does not call `getAudioManager()` or `attach()`. Therefore the singleton disposed during simulated cleanup can remain detached on the second setup, while `AudioControl` retains the same object binding.
- The existing unit test only performs a manual `manager.attach() -> dispose() -> attach()` and therefore does not prove the actual component ownership path.

# Allowed changes

- Edit `src/App.jsx` and, only if truly necessary, `src/AudioControl.jsx`.
- Edit audio tests only for an accurate focused regression assertion.

# Required minimal correction

Acquire/attach the audio manager inside an effect setup that owns its cleanup, for example within the existing App effect setup or a dedicated App effect:

```js
useEffect(() => {
  const audioManager = getAudioManager(); // idempotently attaches on every effect setup
  // setup work
  return () => {
    // cleanup work
    audioManager.dispose();
  };
}, []);
```

The exact implementation may differ, but every setup must pair with cleanup and must reattach after a StrictMode simulated cleanup. Do not acquire only inside the cleanup callback.

# Forbidden actions

- Do not redesign the working audio manager, catalog, UI, crossfade, track mapping, game engine, rendering, art, or MP3 assets.
- Do not add dependencies or touch package files.
- No deployment, deletion, or external calls.

# Acceptance criteria

1. In `App`, every React effect lifecycle setup that will dispose the singleton must first acquire/attach that same manager during setup.
2. Preserve one manager singleton and no duplicated listeners/timers.
3. Existing 32 tests continue to pass; add a small test only if it provides real additional coverage without adding a React test dependency.
4. `npm test` and `npm run build` pass.
5. Return the exact changed lines/files and explicitly confirm the manager is no longer acquired only during cleanup.
