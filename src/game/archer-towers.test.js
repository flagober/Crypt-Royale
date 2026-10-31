import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,deployCard,stepGame} from './engine.js';
import {guardAppearance,towerMuzzle,towerLayout,archerPose} from './tower-animation.js';
import {drawBattleEffects} from './battle-effects.js';

test('both teams retain female left, male right and feet inside their platform width',()=>{
 for(const tower of createGame().towers.filter(t=>t.type==='guard')){
  assert.equal(guardAppearance(tower),tower.x<180?'female':'male');
  const layout=towerLayout(tower),tip=towerMuzzle(tower);
  assert.ok(layout.foot.x>layout.body.x&&layout.foot.x<layout.body.x+layout.body.width);
  assert.ok(layout.foot.y>layout.body.y&&layout.foot.y<layout.ground.y);
  assert.ok(Math.abs(tip.x-layout.foot.x)<8);assert.ok(tip.y<layout.foot.y);
 }
});
test('guard arrow originates at its approved bow while damage and cooldown stay unchanged',()=>{
 const game=createGame();game.enemyThinkMs=1e9;
 for(const t of game.towers)t.attackLeftMs=t.id==='player-left'?0:1e9;
 deployCard(game,'pixel-pup',90,110,'enemy');
 const target=game.units[0];Object.assign(target,{x:58,y:430,lane:null,speed:0,hp:1000,maxHp:1000,attackLeftMs:1e9});
 stepGame(game,50);const tower=game.towers.find(t=>t.id==='player-left'),event=game.effects.find(e=>e.towerId===tower.id);
 assert.equal(target.hp,946);assert.equal(tower.attackLeftMs,1000);assert.equal(event.projectile,'arrow');
 assert.deepEqual({x:event.casterX,y:event.casterY},towerMuzzle(tower));
 const before=target.hp;let strokes=0;
 const context={save(){},restore(){},beginPath(){},moveTo(){},lineTo(){},stroke(){strokes++;}};
 drawBattleEffects(context,{...game,nowMs:game.nowMs+100,effects:[event],zones:[]});
 assert.equal(strokes,1);assert.equal(target.hp,before);
});

test('frontal archer animation releases on actual shot and draws only before the next cooldown',()=>{
 const tower={lastAttackAt:100,attackLeftMs:1000,aimTarget:{id:'target'}};
 assert.equal(archerPose(tower,100),2);assert.equal(archerPose(tower,199),2);
 assert.equal(archerPose(tower,200),3);assert.equal(archerPose(tower,449),3);
 assert.equal(archerPose(tower,450),0);tower.attackLeftMs=300;
 assert.equal(archerPose(tower,800),1);tower.aimTarget=null;
 assert.equal(archerPose(tower,800),0);
});
