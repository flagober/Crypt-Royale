import test from 'node:test';import assert from 'node:assert/strict';
import {pvpAccess,validCode,normalizeCode} from './rules.js';
import {createPvpBattle,pvpView,applyPvpCommand} from './battle.js';
import {stepGame} from '../game/engine.js';
import {eligibleProfile} from './test-profile.js';
test('amistoso requires authenticated Base7 and the three manual Vila Byte victories',()=>{
 const p=eligibleProfile();assert(pvpAccess(p,true).allowed);assert(!pvpAccess(p,false).allowed);
 p.wallet.xp=2099;assert(!pvpAccess(p,true).allowed);p.wallet.xp=2100;delete p.progression.campaign.completed['stage-3'];assert(!pvpAccess(p,true).allowed);
 assert(!pvpAccess(null,true).allowed);assert.equal(normalizeCode(' ab2cd3 '),'AB2CD3');assert(validCode('AB2CD3'));assert(!validCode('AB0CD3'));
});
test('PvP uses normalized stats, symmetric towers, distinct owned forms, two hands and no AI/auto',()=>{
 const a=eligibleProfile(),b=eligibleProfile();a.progression.monsters['bit-bug']={level:10,form:2};a.progression.classes.warrior={level:10,cards:0,branch:'paladin'};
 const g=createPvpBattle([a,b],1);assert.equal(g.towers.find(t=>t.id==='player-core').maxHp,2800);
 for(const t of g.towers.filter(t=>t.team==='player'))assert.equal(t.y+g.towers.find(e=>e.id===t.id.replace('player-','enemy-')).y,560);
 g.automaticEnabled=true;for(let i=0;i<600;i++)stepGame(g,100);assert.equal(g.units.length,0);assert.equal(g.automaticEnabled,false);assert.equal(g.activityStats.automaticUsed,false);
 assert(applyPvpCommand(g,0,{type:'deploy',cardId:'bit-bug',x:90,y:420}).ok);
 assert.equal(g.units[0].maxHp,95);assert.equal(g.units[0].damage,22);assert.equal(g.units[0].form,2);
 assert(!applyPvpCommand(g,0,{type:'deploy',cardId:'bit-bug',x:90,y:420}).ok);
 assert(applyPvpCommand(g,1,{type:'deploy',cardId:'bit-bug',x:90,y:420}).ok);assert.equal(g.units.at(-1).team,'enemy');assert(!g.enemyHand.includes('bit-bug'));
 for(const patch of [{x:NaN},{x:Infinity},{x:-1},{y:200}])assert(!applyPvpCommand(g,0,{type:'deploy',cardId:g.playerHand[0],x:90,y:420,...patch}).ok);
 const view=pvpView(g,1);assert(view.towers.some(t=>t.id==='player-core'&&t.y===502));assert.equal(view.playerHand[0],g.enemyHand[0]);assert.equal(view.units[0].team,'enemy');assert.equal(view.units[0].y,560-g.units[0].y);
 assert(!Object.hasOwn(view,'enemyHand'));assert(!Object.hasOwn(view,'seed'));assert(!Object.hasOwn(view,'progressionSnapshot'));
});
test('both human operators have independent shields and cooldowns and views agree on the winner',()=>{
 const g=createPvpBattle([eligibleProfile(),eligibleProfile()],1);
 assert(applyPvpCommand(g,1,{type:'operator'}).ok);assert.equal(g.towers.find(t=>t.id==='enemy-core').shield,180);assert.equal(g.towers.find(t=>t.id==='player-core').shield,0);
 assert.equal(pvpView(g,1).operatorCooldownMs,35000);assert.equal(pvpView(g,0).operatorCooldownMs,0);assert(!applyPvpCommand(g,1,{type:'operator'}).ok);
 assert(applyPvpCommand(g,0,{type:'operator'}).ok);for(let i=0;i<150;i++)stepGame(g,100);assert(g.towers.every(t=>t.shield===0));
 g.towers.find(t=>t.id==='enemy-core').hp=0;stepGame(g,50);assert.equal(pvpView(g,0).winner,'player');assert.equal(pvpView(g,1).winner,'enemy');
});
