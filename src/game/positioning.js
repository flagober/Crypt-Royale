const MARGIN = 18;
const clamp = (value, max) => Math.max(MARGIN, Math.min(max - MARGIN, value));
export const UNIT_SPACING = 30;
export function laneContains(unit, x) {
  return !unit.lane || (unit.lane === 'left' ? x <= 180 : x >= 180);
}
export function clampToLane(unit) {
  if (unit.lane === 'left') unit.x = Math.min(180, unit.x);
  if (unit.lane === 'right') unit.x = Math.max(180, unit.x);
}

// Reserve distinct nearby approach points instead of sending every unit to the centre.
export function attackPosition(game, unit, target) {
  const radius = Math.max(UNIT_SPACING, unit.range + (target.type ? 19 : 10) - 4);
  const count = Math.max(6, Math.floor(2 * Math.PI * radius / UNIT_SPACING));
  const occupied = game.units.filter(other => other !== unit && other.hp > 0 && other.targetId === target.id && other.attackPosition);
  const candidates = Array.from({ length: count }, (_, slot) => {
    const angle = slot * Math.PI * 2 / count;
    const point = { x: target.x + Math.cos(angle) * radius, y: target.y + Math.sin(angle) * radius, slot };
    // Approach the near side; never run behind an enemy to claim a free slot.
    const nearSide = (point.x - target.x) * (unit.x - target.x) + (point.y - target.y) * (unit.y - target.y) >= -0.001;
    const valid = point.x >= MARGIN && point.x <= 342 && point.y >= MARGIN && point.y <= 542 && laneContains(unit, point.x) && nearSide;
    const crowd = occupied.reduce((sum, other) => sum + Math.max(0, UNIT_SPACING - Math.hypot(point.x - other.attackPosition.x, point.y - other.attackPosition.y)) * 20, 0);
    const travel = Math.hypot(point.x - unit.x, point.y - unit.y);
    const stability = unit.targetId === target.id && unit.attackSlot === slot ? -12 : 0;
    return { ...point, score: valid ? travel + crowd + stability : Infinity };
  });
  const point = candidates.sort((a, b) => a.score - b.score)[0];
  unit.targetId = target.id;
  unit.attackSlot = point.slot;
  unit.attackPosition = Number.isFinite(point.score) ? { x: point.x, y: point.y } : { x: target.x, y: target.y };
  if (!laneContains(unit, unit.attackPosition.x)) unit.attackPosition.x = 180;
  return unit.attackPosition;
}

export function separateUnits(game, dtMs) {
  if (dtMs <= 0) return;
  const units = game.units.filter(unit => unit.hp > 0);
  // Several small, bounded corrections resolve crowds without launching units.
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 0; i < units.length; i++) for (let j = i + 1; j < units.length; j++) {
      const a = units[i], b = units[j];
      let dx = b.x - a.x, dy = b.y - a.y;
      const gap = Math.hypot(dx, dy);
      if (gap >= UNIT_SPACING) continue;
      if (gap < 0.001) {
        const angle = (i * 7 + j * 11) * 2.399963;
        dx = Math.cos(angle); dy = Math.sin(angle);
      }
      const norm = Math.hypot(dx, dy);
      const push = Math.min((UNIT_SPACING - gap) / 2, 30 * dtMs / 1000);
      a.x = clamp(a.x - dx / norm * push, 360);
      a.y = clamp(a.y - dy / norm * push, 560);
      b.x = clamp(b.x + dx / norm * push, 360);
      b.y = clamp(b.y + dy / norm * push, 560);
      clampToLane(a); clampToLane(b);
    }
    for (const unit of units) for (const tower of game.towers) {
      if (tower.hp <= 0) continue;
      const dx = unit.x - tower.x, dy = unit.y - tower.y;
      const gap = Math.hypot(dx, dy);
      if (gap >= 28) continue;
      const norm = gap || 1;
      unit.x = clamp(tower.x + (gap ? dx / norm : 1) * 28, 360);
      unit.y = clamp(tower.y + dy / norm * 28, 560);
      clampToLane(unit);
    }
  }
}
