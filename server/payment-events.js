import {randomUUID} from 'node:crypto';
const validId=id=>typeof id==='string'&&/^\d{1,30}$/.test(id);
const validKey=key=>typeof key==='string'&&/^[a-f\d]{64}$/.test(key);
const errorCode=e=>['provider-not-found','provider-unavailable'].includes(e?.code)?e.code:'processing-failed';
// Private, durable ingress. A 200 receipt means queued, never paid or delivered.
export function createPaymentEvents({db,processPayment,clock=Date.now}){
 if(!db?.doc||!db?.collection||!db?.runTransaction||typeof processPayment!=='function')throw Error('Fila não configurada.');
 const ref=id=>{if(!validId(id))throw Error('Pagamento inválido.');return db.doc('cryptroyale_payment_events/'+id);};
 let draining=false;
 async function claim(id){return db.runTransaction(async tx=>{
  const target=ref(id),snapshot=await tx.get(target),old=snapshot.exists?snapshot.data():null,now=clock();
  if(!old||!Number.isSafeInteger(old.nextAttemptAt)||old.nextAttemptAt>now)return null;
  const next={...old,attempts:old.attempts+1,leaseId:randomUUID(),nextAttemptAt:now+60000,state:'processing'};
  tx.set(target,next);return next;
 });}
 async function finish(job,result,error){return db.runTransaction(async tx=>{
  const target=ref(job.paymentId),snapshot=await tx.get(target),old=snapshot.exists?snapshot.data():null;
  // A new event or lease supersedes the old worker, even after a long pause.
  if(!old||old.revision!==job.revision||old.leaseId!==job.leaseId)return false;
  const{nextAttemptAt,leaseId,lastError,...record}=old,now=clock();
  if(error){
   const review=old.attempts>=20;
   tx.set(target,{...record,state:review?'review':'retry',lastError:errorCode(error),updatedAt:now,...(review?{needsReview:true}:{nextAttemptAt:now+Math.min(3600000,1000*2**Math.min(old.attempts,12))})});
  }else tx.set(target,{...record,state:result?.needsReview?'review':result?.ignored?'ignored':'done',needsReview:!!result?.needsReview,completedAt:now});
  return true;
 });}
 return{
  async enqueue(id,key){
   if(!validKey(key))throw Error('Identificador de evento inválido.');
   return db.runTransaction(async tx=>{
    const target=ref(id),snapshot=await tx.get(target),old=snapshot.exists?snapshot.data():null,now=clock();
    if(old?.lastEventKey===key)return{duplicate:true};
    const revision=(old?.revision||0)+1;if(!Number.isSafeInteger(revision))throw Error('Limite de eventos excedido.');
    tx.set(target,{paymentId:id,lastEventKey:key,revision,attempts:0,state:'pending',createdAt:old?.createdAt??now,receivedAt:now,nextAttemptAt:now});
    return{duplicate:false};
   });
  },
  async drain(){
   if(draining)return;draining=true;
   try{
    const due=await db.collection('cryptroyale_payment_events').where('nextAttemptAt','<=',clock()).orderBy('nextAttemptAt').limit(10).get();
    await Promise.all(due.docs.map(async doc=>{
     const job=await claim(doc.id);if(!job)return;
     let result;try{result=await processPayment(job.paymentId);}catch(error){await finish(job,null,error);return;}
     await finish(job,result,null);
    }));
   }finally{draining=false;}
  },
 };
}
