import test from 'node:test';import assert from 'node:assert/strict';
import {createProgress} from './activities.js';import {createProgression,upgradeMonster,evolveMonster} from './progression.js';import {createGame,deployCard} from './engine.js';import {configureCampaign} from './progression-engine.js';import {CARD_BY_ID} from './cards.js';
test('campaign uses a frozen collection, upgraded HP/basic attack and preserved costs/attack timing',()=>{
 let p=createProgress();p.progression=createProgression();p.wallet.gold=2000;p.wallet.cards['bit-bug']=60;p.progression.monsters['bit-bug'].level=5;p=upgradeMonster(p,'bit-bug',5);p=evolveMonster(p,'bit-bug',0);
 const game=configureCampaign(createGame(),p,'stage-1');p.progression.monsters['bit-bug'].level=10;deployCard(game,'bit-bug',60,430);
 assert.equal(game.units[0].level,6);assert.equal(game.units[0].form,1);assert.equal(game.units[0].maxHp,Math.round(95*1.32));assert.equal(game.units[0].damage,Math.round(22*1.32));assert.equal(game.units[0].attackMs,CARD_BY_ID['bit-bug'].attackMs);assert.equal(game.playerEnergy,3);
});
test('free training stays normalized regardless of owned cards; locked campaigns cannot start',()=>{
 const game=createGame();deployCard(game,'bit-bug',60,430);assert.equal(game.units[0].maxHp,95);assert.equal(game.units[0].damage,22);assert.equal(game.units[0].level,1);
 assert.throws(()=>configureCampaign(createGame(),createProgress(),'stage-2'),/anterior/);assert.throws(()=>configureCampaign(game,createProgress(),'stage-1'),/nova/);
});
test('class progression applies to respective player towers only; base variants share power',()=>{
 const p=createProgress();p.progression=createProgression();p.progression.classes.warrior.level=2;p.progression.classes.warrior.branch='paladin';p.progression.classes.archer.level=3;
 const game=configureCampaign(createGame(),p,'stage-1'),core=game.towers.find(t=>t.id==='player-core'),left=game.towers.find(t=>t.id==='player-left'),right=game.towers.find(t=>t.id==='player-right');
 assert.equal(core.combatDamage,Math.round(72*1.14));assert.equal(core.maxHp,Math.round(2800*1.14));assert.equal(left.maxHp,Math.round(1800*1.08));assert.equal(right.maxHp,left.maxHp);assert.equal(game.towers[0].maxHp,1800);
});
