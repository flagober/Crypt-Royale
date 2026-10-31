// Internal, non-transferable game credits. Never an on-chain token balance.
export const MCT_MILESTONES=Object.freeze([{day:7,amount:5},{day:14,amount:7},{day:21,amount:10},{day:30,amount:15}]);
export const loyaltyDay=(now=Date.now())=>Math.floor((now-10800000)/86400000);
export function validateLoyalty(s){if(!s||s.version!==1||typeof s.owner!=='string'||!Number.isSafeInteger(s.lastDay)||!Number.isInteger(s.sequence)||s.sequence<1||s.sequence>30||!Number.isSafeInteger(s.cycle)||s.cycle<0||!Number.isSafeInteger(s.balance)||s.balance<0||s.balance>1000000000)throw Error('Registro de créditos inválido. Saldo anterior preservado.');return s;}
export function advanceLoyalty(current,uid,now=Date.now()){
 if(!uid)throw Error('Entre na conta para confirmar a sequência.');const day=loyaltyDay(now);
 if(current){validateLoyalty(current);if(current.owner!==uid)throw Error('Registro pertence a outra conta.');if(day<current.lastDay)throw Error('Confira a data do aparelho.');if(day===current.lastDay)return {...current};}
 const continuous=current&&day-current.lastDay===1&&current.sequence<30;
 const sequence=continuous?current.sequence+1:1,cycle=current?current.cycle+(continuous?0:1):0;
 return validateLoyalty({version:1,owner:uid,lastDay:day,sequence,cycle,balance:(current?.balance||0)+(MCT_MILESTONES.find(m=>m.day===sequence)?.amount||0)});
}
export function loyaltyView(current,now=Date.now()){
 if(!current)return {balance:null,sequence:0,next:7,today:false};validateLoyalty(current);const gap=loyaltyDay(now)-current.lastDay;
 const sequence=gap>1?0:current.sequence;return {balance:current.balance,sequence,next:MCT_MILESTONES.find(m=>m.day>sequence)?.day||7,today:gap===0,reset:gap>1};
}
