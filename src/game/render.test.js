import test from 'node:test';
import assert from 'node:assert/strict';

const mockImages = [];
global.Image = class {
  constructor() {
    this.src = '';
    this.complete = false;
    this.naturalWidth = 0;
    this.naturalHeight = 0;
    mockImages.push(this);
  }
};
global.window = { innerWidth: 1024, matchMedia: () => ({ matches: false }) };

const { renderGame } = await import('./render.js');
const { createGame, stepGame } = await import('./engine.js');
const { resetOperatorRingVFX, tickRingVFX } = await import('./vfx-operator-ring.js');

function makeCtx() {
  const calls = [];
  return {
    calls,
    createLinearGradient: () => ({ addColorStop: () => {} }),
    fillRect: (x, y, w, h) => calls.push(h === 5 ? 'healthBar' : 'bg'),
    strokeRect: () => calls.push('strokeRect'),
    beginPath: () => {},
    rect: (...args) => calls.push(['rect', ...args]),
    clip: (rule) => calls.push(['clip', rule]),
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => calls.push('stroke'),
    fill: () => calls.push('fill'),
    save: () => calls.push('save'),
    restore: () => calls.push('restore'),
    translate: () => calls.push('translate'),
    scale: () => calls.push('scale'),
    ellipse: () => calls.push('ringVFX'),
    arc: () => calls.push('arc'),
    roundRect: () => calls.push('roundRect'),
    drawImage: () => calls.push('drawImage_body'),
    fillText: () => calls.push('fillText'),
    setLineDash: () => {},
  };
}

test('renderGame with image fallback', () => {
  const game = createGame();
  const ctx = makeCtx();
  
  renderGame(ctx, game, null);
  
  assert.ok(ctx.calls.includes('roundRect'), 'Should use roundRect fallback');
  assert.ok(!ctx.calls.includes('drawImage_body'), 'Should not draw image if incomplete');
});

test('renderGame drawing order: body -> ring -> health', () => {
  resetOperatorRingVFX();
  const game = createGame();
  const ctx = makeCtx();
  
  // Set all images to complete
  for (const img of mockImages) {
    img.complete = true;
    img.naturalWidth = 2048;
    img.naturalHeight = 2048;
  }
  
  // Isolate core towers to test core drawing order without guard auras interfering
  game.towers = game.towers.filter(t => t.type === 'core');
  for (const tower of game.towers) tower.shield = 500;
  tickRingVFX(220, game.towers);
  
  renderGame(ctx, game, null);
  
  assert.ok(ctx.calls.includes('drawImage_body'), 'Should draw core body sprite');
  assert.ok(ctx.calls.includes('ringVFX'), 'Should draw ring VFX');
  
  const bodyIndex = ctx.calls.indexOf('drawImage_body');
  const ringIndex = ctx.calls.indexOf('ringVFX');
  const healthIndex = ctx.calls.indexOf('healthBar', ringIndex); // Health drawn after ring
  
  assert.ok(bodyIndex < ringIndex, 'Body must be drawn before ring');
  assert.ok(ringIndex < healthIndex, 'Ring must be drawn before health bar');
});

test('enemy Operator Core visible bounding box is strictly within the arena', () => {
  resetOperatorRingVFX();
  const game = createGame();
  const ctx = makeCtx();
  
  for (const img of mockImages) {
    img.complete = true;
    img.naturalWidth = 2048;
    img.naturalHeight = 2048;
  }
  
  let enemyDrawY = null;
  let usedScale = null;
  ctx.drawImage = (img, x, y, w, h) => {
    ctx.calls.push('drawImage_body');
    if (y < 200) { 
      enemyDrawY = y;
      usedScale = w / 2048;
    }
  };
  
  renderGame(ctx, game, null);
  
  assert.ok(enemyDrawY !== null, 'Should draw enemy core');
  
  const bboxOpaqueTopY = 232;
  const visibleTop = enemyDrawY + bboxOpaqueTopY * usedScale;
  
  assert.ok(visibleTop >= 0, `Visible top (${visibleTop}) should not be cut off by arena top`);
});

test('ciclo de colapso da Operator Core na integração', async () => {
  resetOperatorRingVFX();
  const game = createGame();
  
  for (const img of mockImages) {
    img.complete = true;
    img.naturalWidth = 2048;
    img.naturalHeight = 2048;
  }

  const playerCore = game.towers.find((item) => item.id === 'player-core');
  const enemyCore = game.towers.find((item) => item.id === 'enemy-core');
  
  // Isola apenas as cores para o teste não esbarrar em elementos das guards
  game.towers = [playerCore, enemyCore];

  // O anel só existe durante o Bastião. Carrega o estado visual e então
  // remove o escudo para validar a dissolução/colapso durante a destruição.
  playerCore.shield = 500;
  tickRingVFX(220, game.towers);
  playerCore.shield = 0;

  playerCore.hp = 10;
  
  const ctx = makeCtx();
  const originalDrawImage = ctx.drawImage;
  let playerCoreDrawn = false;
  ctx.drawImage = (img, x, y, w, h) => {
    if (y > 300) playerCoreDrawn = true; // player core está em y > 300
    if (originalDrawImage) originalDrawImage(img, x, y, w, h);
  };
  
  let playerHealthDrawn = false;
  const originalFillRect = ctx.fillRect;
  ctx.fillRect = (x, y, w, h) => {
    if (h === 5 && y > 300) playerHealthDrawn = true;
    if (originalFillRect) originalFillRect(x, y, w, h);
  };

  let playerRingDrawn = false;
  const originalTranslate = ctx.translate;
  ctx.translate = (x, y) => {
    // Ring follows the current tower position: y = tower.y - 48.
    // Wreckage translates to tower.y.
    if (Math.abs(y - (playerCore.y - 48)) < 1) playerRingDrawn = true;
    if (originalTranslate) originalTranslate(x, y);
  };

  // Posiciona um inimigo ao lado da core do jogador para destrui-la
  const unit = {
    id: 'test-killer',
    cardId: 'bit-bug',
    team: 'enemy',
    x: playerCore.x,
    y: playerCore.y - 10,
    hp: 100, maxHp: 100,
    shield: 0, damage: 20, speed: 10, range: 20, attackMs: 100, attackLeftMs: 0,
    isMoving: false, animationMs: 0
  };
  game.units.push(unit);
  
  // Avança o jogo (isso deve causar o dano fatal e terminar a partida)
  stepGame(game, 100);
  assert.equal(playerCore.hp, 0, 'Core deveria ser destruída');
  assert.equal(game.status, 'finished', 'Partida deve estar finalizada');
  
  // Limpa as tropas para o teste de renderização não acusar barra de vida de tropas
  game.units.length = 0;

  // Renderiza logo após a destruição
  renderGame(ctx, game, null);
  
  assert.equal(playerCoreDrawn, false, 'Corpo da core destruída não deve ser desenhado');
  assert.equal(playerHealthDrawn, false, 'Barra de vida da core destruída não deve ser desenhada');
  assert.equal(playerRingDrawn, true, 'Anel deve ser desenhado durante o início do colapso');

  // Reseta as flags para verificar o sumiço do anel
  playerRingDrawn = false;
  
  // Chama stepGame() pós-finished até completar os 600 ms de colapso
  for (let i = 0; i < 7; i++) {
    stepGame(game, 100);
  }
  
  // Renderiza novamente após os 600ms
  renderGame(ctx, game, null);
  
  assert.equal(playerRingDrawn, false, 'Anel deve ter desaparecido após 600ms de colapso');
});

