import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, stepGame } from './engine.js';
import { CARD_BY_ID } from './cards.js';
import { CORROSION, onUnitDefeated, tickCorrosion, effectiveSpeed } from './abilities.js';
import { drawBattleEffects } from './battle-effects.js';

function unit(id, cardId = 'pixel-pup', team = 'enemy', x = 80) {
  const card = CARD_BY_ID[cardId];
  return { ...card, id, cardId, team, x, y: 330, maxHp: card.hp, shield: 0, damage: 0, speed: 0, attackLeftMs: 1e9, isMoving: false, facing: 'up', animationMs: 0 };
}
const hurt = (g, u, amount) => { u.hp = Math.max(0, u.hp - amount); };
function setup() {
  const game = createGame(); game.enemyThinkMs = 1e9;
  onUnitDefeated(game, unit('slime', 'code-slime', 'player'));
  return game;
}
function advance(game, ms) {
  for (let remaining = ms; remaining > 0;) { const dt = Math.min(100, remaining); stepGame(game, dt); remaining -= dt; }
}
test('Corrosion waits 500ms, pulses six times over 3s, expires, and can defeat a unit in real combat', () => {
  const game = setup(), victim = unit('victim'); victim.hp = 48; game.units = [victim];
  advance(game, 499); assert.equal(victim.hp, 48); assert.equal(game.effects.filter(e => e.id === 'corrosion-hit').length, 0);
  advance(game, 1); assert.equal(victim.hp, 40); assert.equal(game.effects.at(-1).amount, 8);
  advance(game, 2499); assert.equal(victim.hp, 8); assert.equal(game.zones.length, 1);
  advance(game, 1); assert.equal(victim.hp, 0); assert.equal(game.units.length, 0); assert.equal(game.zones.length, 0);
  assert.equal(game.towers[0].hp, game.towers[0].maxHp);
});
test('Overlapping pools never stack damage or slow; each enemy has its own contact clock', () => {
  const game = setup(), a = unit('a'), b = unit('b'); a.speed = b.speed = 52;
  game.units = [a]; tickCorrosion(game, 0, hurt);
  onUnitDefeated(game, unit('slime2', 'code-slime', 'player'));
  game.nowMs = 500; tickCorrosion(game, 500, hurt); assert.equal(a.hp, a.maxHp - 8);
  game.units.push(b); tickCorrosion(game, 0, hurt); assert.equal(b.hp, b.maxHp);
  game.nowMs = 1000; tickCorrosion(game, 500, hurt);
  assert.equal(a.hp, a.maxHp - 16); assert.equal(b.hp, b.maxHp - 8);
  assert.equal(effectiveSpeed(game, a), 52 * 0.85);
});
test('Allies, both flying species, structures, defeated units and units outside radius are immune', () => {
  const game = setup();
  const ally = unit('ally', 'pixel-pup', 'player'), crow = unit('crow', 'cache-crow'), finch = unit('finch', 'fiber-finch'), outside = unit('outside', 'pixel-pup', 'enemy', 109), dead = unit('dead'); dead.hp = 0;
  const tower = { ...unit('structure'), type: 'guard' }; game.units = [ally, crow, finch, outside, dead, tower];
  const before = game.units.map(u => u.hp); tickCorrosion(game, 0, hurt); game.nowMs = 1000; tickCorrosion(game, 1000, hurt);
  assert.deepEqual(game.units.map(u => u.hp), before); assert.equal(Object.keys(game.corrosionContacts).length, 0);
  crow.speed = 58; assert.equal(effectiveSpeed(game, crow), 58);
});
test('Leaving stops damage immediately and re-entering waits a new full interval', () => {
  const game = setup(), u = unit('victim'); game.units = [u]; tickCorrosion(game, 0, hurt);
  game.nowMs = 400; tickCorrosion(game, 400, hurt); u.x = 120; game.nowMs = 500; tickCorrosion(game, 100, hurt); assert.equal(u.hp, u.maxHp);
  u.x = 80; game.nowMs = 600; tickCorrosion(game, 0, hurt); game.nowMs = 1099; tickCorrosion(game, 499, hurt); assert.equal(u.hp, u.maxHp);
  game.nowMs = 1100; tickCorrosion(game, 1, hurt); assert.equal(u.hp, u.maxHp - 8);
});
test('Frame crossing pool expiry preserves the final pulse; shield-only absorption shows no HP-loss flash', () => {
  const game = setup(), u = unit('victim'); game.units = [u];
  tickCorrosion(game, 0, hurt); game.nowMs = 2950; tickCorrosion(game, 2950, hurt); assert.equal(u.hp, u.maxHp - 40);
  game.nowMs = 3050; tickCorrosion(game, 100, hurt); assert.equal(u.hp, u.maxHp - 48);
  game.nowMs = 3150; tickCorrosion(game, 100, hurt); assert.equal(u.hp, u.maxHp - 48);
  const shieldGame = setup(), protectedUnit = unit('shielded'); protectedUnit.shield = 8; shieldGame.units = [protectedUnit];
  advance(shieldGame, 500); assert.equal(protectedUnit.hp, protectedUnit.maxHp); assert.equal(protectedUnit.shield, 0);
  assert.equal(shieldGame.effects.filter(e => e.id === 'corrosion-hit').length, 0);
  advance(shieldGame, 500); assert.equal(protectedUnit.hp, protectedUnit.maxHp - 8); assert.ok(protectedUnit.corrosionFlashUntil > shieldGame.nowMs);
});
test('Corrosion pauses with match, never damages twice at same timestamp and does not leak across matches', () => {
  const game = setup(), u = unit('victim'); game.units = [u]; advance(game, 500); const hp = u.hp;
  stepGame(game, 0); assert.equal(u.hp, hp); game.status = 'finished'; advance(game, 1000); assert.equal(u.hp, hp);
  assert.deepEqual(createGame().corrosionContacts, {}); assert.equal(CORROSION.damage, 8);
});
test('Bubble and HP-loss drawing is finite, balanced, reduced-motion compatible and state-free', () => {
  const game = setup(), u = unit('victim'); game.units = [u]; advance(game, 500);
  const before = JSON.stringify(game); let labels = 0;
  for (const reduced of [false, true]) {
    global.window = { matchMedia: () => ({ matches: reduced }) }; let depth = 0;
    const ctx = new Proxy({}, { get: (_, name) => (...args) => {
      if (name === 'save') depth++; if (name === 'restore') depth--;
      if (name === 'fillText' && String(args[0]).includes('8')) labels++;
      for (const arg of args) if (typeof arg === 'number') assert.ok(Number.isFinite(arg));
    }, set: () => true });
    drawBattleEffects(ctx, game); assert.equal(depth, 0);
  }
  delete global.window; assert.equal(labels, 2); assert.equal(JSON.stringify(game), before);
});
