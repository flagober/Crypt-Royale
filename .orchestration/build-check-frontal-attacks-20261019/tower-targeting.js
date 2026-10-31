export const TOWER_RANGE = Object.freeze({guard:105,core:125});

// Side guards own separate lanes. The exact centre line belongs to the core.
// The same rules apply to both teams, independently of visual tower size.
export function towerEngagement(tower,target,arena={width:360,height:560},range=TOWER_RANGE[tower?.type]) {
  if(!tower||!target||tower.hp<=0||target.hp<=0||tower.team===target.team)return 'alvo-invalido';
  if(![tower.x,tower.y,target.x,target.y,range].every(Number.isFinite))return 'alvo-invalido';
  if(target.x<0||target.x>arena.width||target.y<0||target.y>arena.height)return 'fora-da-arena';
  const midX=arena.width/2,midY=arena.height/2;
  if((tower.team==='player'&&target.y<midY)||(tower.team==='enemy'&&target.y>midY))return 'fora-da-metade';
  if(tower.type==='guard'){
    const ownLane=tower.x<midX?target.x<midX:tower.x>midX?target.x>midX:false;
    if(!ownLane)return 'fora-da-rota';
  }
  if(Math.hypot(target.x-tower.x,target.y-tower.y)>range)return 'fora-do-alcance';
  return 'permitido';
}
export function towerCanEngage(tower,target,arena,range) {
  return towerEngagement(tower,target,arena,range)==='permitido';
}
