import {CARDS,CARD_BY_ID} from './cards.js';
import {MAPS} from './maps.js';
import catalog from './families.json' with {type:'json'};

export const LEVEL_CAP=10;
export const UPGRADE_CARDS=[2,4,6,10,15,20,30,40,50];
export const UPGRADE_GOLD=[25,50,100,150,250,400,600,900,1300];
export const EVOLUTION_COSTS=[{cards:20,gold:500},{cards:50,gold:1500}];
export const CLASS_DEFS=[
 {id:'warrior',name:'Guerreiro / Guerreira',branches:[{id:'paladin',name:'Paladino / Paladina'},{id:'gladiator',name:'Gladiador / Gladiadora'}]},
 {id:'archer',name:'Arqueiro / Arqueira',branches:[{id:'hunter',name:'Caçador / Caçadora'},{id:'sharpshooter',name:'Franco-Atirador / Franco-Atiradora'}]},
];
export const SPECIALIZATION_COST={cards:10,gold:500};
export const STAGES=MAPS.flatMap((map,m)=>[0,1,2].map(n=>({id:`stage-${m*3+n+1}`,index:m*3+n+1,mapId:map.id,mapName:map.name,title:['Primeiro contato','Pressão nas rotas','Domínio da arena'][n],enemyLevel:[1,2,3,4,5,6,7,8,10][m*3+n],cardId:CARDS[(m*3+n)*2%CARDS.length].id})));
const whole=n=>Number.isSafeInteger(n)&&n>=0;
export function createProgression(){return {version:1,monsters:Object.fromEntries(CARDS.map(c=>[c.id,{level:1,form:0}])),classes:Object.fromEntries(CLASS_DEFS.map(c=>[c.id,{level:1,cards:0,branch:null}])),campaign:{completed:{},results:{}}};}
export function validateProgression(s){
 const fail=()=>{throw Error('Progressão inválida. Seus dados foram preservados.');};
 if(!s||s.version!==1||!s.monsters||!s.classes||!s.campaign?.completed||!s.campaign?.results||Array.isArray(s.monsters)||Array.isArray(s.campaign.completed)||Array.isArray(s.campaign.results))fail();
 for(const c of CARDS){const x=s.monsters[c.id];if(!x||!Number.isInteger(x.level)||x.level<1||x.level>LEVEL_CAP||!Number.isInteger(x.form)||x.form<0||x.form>=catalog.families[c.id].length)fail();}
 for(const c of CLASS_DEFS){const x=s.classes[c.id];if(!x||!Number.isInteger(x.level)||x.level<1||x.level>LEVEL_CAP||!whole(x.cards)||(x.branch!==null&&!c.branches.some(b=>b.id===x.branch)))fail();}
 for(const [id,x]of Object.entries(s.campaign.completed))if(!STAGES.some(st=>st.id===id)||!whole(x?.stars)||x.stars<1||x.stars>3||typeof x.at!=='string')fail();
 for(const x of Object.values(s.campaign.results))if(!x||!STAGES.some(st=>st.id===x.stageId)||!['player','enemy','draw','ineligible'].includes(x.winner))fail();
 // A later chapter cannot exist without all preceding first victories.
 for(const st of STAGES)if(s.campaign.completed[st.id]&&STAGES.some(pr=>pr.index<st.index&&!s.campaign.completed[pr.id]))fail();
 return s;
}
export function progressionState(profile){return profile.progression===undefined?createProgression():validateProgression(profile.progression);}
function editable(profile){const p=structuredClone(profile);p.progression=structuredClone(progressionState(profile));return p;}
export function playerLevel(xp){
 let level=1;while(level<200&&xp>=50*level*(level+1))level++;
 const floor=50*(level-1)*level,next=level===200?floor:50*level*(level+1);
 return {level,xp,currentXp:xp-floor,neededXp:next-floor,nextXp:next,percent:level===200?100:Math.min(100,(xp-floor)/(next-floor)*100)};
}
export function upgradeCost(level){return level>=LEVEL_CAP?null:{cards:UPGRADE_CARDS[level-1],gold:UPGRADE_GOLD[level-1]};}
export function monsterPower(level,form=0){return 1+(level-1)*.04+form*.12;}
const enough=(gold,copies,cost)=>!!cost&&gold>=cost.gold&&copies>=cost.cards;
export function isStageUnlocked(profile,id){const st=STAGES.find(s=>s.id===id);return !!st&&STAGES.filter(s=>s.index<st.index).every(s=>progressionState(profile).campaign.completed[s.id]);}
export function campaignReward(stage,first){
 return {gold:first?150+stage.index*25:50,xp:first?100+stage.index*20:50,dataFragments:first&&stage.index%3===0?1:0,cards:{[stage.cardId]:first?4:2},classCards:{[stage.index%2?'warrior':'archer']:first?2:1}};
}
export function progressionView(profile){
 const s=progressionState(profile),w=profile.wallet;
 return {player:playerLevel(w.xp),wallet:{...w,cardCount:Object.values(w.cards).reduce((a,b)=>a+b,0),classCardCount:Object.values(s.classes).reduce((a,b)=>a+b.cards,0)},
  monsters:CARDS.map(c=>{const v=s.monsters[c.id],copies=w.cards[c.id]||0,forms=catalog.families[c.id],upgrade=upgradeCost(v.level),cost=EVOLUTION_COSTS[v.form],evolve=forms[v.form+1]&&cost?{...cost,name:forms[v.form+1].name}:null,power=monsterPower(v.level,v.form);
   return {id:c.id,name:forms[v.form].name,baseName:c.name,art:c.cardArt,role:c.role,level:v.level,form:v.form,formCount:forms.length,forms:forms.map(x=>x.name),copies,upgrade,canUpgrade:enough(w.gold,copies,upgrade),evolve,canEvolve:enough(w.gold,copies,evolve),hp:Math.round(c.hp*power),damage:Math.round(c.damage*power)};
  }),
  classes:CLASS_DEFS.map(c=>{const v=s.classes[c.id],upgrade=upgradeCost(v.level);return {...c,...v,upgrade,canUpgrade:enough(w.gold,v.cards,upgrade),specialCost:SPECIALIZATION_COST,canSpecialize:!v.branch&&enough(w.gold,v.cards,SPECIALIZATION_COST)};}),
  stages:STAGES.map(st=>({...st,unlocked:isStageUnlocked(profile,st.id),completed:!!s.campaign.completed[st.id],stars:s.campaign.completed[st.id]?.stars||0,reward:campaignReward(st,!s.campaign.completed[st.id])})),
  campaign:{completed:Object.keys(s.campaign.completed).length,total:STAGES.length,nextStageId:STAGES.find(st=>!s.campaign.completed[st.id])?.id||null}};
}
function spend(p,copies,cost){if(!cost||!enough(p.wallet.gold,copies,cost))throw Error('Cartas ou Gold insuficientes. Nenhum recurso foi gasto.');p.wallet.gold-=cost.gold;return copies-cost.cards;}
export function upgradeMonster(profile,id,expectedLevel){
 if(!CARD_BY_ID[id])throw Error('Monstro desconhecido.');const p=editable(profile),v=p.progression.monsters[id];
 if(v.level!==expectedLevel)throw Error('Este nível já mudou. Confira a coleção.');
 p.wallet.cards[id]=spend(p,p.wallet.cards[id]||0,upgradeCost(v.level));v.level++;return p;
}
export function evolveMonster(profile,id,expectedForm){
 if(!CARD_BY_ID[id])throw Error('Monstro desconhecido.');const p=editable(profile),v=p.progression.monsters[id];
 if(v.form!==expectedForm)throw Error('Esta forma já mudou. Confira a coleção.');
 if(!catalog.families[id][v.form+1])throw Error('Este monstro já está na forma final.');
 p.wallet.cards[id]=spend(p,p.wallet.cards[id]||0,EVOLUTION_COSTS[v.form]);v.form++;return p;
}
export function upgradeClass(profile,id,expectedLevel){
 if(!CLASS_DEFS.some(c=>c.id===id))throw Error('Classe desconhecida.');const p=editable(profile),v=p.progression.classes[id];
 if(v.level!==expectedLevel)throw Error('Este nível já mudou. Confira a classe.');
 v.cards=spend(p,v.cards,upgradeCost(v.level));v.level++;return p;
}
export function specializeClass(profile,id,branch){
 const def=CLASS_DEFS.find(c=>c.id===id);if(!def?.branches.some(b=>b.id===branch))throw Error('Especialização inválida.');
 const p=editable(profile),v=p.progression.classes[id];if(v.branch)throw Error('Especialização já escolhida.');
 v.cards=spend(p,v.cards,SPECIALIZATION_COST);v.branch=branch;return p;
}
export function recordCampaignBattle(profile,b,now=Date.now()){
 if(!b?.campaignStageId)return profile;
 const stage=STAGES.find(s=>s.id===b.campaignStageId);if(!stage||!isStageUnlocked(profile,stage.id))throw Error('Fase não liberada.');
 if(typeof b.id!=='string'||!b.id||!['player','enemy','draw'].includes(b.winner))throw Error('Resultado da campanha inválido.');
 const p=editable(profile),state=p.progression;if(Object.hasOwn(state.campaign.results,b.id))return p;
 const used=Object.keys(b.cardsUsed||{}).filter(id=>CARD_BY_ID[id]&&Number.isSafeInteger(b.cardsUsed[id])&&b.cardsUsed[id]>0);
 const eligible=b.automaticUsed===false&&Number.isFinite(b.durationMs)&&b.durationMs>=30000&&used.length>0;
 state.campaign.results[b.id]={stageId:stage.id,winner:eligible?b.winner:'ineligible'};
 if(!eligible)return p;
 const first=b.winner==='player'&&!state.campaign.completed[stage.id];
 const value=b.winner==='player'?campaignReward(stage,first):{gold:10,xp:20,dataFragments:0,cards:{},classCards:{}};
 if(b.winner==='player')state.campaign.completed[stage.id]={stars:Math.max(state.campaign.completed[stage.id]?.stars||0,Math.max(1,Math.min(3,Math.trunc(b.playerCrowns)||1))),at:new Date(now).toISOString()};
 for(const key of ['gold','xp','dataFragments']){p.wallet[key]+=value[key];if(!whole(p.wallet[key]))throw Error('Limite de saldo excedido. Dados preservados.');}
 for(const[id,n]of Object.entries(value.cards)){p.wallet.cards[id]=(p.wallet.cards[id]||0)+n;if(!whole(p.wallet.cards[id]))throw Error('Limite de cartas excedido. Dados preservados.');}
 for(const[id,n]of Object.entries(value.classCards))state.classes[id].cards+=n;
 p.receipts.push({key:`campaign:${b.id}`,at:new Date(now).toISOString(),reward:{gold:value.gold,xp:value.xp,dataFragments:value.dataFragments,cards:value.cards},classCards:value.classCards});
 validateProgression(state);return p;
}
