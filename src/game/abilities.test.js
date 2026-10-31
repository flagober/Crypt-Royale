import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { CARDS, CARD_BY_ID } from './cards.js';
import { createGame, deployCard, stepGame, activateOperator } from './engine.js';
import { abilityState, performAbilityAttack, tickAbility, incomingMultiplier, effectiveSpeed, canTarget, onAcquireTarget, onUnitDefeated, emitBattleEffect } from './abilities.js';
import { drawTowerSpell } from './tower-effects.js';

function unit(cardId, team = 'player', x = 80, y = 330) {
  const c = CARD_BY_ID[cardId];
  return { ...c, cardId, id: cardId + '-' + team, x, y, team, maxHp: c.hp, shield: 0, attackLeftMs: 0, facing: 'up', isMoving: false, lane: 'left' };
}
const hit = (g, t, n) => { t.hp = Math.max(0, t.hp - n); };

test('Checksum counts the same target, resets on switching, and only every third shot gains damage', () => {
  const g = createGame(), u = unit('data-mouse'), t = unit('buffer-bison', 'enemy');
  for (let i = 0; i < 3; i++) performAbilityAttack(g, u, t, hit);
  assert.equal(t.hp, 880 - 58 * 3.2);
  const other = unit('byte-boar', 'enemy'); performAbilityAttack(g, u, other, hit);
  assert.equal(abilityState(u).shots, 1);
  assert.equal(g.effects.filter(e => e.id === u.cardId).length, 1);
});
test('Hotfix heals the most wounded nearby ally, caps HP, cannot heal self/enemy/structures', () => {
  const g = createGame(), toad = unit('patch-toad'), ally = unit('pixel-pup'), enemy = unit('pixel-pup', 'enemy');
  toad.hp = 100; ally.hp = 420; enemy.hp = 1; g.units = [toad, ally, enemy];
  tickAbility(g, toad); g.nowMs = 3999; tickAbility(g, toad); assert.equal(ally.hp, 420);
  g.nowMs = 4000; tickAbility(g, toad); assert.equal(ally.hp, 430); assert.equal(toad.hp, 100); assert.equal(enemy.hp, 1);
  assert.equal(g.effects.at(-1).id, 'patch-toad');
  g.nowMs = 8000; const count = g.effects.length; tickAbility(g, toad); assert.equal(g.effects.length, count);
});
test('Chain damage hits two distinct nearby enemies and never returns to a previous target', () => {
  const g = createGame(), lizard = unit('logic-lizard'), a = unit('byte-boar', 'enemy', 85, 300), b = unit('buffer-bison', 'enemy', 90, 310), c = unit('socket-crab', 'enemy', 95, 320);
  g.units = [lizard, a, b, c]; performAbilityAttack(g, lizard, a, hit);
  assert.equal(a.hp, 980 - 64); assert.equal(b.hp, 880 - 32); assert.equal(c.hp, 690 - 16);
});
test('Buffer is non-stacking and frontal Crab protection respects facing', () => {
  const g = createGame(), crab = unit('socket-crab'), attacker = unit('pixel-pup', 'enemy', 80, 300);
  crab.targetId = attacker.id; g.units = [crab, unit('buffer-bison'), { ...unit('buffer-bison'), id: 'buffer2' }];
  assert.ok(Math.abs(incomingMultiplier(g, crab, attacker) - 0.88 * 0.85) < 1e-9);
  attacker.y = 350; assert.equal(incomingMultiplier(g, crab, attacker), 0.88);
});
test('Camouflage waits two seconds, is revealed by Finch, and gives only one ambush bonus', () => {
  const g = createGame(), fox = unit('packet-fox', 'enemy', 80, 300), mouse = unit('data-mouse', 'player', 80, 360);
  tickAbility(g, fox); g.nowMs = 2000; tickAbility(g, fox); assert.equal(canTarget(g, mouse, fox), false);
  const finch = unit('fiber-finch'); assert.equal(canTarget(g, finch, fox), true); performAbilityAttack(g, finch, fox, hit); assert.equal(canTarget(g, mouse, fox), true);
  abilityState(fox).camouflaged = true; const t = unit('byte-boar');
  performAbilityAttack(g, fox, t, hit); assert.equal(t.hp, 980 - 90 * 1.4);
  performAbilityAttack(g, fox, t, hit); assert.equal(t.hp, 980 - 90 * 2.4);
});
test('Mantis dashes once within lane; Boar and Hare bonuses do not repeat; Goat respects aerial targets', () => {
  const g = createGame(), mantis = unit('cache-mantis'), enemy = unit('byte-boar', 'enemy', 175, 300);
  onAcquireTarget(g, mantis, enemy); const x = mantis.x, y = mantis.y; onAcquireTarget(g, mantis, enemy);
  assert.deepEqual([mantis.x, mantis.y], [x, y]); assert.ok(mantis.x <= 180);
  const tower = { id: 'tower', type: 'guard', hp: 2000, x: 80, y: 300 }, boar = unit('byte-boar');
  performAbilityAttack(g, boar, tower, hit); performAbilityAttack(g, boar, tower, hit); assert.equal(tower.hp, 2000 - 82 * 2.2);
  const hare = unit('circuit-hare'); abilityState(hare).walked = 60;
  const t = unit('byte-boar', 'enemy'); performAbilityAttack(g, hare, t, hit); performAbilityAttack(g, hare, t, hit); assert.equal(t.hp, 980 - 104 * 2.25);
  const goat = unit('kernel-goat'), bird = unit('cache-crow', 'enemy', 80, 300); const by = bird.y;
  performAbilityAttack(g, goat, bird, hit); assert.equal(bird.y, by);
  const ground = unit('byte-boar', 'enemy', 80, 300); performAbilityAttack(g, goat, ground, hit); assert.ok(ground.y < 300);
});
test('Slime residue expires, slows only enemies; tunnelling exits once; Pup and Bug speed buffs are conditional', () => {
  const g = createGame(), slime = unit('code-slime'), mouse = unit('data-mouse', 'enemy');
  g.units = [slime, mouse]; onUnitDefeated(g, slime); assert.equal(effectiveSpeed(g, mouse), mouse.speed * 0.85); assert.equal(effectiveSpeed(g, slime), slime.speed);
  g.nowMs = 3100; g.enemyThinkMs = 10000; stepGame(g, 0); assert.equal(g.zones.length, 0);
  const mole = unit('copper-mole'); g.nowMs = 0; assert.equal(tickAbility(g, mole), false); g.nowMs = 1200; tickAbility(g, mole); const my = mole.y; tickAbility(g, mole); assert.equal(mole.y, my);
  const pup = unit('pixel-pup'), ally = unit('data-mouse'); g.units = [pup, ally]; abilityState(ally).lastHurt = g.nowMs; tickAbility(g, pup); assert.equal(effectiveSpeed(g, pup), pup.speed * 1.2);
  const bug = unit('bit-bug'), other = { ...unit('bit-bug'), id: 'bug2' }; bug.targetId = other.targetId = 'same'; g.units = [bug, other]; assert.equal(effectiveSpeed(g, bug), bug.speed * 1.1);
});
test('Crow remembers a live target briefly and visual queues are bounded and reset per match', () => {
  const g = createGame(), crow = unit('cache-crow'), target = unit('byte-boar', 'enemy');
  performAbilityAttack(g, crow, target, hit); assert.equal(abilityState(crow).rememberUntil, 600);
  for (let i = 0; i < 200; i++) emitBattleEffect(g, 'basic-hit', crow, target);
  assert.equal(g.effects.length, 96); assert.equal(createGame().effects.length, 0);
  g.nowMs = 2000; g.units = []; g.enemyThinkMs = 10000; stepGame(g, 0); assert.equal(g.effects.length, 0);
});
test('Actual combat emits tower shots, special strikes, and Operator Bastion events', () => {
  const g = createGame(); g.enemyThinkMs = 10000; g.enemyEnergy = 10;
  deployCard(g, 'pixel-pup', 88, 240, 'enemy'); g.units[0].y = 400;
  stepGame(g, 100); assert.ok(g.effects.some(e => e.id === 'guard-tower'));
  g.units[0].y = 450; stepGame(g, 100); assert.ok(g.effects.some(e => e.id === 'operator-core'));
  activateOperator(g); assert.ok(g.effects.some(e => e.id === 'operator-bastion'));
});
test('Tower art draws finite coordinates, restores canvas, expires and matches the preview source', () => {
  assert.equal(fs.readFileSync(new URL('./tower-effects.js', import.meta.url), 'utf8'), fs.readFileSync(new URL('../../public/tower-effects.js', import.meta.url), 'utf8'));
  assert.equal(fs.readFileSync(new URL('./spell-art.js', import.meta.url), 'utf8'), fs.readFileSync(new URL('../../public/spell-effects.js', import.meta.url), 'utf8'));
  for (const id of ['operator-core', 'operator-bastion', 'guard-tower']) for (const reducedMotion of [false, true]) for (const ms of [0, 100, 400, 700, 1200]) {
    let depth = 0, calls = 0;
    const ctx = new Proxy({}, { get: (_, key) => (...args) => { calls++; if (key === 'save') depth++; if (key === 'restore') depth--; for (const arg of args) if (typeof arg === 'number') assert.ok(Number.isFinite(arg)); }, set: () => true });
    drawTowerSpell(ctx, id, ms, { casterX: 10, casterY: 20, x: 60, y: 90, reducedMotion }); assert.equal(depth, 0); if (ms === 1200) assert.equal(calls, 0);
  }
  assert.equal(CARDS.length, 16);
});
