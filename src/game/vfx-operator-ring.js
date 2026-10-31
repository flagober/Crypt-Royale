/**
 * vfx-operator-ring.js
 * Holographic ring VFX for the Vila Byte Operator Core Tower.
 *
 * INTEGRATION NOTE: Integrated with the approved tower sprite
 * (cr_vila_byte_operator_core_master_v001.png / candidate V004-body).
 * Draws over the raster body and before the future avatar slot.
 *
 * Draw order (per tower, enforced by caller):
 *   1. Tower raster sprite  (render.js)
 *   2. drawOperatorRing()   ← this module
 *   3. Operator avatar      (future)
 *   4. Health bar           (render.js)
 */

// ─── Palette ─────────────────────────────────────────────────────────────────

const COLORS = {
  player: {
    primary:   '#22D3EE',
    secondary: '#67E8F9',
    glow:      'rgba(34,211,238,',
  },
  enemy: {
    primary:   '#FB7185',
    secondary: '#FDA4AF',
    glow:      'rgba(251,113,133,',
  },
  bastionRim: '#FDE047',
};

// ─── Motion preference (queried per-call, not captured at module load) ────────

/**
 * Returns true if the user has requested reduced motion.
 * Queried dynamically so it reacts to OS-level changes at runtime.
 */
function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  );
}

// ─── Ring geometry ────────────────────────────────────────────────────────────

const RING_CONFIG = {
  /**
   * Vertical offset from tower.y to the Operator platform centre (game-space px).
   *
   * Calibrated for the approved master (cr_vila_byte_operator_core_master_v001.png / candidate V004).
   * Using sprite pivot (1085, 1750) and scale 0.034.
   *
   * When integrating, prefer per-asset metadata:
   *   towerVfxAnchor: { x: 0, y: -48 }
   */
  anchorOffsetY: -48,

  /** Three concentric elliptic rings: outer → inner */
  rings: [
    { rx: 18, ry: 5.5, lineWidth: 1.4 },
    { rx: 13, ry: 4.0, lineWidth: 1.0 },
    { rx:  8, ry: 2.5, lineWidth: 0.8 },
  ],

  segmentsPerRing:  6,
  segmentFill:      0.6,
  rotationPeriodMs: 4800,

  opacityMin:    0.45,
  opacityMax:    0.90,
  pulsePeriodMs: 2200,

  attackFlashMs:    320,
  attackFlashExtra: 0.55,

  /** hp/maxHp ratio below which the critical flicker state activates */
  criticalThreshold: 0.25,
  criticalFlickerHz: 8.5,

  /** Duration of the ring-collapse animation when the tower is destroyed */
  collapseMs: 600,

  /** The ring exists only while the Operator Bastion shield is active. */
  bastionFadeInMs:  220,
  bastionFadeOutMs: 250,

  bastionRimRx:    23,
  bastionRimRy:     7,
  bastionRimWidth:  2.2,
};

// ─── Per-tower animation state ────────────────────────────────────────────────

/**
 * Ephemeral VFX state keyed by tower.id.
 * Contains ONLY visual timing data — no game logic.
 *
 * @type {Map<string, { attackFlashRemainingMs: number,
 *                      collapseRemainingMs: number,
 *                      collapsed: boolean,
 *                      bastionLevel: number }>}
 */
const _ringState = new Map();

