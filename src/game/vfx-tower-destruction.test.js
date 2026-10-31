import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  notifyTowerDestroyedVFX,
  tickTowerDestructionVFX,
  drawTowerDestructionVFX,
  resetTowerDestructionVFX,
} from './vfx-tower-destruction.js';

function createMockCtx() {
  return {
    saves: 0,
    restores: 0,
    drawnEllipses: [],
    drawnArcs: [],
    drawnPaths: [],
    alphas: [],
    tx: 0,
    ty: 0,
    save() { this.saves++; },
    restore() { this.restores++; },
    translate(x, y) { this.tx = x; this.ty = y; },
    beginPath() { this._currentPath = []; },
    moveTo(x, y) { this._currentPath.push({ x: x + this.tx, y: y + this.ty }); },
    lineTo(x, y) { this._currentPath.push({ x: x + this.tx, y: y + this.ty }); },
    closePath() { if (this._currentPath) this.drawnPaths.push(this._currentPath); },
    fill() {},
    ellipse(x, y, rx, ry, rotation, startAngle, endAngle) {
      this.drawnEllipses.push({ x: x + this.tx, y: y + this.ty, rx, ry });
    },
    arc(x, y, r, startAngle, endAngle) {
      this.drawnArcs.push({ x: x + this.tx, y: y + this.ty, r });
    },
    set globalAlpha(v) { this.alphas.push(v); },
    get globalAlpha() { return this.alphas[this.alphas.length - 1]; },
    fillStyle: '',
  };
}

test('VFX Tower Destruction - Idempotency and Reset', () => {
  resetTowerDestructionVFX();
  const ctx = createMockCtx();
  const tower = { id: 'test-1', x: 10, y: 20, type: 'guard', team: 'player', hp: 0 };
  const livingTower = { id: 'test-2', x: 30, y: 40, type: 'guard', team: 'enemy', hp: 100 };
  
  // Tick both
  tickTowerDestructionVFX(100, [tower, livingTower]);

  // Living tower draws nothing
  drawTowerDestructionVFX(ctx, livingTower, 0);
  assert.equal(ctx.saves, 0, 'Living tower should not draw wreckage');

  // Dead tower draws
  drawTowerDestructionVFX(ctx, tower, 0);
  assert.equal(ctx.saves, 1);
  assert.equal(ctx.saves, ctx.restores);

  // Reset removes state
  resetTowerDestructionVFX();
  const ctx2 = createMockCtx();
  drawTowerDestructionVFX(ctx2, tower, 0);
  assert.equal(ctx2.saves, 0, 'Reset should remove stale wreckage state');
});

test('VFX Tower Destruction - Timing progression and Context Balance', () => {
  resetTowerDestructionVFX();
  const guard = { id: 'test-timing-1', x: 0, y: 0, type: 'guard', team: 'player', hp: 0 };
  const core = { id: 'test-timing-2', x: 0, y: 0, type: 'core', team: 'player', hp: 0 };
  
  tickTowerDestructionVFX(0, [guard, core]);
  
  const ctx = createMockCtx();
  drawTowerDestructionVFX(ctx, guard, 0); // t=0 animated path
  assert.equal(ctx.alphas[0], 0);
  assert.equal(ctx.saves, ctx.restores);
  
  const ctx2 = createMockCtx();
  drawTowerDestructionVFX(ctx2, core, 250); // mid-animation path
  assert.equal(ctx2.saves, ctx2.restores);

  tickTowerDestructionVFX(1000, [guard]); // Settled path
  const ctx3 = createMockCtx();
  drawTowerDestructionVFX(ctx3, guard, 1000);
  assert.equal(ctx3.alphas[0], 1); 
  assert.equal(ctx3.saves, ctx3.restores);
});

