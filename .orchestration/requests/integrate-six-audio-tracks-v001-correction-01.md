# Role and objective

Correct the incomplete verification from the previous audio integration job. Close only the concrete gaps listed below, preserving the six MP3 files and the already-good UI work.

# Canonical inputs

- Project: `E:\Projetos\MonsterCrypt\Crypt-Royale`
- Previous run: `.orchestration/runs/20260927-223643-integrate-six-audio-tracks-v001/`
- Current sources: `src/game/audio-manager.js`, `src/game/audio-manager.test.js`, `src/AudioControl.jsx`
- Canonical assets: the six existing MP3 paths in `AUDIO_CATALOG`.

# Allowed changes

- `src/game/audio-manager.js`
- `src/game/audio-manager.test.js`
- `src/AudioControl.jsx` only if a verified bug requires it
- `.orchestration/reports/audio-integration-report.md`

# Forbidden actions

- Do not edit MP3 files, engine rules, rendering, towers, cards, wallet, Firebase, dependencies, or unrelated files.
- Do not delete, publish, deploy, upload, or install anything.

# Concrete audit failures to correct

1. The prior acceptance criteria required a test that every catalog URL resolves to a real, non-empty file under `public/`; no such test was added.
2. It required testing all six manual selections; no such test was added.
3. It required a rapid-state-change test; no such test was added.
4. The report claims automatic default/outside-match selects `main-menu`, but `update(null)` currently selects `null`. Make implementation and report agree. Preferred behavior is `main-menu` for absent/unknown non-playing state because it is the canonical menu track.
5. Audit rapid `play()` promises so a stale rejection or resolution from an older track cannot incorrectly relock, pause, or override the newly desired/current track. Fix only if the new test demonstrates the issue.

# Acceptance criteria

- Add a portable Node test resolving each catalog URL against the project `public` directory and asserting the file exists and size > 0.
- Iterate through all six `TRACK_IDS` in manual mode and assert each becomes the desired track.
- Assert `update(null)` and an unknown/menu state select `main-menu` in automatic mode.
- Add an asynchronous rapid-switch test with controllable play promises and assert the latest desired track wins; stale callbacks do not relock or clear it.
- Preserve overtime future compatibility, unlock UX, crossfade, volume, preferences, and all existing tests.
- Run full `npm test` and `npm run build` successfully.
- Update the report to match the actual implementation and include exact test totals.

# Required evidence

Return exact changed files, tests added, full test/build outcome, and any remaining limitation.
