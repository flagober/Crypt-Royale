import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MATCHMAKING_MODES,
  MATCHMAKING_INFO,
  ARENA_RIVALS,
  findMatchmakingRival,
  buildRivalProfile
} from './matchmaking.js';

test('matchmaking modes are properly configured and frozen', () => {
  assert.equal(MATCHMAKING_MODES.FREE, 'free');
  assert.equal(MATCHMAKING_MODES.BALANCED, 'balanced');
  assert.equal(MATCHMAKING_INFO.free.hasConfirmation, false);
  assert.equal(MATCHMAKING_INFO.balanced.hasConfirmation, true);
  assert.ok(ARENA_RIVALS.length >= 10);
});

test('Modo Livre picks rivals of any level without confirmation required', () => {
  const resultLow = findMatchmakingRival(MATCHMAKING_MODES.FREE, 1, { random: () => 0.99 });
  assert.equal(resultLow.mode, 'free');
  assert.equal(resultLow.requiresConfirmation, false);
  assert.ok(resultLow.rival.level >= 18);

  const resultHigh = findMatchmakingRival(MATCHMAKING_MODES.FREE, 20, { random: () => 0 });
  assert.equal(resultHigh.mode, 'free');
  assert.equal(resultHigh.requiresConfirmation, false);
  assert.equal(resultHigh.rival.level, 1);
});

test('Modo Equilíbrio finds closest levels and requires confirmation when rival is higher level', () => {
  // Player level 7, deterministic pick higher level (e.g. level 8)
  const resultHigher = findMatchmakingRival(MATCHMAKING_MODES.BALANCED, 7, {
    random: () => 0.5 // Should pick one of closest
  });
  assert.equal(resultHigher.mode, 'balanced');
  assert.ok(Math.abs(resultHigher.levelDiff) <= 3);

  if (resultHigher.levelDiff > 0) {
    assert.equal(resultHigher.requiresConfirmation, true);
  } else {
    assert.equal(resultHigher.requiresConfirmation, false);
  }
});

test('Modo Equilíbrio does NOT require confirmation if rival level <= player level', () => {
  // If player is level 20, any closest rival will be <= level 20
  const result = findMatchmakingRival(MATCHMAKING_MODES.BALANCED, 20, { random: () => 0 });
  assert.equal(result.mode, 'balanced');
  assert.ok(result.levelDiff <= 0);
  assert.equal(result.requiresConfirmation, false);
});

test('buildRivalProfile creates a valid progression-compliant profile', () => {
  const rival = ARENA_RIVALS[0];
  const profile = buildRivalProfile(rival);
  assert.equal(profile.name, rival.name);
  assert.ok(profile.wallet.xp > 0);
  assert.ok(Object.keys(profile.progression.monsters).length >= 4);
});