test('VFX Tower Destruction - Reduced Motion identical frames', () => {
  resetTowerDestructionVFX();
  global.window = { matchMedia: (q) => ({ matches: q.includes('reduce') }) };
  
  const tower = { id: 'test-motion', x: 10, y: 20, type: 'guard', team: 'enemy', hp: 0 };
  tickTowerDestructionVFX(0, [tower]);
  
  const ctx1 = createMockCtx();
  drawTowerDestructionVFX(ctx1, tower, 0);
  
  const ctx2 = createMockCtx();
  drawTowerDestructionVFX(ctx2, tower, 10000); // 10s later

  // Should have drawn something
  assert.ok(ctx1.drawnEllipses.length > 0);

  // Assert geometry and alpha sequence are perfectly identical
  assert.deepEqual(ctx1.drawnEllipses, ctx2.drawnEllipses);
  assert.deepEqual(ctx1.drawnArcs, ctx2.drawnArcs);
  assert.deepEqual(ctx1.drawnPaths, ctx2.drawnPaths);
  assert.deepEqual(ctx1.alphas, ctx2.alphas);
  
  // Assert context balance in reduced motion
  assert.equal(ctx1.saves, ctx1.restores);
  
  delete global.window;
});

function calculateBounds(ctx) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const e of ctx.drawnEllipses) {
    minX = Math.min(minX, e.x - e.rx);
    maxX = Math.max(maxX, e.x + e.rx);
    minY = Math.min(minY, e.y - e.ry);
    maxY = Math.max(maxY, e.y + e.ry);
  }
  for (const a of ctx.drawnArcs) {
    minX = Math.min(minX, a.x - a.r);
    maxX = Math.max(maxX, a.x + a.r);
    minY = Math.min(minY, a.y - a.r);
    maxY = Math.max(maxY, a.y + a.r);
  }
  for (const p of ctx.drawnPaths) {
    for (const pt of p) {
      minX = Math.min(minX, pt.x);
      maxX = Math.max(maxX, pt.x);
      minY = Math.min(minY, pt.y);
      maxY = Math.max(maxY, pt.y);
    }
  }
  return {
    width: maxX === -Infinity ? 0 : maxX - minX,
    height: maxY === -Infinity ? 0 : maxY - minY,
  };
}

test('VFX Tower Destruction - Bounds Instrumentation', () => {
  resetTowerDestructionVFX();
  const guard = { id: 'g1', x: 50, y: 50, type: 'guard', team: 'player', hp: 0 };
  const core = { id: 'c1', x: 100, y: 100, type: 'core', team: 'enemy', hp: 0 };
  
  tickTowerDestructionVFX(1000, [guard, core]); // Settled
  
  const ctxGuard = createMockCtx();
  drawTowerDestructionVFX(ctxGuard, guard, 1000);
  const guardBounds = calculateBounds(ctxGuard);
  
  const ctxCore = createMockCtx();
  drawTowerDestructionVFX(ctxCore, core, 1000);
  const coreBounds = calculateBounds(ctxCore);
  
  // Approx 46x24 for guard (rx=23, ry=12 -> 46x24 max footprint)
  assert.ok(guardBounds.width <= 46.5, `Guard width ${guardBounds.width} <= 46.5`);
  assert.ok(guardBounds.height <= 24.5, `Guard height ${guardBounds.height} <= 24.5`);
  assert.ok(ctxGuard.drawnPaths.length >= 6, `Guard draws multiple angular fragments, got ${ctxGuard.drawnPaths.length}`);
  
  // Approx 58x30 for core
  assert.ok(coreBounds.width <= 58.5, `Core width ${coreBounds.width} <= 58.5`);
  assert.ok(coreBounds.height <= 30.5, `Core height ${coreBounds.height} <= 30.5`);
  assert.ok(ctxCore.drawnPaths.length >= 6, `Core draws multiple angular fragments, got ${ctxCore.drawnPaths.length}`);
});

test('VFX Tower Destruction - Transient Sparks Bounds', () => {
  resetTowerDestructionVFX();
  const guard = { id: 'g-sparks', x: 0, y: 0, type: 'guard', team: 'player', hp: 0 };
  
  tickTowerDestructionVFX(200, [guard]); // Mid-animation, has sparks
  const ctx = createMockCtx();
  drawTowerDestructionVFX(ctx, guard, 200);
  
  const bounds = calculateBounds(ctx);
  // Sparks can fly far out. Let's just ensure they exist and bounds are finite
  assert.ok(ctx.drawnArcs.length > 5, 'Should have sparks and embers');
  assert.ok(bounds.width > 0 && bounds.width < 100, 'Transient VFX is bounded');
  assert.ok(bounds.height > 0 && bounds.height < 100, 'Transient VFX is bounded');
});
