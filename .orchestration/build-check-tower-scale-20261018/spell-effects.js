// spell-effects.js — active version (v002)
// Visual candidates only — drawing never applies damage, healing, movement or
// any mutation to game entities. Every draw call is save/restore balanced.
// Particle budgets are deterministic (no Math.random inside draw loops).
// All 16 spells have unique geometry and phasing (prep → effect → impact).
// mechanicsActive flags remain false; this file is preview-only.

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} effect — { id, kind, color, ... } from spell-catalog.json
 * @param {number} elapsedMs — milliseconds since spell start (0-based)
 * @param {object} opts
 * @param {number}  opts.x       — target / impact centre X  (default 220)
 * @param {number}  opts.y       — target / impact centre Y  (default 120)
 * @param {number}  opts.casterX — caster centre X            (default 70)
 * @param {number}  opts.casterY — caster centre Y            (default y)
 * @param {number}  opts.allyX   — nearest-ally X (for heal)  (default x-60)
 * @param {number}  opts.allyY   — nearest-ally Y (for heal)  (default y)
 * @param {boolean} opts.reducedMotion — accessibility fallback
 */
export function drawSpell(ctx, effect, elapsedMs, {
  x = 220, y = 120,
  casterX = 70, casterY,
  allyX, allyY,
  reducedMotion = false
} = {}) {
  if (casterY === undefined) casterY = y;
  if (allyX === undefined) allyX = x - 60;
  if (allyY === undefined) allyY = y;

  const DURATION = 1200; // ms — slightly longer than v001 for phasing
  const t = Math.max(0, Math.min(1, elapsedMs / DURATION));
  if (t >= 1) return;

  ctx.save();

  // ── Accessibility fallback ─────────────────────────────────────────
  if (reducedMotion) {
    ctx.strokeStyle = effect.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = (1 - t) * 0.85;
    ctx.strokeRect(x - 14, y - 14, 28, 28);
    ctx.restore();
    return;
  }

  // ── Dispatch to per-spell renderer ─────────────────────────────────
  const fn = SPELL_RENDERERS[effect.id];
  if (fn) {
    fn(ctx, t, effect.color, { x, y, casterX, casterY, allyX, allyY });
  } else {
    // Fallback: generic expanding ring (should never appear in v002 catalog)
    ctx.strokeStyle = effect.color;
    ctx.globalAlpha = (1 - t) * 0.7;
    ctx.lineWidth = 2;
    const r = 10 + t * 40;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════════════
// Helper micro-functions (no allocations, no randomness)
// ═══════════════════════════════════════════════════════════════════════

/** Ease-in-out quadratic */
function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
/** Ease-out cubic */
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
/** Ease-in */
function easeIn(t) { return t * t * t; }
/** Phase helper: returns 0-1 within [start, end], clamped */
function phase(t, start, end) { return Math.max(0, Math.min(1, (t - start) / (end - start))); }
/** Hex → RGBA string */
function rgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

// ═══════════════════════════════════════════════════════════════════════
// Per-spell renderers  (16 unique effects)
// ═══════════════════════════════════════════════════════════════════════

const SPELL_RENDERERS = {

  // ─── 1. Bit Bug — Enxame Binário ─────────────────────────────────
  // Three small bugs spiral inward toward the target, leaving square
  // bit-trails; on convergence a cyan pulse emanates.
  'bit-bug'(ctx, t, color, { x, y }) {
    const prep = phase(t, 0, 0.4);
    const strike = phase(t, 0.4, 0.7);
    const fade = phase(t, 0.7, 1);

    // Three converging bugs
    for (let i = 0; i < 3; i++) {
      const baseAngle = (i * Math.PI * 2 / 3) + prep * Math.PI;
      const dist = 50 * (1 - easeInOut(prep)) + 6;
      const bx = x + Math.cos(baseAngle) * dist;
      const by = y + Math.sin(baseAngle) * dist;

      // Bit trail (4 squares fading behind)
      ctx.fillStyle = rgba(color, 0.15 * (1 - fade));
      for (let j = 1; j <= 4; j++) {
        const td = j * 0.06;
        const trailAngle = baseAngle - td * Math.PI * 2;
        const trailDist = dist + j * 8;
        ctx.fillRect(
          x + Math.cos(trailAngle) * trailDist - 2,
          y + Math.sin(trailAngle) * trailDist - 2, 4, 4
        );
      }

      // Bug body
      ctx.fillStyle = rgba(color, 0.9 * (1 - fade));
      ctx.fillRect(bx - 3, by - 3, 6, 6);
      // Eyes
      ctx.fillStyle = '#fff';
      ctx.fillRect(bx - 1, by - 2, 2, 2);
    }

    // Convergence pulse
    if (strike > 0) {
      ctx.strokeStyle = rgba(color, 0.6 * (1 - fade));
      ctx.lineWidth = 2;
      const pr = easeOut(strike) * 30;
      ctx.beginPath();
      ctx.arc(x, y, pr, 0, Math.PI * 2);
      ctx.stroke();
    }
  },

  // ─── 2. Data Mouse — Checksum ────────────────────────────────────
  // Three sequential data packets fly from caster to target; each
  // subsequent one brightens. Third packet triggers a checksum "✓" flash.
  'data-mouse'(ctx, t, color, { x, y, casterX, casterY }) {
    const dx = x - casterX;
    const dy = y - casterY;

    for (let i = 0; i < 3; i++) {
      const shotStart = i * 0.2;
      const shotEnd = shotStart + 0.4;
      const st = phase(t, shotStart, shotEnd);
      if (st <= 0 || st >= 1) continue;

      const progress = easeOut(st);
      const px = casterX + dx * progress;
      const py = casterY + dy * progress;
      const brightness = 0.4 + i * 0.25;

      // Packet body
      ctx.fillStyle = rgba(color, brightness);
      ctx.fillRect(px - 4, py - 3, 8, 6);
      // Binary decoration
      ctx.fillStyle = rgba('#000000', 0.5);
      ctx.fillRect(px - 2, py - 1, 2, 2);
      ctx.fillRect(px + 1, py - 1, 2, 2);

      // Tail
      ctx.strokeStyle = rgba(color, brightness * 0.4);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px - 4, py);
      ctx.lineTo(px - 4 - 12 * progress, py);
      ctx.stroke();
    }

    // Third-shot checksum flash
    const checkPhase = phase(t, 0.6, 0.85);
    if (checkPhase > 0) {
      ctx.strokeStyle = rgba(color, (1 - checkPhase) * 0.9);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - 6, y);
      ctx.lineTo(x - 2, y + 6);
      ctx.lineTo(x + 8, y - 8);
      ctx.stroke();
    }
  },

  // ─── 3. Code Slime — Fragmentação ────────────────────────────────
  // Slime splats on the ground leaving a glowing puddle with code
  // fragments; slow-field visual persists then fades.
  'code-slime'(ctx, t, color, { x, y }) {
    const drop = phase(t, 0, 0.25);
    const spread = phase(t, 0.2, 0.5);
    const linger = phase(t, 0.5, 1);

    // Dropping mass
    if (drop < 1) {
      const dropY = y - 40 + easeIn(drop) * 40;
      ctx.fillStyle = rgba(color, 0.8);
      ctx.beginPath();
      ctx.ellipse(x, dropY, 8, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ground puddle (elliptical, perspective)
    const puddleW = easeOut(spread) * 45;
    const puddleH = puddleW * 0.3;
    const puddleAlpha = spread > 0 ? (1 - linger * 0.8) * 0.5 : 0;
    if (puddleAlpha > 0) {
      ctx.fillStyle = rgba(color, puddleAlpha);
      ctx.beginPath();
      ctx.ellipse(x, y + 12, puddleW, puddleH, 0, 0, Math.PI * 2);
      ctx.fill();

      // Code fragment characters in puddle
      ctx.fillStyle = rgba('#ffffff', puddleAlpha * 0.6);
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      const fragments = ['0x', 'FF', '{}', ';;', '//'];
      for (let i = 0; i < 5; i++) {
        const fx = x - 30 + i * 15;
        const fy = y + 10 + Math.sin(i * 2.3) * 4;
        if (Math.abs(fx - x) < puddleW * 0.85) {
          ctx.fillText(fragments[i], fx, fy);
        }
      }

      // Slow-field waves
      ctx.strokeStyle = rgba(color, puddleAlpha * 0.3);
      ctx.lineWidth = 1;
      for (let r = 0; r < 3; r++) {
        const waveR = puddleW * (0.4 + r * 0.25) + Math.sin(t * 12 + r) * 2;
        ctx.beginPath();
        ctx.ellipse(x, y + 12, waveR, waveR * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  },

  // ─── 4. Pixel Pup — Rastro Leal ──────────────────────────────────
  // Paw prints accelerate from caster toward an ally; a loyalty glow
  // pulses around the ally, then speed lines trail behind.
  'pixel-pup'(ctx, t, color, { x, y, casterX, casterY, allyX, allyY }) {
    const rush = phase(t, 0, 0.5);
    const aura = phase(t, 0.4, 0.8);
    const fadeOut = phase(t, 0.8, 1);
    const alpha = 1 - fadeOut;

    // Direction: caster → ally position (left side)
    const targetX = allyX;
    const targetY = allyY;

    // Paw prints along path
    const pawCount = 5;
    for (let i = 0; i < pawCount; i++) {
      const pawT = phase(rush, i / pawCount, (i + 1.5) / pawCount);
      if (pawT <= 0) continue;
      const px = casterX + (targetX - casterX) * (i + pawT) / pawCount;
      const py = casterY + (targetY - casterY) * (i + pawT) / pawCount;
      const pawAlpha = pawT * alpha * 0.6;

      ctx.fillStyle = rgba(color, pawAlpha);
      // Simple paw: 3 toes + pad
      ctx.fillRect(px - 3, py - 4, 2, 2);
      ctx.fillRect(px + 1, py - 4, 2, 2);
      ctx.fillRect(px - 1, py - 6, 2, 2);
      ctx.fillRect(px - 2, py - 1, 4, 3);
    }

    // Loyalty aura around ally
    if (aura > 0) {
      ctx.strokeStyle = rgba(color, easeOut(aura) * alpha * 0.6);
      ctx.lineWidth = 2;
      const auraR = 12 + easeOut(aura) * 8;
      ctx.beginPath();
      ctx.arc(targetX, targetY, auraR, 0, Math.PI * 2);
      ctx.stroke();

      // Speed lines behind movement direction
      ctx.strokeStyle = rgba(color, alpha * 0.3);
      ctx.lineWidth = 1;
      for (let s = 0; s < 3; s++) {
        const sy = targetY - 6 + s * 6;
        ctx.beginPath();
        ctx.moveTo(targetX + 12, sy);
        ctx.lineTo(targetX + 12 + 10 + easeOut(aura) * 8, sy);
        ctx.stroke();
      }
    }
  },

  // ─── 5. Circuit Hare — Salto de Circuito ─────────────────────────
  // Electric charge builds along circuit-board traces from caster; a
  // leaping arc strikes the target with spark burst.
  'circuit-hare'(ctx, t, color, { x, y, casterX, casterY }) {
    const charge = phase(t, 0, 0.35);
    const leap = phase(t, 0.3, 0.65);
    const impact = phase(t, 0.6, 1);

    // Circuit-board traces (charge phase)
    if (charge > 0) {
      ctx.strokeStyle = rgba(color, charge * 0.7);
      ctx.lineWidth = 2;
      // Right-angle path from caster partway
      const midX = casterX + (x - casterX) * 0.5;
      ctx.beginPath();
      ctx.moveTo(casterX, casterY);
      ctx.lineTo(midX, casterY);
      ctx.lineTo(midX, y);
      const endX = midX + (x - midX) * Math.min(charge * 1.5, 1);
      ctx.lineTo(endX, y);
      ctx.stroke();

      // Charge nodes
      for (let n = 0; n < 3; n++) {
        const np = n / 2;
        if (np > charge) break;
        const nx = casterX + (midX - casterX) * np;
        ctx.fillStyle = rgba(color, 0.8);
        ctx.fillRect(nx - 2, casterY - 2, 4, 4);
      }
    }

    // Leaping arc
    if (leap > 0) {
      const leapProgress = easeOut(leap);
      const arcX = casterX + (x - casterX) * leapProgress;
      const arcY = y - Math.sin(leapProgress * Math.PI) * 40;

      // Warning flash at landing zone (appears before arrival)
      if (leap > 0.2) {
        ctx.fillStyle = rgba(color, 0.15);
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();
      }

      // Arc body (electric trail)
      ctx.strokeStyle = rgba(color, 0.8 * (1 - impact));
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(casterX, casterY);
      for (let seg = 0; seg <= 8; seg++) {
        const segT = seg / 8;
        if (segT > leapProgress) break;
        const sx = casterX + (x - casterX) * segT;
        const sy = y - Math.sin(segT * Math.PI) * 40 +
                   Math.sin(seg * 7.3) * 4; // jitter
        ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // Hare silhouette at arc tip
      ctx.fillStyle = rgba(color, 0.9 * (1 - impact));
      ctx.fillRect(arcX - 4, arcY - 5, 8, 6);
      // Ears
      ctx.fillRect(arcX - 3, arcY - 9, 2, 5);
      ctx.fillRect(arcX + 1, arcY - 9, 2, 5);
    }

    // Impact sparks (4 deterministic)
    if (impact > 0) {
      ctx.fillStyle = rgba(color, (1 - impact) * 0.8);
      for (let s = 0; s < 4; s++) {
        const sa = s * Math.PI / 2 + 0.3;
        const sd = easeOut(impact) * 20;
        ctx.fillRect(x + Math.cos(sa) * sd - 2, y + Math.sin(sa) * sd - 2, 4, 3);
      }
    }
  },

  // ─── 6. Cache Crow — Memória de Alvo ─────────────────────────────
  // A targeting reticle locks on and persists with "memory rings";
  // feather particles orbit the locked target.
  'cache-crow'(ctx, t, color, { x, y }) {
    const lock = phase(t, 0, 0.3);
    const hold = phase(t, 0.3, 0.75);
    const release = phase(t, 0.75, 1);
    const alpha = 1 - release;

    // Targeting reticle closing in
    const reticleSize = 25 * (1 - easeOut(lock)) + 8;
    ctx.strokeStyle = rgba(color, alpha * 0.8);
    ctx.lineWidth = 1.5;

    // Crosshair lines
    const gap = reticleSize * 0.4;
    ctx.beginPath();
    ctx.moveTo(x - reticleSize, y); ctx.lineTo(x - gap, y);
    ctx.moveTo(x + gap, y); ctx.lineTo(x + reticleSize, y);
    ctx.moveTo(x, y - reticleSize); ctx.lineTo(x, y - gap);
    ctx.moveTo(x, y + gap); ctx.lineTo(x, y + reticleSize);
    ctx.stroke();

    // Lock ring
    ctx.beginPath();
    ctx.arc(x, y, reticleSize, 0, Math.PI * 2);
    ctx.stroke();

    // Memory echo rings (during hold)
    if (hold > 0) {
      for (let r = 0; r < 2; r++) {
        const echoR = reticleSize + 4 + r * 6 + Math.sin(hold * 8 + r * 2) * 2;
        ctx.strokeStyle = rgba(color, alpha * 0.2);
        ctx.beginPath();
        ctx.arc(x, y, echoR, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Orbiting feather particles (3)
    for (let f = 0; f < 3; f++) {
      const fa = f * Math.PI * 2 / 3 + t * Math.PI * 3;
      const fd = reticleSize + 3;
      ctx.fillStyle = rgba(color, alpha * 0.5);
      const fx = x + Math.cos(fa) * fd;
      const fy = y + Math.sin(fa) * fd;
      // Feather shape: small angled line
      ctx.save();
      ctx.translate(fx, fy);
      ctx.rotate(fa + Math.PI / 2);
      ctx.fillRect(-1, -4, 2, 8);
      ctx.restore();
    }
  },

  // ─── 7. Byte Boar — Cabeçada de Byte ─────────────────────────────
  // Charge wind-up, massive head-butt impact on a structure, debris
  // chunks fly outward, crack lines on ground.
  'byte-boar'(ctx, t, color, { x, y, casterX, casterY }) {
    const windup = phase(t, 0, 0.3);
    const charge = phase(t, 0.25, 0.55);
    const smash = phase(t, 0.5, 0.8);
    const debris = phase(t, 0.6, 1);

    // Wind-up: boar lowers head (dust puffs behind)
    if (windup > 0 && windup < 1) {
      ctx.fillStyle = rgba(color, windup * 0.4);
      for (let d = 0; d < 3; d++) {
        const dx = casterX - 8 - d * 8;
        const dy = casterY + 4 + Math.sin(d * 1.7) * 3;
        ctx.beginPath();
        ctx.arc(dx, dy, 3 + d, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Charging line (tusks forward)
    if (charge > 0) {
      const chargeX = casterX + (x - casterX) * easeIn(charge);
      ctx.strokeStyle = rgba(color, 0.7 * (1 - debris));
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(casterX, casterY);
      ctx.lineTo(chargeX, casterY + (y - casterY) * easeIn(charge));
      ctx.stroke();

      // Tusk glint
      ctx.fillStyle = rgba('#ffffff', 0.6 * (1 - debris));
      ctx.fillRect(chargeX + 2, y - 4, 5, 3);
      ctx.fillRect(chargeX + 2, y + 1, 5, 3);
    }

    // Impact burst
    if (smash > 0) {
      ctx.fillStyle = rgba(color, (1 - debris) * 0.6);
      const burstR = easeOut(smash) * 22;
      ctx.beginPath();
      ctx.arc(x, y, burstR, 0, Math.PI * 2);
      ctx.fill();

      // Crack lines on ground
      ctx.strokeStyle = rgba(color, (1 - debris) * 0.5);
      ctx.lineWidth = 1.5;
      for (let c = 0; c < 4; c++) {
        const ca = c * Math.PI / 2 + 0.4;
        ctx.beginPath();
        ctx.moveTo(x, y + 8);
        ctx.lineTo(x + Math.cos(ca) * 18, y + 8 + Math.abs(Math.sin(ca)) * 8);
        ctx.stroke();
      }
    }

    // Debris chunks (6 deterministic)
    if (debris > 0) {
      ctx.fillStyle = rgba(color, (1 - debris) * 0.7);
      for (let i = 0; i < 6; i++) {
        const da = i * Math.PI / 3 + 0.2;
        const dd = easeOut(debris) * 30 + 5;
        const ddy = Math.sin(da) > 0 ? dd * 0.6 : dd; // Less downward
        ctx.fillRect(
          x + Math.cos(da) * dd - 2,
          y + Math.sin(da) * ddy - 2, 4, 4
        );
      }
    }
  },

  // ─── 8. Socket Crab — Porta Travada ──────────────────────────────
  // Hexagonal shield forms around caster (self-buff), port connectors
  // snap shut with a lock icon, frontal damage reduction glow.
  'socket-crab'(ctx, t, color, { x, y, casterX, casterY }) {
    const form = phase(t, 0, 0.35);
    const hold = phase(t, 0.3, 0.8);
    const fade = phase(t, 0.8, 1);
    const alpha = 1 - fade;

    // Shield forms around CASTER (self-buff, not target)
    const shieldX = casterX;
    const shieldY = casterY;
    const shieldR = 18 + easeOut(form) * 8;

    // Hexagonal shield
    ctx.strokeStyle = rgba(color, alpha * 0.7);
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 6; i++) {
      const a = i * Math.PI / 3 - Math.PI / 6;
      const hx = shieldX + Math.cos(a) * shieldR;
      const hy = shieldY + Math.sin(a) * shieldR;
      if (i === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
    }
    ctx.stroke();

    // Frontal reinforcement glow (left half brighter = facing enemy)
    if (hold > 0) {
      ctx.fillStyle = rgba(color, alpha * 0.15);
      ctx.beginPath();
      ctx.arc(shieldX, shieldY, shieldR - 2, Math.PI / 2, Math.PI * 1.5);
      ctx.fill();
    }

    // Lock icon at centre
    if (form > 0.5) {
      const lockAlpha = alpha * 0.8;
      ctx.strokeStyle = rgba(color, lockAlpha);
      ctx.lineWidth = 1.5;
      // Shackle
      ctx.beginPath();
      ctx.arc(shieldX, shieldY - 3, 4, Math.PI, 0);
      ctx.stroke();
      // Body
      ctx.fillStyle = rgba(color, lockAlpha);
      ctx.fillRect(shieldX - 4, shieldY - 1, 8, 6);
    }

    // Port connector snaps (2 on sides)
    for (let side = -1; side <= 1; side += 2) {
      const snapProgress = phase(form, 0.3, 0.7);
      if (snapProgress <= 0) continue;
      const cx = shieldX + side * (shieldR + 3);
      const pinLen = 6 * (1 - easeOut(snapProgress));
      ctx.fillStyle = rgba(color, alpha * 0.5);
      ctx.fillRect(cx - 1, shieldY - 3, 2, 6);
      // Sliding pin
      ctx.fillRect(cx + side * pinLen - 1, shieldY - 2, 2, 4);
    }
  },

  // ─── 9. Copper Mole — Túnel de Cobre ─────────────────────────────
  // Unit sinks into ground (copper rings), ground trail of dirt mounds
  // moves toward target, emerges with copper flash. Exit point marked.
  'copper-mole'(ctx, t, color, { x, y, casterX, casterY }) {
    const dive = phase(t, 0, 0.2);
    const tunnel = phase(t, 0.15, 0.7);
    const emerge = phase(t, 0.65, 0.9);
    const flash = phase(t, 0.85, 1);

    // Dive: concentric copper rings at entry
    if (dive > 0 && tunnel < 0.8) {
      const diveAlpha = dive < 1 ? dive : (1 - tunnel);
      ctx.strokeStyle = rgba(color, diveAlpha * 0.5);
      ctx.lineWidth = 1.5;
      for (let r = 0; r < 2; r++) {
        const rr = (3 + r * 6) + easeOut(dive) * 8;
        ctx.beginPath();
        ctx.ellipse(casterX, casterY + 8, rr, rr * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Underground trail: dirt mounds along path
    if (tunnel > 0) {
      const moundCount = 6;
      for (let m = 0; m < moundCount; m++) {
        const mPhase = phase(tunnel, m / moundCount, (m + 2) / moundCount);
        if (mPhase <= 0 || mPhase >= 1) continue;
        const mx = casterX + (x - casterX) * (m + 0.5) / moundCount;
        const my = casterY + (y - casterY) * (m + 0.5) / moundCount + 10;

        ctx.fillStyle = rgba(color, mPhase * (1 - mPhase) * 1.5);
        ctx.beginPath();
        ctx.ellipse(mx, my, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Exit point warning (visible to opponent)
    if (tunnel > 0.3) {
      const warningAlpha = Math.min(tunnel * 0.8, 0.4) * (1 - flash);
      ctx.strokeStyle = rgba(color, warningAlpha);
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(x, y + 8, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Emergence burst
    if (emerge > 0) {
      ctx.fillStyle = rgba(color, (1 - flash) * 0.6);
      const eR = easeOut(emerge) * 14;
      ctx.beginPath();
      ctx.ellipse(x, y + 4, eR, eR * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Copper flash
      if (flash > 0) {
        ctx.strokeStyle = rgba('#ffffff', (1 - flash) * 0.5);
        ctx.lineWidth = 2;
        // Star burst
        for (let s = 0; s < 4; s++) {
          const sa = s * Math.PI / 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(sa) * 12, y + Math.sin(sa) * 12);
          ctx.stroke();
        }
      }
    }
  },

  // ─── 10. Fiber Finch — Pulso Óptico ──────────────────────────────
  // Rainbow-tinged scan lines sweep across target; on hit, a reveal
  // pulse expands showing translucent "detected" overlay.
  'fiber-finch'(ctx, t, color, { x, y, casterX, casterY }) {
    const scan = phase(t, 0, 0.45);
    const reveal = phase(t, 0.4, 0.7);
    const fade = phase(t, 0.7, 1);
    const alpha = 1 - fade;

    // Scan beam from caster
    if (scan > 0) {
      const beamEnd = casterX + (x - casterX) * easeOut(scan);
      // Rainbow gradient along beam
      const hues = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', color];
      for (let h = 0; h < hues.length; h++) {
        const lineY = casterY - 4 + h * 2;
        ctx.strokeStyle = rgba(hues[h], scan * alpha * 0.4);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(casterX + 10, lineY);
        ctx.lineTo(beamEnd, lineY + (y - casterY) * easeOut(scan) / 5);
        ctx.stroke();
      }
    }

    // Reveal pulse at target
    if (reveal > 0) {
      const pulseR = easeOut(reveal) * 25;
      ctx.strokeStyle = rgba(color, alpha * 0.6);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, pulseR, 0, Math.PI * 2);
      ctx.stroke();

      // "Detected" scan lines over target
      ctx.strokeStyle = rgba(color, alpha * 0.2);
      ctx.lineWidth = 1;
      for (let s = 0; s < 5; s++) {
        const sy = y - 15 + s * 7 + reveal * 3;
        ctx.beginPath();
        ctx.moveTo(x - 15, sy);
        ctx.lineTo(x + 15, sy);
        ctx.stroke();
      }

      // Eye icon
      ctx.strokeStyle = rgba(color, alpha * 0.7);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(x, y, 8, 4, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = rgba(color, alpha * 0.8);
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // ─── 11. Patch Toad — Hotfix ─────────────────────────────────────
  // Heal directed at an ALLY (not at target/enemy): green crosses float
  // from caster to ally, repair particles surround ally, HP glow.
  'patch-toad'(ctx, t, color, { x, y, casterX, casterY, allyX, allyY }) {
    const cast = phase(t, 0, 0.3);
    const travel = phase(t, 0.2, 0.6);
    const heal = phase(t, 0.5, 0.85);
    const fade = phase(t, 0.85, 1);
    const alpha = 1 - fade;

    // Caster glow (toad preparing)
    if (cast > 0 && cast < 1) {
      ctx.fillStyle = rgba(color, cast * 0.3);
      ctx.beginPath();
      ctx.arc(casterX, casterY, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // Healing crosses traveling to ally
    const crossCount = 3;
    for (let i = 0; i < crossCount; i++) {
      const cStart = i * 0.1;
      const ct = phase(travel, cStart, cStart + 0.7);
      if (ct <= 0 || ct >= 1) continue;

      const cx = casterX + (allyX - casterX) * easeOut(ct);
      const cy = casterY + (allyY - casterY) * easeOut(ct) - Math.sin(ct * Math.PI) * 15;

      ctx.fillStyle = rgba(color, alpha * 0.8);
      ctx.fillRect(cx - 1.5, cy - 5, 3, 10);
      ctx.fillRect(cx - 5, cy - 1.5, 10, 3);
    }

    // Healing aura around ally
    if (heal > 0) {
      // Soft glow
      ctx.fillStyle = rgba(color, alpha * 0.12);
      ctx.beginPath();
      ctx.arc(allyX, allyY, 16 + easeOut(heal) * 6, 0, Math.PI * 2);
      ctx.fill();

      // Rising repair particles (4 deterministic)
      ctx.fillStyle = rgba(color, alpha * 0.5);
      for (let p = 0; p < 4; p++) {
        const px = allyX - 8 + p * 5;
        const py = allyY + 8 - easeOut(heal) * 20 - p * 3;
        ctx.fillRect(px, py, 3, 3);
      }

      // Wrench/patch icon
      ctx.strokeStyle = rgba(color, alpha * 0.6);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(allyX - 4, allyY + 2);
      ctx.lineTo(allyX + 4, allyY - 6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(allyX + 4, allyY - 6, 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  },

  // ─── 12. Logic Lizard — Lógica Encadeada ─────────────────────────
  // Chain lightning: bolt hits primary target, bounces to 2nd and 3rd
  // targets at decreasing brightness. Distinct chain segments visible.
  'logic-lizard'(ctx, t, color, { x, y, casterX, casterY }) {
    const shot1 = phase(t, 0, 0.35);
    const shot2 = phase(t, 0.3, 0.6);
    const shot3 = phase(t, 0.55, 0.85);
    const fade = phase(t, 0.8, 1);
    const alpha = 1 - fade;

    // Target positions: primary, +2 chain targets
    const t1 = { x, y };
    const t2 = { x: x + 35, y: y - 20 };
    const t3 = { x: x + 55, y: y + 10 };

    // Draw chain bolt segments
    function drawBolt(fromX, fromY, toX, toY, progress, brightness) {
      if (progress <= 0) return;
      const endX = fromX + (toX - fromX) * easeOut(progress);
      const endY = fromY + (toY - fromY) * easeOut(progress);

      ctx.strokeStyle = rgba(color, brightness * alpha);
      ctx.lineWidth = 2.5 * brightness;
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      // Zigzag segments for lightning feel
      const steps = 6;
      for (let s = 1; s <= steps; s++) {
        const st = s / steps;
        if (st > easeOut(progress)) break;
        const sx = fromX + (endX - fromX) * st;
        const sy = fromY + (endY - fromY) * st;
        const jitter = s < steps ? Math.sin(s * 9.7 + t * 15) * 5 : 0;
        ctx.lineTo(sx + jitter, sy);
      }
      ctx.stroke();

      // Impact dot
      if (progress > 0.7) {
        ctx.fillStyle = rgba(color, brightness * alpha * 0.5);
        ctx.beginPath();
        ctx.arc(endX, endY, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    drawBolt(casterX, casterY, t1.x, t1.y, shot1, 1.0);
    drawBolt(t1.x, t1.y, t2.x, t2.y, shot2, 0.55);
    drawBolt(t2.x, t2.y, t3.x, t3.y, shot3, 0.3);

    // Chain link markers
    const targets = [t1, t2, t3];
    const phases = [shot1, shot2, shot3];
    const strengths = [1.0, 0.5, 0.25];
    for (let i = 0; i < 3; i++) {
      if (phases[i] > 0.5) {
        ctx.strokeStyle = rgba(color, strengths[i] * alpha * 0.4);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(targets[i].x, targets[i].y, 8, 0, Math.PI * 2);
        ctx.stroke();
        // Damage label
        ctx.fillStyle = rgba(color, strengths[i] * alpha * 0.6);
        ctx.font = '7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.round(strengths[i] * 100)}%`, targets[i].x, targets[i].y - 12);
      }
    }
  },

  // ─── 13. Kernel Goat — Kernel Panic ──────────────────────────────
  // Seismic headbutt: shockwave rings on ground, enemies pushed outward,
  // "PANIC" glitch text flickers, ground cracks radiate.
  'kernel-goat'(ctx, t, color, { x, y }) {
    const windup = phase(t, 0, 0.25);
    const slam = phase(t, 0.2, 0.5);
    const wave = phase(t, 0.45, 0.85);
    const fade = phase(t, 0.8, 1);
    const alpha = 1 - fade;

    // Wind-up: head lowers, glow intensifies at point of impact
    if (windup > 0 && windup < 1) {
      ctx.fillStyle = rgba(color, windup * 0.3);
      ctx.beginPath();
      ctx.arc(x, y, 8 + windup * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Slam impact
    if (slam > 0) {
      ctx.fillStyle = rgba(color, (1 - wave) * 0.5);
      ctx.beginPath();
      ctx.arc(x, y, easeOut(slam) * 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // Shockwave rings expanding outward (ground-level ellipses)
    if (wave > 0) {
      for (let r = 0; r < 3; r++) {
        const rPhase = phase(wave, r * 0.15, r * 0.15 + 0.6);
        if (rPhase <= 0) continue;
        const ringR = easeOut(rPhase) * (25 + r * 12);
        ctx.strokeStyle = rgba(color, alpha * (0.5 - r * 0.12));
        ctx.lineWidth = 2 - r * 0.5;
        ctx.beginPath();
        ctx.ellipse(x, y + 6, ringR, ringR * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Push arrows (4 directions)
      ctx.fillStyle = rgba(color, alpha * 0.4);
      for (let a = 0; a < 4; a++) {
        const angle = a * Math.PI / 2;
        const ad = 20 + easeOut(wave) * 15;
        const ax = x + Math.cos(angle) * ad;
        const ay = y + Math.sin(angle) * ad * 0.35 + 6;
        // Arrow triangle
        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -3);
        ctx.lineTo(6, 0);
        ctx.lineTo(0, 3);
        ctx.fill();
        ctx.restore();
      }
    }

    // "PANIC" glitch text
    if (slam > 0.3 && alpha > 0.1) {
      ctx.fillStyle = rgba(color, alpha * 0.35);
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      const glitchX = x + Math.sin(t * 40) * 2;
      ctx.fillText('PANIC', glitchX, y - 16);
    }
  },

  // ─── 14. Packet Fox — Pacote Fantasma ────────────────────────────
  // Cloaking: unit fades to translucent with distortion shimmer;
  // on first strike, a violet burst with +40% marker appears.
  'packet-fox'(ctx, t, color, { x, y, casterX, casterY }) {
    const cloak = phase(t, 0, 0.4);
    const stealth = phase(t, 0.35, 0.65);
    const strike = phase(t, 0.6, 0.85);
    const fade = phase(t, 0.85, 1);
    const alpha = 1 - fade;

    // Cloaking process: scan lines dissolving the unit
    if (cloak > 0) {
      const cloakAlpha = cloak * alpha;
      ctx.strokeStyle = rgba(color, cloakAlpha * 0.4);
      ctx.lineWidth = 1;
      for (let s = 0; s < 8; s++) {
        const sy = casterY - 15 + s * 4;
        const sWidth = 14 - Math.abs(s - 3.5) * 2;
        const dissolve = phase(cloak, s * 0.08, s * 0.08 + 0.5);
        if (dissolve > 0) {
          ctx.globalAlpha = (1 - dissolve) * cloakAlpha;
          ctx.beginPath();
          ctx.moveTo(casterX - sWidth, sy);
          ctx.lineTo(casterX + sWidth, sy);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    }

    // Stealth: shimmer distortion (visible to opponent)
    if (stealth > 0) {
      ctx.strokeStyle = rgba(color, alpha * 0.15);
      ctx.lineWidth = 1;
      // Wavy outline suggesting invisible presence
      ctx.beginPath();
      for (let i = 0; i <= 12; i++) {
        const angle = i * Math.PI / 6;
        const r = 10 + Math.sin(i * 3 + t * 20) * 3;
        const px = casterX + Math.cos(angle) * r;
        const py = casterY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Uncloaking strike
    if (strike > 0) {
      // Burst from stealth
      ctx.fillStyle = rgba(color, (1 - easeOut(strike)) * alpha * 0.5);
      ctx.beginPath();
      ctx.arc(x, y, easeOut(strike) * 20, 0, Math.PI * 2);
      ctx.fill();

      // Slash marks
      ctx.strokeStyle = rgba(color, alpha * 0.8);
      ctx.lineWidth = 2;
      for (let s = 0; s < 2; s++) {
        ctx.beginPath();
        ctx.moveTo(x - 10 + s * 6, y - 8);
        ctx.lineTo(x + 6 + s * 6, y + 8);
        ctx.stroke();
      }

      // +40% marker
      if (strike > 0.3) {
        ctx.fillStyle = rgba(color, alpha * 0.7);
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('+40%', x, y - 18);
      }
    }
  },

  // ─── 15. Buffer Bison — Zona de Buffer ───────────────────────────
  // Aura field around caster: concentric protective rings pulse outward,
  // allies inside get subtle glow; non-stacking indicator shown.
  'buffer-bison'(ctx, t, color, { x, y, casterX, casterY }) {
    const expand = phase(t, 0, 0.35);
    const pulse = phase(t, 0.3, 0.8);
    const fade = phase(t, 0.8, 1);
    const alpha = 1 - fade;

    const auraX = casterX;
    const auraY = casterY;
    const maxR = 40;
    const currentR = easeOut(expand) * maxR;

    // Aura zone fill
    ctx.fillStyle = rgba(color, alpha * 0.08);
    ctx.beginPath();
    ctx.arc(auraX, auraY, currentR, 0, Math.PI * 2);
    ctx.fill();

    // Concentric rings (pulsing)
    for (let r = 0; r < 3; r++) {
      const ringR = currentR * (0.4 + r * 0.3) + Math.sin(pulse * 6 + r * 2) * 2;
      if (ringR < 2) continue;
      ctx.strokeStyle = rgba(color, alpha * (0.35 - r * 0.08));
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(auraX, auraY, ringR, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Outer boundary ring
    ctx.strokeStyle = rgba(color, alpha * 0.5);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(auraX, auraY, currentR, 0, Math.PI * 2);
    ctx.stroke();

    // Shield-up arrows pointing inward (protection indicator)
    if (pulse > 0) {
      ctx.fillStyle = rgba(color, alpha * 0.35);
      for (let a = 0; a < 4; a++) {
        const angle = a * Math.PI / 2 + Math.PI / 4;
        const arrowDist = currentR - 6;
        const ax = auraX + Math.cos(angle) * arrowDist;
        const ay = auraY + Math.sin(angle) * arrowDist;

        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate(angle + Math.PI); // Point inward
        ctx.beginPath();
        ctx.moveTo(0, -3);
        ctx.lineTo(5, 0);
        ctx.lineTo(0, 3);
        ctx.fill();
        ctx.restore();
      }
    }

    // "12%" reduction label
    if (expand > 0.6) {
      ctx.fillStyle = rgba(color, alpha * 0.4);
      ctx.font = '7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('-12%', auraX, auraY + currentR + 10);
    }
  },

  // ─── 16. Cache Mantis — Cache Hit ────────────────────────────────
  // Lunge: mantis dashes forward in a blur, blades slash on arrival,
  // +30% damage marker on first hit, afterimage trail.
  'cache-mantis'(ctx, t, color, { x, y, casterX, casterY }) {
    const crouch = phase(t, 0, 0.2);
    const dash = phase(t, 0.15, 0.5);
    const slash = phase(t, 0.45, 0.75);
    const fade = phase(t, 0.7, 1);
    const alpha = 1 - fade;

    // Crouch: tension lines behind caster
    if (crouch > 0 && crouch < 1) {
      ctx.strokeStyle = rgba(color, crouch * alpha * 0.4);
      ctx.lineWidth = 1;
      for (let l = 0; l < 3; l++) {
        const ly = casterY - 5 + l * 5;
        ctx.beginPath();
        ctx.moveTo(casterX - 10, ly);
        ctx.lineTo(casterX - 10 - crouch * 12, ly);
        ctx.stroke();
      }
    }

    // Dash: afterimage trail
    if (dash > 0) {
      const dashProgress = easeOut(dash);
      const currentX = casterX + (x - casterX) * dashProgress;
      const currentY = casterY + (y - casterY) * dashProgress;

      // Afterimages (4)
      for (let a = 0; a < 4; a++) {
        const at = Math.max(0, dashProgress - a * 0.15);
        if (at <= 0) continue;
        const ax = casterX + (x - casterX) * at;
        const ay = casterY + (y - casterY) * at;

        ctx.fillStyle = rgba(color, (0.3 - a * 0.06) * alpha);
        ctx.fillRect(ax - 4, ay - 5, 8, 10);
      }

      // Speed lines
      ctx.strokeStyle = rgba(color, alpha * 0.3);
      ctx.lineWidth = 1;
      for (let s = 0; s < 3; s++) {
        ctx.beginPath();
        ctx.moveTo(currentX - 5, currentY - 3 + s * 3);
        ctx.lineTo(currentX - 5 - dashProgress * 20, currentY - 3 + s * 3);
        ctx.stroke();
      }
    }

    // Slash: X-pattern blade marks
    if (slash > 0) {
      ctx.strokeStyle = rgba(color, alpha * 0.8);
      ctx.lineWidth = 2.5;
      const slashSize = easeOut(slash) * 14;

      // First blade (top-left to bottom-right)
      ctx.beginPath();
      ctx.moveTo(x - slashSize, y - slashSize);
      ctx.lineTo(x + slashSize, y + slashSize);
      ctx.stroke();

      // Second blade (top-right to bottom-left)
      ctx.beginPath();
      ctx.moveTo(x + slashSize, y - slashSize);
      ctx.lineTo(x - slashSize, y + slashSize);
      ctx.stroke();

      // +30% first-hit marker
      if (slash > 0.4) {
        ctx.fillStyle = rgba(color, alpha * 0.7);
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('+30%', x, y - 20);
      }

      // Blade glint particles (2)
      ctx.fillStyle = rgba('#ffffff', alpha * (1 - slash) * 0.6);
      ctx.fillRect(x - slashSize + 2, y - slashSize + 2, 3, 3);
      ctx.fillRect(x + slashSize - 5, y - slashSize + 2, 3, 3);
    }
  }

};

// Re-export renderer map for testing/verification
export { SPELL_RENDERERS };
