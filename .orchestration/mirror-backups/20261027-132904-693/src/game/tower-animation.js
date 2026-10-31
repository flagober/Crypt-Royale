import art from './tower-art.json' with {type:'json'};
export {art as TOWER_ART};
export const TOWER_ART_TIMING=Object.freeze({strike:120,recover:300,windup:180});
export function towerFacing(tower,target){
  const dx=target.x-tower.x,dy=target.y-tower.y,margin=Math.max(10,Math.abs(dy)*0.55)+(tower.facing==='front'?4:0);
  return Math.abs(dx)<=margin?'front':dx<0?'left':'right';
}
export function turnTower(current,desired,step){const delta=Math.atan2(Math.sin(desired-current),Math.cos(desired-current));return current+Math.sign(delta)*Math.min(Math.abs(delta),step);}
export function towerLayout(tower){
  const ground={x:tower.x,y:tower.y+(tower.type==='core'&&tower.team==='enemy'?64:0)};
  const isCore=tower.type==='core',scale=(isCore?72:60)/1312,verticalScale=scale*(isCore?1.15:0.85);
  const groundPivot=isCore?1120:1085;
  const body={x:ground.x-656*scale,y:ground.y-groundPivot*verticalScale,width:1312*scale,height:1199*verticalScale};
  const foot={x:ground.x,y:body.y+(isCore?400:420)*verticalScale};
  const mount={x:foot.x,y:foot.y-20};
  return {ground,scale,body,foot,mount,top:foot.y-(isCore?49:43)};
}
export function towerPose(tower,now){
  const age=tower.lastAttackAt==null?Infinity:now-tower.lastAttackAt;
  if(age>=0&&age<TOWER_ART_TIMING.strike)return 2;
  if(age>=0&&age<TOWER_ART_TIMING.recover)return 3;
  return tower.windingUp?1:0;
}
export function towerMuzzle(tower){
  const layout=towerLayout(tower);
  if(tower.type==='guard'){
    const spec=art.archers[guardAppearance(tower)],frame=spec.frames[1],scale=spec.displayHeight/spec.frames[0].height;
    return {x:layout.foot.x+(spec.tip.x-frame.pivotX)*scale,y:layout.foot.y+(spec.tip.y-frame.pivotY)*scale};
  }
  const character=art.characters.find(c=>c.id===(tower.appearance==='female'?'female':'male'));
  const spec=character.directions[tower.facing??'front'],frame=spec.frames[2],scale=spec.displayHeight/spec.frames[0].height*(84/360);
  return {x:layout.foot.x+(spec.tip.x-frame.x-frame.pivotX)*scale,y:layout.foot.y+(spec.tip.y-frame.y-frame.pivotY)*scale};
}
export function setCoreAppearance(game,appearance,team='player'){
  if(!['male','female'].includes(appearance))return false;
  const core=game.towers.find(t=>t.type==='core'&&t.team===team);if(!core)return false;
  core.appearance=appearance;return true;
}







export function guardAppearance(tower){return tower.x<180?'female':'male';}

export function archerPose(tower,now){
  const age=tower.lastAttackAt==null?Infinity:now-tower.lastAttackAt;
  if(age>=0&&age<100)return 2;
  if(age>=0&&age<350)return 3;
  return tower.aimTarget&&tower.attackLeftMs>0&&tower.attackLeftMs<=300?1:0;
}
