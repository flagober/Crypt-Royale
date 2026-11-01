// Server-only. Never import into the game bundle or log provider payloads/tokens.
import {createHmac,timingSafeEqual} from 'node:crypto';

export function verifyMpWebhook({signature,requestId,paymentId,secret}){
 if(typeof secret!=='string'||secret.length<16||typeof signature!=='string'||signature.length>512||typeof requestId!=='string'||!/^[A-Za-z0-9-]{1,100}$/.test(requestId)||typeof paymentId!=='string'||!/^\d{1,30}$/.test(paymentId))return false;
 const fields=signature.split(',').map(p=>p.trim().split('='));
 if(fields.length!==2||fields.some(p=>p.length!==2)||new Set(fields.map(p=>p[0])).size!==2)return false;
 const {ts,v1}=Object.fromEntries(fields);
 if(!/^\d{10,13}$/.test(ts||'')||!/^[a-f\d]{64}$/i.test(v1||''))return false;
 const expected=createHmac('sha256',secret).update(`id:${paymentId};request-id:${requestId};ts:${ts};`).digest();
 return timingSafeEqual(expected,Buffer.from(v1,'hex'));
}

export function createMpReader({accessToken,fetcher=fetch}={}){
 if(typeof accessToken!=='string'||!accessToken.trim()||/[\r\n]/.test(accessToken))throw Error('Credencial Mercado Pago não configurada no servidor.');
 return async paymentId=>{
  if(typeof paymentId!=='string'||!/^\d{1,30}$/.test(paymentId))throw Error('Identificador de pagamento inválido.');
  let response;
  try{response=await fetcher('https://api.mercadopago.com/v1/payments/'+paymentId,{method:'GET',headers:{Authorization:'Bearer '+accessToken},redirect:'error',signal:AbortSignal.timeout(10000)});}catch{throw Error('Consulta ao Mercado Pago indisponível. Tente novamente.');}
  if(!response.ok)throw Object.assign(Error('Mercado Pago não confirmou a consulta do pagamento.'),{code:response.status===404?'provider-not-found':'provider-unavailable'});
  let payment;try{payment=await response.json();}catch{throw Error('Resposta de pagamento inválida.');}
  if(!payment||String(payment.id)!==paymentId)throw Error('Pagamento consultado divergente.');
  return payment;
 };
}

export function createMpPreference({accessToken,fetcher=fetch}={}){
 if(typeof accessToken!=='string'||!accessToken.trim()||/[\r\n]/.test(accessToken))throw Error('Credencial Mercado Pago não configurada no servidor.');
 return async ({orderId,pack,backUrl,notificationUrl})=>{
  if(typeof orderId!=='string'||!/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(orderId))throw Error('Identificador de pedido inválido.');
  if(!pack||typeof pack.priceCents!=='number'||pack.priceCents<=0)throw Error('Pacote inválido.');
  const payload={
   items:[{
    id:pack.id||'gold-pack',
    title:pack.name||`Pacote de Gold (${pack.gold} Gold)`,
    description:`Crédito de ${pack.gold} Gold para Crypt Royale`,
    quantity:1,
    currency_id:'BRL',
    unit_price:pack.priceCents/100
   }],
   external_reference:orderId,
   notification_url:notificationUrl||'https://crypt-royale-commerce-beta.onrender.com/api/v1/webhooks/mercadopago',
   back_urls:{
    success:backUrl||'https://monstercrypt-royale.web.app/?payment=success',
    failure:backUrl||'https://monstercrypt-royale.web.app/?payment=failure',
    pending:backUrl||'https://monstercrypt-royale.web.app/?payment=pending'
   },
   auto_return:'approved',
   payment_methods:{installments:1}
  };
  let response;
  try{
   response=await fetcher('https://api.mercadopago.com/checkout/preferences',{
    method:'POST',
    headers:{
     Authorization:'Bearer '+accessToken,
     'Content-Type':'application/json'
    },
    body:JSON.stringify(payload),
    redirect:'error',
    signal:AbortSignal.timeout(10000)
   });
  }catch{throw Error('Mercado Pago indisponível para criar checkout. Tente novamente.');}
  if(!response.ok)throw Error('Mercado Pago rejeitou criação da preferência.');
  const data=await response.json();
  if(!data.id||!data.init_point)throw Error('Resposta de checkout inválida do Mercado Pago.');
  return {
   preferenceId:data.id,
   initPoint:data.init_point,
   sandboxInitPoint:data.sandbox_init_point
  };
 };
}
