export const VIP_DURATION_MS=7*86400000;
export const VIP_TIERS=Object.freeze([
 Object.freeze({tier:1,name:'VIP 1',label:'Bronze',gold:5000,recoveryMs:18000,color:'#cd9565',title:'',entryEffect:false}),
 Object.freeze({tier:2,name:'VIP 2',label:'Prata',gold:12000,recoveryMs:16000,color:'#c4d7ee',title:'Guardião de Prata',entryEffect:false}),
 Object.freeze({tier:3,name:'VIP 3',label:'Ouro',gold:25000,recoveryMs:15000,color:'#f9d675',title:'Guardião de Ouro',entryEffect:true}),
]);
const uuid=/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;
const time=n=>Number.isSafeInteger(n)&&n>=0&&n<=8640000000000000;
const object=o=>o&&typeof o==='object'&&!Array.isArray(o);
export function validateVip(v){
 if(v===undefined)return;
 if(!object(v)||!Number.isInteger(v.tier)||!VIP_TIERS[v.tier-1]||!time(v.until)||!object(v.orders))throw Error('Registro VIP inválido. Seus dados foram preservados.');
 let latest=false;
 for(const[id,r]of Object.entries(v.orders)){
  const def=VIP_TIERS[r?.tier-1],at=Date.parse(r?.at);
  if(!uuid.test(id)||!object(r)||!Number.isInteger(r.tier)||!def||!time(at)||!time(r.from)||!time(r.until)||at>r.from||r.until-r.from!==VIP_DURATION_MS||r.gold!==def.gold||r.until>v.until)throw Error('Recibo VIP inválido. Seus dados foram preservados.');
  if(r.until===v.until&&r.tier===v.tier)latest=true;
 }
 if(!latest)throw Error('O VIP precisa de um recibo de compra válido.');
}
export function vipAccess(profile,now=null){
 const v=profile?.commerce?.vip;validateVip(v);const known=time(now),active=known&&!!v&&v.until>now;
 return {known,active,tier:active?v.tier:0,until:v?.until||0,config:active?VIP_TIERS[v.tier-1]:null};
}
export function purchaseVip(profile,tier,requestId,now){
 const def=VIP_TIERS[tier-1];
 if(!Number.isInteger(tier)||!def||typeof requestId!=='string'||!uuid.test(requestId)||!time(now))throw Error('Pedido VIP inválido. Confirme a conta e o horário online.');
 const c=profile?.commerce;validateVip(c?.vip);
 if(c!==undefined&&(!object(c)||!time(c.autoUntil)||!object(c.orders)))throw Error('Registro da loja inválido. Seus dados foram preservados.');
 const old=c?.vip?.orders?.[requestId];
 if(old){if(old.tier!==tier)throw Error('Este pedido já foi usado para outro VIP.');return structuredClone(profile);}
 const access=vipAccess(profile,now);
 if(access.active&&access.tier!==tier)throw Error('Aguarde o término do VIP atual para escolher outro nível. Você pode renovar o mesmo VIP.');
 if(!Number.isSafeInteger(profile?.wallet?.gold)||profile.wallet.gold<def.gold)throw Error('Gold insuficiente para este VIP.');
 const from=Math.max(now,c?.vip?.until||0),until=from+VIP_DURATION_MS;
 if(!time(until))throw Error('Validade VIP fora do limite.');
 const p=structuredClone(profile);p.commerce??={autoUntil:0,orders:{}};
 p.commerce.vip={tier,until,orders:{...(p.commerce.vip?.orders||{}),[requestId]:{tier,at:new Date(now).toISOString(),from,until,gold:def.gold}}};
 p.wallet.gold-=def.gold;validateVip(p.commerce.vip);return p;
}
export function bastionRecoveryMs(tier=0,mode){
 if(mode==='pvp')return 20000;
 if(!Number.isInteger(tier)||tier<0||tier>3)throw Error('Nível VIP inválido para a partida.');
 return tier?VIP_TIERS[tier-1].recoveryMs:20000;
}