function _getState(towerId) {
  if (!_ringState.has(towerId)) {
    _ringState.set(towerId, {
      attackFlashRemainingMs: 0,
      collapseRemainingMs:    0,
      collapsed:              false,
      bastionLevel:           0,
    });
  }
  return _ringState.get(towerId);
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Clear all VFX state.
 * Must be called:
 *   • when creating a new game session
 *   • on "Reiniciar treino" (training reset)
 *   • before loading / reloading any battle
 *
 * Failing to call this between matches will cause destroyed towers from
 * the previous session to continue showing as collapsed in the next match.
 */
export function resetOperatorRingVFX() {
  _ringState.clear();
}

/**
 * Notify the VFX system that a tower took damage this frame.
 * Call from the engine tick AFTER damageEntity(), never from render.
 * @param {string} towerId
 */
export function notifyTowerHit(towerId) {
  _getState(towerId).attackFlashRemainingMs = RING_CONFIG.attackFlashMs;
}

/**
 * Notify the VFX system that a tower was destroyed.
 * Triggers the collapse animation (or an instant state change when
 * prefers-reduced-motion is active).
 * @param {string} towerId
 */
export function notifyTowerDestroyed(towerId) {
  const s = _getState(towerId);
  if (s.collapsed || s.collapseRemainingMs > 0) return;

  if (prefersReducedMotion()) {
    // No animation under reduced-motion — skip directly to collapsed
    s.collapsed = true;
  } else {
    s.collapseRemainingMs = RING_CONFIG.collapseMs;
  }
}

/**
 * Advance VFX timers. Call once per game frame, before any rendering.
 * @param {number} deltaMs  Elapsed milliseconds since the last frame.
 * @param {Array}  towers   game.towers array.
 */
export function tickRingVFX(deltaMs, towers) {
  const reducedMotion = prefersReducedMotion();

  for (const tower of towers) {
    const s = _getState(tower.id);
    const bastionActive = tower.type === 'core' && tower.shield > 0;

    if (reducedMotion) {
      s.bastionLevel = bastionActive ? 1 : 0;
    } else if (bastionActive) {
      s.bastionLevel = Math.min(1, s.bastionLevel + deltaMs / RING_CONFIG.bastionFadeInMs);
    } else {
      s.bastionLevel = Math.max(0, s.bastionLevel - deltaMs / RING_CONFIG.bastionFadeOutMs);
    }

    if (s.attackFlashRemainingMs > 0) {
      // Under reduced-motion the flash timer still drains so state is
      // eventually cleared; the visual simply renders as a fixed opacity step.
      s.attackFlashRemainingMs = Math.max(0, s.attackFlashRemainingMs - deltaMs);
    }

    if (s.collapseRemainingMs > 0) {
      if (reducedMotion) {
        // Jump instantly to collapsed
        s.collapseRemainingMs = 0;
        s.collapsed = true;
      } else {
        s.collapseRemainingMs = Math.max(0, s.collapseRemainingMs - deltaMs);
        if (s.collapseRemainingMs === 0) s.collapsed = true;
      }
    }

    // Auto-sync towers destroyed without an explicit notification
    if (tower.hp <= 0 && !s.collapsed && s.collapseRemainingMs <= 0) {
      notifyTowerDestroyed(tower.id);
    }
  }
}

/**
 * Draw the holographic ring for a single Operator Core tower.
 *
 * Must be called AFTER the tower sprite and BEFORE the avatar layer.
 * Has no effect on guard towers (tower.type !== 'core').
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ id: string, team: string, type: string,
 *           x: number, y: number, hp: number, maxHp: number }} tower
 * @param {number}  nowMs         game.nowMs (monotonic match clock in ms)
 * @param {boolean} [bastionActive=false]
 */
export function drawOperatorRing(ctx, tower, nowMs, bastionActive = tower.shield > 0) {
  if (tower.type !== 'core') return;

  const state = _getState(tower.id);
  if (state.collapsed) return;

  // The Operator ring is the visual language of the Bastion shield. It must
  // not decorate an unshielded tower. bastionLevel keeps the approved short
  // fade-out visible after shield reaches zero.
  const bastionLevel = prefersReducedMotion()
    ? (bastionActive ? 1 : 0)
    : state.bastionLevel;
  if (bastionLevel <= 0) return;

  const cfg       = RING_CONFIG;
  const pal       = COLORS[tower.team] ?? COLORS.player;
  const cx        = tower.x;
  const cy        = tower.y + cfg.anchorOffsetY;
  const hpRatio   = Math.max(0, tower.hp / tower.maxHp);
  const isCritical = hpRatio > 0 && hpRatio < cfg.criticalThreshold;
  const reduced   = prefersReducedMotion();

  // ── Collapse animation ────────────────────────────────────────────────────
  let collapseScale = 1;
  let collapseAlpha = 1;
  if (!reduced && state.collapseRemainingMs > 0) {
    const t = 1 - state.collapseRemainingMs / cfg.collapseMs;   // 0 → 1
    collapseScale = Math.max(0, 1 - t * t);
    collapseAlpha = Math.max(0, 1 - t * 1.6);
  }

  // ── Opacity ───────────────────────────────────────────────────────────────
  let opacity;
  if (reduced) {
    // Static mid-point — no pulse, no flicker
    opacity = (cfg.opacityMin + cfg.opacityMax) / 2;

    // Flash communicates "hit" as a fixed high-opacity step
    if (state.attackFlashRemainingMs > 0) {
      opacity = Math.min(1, cfg.opacityMax + cfg.attackFlashExtra * 0.5);
    }
  } else if (isCritical) {
    // Irregular flicker: two incommensurable sine waves
    const f =
      0.5 +
      0.3 * Math.sin((nowMs / 1000) * cfg.criticalFlickerHz * Math.PI * 2) +
      0.2 * Math.sin((nowMs / 1000) * cfg.criticalFlickerHz * 1.618 * Math.PI * 2);
    opacity = cfg.opacityMin + f * (cfg.opacityMax - cfg.opacityMin);
  } else {
    const pulse = 0.5 + 0.5 * Math.sin((nowMs / cfg.pulsePeriodMs) * Math.PI * 2);
    opacity = cfg.opacityMin + pulse * (cfg.opacityMax - cfg.opacityMin);

    if (state.attackFlashRemainingMs > 0) {
      const flashT = state.attackFlashRemainingMs / cfg.attackFlashMs;
      opacity = Math.min(1, opacity + cfg.attackFlashExtra * flashT * flashT);
    }
  }

  opacity *= collapseAlpha * bastionLevel;
  if (opacity <= 0) return;

  // ── Rotation angle ────────────────────────────────────────────────────────
  const rotationAngle = reduced
    ? 0
    : ((nowMs % cfg.rotationPeriodMs) / cfg.rotationPeriodMs) * Math.PI * 2;

  ctx.save();
  ctx.translate(cx, cy);
  if (!reduced) ctx.scale(collapseScale, collapseScale);

  // ── Bastion outer rim ─────────────────────────────────────────────────────
  if (bastionActive || bastionLevel > 0) {
    const bp = reduced
      ? 1
      : 0.7 + 0.3 * Math.sin((nowMs / 600) * Math.PI * 2);

    // Soft outer glow
    ctx.globalAlpha = opacity * bp * 0.3;
    ctx.strokeStyle = 'rgba(253,224,71,0.4)';
    ctx.lineWidth   = cfg.bastionRimWidth + 4;
    ctx.beginPath();
    ctx.ellipse(0, 0, cfg.bastionRimRx + 2, cfg.bastionRimRy + 1, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Crisp rim
    ctx.globalAlpha = opacity * bp;
    ctx.strokeStyle = COLORS.bastionRim;
    ctx.lineWidth   = cfg.bastionRimWidth;
    ctx.beginPath();
    ctx.ellipse(0, 0, cfg.bastionRimRx, cfg.bastionRimRy, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // ── Three elliptical rings ────────────────────────────────────────────────
  const segArc     = (Math.PI * 2) / cfg.segmentsPerRing;
  const visibleArc = segArc * cfg.segmentFill;

  cfg.rings.forEach((ring, ringIndex) => {
    const dir   = ringIndex % 2 === 0 ? 1 : -1;
    const phase = rotationAngle * dir + (ringIndex * Math.PI * 2) / cfg.rings.length;
    const color = ringIndex === 0 ? pal.secondary : pal.primary;

    // Glow pass
    ctx.globalAlpha = opacity * 0.32;
    ctx.strokeStyle = `${pal.glow}0.9)`;
    ctx.lineWidth   = ring.lineWidth + 2.5;
    ctx.lineCap     = 'round';
    for (let s = 0; s < cfg.segmentsPerRing; s++) {
      const a0 = phase + s * segArc;
      ctx.beginPath();
      ctx.ellipse(0, 0, ring.rx, ring.ry, 0, a0, a0 + visibleArc, false);
      ctx.stroke();
    }

    // Crisp pass
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = color;
    ctx.lineWidth   = ring.lineWidth;
    for (let s = 0; s < cfg.segmentsPerRing; s++) {
      const a0 = phase + s * segArc;
      ctx.beginPath();
      ctx.ellipse(0, 0, ring.rx, ring.ry, 0, a0, a0 + visibleArc, false);
      ctx.stroke();
    }
  });

  ctx.globalAlpha = 1;
  ctx.restore();
}
