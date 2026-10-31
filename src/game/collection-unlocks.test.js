import test from 'node:test';
import assert from 'node:assert/strict';
import {createProgress,validateProgress,activityView,advanceProgress} from './activities.js';
import {CARDS} from './cards.js';
import {availableCardIds,progressionView,upgradeMonster,evolveMonster,recordCampaignBattle,createProgression} from './progression.js';
import {configureCampaign,configureCollection} from './progression-engine.js';
import {createGame,deployCard,stepGame} from './engine.js';
const now=Date.parse('2026-10-28T15:00:00Z');
const result=(stage,extra={})=>({id:`battle-${stage}`,campaignStageId:`stage-${stage}`,winner:'player',durationMs:60000,automaticUsed:false,cardsUsed:{'bit-bug':1},playerCrowns:1,...extra});
const finish=(profile,to)=>{let p=profile;for(let i=1;i<=to;i++)p=recordCampaignBattle(p,result(i),now);return p;};

test('new profiles begin with eight families; chapter victories unlock four and four exactly once',()=>{
 const initial=createProgress(now),snapshot=structuredClone(initial);
 assert.deepEqual(availableCardIds(initial),CARDS.slice(0,8).map(c=>c.id));
 const two=finish(initial,2);assert.equal(availableCardIds(two).length,8);
 const three=recordCampaignBattle(two,result(3),now);assert.equal(availableCardIds(three).length,12);
 const six=finish(three,6);assert.equal(availableCardIds(six).length,16);
 assert.deepEqual(recordCampaignBattle(three,result(3),now),three);assert.deepEqual(initial,snapshot);
 assert.equal(progressionView(six).collection.unlocked,16);validateProgress(six);
});
test('legacy saves keep every family, all wallet resources, evolved forms, receipts and class choices',()=>{
 const p=createProgress(now);delete p.progression;delete p.daily.featuredCardId;
 p.wallet={gold:10000,xp:345,dataFragments:2,cards:{'cache-mantis':50}};p.receipts.push({key:'old'});
 const original=structuredClone(p);assert.equal(availableCardIds(p).length,16);assert.deepEqual(p,original);
 const upgraded=upgradeMonster(p,'cache-mantis',1);assert.equal(upgraded.wallet.cards['cache-mantis'],48);assert.equal(upgraded.wallet.xp,345);assert.deepEqual(upgraded.receipts,p.receipts);
 const withProgression=createProgress(now);withProgression.progression=createProgression();withProgression.progression.monsters['cache-mantis']={level:5,form:2};withProgression.progression.classes.warrior.branch='paladin';
 assert.equal(availableCardIds(withProgression).length,16);assert.equal(progressionView(withProgression).monsters.at(-1).form,2);assert.equal(withProgression.progression.classes.warrior.branch,'paladin');
});
test('copies from rewards do not bypass arenas, and blocked actions cannot spend resources',()=>{
 const p=createProgress(now);p.wallet.gold=5000;p.wallet.cards['cache-mantis']=100;const original=structuredClone(p);
 assert(!availableCardIds(p).includes('cache-mantis'));
 assert.throws(()=>upgradeMonster(p,'cache-mantis',1),/bloquear|liberar/);assert.throws(()=>evolveMonster(p,'cache-mantis',0),/liberar/);assert.deepEqual(p,original);
 const v=progressionView(p).monsters.at(-1);assert.equal(v.copies,100);assert.equal(v.unlocked,false);assert.equal(v.canUpgrade,false);
 const n=finish(p,6);assert.equal(n.wallet.cards['cache-mantis'],100);assert(availableCardIds(n).includes('cache-mantis'));
});
test('campaign and normal training restrict both direct deployment and hand rotation to available families',()=>{
 const p=createProgress(now);
 for(const game of [configureCampaign(createGame(),p,'stage-1'),configureCollection(createGame(),p)]){
  assert.equal(game.playerHand.length+game.playerQueue.length,8);
  const before=structuredClone(game);assert.equal(deployCard(game,'cache-mantis',90,430).ok,false);assert.equal(deployCard(game,'cache-mantis',90,190,'enemy').ok,false);assert.deepEqual(game,before);
  for(let i=0;i<16;i++){game.playerEnergy=10;assert(deployCard(game,game.playerHand[0],90,430).ok);assert(game.playerHand.every(id=>availableCardIds(p).includes(id)));}
 }
 const game=configureCampaign(createGame(123),p,'stage-1');for(let i=0;i<500;i++){stepGame(game,100);assert(game.units.every(u=>CARDS.slice(0,8).some(c=>c.id===u.cardId)));}
});
test('battle access is frozen; replayed enemy chapter does not use later cards',()=>{
 let p=finish(createProgress(now),6);const game=configureCampaign(createGame(),p,'stage-1');assert.equal(game.allowedCards.player.length,16);assert.equal(game.allowedCards.enemy.length,8);
 const novice=createProgress(now),g=configureCollection(createGame(),novice);p=finish(novice,6);assert.equal(availableCardIds(p).length,16);assert.equal(g.allowedCards.player.length,8);
});
test('loss, automation and summaries with a locked family do not unlock a new arena',()=>{
 const p=finish(createProgress(now),2);
 for(const extra of [{winner:'enemy'},{winner:'draw'},{automaticUsed:true},{cardsUsed:{'cache-mantis':1}}]){const n=recordCampaignBattle(p,result(3,extra),now);assert.equal(availableCardIds(n).length,8);assert(!n.progression.campaign.completed['stage-3']);}
});
test('daily featured family is playable and remains stable when an arena unlocks during the day',()=>{
 const p=createProgress(now),featured=activityView(p,now).featured.id;assert(availableCardIds(p).includes(featured));
 const n=finish(p,6);assert.equal(activityView(n,now).featured.id,featured);
 const tomorrow=now+86400000,next=advanceProgress(n,tomorrow);assert(availableCardIds(next).includes(activityView(next,tomorrow).featured.id));
 const legacy=structuredClone(p);delete legacy.progression;delete legacy.daily.featuredCardId;assert.doesNotThrow(()=>activityView(legacy,now));
});
test('unsupported collection policies fail safely rather than silently resetting progress',()=>{
 const p=createProgress(now);p.progression.collectionPolicy='future-unsupported';const snapshot=structuredClone(p);assert.throws(()=>validateProgress(p),/preservados/);assert.deepEqual(p,snapshot);
});
test('approved Bit Bug forms use distinct collection art and unchanged costs; other families keep an explicit fallback',()=>{
 let p=createProgress(now);p.wallet.gold=10000;p.wallet.cards['bit-bug']=100;
 p.progression.monsters['bit-bug'].level=6;p=evolveMonster(p,'bit-bug',0);let m=progressionView(p).monsters[0];assert.equal(m.name,'Bit Bug Mk-II');assert.match(m.art,/bit-bug-mk2-master/);assert(m.formArt);assert.equal(p.wallet.cards['bit-bug'],80);assert.equal(p.wallet.gold,9500);
 p.progression.monsters['bit-bug'].level=10;p=evolveMonster(p,'bit-bug',1);m=progressionView(p).monsters[0];assert.match(m.art,/bit-bug-apex-master/);assert.equal(p.wallet.cards['bit-bug'],30);assert.equal(p.wallet.gold,8000);
 p.wallet.cards['data-mouse']=20;p.progression.monsters['data-mouse'].level=6;p=evolveMonster(p,'data-mouse',0);assert.equal(progressionView(p).monsters[1].formArt,false);
});
