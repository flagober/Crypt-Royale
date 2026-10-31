/**
 * vfx-tower-destruction.js
 * Deterministic destruction feedback for Crypt Royale towers.
 */

const PALETTE = {
  player: { embers: '#22d3ee' },
  enemy: { embers: '#fb7185' },
  debris: '#475569',
  debrisLight: '#64748b',
  debrisDark: '#0f172a',
  spark: '#ffffff',
  flash: '#ffffff'
};

const ANIMATION_MS = 750;

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  );
}

const _vfxState = new Map();

export function resetTowerDestructionVFX() {
  _vfxState.clear();
}

export function notifyTowerDestroyedVFX(towerId, towerType, towerTeam) {
  if (_vfxState.has(towerId)) return;
  _vfxState.set(towerId, {
    timeSinceDeathMs: 0,
    settled: prefersReducedMotion(),
    type: towerType,
    team: towerTeam,
  });
}

export function tickTowerDestructionVFX(deltaMs, towers) {
  for (const tower of towers) {
    if (tower.hp <= 0) {
      if (!_vfxState.has(tower.id)) {
        notifyTowerDestroyedVFX(tower.id, tower.type, tower.team);
      }
      const state = _vfxState.get(tower.id);
      if (!state.settled) {
        state.timeSinceDeathMs += deltaMs;
        if (state.timeSinceDeathMs >= ANIMATION_MS) {
          state.settled = true;
          state.timeSinceDeathMs = ANIMATION_MS;
        }
      }
    }
  }
}

const DEBRIS_FRAGMENTS = [
  { color: PALETTE.debrisDark, pts: [[-0.7, 0.1], [-0.4, -0.3], [-0.2, 0.1], [-0.5, 0.4]] },
  { color: PALETTE.debrisLight, pts: [[0.2, -0.3], [0.6, -0.1], [0.5, 0.3], [0.1, 0.1]] },
  { color: PALETTE.debrisDark, pts: [[0.1, 0.3], [0.5, 0.4], [0.3, 0.7], [-0.1, 0.5]] },
  { color: PALETTE.debrisLight, pts: [[-0.5, -0.4], [-0.2, -0.6], [0.0, -0.3], [-0.2, -0.2]] },
  { color: PALETTE.debris, pts: [[-0.6, 0.4], [-0.3, 0.3], [-0.1, 0.6], [-0.4, 0.7]] },
  { color: PALETTE.debrisDark, pts: [[0.5, -0.2], [0.8, 0.0], [0.7, 0.3], [0.4, 0.1]] }
];

const STUMP_PTS_GUARD = [
  [-0.2, 0.2], [-0.2, -0.2], [-0.05, -0.3], [0.1, -0.1], [0.2, -0.3], [0.25, 0.1], [0.1, 0.3]
];

const STUMP_PTS_CORE = [
  [-0.3, 0.3], [-0.35, -0.2], [-0.15, -0.4], [0.0, -0.2], [0.15, -0.5], [0.35, -0.2], [0.3, 0.4], [0.1, 0.5], [-0.1, 0.4]
];

const EMBER_POSITIONS = [
  { x: -0.4, y: 0.2, r: 1.5 },
  { x: 0.3, y: -0.1, r: 2.0 },
  { x: 0.1, y: 0.4, r: 1.5 }
];

const SPARK_DIRECTIONS = [
  { dx: 0.8, dy: -0.6 },
  { dx: -0.7, dy: -0.7 },
  { dx: 0.9, dy: 0.4 },
  { dx: -0.8, dy: 0.5 },
  { dx: 0.0, dy: -0.9 },
  { dx: 0.3, dy: 0.9 },
  { dx: -0.4, dy: -0.3 }
];

