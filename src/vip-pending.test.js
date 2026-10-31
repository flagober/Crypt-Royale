import test from 'node:test';import assert from 'node:assert/strict';
import{readVipPending,saveVipPending,clearVipPending}from'./vip-pending.js';
const id='11111111-1111-4111-8111-111111111111',id2='22222222-2222-4222-8222-222222222222';
const memory=()=>{const m=new Map();return{getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)};};
test('VIP pending request survives remount, stays per owner and cannot be replaced after submission',()=>{
 const s=memory(),order={uid:'alice',id,tier:1,sent:false};saveVipPending(s,order);saveVipPending(s,{...order,sent:true});
 assert.deepEqual(readVipPending(s,'alice'),{...order,sent:true});assert.equal(readVipPending(s,'bob'),null);
 assert.throws(()=>saveVipPending(s,{...order,id:id2,sent:true}));assert.throws(()=>saveVipPending(s,order));
 assert.throws(()=>clearVipPending(s,'alice',id2));clearVipPending(s,'alice',id);assert.equal(readVipPending(s,'alice'),null);
});
test('VIP malformed pending data and storage failures are preserved',()=>{
 const s=memory();s.setItem('cryptroyale.vip.pending.alice','broken');assert.throws(()=>readVipPending(s,'alice'));assert.equal(s.getItem('cryptroyale.vip.pending.alice'),'broken');
 assert.throws(()=>saveVipPending({getItem:()=>null,setItem:()=>{throw Error('Quota');}},{uid:'a',tier:1,id,sent:false}),/Quota/);
});
