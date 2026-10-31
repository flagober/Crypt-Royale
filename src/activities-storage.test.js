import test from 'node:test';
import assert from 'node:assert/strict';
import { loadProgress, updateProgress, PROGRESS_KEY } from './activities-storage.js';
import { claimActivity } from './game/activities.js';
import {upgradeMonster,createProgression} from './game/progression.js';
const now = Date.parse('2026-10-19T15:00:00Z');
function memory() { const data = new Map(); return { data, getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }; }

test('legacy profile migration adds progression on first action, backs up old data and keeps earned resources',()=>{
 const s=memory();updateProgress(s,p=>{p.wallet.gold=375;p.wallet.xp=110;p.wallet.dataFragments=1;p.wallet.cards={'bit-bug':2};return p;},now);
 const old=s.getItem(PROGRESS_KEY);updateProgress(s,p=>upgradeMonster(p,'bit-bug',1),now);
 const p=loadProgress(s,now);assert.equal(p.wallet.gold,350);assert.equal(p.wallet.xp,110);assert.equal(p.wallet.dataFragments,1);assert.equal(p.progression.monsters['bit-bug'].level,2);assert.equal(s.getItem(PROGRESS_KEY+'.backup'),old);
 assert.throws(()=>updateProgress(s,p=>upgradeMonster(p,'bit-bug',1),now),/já mudou/);assert.equal(loadProgress(s,now).wallet.gold,350);
});
test('invalid progression and failed upgrade writes preserve the original inventory',()=>{
 const s=memory();updateProgress(s,p=>{p.progression=createProgression();p.wallet.gold=100;p.wallet.cards={'bit-bug':2};return p;},now);const old=s.getItem(PROGRESS_KEY),set=s.setItem;
 s.setItem=(key,value)=>{if(key===PROGRESS_KEY)throw Error('quota');set(key,value);};
 assert.throws(()=>updateProgress(s,p=>upgradeMonster(p,'bit-bug',1),now),/quota/);assert.equal(s.getItem(PROGRESS_KEY),old);
 s.setItem=set;const broken=JSON.parse(old);broken.progression.monsters['bit-bug'].level=999;s.setItem(PROGRESS_KEY,JSON.stringify(broken));const corrupt=s.getItem(PROGRESS_KEY);assert.throws(()=>loadProgress(s,now),/preservada/);assert.equal(s.getItem(PROGRESS_KEY),corrupt);
});
test('reloading preserves claim; second tab reads committed state before claiming', () => {
  const s = memory(); updateProgress(s, p => claimActivity(p, 'checkin', null, now), now);
  assert.equal(loadProgress(s, now).wallet.gold, 30);
  assert.throws(() => updateProgress(s, p => claimActivity(p, 'checkin', null, now), now), /já/);
  assert.equal(loadProgress(s, now).wallet.gold, 30);
});
test('bad data is retained without replacing it by a blank profile', () => {
  const s = memory(); s.setItem(PROGRESS_KEY, 'broken');
  assert.throws(() => loadProgress(s, now), /preservada/);
  assert.throws(() => updateProgress(s, p => p, now), /preservada/);
  assert.equal(s.getItem(PROGRESS_KEY), 'broken');
});
test('failed storage write preserves current progress and previous backup', () => {
  const s = memory(); updateProgress(s, p => claimActivity(p, 'checkin', null, now), now);
  const old = s.getItem(PROGRESS_KEY), next = now + 86400000;
  const set = s.setItem; s.setItem = (key, value) => { if (key === PROGRESS_KEY) throw Error('quota'); set(key, value); };
  assert.throws(() => updateProgress(s, p => claimActivity(p, 'checkin', null, next), next), /quota/);
  assert.equal(s.getItem(PROGRESS_KEY), old); assert.equal(s.getItem(PROGRESS_KEY + '.backup'), old);
});
