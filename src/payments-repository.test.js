import test from'node:test';import assert from'node:assert/strict';import{createPaymentRepository}from'../server/payments-repository.js';
// Isolated transaction fixture: staged writes roll back on failure, serialized commits.
function fixture(){const records=new Map();let tail=Promise.resolve();const snapshot=path=>({exists:records.has(path),data:()=>structuredClone(records.get(path))});const db={records,fail:false,doc:path=>({path,get:async()=>snapshot(path)}),runTransaction:fn=>{const run=tail.then(async()=>{const staged=new Map();let writing=false;const tx={get:async r=>{assert.equal(writing,false,'Firestore reads must precede writes');return snapshot(r.path);},create:(r,v)=>{writing=true;if(records.has(r.path)||staged.has(r.path))throw Error('exists');staged.set(r.path,structuredClone(v));},set:(r,v)=>{writing=true;staged.set(r.path,structuredClone(v));}};const result=await fn(tx);if(db.fail)throw Error('commit failed');for(const[k,v]of staged)records.set(k,v);return result;});tail=run.catch(()=>{});return run;}};return db;}
const now=Date.parse('2026-10-31T20:00:00Z'),id='12345678-1234-4234-8234-123456789abc',id2='12345678-1234-4234-8234-123456789abd';
const request=(uid='alice',key=id)=>({uid,packId:'gold-500',provider:'mercadopago',id:key});
const api=(status='approved',key=id,updated=2000)=>({id:123,collector_id:777,external_reference:key,currency_id:'BRL',live_mode:false,transaction_amount:1.49,status,date_approved:new Date(now+1000).toISOString(),date_last_updated:new Date(now+updated).toISOString(),transaction_amount_refunded:status==='refunded'?1.49:0});
const setup=()=>{const db=fixture(),repo=createPaymentRepository({db,clock:()=>now+10000,collectorId:'777',liveMode:false});return{db,repo};};
// Create uses an earlier trusted clock than provider timestamps.
const create=(db,req=request())=>createPaymentRepository({db,clock:()=>now,collectorId:'777',liveMode:false}).create(req);
test('durable adapter create retry preserves TTL and forbids cross-account reads or reused ids',async()=>{
 const{db,repo}=setup();const first=await create(db);assert.deepEqual(await repo.create(request()),first);await assert.rejects(repo.create(request('bob')));await assert.rejects(repo.get('bob',id));await assert.rejects(repo.get('alice','../other'));assert.deepEqual(await repo.balance('alice'),{creditsGold:0,debitsGold:0,netGold:0});
});
test('concurrent confirmations and restarts apply a payment only once; refund reverses once',async()=>{
 const{db,repo}=setup();await create(db);const results=await Promise.all(Array.from({length:8},()=>repo.applyMp(id,api())));assert.equal(results.reduce((n,r)=>n+r.deltaGold,0),500);
 const restarted=createPaymentRepository({db,clock:()=>now+10000,collectorId:'777',liveMode:false});assert.equal((await restarted.applyMp(id,api())).deltaGold,0);
 const refunds=await Promise.all([repo.applyMp(id,api('refunded',id,4000)),repo.applyMp(id,api('refunded',id,4000))]);assert.equal(refunds.reduce((n,r)=>n+r.deltaGold,0),-500);assert.deepEqual(await repo.balance('alice'),{creditsGold:500,debitsGold:500,netGold:0});
 assert.equal([...db.records.keys()].filter(k=>k.includes('/entries/')).length,2);
});
test('pending never grants; receipt cannot cross orders; failed commit leaves no partial delivery',async()=>{
 const{db,repo}=setup();await create(db);await repo.applyMp(id,api('pending'));assert.equal((await repo.balance('alice')).netGold,0);
 db.fail=true;await assert.rejects(repo.applyMp(id,api()));db.fail=false;assert.equal((await repo.balance('alice')).netGold,0);assert.equal((await repo.get('alice',id)).credited,false);assert.equal((await repo.applyMp(id,api())).deltaGold,500);
 await create(db,request('bob',id2));await assert.rejects(repo.applyMp(id2,api('approved',id2)));assert.equal((await repo.balance('bob')).netGold,0);assert.equal((await repo.balance('alice')).netGold,500);
});

test('partial refund puts the order on hold durably so a delayed approval cannot grant Gold',async()=>{
 const{db,repo}=setup();await create(db);const partial={...api('refunded',id,4000),transaction_amount_refunded:0.5};assert.equal((await repo.applyMp(id,partial)).needsReview,true);
 assert.equal((await repo.get('alice',id)).reviewRequired,true);assert.equal((await repo.applyMp(id,api())).deltaGold,0);assert.equal((await repo.balance('alice')).netGold,0);
});
