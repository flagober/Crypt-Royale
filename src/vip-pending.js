const uuid=/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;
const key=uid=>'cryptroyale.vip.pending.'+encodeURIComponent(uid);
export function readVipPending(storage,uid){
 if(!uid)return null;
 const raw=storage.getItem(key(uid));if(raw===null)return null;
 let value;try{value=JSON.parse(raw);}catch{throw Error('Pedido VIP pendente ilegível. Seus dados foram preservados.');}
 if(value?.uid!==uid||!uuid.test(value.id)||![1,2,3].includes(value.tier)||typeof value.sent!=='boolean')throw Error('Pedido VIP pendente inválido. Seus dados foram preservados.');
 return value;
}
export function saveVipPending(storage,order){
 if(!order?.uid||!uuid.test(order.id)||![1,2,3].includes(order.tier)||typeof order.sent!=='boolean')throw Error('Pedido VIP inválido.');
 const old=readVipPending(storage,order.uid);
 if(old?.sent&&(old.id!==order.id||old.tier!==order.tier||!order.sent))throw Error('Confira primeiro a compra VIP pendente.');
 storage.setItem(key(order.uid),JSON.stringify(order));return order;
}
export function clearVipPending(storage,uid,id){
 const old=readVipPending(storage,uid);
 if(old&&old.id!==id)throw Error('O pedido VIP mudou em outra janela.');
 if(old)storage.removeItem(key(uid));
}
