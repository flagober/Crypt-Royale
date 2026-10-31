import {towerLayout,towerPose,TOWER_ART,guardAppearance,archerPose} from './tower-animation.js';
export function drawApprovedTower(ctx,tower,now,assets){
  if(!assets)return null;
  const layout=towerLayout(tower),body=layout.body;
  ctx.save();ctx.imageSmoothingEnabled=true;
  ctx.fillStyle=tower.team==='player'?'rgba(34, 211, 238, 0.4)':'rgba(251, 113, 133, 0.4)';
  ctx.beginPath();ctx.ellipse(layout.ground.x,layout.ground.y,body.width/2,body.width/6,0,0,Math.PI*2);ctx.fill();
  ctx.drawImage(tower.type==='core'?assets.tower:assets.base,body.x,body.y,body.width,body.height);
  if(tower.type==='core'){
    const direction=assets.characters[tower.appearance==='female'?'female':'male'][tower.facing??'front'];
    const pose=towerPose(tower,now),frame=direction.spec.frames[pose],scale=direction.spec.displayHeight/direction.spec.frames[0].height*(84/360);
    ctx.drawImage(direction.surfaces[pose],layout.foot.x-frame.pivotX*scale,layout.foot.y-frame.pivotY*scale,frame.width*scale,frame.height*scale);
  }
  if(tower.type==='guard'){
    const id=guardAppearance(tower),spec=TOWER_ART.archers[id],pose=archerPose(tower,now),frame=spec.frames[pose],scale=spec.displayHeight/spec.frames[0].height;
    ctx.drawImage(assets.archers[id].surfaces[pose],layout.foot.x-frame.pivotX*scale,layout.foot.y-frame.pivotY*scale,frame.width*scale,frame.height*scale);
  }
  ctx.restore();return layout;
}






