# Role and objective

Integrate the already approved MC-0010 Pixel Pup sprite sheet and production card art into Crypt Royale, following the existing Bit Bug, Data Mouse and Code Slime patterns. Deliver one tested source-code change.

# Canonical inputs

- Approved sprite: `E:\Projetos\MonsterCrypt\Crypt-Royale\public\assets\units\pixel-pup-spritesheet-v001.png`.
- Approved sprite metadata: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\sprite-sheets\approved\mc-0010\cr_mc-0010_pixel-pup_spritesheet_v001.json`.
- Production card art: `E:\Projetos\MonsterCrypt\Crypt-Royale\public\assets\cards\pixel-pup-card_v001.webp`.
- Existing integration patterns: `src/game/render.js`, `src/game/render.test.js`, and `src/game/cards.js`.

# Allowed changes

- Edit only `src/game/render.js`, `src/game/render.test.js`, and `src/game/cards.js`.
- Create `.orchestration/reports/mc-0010-pixel-pup-integration-v001.md`.

# Forbidden actions

- Do not modify any image, approved metadata, other card statistics, gameplay engine behavior, CSS, HTML, Firebase, wallet, economy, package dependencies or build configuration.
- Do not delete or rename assets.
- Do not start a persistent development server.

# Acceptance criteria

- Add Pixel Pup to the existing unit-sprite registry using `/assets/units/pixel-pup-spritesheet-v001.png`.
- Respect metadata: 3 columns, 4 rows ordered down/right/left/up, 140x140 cells, playback `[0,1,2,1]`, 140 ms per frame.
- Choose conservative display scale and health-bar offset based on the approved sprite's visible bbox, consistent with the existing creatures. Do not alter physics or hitboxes.
- Add `cardArt: '/assets/cards/pixel-pup-card_v001.webp'` to the existing Pixel Pup card object without changing its balance values.
- Add focused render tests proving the Pixel Pup sheet is loaded, correct source row and animation frame are selected, and image fallback remains safe before load/error.
- All existing tests pass and `npm run build` succeeds with no new warnings.

# Required evidence

- List exact changed lines/files and explain scale/health-offset choice.
- Report focused test, full test and build commands with results.
- State unresolved risks and confirm no files outside the allowed set were modified.
