import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {verifyMpWebhook,createMpReader,createMpPreference} from '../server/mercadopago.js';

const secret='fixture-secret-not-a-live-key',paymentId='123456',requestId='fixture-request',ts='1793484000000';
const hash=createHmac('sha256',secret).update(`id:${paymentId};request-id:${requestId};ts:${ts};`).digest('hex');

test('MP webhook authenticates exact id and request; malformed, missing and duplicated fields cannot authenticate',()=>{
 const input={secret,paymentId,requestId,signature:`ts=${ts},v1=${hash}`};assert(verifyMpWebhook(input));
 for(const change of [{paymentId:'999'},{requestId:'other'},{secret:'wrong-secret-value'},{signature:`ts=${ts},v1=${hash},v1=${hash}`},{signature:`ts=${ts},v1=not-hex`},{paymentId:'../../admin'},{signature:null},{requestId:''}])assert.equal(verifyMpWebhook({...input,...change}),false);
});

test('MP reader queries only the fixed HTTPS API, disallows redirects and never exposes provider errors or tokens',async()=>{
 let calls=0;const token='fixture-only';const read=createMpReader({accessToken:token,fetcher:async(url,options)=>{calls++;assert.equal(url,'https://api.mercadopago.com/v1/payments/123456');assert.equal(options.redirect,'error');assert.equal(options.headers.Authorization,'Bearer '+token);return{ok:true,json:async()=>({id:123456,status:'pending'})};}});
 assert.equal((await read(paymentId)).status,'pending');await assert.rejects(read('../evil'));assert.equal(calls,1);
 await assert.rejects(createMpReader({accessToken:token,fetcher:async()=>{throw Error('SECRET_PAYLOAD '+token);}})(paymentId),e=>!e.message.includes(token)&&!e.message.includes('SECRET_PAYLOAD'));
 await assert.rejects(createMpReader({accessToken:token,fetcher:async()=>({ok:false,json:async()=>{throw Error(token);}})})(paymentId));
 await assert.rejects(createMpReader({accessToken:token,fetcher:async()=>({ok:true,json:async()=>({id:987})})})(paymentId));assert.throws(()=>createMpReader());
});

test('MP preference creates valid checkout preference with order reference and returns initPoint',async()=>{
 const token='fixture-pref-token';
 const createPref=createMpPreference({
  accessToken:token,
  fetcher:async(url,options)=>{
   assert.equal(url,'https://api.mercadopago.com/checkout/preferences');
   assert.equal(options.method,'POST');
   assert.equal(options.headers.Authorization,'Bearer '+token);
   const body=JSON.parse(options.body);
   assert.equal(body.external_reference,'c1b2c3d4-1234-4abc-9def-0123456789ab');
   assert.equal(body.items[0].unit_price,4.9);
   return{
    ok:true,
    json:async()=>({
     id:'pref-123456789',
     init_point:'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=pref-123456789',
     sandbox_init_point:'https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=pref-123456789'
    })
   };
  }
 });
 const result=await createPref({
  orderId:'c1b2c3d4-1234-4abc-9def-0123456789ab',
  pack:{id:'p1',name:'Saco de Bits',gold:500,priceCents:490}
 });
 assert.equal(result.preferenceId,'pref-123456789');
 assert.match(result.initPoint,/mercadopago\.com\.br\/checkout/);

 // Validation checks
 await assert.rejects(createPref({orderId:'invalid-id',pack:{priceCents:490}}));
 await assert.rejects(createPref({orderId:'c1b2c3d4-1234-4abc-9def-0123456789ab',pack:{priceCents:0}}));
});