test('Guard Tower renders correctly with correct ordering, bounds, and scale', () => {
  resetOperatorRingVFX();
  const game = createGame();
  const ctx = makeCtx();
  
  for (const img of mockImages) {
    img.complete = true;
    img.naturalWidth = 2048;
    img.naturalHeight = 2048;
  }
  
  let guardDrawCount = 0;
  let guardAuraPlayerCount = 0;
  let guardAuraEnemyCount = 0;
  let currentFillStyle = '';
  
  Object.defineProperty(ctx, 'fillStyle', {
    set(val) { currentFillStyle = val; },
    get() { return currentFillStyle; }
  });
  
  const originalFill = ctx.fill;
  ctx.fill = () => {
    ctx.calls.push('fill');
    if (currentFillStyle === 'rgba(34, 211, 238, 0.4)') guardAuraPlayerCount++;
    if (currentFillStyle === 'rgba(251, 113, 133, 0.4)') guardAuraEnemyCount++;
  };
  
  const originalDrawImage = ctx.drawImage;
  ctx.drawImage = (img, x, y, w, h) => {
    ctx.calls.push('drawImage_body');
    if (w === 2048 * 0.03) {
      guardDrawCount++;
      const visibleLeft = x + 11.13;
      const visibleRight = x + 50.31;
      const visibleTop = y + 15.42;
      const visibleBottom = y + 59.4;
      assert.ok(visibleLeft >= 0 && visibleRight <= 360, 'Guard horizontal bbox out of bounds');
      assert.ok(visibleTop >= 0 && visibleBottom <= 560, 'Guard vertical bbox out of bounds');
    }
  };
  
  ctx.calls.length = 0;
  renderGame(ctx, game, null);
  
  assert.equal(guardDrawCount, 4, 'Exactly four guard sprite draws when all six towers live');
  assert.equal(guardAuraPlayerCount, 2, 'Two player auras drawn');
  assert.equal(guardAuraEnemyCount, 2, 'Two enemy auras drawn');
  
  const fillIndices = [];
  const drawIndices = [];
  const healthIndices = [];
  ctx.calls.forEach((call, index) => {
    if (call === 'fill') fillIndices.push(index);
    if (call === 'drawImage_body') drawIndices.push(index);
    if (call === 'healthBar') healthIndices.push(index);
  });
  
  assert.ok(fillIndices[0] < drawIndices[0], 'Aura must be drawn before sprite');
  assert.ok(drawIndices[0] < healthIndices[0], 'Sprite must be drawn before health bar');
});

test('Destroyed Guard and Fallback behaviors', () => {
  const game = createGame();
  const ctx = makeCtx();
  
  const playerLeftGuard = game.towers.find(t => t.id === 'player-left');
  playerLeftGuard.hp = 0; 
  
  for (const img of mockImages) {
    img.complete = false;
  }
  
  let fallbackGuardCount = 0;
  ctx.roundRect = (x, y, w, h, r) => {
    if (w === 38) fallbackGuardCount++;
  };
  
  renderGame(ctx, game, null);
  
  assert.equal(fallbackGuardCount, 3, 'Should draw exactly 3 fallback guards (1 destroyed)');
  assert.ok(!ctx.calls.includes('drawImage_body'), 'Should not draw any images when incomplete');
});

test('Data Mouse uses the approved four-direction sprite sheet', () => {
  const game = createGame();
  game.towers = [];
  game.units = [{
    id: 'data-mouse-test',
    cardId: 'data-mouse',
    team: 'player',
    x: 180,
    y: 300,
    hp: 290,
    maxHp: 290,
    shield: 0,
    color: '#94a3b8',
    glyph: 'DM',
    facing: 'left',
    isMoving: true,
    animationMs: 0,
  }];

  for (const image of mockImages) {
    image.complete = false;
    image.naturalWidth = 0;
    image.naturalHeight = 0;
  }
  const dataMouseImage = mockImages.find((image) => image.src.includes('data-mouse-spritesheet'));
  assert.ok(dataMouseImage, 'Data Mouse sprite image must be registered');
  dataMouseImage.complete = true;
  dataMouseImage.naturalWidth = 420;
  dataMouseImage.naturalHeight = 560;

  const ctx = makeCtx();
  const spriteCalls = [];
  ctx.drawImage = (...args) => spriteCalls.push(args);
  renderGame(ctx, game, null);

  assert.equal(spriteCalls.length, 1, 'Data Mouse should render exactly one sprite cell');
  assert.equal(spriteCalls[0][0], dataMouseImage);
  assert.deepEqual(spriteCalls[0].slice(1, 5), [0, 280, 140, 140], 'Left-facing Contact A must use row 2, column 0');
  assert.equal(ctx.calls.includes('arc'), false, 'Glyph fallback must not render when the sprite is ready');
});

