import {CARDS} from './cards.js';
import {STAGES,progressionState,isStageUnlocked,monsterPower} from './progression.js';

// Capture progression once, before a campaign match. Spending cards never changes a live match.
export function configureCampaign(game,profile,stageId){
 const stage=STAGES.find(s=>s.id===stageId);
 if(!stage||!isStageUnlocked(profile,stageId))throw Error('Vença a fase anterior para liberar esta batalha.');
 if(game.nowMs!==0||game.status!=='playing'||game.units.length)throw Error('A campanha deve começar em uma partida nova.');
 const state=structuredClone(progressionState(profile));
 game.campaignStageId=stageId;game.mapId=stage.mapId;game.progressionSnapshot=state;
 game.cardStats={player:{},enemy:{}};
 for(const card of CARDS){
  for(const team of ['player','enemy']){
   const v=team==='player'?state.monsters[card.id]:{level:stage.enemyLevel,form:0},power=monsterPower(v.level,v.form);
   game.cardStats[team][card.id]={level:v.level,form:v.form,hp:Math.round(card.hp*power),damage:Math.round(card.damage*power)};
  }
 }
 for(const tower of game.towers){
  const role=tower.type==='core'?'warrior':'archer',c=state.classes[role];
  const level=tower.team==='player'?c.level:stage.enemyLevel;
  const power=1+(level-1)*.04+(tower.team==='player'&&c.branch ? .1 : 0);
  tower.hp=tower.maxHp=Math.round(tower.maxHp*power);tower.combatDamage=Math.round((tower.type==='core'?72:54)*power);tower.level=level;
 }
 game.message=`Campanha · Fase ${stage.index}: ${stage.mapName}. Vitória manual libera a próxima fase.`;
 return game;
}
export function battleCard(game,card,team){const stats=game.cardStats?.[team]?.[card.id];return stats?{...card,...stats}:card;}
