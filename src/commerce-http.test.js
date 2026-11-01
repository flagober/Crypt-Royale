import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {createCommerceServer} from '../server/commerce-http.js';

const origin='https://monstercrypt-royale.web.app',token='valid-token-for-alice-123456789',id='12345678-1234-4234-8234-123456789abc';
const secret='isolated-test-secret-not-a-real-credential';
async function fixture(t,options={}){
 const server=createCommerceServer(options);await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 t.after(()=>new Promise(resolve=>{server.closeAllConnections();server.close(resolve);}));
 return(path,options)=>fetch('http://127.0.0.1:'+server.address().port+path,options);
}
const auth={authorization:'Bearer '+token};

test('commerce liveness and catalogue work without secrets; readiness and purchases fail closed',async t=>{
 const request=await fixture(t);assert.equal((await request('/health')).status,200);
 const ready=await request('/ready');assert.equal(ready.status,503);assert.equal((await ready.json()).checkoutEnabled,false);
 const cat=await(await request('/api/v1/catalog')).json();assert.equal(cat.packs.length,5);assert.equal(cat.checkoutEnabled,false);
 assert.equal((await request('/api/v1/orders',{method:'POST',headers:auth})).status,503);
});

test('commerce creates order and preference when checkoutEnabled is true and valid identity provided',async t=>{
 let createdOrder;
 const request=await fixture(t,{
  checkoutEnabled:true,
  repository:{
   create:async order=>{createdOrder=order;return{...order,currency:'BRL',amountCents:490,gold:500,status:'pending',credited:false,reversed:false,createdAt:'2026-10-31T22:00:00Z',expiresAt:'2026-10-31T22:30:00Z'};}
  },
  verifyToken:async()=>({uid:'alice-test-123'}),
  createPreference:async({orderId,pack})=>({
   preferenceId:'pref-999',
   initPoint:'https://mercadopago.com/checkout/pref-999',
   sandboxInitPoint:'https://sandbox.mercadopago.com/checkout/pref-999'
  })
 });

 const res=await request('/api/v1/orders',{
  method:'POST',
  headers:{...auth,'content-type':'application/json'},
  body:JSON.stringify({packId:'gold-500',provider:'mercadopago'})
 });
 assert.equal(res.status,201);
 const body=await res.json();
 assert.equal(body.order.packId,'gold-500');
 assert.equal(body.preferenceId,'pref-999');
 assert.equal(body.checkoutUrl,'https://mercadopago.com/checkout/pref-999');
 assert.equal(createdOrder.uid,'alice-test-123');
 assert.equal(createdOrder.packId,'gold-500');

 // Invalid pack
 const badPack=await request('/api/v1/orders',{
  method:'POST',
  headers:{...auth,'content-type':'application/json'},
  body:JSON.stringify({packId:'invalid-pack'})
 });
 assert.equal(badPack.status,400);
});

test('commerce requires verified identity; a forged uid in query cannot change account',async t=>{
 let seen;const request=await fixture(t,{repository:{balance:async uid=>{seen=uid;return{netGold:500};}},verifyToken:async value=>{if(value!==token)throw Error('private token');return{uid:'alice'};}});
 assert.equal((await request('/api/v1/gold/balance')).status,401);
 assert.equal((await request('/api/v1/gold/balance',{headers:{authorization:'Bearer invalid-token-123456789'}})).status,401);
 const response=await request('/api/v1/gold/balance?uid=bob',{headers:auth});assert.equal(response.status,200);assert.equal(seen,'alice');assert.equal((await response.json()).netGold,500);
 assert.equal((await request('/api/v1/orders',{method:'POST',headers:auth})).status,503);
});

test('commerce denies anonymous identities, cross-account orders and unauthorized origins',async t=>{
 const request=await fixture(t,{origins:[origin],repository:{get:async()=>{throw Error('private owner information');}},verifyToken:async()=>({uid:'alice'})});
 assert.equal((await request('/api/v1/catalog',{headers:{origin:'https://attacker.invalid'}})).status,403);
 const preflight=await request('/api/v1/orders',{method:'OPTIONS',headers:{origin}});assert.equal(preflight.status,204);assert.equal(preflight.headers.get('access-control-allow-origin'),origin);
 const order=await request('/api/v1/orders/'+id,{headers:auth});assert.equal(order.status,404);assert.equal((await order.text()).includes('private'),false);
 const anon=await fixture(t,{repository:{},verifyToken:async()=>({uid:'anonymous',firebase:{sign_in_provider:'anonymous'}})});assert.equal((await anon('/api/v1/gold/balance',{headers:auth})).status,401);
});

test('webhook requires a valid signature and commits its durable receipt before acknowledging',async t=>{
 let queued=[];const request=await fixture(t,{paymentEvents:{enqueue:async(id,key)=>{queued.push({id,key});},drain:async()=>{}},webhookSecret:secret});
 const payload=JSON.stringify({type:'payment',data:{id:'123'},status:'approved'}),route='/api/v1/webhooks/mercadopago?data.id=123';
 assert.equal((await request(route,{method:'POST',headers:{'content-type':'application/json'},body:payload})).status,401);assert.equal(queued.length,0);
 const ts='1793480000',requestId='request-123',hash=createHmac('sha256',secret).update('id:123;request-id:'+requestId+';ts:'+ts+';').digest('hex');
 const response=await request(route,{method:'POST',headers:{'content-type':'application/json','x-request-id':requestId,'x-signature':'ts='+ts+',v1='+hash},body:payload});assert.equal(response.status,200);assert.deepEqual(await response.json(),{received:true,queued:true});assert.equal(queued.length,1);assert.equal(queued[0].id,'123');assert.match(queued[0].key,/^[a-f\d]{64}$/);
 const failed=await fixture(t,{paymentEvents:{enqueue:async()=>{throw Error('private database outage');}},webhookSecret:secret});
 assert.equal((await failed(route,{method:'POST',headers:{'content-type':'application/json','x-request-id':requestId,'x-signature':'ts='+ts+',v1='+hash},body:payload})).status,503);
});

test('webhook rejects ambiguous identifiers and oversized or malformed bodies before querying provider',async t=>{
 let reads=0;const request=await fixture(t,{paymentEvents:{enqueue:async()=>{reads++;}},webhookSecret:secret});
 const post=body=>({method:'POST',headers:{'content-type':'application/json'},body});
 assert.equal((await request('/api/v1/webhooks/mercadopago?data.id=1&data.id=2',post('{"type":"payment","data":{"id":"1"}}'))).status,400);
 assert.equal((await request('/api/v1/webhooks/mercadopago?data.id=1&type=subscription',post('{"type":"payment","data":{"id":"1"}}'))).status,400);
 assert.equal((await request('/api/v1/webhooks/mercadopago?data.id=1',post('{'))).status,400);
 assert.equal((await request('/api/v1/webhooks/mercadopago?data.id=1',post(JSON.stringify({text:'x'.repeat(5000)})))).status,413);assert.equal(reads,0);
});

test('database/provider failures return sanitized errors and never report payment success',async t=>{
 const request=await fixture(t,{repository:{balance:async()=>{throw Error('secret-provider-payload');}},verifyToken:async()=>({uid:'alice'})});
 const response=await request('/api/v1/gold/balance',{headers:auth});assert.equal(response.status,503);const result=await response.text();assert.equal(result.includes('secret-provider-payload'),false);assert.match(response.headers.get('cache-control'),/no-store/);
});