test('Data Mouse keeps the glyph fallback while its image is unavailable', () => {
  const game = createGame();
  game.towers = [];
  game.units = [{
    id: 'data-mouse-fallback',
    cardId: 'data-mouse',
    team: 'player',
    x: 180,
    y: 300,
    hp: 290,
    maxHp: 290,
    shield: 0,
    color: '#94a3b8',
    glyph: 'DM',
    facing: 'up',
    isMoving: false,
    animationMs: 0,
  }];
  for (const image of mockImages) image.complete = false;

  const ctx = makeCtx();
  renderGame(ctx, game, null);

  assert.ok(ctx.calls.includes('arc'), 'Fallback circle should render until the sprite is available');
  assert.ok(ctx.calls.includes('fillText'), 'Fallback glyph should remain visible');
});

test('Code Slime uses its approved elastic four-direction sprite sheet', () => {
  const game = createGame();
  game.towers = [];
  game.units = [{
    id: 'code-slime-test',
    cardId: 'code-slime',
    team: 'player',
    x: 180,
    y: 300,
    hp: 145,
    maxHp: 145,
    shield: 0,
    color: '#4ade80',
    glyph: 'CS',
    facing: 'up',
    isMoving: true,
    animationMs: 0,
  }];

  for (const image of mockImages) {
    image.complete = false;
    image.naturalWidth = 0;
    image.naturalHeight = 0;
  }
  const codeSlimeImage = mockImages.find((image) => image.src.includes('code-slime-spritesheet'));
  assert.ok(codeSlimeImage, 'Code Slime sprite image must be registered');
  codeSlimeImage.complete = true;
  codeSlimeImage.naturalWidth = 420;
  codeSlimeImage.naturalHeight = 560;

  const ctx = makeCtx();
  const spriteCalls = [];
  ctx.drawImage = (...args) => spriteCalls.push(args);
  renderGame(ctx, game, null);

  assert.equal(spriteCalls.length, 1, 'Code Slime should render exactly one sprite cell');
  assert.equal(spriteCalls[0][0], codeSlimeImage);
  assert.deepEqual(spriteCalls[0].slice(1, 5), [0, 420, 140, 140], 'Up-facing Contact A must use row 3, column 0');
  assert.equal(ctx.calls.includes('arc'), false, 'Glyph fallback must not render when the Code Slime sprite is ready');
});

test('Circuit Hare animates the approved sheet in all directions and preserves its fallback', () => {
  const hareImage = mockImages.find(image => image.src.includes('circuit-hare-spritesheet'));
  assert.ok(hareImage, 'Circuit Hare sheet must be registered');
  const game = createGame();
  game.towers = [];
  const unit = { id: 'hare-test', cardId: 'circuit-hare', team: 'player', x: 180, y: 300, hp: 335, maxHp: 335, shield: 0, color: '#c084fc', glyph: 'CH', facing: 'down', isMoving: true, animationMs: 0 };
  game.units = [unit];
  for (const image of mockImages) image.complete = false;
  hareImage.complete = true;
  hareImage.naturalWidth = 420;
  hareImage.naturalHeight = 560;
  for (const [row, facing] of ['down', 'right', 'left', 'up'].entries()) {
    unit.facing = facing;
    for (const [tick, column] of [0, 1, 2, 1].entries()) {
      unit.animationMs = tick * 110;
      const calls = [];
      const ctx = makeCtx();
      ctx.drawImage = (...args) => calls.push(args);
      renderGame(ctx, game, null);
      assert.equal(calls.length, 1);
      assert.deepEqual(calls[0].slice(1, 5), [column * 140, row * 140, 140, 140]);
    }
  }
  unit.isMoving = false;
  unit.animationMs = 220;
  const idle = [];
  const idleCtx = makeCtx();
  idleCtx.drawImage = (...args) => idle.push(args);
  renderGame(idleCtx, game, null);
  assert.equal(idle[0][1], 140, 'Stationary hare uses the neutral frame');
  hareImage.complete = false;
  const fallback = makeCtx();
  renderGame(fallback, game, null);
  assert.ok(fallback.calls.includes('arc'));
  assert.ok(fallback.calls.includes('fillText'));
});

test('Pixel Pup uses its approved four-direction sprite sheet', () => {
  const game = createGame();
  game.towers = [];
  game.units = [{
    id: 'pixel-pup-test',
    cardId: 'pixel-pup',
    team: 'player',
    x: 180,
    y: 300,
    hp: 430,
    maxHp: 430,
    shield: 0,
    color: '#60a5fa',
    glyph: 'PP',
    facing: 'right',
    isMoving: true,
    animationMs: 0,
  }];

  for (const image of mockImages) {
    image.complete = false;
    image.naturalWidth = 0;
    image.naturalHeight = 0;
  }
  const pixelPupImage = mockImages.find((image) => image.src.includes('pixel-pup-spritesheet'));
  assert.ok(pixelPupImage, 'Pixel Pup sprite image must be registered');
  pixelPupImage.complete = true;
  pixelPupImage.naturalWidth = 420;
  pixelPupImage.naturalHeight = 560;

  const ctx = makeCtx();
  const spriteCalls = [];
  ctx.drawImage = (...args) => spriteCalls.push(args);
  renderGame(ctx, game, null);

  assert.equal(spriteCalls.length, 1, 'Pixel Pup should render exactly one sprite cell');
  assert.equal(spriteCalls[0][0], pixelPupImage);
  assert.deepEqual(spriteCalls[0].slice(1, 5), [0, 140, 140, 140], 'Right-facing Contact A must use row 1, column 0');
  assert.equal(ctx.calls.includes('arc'), false, 'Glyph fallback must not render when the Pixel Pup sprite is ready');
});

