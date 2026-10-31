import test from 'node:test';
import assert from 'node:assert/strict';
import { loadProgress, updateProgress, PROGRESS_KEY } from './activities-storage.js';
import { claimActivity } from './game/activities.js';
const now = Date.parse('2026-10-19T15:00:00Z');
function memory() { const data = new Map(); return { data, getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }; }
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
