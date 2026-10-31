#!/usr/bin/env node
// scripts/verify-spell-effects.mjs
// Headless validation for spell-effects v002.
// Simulates a minimal Canvas 2D context to verify:
//   1. All 16 spells have dedicated renderers
//   2. save()/restore() calls are balanced
//   3. Animations terminate (t >= 1 produces no draw calls)
//   4. No mutation of input parameters
//   5. Finite coordinates (no NaN/Infinity)
//   6. Reduced-motion path works
//   7. Deterministic particle count (no Math.random)
//
// Run: node scripts/verify-spell-effects.mjs

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// ── Load catalog ──────────────────────────────────────────────────
const catalogPath = join(rootDir, 'public', 'spell-catalog.json');
const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));

// ── Load spell-effects source and parse ───────────────────────────
const effectsSrc = await readFile(join(rootDir, 'public', 'spell-effects.js'), 'utf8');

// Quick static checks
const errors = [];
const warnings = [];
let passed = 0;

// Check 7: No Math.random in source
if (/Math\s*\.\s*random\s*\(/g.test(effectsSrc)) {
  errors.push('FAIL: Math.random found in spell-effects.js — particles must be deterministic');
} else {
  passed++;
  console.log('✓ No Math.random — deterministic particles');
}

// Check that all 16 spell IDs have renderers
const catalogIds = catalog.map(s => s.id).sort();
const rendererMatches = [...effectsSrc.matchAll(/'([a-z]+-[a-z]+)'\s*\(/g)].map(m => m[1]).sort();

for (const id of catalogIds) {
  if (rendererMatches.includes(id)) {
    passed++;
  } else {
    errors.push(`FAIL: Spell "${id}" has no dedicated renderer in SPELL_RENDERERS`);
  }
}
console.log(`✓ ${catalogIds.length} spell IDs checked against renderers (${rendererMatches.length} found)`);

// ── Mock Canvas 2D context ────────────────────────────────────────
function createMockCtx() {
  let saveCount = 0;
  let restoreCount = 0;
  const allCoords = [];
  let drawCallCount = 0;

  const handler = {
    get(target, prop) {
      if (prop === '_saveCount') return saveCount;
      if (prop === '_restoreCount') return restoreCount;
      if (prop === '_allCoords') return allCoords;
      if (prop === '_drawCallCount') return drawCallCount;

      if (prop === 'save') return () => { saveCount++; };
      if (prop === 'restore') return () => { restoreCount++; };

      // Track coordinate-bearing calls
      const coordMethods = [
        'moveTo', 'lineTo', 'arc', 'ellipse', 'fillRect', 'strokeRect', 'fillText',
        'arcTo', 'bezierCurveTo', 'quadraticCurveTo', 'rect'
      ];
      if (coordMethods.includes(prop)) {
        return (...args) => {
          drawCallCount++;
          for (const a of args) {
            if (typeof a === 'number') allCoords.push(a);
          }
        };
      }

      // Drawing trigger calls
      if (['fill', 'stroke', 'closePath', 'beginPath', 'setLineDash'].includes(prop)) {
        return (..._args) => { drawCallCount++; };
      }

      // Property sets (strokeStyle, fillStyle, etc.)
      if (prop === 'translate' || prop === 'rotate') {
        return (...args) => {
          for (const a of args) {
            if (typeof a === 'number') allCoords.push(a);
          }
        };
      }

      // Settable properties — just accept
      return undefined;
    },
    set(_target, _prop, _value) { return true; }
  };

  return new Proxy({}, handler);
}

// ── Dynamic import of spell-effects (ESM) ─────────────────────────
// We use a dynamic import with a file URL
const effectsModule = await import(`file://${join(rootDir, 'public', 'spell-effects.js').replace(/\\/g, '/')}`);
const { drawSpell, SPELL_RENDERERS } = effectsModule;

if (!drawSpell) {
  errors.push('FAIL: drawSpell not exported from spell-effects.js');
} else {
  passed++;
  console.log('✓ drawSpell exported');
}

if (!SPELL_RENDERERS) {
  errors.push('FAIL: SPELL_RENDERERS not exported from spell-effects.js');
} else {
  passed++;
  console.log('✓ SPELL_RENDERERS exported');
}

// ── Per-spell tests ───────────────────────────────────────────────
const testTimepoints = [0, 100, 300, 600, 900, 1100, 1200, 1500];

for (const spell of catalog) {
  const spellErrors = [];

  // Test 1: save/restore balance
  const ctx1 = createMockCtx();
  drawSpell(ctx1, spell, 500, { x: 200, y: 100, reducedMotion: false });
  if (ctx1._saveCount !== ctx1._restoreCount) {
    spellErrors.push(`save(${ctx1._saveCount}) !== restore(${ctx1._restoreCount})`);
  }

  // Test 2: Finite coordinates across all timepoints
  for (const tp of testTimepoints) {
    const ctx2 = createMockCtx();
    drawSpell(ctx2, spell, tp, { x: 200, y: 100, reducedMotion: false });
    const badCoords = ctx2._allCoords.filter(c => !isFinite(c));
    if (badCoords.length > 0) {
      spellErrors.push(`Non-finite coords at t=${tp}ms: ${badCoords.join(', ')}`);
    }
  }

  // Test 3: Animation terminates (no draw calls after duration)
  const ctx3 = createMockCtx();
  drawSpell(ctx3, spell, 2000, { x: 200, y: 100, reducedMotion: false });
  // After expiry, only save+restore should occur (0 or minimal draw calls)
  // The function should return early after t>=1, so drawCallCount should be 0
  if (ctx3._drawCallCount > 0) {
    spellErrors.push(`${ctx3._drawCallCount} draw calls after expiry (t=2000ms)`);
  }

  // Test 4: No mutation of input params
  const inputEffect = { ...spell };
  const inputOpts = { x: 200, y: 100, casterX: 70, casterY: 100, allyX: 140, allyY: 100, reducedMotion: false };
  const optsCopy = { ...inputOpts };
  const effectCopy = { ...inputEffect };
  const ctx4 = createMockCtx();
  drawSpell(ctx4, inputEffect, 500, inputOpts);

  for (const key of Object.keys(optsCopy)) {
    if (inputOpts[key] !== optsCopy[key]) {
      spellErrors.push(`opts.${key} mutated: ${optsCopy[key]} → ${inputOpts[key]}`);
    }
  }
  for (const key of Object.keys(effectCopy)) {
    if (inputEffect[key] !== effectCopy[key]) {
      spellErrors.push(`effect.${key} mutated: ${effectCopy[key]} → ${inputEffect[key]}`);
    }
  }

  // Test 5: Reduced motion path works
  const ctx5 = createMockCtx();
  drawSpell(ctx5, spell, 500, { x: 200, y: 100, reducedMotion: true });
  if (ctx5._saveCount !== ctx5._restoreCount) {
    spellErrors.push(`reducedMotion: save(${ctx5._saveCount}) !== restore(${ctx5._restoreCount})`);
  }

  // Test 6: Default params (no opts) don't crash
  try {
    const ctx6 = createMockCtx();
    drawSpell(ctx6, spell, 500);
  } catch (e) {
    spellErrors.push(`Crash with default opts: ${e.message}`);
  }

  // Report
  if (spellErrors.length === 0) {
    passed++;
    console.log(`  ✓ ${spell.id} (${spell.name}): all checks passed`);
  } else {
    for (const e of spellErrors) {
      errors.push(`${spell.id}: ${e}`);
      console.log(`  ✗ ${spell.id}: ${e}`);
    }
  }
}

// ── Summary ───────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(60));
console.log(`Results: ${passed} passed, ${errors.length} errors, ${warnings.length} warnings`);

if (errors.length > 0) {
  console.log('\nErrors:');
  for (const e of errors) console.log(`  ✗ ${e}`);
}
if (warnings.length > 0) {
  console.log('\nWarnings:');
  for (const w of warnings) console.log(`  ⚠ ${w}`);
}

console.log(`\nSpells in catalog: ${catalog.length}`);
console.log(`Renderers found: ${rendererMatches.length}`);
console.log(`Missing renderers: ${catalogIds.filter(id => !rendererMatches.includes(id)).join(', ') || 'none'}`);

process.exit(errors.length > 0 ? 1 : 0);