test('Pixel Pup keeps the glyph fallback while its image is unavailable', () => {
  const game = createGame();
  game.towers = [];
  game.units = [{
    id: 'pixel-pup-fallback',
    cardId: 'pixel-pup',
    team: 'player',
    x: 180,
    y: 300,
    hp: 430,
    maxHp: 430,
    shield: 0,
    color: '#60a5fa',
    glyph: 'PP',
    facing: 'down',
    isMoving: false,
    animationMs: 0,
  }];
  for (const image of mockImages) image.complete = false;

  const ctx = makeCtx();
  renderGame(ctx, game, null);

  assert.ok(ctx.calls.includes('arc'), 'Fallback circle should render until the sprite is available');
  assert.ok(ctx.calls.includes('fillText'), 'Fallback glyph should remain visible');
});
test('Cache Crow animates the approved sheet in all directions and preserves its fallback', () => {
  const crowImage = mockImages.find(image => image.src.includes('cache-crow-spritesheet'));
  assert.ok(crowImage, 'Cache Crow sheet must be registered');
  const game = createGame();
  game.towers = [];
  const unit = { id: 'crow-test', cardId: 'cache-crow', team: 'player', x: 180, y: 300, hp: 155, maxHp: 155, shield: 0, color: '#c084fc', glyph: 'CH', facing: 'down', isMoving: true, animationMs: 0 };
  game.units = [unit];
  for (const image of mockImages) image.complete = false;
  crowImage.complete = true;
  crowImage.naturalWidth = 420;
  crowImage.naturalHeight = 560;
  for (const [row, facing] of ['down', 'right', 'left', 'up'].entries()) {
    unit.facing = facing;
    for (const [tick, column] of [0, 1, 2, 1].entries()) {
      unit.animationMs = tick * 140;
      const calls = [];
      const ctx = makeCtx();
      ctx.drawImage = (...args) => calls.push(args);
      renderGame(ctx, game, null);
      assert.equal(calls.length, 1);
      assert.deepEqual(calls[0].slice(1, 5), [column * 140, row * 140, 140, 140]);
    }
  }
  unit.isMoving = false;
  unit.animationMs = 420;
  const idle = [];
  const idleCtx = makeCtx();
  idleCtx.drawImage = (...args) => idle.push(args);
  renderGame(idleCtx, game, null);
  assert.equal(idle[0][1], 140, 'Stationary crow keeps the flight cycle');
  for (const [tick, column] of [0, 1, 2, 1].entries()) {
    unit.animationMs = tick * 140;
    const hoverCalls = [];
    const hoverCtx = makeCtx();
    hoverCtx.drawImage = (...args) => hoverCalls.push(args);
    renderGame(hoverCtx, game, null);
    assert.equal(hoverCalls[0][1], column * 140, 'Hovering crow flaps while stationary');
  }
  crowImage.complete = false;
  const fallback = makeCtx();
  renderGame(fallback, game, null);
  assert.ok(fallback.calls.includes('arc'));
  assert.ok(fallback.calls.includes('fillText'));
});



test('Byte Boar animates the approved sheet in all directions and preserves its fallback', () => {
  const boarImage = mockImages.find(image => image.src.includes('byte-boar-spritesheet'));
  assert.ok(boarImage, 'Byte Boar sheet must be registered');
  const game = createGame();
  game.towers = [];
  const unit = { id: 'boar-test', cardId: 'byte-boar', team: 'player', x: 180, y: 300, hp: 980, maxHp: 980, shield: 0, color: '#c084fc', glyph: 'CH', facing: 'down', isMoving: true, animationMs: 0 };
  game.units = [unit];
  for (const image of mockImages) image.complete = false;
  boarImage.complete = true;
  boarImage.naturalWidth = 420;
  boarImage.naturalHeight = 560;
  for (const [row, facing] of ['down', 'right', 'left', 'up'].entries()) {
    unit.facing = facing;
    for (const [tick, column] of [0, 1, 2, 1].entries()) {
      unit.animationMs = tick * 140;
      const calls = [];
      const ctx = makeCtx();
      ctx.drawImage = (...args) => calls.push(args);
      renderGame(ctx, game, null);
      assert.equal(calls.length, 1);
      assert.deepEqual(calls[0].slice(1, 5), [column * 140, row * 140, 140, 140]);
    }
  }
  unit.isMoving = false;
  unit.animationMs = 220;
  const idle = [];
  const idleCtx = makeCtx();
  idleCtx.drawImage = (...args) => idle.push(args);
  renderGame(idleCtx, game, null);
  assert.equal(idle[0][1], 140, 'Stationary boar uses the neutral frame');
  boarImage.complete = false;
  const fallback = makeCtx();
  renderGame(fallback, game, null);
  assert.ok(fallback.calls.includes('arc'));
  assert.ok(fallback.calls.includes('fillText'));
});


test('Socket Crab animates the approved sheet in all directions and preserves its fallback', () => {
  const crabImage = mockImages.find(image => image.src.includes('socket-crab-spritesheet'));
  assert.ok(crabImage, 'Socket Crab sheet must be registered');
  const game = createGame();
  game.towers = [];
  const unit = { id: 'crab-test', cardId: 'socket-crab', team: 'player', x: 180, y: 300, hp: 690, maxHp: 690, shield: 0, color: '#c084fc', glyph: 'CH', facing: 'down', isMoving: true, animationMs: 0 };
  game.units = [unit];
  for (const image of mockImages) image.complete = false;
  crabImage.complete = true;
  crabImage.naturalWidth = 420;
  crabImage.naturalHeight = 560;
  for (const [row, facing] of ['down', 'right', 'left', 'up'].entries()) {
    unit.facing = facing;
    for (const [tick, column] of [0, 1, 2, 1].entries()) {
      unit.animationMs = tick * 140;
      const calls = [];
      const ctx = makeCtx();
      ctx.drawImage = (...args) => calls.push(args);
      renderGame(ctx, game, null);
      assert.equal(calls.length, 1);
      assert.deepEqual(calls[0].slice(1, 5), [column * 140, row * 140, 140, 140]);
    }
  }
  unit.isMoving = false;
  unit.animationMs = 220;
  const idle = [];
  const idleCtx = makeCtx();
  idleCtx.drawImage = (...args) => idle.push(args);
  renderGame(idleCtx, game, null);
  assert.equal(idle[0][1], 140, 'Stationary crab uses the neutral frame');
  crabImage.complete = false;
  const fallback = makeCtx();
  renderGame(fallback, game, null);
  assert.ok(fallback.calls.includes('arc'));
  assert.ok(fallback.calls.includes('fillText'));
});


