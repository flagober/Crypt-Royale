import test from 'node:test';
import assert from 'node:assert/strict';
import {createProgress} from './activities.js';
import {arenaJourney,recordCampaignBattle,STAGES,isStageUnlocked} from './progression.js';
import {configureTraining,configureCampaign} from './progression-engine.js';
import {createGame,deployCard} from './engine.js';
const now=Date.parse('2026-10-28T20:00:00Z');
const win=(id,patch={})=>({id:'journey-'+id,campaignStageId:id,winner:'player',durationMs:60000,automaticUsed:false,cardsUsed:{'bit-bug':1},playerCrowns:2,...patch});
test('arenas advance only after three sequential victories, preserve saves and allow replays',()=>{
 let profile=createProgress(now);
 const original=structuredClone(profile);
 assert.deepEqual(arenaJourney(profile).arenas.map(a=>a.unlocked),[true,false,false]);
 assert.equal(arenaJourney(profile).nextStageId,'stage-1');
 assert.deepEqual(profile,original);
 for(const stage of STAGES){
  const before=arenaJourney(profile);
  assert.equal(before.currentMapId,stage.mapId);
  assert.equal(before.nextStageId,stage.id);
  profile=recordCampaignBattle(profile,win(stage.id),now);
  assert.equal(isStageUnlocked(profile,'stage-1'),true);
  assert.equal(configureCampaign(createGame(),profile,'stage-1').mapId,'vila-byte');
 }
 const before=structuredClone(profile),journey=arenaJourney(profile);
 assert.equal(journey.complete,true);
 assert.equal(journey.nextStageId,null);
 assert.equal(journey.currentMapId,'circuit-woods');
 assert.deepEqual(journey.arenas.map(a=>a.completed),[3,3,3]);
 assert.deepEqual(journey.arenas.map(a=>a.unlocked),[true,true,true]);
 configureTraining(createGame(),profile);
 assert.deepEqual(profile,before);
});
test('loss, draw, automatic and insufficient participation never advance an arena',()=>{
 for(const patch of [{winner:'enemy'},{winner:'draw'},{automaticUsed:true},{durationMs:29999},{cardsUsed:{}}]){
  const profile=recordCampaignBattle(createProgress(now),win('stage-1',patch),now);
  assert.equal(arenaJourney(profile).nextStageId,'stage-1');
  assert.equal(arenaJourney(profile).arenas[1].unlocked,false);
 }
});
test('training ignores a later cosmetic map, follows earned arena and keeps normalized attributes',()=>{
 let profile=createProgress(now);
 const game=configureTraining(createGame(undefined,'circuit-woods'),profile);
 assert.equal(game.mapId,'vila-byte');
 assert.equal(game.campaignStageId,undefined);
 for(const stage of STAGES.slice(0,3))profile=recordCampaignBattle(profile,win(stage.id),now);
 profile.progression.monsters['bit-bug'].level=10;
 const training=configureTraining(createGame(),profile);
 assert.equal(training.mapId,'copper-mines');
 deployCard(training,'bit-bug',60,430);
 assert.equal(training.units[0].maxHp,95);
 assert.equal(training.units[0].damage,22);
 assert.throws(()=>configureTraining(training,profile),/antes da partida/);
 assert.throws(()=>configureCampaign(createGame(),profile,'stage-7'),/anterior/);
});
