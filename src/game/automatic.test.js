import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, stepGame, OPERATOR_BASTION_DURATION_MS } from './engine.js';

test('automatic play spends energy on hand cards in the legal player area', () => {
  const game = createGame();
  game.automaticEnabled = true;
  game.autoPassUntil=Number.MAX_SAFE_INTEGER;
  stepGame(game, 50);
  const allies = game.units.filter(u => u.team === 'player');
  assert.ok(allies.length);
  assert.ok(allies.every(u => u.y >= 307 && u.y <= 522));
  assert.ok(game.playerEnergy >= 0 && game.playerEnergy < 5);
  assert.equal(game.operatorBastionMs, OPERATOR_BASTION_DURATION_MS);
  assert.ok(allies.every(u => u.shield === 120));
});

test('automatic Bastion waits through expiry and the full 20-second recovery without stacking shields', () => {
  const game = createGame();
  game.automaticEnabled = true;
  game.autoPassUntil=Number.MAX_SAFE_INTEGER;
  game.enemyThinkMs = 1e9;
  game.playerHand=[];
  stepGame(game, 50);
  stepGame(game, 50);
  assert.equal(game.towers.find(t => t.id === 'player-core').shield, 180);
  for (let i = 0; i < 299; i++) stepGame(game, 50);
  assert.equal(game.operatorBastionMs,0);
  assert.equal(game.operatorCooldownMs,20000);
  assert.equal(game.towers.find(t => t.id === 'player-core').shield,0);
  for(let i=0;i<400;i++)stepGame(game,50);
  assert.equal(game.operatorBastionMs, OPERATOR_BASTION_DURATION_MS);
  assert.equal(game.towers.find(t => t.id === 'player-core').shield, 180);
});

test('disabled and finished games do not play automatically; restart defaults to manual', () => {
  const game = createGame();
  stepGame(game, 50);
  assert.equal(game.units.length, 0);
  assert.equal(game.operatorBastionMs, 0);
  game.automaticEnabled = true;
  game.status = 'finished';
  stepGame(game, 50);
  assert.equal(game.units.length, 0);
  assert.equal(createGame().automaticEnabled, false);
});

test('automatic defense responds to the invaded lane and waits for energy', () => {
  const game = createGame();
  game.automaticEnabled = true;
  game.autoPassUntil=Number.MAX_SAFE_INTEGER;
  game.playerEnergy = 0;
  stepGame(game, 50);
  assert.equal(game.units.length, 0);
  game.playerEnergy = 10;
  game.automaticThinkMs = 0;
  game.units.push({team:'enemy',hp:1000,x:272,y:420,damage:0,range:0,speed:0,attackLeftMs:1e9});
  stepGame(game, 50);
  assert.ok(game.units.some(u => u.team === 'player' && u.x > 180 && u.y >= 420));
});

test('automatic refuses an absent or expired pass even when its switch is forced on',()=>{
 for(const until of [undefined,0,Date.now()-1]){const g=createGame();g.autoPassUntil=until;g.automaticEnabled=true;stepGame(g,50);assert.equal(g.automaticEnabled,false);assert.equal(g.units.length,0);assert.equal(g.operatorBastionMs,0);}
});

