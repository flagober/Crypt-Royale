import {readFile} from 'node:fs/promises';
import {initializeApp,cert} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {getFirestore} from 'firebase-admin/firestore';
import {createCommerceServer} from '../server/commerce-http.js';
import {createPaymentRepository} from '../server/payments-repository.js';
import {createMpReader,createMpPreference} from '../server/mercadopago.js';
import {createPaymentEvents} from '../server/payment-events.js';

const checks={database:false,identity:false,provider:false,webhook:false};
let repository,verifyToken,readPayment,createPreference,paymentEvents;
const project='monstercrypt-core',secret=process.env.MP_WEBHOOK_SECRET||'';
try{
 const credentialPath=process.env.GOOGLE_APPLICATION_CREDENTIALS;
 if(credentialPath){
  const account=JSON.parse(await readFile(credentialPath,'utf8'));
  if(account.project_id!==project||account.type!=='service_account')throw Error('Invalid project');
  const app=initializeApp({credential:cert(account),projectId:project}),db=getFirestore(app);
  // Read-only readiness probe. A missing document is valid; credentials and IAM
  // must still permit the read. No player records are accessed here.
  await db.doc('cryptroyale_commerce_health/connectivity').get();checks.database=true;
  verifyToken=token=>getAuth(app).verifyIdToken(token,true);checks.identity=true;
  const token=process.env.MERCADOPAGO_ACCESS_TOKEN||'',expected=process.env.MP_COLLECTOR_ID||'';
  if(token&&/^\d{1,30}$/.test(expected)){
   const response=await fetch('https://api.mercadopago.com/users/me',{headers:{Authorization:'Bearer '+token},redirect:'error',signal:AbortSignal.timeout(10000)});
   if(!response.ok)throw Error('Provider unavailable');const merchant=await response.json();
   if(String(merchant.id)!==expected||merchant.site_id!=='MLB')throw Error('Wrong merchant');
   const mode=process.env.MP_LIVE_MODE;
   if(mode!=='true'&&mode!=='false')throw Error('Explicit provider mode required');
   repository=createPaymentRepository({db,collectorId:expected,liveMode:mode==='true'});
   readPayment=createMpReader({accessToken:token});
   createPreference=createMpPreference({accessToken:token});
   checks.provider=true;checks.webhook=secret.length>=16;
   paymentEvents=createPaymentEvents({db,processPayment:async id=>{
    const payment=await readPayment(id),reference=payment.external_reference;
    // One merchant application can also notify about unrelated legacy products.
    if(!/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(reference||'')||!await repository.hasOrder(reference))return{ignored:true};
    return repository.applyMp(reference,payment);
   }});
  }
 }
}catch{console.error('Commerce configuration not ready; check private credentials, permissions and provider configuration.');}
const checkoutEnabled=process.env.CHECKOUT_ENABLED==='false'?false:(checks.database&&checks.provider);
const defaultOrigins=[
 'https://monstercrypt-royale.web.app',
 'https://monstercrypt-royale.firebaseapp.com',
 'https://cryptroyale.local',
 'https://localhost',
 'http://localhost',
 'capacitor://localhost',
 'cryptroyale://app',
 'http://100.79.208.33:5174',
 'http://100.79.208.33:5178',
 'http://100.79.208.33:5179',
 'http://localhost:5174',
 'http://localhost:5173',
 'http://127.0.0.1:5174',
 'http://127.0.0.1:5173'
];
const server=createCommerceServer({repository,verifyToken,paymentEvents,createPreference,checkoutEnabled,webhookSecret:secret,readiness:()=>({...checks}),origins:defaultOrigins});
const drain=()=>{if(paymentEvents)void paymentEvents.drain().catch(()=>console.error('Payment queue unavailable; durable records preserved.'));};
const poll=setInterval(drain,15000);poll.unref();drain();
const port=Number(process.env.PORT||3017);if(!Number.isInteger(port)||port<1||port>65535)throw Error('Invalid PORT');
server.listen(port,'0.0.0.0',()=>console.log(`Crypt Royale commerce listening; checkout ${checkoutEnabled?'ENABLED':'disabled'}.`));
for(const event of ['SIGTERM','SIGINT'])process.on(event,()=>{clearInterval(poll);server.close(()=>process.exit(0));setTimeout(()=>process.exit(1),10000).unref();});
