export const CAREER_CLASS_IDS=Object.freeze(['warrior','archer','mage','assassin','smuggler','novice','summoner']);
export const CLASS_TIERS=Object.freeze([
 {tier:1,name:'Classe-base',base:1,job:1,implemented:true},
 {tier:2,name:'Especialização',base:40,job:20,implemented:true},
 {tier:3,name:'Ascensão',base:80,job:40,implemented:false},
 {tier:4,name:'Despertar',base:130,job:70,implemented:false},
 {tier:5,name:'Transcendência',base:200,job:100,implemented:false},
]);
export const JOB_CAP=120;
export const JOB_XP_PER_MATCH=Object.freeze({player:20,enemy:10,draw:10});
export const jobXpForLevel=level=>20*(level-1)*level;
function xpLevel(xp,scale,cap){
 if(!Number.isSafeInteger(xp)||xp<0)throw Error('XP inválido. Seus dados foram preservados.');
 let level=1;while(level<cap&&xp>=scale*level*(level+1))level++;
 const floor=scale*(level-1)*level,next=level===cap?floor:scale*level*(level+1);
 return {level,xp,currentXp:xp-floor,neededXp:next-floor,nextXp:next,percent:level===cap?100:Math.min(100,(xp-floor)/(next-floor)*100)};
}
export const baseLevel=xp=>xpLevel(xp,50,200);
export const jobLevel=xp=>xpLevel(xp,20,JOB_CAP);
export const createCareer=()=>({version:1,jobXp:Object.fromEntries(CAREER_CLASS_IDS.map(id=>[id,0]))});
export function validateCareer(value){
 if(value===undefined)return;
 if(!value||value.version!==1||!value.jobXp||Array.isArray(value.jobXp)||typeof value.jobXp!=='object'||
 Object.keys(value.jobXp).length!==CAREER_CLASS_IDS.length||CAREER_CLASS_IDS.some(id=>!Object.hasOwn(value.jobXp,id)||!Number.isSafeInteger(value.jobXp[id])||value.jobXp[id]<0))
  throw Error('Progresso Job inválido. Seus dados foram preservados.');
}
export function careerState(profile){
 const stored=profile.progression?.career;validateCareer(stored);
 return stored||createCareer();
}
export function classCareer(profile,id){
 if(!CAREER_CLASS_IDS.includes(id))throw Error('Classe desconhecida.');
 return {base:baseLevel(profile.wallet.xp),job:jobLevel(careerState(profile).jobXp[id])};
}
export function classTierRequirements(profile,id,tier){
 const gate=CLASS_TIERS.find(g=>g.tier===tier);if(!gate)throw Error('Tier desconhecido.');
 const {base,job}=classCareer(profile,id);
 return {...gate,levelsMet:base.level>=gate.base&&job.level>=gate.job};
}
// Called only after recordBattle's eligibility and persistent match-id check.
// Existing Base XP is never copied into Job; offline/account saves keep this field.
export function creditBattleJobs(profile,winner,activeClasses){
 const amount=JOB_XP_PER_MATCH[winner];if(!amount)throw Error('Resultado Job inválido.');
 const career=structuredClone(careerState(profile));
 for(const id of new Set(activeClasses)){
  if(!CAREER_CLASS_IDS.includes(id))throw Error('Classe desconhecida.');
  const next=career.jobXp[id]+amount;
  if(!Number.isSafeInteger(next))throw Error('Limite de XP Job excedido. Dados preservados.');
  career.jobXp[id]=next;
 }
 validateCareer(career);return career;
}
