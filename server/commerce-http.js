import {createServer} from 'node:http';
import {createHash,randomUUID} from 'node:crypto';
import {CATALOG} from './payments-domain.js';
import {verifyMpWebhook} from './mercadopago.js';

const uuid=/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i;
const paymentId=/^\d{1,30}$/;
const fault=(status,message)=>Object.assign(new Error(message),{status});
const publicOrder=o=>({id:o.id,packId:o.packId,currency:o.currency,amountCents:o.amountCents,gold:o.gold,status:o.status,credited:o.credited,reversed:o.reversed,reviewRequired:!!o.reviewRequired,createdAt:o.createdAt,expiresAt:o.expiresAt});
async function body(req){
 if(!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type']||''))throw fault(415,'Envie JSON.');
 let size=0,chunks=[];for await(const chunk of req){size+=chunk.length;if(size>4096)throw fault(413,'Requisição muito grande.');chunks.push(chunk);}
 try{const value=JSON.parse(Buffer.concat(chunks).toString('utf8'));if(!value||Array.isArray(value)||typeof value!=='object')throw Error();return value;}catch{throw fault(400,'JSON inválido.');}
}

const localOrigin=/^https?:\/\/(localhost|127\.0\.0\.1|100\.79\.208\.33)(:\d+)?$/;
const appOrigin=/^(cryptroyale|capacitor|ionic):\/\/(app|localhost)$/;
function isOriginAllowed(origin,allowed){
 if(!origin)return false;
 if(allowed.has(origin))return true;
 if(origin==='https://cryptroyale.local'||origin==='https://localhost'||origin==='http://localhost')return true;
 if(appOrigin.test(origin))return true;
 if(localOrigin.test(origin))return true;
 return false;
}

// Dependencies are injected. No development identity or in-memory financial fallback.
export function createCommerceServer({repository,verifyToken,paymentEvents,createPreference,checkoutEnabled=false,webhookSecret,origins=[],readiness=()=>({database:false,identity:false,provider:false,webhook:false}),clock=Date.now}={}){
 const allowed=new Set(origins),buckets=new Map();
 const limited=key=>{
  const now=clock(),old=buckets.get(key);if(old&&old.until>now){if(old.count++>=120)return true;return false;}
  if(buckets.size>=10000){for(const[k,v]of buckets){if(v.until<=now)buckets.delete(k);}if(buckets.size>=10000)return true;}
  buckets.set(key,{count:1,until:now+60000});return false;
 };
 const server=createServer(async(req,res)=>{
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
  const json=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data));};
  try{
   const origin=req.headers.origin;
   if(origin&&!isOriginAllowed(origin,allowed))throw fault(403,'Origem não autorizada.');
   if(origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');}
   const url=new URL(req.url,'http://service.invalid');
   if(req.method==='GET'&&url.pathname==='/health')return json(200,{ok:true,service:'crypt-royale-commerce',version:'0.1.2',checkoutEnabled:!!checkoutEnabled});
   if(limited('ip:'+req.socket.remoteAddress))throw fault(429,'Muitas requisições. Aguarde um minuto.');
   if(req.method==='OPTIONS'){
    if(!origin)throw fault(403,'Origem obrigatória.');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');res.setHeader('Access-Control-Allow-Headers','Authorization,Content-Type');res.writeHead(204);return res.end();
   }
   if(req.method==='GET'&&url.pathname==='/ready'){
    const checks=readiness(),ready=['database','identity','provider','webhook'].every(k=>checks[k]===true);
    return json(ready?200:503,{ready,checks,checkoutEnabled:!!checkoutEnabled});
   }
   if(req.method==='GET'&&url.pathname==='/api/v1/catalog')return json(200,{currency:'BRL',checkoutEnabled:!!checkoutEnabled,packs:Object.entries(CATALOG).map(([id,p])=>({id,...p}))});
   if(req.method==='POST'&&url.pathname==='/api/v1/webhooks/mercadopago'){
    const payload=await body(req),id=url.searchParams.get('data.id');
    if(!id||!paymentId.test(id)||url.searchParams.getAll('data.id').length!==1||url.searchParams.getAll('type').length>1||(url.searchParams.has('type')&&url.searchParams.get('type')!=='payment')||payload.type!=='payment'||String(payload.data?.id)!==id)throw fault(400,'Notificação inválida.');
    if(!webhookSecret||!paymentEvents)throw fault(503,'Conciliação indisponível.');
    if(!verifyMpWebhook({signature:req.headers['x-signature'],requestId:req.headers['x-request-id'],paymentId:id,secret:webhookSecret}))throw fault(401,'Assinatura inválida.');
    const key=createHash('sha256').update(id+':'+req.headers['x-request-id']+':'+req.headers['x-signature']).digest('hex');
    await paymentEvents.enqueue(id,key);
    json(200,{received:true,queued:true});
    setImmediate(()=>{void paymentEvents.drain().catch(()=>{});});return;
   }
   const orderMatch=url.pathname.match(/^\/api\/v1\/orders\/([a-f\d-]{36})$/i);
   const accountRoute=url.pathname==='/api/v1/gold/balance'||url.pathname==='/api/v1/orders'||!!orderMatch;
   if(accountRoute){
    if(!repository||!verifyToken)throw fault(503,'Serviço de contas indisponível.');
    const match=/^Bearer ([A-Za-z\d._-]{20,8192})$/.exec(req.headers.authorization||'');
    if(!match)throw fault(401,'Entre na sua conta.');
    let identity;try{identity=await verifyToken(match[1]);}catch{throw fault(401,'Sessão inválida. Entre novamente.');}
    if(!identity?.uid||identity.firebase?.sign_in_provider==='anonymous')throw fault(401,'Conta autenticada obrigatória.');
    if(limited('uid:'+identity.uid))throw fault(429,'Muitas requisições. Aguarde um minuto.');
    if(req.method==='GET'&&url.pathname==='/api/v1/gold/balance')return json(200,await repository.balance(identity.uid));
    if(req.method==='GET'&&orderMatch){
     let order;try{order=await repository.get(identity.uid,orderMatch[1]);}catch{throw fault(404,'Pedido não encontrado para esta conta.');}
     return json(200,{order:publicOrder(order)});
    }
    if(req.method==='POST'&&url.pathname==='/api/v1/orders'){
     if(!checkoutEnabled||!createPreference)throw fault(503,'Compras em homologação. Nenhuma cobrança foi criada.');
     const payload=await body(req);
     const {packId,provider='mercadopago'}=payload;
     if(!packId||!CATALOG[packId])throw fault(400,'Pacote inválido.');
     if(provider!=='mercadopago'&&provider!=='pix')throw fault(400,'Provedor de pagamento não suportado.');
     const orderId=randomUUID();
     const order=await repository.create({uid:identity.uid,packId,id:orderId,provider:'mercadopago'});
     const pack={id:packId,...CATALOG[packId]};
     const pref=await createPreference({
      orderId,
      pack,
      backUrl:'https://monstercrypt-royale.web.app/?payment=success',
      notificationUrl:'https://crypt-royale-commerce-beta.onrender.com/api/v1/webhooks/mercadopago'
     });
     return json(201,{
      order:publicOrder(order),
      preferenceId:pref.preferenceId,
      checkoutUrl:pref.initPoint,
      sandboxCheckoutUrl:pref.sandboxInitPoint
     });
    }
   }
   throw fault(404,'Rota não encontrada.');
  }catch(error){if(!res.headersSent)json(error.status||503,{error:error.status?error.message:'Serviço temporariamente indisponível. Nenhum pagamento foi confirmado por esta resposta.'});else res.end();}
 });
 server.requestTimeout=15000;server.headersTimeout=10000;server.keepAliveTimeout=5000;server.maxHeadersCount=40;
 return server;
}