test('Copper Mole animates the approved sheet in all directions and preserves its fallback', () => {
  const moleImage = mockImages.find(image => image.src.includes('copper-mole-spritesheet'));
  assert.ok(moleImage, 'Copper Mole sheet must be registered');
  const game = createGame();
  game.towers = [];
  const unit = { id: 'mole-test', cardId: 'copper-mole', team: 'player', x: 180, y: 300, hp: 350, maxHp: 350, shield: 0, color: '#c084fc', glyph: 'CH', facing: 'down', isMoving: true, animationMs: 0 };
  game.units = [unit];
  for (const image of mockImages) image.complete = false;
  moleImage.complete = true;
  moleImage.naturalWidth = 420;
  moleImage.naturalHeight = 560;
  for (const [row, facing] of ['down', 'right', 'left', 'up'].entries()) {
    unit.facing = facing;
    for (const [tick, column] of [0, 1, 2, 1].entries()) {
      unit.animationMs = tick * 140;
      const calls = [];
      const ctx = makeCtx();
      ctx.drawImage = (...args) => calls.push(args);
      renderGame(ctx, game, null);
      assert.equal(calls.length, 1);
      assert.deepEqual(calls[0].slice(1, 5), [column * 140, row * 140, 140, 140]);
    }
  }
  unit.isMoving = false;
  unit.animationMs = 220;
  const idle = [];
  const idleCtx = makeCtx();
  idleCtx.drawImage = (...args) => idle.push(args);
  renderGame(idleCtx, game, null);
  assert.equal(idle[0][1], 140, 'Stationary mole uses the neutral frame');
  moleImage.complete = false;
  const fallback = makeCtx();
  renderGame(fallback, game, null);
  assert.ok(fallback.calls.includes('arc'));
  assert.ok(fallback.calls.includes('fillText'));
});


test('Fiber Finch animates the approved sheet in all directions and preserves its fallback', () => {
  const finchImage = mockImages.find(image => image.src.includes('fiber-finch-spritesheet'));
  assert.ok(finchImage, 'Fiber Finch sheet must be registered');
  const game = createGame();
  game.towers = [];
  const unit = { id: 'finch-test', cardId: 'fiber-finch', team: 'player', x: 180, y: 300, hp: 110, maxHp: 110, shield: 0, color: '#c084fc', glyph: 'CH', facing: 'down', isMoving: true, animationMs: 0 };
  game.units = [unit];
  for (const image of mockImages) image.complete = false;
  finchImage.complete = true;
  finchImage.naturalWidth = 420;
  finchImage.naturalHeight = 560;
  for (const [row, facing] of ['down', 'right', 'left', 'up'].entries()) {
    unit.facing = facing;
    for (const [tick, column] of [0, 1, 2, 1].entries()) {
      unit.animationMs = tick * 140;
      const calls = [];
      const ctx = makeCtx();
      ctx.drawImage = (...args) => calls.push(args);
      renderGame(ctx, game, null);
      assert.equal(calls.length, 1);
      assert.deepEqual(calls[0].slice(1, 5), [column * 140, row * 140, 140, 140]);
    }
  }
  unit.isMoving = false;
  unit.animationMs = 420;
  const idle = [];
  const idleCtx = makeCtx();
  idleCtx.drawImage = (...args) => idle.push(args);
  renderGame(idleCtx, game, null);
  assert.equal(idle[0][1], 140, 'Stationary finch keeps the flight cycle');
  for (const [tick, column] of [0, 1, 2, 1].entries()) {
    unit.animationMs = tick * 140;
    const hoverCalls = [];
    const hoverCtx = makeCtx();
    hoverCtx.drawImage = (...args) => hoverCalls.push(args);
    renderGame(hoverCtx, game, null);
    assert.equal(hoverCalls[0][1], column * 140, 'Hovering finch flaps while stationary');
  }
  finchImage.complete = false;
  const fallback = makeCtx();
  renderGame(fallback, game, null);
  assert.ok(fallback.calls.includes('arc'));
  assert.ok(fallback.calls.includes('fillText'));
});




test('Patch Toad animates the approved sheet in all directions and preserves its fallback', () => {
  const toadImage = mockImages.find(image => image.src.includes('patch-toad-spritesheet'));
  assert.ok(toadImage, 'Patch Toad sheet must be registered');
  const game = createGame();
  game.towers = [];
  const unit = { id: 'toad-test', cardId: 'patch-toad', team: 'player', x: 180, y: 300, hp: 360, maxHp: 360, shield: 0, color: '#c084fc', glyph: 'CH', facing: 'down', isMoving: true, animationMs: 0 };
  game.units = [unit];
  for (const image of mockImages) image.complete = false;
  toadImage.complete = true;
  toadImage.naturalWidth = 420;
  toadImage.naturalHeight = 560;
  for (const [row, facing] of ['down', 'right', 'left', 'up'].entries()) {
    unit.facing = facing;
    for (const [tick, column] of [0, 1, 2, 1].entries()) {
      unit.animationMs = tick * 140;
      const calls = [];
      const ctx = makeCtx();
      ctx.drawImage = (...args) => calls.push(args);
      renderGame(ctx, game, null);
      assert.equal(calls.length, 1);
      assert.deepEqual(calls[0].slice(1, 5), [column * 140, row * 140, 140, 140]);
    }
  }
  unit.isMoving = false;
  unit.animationMs = 220;
  const idle = [];
  const idleCtx = makeCtx();
  idleCtx.drawImage = (...args) => idle.push(args);
  renderGame(idleCtx, game, null);
  assert.equal(idle[0][1], 140, 'Stationary toad uses the neutral frame');
  toadImage.complete = false;
  const fallback = makeCtx();
  renderGame(fallback, game, null);
  assert.ok(fallback.calls.includes('arc'));
  assert.ok(fallback.calls.includes('fillText'));
});


