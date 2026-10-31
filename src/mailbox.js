import {validateProgress} from './game/activities.js';
import {createProgression} from './game/progression.js';
import {CARD_BY_ID} from './game/cards.js';

export function validateGift(reward) {
  const fields=['gold','xp','dataFragments','cards','classCards'];
  if(!reward||Object.keys(reward).some(k=>!fields.includes(k))||fields.some(k=>!Object.hasOwn(reward,k)))throw Error('Brinde inválido.');
  for(const [key,max]of [['gold',100000],['xp',100000],['dataFragments',1000]])if(!Number.isSafeInteger(reward[key])||reward[key]<0||reward[key]>max)throw Error('Quantidade inválida no brinde.');
  for(const key of ['cards','classCards']){
    const entries=reward[key];
    if(!entries||typeof entries!=='object'||Array.isArray(entries))throw Error('Cartas inválidas.');
    for(const [id,n]of Object.entries(entries))if(!(key==='cards'?Object.hasOwn(CARD_BY_ID,id):['warrior','archer'].includes(id))||!Number.isSafeInteger(n)||n<0||n>1000)throw Error('Cartas inválidas.');
  }
  return reward;
}
// Called only with the immutable gift loaded inside the Firestore transaction.
export function applyGift(profile,id,reward,now=Date.now()) {
  validateProgress(profile);validateGift(reward);
  if(!/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(id))throw Error('Identificador do brinde inválido.');
  const p=structuredClone(profile),key='mail:'+id;
  if(p.receipts.some(r=>r.key===key))return p;
  for(const resource of ['gold','xp','dataFragments'])p.wallet[resource]+=reward[resource];
  for(const [card,n]of Object.entries(reward.cards))p.wallet.cards[card]=(p.wallet.cards[card]||0)+n;
  p.progression??=createProgression();
  for(const [classId,n]of Object.entries(reward.classCards))p.progression.classes[classId].cards+=n;
  p.receipts.push({key,at:new Date(now).toISOString(),reward:{gold:reward.gold,xp:reward.xp,dataFragments:reward.dataFragments,cards:{...reward.cards}},classCards:{...reward.classCards}});
  return validateProgress(p);
}
