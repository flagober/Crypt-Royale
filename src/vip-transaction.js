import {validateProgress} from './game/activities.js';
import {purchaseVip} from './vip.js';
// The beta wallet is owner-managed, like the other game saves. This is an
// atomic in-game Gold purchase, not a real-money/payment authority.
export function prepareVipCommit(saved,uid,expected,tier,id,now){
 if(!saved||saved.owner!==uid||saved.schema!==1||!Number.isSafeInteger(saved.revision)||saved.revision<1||typeof saved.profileJson!=='string')throw Error('Salve sua jornada na conta antes de comprar VIP.');
 const original=validateProgress(JSON.parse(saved.profileJson));
 // A lost response may leave the caller's expected revision behind. The
 // receipt is checked first, and belongs to this exact account and tier.
 if(original.commerce?.vip?.orders?.[id])return {changed:false,revision:saved.revision,profile:purchaseVip(original,tier,id,now)};
 if(saved.revision!==expected){const error=Error('Outro aparelho atualizou seu save. Sincronize antes de comprar.');error.code='save-conflict';throw error;}
 const profile=validateProgress(purchaseVip(original,tier,id,now));return {changed:true,revision:saved.revision+1,profile};
}