test('Logic Lizard animates the approved sheet in all directions and preserves its fallback', () => {
  const lizardImage = mockImages.find(image => image.src.includes('logic-lizard-spritesheet'));
  assert.ok(lizardImage, 'Logic Lizard sheet must be registered');
  const game = createGame();
  game.towers = [];
  const unit = { id: 'lizard-test', cardId: 'logic-lizard', team: 'player', x: 180, y: 300, hp: 390, maxHp: 390, shield: 0, color: '#c084fc', glyph: 'CH', facing: 'down', isMoving: true, animationMs: 0 };
  game.units = [unit];
  for (const image of mockImages) image.complete = false;
  lizardImage.complete = true;
  lizardImage.naturalWidth = 420;
  lizardImage.naturalHeight = 560;
  for (const [row, facing] of ['down', 'right', 'left', 'up'].entries()) {
    unit.facing = facing;
    for (const [tick, column] of [0, 1, 2, 1].entries()) {
      unit.animationMs = tick * 140;
      const calls = [];
      const ctx = makeCtx();
      ctx.drawImage = (...args) => calls.push(args);
      renderGame(ctx, game, null);
      assert.equal(calls.length, 1);
      const clips = ctx.calls.filter(call => Array.isArray(call) && call[0] === 'clip');
      assert.deepEqual(clips, row === 1 && column === 1 ? [['clip', 'evenodd']] : [], 'Only the contaminated right idle cell is clipped');
      if (clips.length) {
        const rectangles = ctx.calls.filter(call => Array.isArray(call) && call[0] === 'rect');
        assert.equal(rectangles.length, 3, 'One full frame and two detached fragment holes');
        assert.ok(Math.abs(rectangles[1][3] - 8 * 0.46) < 1e-8);
        assert.ok(Math.abs(rectangles[2][4] - 29 * 0.46) < 1e-8);
      }
      assert.deepEqual(calls[0].slice(1, 5), [column * 140, row * 140, 140, 140]);
    }
  }
  unit.isMoving = false;
  unit.animationMs = 220;
  const idle = [];
  const idleCtx = makeCtx();
  idleCtx.drawImage = (...args) => idle.push(args);
  renderGame(idleCtx, game, null);
  assert.equal(idle[0][1], 140, 'Stationary lizard uses the neutral frame');
  lizardImage.complete = false;
  const fallback = makeCtx();
  renderGame(fallback, game, null);
  assert.ok(fallback.calls.includes('arc'));
  assert.ok(fallback.calls.includes('fillText'));
});



test('Kernel Goat animates the approved sheet in all directions and preserves its fallback', () => {
  const goatImage = mockImages.find(image => image.src.includes('kernel-goat-spritesheet'));
  assert.ok(goatImage, 'Kernel Goat sheet must be registered');
  const game = createGame();
  game.towers = [];
  const unit = { id: 'goat-test', cardId: 'kernel-goat', team: 'player', x: 180, y: 300, hp: 560, maxHp: 560, shield: 0, color: '#c084fc', glyph: 'KG', facing: 'down', isMoving: true, animationMs: 0 };
  game.units = [unit];
  for (const image of mockImages) image.complete = false;
  goatImage.complete = true;
  goatImage.naturalWidth = 420;
  goatImage.naturalHeight = 560;
  for (const [row, facing] of ['down', 'right', 'left', 'up'].entries()) {
    unit.facing = facing;
    for (const [tick, column] of [0, 1, 2, 1].entries()) {
      unit.animationMs = tick * 140;
      const calls = [];
      const ctx = makeCtx();
      ctx.drawImage = (...args) => calls.push(args);
      renderGame(ctx, game, null);
      assert.equal(calls.length, 1);
      assert.deepEqual(calls[0].slice(1, 5), [column * 140, row * 140, 140, 140]);
    }
  }
  unit.isMoving = false;
  unit.animationMs = 220;
  const idle = [];
  const idleCtx = makeCtx();
  idleCtx.drawImage = (...args) => idle.push(args);
  renderGame(idleCtx, game, null);
  assert.equal(idle[0][1], 140, 'Stationary goat uses the neutral frame');
  goatImage.complete = false;
  const fallback = makeCtx();
  renderGame(fallback, game, null);
  assert.ok(fallback.calls.includes('arc'));
  assert.ok(fallback.calls.includes('fillText'));
});

