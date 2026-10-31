import test from 'node:test';import assert from 'node:assert/strict';import{createProgress}from'./game/activities.js';import{prepareVipCommit}from'./vip-transaction.js';
const now=1800000000000,id='11111111-1111-4111-8111-111111111111';
function saved(){const p=createProgress(now);p.wallet.gold=50000;return{owner:'A',schema:1,revision:5,profileJson:JSON.stringify(p)};}
test('VIP transaction retries after a lost response return the receipt before a stale revision check without spending twice',()=>{
 const original=saved(),first=prepareVipCommit(original,'A',5,2,id,now),committed={...original,revision:first.revision,profileJson:JSON.stringify(first.profile)};
 const second=prepareVipCommit(committed,'A',5,2,id,now+1000);assert.equal(first.changed,true);assert.equal(second.changed,false);assert.equal(second.revision,6);assert.equal(second.profile.wallet.gold,38000);assert.equal(second.profile.commerce.vip.until,first.profile.commerce.vip.until);assert.throws(()=>prepareVipCommit(committed,'A',5,1,id,now+1000),/outro VIP/);
});
test('a competing device or wrong owner never causes a VIP debit or overwrites its save',()=>{
 const s=saved(),copy=structuredClone(s);assert.throws(()=>prepareVipCommit(s,'A',4,1,id,now),e=>e.code==='save-conflict');assert.throws(()=>prepareVipCommit(s,'B',5,1,id,now));assert.deepEqual(s,copy);
});
