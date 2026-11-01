import test from'node:test';import assert from'node:assert/strict';import{CATALOG,cents,createOrder,normalizeMpPayment,settleOrder}from'../server/payments-domain.js';
const now=Date.parse('2026-10-31T20:00:00Z'),id='12345678-1234-4234-8234-123456789abc';
const order=()=>createOrder({uid:'fixture-owner',packId:'gold-500',id,now,provider:'mercadopago'});
const raw=(changes={})=>({id:123,collector_id:777,external_reference:id,currency_id:'BRL',live_mode:false,transaction_amount:1.49,status:'approved',date_approved:new Date(now+1000).toISOString(),date_last_updated:new Date(now+2000).toISOString(),...changes});
const normalize=(o,changes={})=>normalizeMpPayment(raw(changes),o,{collectorId:'777',liveMode:false});
test('paid catalogue fixes price server-side and rejects prototype, invalid ids, precision tricks and timestamps',()=>{
 for(const packId of ['__proto__','constructor','unknown'])assert.throws(()=>createOrder({uid:'u',packId,id,now,provider:'mercadopago'}));
 assert.equal(order().amountCents,149);assert(Object.isFrozen(CATALOG['gold-500']));assert.equal(cents(2.9),290);
 for(const value of [1.49001,-1,NaN,null,'1e2','1.499'])assert.throws(()=>cents(value));
 assert.throws(()=>createOrder({uid:'u/other',packId:'gold-500',id,now,provider:'mercadopago'}));
});
test('provider result must match receiver, amount, currency, environment, reference and valid dates',()=>{
 const o=order();for(const changes of [{collector_id:999},{live_mode:'false'},{live_mode:true},{transaction_amount:0.01},{transaction_amount:1.49001},{external_reference:'wrong'},{currency_id:'USD'},{id:null},{status:'something'},{date_last_updated:'bad'},{date_approved:'bad'}])assert.throws(()=>normalize(o,changes));
 assert.throws(()=>settleOrder(o,raw(),now+3000));assert.throws(()=>settleOrder(o,normalize(o),now));
});
test('verified retries grant once, late approval remains reconcilable and stale pending cannot undo approval',()=>{
 const o=order(),payment=normalize(o),first=settleOrder(o,payment,now+3000);assert.equal(first.deltaGold,500);assert.equal(first.entryKey,'grant:'+id);assert.equal(o.credited,false);
 const repeat=settleOrder(first.order,payment,now+4000);assert.equal(repeat.deltaGold,0);
 const stale=normalize(o,{status:'pending',date_last_updated:new Date(now+1000).toISOString()});assert.deepEqual(settleOrder(first.order,stale,now+5000).order,first.order);
 assert.equal(settleOrder(o,payment,now+1800001).needsReview,true);
 assert.throws(()=>settleOrder(first.order,normalize(o,{id:456}),now+4000));
});
test('refund/chargeback reverse once, out of order refund never grants, partial refund requires reconciliation',()=>{
 for(const status of ['refunded','charged_back']){const o=order(),p=settleOrder(o,normalize(o),now+3000).order,refund=normalize(o,{status,date_last_updated:new Date(now+4000).toISOString(),transaction_amount_refunded:1.49});
 const reversal=settleOrder(p,refund,now+5000);assert.equal(reversal.deltaGold,-500);assert.equal(settleOrder(reversal.order,refund,now+6000).deltaGold,0);
 const before=settleOrder(o,refund,now+5000);assert.equal(before.deltaGold,0);assert.equal(settleOrder(before.order,normalize(o),now+6000).deltaGold,0);}
 const o=order(),p=settleOrder(o,normalize(o),now+3000).order,part=settleOrder(p,normalize(o,{transaction_amount_refunded:0.5}),now+4000);assert.equal(part.needsReview,true);assert.equal(part.deltaGold,0);assert.deepEqual(part.order,p);
});
