import test from 'node:test';
import assert from 'node:assert/strict';
import {createProgress} from './game/activities.js';
import {applyGift,validateGift} from './mailbox.js';
const id='b6e0f250-4fc3-4d21-87dc-d10b9fe019c7';
const gift={gold:500,xp:50,dataFragments:3,cards:{'data-mouse':5},classCards:{warrior:2}};
test('mail grant credits exactly once, preserves missions and does not mutate original',()=>{
 const original=createProgress(),p=applyGift(original,id,gift);
 assert.equal(p.wallet.gold,500);assert.equal(p.wallet.cards['data-mouse'],5);assert.equal(p.progression.classes.warrior.cards,2);
 assert.equal(original.wallet.gold,0);assert.deepEqual(p.daily,original.daily);assert.deepEqual(applyGift(p,id,gift),p);
 assert.equal(Object.hasOwn(p.wallet,'mct'),false);
});
test('mail rejects unknown currencies/cards, negative/fractional/oversized amounts and overflow',()=>{
 for(const patch of [{mct:5},{gold:-1},{xp:1.5},{dataFragments:1001},{cards:{bad:1}},{classCards:{mage:2}},{gold:Number.MAX_SAFE_INTEGER}])assert.throws(()=>validateGift({...gift,...patch}));
 const p=createProgress();p.wallet.gold=Number.MAX_SAFE_INTEGER;assert.throws(()=>applyGift(p,id,gift));assert.equal(p.wallet.gold,Number.MAX_SAFE_INTEGER);
 assert.throws(()=>applyGift(createProgress(),'bad',gift));
});
