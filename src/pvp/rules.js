import {validateProgress} from '../game/activities.js';
import {baseLevel} from '../game/career.js';
export const PVP_PROTOCOL=1;
export const PVP_BASE=7;
export const ROOM_ALPHABET='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const normalizeCode=value=>String(value||'').trim().toUpperCase();
export const validCode=code=>typeof code==='string'&&code.length===6&&[...code].every(c=>ROOM_ALPHABET.includes(c));
export function pvpAccess(profile,authenticated){
 let base=0,vilaByte=false;
 try{validateProgress(profile);base=baseLevel(profile.wallet.xp).level;vilaByte=[1,2,3].every(i=>Object.hasOwn(profile.progression?.campaign?.completed||{},'stage-'+i));}catch{}
 const allowed=!!authenticated&&base>=PVP_BASE&&vilaByte;
 return {allowed,base,vilaByte,authenticated:!!authenticated,reason:!authenticated?'Entre na sua conta para desafiar um amigo.':base<PVP_BASE?'Alcance Base 7 para liberar o PvP amistoso.':!vilaByte?'Conclua as três batalhas de Vila Byte para liberar o amistoso.':'PvP amistoso liberado.'};
}
