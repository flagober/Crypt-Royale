import test from 'node:test';import assert from 'node:assert/strict';
import {createGame,deployCard,stepGame} from './engine.js';
import {setCoreAppearance,towerPose,towerMuzzle,towerLayout,TOWER_ART} from './tower-animation.js';
test('appearance changes only the central art, keeping HP and damage timing',()=>{
 const game=createGame(),before=structuredClone(game.towers);assert.equal(setCoreAppearance(game,'female'),true);
 assert.equal(game.towers.find(t=>t.id==='player-core').appearance,'female');
 for(let i=0;i<before.length;i++){const {appearance,...a}=before[i],{appearance:other,...b}=game.towers[i];assert.deepEqual(a,b);}
 assert.equal(setCoreAppearance(game,'invalid'),false);
});
test('real tower attack applies damage once, records strike and anchors the projectile to the art',()=>{
 const game=createGame();game.enemyThinkMs=1e9;for(const t of game.towers)t.attackLeftMs=t.id==='player-core'?0:1e9;
 deployCard(game,'pixel-pup',90,110,'enemy');const unit=game.units[0];Object.assign(unit,{x:180,y:420,lane:null,speed:0,hp:1000,maxHp:1000,attackLeftMs:1e9});
 const core=game.towers.find(t=>t.id==='player-core');stepGame(game,50);
 assert.equal(unit.hp,928);assert.equal(core.attackSerial,1);assert.equal(core.lastAttackAt,50);assert.equal(towerPose(core,50),2);
 const event=game.effects.find(e=>e.towerId===core.id),muzzle=towerMuzzle(core);
 assert.equal(event.casterX,muzzle.x);assert.equal(event.casterY,muzzle.y);
 assert.equal(towerPose(core,200),3);assert.equal(towerPose(core,400),0);
 for(let i=0;i<14;i++)stepGame(game,50);assert.equal(unit.hp,928);assert.equal(core.windingUp,true);assert.equal(towerPose(core,game.nowMs),1);
 for(let i=0;i<3;i++)stepGame(game,50);assert.equal(unit.hp,856);assert.equal(core.attackSerial,2);
});
test('each approved direction keeps positive draw dimensions and the enemy core fits the top margin',()=>{
 for(const team of ['player','enemy'])for(const type of ['core','guard']){
 const tower={x:180,y:team==='player'?502:58,team,type};const layout=towerLayout(tower);
 assert.ok(layout.body.width>0&&layout.body.height>0);if(team==='enemy'&&type==='core')assert.ok(layout.top>=6);
 }
 for(const character of TOWER_ART.characters)for(const direction of Object.values(character.directions))for(const frame of direction.frames){assert.ok(frame.width>0&&frame.height>0);assert.ok(frame.pivotX>=0&&frame.pivotX<=frame.width);}
});
