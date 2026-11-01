import{createOrder,normalizeMpPayment,settleOrder}from'./payments-domain.js';
const uuid=/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i;
const user=uid=>{if(typeof uid!=='string'||!/^[A-Za-z0-9_-]{1,128}$/.test(uid))throw Error('Conta inválida.');return uid;};
const orderKey=id=>{if(typeof id!=='string'||!uuid.test(id))throw Error('Pedido inválido.');return id;};
const data=s=>s.exists?s.data():null;
const totals=(record,uid)=>{
 if(!record)return{owner:uid,creditsGold:0,debitsGold:0};
 if(record.owner!==uid||![record.creditsGold,record.debitsGold].every(n=>Number.isSafeInteger(n)&&n>=0))throw Error('Registro financeiro inválido; dados preservados.');
 return record;
};
// db must be a SERVER Firestore client with IAM authorization. Never pass Web SDK.
// HTTP layer must verify Firebase identity; uid must never come from request body.
export function createPaymentRepository({db,clock=Date.now,collectorId,liveMode}){
 if(!db?.runTransaction||!db?.doc)throw Error('Banco financeiro não configurado.');
 const orderRef=id=>db.doc('cryptroyale_payment_orders/'+orderKey(id));
 return {
  async create({uid,packId,id,provider}){
   const next=createOrder({uid,packId,id,provider,now:clock()}),ref=orderRef(id);
   return db.runTransaction(async tx=>{
    const old=data(await tx.get(ref));
    if(old){if(old.uid!==uid||old.packId!==packId||old.provider!==provider)throw Error('Pedido já pertence a outra compra.');return old;}
    tx.create(ref,next);return next;
   });
  },
  async get(uid,id){const record=data(await orderRef(id).get());if(!record||record.uid!==user(uid))throw Error('Pedido não encontrado para esta conta.');return record;},
  // Internal webhook scope check; never exposed as an unauthenticated HTTP read.
  async hasOrder(id){return(await orderRef(id).get()).exists;},
  async balance(uid){const record=totals(data(await db.doc('cryptroyale_paid_gold/'+user(uid)).get()),uid);return{creditsGold:record.creditsGold,debitsGold:record.debitsGold,netGold:record.creditsGold-record.debitsGold};},
  // rawApiPayment MUST come from createMpReader after authentication/signature.
  // No network call inside transaction: Firestore can retry this callback.
  async applyMp(id,rawApiPayment){
   const ref=orderRef(id);
   return db.runTransaction(async tx=>{
    const old=data(await tx.get(ref));if(!old)throw Error('Pedido não encontrado.');user(old.uid);
    const payment=normalizeMpPayment(rawApiPayment,old,{collectorId,liveMode});
    const decision=settleOrder(old,payment,clock());
    const receiptRef=db.doc('cryptroyale_payment_receipts/mercadopago:'+payment.paymentId);
    const walletRef=db.doc('cryptroyale_paid_gold/'+old.uid);
    const entryRef=decision.entryKey?db.doc('cryptroyale_paid_gold/'+old.uid+'/entries/'+decision.entryKey):null;
    // All reads precede writes, including the receipt uniqueness check.
    const receipt=data(await tx.get(receiptRef)),wallet=totals(data(await tx.get(walletRef)),old.uid);
    const entry=entryRef?data(await tx.get(entryRef)):null;
    if(receipt&&(receipt.orderId!==id||receipt.owner!==old.uid))throw Error('Pagamento já vinculado a outro pedido.');
    if(entry)throw Error('Lançamento inconsistente; conciliação necessária.');
    if(old.reviewRequired||payment.partialRefund||payment.status==='review'){
     if(!receipt)tx.create(receiptRef,{owner:old.uid,orderId:id,provider:'mercadopago',paymentId:payment.paymentId});
     tx.set(ref,{...old,paymentId:payment.paymentId,reviewRequired:true,lastVerifiedAt:Math.max(old.lastVerifiedAt,payment.updatedAt)});
     return{order:old,deltaGold:0,action:'none',needsReview:true,owner:old.uid};
    }
    if(decision.deltaGold!==0){
     const next={...wallet,creditsGold:wallet.creditsGold+Math.max(0,decision.deltaGold),debitsGold:wallet.debitsGold+Math.max(0,-decision.deltaGold)};
     if(![next.creditsGold,next.debitsGold].every(Number.isSafeInteger))throw Error('Limite financeiro excedido.');
     tx.set(walletRef,next);tx.create(entryRef,{orderId:id,owner:old.uid,deltaGold:decision.deltaGold,kind:decision.action,at:clock()});
    }
    if(!receipt)tx.create(receiptRef,{owner:old.uid,orderId:id,provider:'mercadopago',paymentId:payment.paymentId});
    tx.set(ref,decision.order);return{...decision,owner:old.uid};
   });
  },
 };
}
