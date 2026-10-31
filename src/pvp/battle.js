import {createGame,deployCard,activateOperator,ARENA} from '../game/engine.js';
import {availableCardIds,progressionState} from '../game/progression.js';
export function createPvpBattle(profiles,seed){
 const game=createGame(seed,'vila-byte');game.mode='pvp';game.automaticEnabled=false;
 game.allowedCards={};game.visualForms={player:{},enemy:{}};
 for(const [i,team]of ['player','enemy'].entries()){
  const ids=availableCardIds(profiles[i]),s=progressionState(profiles[i]);
  game.allowedCards[team]=ids;game[team+'Hand']=ids.slice(0,4);game[team+'Queue']=ids.slice(4);
  game.visualForms[team]=Object.fromEntries(Object.entries(s.monsters).map(([id,m])=>[id,m.form]));
  for(const tower of game.towers)if(tower.team===team){tower.level=1;if(tower.type==='core')tower.classBranch=s.classes.warrior.branch;}
 }
 // Symmetric geometry, normalized attributes, preserved art; no purchased stat advantage.
 for(const t of game.towers)if(t.team==='player')t.y=ARENA.height-game.towers.find(e=>e.id===t.id.replace('player-','enemy-')).y;
 game.enemyOperatorCooldownMs=0;game.enemyOperatorBastionMs=0;game.message='PvP amistoso · batalha manual, atributos normalizados.';
 return game;
}
export function applyPvpCommand(game,seat,command){
 const team=seat===0?'player':'enemy';
 if(command.type==='operator')return {ok:activateOperator(game,team)};
 if(command.type!=='deploy')return {ok:false,reason:'Comando desconhecido.'};
 const {cardId,x,y}=command;
 if(!Number.isFinite(x)||!Number.isFinite(y)||x<18||x>ARENA.width-18||y<ARENA.riverBottom+12||y>ARENA.height-38)return {ok:false,reason:'Posicione a tropa na metade azul.'};
 return deployCard(game,cardId,x,seat===0?y:ARENA.height-y,team);
}
const swap=team=>team==='player'?'enemy':team==='enemy'?'player':team;
const swapId=id=>typeof id==='string'?id.replace(/^(player|enemy)-/,(_,t)=>swap(t)+'-'):id;
function reflected(item){
 const v={...item};if(Number.isFinite(v.y))v.y=ARENA.height-v.y;if(Number.isFinite(v.casterY))v.casterY=ARENA.height-v.casterY;
 if(v.team)v.team=swap(v.team);if(v.id)v.id=swapId(v.id);if(v.towerId)v.towerId=swapId(v.towerId);
 if(Number.isFinite(v.aimAngle))v.aimAngle=-v.aimAngle;
 v.facing=({up:'down',down:'up',front:'back',back:'front'})[v.facing]||v.facing;
 return v;
}
export function pvpView(game,seat){
 const self=seat===0?'player':'enemy',opponent=swap(self);
 const view={mode:'pvp',mapId:game.mapId,nowMs:game.nowMs,remainingMs:game.remainingMs,status:game.status,
  winner:game.winner==='draw'?'draw':game.winner===self?'player':game.winner===opponent?'enemy':null,
  automaticEnabled:false,playerEnergy:game[self+'Energy'],playerHand:[...game[self+'Hand']],playerQueue:[game[self+'Queue'][0]],
  operatorCooldownMs:game[self==='player'?'operatorCooldownMs':'enemyOperatorCooldownMs'],operatorBastionMs:game[self==='player'?'operatorBastionMs':'enemyOperatorBastionMs'],
  units:structuredClone(game.units),towers:structuredClone(game.towers),effects:structuredClone(game.effects),zones:structuredClone(game.zones),
  visualForms:{player:game.visualForms[self],enemy:game.visualForms[opponent]},message:'PvP amistoso · atributos normalizados.'};
 if(seat===1){view.units=view.units.map(reflected);view.towers=view.towers.map(reflected);view.effects=view.effects.map(reflected);view.zones=view.zones.map(reflected);}
 if(view.status==='finished')view.message=view.winner==='draw'?'Amistoso empatado':view.winner==='player'?'Vitória no amistoso!':'Seu rival venceu o amistoso.';
 return view;
}
