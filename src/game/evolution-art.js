import art from './evolution-art.json' with {type:'json'};
export const EVOLUTION_ART=art;
export function evolutionSpriteKey(cardId,form){
 const key=`${cardId}:${form}`;
 return Number.isInteger(form)&&Object.hasOwn(art.unitForms,key)?key:cardId;
}
export function isPaladinTower(tower){return tower.type==='core'&&tower.classBranch==='paladin';}
export function paladinFrame(tower,pose,direction){
 const sex=tower.appearance==='female'?'female':'male',spec=art.paladin[sex];
 return {file:spec.file,x:Math.max(0,Math.min(3,pose))*art.cellSize,y:(art.attackRows[direction]??0)*art.cellSize,size:art.cellSize,pivotX:art.pivot[0],pivotY:art.pivot[1],scale:spec.displayHeight/122,tip:spec.tips?.[direction]??art.attackTip[direction]??art.attackTip.front};
}
