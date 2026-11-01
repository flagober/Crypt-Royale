import{CARD_BY_ID}from'./game/cards.js';
import{validateVip}from'./vip.js';
export const AUTO_PASS=Object.freeze({id:'sentinela-7d',days:7,gold:5000,dataFragments:20,cards:50});
const uuid=/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;
export function selectedCopies(selection){if(!selection||typeof selection!=='object'||Array.isArray(selection))throw Error('Escolha as cartas repetidas.');for(const[id,n]of Object.entries(selection))if(!Object.hasOwn(CARD_BY_ID,id)||!Number.isSafeInteger(n)||n<0)throw Error('Seleção de cartas inválida.');return Object.values(selection).reduce((a,b)=>a+b,0);}
export function validateCommerce(c){
 if(c===undefined)return;
 if(!c||!Number.isSafeInteger(c.autoUntil)||c.autoUntil<0||c.autoUntil>8640000000000000||!c.orders||typeof c.orders!=='object'||Array.isArray(c.orders))throw Error('Registro da loja inválido. Seus dados foram preservados.');
 for(const[id,r]of Object.entries(c.orders))if(!uuid.test(id)||!r||!Number.isFinite(Date.parse(r.at))||!Number.isSafeInteger(r.until)||r.until<0||selectedCopies(r.cards)!==50)throw Error('Recibo da loja inválido.');
 if(c.goldOrders){
  if(typeof c.goldOrders!=='object'||Array.isArray(c.goldOrders))throw Error('Registro de Gold da loja inválido.');
  for(const[id,r]of Object.entries(c.goldOrders))if(!uuid.test(id)||!r||!Number.isFinite(Date.parse(r.at))||!Number.isSafeInteger(r.gold)||r.gold<=0||typeof r.packId!=='string')throw Error('Recibo de Gold inválido.');
 }
 validateVip(c.vip);
}
export function autoAccess(profile,now=Date.now()){validateCommerce(profile?.commerce);const until=profile?.commerce?.autoUntil||0;return {active:until>now,until};}
export function purchaseAuto(profile,selection,requestId,now=Date.now()){
 validateCommerce(profile.commerce);if(!uuid.test(requestId)||!Number.isSafeInteger(now)||now<0)throw Error('Pedido inválido.');
 const entries=Object.entries(selection||{}).filter(([,n])=>n!==0).sort(([a],[b])=>a.localeCompare(b)),cards=Object.fromEntries(entries);
 if(selectedCopies(cards)!==AUTO_PASS.cards)throw Error('Escolha exatamente 50 cartas repetidas.');
 const old=profile.commerce?.orders?.[requestId];if(old){if(JSON.stringify(old.cards)!==JSON.stringify(cards))throw Error('Identificador já usado em outra compra.');return structuredClone(profile);}
 if(profile.wallet.gold<AUTO_PASS.gold||profile.wallet.dataFragments<AUTO_PASS.dataFragments)throw Error('Gold ou Fragmentos de Dados insuficientes.');
 for(const[id,n]of entries)if((profile.wallet.cards[id]||0)<n)throw Error('Cartas repetidas insuficientes. Nenhum recurso foi gasto.');
 const p=structuredClone(profile);p.commerce??={autoUntil:0,orders:{}};const until=Math.max(now,p.commerce.autoUntil)+AUTO_PASS.days*86400000;
 p.wallet.gold-=AUTO_PASS.gold;p.wallet.dataFragments-=AUTO_PASS.dataFragments;for(const[id,n]of entries)p.wallet.cards[id]-=n;
 p.commerce.autoUntil=until;p.commerce.orders[requestId]={at:new Date(now).toISOString(),until,cards};validateCommerce(p.commerce);return p;
}
// Client-side requests cannot authorize paid currency. Preserve legacy saves/receipts.
export function purchaseGoldPack(){
 throw Error('Compras em reais indisponíveis: falta confirmação do provedor no servidor. Nenhum Gold foi creditado.');
}
