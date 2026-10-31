import test from 'node:test';import assert from 'node:assert/strict';
import {createProgress,validateProgress} from './activities.js';
import {createProgression,progressionState,progressionView,upgradeMonster,evolveMonster,upgradeClass,specializeClass,recordCampaignBattle,isStageUnlocked,STAGES,LEVEL_CAP} from './progression.js';
const now=Date.parse('2026-10-27T15:00:00Z');
function funded(){const p=createProgress(now);p.wallet.gold=10000;p.wallet.cards['bit-bug']=200;p.progression=createProgression();return p;}
const win=(id,stage='stage-1',extra={})=>({id,campaignStageId:stage,winner:'player',durationMs:60000,automaticUsed:false,cardsUsed:{'bit-bug':1},playerCrowns:2,...extra});
test('legacy wallet and XP remain intact with a default collection and player level',()=>{
 const p=createProgress(now);p.wallet={gold:375,xp:110,dataFragments:1,cards:{'bit-bug':2}};const original=structuredClone(p);
 const v=progressionView(p);assert.equal(v.player.level,2);assert.equal(v.monsters[0].copies,2);assert.equal(v.monsters[0].level,1);assert.equal(v.campaign.completed,0);assert.deepEqual(p,original);
 assert.equal(v.monsters.length,16);assert(v.monsters.every(m=>m.formCount===3));assert.equal(v.stages.filter(s=>s.unlocked).length,1);
});
test('level upgrades debit exact family copies and Gold, never XP or another family',()=>{
 const p=funded();p.wallet.cards['data-mouse']=4;const n=upgradeMonster(p,'bit-bug',1);
 assert.equal(n.wallet.gold,9975);assert.equal(n.wallet.cards['bit-bug'],198);assert.equal(n.wallet.cards['data-mouse'],4);assert.equal(n.wallet.xp,0);assert.equal(n.progression.monsters['bit-bug'].level,2);assert.equal(p.wallet.gold,10000);
 assert.throws(()=>upgradeMonster(n,'bit-bug',1),/já mudou/);assert.throws(()=>upgradeMonster(p,'missing',1),/desconhecido/);
});
test('insufficient copies or Gold cannot spend resources, including at the level cap',()=>{
 for(const [cards,gold]of [[1,100],[2,24]]){const p=funded();p.wallet.cards['bit-bug']=cards;p.wallet.gold=gold;const old=structuredClone(p);assert.throws(()=>upgradeMonster(p,'bit-bug',1),/insuficientes/);assert.deepEqual(p,old);}
 const p=funded();p.progression.monsters['bit-bug'].level=LEVEL_CAP;assert.throws(()=>upgradeMonster(p,'bit-bug',LEVEL_CAP));assert.equal(progressionView(p).monsters[0].upgrade,null);
});
test('Royale forms require own levels 6 and 10 plus unchanged resources and stop at canonical final form',()=>{
 let p=funded();p.progression.monsters['bit-bug'].level=6;p=evolveMonster(p,'bit-bug',0);assert.equal(p.wallet.cards['bit-bug'],180);assert.equal(p.wallet.gold,9500);assert.equal(p.progression.monsters['bit-bug'].level,6);assert.equal(progressionView(p).monsters[0].name,'Bit Bug Mk-II');
 assert.throws(()=>evolveMonster(p,'bit-bug',0),/já mudou/);p.progression.monsters['bit-bug'].level=10;p=evolveMonster(p,'bit-bug',1);assert.equal(p.wallet.cards['bit-bug'],130);assert.equal(p.wallet.gold,8000);assert.equal(progressionView(p).monsters[0].name,'Bit Bug Apex');assert.throws(()=>evolveMonster(p,'bit-bug',2),/final/);
});
test('class levels and specialization use separate class cards and one canonical branch',()=>{
 let p=funded();p.progression.classes.warrior.cards=20;p=upgradeClass(p,'warrior',1);assert.equal(p.progression.classes.warrior.level,2);assert.equal(p.progression.classes.warrior.cards,18);assert.equal(p.wallet.cards['bit-bug'],200);
 p.wallet.xp=78000;p.progression.career.jobXp.warrior=7600;p=specializeClass(p,'warrior','paladin');assert.equal(p.progression.classes.warrior.cards,8);assert.equal(p.progression.classes.warrior.branch,'paladin');assert.throws(()=>specializeClass(p,'warrior','gladiator'),/já escolhida/);assert.throws(()=>specializeClass(p,'archer','paladin'),/inválida/);
});
test('campaign unlocks sequentially, grants first reward once and replay reward once per match',()=>{
 const p=createProgress(now);assert.throws(()=>recordCampaignBattle(p,win('locked','stage-2'),now),/liberada/);
 const a=recordCampaignBattle(p,win('a'),now);assert.equal(a.wallet.gold,175);assert.equal(a.wallet.xp,120);assert.equal(a.wallet.cards['bit-bug'],4);assert.equal(a.progression.classes.warrior.cards,2);assert.equal(a.progression.campaign.completed['stage-1'].stars,2);assert(isStageUnlocked(a,'stage-2'));
 assert.deepEqual(recordCampaignBattle(a,win('a'),now),a);const b=recordCampaignBattle(a,win('b'),now);assert.equal(b.wallet.gold,225);assert.equal(b.wallet.cards['bit-bug'],6);assert.equal(Object.keys(b.progression.campaign.completed).length,1);
});
test('loss/draw do not unlock; automation, short or inactive matches do not earn campaign rewards',()=>{
 for(const patch of [{winner:'enemy'},{winner:'draw'}]){const p=recordCampaignBattle(createProgress(now),win('a','stage-1',patch),now);assert.equal(p.wallet.xp,20);assert.equal(p.wallet.gold,10);assert(!isStageUnlocked(p,'stage-2'));}
 for(const patch of [{automaticUsed:true},{durationMs:29999},{cardsUsed:{}}]){const p=recordCampaignBattle(createProgress(now),win('a','stage-1',patch),now);assert.equal(p.wallet.gold,0);assert.equal(p.receipts.length,0);assert(!isStageUnlocked(p,'stage-2'));}
 const p=createProgress(now);assert.strictEqual(recordCampaignBattle(p,{...win('train'),campaignStageId:null},now),p);
});
test('all nine stages finish without a nonexistent tenth stage, preserving stars and family rewards',()=>{
 let p=createProgress(now);for(const s of STAGES)p=recordCampaignBattle(p,win(s.id,s.id),now);
 assert.equal(progressionView(p).campaign.completed,9);assert.equal(progressionView(p).campaign.nextStageId,null);assert.equal(p.wallet.dataFragments,3);assert.equal(p.receipts.length,9);assert.equal(Object.keys(p.wallet.cards).length,8);
});
test('malformed saved progression is rejected instead of resetting the wallet',()=>{
 for(const change of [p=>p.progression.monsters['bit-bug'].level=-1,p=>p.progression.classes.archer.cards=-1,p=>p.progression.classes.warrior.branch='mage',p=>p.progression.campaign.completed['stage-3']={stars:3,at:'now'}]){const p=funded();change(p);assert.throws(()=>validateProgress(p),/preservados/);}
 const p=funded();p.wallet.gold=Number.MAX_SAFE_INTEGER;assert.throws(()=>recordCampaignBattle(p,win('overflow'),now),/Limite/);assert.equal(p.wallet.gold,Number.MAX_SAFE_INTEGER);
});
