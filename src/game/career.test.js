import test from 'node:test';import assert from 'node:assert/strict';
import {createProgress,recordBattle,validateProgress,claimActivity} from './activities.js';
import {progressionView,evolveMonster,specializeClass,upgradeMonster} from './progression.js';
import {baseLevel,jobLevel,jobXpForLevel,CLASS_TIERS,validateCareer} from './career.js';
const now=Date.parse('2026-10-29T15:00:00Z');
const match=(id,extra={})=>({id,winner:'player',durationMs:60000,automaticUsed:false,cardsUsed:{'bit-bug':1},...extra});
function funded(){const p=createProgress(now);p.wallet.gold=10000;p.wallet.cards['bit-bug']=200;p.progression.classes.warrior.cards=20;return p;}

test('old Base XP, evolved forms and branches survive read and additive Job migration without retroactive XP',()=>{
 const p=funded();p.wallet.xp=110;delete p.progression.career;p.progression.monsters['bit-bug'].form=2;p.progression.classes.warrior.branch='paladin';
 const before=structuredClone(p),view=progressionView(p);
 assert.equal(view.player.level,2);assert.equal(view.classes[0].job.level,1);assert.equal(view.classes[0].job.xp,0);
 assert.equal(view.monsters[0].form,2);assert.equal(view.monsters[0].preservedForm,true);assert.equal(view.classes[0].preservedBranch,true);assert.deepEqual(p,before);
 const next=recordBattle(p,match('legacy'),now);
 assert.equal(next.wallet.xp,110);assert.equal(next.wallet.gold,10000);assert.equal(next.progression.career.jobXp.warrior,20);assert.equal(next.progression.career.jobXp.archer,20);assert.equal(next.progression.career.jobXp.mage,0);
 assert.equal(next.progression.monsters['bit-bug'].form,2);assert.equal(next.progression.classes.warrior.branch,'paladin');assert.deepEqual(recordBattle(next,match('legacy'),now),next);assert(validateProgress(next));
});
test('Job XP is granted once per eligible manual match, uses independent thresholds and survives ordinary rewards',()=>{
 let p=createProgress(now);p=recordBattle(p,match('one'),now);p=recordBattle(p,match('two'),now);p=recordBattle(p,match('loss',{winner:'enemy'}),now);p=recordBattle(p,match('draw',{winner:'draw'}),now);
 assert.equal(p.progression.career.jobXp.warrior,60);assert.equal(jobLevel(60).level,2);assert.equal(p.wallet.xp,0);
 const claimed=claimActivity(p,'checkin',null,now);assert.equal(claimed.progression.career.jobXp.warrior,60);assert.equal(claimed.wallet.xp,10);assert(validateProgress(JSON.parse(JSON.stringify(claimed))));
 for(const extra of [{automaticUsed:true},{durationMs:29999},{cardsUsed:{}},{cardsUsed:{'copper-mole':1}}]){
  const n=recordBattle(createProgress(now),match('ineligible',extra),now);assert.equal(n.progression.career.jobXp.warrior,0);
 }
 assert.equal(jobLevel(jobXpForLevel(20)-1).level,19);assert.equal(jobLevel(jobXpForLevel(20)).level,20);assert.equal(jobLevel(jobXpForLevel(120)).level,120);assert.equal(jobLevel(Number.MAX_SAFE_INTEGER).level,120);
});
test('new class specialization requires BOTH canonical Base and own Job; card reinforcement is not Job',()=>{
 const p=funded();p.wallet.xp=50*39*38;p.progression.career.jobXp.warrior=jobXpForLevel(20);
 let before=structuredClone(p);assert.throws(()=>specializeClass(p,'warrior','paladin'),/Base 40 e Job 20/);assert.deepEqual(p,before);
 p.wallet.xp=50*40*39;p.progression.career.jobXp.warrior=jobXpForLevel(20)-1;before=structuredClone(p);assert.throws(()=>specializeClass(p,'warrior','paladin'),/Base 40 e Job 20/);assert.deepEqual(p,before);
 p.progression.career.jobXp.warrior=jobXpForLevel(20);const n=specializeClass(p,'warrior','paladin');
 assert.equal(n.wallet.gold,9500);assert.equal(n.progression.classes.warrior.cards,10);assert.equal(n.progression.classes.warrior.level,1);assert.equal(n.progression.classes.warrior.branch,'paladin');assert.equal(n.progression.career.jobXp.warrior,7600);
 assert.throws(()=>specializeClass(n,'warrior','gladiator'),/já escolhida/);assert.equal(progressionView(p).classes[1].canSpecialize,false);
});
test('new monster forms require own levels 6 and 10 and retain the exact approved card/Gold costs',()=>{
 let p=funded();p.progression.monsters['bit-bug'].level=5;const old=structuredClone(p);
 assert.equal(progressionView(p).monsters[0].evolve.minLevel,6);assert.equal(progressionView(p).monsters[0].canEvolve,false);
 assert.throws(()=>evolveMonster(p,'bit-bug',0),/nível 6/);assert.deepEqual(p,old);
 p.progression.monsters['bit-bug'].level=6;p=evolveMonster(p,'bit-bug',0);assert.equal(p.wallet.gold,9500);assert.equal(p.wallet.cards['bit-bug'],180);
 p.progression.monsters['bit-bug'].level=9;assert.throws(()=>evolveMonster(p,'bit-bug',1),/nível 10/);
 p.progression.monsters['bit-bug'].level=10;p=evolveMonster(p,'bit-bug',1);assert.equal(p.wallet.gold,8000);assert.equal(p.wallet.cards['bit-bug'],130);assert.equal(p.progression.monsters['bit-bug'].form,2);
 const legacy=funded();legacy.progression.monsters['bit-bug'].form=1;assert(validateProgress(legacy));const reinforced=upgradeMonster(legacy,'bit-bug',1);assert.equal(reinforced.progression.monsters['bit-bug'].form,1);
});
test('future tiers retain canonical gates without activating missing content; invalid Job never resets a save',()=>{
 assert.deepEqual(CLASS_TIERS.map(t=>[t.base,t.job]),[[1,1],[40,20],[80,40],[130,70],[200,100]]);
 assert(CLASS_TIERS.slice(2).every(t=>!t.implemented));assert.equal(baseLevel(78000).level,40);
 for(const corrupt of [null,{version:2,jobXp:{}},{version:1,jobXp:[]},{version:1,jobXp:{warrior:0}}])assert.throws(()=>validateCareer(corrupt),/preservados/);
 const p=createProgress(now);p.progression.career.jobXp.warrior=-1;assert.throws(()=>validateProgress(p),/preservados/);assert.equal(p.progression.career.jobXp.warrior,-1);
 const max=createProgress(now);max.progression.career.jobXp.warrior=Number.MAX_SAFE_INTEGER;const old=structuredClone(max);assert.throws(()=>recordBattle(max,match('overflow'),now),/Limite/);assert.deepEqual(max,old);
});
