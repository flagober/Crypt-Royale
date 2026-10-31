import test from 'node:test';import assert from 'node:assert/strict';
import {createGame,deployCard,stepGame} from './engine.js';import {CARD_BY_ID} from './cards.js';
function setup(cardId,team='player'){
 const game=createGame();game.enemyThinkMs=1e9;game.playerEnergy=game.enemyEnergy=10;game.playerHand[0]=cardId;
 for(const t of game.towers)t.attackLeftMs=1e9;
 const opponent=team==='player'?'enemy':'player';
 deployCard(game,cardId,58,team==='player'?430:130,team);const unit=game.units[0];
 deployCard(game,'pixel-pup',58,opponent==='player'?430:130,opponent);const blocker=game.units[1];
 Object.assign(blocker,{x:58,y:unit.y+(team==='player'?-30:30),speed:0,attackLeftMs:1e9});
 return {game,unit,blocker};
}
test('Copper Mole and Byte Boar ignore a nearer enemy for either team',()=>{
 for(const id of ['copper-mole','byte-boar'])for(const team of ['player','enemy']){
  const {game,unit,blocker}=setup(id,team),hp=blocker.hp;
  for(let i=0;i<30;i++)stepGame(game,50);
  assert.equal(unit.targetId,team==='player'?'enemy-left':'player-left');assert.equal(blocker.hp,hp);
 }
});
test('structure seekers remain vulnerable and other creatures still fight troops',()=>{
 const {game,unit,blocker}=setup('copper-mole');blocker.attackLeftMs=0;blocker.y=unit.y-29;const hp=unit.hp;stepGame(game,50);assert(unit.hp<hp);
 const normal=setup('pixel-pup');stepGame(normal.game,50);assert.equal(normal.unit.targetId,normal.blocker.id);assert(normal.blocker.hp<CARD_BY_ID['pixel-pup'].hp);
});
test('destroyed lane tower retargets the core, without changing stats or first structure bonus',()=>{
 for(const id of ['copper-mole','byte-boar']){
  const {game,unit,blocker}=setup(id);game.units=[unit];unit.x=58;unit.y=125;
  for(let i=0;i<35;i++)stepGame(game,50);
  const guard=game.towers.find(t=>t.id==='enemy-left');assert(guard.hp<guard.maxHp);
  assert.equal(unit.damage,CARD_BY_ID[id].damage);assert.equal(unit.attackMs,CARD_BY_ID[id].attackMs);
  guard.hp=0;stepGame(game,50);assert.equal(unit.targetId,'enemy-core');
 }
});
