# Role and objective

Fix one remaining, independently verified rapid-switch race in the audio manager. This is the final bounded correction for the six-track integration.

# Canonical inputs

- Project: `E:\Projetos\MonsterCrypt\Crypt-Royale`
- Current files: `src/game/audio-manager.js`, `src/game/audio-manager.test.js`
- Prior correction run: `.orchestration/runs/20260927-224005-integrate-six-audio-tracks-v001-correction-01/`

# Allowed changes

- `src/game/audio-manager.js`
- `src/game/audio-manager.test.js`
- `.orchestration/reports/audio-integration-report.md`

# Forbidden actions

- No changes to MP3s, UI, engine, rendering, gameplay, dependencies, or any unrelated file.
- No deletion, publication, deployment, upload, or install.

# Concrete race to fix

The current stale-promise guard compares only `this.currentTrackId !== targetTrackId`. That is insufficient for a rapid `A -> B -> A` sequence: the stale rejection/resolution from the first A sees the current ID is A again and can relock the manager or start an obsolete crossfade. Use a monotonically increasing request/generation token (or equivalent per-request identity) so only the latest `_applyDesiredTrack()` play attempt may mutate lock state or start its crossfade. Invalidate pending generations during disposal as well.

# Acceptance criteria

- Add a deterministic async test for unresolved `A1 -> B -> A2`, then reject A1; manager remains unlocked and A2 remains current/desirable.
- Also resolve stale callbacks in different orders and prove only the newest generation can initiate the final crossfade/state transition.
- Existing two-track rapid-switch test and all other tests remain green.
- Cleanup/dispose invalidates pending callbacks.
- `npm test` and `npm run build` pass.
- Update the report test total and mention request-generation protection.

# Required evidence

Return exact changed lines/files, new race test behavior, full test total, build result, and remaining limitations.
