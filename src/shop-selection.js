import {CARD_BY_ID} from './game/cards.js';
import {AUTO_PASS,selectedCopies} from './shop.js';

export function reconcileCardSelection(selection,inventory){
 const next={};let remaining=AUTO_PASS.cards;
 for(const [id,value] of Object.entries(selection||{})){
  const owned=inventory?.[id];
  if(!Object.hasOwn(CARD_BY_ID,id)||!Number.isSafeInteger(owned)||owned<=0||!Number.isSafeInteger(value)||value<=0)continue;
  const quantity=Math.min(value,owned,remaining);
  if(quantity)next[id]=quantity;
  remaining-=quantity;
 }
 return next;
}

export function cardSelectionLimit(selection,inventory,id){
 if(!Object.hasOwn(CARD_BY_ID,id))return 0;
 const owned=inventory?.[id];
 if(!Number.isSafeInteger(owned)||owned<=0)return 0;
 return Math.max(0,Math.min(owned,AUTO_PASS.cards-selectedCopies(selection)+(selection[id]||0)));
}

export function updateCardSelection(selection,inventory,id,value){
 const next=reconcileCardSelection(selection,inventory);
 if(!Object.hasOwn(CARD_BY_ID,id)||!Number.isSafeInteger(value))return next;
 const quantity=Math.max(0,Math.min(value,cardSelectionLimit(next,inventory,id)));
 if(quantity)next[id]=quantity;else delete next[id];
 return next;
}
