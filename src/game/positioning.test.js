import test from 'node:test';
import assert from 'node:assert/strict';
import { attackPosition, separateUnits } from './positioning.js';
import { createGame, deployCard, stepGame } from './engine.js';

test('crowded units separate deterministically and remain inside arena', () => {
  const game = { towers: [], units: Array.from({ length: 8 }, (_, i) => ({ id: i, hp: 100, x: 18, y: 18 })) };
  for (let i = 0; i < 100; i++) separateUnits(game, 50);
  for (const unit of game.units) assert.ok(unit.x >= 18 && unit.y >= 18 && unit.x <= 342 && unit.y <= 542);
  const gaps = game.units.flatMap((a, i) => game.units.slice(i + 1).map(b => Math.hypot(a.x - b.x, a.y - b.y)));
  assert.ok(Math.min(...gaps) > 28);
});

test('attack positions spread around towers and preserve ranged distance', () => {
  const target = { id: 'tower', type: 'guard', x: 180, y: 200 };
  const units = Array.from({ length: 6 }, (_, id) => ({ id, hp: 100, x: 180, y: 300, range: 20 }));
  const game = { units };
  const points = units.map(unit => attackPosition(game, unit, target));
  assert.ok(new Set(points.map(p => p.x + ',' + p.y)).size >= 3);
  assert.ok(points.every(point => point.y >= target.y), 'approach the near side rather than circling behind');
  const ranged = { id: 8, hp: 100, x: 180, y: 300, range: 86 };
  const point = attackPosition(game, ranged, target);
  assert.ok(Math.hypot(point.x - target.x, point.y - target.y) > 90);
});

test('units stay in their deployment lane while pursuing and separating', () => {
  const game = createGame(); game.enemyThinkMs = Infinity;
  deployCard(game, 'bit-bug', 175, 320);
  deployCard(game, 'bit-bug', 185, 240, 'enemy');
  for (const tower of game.towers) tower.attackLeftMs = 1e9;
  for (let tick = 0; tick < 100; tick++) {
    stepGame(game, 100);
    for (const unit of game.units) assert.ok(unit.lane === 'left' ? unit.x <= 180 : unit.x >= 180);
  }
});

test('Data Mouse holds position and faces target when already in attack range', () => {
  const game = createGame(); game.enemyThinkMs = Infinity;
  deployCard(game, 'data-mouse', 88, 320);
  const mouse = game.units[0]; mouse.y = 170;
  for (const tower of game.towers) tower.attackLeftMs = 1e9;
  for (let tick = 0; tick < 10; tick++) stepGame(game, 100);
  assert.equal(mouse.x, 88); assert.equal(mouse.y, 170);
  assert.equal(mouse.isMoving, false); assert.equal(mouse.facing, 'up');
  assert.ok(game.towers[0].hp < game.towers[0].maxHp);
});

test('melee swarm approaches and damages tower without stacking or stopping outside range', () => {
  const game = createGame();
  game.enemyThinkMs = Infinity;
  deployCard(game, 'bit-bug', 88, 320);
  const target = game.towers[0];
  for (const tower of game.towers) tower.attackLeftMs = 1e9;
  for (let i = 0; i < 200; i++) stepGame(game, 100);
  assert.ok(target.hp < target.maxHp);
  assert.equal(game.units.length, 3);
  const gaps = game.units.flatMap((a, i) => game.units.slice(i + 1).map(b => Math.hypot(a.x - b.x, a.y - b.y)));
  assert.ok(Math.min(...gaps) > 25);
});

test('short-range enemies can exchange blows despite personal spacing', () => {
  const game = createGame();
  game.enemyThinkMs = Infinity;
  deployCard(game, 'bit-bug', 180, 320);
  deployCard(game, 'bit-bug', 180, 240, 'enemy');
  game.units = [game.units[1], game.units[4]];
  for (const tower of game.towers) tower.attackLeftMs = 1e9;
  for (let i = 0; i < 30; i++) stepGame(game, 100);
  assert.ok(game.units.some(unit => unit.hp < unit.maxHp));
});
