import test from 'node:test';import assert from 'node:assert/strict';
import {createProgress} from './activities.js';
import {BOSS_DIFFICULTIES,BOSS_PHASES,bossGate,nexusEvolutionGate,NEXUS_POLICY} from './advanced-content.js';
test('Nexus use and genesis have distinct resolved gates; own levels/bond/quest control forms but content stays unavailable',()=>{
 assert.deepEqual(NEXUS_POLICY.taming,{base:40,job:20,quest:'Pacto de Sincronia'});assert.deepEqual(NEXUS_POLICY.genesis,{base:80,job:40});assert.equal(NEXUS_POLICY.activeSlots,1);
 for(const [form,level,bond] of [[1,20,30],[2,45,70]]){
  assert.equal(nexusEvolutionGate({form,level:level-1,bond},true).requirementsMet,false);
  assert.equal(nexusEvolutionGate({form,level,bond:bond-1},true).requirementsMet,false);
  assert.equal(nexusEvolutionGate({form,level,bond},false).requirementsMet,false);
  const gate=nexusEvolutionGate({form,level,bond},true);assert.equal(gate.requirementsMet,true);assert.equal(gate.ready,false);
 }
 assert.equal(nexusEvolutionGate({form:3,level:45,bond:100},true).rule,null);assert.throws(()=>nexusEvolutionGate({form:4,level:45,bond:100},true));
});
test('boss difficulty gates require Base15, all nine victories, previous boss/degree, and cannot start unproduced encounters',()=>{
 const p=createProgress();p.wallet.xp=50*15*14;
 assert.equal(bossGate(p,'ram-ram','normal').requirementsMet,false);
 for(let i=1;i<=9;i++)p.progression.campaign.completed['stage-'+i]={stars:1,at:'2026-10-29T15:00:00Z'};
 assert.equal(bossGate(p,'ram-ram','normal').requirementsMet,true);assert.equal(bossGate(p,'ram-ram','normal').ready,false);
 assert.equal(bossGate(p,'ram-ram','veteran').requirementsMet,false);
 assert.equal(bossGate(p,'ram-ram','heroic',{'ram-ram:normal':true}).requirementsMet,false);
 assert.equal(bossGate(p,'ram-ram','heroic',{'ram-ram:veteran':true}).requirementsMet,true);
 assert.equal(bossGate(p,'buffer-golem','normal').requirementsMet,false);
 assert.equal(bossGate(p,'buffer-golem','normal',{'ram-ram:normal':true}).requirementsMet,true);
 p.wallet.xp--;assert.equal(bossGate(p,'ram-ram','normal').requirementsMet,false);
 assert.deepEqual(BOSS_PHASES.map(p=>p.hp),[1,.6,.3]);assert.deepEqual(BOSS_DIFFICULTIES.map(d=>d.name),['Normal','Veterano','Heroico']);assert.throws(()=>bossGate(p,'missing','normal'));
});
