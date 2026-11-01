import test from 'node:test';import assert from 'node:assert/strict';
import {createPaymentEvents} from '../server/payment-events.js';

// Unit fixture only. Cloud transactions are tested separately in an isolated namespace.
function fixture(){
 const records=new Map();let tail=Promise.resolve();
 const snap=p=>({id:p.split('/').at(-1),exists:records.has(p),data:()=>structuredClone(records.get(p))});
 const db={records,fail:false,doc:p=>({path:p}),collection:p=>({where:(field,operator,value)=>{assert.equal(operator,'<=');return{orderBy:sort=>{assert.equal(sort,field);return{limit:n=>({get:async()=>({docs:[...records.keys()].filter(k=>k.startsWith(p+'/')&&typeof records.get(k)[field]==='number'&&records.get(k)[field]<=value).sort((a,b)=>records.get(a)[field]-records.get(b)[field]).slice(0,n).map(snap)})})};}};}}),runTransaction:fn=>{
  const run=tail.then(async()=>{const staged=new Map();let writing=false;const tx={get:async r=>{assert.equal(writing,false);return snap(r.path);},set:(r,v)=>{writing=true;staged.set(r.path,structuredClone(v));}};const result=await fn(tx);if(db.fail)throw Error('commit unavailable');for(const[k,v]of staged)records.set(k,v);return result;});tail=run.catch(()=>{});return run;
 }};return db;
}
const key='a'.repeat(64),second='b'.repeat(64),record=db=>db.records.get('cryptroyale_payment_events/123');
const gate=()=>{let resolve;const promise=new Promise(r=>{resolve=r;});return{promise,resolve};};

test('durable queue deduplicates current delivery and two workers claim a payment once',async()=>{
 const db=fixture();let calls=0;const processPayment=async id=>{assert.equal(id,'123');calls++;return{};};
 const first=createPaymentEvents({db,clock:()=>1000,processPayment}),restarted=createPaymentEvents({db,clock:()=>1000,processPayment});
 await Promise.all(Array.from({length:8},()=>first.enqueue('123',key)));assert.equal(record(db).revision,1);
 await Promise.all([first.drain(),restarted.drain()]);assert.equal(calls,1);assert.equal(record(db).state,'done');assert.equal('nextAttemptAt' in record(db),false);
 await restarted.enqueue('123',key);await restarted.drain();assert.equal(calls,1);
 await restarted.enqueue('123',second);await restarted.drain();assert.equal(calls,2);assert.equal(record(db).revision,2);
});

test('a newer event arriving during processing is not discarded by the older worker',async()=>{
 const db=fixture(),entered=gate(),release=gate();let calls=0;
 const queue=createPaymentEvents({db,clock:()=>1000,processPayment:async()=>{calls++;if(calls===1){entered.resolve();await release.promise;}return{};}});
 await queue.enqueue('123',key);const old=queue.drain();await entered.promise;await queue.enqueue('123',second);release.resolve();await old;
 assert.equal(record(db).state,'pending');assert.equal(record(db).revision,2);await queue.drain();assert.equal(record(db).state,'done');assert.equal(calls,2);
});

test('an expired lease can be reclaimed and its old worker cannot overwrite the new result',async()=>{
 const db=fixture(),entered=gate(),release=gate();let now=1000;
 const old=createPaymentEvents({db,clock:()=>now,processPayment:async()=>{entered.resolve();await release.promise;return{};}});
 const replacement=createPaymentEvents({db,clock:()=>now,processPayment:async()=>({needsReview:true})});
 await old.enqueue('123',key);const running=old.drain();await entered.promise;now+=60001;await replacement.drain();release.resolve();await running;
 assert.equal(record(db).state,'review');assert.equal(record(db).needsReview,true);assert.equal(record(db).attempts,2);
});

test('transient failures survive restarts, back off, and remain for review after twenty attempts',async()=>{
 const db=fixture();let now=1000;
 const options={db,clock:()=>now,processPayment:async()=>{throw Error('secret provider payload must not be persisted');}};
 let queue=createPaymentEvents(options);await queue.enqueue('123',key);
 for(let n=1;n<=20;n++){await queue.drain();assert.equal(record(db).attempts,n);if(n<20){assert.ok(record(db).nextAttemptAt>now);now=record(db).nextAttemptAt;queue=createPaymentEvents(options);}}
 assert.equal(record(db).state,'review');assert.equal('nextAttemptAt' in record(db),false);assert.equal(JSON.stringify(record(db)).includes('secret provider'),false);
 await queue.enqueue('123',key);assert.equal(record(db).attempts,20);
});

test('invalid identifiers and failed enqueue commits never acknowledge a durable event',async()=>{
 const db=fixture(),queue=createPaymentEvents({db,processPayment:async()=>{}});
 await assert.rejects(queue.enqueue('../123',key));await assert.rejects(queue.enqueue('123','bad'));
 db.fail=true;await assert.rejects(queue.enqueue('123',key));assert.equal(db.records.size,0);
});
