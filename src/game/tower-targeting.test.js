import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {towerCanEngage,towerEngagement} from './tower-targeting.js';
import {createGame,deployCard,stepGame,ARENA} from './engine.js';
const guard=(x=88,team='player')=>({x,y:team==='player'?468:92,type:'guard',team,hp:1800});
const target=(x,y,team='enemy')=>({x,y,hp:1000,team});
test('guards defend their own lane without crossing the vertical centre line',()=>{
  assert.equal(towerCanEngage(guard(),target(176,450),ARENA),true);
  assert.equal(towerCanEngage(guard(),target(181,450),ARENA),false);
  assert.equal(towerCanEngage(guard(272),target(184,450),ARENA),true);
  assert.equal(towerCanEngage(guard(272),target(179,450),ARENA),false);
  for(const x of [88,272])assert.equal(towerCanEngage(guard(x),target(180,450),ARENA),false);
});
test('the core covers the centre and either lane only within its unchanged range',()=>{
  const core={x:180,y:502,type:'core',team:'player',hp:2800};
  for(const x of [120,180,240])assert.equal(towerCanEngage(core,target(x,430),ARENA),true);
  assert.equal(towerEngagement(core,target(180,376),ARENA),'fora-do-alcance');
  assert.equal(towerCanEngage(core,target(180,377),ARENA),true);
});
test('both teams respect the defensive half, range and target validity',()=>{
  const p=guard(),e=guard(88,'enemy');
  assert.equal(towerEngagement(p,target(88,279),ARENA,500),'fora-da-metade');
  assert.equal(towerEngagement(e,target(88,281,'player'),ARENA,500),'fora-da-metade');
  assert.equal(towerCanEngage(p,target(88,363),ARENA),true);
  assert.equal(towerCanEngage(p,target(88,362.99),ARENA),false);
  assert.equal(towerCanEngage(e,target(88,197,'player'),ARENA),true);
  assert.equal(towerCanEngage(e,target(88,197.01,'player'),ARENA),false);
  assert.equal(towerCanEngage(p,target(88,450,'player'),ARENA),false);
  assert.equal(towerCanEngage(p,{...target(88,450),hp:0},ARENA),false);
});
test('actual engine does not damage an enemy across the guard lane boundary',()=>{
  function battle(x){
    const game=createGame();game.enemyThinkMs=1e9;
    Object.assign(game.towers.find(t=>t.id==='player-left'),{x:88,y:468}); // Isolate the lane policy from arena layout changes.
    for(const t of game.towers)t.attackLeftMs=t.id==='player-left'?0:1e9;
    assert.equal(deployCard(game,'pixel-pup',90,110,'enemy').ok,true);
    const unit=game.units[0];Object.assign(unit,{x,y:450,lane:x<180?'left':'right',speed:0,hp:1000,maxHp:1000,attackLeftMs:1e9});
    stepGame(game,100);return unit.hp;
  }
  assert.equal(battle(181),1000);
  assert.equal(battle(176),946);
});
test('preview and engine use identical targeting policy',()=>{
  assert.equal(readFileSync(new URL('./tower-targeting.js',import.meta.url),'utf8'),readFileSync(new URL('../../public/tower-targeting.js',import.meta.url),'utf8'));
});