export function drawTowerDestructionVFX(ctx, tower, nowMs) {
  const state = _vfxState.get(tower.id);
  if (!state) return;

  const isCore = state.type === 'core';
  const rx = isCore ? 29 : 23;
  const ry = isCore ? 15 : 12;

  const embersColor = PALETTE[state.team]?.embers ?? '#fff';

  ctx.save();
  ctx.translate(tower.x, tower.y);

  const reducedMotion = prefersReducedMotion();
  const t = (state.settled || reducedMotion) ? 1 : Math.min(1, state.timeSinceDeathMs / ANIMATION_MS);

  // Wreckage footprint (animates expanding outwards and fading in)
  const footprintAlpha = (state.settled || reducedMotion) ? 1 : Math.min(1, t * 1.5);
  const footprintScale = (state.settled || reducedMotion) ? 1 : 0.8 + 0.2 * Math.sqrt(t);

  ctx.globalAlpha = footprintAlpha;
  
  // Shadow ellipse
  ctx.fillStyle = PALETTE.debrisDark;
  ctx.beginPath();
  ctx.ellipse(
    0, 0.1 * ry * footprintScale,
    0.9 * rx * footprintScale, 0.8 * ry * footprintScale,
    0, 0, Math.PI * 2
  );
  ctx.fill();

  // Angular Fragments
  for (const frag of DEBRIS_FRAGMENTS) {
    ctx.fillStyle = frag.color;
    ctx.beginPath();
    ctx.moveTo(frag.pts[0][0] * rx * footprintScale, frag.pts[0][1] * ry * footprintScale);
    for (let i = 1; i < frag.pts.length; i++) {
      ctx.lineTo(frag.pts[i][0] * rx * footprintScale, frag.pts[i][1] * ry * footprintScale);
    }
    ctx.closePath();
    ctx.fill();
  }

  // Stump
  const stumpPts = isCore ? STUMP_PTS_CORE : STUMP_PTS_GUARD;
  ctx.fillStyle = PALETTE.debris;
  ctx.beginPath();
  ctx.moveTo(stumpPts[0][0] * rx * footprintScale, stumpPts[0][1] * ry * footprintScale);
  for (let i = 1; i < stumpPts.length; i++) {
    ctx.lineTo(stumpPts[i][0] * rx * footprintScale, stumpPts[i][1] * ry * footprintScale);
  }
  ctx.closePath();
  ctx.fill();

  // Embers pulsating
  if (state.settled || reducedMotion || t > 0.4) {
    let emberOpacityScale = 1;
    if (!state.settled && !reducedMotion) {
      emberOpacityScale = (t - 0.4) / 0.6;
    }
    
    for (let i = 0; i < EMBER_POSITIONS.length; i++) {
      const ember = EMBER_POSITIONS[i];
      const phaseOffset = i * 1234.5 + tower.x;
      const pulse = reducedMotion ? 0.5 : 0.5 + 0.5 * Math.sin((nowMs + phaseOffset) / 250);
      
      ctx.globalAlpha = emberOpacityScale * (0.3 + 0.7 * pulse);
      ctx.fillStyle = embersColor;
      
      ctx.beginPath();
      ctx.arc(
        ember.x * rx * footprintScale,
        ember.y * ry * footprintScale,
        ember.r,
        0, Math.PI * 2
      );
      ctx.fill();
    }
  }

  // Flash and sparks (animation only)
  if (!state.settled && !reducedMotion && t < 1) {
    // Initial flash
    if (t < 0.25) {
      const flashT = t / 0.25;
      ctx.globalAlpha = 1 - flashT;
      ctx.fillStyle = PALETTE.flash;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx * (1 + 0.5 * flashT), ry * (1 + 0.5 * flashT), 0, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Flying sparks
    if (t < 0.8) {
      const sparkT = t / 0.8;
      ctx.globalAlpha = 1 - Math.pow(sparkT, 3);
      ctx.fillStyle = PALETTE.spark;
      
      for (let i = 0; i < SPARK_DIRECTIONS.length; i++) {
        const dir = SPARK_DIRECTIONS[i];
        const dist = 1 - Math.pow(1 - sparkT, 2); 
        
        const sparkX = dir.dx * rx * 1.5 * dist;
        const sparkY = dir.dy * ry * 2.0 * dist + (sparkT * sparkT * 10);
        
        ctx.beginPath();
        ctx.arc(sparkX, sparkY, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  ctx.restore();
}