test('Packet Fox animates the approved sheet in all directions and preserves its fallback', () => {
  const foxImage = mockImages.find(image => image.src.includes('packet-fox-spritesheet'));
  assert.ok(foxImage, 'Packet Fox sheet must be registered');
  const game = createGame();
  game.towers = [];
  const unit = { id: 'fox-test', cardId: 'packet-fox', team: 'player', x: 180, y: 300, hp: 330, maxHp: 330, shield: 0, color: '#c084fc', glyph: 'PF', facing: 'down', isMoving: true, animationMs: 0 };
  game.units = [unit];
  for (const image of mockImages) image.complete = false;
  foxImage.complete = true;
  foxImage.naturalWidth = 420;
  foxImage.naturalHeight = 560;
  for (const [row, facing] of ['down', 'right', 'left', 'up'].entries()) {
    unit.facing = facing;
    for (const [tick, column] of [0, 1, 2, 1].entries()) {
      unit.animationMs = tick * 140;
      const calls = [];
      const ctx = makeCtx();
      ctx.drawImage = (...args) => calls.push(args);
      renderGame(ctx, game, null);
      assert.equal(calls.length, 1);
      assert.deepEqual(calls[0].slice(1, 5), [column * 140, row * 140, 140, 140]);
    }
  }
  unit.isMoving = false;
  unit.animationMs = 220;
  const idle = [];
  const idleCtx = makeCtx();
  idleCtx.drawImage = (...args) => idle.push(args);
  renderGame(idleCtx, game, null);
  assert.equal(idle[0][1], 140, 'Stationary fox uses the neutral frame');
  foxImage.complete = false;
  const fallback = makeCtx();
  renderGame(fallback, game, null);
  assert.ok(fallback.calls.includes('arc'));
  assert.ok(fallback.calls.includes('fillText'));
});

test('Buffer Bison animates the approved sheet in all directions and preserves its fallback', () => {
  const bisonImage = mockImages.find(image => image.src.includes('buffer-bison-spritesheet'));
  assert.ok(bisonImage, 'Buffer Bison sheet must be registered');
  const game = createGame();
  game.towers = [];
  const unit = { id: 'bison-test', cardId: 'buffer-bison', team: 'player', x: 180, y: 300, hp: 880, maxHp: 880, shield: 0, color: '#c084fc', glyph: 'BB', facing: 'down', isMoving: true, animationMs: 0 };
  game.units = [unit];
  for (const image of mockImages) image.complete = false;
  bisonImage.complete = true;
  bisonImage.naturalWidth = 420;
  bisonImage.naturalHeight = 560;
  for (const [row, facing] of ['down', 'right', 'left', 'up'].entries()) {
    unit.facing = facing;
    for (const [tick, column] of [0, 1, 2, 1].entries()) {
      unit.animationMs = tick * 160;
      const calls = [];
      const ctx = makeCtx();
      ctx.drawImage = (...args) => calls.push(args);
      renderGame(ctx, game, null);
      assert.equal(calls.length, 1);
      assert.deepEqual(calls[0].slice(1, 5), [column * 140, row * 140, 140, 140]);
    }
  }
  unit.isMoving = false;
  unit.animationMs = 220;
  const idle = [];
  const idleCtx = makeCtx();
  idleCtx.drawImage = (...args) => idle.push(args);
  renderGame(idleCtx, game, null);
  assert.equal(idle[0][1], 140, 'Stationary bison uses the neutral frame');
  bisonImage.complete = false;
  const fallback = makeCtx();
  renderGame(fallback, game, null);
  assert.ok(fallback.calls.includes('arc'));
  assert.ok(fallback.calls.includes('fillText'));
});

test('Cache Mantis animates the approved sheet in all directions and preserves its fallback', () => {
  const mantisImage = mockImages.find(image => image.src.includes('cache-mantis-spritesheet'));
  assert.ok(mantisImage, 'Cache Mantis sheet must be registered');
  const game = createGame();
  game.towers = [];
  const unit = { id: 'mantis-test', cardId: 'cache-mantis', team: 'player', x: 180, y: 300, hp: 320, maxHp: 320, shield: 0, color: '#c084fc', glyph: 'CM', facing: 'down', isMoving: true, animationMs: 0 };
  game.units = [unit];
  for (const image of mockImages) image.complete = false;
  mantisImage.complete = true;
  mantisImage.naturalWidth = 420;
  mantisImage.naturalHeight = 560;
  for (const [row, facing] of ['down', 'right', 'left', 'up'].entries()) {
    unit.facing = facing;
    for (const [tick, column] of [0, 1, 2, 1].entries()) {
      unit.animationMs = tick * 140;
      const calls = [];
      const ctx = makeCtx();
      ctx.drawImage = (...args) => calls.push(args);
      renderGame(ctx, game, null);
      assert.equal(calls.length, 1);
      assert.deepEqual(calls[0].slice(1, 5), [column * 140, row * 140, 140, 140]);
    }
  }
  unit.isMoving = false;
  unit.animationMs = 220;
  const idle = [];
  const idleCtx = makeCtx();
  idleCtx.drawImage = (...args) => idle.push(args);
  renderGame(idleCtx, game, null);
  assert.equal(idle[0][1], 140, 'Stationary mantis uses the neutral frame');
  mantisImage.complete = false;
  const fallback = makeCtx();
  renderGame(fallback, game, null);
  assert.ok(fallback.calls.includes('arc'));
  assert.ok(fallback.calls.includes('fillText'));
});

test('Bit Bug refresh animates the approved sheet in all directions and preserves its fallback', () => {
  const bugImage = mockImages.find(image => image.src.includes('bit-bug-spritesheet'));
  assert.ok(bugImage, 'Bit Bug refresh sheet must be registered');
  const game = createGame();
  game.towers = [];
  const unit = { id: 'bug-test', cardId: 'bit-bug', team: 'player', x: 180, y: 300, hp: 95, maxHp: 95, shield: 0, color: '#c084fc', glyph: 'BB', facing: 'down', isMoving: true, animationMs: 0 };
  game.units = [unit];
  for (const image of mockImages) image.complete = false;
  bugImage.complete = true;
  bugImage.naturalWidth = 420;
  bugImage.naturalHeight = 560;
  for (const [row, facing] of ['down', 'right', 'left', 'up'].entries()) {
    unit.facing = facing;
    for (const [tick, column] of [0, 1, 2, 1].entries()) {
      unit.animationMs = tick * 110;
      const calls = [];
      const ctx = makeCtx();
      ctx.drawImage = (...args) => calls.push(args);
      renderGame(ctx, game, null);
      assert.equal(calls.length, 1);
      assert.deepEqual(calls[0].slice(1, 5), [column * 140, row * 140, 140, 140]);
    }
  }
  unit.isMoving = false;
  unit.animationMs = 220;
  const idle = [];
  const idleCtx = makeCtx();
  idleCtx.drawImage = (...args) => idle.push(args);
  renderGame(idleCtx, game, null);
  assert.equal(idle[0][1], 140, 'Stationary bug uses the neutral frame');
  bugImage.complete = false;
  const fallback = makeCtx();
  renderGame(fallback, game, null);
  assert.ok(fallback.calls.includes('arc'));
  assert.ok(fallback.calls.includes('fillText'));
});

