import {CARDS} from './cards.js';
import {STAGES,progressionState,isStageUnlocked,monsterPower,availableCardIds,ARENA_UNLOCKS,arenaJourney} from './progression.js';

export function configureCollection(game,profile){
 if(game.nowMs!==0||game.status!=='playing'||game.units.length)throw Error('A coleção é definida antes da partida.');
 const ids=availableCardIds(profile);
 const state=progressionState(profile);
 game.allowedCards={player:[...ids],enemy:[...ids]};
 game.visualForms={player:Object.fromEntries(Object.entries(state.monsters).map(([id,m])=>[id,m.form])),enemy:{}};
 game.autoPassUntil=profile.commerce?.autoUntil||0;
 for(const tower of game.towers)if(tower.team==='player'&&tower.type==='core')tower.classBranch=state.classes.warrior.branch;
 game.playerHand=ids.slice(0,4);game.playerQueue=ids.slice(4);
 return game;
}

export function configureTraining(game,profile){
 configureCollection(game,profile);
 // Ignore old cosmetic map preferences: training follows saved arena progress.
 game.mapId=arenaJourney(profile).currentMapId;
 return game;
}

// Capture progression once, before a campaign match. Spending cards never changes a live match.
export function configureCampaign(game,profile,stageId){
 const stage=STAGES.find(s=>s.id===stageId);
 if(!stage||!isStageUnlocked(profile,stageId))throw Error('Vença a fase anterior para liberar esta batalha.');
 if(game.nowMs!==0||game.status!=='playing'||game.units.length)throw Error('A campanha deve começar em uma partida nova.');
 configureCollection(game,profile);
 // Enemy access follows the chapter being replayed, never a later arena.
 game.allowedCards.enemy=ARENA_UNLOCKS.filter(g=>!g.after||Number(g.after.split('-')[1])<stage.index).flatMap(g=>g.ids);
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
export function battleCard(game,card,team){const stats=game.cardStats?.[team]?.[card.id];return stats?{...card,...stats}:{...card,form:game.visualForms?.[team]?.[card.id]??0};}
