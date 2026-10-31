import test from 'node:test';import assert from 'node:assert/strict';import {createProgress,validateProgress} from './game/activities.js';import {VIP_DURATION_MS,VIP_TIERS,purchaseVip,vipAccess} from './vip.js';
const now=1800000000000,a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222';
function profile(){const p=createProgress(now);p.wallet.gold=100000;return p;}
test('each approved VIP debits only Gold, lasts exactly seven days and preserves legacy progression and the separate robot pass',()=>{
 for(const t of VIP_TIERS){const p=profile();p.commerce={autoUntil:now+10000,orders:{}};const original=structuredClone(p),next=purchaseVip(p,t.tier,a,now);assert.deepEqual(p,original);assert.equal(next.wallet.gold,100000-t.gold);assert.equal(next.commerce.vip.until,now+VIP_DURATION_MS);assert.equal(next.commerce.autoUntil,p.commerce.autoUntil);assert.deepEqual(next.progression,p.progression);assert.equal(vipAccess(next,now).tier,t.tier);validateProgress(next);}
});
test('retrying a receipt never charges or renews twice and cross-tier reuse fails',()=>{
 const first=purchaseVip(profile(),1,a,now),retry=purchaseVip(first,1,a,now+3000);assert.deepEqual(retry,first);assert.throws(()=>purchaseVip(first,2,a,now+3000),/outro VIP/);
});
test('renewal adds seven days manually, active tier switching is blocked and expiry allows a different tier',()=>{
 const first=purchaseVip(profile(),1,a,now);assert.throws(()=>purchaseVip(first,3,b,now+1),/término/);const next=purchaseVip(first,1,b,now+1);assert.equal(next.commerce.vip.until,now+2*VIP_DURATION_MS);assert.equal(next.wallet.gold,90000);assert.equal(vipAccess(first,first.commerce.vip.until).active,false);const switched=purchaseVip(first,2,b,first.commerce.vip.until);assert.equal(switched.commerce.vip.until,now+2*VIP_DURATION_MS);
});
test('missing trusted time grants no VIP and malformed records are preserved by rejection',()=>{
 const p=purchaseVip(profile(),3,a,now);assert.equal(vipAccess(p).known,false);assert.equal(vipAccess(p).tier,0);for(const mutate of [x=>x.commerce.vip.until++,x=>x.commerce.vip.orders[a].gold=1,x=>x.commerce.vip.orders[a].from++,x=>x.commerce.vip.orders={}]){const bad=structuredClone(p);mutate(bad);const before=structuredClone(bad);assert.throws(()=>validateProgress(bad));assert.deepEqual(bad,before);}
});
test('insufficient funds, invalid tiers, clocks and identifiers do not change the wallet',()=>{
 const p=profile();p.wallet.gold=4999;const before=structuredClone(p);assert.throws(()=>purchaseVip(p,1,a,now),/insuficiente/);for(const args of [[1,a,null],[0,a,now],[4,a,now],[1,'wrong',now],[1,a,-1]])assert.throws(()=>purchaseVip(p,...args));assert.deepEqual(p,before);assert.doesNotThrow(()=>validateProgress(createProgress(now)));
});
