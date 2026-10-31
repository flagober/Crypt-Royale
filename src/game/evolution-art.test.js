import test from 'node:test';import assert from 'node:assert/strict';
import {evolutionSpriteKey,paladinFrame,isPaladinTower} from './evolution-art.js';
import {createProgress} from './activities.js';import {evolveMonster,specializeClass} from './progression.js';
import {createGame,deployCard} from './engine.js';import {configureCollection,configureCampaign} from './progression-engine.js';
import {drawApprovedTower} from './tower-render.js';import {towerMuzzle,towerLayout} from './tower-animation.js';
import{readFileSync}from'node:fs';import{EVOLUTION_ART}from'./evolution-art.js';

test('evolution art resolves only supported forms and preserves base fallback',()=>{
 assert.equal(evolutionSpriteKey('bit-bug',1),'bit-bug:1');assert.equal(evolutionSpriteKey('bit-bug',2),'bit-bug:2');
 for(const form of [0,3,-1,1.5,'1'])assert.equal(evolutionSpriteKey('bit-bug',form),'bit-bug');assert.equal(evolutionSpriteKey('data-mouse',1),'data-mouse');
});
test('training displays the owned form without increasing its normalized attack or HP; campaign keeps existing form power',()=>{
 let p=createProgress();p.wallet.gold=1000;p.wallet.cards['bit-bug']=30;p.progression.monsters['bit-bug'].level=6;p=evolveMonster(p,'bit-bug',0);
 const training=configureCollection(createGame(),p);deployCard(training,'bit-bug',70,430);assert.equal(training.units[0].form,1);assert.equal(training.units[0].maxHp,95);assert.equal(training.units[0].damage,22);
 const campaign=configureCampaign(createGame(),p,'stage-1');deployCard(campaign,'bit-bug',70,430);assert.equal(campaign.units[0].form,1);assert.equal(campaign.units[0].maxHp,Math.round(95*1.32));
 p.progression.monsters['bit-bug'].form=2;assert.equal(training.visualForms.player['bit-bug'],1);assert.equal(campaign.progressionSnapshot.monsters['bit-bug'].form,1);
});
test('paladin appearance follows the owned warrior specialization and keeps other towers and branches on base art',()=>{
 let p=createProgress();p.wallet.gold=1000;p.progression.classes.warrior.cards=10;p.wallet.xp=78000;p.progression.career.jobXp.warrior=7600;p=specializeClass(p,'warrior','paladin');
 const g=configureCollection(createGame(),p),core=g.towers.find(t=>t.id==='player-core');assert(isPaladinTower(core));assert(g.towers.filter(t=>t.id!=='player-core').every(t=>!isPaladinTower(t)));
 assert.equal(core.maxHp,2800);assert.equal(core.combatDamage,undefined);
 const c=configureCampaign(createGame(),p,'stage-1').towers.find(t=>t.id==='player-core');assert.equal(c.maxHp,Math.round(2800*1.1));
 assert(!isPaladinTower({...core,classBranch:'gladiator'}));
});
test('paladin atlas has independent directions, all four combat poses and a weapon muzzle at the same displayed pivot',()=>{
 const t={id:'player-core',team:'player',type:'core',classBranch:'paladin',appearance:'female',x:180,y:530,facing:'right'};
 const specs=['front','right','left','back'].flatMap(dir=>[0,1,2,3].map(pose=>paladinFrame(t,pose,dir)));
 assert.equal(new Set(specs.map(f=>`${f.x},${f.y}`)).size,16);assert(specs.every(f=>f.size===140&&f.pivotX===70&&f.pivotY===128&&f.scale>0));
 const f=paladinFrame(t,2,'right'),layout=towerLayout(t);assert.deepEqual(towerMuzzle(t),{x:layout.foot.x+(f.tip[0]-70)*f.scale,y:layout.foot.y+(f.tip[1]-128)*f.scale});
});
test('paladin draw uses the selected sex and atlas pose without mirroring the base character',()=>{
 const tower={id:'player-core',team:'player',type:'core',classBranch:'paladin',appearance:'female',x:180,y:530,facing:'left',lastAttackAt:0};
 const calls=[],ctx={save(){},restore(){},beginPath(){},ellipse(){},fill(){},drawImage(...args){calls.push(args);}};
 const image={id:'paladina'},assets={tower:{id:'tower'},base:{id:'base'},paladins:{female:image,male:{id:'paladino'}}};
 drawApprovedTower(ctx,tower,50,assets);assert.equal(calls.length,2);assert.strictEqual(calls[1][0],image);assert.deepEqual(calls[1].slice(1,5),[280,280,140,140]);
});

test('all shipped evolution atlases match the cells used by the runtime and weapon tips stay inside the frame',()=>{
 for(const spec of [...Object.values(EVOLUTION_ART.unitForms),...Object.values(EVOLUTION_ART.paladin)]){
  const png=readFileSync(new URL('../../public'+spec.file,import.meta.url));
  assert.equal(png.subarray(1,4).toString(),'PNG');assert.equal(png.readUInt32BE(16),spec.tips?560:420);assert.equal(png.readUInt32BE(20),560);
 }
 for(const sex of ['male','female'])for(const dir of ['front','right','left','back']){
  const tip=EVOLUTION_ART.paladin[sex].tips[dir];assert(tip.every(n=>Number.isInteger(n)&&n>=0&&n<140));
  assert.deepEqual(paladinFrame({appearance:sex},2,dir).tip,tip);
 }
});
