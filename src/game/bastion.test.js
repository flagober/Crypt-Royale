import test from 'node:test';import assert from 'node:assert/strict';import{createGame,activateOperator,stepGame,configureVipBattle,getHud}from'./engine.js';
const advance=(g,ms)=>{for(let t=0;t<ms;t+=100)stepGame(g,Math.min(100,ms-t));};
function game(){const g=createGame();g.enemyThinkMs=1e9;return g;}
test('normal Bastion stays active for 15 seconds then recovers for 20 without renewing shields',()=>{
 const g=game();assert(activateOperator(g));assert.equal(g.operatorBastionMs,15000);assert.equal(g.operatorCooldownMs,35000);advance(g,15000);assert.equal(g.operatorBastionMs,0);assert.equal(g.operatorCooldownMs,20000);assert.equal(g.towers.find(t=>t.id==='player-core').shield,0);assert(!activateOperator(g));advance(g,19900);assert(!activateOperator(g));advance(g,100);assert(activateOperator(g));assert.equal(g.towers.find(t=>t.id==='player-core').shield,180);
});
test('each VIP has the approved PvE recovery and cannot be changed after the battle starts',()=>{
 for(const[tier,recovery]of[[1,18000],[2,16000],[3,15000]]){const g=configureVipBattle(game(),tier);activateOperator(g);advance(g,15000);assert.equal(g.operatorCooldownMs,recovery);assert.equal(getHud(g).vipTier,tier);assert.throws(()=>configureVipBattle(g,0));advance(g,recovery);assert(activateOperator(g));}
});
test('PvP forces equal operator timing on both sides and enemy cooldown keeps ticking after the shield expires',()=>{
 const g=game();g.mode='pvp';g.enemyOperatorCooldownMs=0;g.enemyOperatorBastionMs=0;configureVipBattle(g,3);assert.equal(g.vipTier,0);g.vipTier=3;assert(activateOperator(g,'player'));assert(activateOperator(g,'enemy'));assert.equal(g.operatorCooldownMs,35000);assert.equal(g.enemyOperatorCooldownMs,35000);advance(g,15000);assert.equal(g.enemyOperatorBastionMs,0);assert.equal(g.enemyOperatorCooldownMs,20000);advance(g,20000);assert.equal(g.enemyOperatorCooldownMs,0);assert(activateOperator(g,'enemy'));assert.equal(getHud(g).vipTier,0);
});
test('an active shield cannot be stacked even if a faulty caller clears the cooldown',()=>{
 const g=game();activateOperator(g);g.operatorCooldownMs=0;assert.equal(activateOperator(g),false);assert.equal(g.towers.find(t=>t.id==='player-core').shield,180);
});