test('Data Mouse refresh animates the approved sheet in all directions and preserves its fallback', () => {
  const mouseImage = mockImages.find(image => image.src.includes('data-mouse-spritesheet'));
  assert.ok(mouseImage, 'Data Mouse refresh sheet must be registered');
  const game = createGame();
  game.towers = [];
  const unit = { id: 'mouse-test', cardId: 'data-mouse', team: 'player', x: 180, y: 300, hp: 290, maxHp: 290, shield: 0, color: '#c084fc', glyph: 'DM', facing: 'down', isMoving: true, animationMs: 0 };
  game.units = [unit];
  for (const image of mockImages) image.complete = false;
  mouseImage.complete = true;
  mouseImage.naturalWidth = 420;
  mouseImage.naturalHeight = 560;
  for (const [row, facing] of ['down', 'right', 'left', 'up'].entries()) {
    unit.facing = facing;
    for (const [tick, column] of [0, 1, 2, 1].entries()) {
      unit.animationMs = tick * 160;
      const calls = [];
      const ctx = makeCtx();
      ctx.drawImage = (...args) => calls.push(args);
      renderGame(ctx, game, null);
      assert.equal(calls.length, 1);
      assert.deepEqual(calls[0].slice(1, 5), [column * 140, row * 140, 140, 140]);
    }
  }
  unit.isMoving = false;
  unit.animationMs = 220;
  const idle = [];
  const idleCtx = makeCtx();
  idleCtx.drawImage = (...args) => idle.push(args);
  renderGame(idleCtx, game, null);
  assert.equal(idle[0][1], 140, 'Stationary mouse uses the neutral frame');
  mouseImage.complete = false;
  const fallback = makeCtx();
  renderGame(fallback, game, null);
  assert.ok(fallback.calls.includes('arc'));
  assert.ok(fallback.calls.includes('fillText'));
});
test('Code Slime refresh animates the approved sheet in all directions and preserves its fallback', () => {
  const slimeImage = mockImages.find(image => image.src.includes('code-slime-spritesheet'));
  assert.ok(slimeImage, 'Code Slime refresh sheet must be registered');
  const game = createGame();
  game.towers = [];
  const unit = { id: 'slime-test', cardId: 'code-slime', team: 'player', x: 180, y: 300, hp: 290, maxHp: 290, shield: 0, color: '#c084fc', glyph: 'DM', facing: 'down', isMoving: true, animationMs: 0 };
  game.units = [unit];
  for (const image of mockImages) image.complete = false;
  slimeImage.complete = true;
  slimeImage.naturalWidth = 420;
  slimeImage.naturalHeight = 560;
  for (const [row, facing] of ['down', 'right', 'left', 'up'].entries()) {
    unit.facing = facing;
    for (const [tick, column] of [0, 1, 2, 1].entries()) {
      unit.animationMs = tick * 150;
      const calls = [];
      const ctx = makeCtx();
      ctx.drawImage = (...args) => calls.push(args);
      renderGame(ctx, game, null);
      assert.equal(calls.length, 1);
      assert.deepEqual(calls[0].slice(1, 5), [column * 140, row * 140, 140, 140]);
    }
  }
  unit.isMoving = false;
  unit.animationMs = 220;
  const idle = [];
  const idleCtx = makeCtx();
  idleCtx.drawImage = (...args) => idle.push(args);
  renderGame(idleCtx, game, null);
  assert.equal(idle[0][1], 140, 'Stationary slime uses the neutral frame');
  slimeImage.complete = false;
  const fallback = makeCtx();
  renderGame(fallback, game, null);
  assert.ok(fallback.calls.includes('arc'));
  assert.ok(fallback.calls.includes('fillText'));
});

test('Pixel Pup refresh animates the approved sheet in all directions and preserves its fallback', () => {
  const pupImage = mockImages.find(image => image.src.includes('pixel-pup-spritesheet'));
  assert.ok(pupImage, 'Pixel Pup refresh sheet must be registered');
  const game = createGame();
  game.towers = [];
  const unit = { id: 'pup-test', cardId: 'pixel-pup', team: 'player', x: 180, y: 300, hp: 290, maxHp: 290, shield: 0, color: '#c084fc', glyph: 'PP', facing: 'down', isMoving: true, animationMs: 0 };
  game.units = [unit];
  for (const image of mockImages) image.complete = false;
  pupImage.complete = true;
  pupImage.naturalWidth = 420;
  pupImage.naturalHeight = 560;
  for (const [row, facing] of ['down', 'right', 'left', 'up'].entries()) {
    unit.facing = facing;
    for (const [tick, column] of [0, 1, 2, 1].entries()) {
      unit.animationMs = tick * 140;
      const calls = [];
      const ctx = makeCtx();
      ctx.drawImage = (...args) => calls.push(args);
      renderGame(ctx, game, null);
      assert.equal(calls.length, 1);
      assert.deepEqual(calls[0].slice(1, 5), [column * 140, row * 140, 140, 140]);
    }
  }
  unit.isMoving = false;
  unit.animationMs = 220;
  const idle = [];
  const idleCtx = makeCtx();
  idleCtx.drawImage = (...args) => idle.push(args);
  renderGame(idleCtx, game, null);
  assert.equal(idle[0][1], 140, 'Stationary pup uses the neutral frame');
  pupImage.complete = false;
  const fallback = makeCtx();
  renderGame(fallback, game, null);
  assert.ok(fallback.calls.includes('arc'));
  assert.ok(fallback.calls.includes('fillText'));
});


