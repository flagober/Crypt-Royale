import test from 'node:test';
import assert from 'node:assert/strict';
import {
  activateOperator,
  createGame,
  deployCard,
  MATCH_DURATION_MS,
  OPERATOR_BASTION_DURATION_MS,
  stepGame,
} from './engine.js';

test('não permite posicionar tropa do jogador no campo inimigo', () => {
  const game = createGame();
  const result = deployCard(game, 'bit-bug', 90, 100);
  assert.equal(result.ok, false);
  assert.equal(game.units.length, 0);
  assert.equal(game.playerEnergy, 5);
});

test('jogar uma carta desconta energia, cria tropa e gira a mão', () => {
  const game = createGame();
  const firstHand = [...game.playerHand];
  const result = deployCard(game, firstHand[0], 90, 400);
  assert.equal(result.ok, true);
  assert.equal(game.playerEnergy, 3);
  assert.equal(game.units.length, 3);
  assert.equal(game.units[0].facing, 'up');
  assert.equal(game.units[0].animationMs, 0);
  assert.notEqual(game.playerHand[0], firstHand[0]);
  assert.equal(game.playerQueue.at(-1), firstHand[0]);
});

test('unidade registra direção e animação enquanto caminha', () => {
  const game = createGame();
  deployCard(game, 'bit-bug', 90, 400);
  stepGame(game, 100);
  assert.equal(game.units[0].isMoving, true);
  assert.equal(game.units[0].facing, 'up');
  assert.equal(game.units[0].animationMs, 100);
});

test('energia nunca ultrapassa dez', () => {
  const game = createGame();
  game.playerEnergy = 9.9;
  for (let i = 0; i < 100; i++) stepGame(game, 100);
  assert.equal(game.playerEnergy, 10);
});

test('partida termina ao atingir o tempo limite', () => {
  const game = createGame();
  game.nowMs = MATCH_DURATION_MS - 50;
  stepGame(game, 50);
  assert.equal(game.status, 'finished');
  assert.equal(game.winner, 'draw');
});

test('Bastião remove os escudos quando sua duração termina', () => {
  const game = createGame();
  game.enemyThinkMs = Number.POSITIVE_INFINITY;
  assert.equal(activateOperator(game), true);
  assert.equal(game.operatorBastionMs, OPERATOR_BASTION_DURATION_MS);
  assert.ok(game.towers.filter((tower) => tower.team === 'player').every((tower) => tower.shield > 0));

  for (let elapsed = 0; elapsed < OPERATOR_BASTION_DURATION_MS - 100; elapsed += 100) {
    stepGame(game, 100);
  }
  assert.ok(game.towers.filter((tower) => tower.team === 'player').every((tower) => tower.shield > 0));

  stepGame(game, 100);
  assert.equal(game.operatorBastionMs, 0);
  assert.ok(game.towers.filter((tower) => tower.team === 'player').every((tower) => tower.shield === 0));
  assert.equal(game.message, 'Bastião do Operador encerrado.');
});

test('atividades registram somente cartas do jogador e mantêm uso automático irreversível na partida', () => {
  const game = createGame();
  deployCard(game, 'bit-bug', 90, 400);
  deployCard(game, 'data-mouse', 90, 100, 'enemy');
  assert.deepEqual(game.activityStats.cardsUsed, { 'bit-bug': 1 });
  game.automaticEnabled = true; stepGame(game, 50); game.automaticEnabled = false; stepGame(game, 50);
  assert.equal(game.activityStats.automaticUsed, true);
});
test('dano das atividades ignora escudo e limita excesso de dano ao HP real da torre', () => {
  const game = createGame(); game.enemyThinkMs = Infinity;
  deployCard(game, 'bit-bug', 90, 400);
  const unit = game.units[0], tower = game.towers.find(t => t.id === 'enemy-left');
  game.units = [unit]; unit.hp = 10000; unit.x = tower.x; unit.y = tower.y + 22; unit.damage = 10000; tower.hp = 15; tower.shield = 20000;
  stepGame(game, 50); assert.equal(game.activityStats.towerDamage, 0);
  tower.shield = 0; unit.attackLeftMs = 0; stepGame(game, 50);
  assert.equal(game.activityStats.towerDamage, 15);
});
