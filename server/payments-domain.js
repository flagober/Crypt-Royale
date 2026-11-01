// Server-only domain. Persist decisions atomically with a globally unique receipt.
export const CATALOG=Object.freeze(Object.fromEntries([
 ['gold-500',149,500],['gold-1200',290,1200],['gold-2500',490,2500],['gold-5500',990,5500],['gold-12000',1990,12000],
].map(([id,priceCents,gold])=>[id,Object.freeze({priceCents,gold})])));
const verified=new WeakSet(),uuid=/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i;
const time=n=>Number.isSafeInteger(n)&&n>=0&&n<=8640000000000000;
const numericId=n=>typeof n==='string'&&/^\d{1,30}$/.test(n)||Number.isSafeInteger(n)&&n>0;
export function cents(value){
 if(!['string','number'].includes(typeof value)||!/^\d{1,9}(\.\d{1,2})?$/.test(String(value)))throw Error('Valor monetário inválido.');
 const[whole,fraction='']=String(value).split('.');return Number(whole)*100+Number(fraction.padEnd(2,'0'));
}
export function createOrder({uid,packId,id,now,provider}){
 if(typeof uid!=='string'||!/^[A-Za-z0-9_-]{1,128}$/.test(uid)||typeof id!=='string'||!uuid.test(id)||!time(now)||!time(now+1800000)||!['mercadopago','google-play'].includes(provider)||typeof packId!=='string'||!Object.hasOwn(CATALOG,packId))throw Error('Pedido de compra inválido.');
 const pack=CATALOG[packId];return Object.freeze({id,uid,packId,provider,currency:'BRL',amountCents:pack.priceCents,gold:pack.gold,createdAt:now,expiresAt:now+1800000,status:'pending',paymentId:null,credited:false,reversed:false,lastVerifiedAt:0});
}
export function normalizeMpPayment(raw,order,{collectorId,liveMode}){
 if(!raw||!numericId(raw.id)||!numericId(collectorId)||!numericId(raw.collector_id)||String(raw.collector_id)!==String(collectorId)||typeof liveMode!=='boolean'||raw.live_mode!==liveMode||raw.external_reference!==order.id||raw.currency_id!=='BRL'||cents(raw.transaction_amount)!==order.amountCents)throw Error('Pagamento não corresponde ao pedido.');
 const statuses={approved:'approved',pending:'pending',in_process:'pending',authorized:'pending',rejected:'rejected',cancelled:'cancelled',refunded:'refunded',charged_back:'charged_back',in_mediation:'review'};
 if(!Object.hasOwn(statuses,raw.status))throw Error('Estado de pagamento desconhecido.');
 const updatedAt=Date.parse(raw.date_last_updated),approvedAt=Date.parse(raw.date_approved);
 if(!time(updatedAt)||updatedAt<order.createdAt||raw.status==='approved'&&(!time(approvedAt)||approvedAt<order.createdAt||approvedAt>updatedAt))throw Error('Data de pagamento inválida.');
 const refund=cents(raw.transaction_amount_refunded??0);if(refund>order.amountCents)throw Error('Reembolso inválido.');
 const payment=Object.freeze({provider:'mercadopago',paymentId:String(raw.id),orderId:order.id,amountCents:order.amountCents,status:statuses[raw.status],updatedAt,approvedAt:time(approvedAt)?approvedAt:null,partialRefund:refund>0&&(!['refunded','charged_back'].includes(raw.status)||refund<order.amountCents)});verified.add(payment);return payment;
}
export function settleOrder(order,payment,now){
 if(!verified.has(payment)||!time(now)||payment.updatedAt>now||order.provider!==payment.provider||order.id!==payment.orderId||order.amountCents!==payment.amountCents)throw Error('Confirmação do provedor inválida.');
 if(order.paymentId&&order.paymentId!==payment.paymentId)throw Error('Outro pagamento exige conciliação manual.');
 const noChange=()=>({order,deltaGold:0,action:'none',needsReview:false});
 if(payment.updatedAt<order.lastVerifiedAt||order.status==='refunded'||order.status==='charged_back')return noChange();
 if(payment.partialRefund||payment.status==='review')return {order,deltaGold:0,action:'none',needsReview:true};
 if(order.credited&&['pending','rejected','cancelled'].includes(payment.status))return noChange();
 const next={...order,paymentId:payment.paymentId,lastVerifiedAt:payment.updatedAt,status:payment.status};let deltaGold=0,action='none';
 if(payment.status==='approved'&&!order.credited){next.credited=true;deltaGold=order.gold;action='grant';}
 if(['refunded','charged_back'].includes(payment.status)&&order.credited&&!order.reversed){next.reversed=true;deltaGold=-order.gold;action='reverse';}
 return {order:Object.freeze(next),deltaGold,action,receiptKey:'mercadopago:'+payment.paymentId,entryKey:action==='none'?null:action+':'+order.id,needsReview:now>order.expiresAt};
}
