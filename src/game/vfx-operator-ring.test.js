/**
 * vfx-operator-ring.test.js
 * Unit tests for the holographic ring VFX module.
 *
 * Runs via: node --test "src/**\/*.test.js"
 *
 * These tests are deliberately isolated from the browser environment.
 * The module's dynamic prefersReducedMotion() check is controlled
 * through the global.window mock defined in each relevant test.
 */

import { describe, it, before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';

import {
  drawOperatorRing,
  notifyTowerHit,
  notifyTowerDestroyed,
  resetOperatorRingVFX,
  tickRingVFX,
} from './vfx-operator-ring.js';

// ─── Canvas mock ─────────────────────────────────────────────────────────────

/**
 * Minimal CanvasRenderingContext2D mock.
 * Tracks save/restore depth and records which draw methods were called.
 */
function makeCtx() {
  let depth = 0;
  const calls = [];

  return {
    // Properties (set by drawOperatorRing)
    globalAlpha: 1,
    strokeStyle: '',
    lineWidth:   1,
    lineCap:     'butt',

    // Tracked methods
    save()            { depth++;        calls.push('save');      },
    restore()         { depth--;        calls.push('restore');   },
    translate()       {                 calls.push('translate'); },
    scale()           {                 calls.push('scale');     },
    beginPath()       {                 calls.push('beginPath'); },
    ellipse()         {                 calls.push('ellipse');   },
    stroke()          {                 calls.push('stroke');    },

    // Test helpers
    get saveDepth()   { return depth; },
    get callLog()     { return calls; },
    wasCalled(name)   { return calls.includes(name); },
  };
}

// ─── Tower factories ──────────────────────────────────────────────────────────

const makeCore = (overrides = {}) => ({
  id:    'player-core',
  team:  'player',
  type:  'core',
  x:     180,
  y:     502,
  hp:    2800,
  maxHp: 2800,
  shield: 500,
  ...overrides,
});

const makeGuard = (overrides = {}) => ({
  id:    'player-left',
  team:  'player',
  type:  'guard',
  x:     88,
  y:     468,
  hp:    1800,
  maxHp: 1800,
  ...overrides,
});

function primeBastion(tower) {
  tickRingVFX(220, [tower]);
}

// ─── Window mock helpers ──────────────────────────────────────────────────────

function mockWindow(reducedMotion = false) {
  global.window = {
    matchMedia: (query) => ({
      matches: reducedMotion && query === '(prefers-reduced-motion: reduce)',
    }),
  };
}

function removeWindow() {
  delete global.window;
}

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('vfx-operator-ring', () => {

  beforeEach(() => {
    resetOperatorRingVFX();
    mockWindow(false);   // default: no reduced motion
  });

  after(() => {
    removeWindow();
  });

  // 1. Guard towers must not draw ─────────────────────────────────────────────
  it('guard tower does not draw ring', () => {
    const ctx   = makeCtx();
    const tower = makeGuard();
    drawOperatorRing(ctx, tower, 0);
    assert.ok(!ctx.wasCalled('ellipse'), 'ellipse should not be called for a guard tower');
  });

  // 2. Player core draws ──────────────────────────────────────────────────────
  it('player core tower draws ring', () => {
    const ctx   = makeCtx();
    const tower = makeCore({ team: 'player' });
    primeBastion(tower);
    drawOperatorRing(ctx, tower, 0);
    assert.ok(ctx.wasCalled('ellipse'), 'ellipse should be called for player core');
  });

  // 3. Enemy core draws ───────────────────────────────────────────────────────
  it('enemy core tower draws ring', () => {
    const ctx   = makeCtx();
    const tower = makeCore({ id: 'enemy-core', team: 'enemy' });
    primeBastion(tower);
    drawOperatorRing(ctx, tower, 0);
    assert.ok(ctx.wasCalled('ellipse'), 'ellipse should be called for enemy core');
  });

  // 4. ctx.save / restore are balanced ────────────────────────────────────────
  it('ctx.save and ctx.restore are balanced', () => {
    const ctx   = makeCtx();
    const tower = makeCore();
    drawOperatorRing(ctx, tower, 0);
    assert.equal(ctx.saveDepth, 0, 'save/restore must be balanced');
  });

  // 5. save/restore balanced for guard tower too ──────────────────────────────
  it('ctx.save and ctx.restore are balanced when skipping guard tower', () => {
    const ctx   = makeCtx();
    const tower = makeGuard();
    drawOperatorRing(ctx, tower, 0);
    assert.equal(ctx.saveDepth, 0, 'save/restore must be balanced for guard tower');
  });

  // 6. notifyTowerHit starts flash timer ──────────────────────────────────────
  it('notifyTowerHit starts the attack-flash timer', () => {
    notifyTowerHit('player-core');

    const ctx   = makeCtx();
    const tower = makeCore();
    primeBastion(tower);

    // Draw at nowMs=0 — flash should still be active
    drawOperatorRing(ctx, tower, 0);
    assert.ok(ctx.wasCalled('ellipse'), 'ring should be drawn while flash is active');
  });

  // 7. tickRingVFX drains the flash timer ─────────────────────────────────────
  it('tickRingVFX reduces the attack-flash timer', () => {
    const tower = makeCore();
    notifyTowerHit('player-core');

    // Drain 160 ms (half of attackFlashMs=320)
    tickRingVFX(160, [tower]);

    const ctx = makeCtx();
    drawOperatorRing(ctx, tower, 160);
    // Ring should still draw — timer has not expired yet
    assert.ok(ctx.wasCalled('ellipse'));

    // Drain remaining 160 ms + 1 ms to fully expire
    tickRingVFX(161, [tower]);

    const ctx2 = makeCtx();
    drawOperatorRing(ctx2, tower, 321);
    // Ring still draws after flash expires (it's only an opacity change)
    assert.ok(ctx2.wasCalled('ellipse'));
  });

  // 8. notifyTowerDestroyed starts collapse ───────────────────────────────────
  it('notifyTowerDestroyed starts the collapse animation', () => {
    const ctx   = makeCtx();
    const tower = makeCore();
    primeBastion(tower);
    notifyTowerDestroyed('player-core');

    // At t=0 the collapse has just started — ring should still be visible
    drawOperatorRing(ctx, tower, 0);
    assert.ok(ctx.wasCalled('ellipse'), 'ring should render while collapsing');
  });

  // 9. Tower reaches collapsed state after full collapseMs ────────────────────
  it('tower reaches collapsed state after full collapseMs elapses', () => {
    const tower = makeCore();
    primeBastion(tower);
    notifyTowerDestroyed('player-core');

    // Drain more than collapseMs (600 ms)
    tickRingVFX(601, [tower]);

    const ctx = makeCtx();
    drawOperatorRing(ctx, tower, 601);
    assert.ok(!ctx.wasCalled('ellipse'), 'collapsed tower must not draw ring');
  });

  // 10. resetOperatorRingVFX clears destroyed tower state ─────────────────────
  it('resetOperatorRingVFX clears collapsed state so ring draws again', () => {
    const tower = makeCore();
    primeBastion(tower);

    // Step 1 & 2: destroy and complete collapse
    notifyTowerDestroyed('player-core');
    tickRingVFX(601, [tower]);

    // Step 3: confirm ring is not drawn
    const ctxBefore = makeCtx();
    drawOperatorRing(ctxBefore, tower, 601);
    assert.ok(!ctxBefore.wasCalled('ellipse'), 'pre-reset: ring must not draw');

    // Step 4: reset
    resetOperatorRingVFX();

    // Step 5 & 6: same ID, full HP — ring must reappear
    const freshTower = makeCore({ hp: 2800 });   // same id 'player-core'
    primeBastion(freshTower);
    const ctxAfter = makeCtx();
    drawOperatorRing(ctxAfter, freshTower, 602);
    assert.ok(ctxAfter.wasCalled('ellipse'), 'post-reset: ring must draw again');
  });

  // 11. Reduced motion: no rotation — translate called, scale not called ───────
  it('reduced motion suppresses scale (no collapse scale transform)', () => {
    mockWindow(true);

    const ctx   = makeCtx();
    const tower = makeCore();
    drawOperatorRing(ctx, tower, 0);

    assert.ok(ctx.wasCalled('translate'),  'translate is always called');
    assert.ok(!ctx.wasCalled('scale'),     'scale must NOT be called under reduced motion');
  });

  // 12. Reduced motion: ring is still drawn (visible, static) ─────────────────
  it('reduced motion still draws ellipses (static ring visible)', () => {
    mockWindow(true);

    const ctx   = makeCtx();
    const tower = makeCore();
    drawOperatorRing(ctx, tower, 0);
    assert.ok(ctx.wasCalled('ellipse'), 'ring must be visible under reduced motion');
  });

  // 13. Reduced motion: destroyed tower collapses instantly ────────────────────
  it('reduced motion collapses tower instantly without animation', () => {
    mockWindow(true);

    const tower = makeCore();
    notifyTowerDestroyed('player-core');

    // Without ticking at all, the tower should already be collapsed
    const ctx = makeCtx();
    drawOperatorRing(ctx, tower, 0);
    assert.ok(!ctx.wasCalled('ellipse'), 'reduced motion: ring must disappear immediately on destroy');
  });

  // 14. Bastion active draws additional ellipses ───────────────────────────────
  it('bastion active draws extra ellipses for the yellow rim', () => {
    const ctx   = makeCtx();
    const tower = makeCore();

    const ellipsesBefore = makeCtx();
    drawOperatorRing(ellipsesBefore, tower, 0, false);

    primeBastion(tower);
    const ellipsesAfter = makeCtx();
    drawOperatorRing(ellipsesAfter, tower, 0, true);

    const countBefore = ellipsesBefore.callLog.filter(c => c === 'ellipse').length;
    const countAfter  = ellipsesAfter.callLog.filter(c => c === 'ellipse').length;
    assert.ok(countAfter > countBefore, 'bastion active must add extra ellipse calls');
  });

  // 15. Inactive Bastion must leave the arena visually clean ─────────────────
  it('does not draw any ring while Bastion is inactive', () => {
    const ctx = makeCtx();
    const tower = makeCore({ shield: 0 });
    tickRingVFX(1000, [tower]);
    drawOperatorRing(ctx, tower, 0, false);
    assert.ok(!ctx.wasCalled('ellipse'), 'unshielded core must not draw the Operator ring');
  });

  // 16. Losing the shield dissolves the ring instead of popping instantly ────
  it('fades the ring out for 250 ms after Bastion ends', () => {
    const tower = makeCore({ shield: 500 });
    primeBastion(tower);

    tower.shield = 0;
    tickRingVFX(125, [tower]);
    const halfway = makeCtx();
    drawOperatorRing(halfway, tower, 125, false);
    assert.ok(halfway.wasCalled('ellipse'), 'ring should remain during fade-out');

    tickRingVFX(125, [tower]);
    const ended = makeCtx();
    drawOperatorRing(ended, tower, 250, false);
    assert.ok(!ended.wasCalled('ellipse'), 'ring should disappear after fade-out');
  });

});
