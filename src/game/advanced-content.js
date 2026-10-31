import {baseLevel,classCareer} from './career.js';
export const NEXUS_POLICY=Object.freeze({
 version:1,ready:false,activeSlots:1,taming:{base:40,job:20,quest:'Pacto de Sincronia'},
 genesis:{base:80,job:40},
 evolutions:[{from:1,to:2,level:20,bond:30},{from:2,to:3,level:45,bond:70}],
 pilots:['Cyber Cub','Nano Slime'],
});
export const BOSS_DIFFICULTIES=Object.freeze([
 {id:'normal',name:'Normal',after:null},
 {id:'veteran',name:'Veterano',after:'normal'},
 {id:'heroic',name:'Heroico',after:'veteran'},
]);
export const BOSS_PILOTS=Object.freeze([
 {id:'ram-ram',name:'RAM Ram',level:15,after:null,mechanic:'Carga telegrafada e quebra de formação'},
 {id:'buffer-golem',name:'Buffer Golem',level:15,after:'ram-ram:normal',mechanic:'Zonas de perigo e posicionamento'},
]);
export const BOSS_PHASES=Object.freeze([{phase:1,hp:1},{phase:2,hp:.6},{phase:3,hp:.3}]);
export function nexusEvolutionGate(nexus,regionalQuest){
 if(!nexus||!Number.isInteger(nexus.level)||nexus.level<1||!Number.isInteger(nexus.form)||nexus.form<1||nexus.form>3||!Number.isInteger(nexus.bond)||nexus.bond<0||nexus.bond>100)
  throw Error('Estado Nexus inválido.');
 const rule=NEXUS_POLICY.evolutions.find(r=>r.from===nexus.form);
 return {rule:rule||null,requirementsMet:!!rule&&nexus.level>=rule.level&&nexus.bond>=rule.bond&&regionalQuest===true,ready:false};
}
export function bossGate(profile,bossId,difficultyId,completed={}){
 const boss=BOSS_PILOTS.find(b=>b.id===bossId),difficulty=BOSS_DIFFICULTIES.find(d=>d.id===difficultyId);
 if(!boss||!difficulty)throw Error('Desafio de boss desconhecido.');
 const arenasComplete=Array.from({length:9},(_,i)=>`stage-${i+1}`).every(id=>profile.progression?.campaign?.completed[id]);
 const requirementsMet=baseLevel(profile.wallet.xp).level>=boss.level&&arenasComplete&&
  (!boss.after||completed[boss.after]===true)&&(!difficulty.after||completed[`${boss.id}:${difficulty.after}`]===true);
 return {boss,difficulty,requirementsMet,ready:false};
}
export function advancedContentView(profile,classes){
 return {
  nexus:{...NEXUS_POLICY,access:classes.map(c=>{const v=classCareer(profile,c.id);return{id:c.id,tamingLevelsMet:v.base.level>=40&&v.job.level>=20,genesisLevelsMet:v.base.level>=80&&v.job.level>=40};})},
  bosses:BOSS_PILOTS.map(b=>({...b,...bossGate(profile,b.id,'normal'),phases:BOSS_PHASES})),
  difficulties:BOSS_DIFFICULTIES,
 };
}
