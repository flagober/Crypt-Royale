import test from 'node:test';
import assert from 'node:assert/strict';
import { createProgress, advanceProgress, dayKey, weekKey, featuredCard, recordBattle, claimActivity, activityView, battleEligibility } from './activities.js';
const at = day => Date.parse(`${day}T15:00:00Z`);
const monday = at('2026-10-19');
const summary = (id, now = monday, extra = {}) => ({ id, durationMs: 90_000, winner: 'player', automaticUsed: false, towerDamage: 2000, cardsUsed: { [activityView(createProgress(now),now).featured.id]: 1, 'bit-bug': 1, 'data-mouse': 1, 'pixel-pup': 1, 'cache-mantis': 1 }, ...extra });

test('day cutoff is Sao Paulo midnight and week runs Monday through Sunday', () => {
  assert.equal(dayKey(Date.parse('2026-10-20T02:59:59Z')), '2026-10-19');
  assert.equal(dayKey(Date.parse('2026-10-20T03:00:00Z')), '2026-10-20');
  assert.equal(weekKey('2026-10-25'), '2026-10-19');
  assert.equal(weekKey('2026-10-26'), '2026-10-26');
});
test('a manual battle is counted once and grants nothing until an explicit claim', () => {
  let p = recordBattle(createProgress(monday), summary('a'), monday);
  assert.equal(p.daily.battles, 1); assert.equal(p.daily.familyWins, 1); assert.equal(p.daily.towerDamage, 2000);
  assert.equal(p.wallet.gold, 0); assert.equal(p.receipts.length, 0);
  assert.deepEqual(recordBattle(p, summary('a'), monday), p);
  p = claimActivity(p, 'first-win', null, monday);
  assert.equal(p.wallet.gold, 75); assert.equal(Object.values(p.wallet.cards).reduce((s, n) => s + n, 0), 1);
  assert.throws(() => claimActivity(p, 'first-win', null, monday), /já/);
});
test('unfinished, inactive, too short and automated matches cannot feed quests or first win', () => {
  for (const overrides of [{ winner: null }, { cardsUsed: {} }, { durationMs: 1000 }, { automaticUsed: true }]) {
    const b = summary('test', monday, overrides); assert.ok(battleEligibility(b));
    const p = recordBattle(createProgress(monday), b, monday);
    assert.equal(p.daily.battles, 0); assert.equal(p.weekly.wins, 0);
    assert.throws(() => claimActivity(p, 'first-win', null, monday), /Conclua/);
  }
});
test('defeat progresses participation and damage, but not victory or family win', () => {
  const p = recordBattle(createProgress(monday), summary('loss', monday, { winner: 'enemy' }), monday);
  assert.equal(p.daily.battles, 1); assert.equal(p.daily.wins, 0); assert.equal(p.daily.familyWins, 0);
  assert.equal(p.daily.towerDamage, 2000);
});
test('check-in is once daily, preserves cycle across gaps and never credits MCT', () => {
  let p = claimActivity(createProgress(monday), 'checkin', null, monday);
  assert.throws(() => claimActivity(p, 'checkin', null, monday), /já/);
  p = claimActivity(p, 'checkin', null, at('2026-10-21'));
  assert.equal(p.checkin.cursor, 2); assert.equal(p.checkin.consecutive, 1); assert.equal(p.wallet.gold, 70);
  for (let i = 22; i <= 26; i++) p = claimActivity(p, 'checkin', null, at(`2026-10-${i}`));
  assert.equal(p.checkin.cursor, 0); assert.equal(p.checkin.cycle, 1);
  assert.equal(p.receipts.length, 7); assert.equal(Object.hasOwn(p.wallet, 'mct'), false);
  p = claimActivity(p, 'checkin', null, at('2026-10-27'));
  assert.equal(p.checkin.cursor, 1); assert.equal(p.checkin.consecutive, 7);
});
test('daily rotation preserves wallet and processed match receipts and rejects clock rollback', () => {
  let p = recordBattle(createProgress(monday), summary('finished'), monday);
  p = claimActivity(p, 'first-win', null, monday);
  const next = advanceProgress(p, at('2026-10-20'));
  assert.equal(next.daily.battles, 0); assert.deepEqual(next.wallet, p.wallet);
  assert.equal(recordBattle(next, summary('finished'), at('2026-10-20')).daily.battles, 0);
  assert.throws(() => claimActivity(next, 'checkin', null, monday), /relógio/);
});
test('nine claimed daily missions unlock one weekly cache; event is independent and once per week', () => {
  let p = createProgress(monday);
  assert.throws(() => claimActivity(p, 'weekly', null, monday), /Conclua/);
  for (let d = 19; d <= 21; d++) {
    const now = at(`2026-10-${d}`);
    for (let i = 0; i < 3; i++) p = recordBattle(p, summary(`${d}-${i}`, now), now);
    for (const m of activityView(p, now).missions) p = claimActivity(p, 'daily', m.id, now);
  }
  const now = at('2026-10-21'); assert.equal(p.weekly.missionsClaimed, 9);
  p = claimActivity(p, 'weekly', null, now); p = claimActivity(p, 'event', null, now);
  assert.equal(p.weekly.claimed.weekly, true); assert.equal(p.weekly.claimed.event, true);
  assert.throws(() => claimActivity(p, 'weekly', null, now), /já/);
  assert.throws(() => claimActivity(p, 'event', null, now), /já/);
  const next = advanceProgress(p, at('2026-10-26'));
  assert.equal(next.weekly.missionsClaimed, 0); assert.deepEqual(next.wallet, p.wallet);
  assert.throws(() => claimActivity(next, 'event', null, at('2026-10-26')), /Conclua/);
});
test('first-victory claim does not count as one of the three daily quests', () => {
  let p = recordBattle(createProgress(monday), summary('first'), monday);
  p = claimActivity(p, 'first-win', null, monday);
  assert.equal(p.weekly.missionsClaimed, 0);
});
