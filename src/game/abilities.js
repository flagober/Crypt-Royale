import { CARD_BY_ID } from './cards.js';
import { clampToLane, laneContains } from './positioning.js';

const gap = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const airborne = unit => ['cache-crow', 'fiber-finch'].includes(unit.cardId);
export const CORROSION = Object.freeze({ durationMs: 3000, intervalMs: 500, damage: 8, radius: 28 });
export function abilityState(unit) {
  return unit.ability ??= { shots: 0, shotTarget: null, firstHit: false, walked: 0, nextHeal: 4000, nextPulse: 0, nextKnock: 0, lastAttack: 0, lastHurt: -Infinity, revealedUntil: 0, speedUntil: 0, nextRescue: 0, born: null };
}
export function emitBattleEffect(game, id, caster, target = caster) {
  game.effects ??= [];
  if (game.effects.length >= 96) game.effects.shift();
  game.effects.push({ id, start: game.nowMs, team: caster.team, color: CARD_BY_ID[id]?.color ?? (caster.team === 'player' ? '#22d3ee' : '#fb7185'), casterX: caster.x, casterY: caster.y - 18, x: target.x, y: target.y - 18 });
}
export function onUnitDefeated(game, unit) {
  if (unit.cardId !== 'code-slime') return;
  game.zones ??= [];
  if (game.zones.length >= 32) game.zones.shift();
  game.zones.push({ x: unit.x, y: unit.y, team: unit.team, createdAt: game.nowMs, expires: game.nowMs + CORROSION.durationMs });
  emitBattleEffect(game, unit.cardId, unit);
}
// One contact clock per victim, regardless of how many pools overlap.
// Check the positions at the start of this simulation slice; expiry can fall within it.
export function tickCorrosion(game, dtMs, damage) {
  game.corrosionContacts ??= {};
  const active = new Set();
  for (const unit of game.units) {
    if (unit.hp <= 0 || unit.type || airborne(unit)) continue;
    const pools = (game.zones ?? []).filter(z => z.team !== unit.team && z.createdAt <= game.nowMs && z.expires >= game.nowMs - dtMs && gap(z, unit) <= CORROSION.radius);
    if (!pools.length) continue;
    active.add(unit.id);
    const start = Math.max(game.nowMs - dtMs, Math.min(...pools.map(z => z.createdAt)));
    const end = Math.min(game.nowMs, Math.max(...pools.map(z => z.expires)));
    const contact = game.corrosionContacts[unit.id] ??= { nextTick: start + CORROSION.intervalMs };
    while (contact.nextTick <= end && unit.hp > 0) {
      const hpBefore = unit.hp;
      damage(game, unit, CORROSION.damage, pools[0].team);
      if (unit.hp < hpBefore) {
        unit.corrosionFlashUntil = game.nowMs + 350;
        emitBattleEffect(game, 'corrosion-hit', unit);
        Object.assign(game.effects.at(-1), { targetId: unit.id, amount: hpBefore - unit.hp, color: '#4ade80' });
      }
      contact.nextTick += CORROSION.intervalMs;
    }
  }
  for (const id of Object.keys(game.corrosionContacts)) if (!active.has(id)) delete game.corrosionContacts[id];
}
export function incomingMultiplier(game, target, attacker) {
  if (target.type) return 1;
  const state = abilityState(target);
  state.lastHurt = game.nowMs;
  state.camouflaged = false;
  let factor = 1;
  if (game.units.some(u => u !== target && u.hp > 0 && u.team === target.team && u.cardId === 'buffer-bison' && gap(u, target) <= 40)) factor *= 0.88;
  if (target.cardId === 'socket-crab' && !target.isMoving && target.targetId && attacker) {
    const front = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[target.facing] ?? [0, 1];
    if ((attacker.x - target.x) * front[0] + (attacker.y - target.y) * front[1] > 0) factor *= 0.85;
  }
  return factor;
}
export function canTarget(game, actor, unit) {
  const s = abilityState(unit);
  return actor.cardId === 'fiber-finch' || !s.camouflaged || s.revealedUntil > game.nowMs || gap(actor, unit) <= 24;
}
export function tickAbility(game, unit) {
  const s = abilityState(unit);
  if (s.born === null) {
    s.born = game.nowMs;
    s.lastAttack = game.nowMs;
    s.nextHeal = game.nowMs + 4000;
    if (['copper-mole', 'buffer-bison'].includes(unit.cardId)) emitBattleEffect(game, unit.cardId, unit);
  }
  if (unit.cardId === 'copper-mole' && game.nowMs - s.born < 1200) {
    unit.isMoving = false;
    return false;
  }
  if (unit.cardId === 'copper-mole' && !s.emerged) {
    s.emerged = true;
    unit.y = Math.max(18, Math.min(542, unit.y + (unit.team === 'player' ? -18 : 18)));
    emitBattleEffect(game, unit.cardId, unit);
  }
  if (unit.cardId === 'patch-toad' && game.nowMs >= s.nextHeal) {
    s.nextHeal = game.nowMs + 4000;
    const ally = game.units.filter(u => u !== unit && u.hp > 0 && u.team === unit.team && u.hp < u.maxHp && gap(u, unit) <= 70)
      .sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
    if (ally) { ally.hp = Math.min(ally.maxHp, ally.hp + 45); emitBattleEffect(game, unit.cardId, unit, ally); }
  }
  if (unit.cardId === 'packet-fox') {
    const hidden = game.nowMs - Math.max(s.lastAttack, s.lastHurt) >= 2000 && s.revealedUntil <= game.nowMs;
    if (hidden && !s.camouflaged) emitBattleEffect(game, unit.cardId, unit);
    s.camouflaged = hidden;
  }
  if (['buffer-bison', 'socket-crab'].includes(unit.cardId) && game.nowMs >= s.nextPulse) {
    if (unit.cardId === 'buffer-bison' || unit.targetId) emitBattleEffect(game, unit.cardId, unit);
    s.nextPulse = game.nowMs + 1600;
  }
  if (unit.cardId === 'pixel-pup' && game.nowMs >= s.nextRescue && game.units.some(u => u !== unit && u.hp > 0 && u.team === unit.team && u.ability?.lastHurt > game.nowMs - 800 && gap(u, unit) <= 70)) {
    s.speedUntil = game.nowMs + 800; s.nextRescue = game.nowMs + 4000;
    emitBattleEffect(game, unit.cardId, unit);
  }
  return true;
}
export function effectiveSpeed(game, unit) {
  let factor = abilityState(unit).speedUntil > game.nowMs ? 1.2 : 1;
  if (unit.cardId === 'bit-bug' && game.units.some(u => u !== unit && u.hp > 0 && u.cardId === unit.cardId && u.team === unit.team && u.targetId && u.targetId === unit.targetId)) factor *= 1.1;
  if (!airborne(unit) && (game.zones ?? []).some(z => z.expires > game.nowMs && z.team !== unit.team && gap(z, unit) <= CORROSION.radius)) factor *= 0.85;
  return unit.speed * factor;
}
export function onAcquireTarget(game, unit, target) {
  const s = abilityState(unit);
  if (unit.cardId === 'cache-mantis' && !s.dashed && gap(unit, target) <= 100) {
    s.dashed = true;
    const d = gap(unit, target), step = Math.min(45, Math.max(0, d - 30));
    if (d > 0) { unit.x += (target.x - unit.x) / d * step; unit.y += (target.y - unit.y) / d * step; }
    unit.x = Math.max(18, Math.min(342, unit.x)); unit.y = Math.max(18, Math.min(542, unit.y)); clampToLane(unit);
    emitBattleEffect(game, unit.cardId, unit, target);
  }
}
export function performAbilityAttack(game, unit, target, damage) {
  const s = abilityState(unit);
  let amount = unit.damage, visual = false;
  if (unit.cardId === 'data-mouse') {
    s.shots = s.shotTarget === target.id ? s.shots + 1 : 1; s.shotTarget = target.id;
    if (s.shots % 3 === 0) { amount *= 1.2; visual = true; }
  }
  if (!s.firstHit) {
    if (unit.cardId === 'cache-mantis') { amount *= 1.3; visual = true; }
    if (unit.cardId === 'circuit-hare' && s.walked >= 60) { amount *= 1.25; visual = true; }
    if (unit.cardId === 'fiber-finch') {
      const other = abilityState(target); other.camouflaged = false; other.revealedUntil = game.nowMs + 2000; visual = true;
    }
  }
  if (unit.cardId === 'byte-boar' && target.type && !s.structureHit) { amount *= 1.2; s.structureHit = true; visual = true; }
  if (unit.cardId === 'packet-fox' && s.camouflaged) { amount *= 1.4; visual = true; }
  if (unit.cardId === 'bit-bug' && game.units.some(u => u !== unit && u.hp > 0 && u.team === unit.team && u.cardId === 'bit-bug' && u.targetId === target.id)) visual = true;
  if (unit.cardId === 'cache-crow') { s.rememberUntil = game.nowMs + 600; visual = true; }
  s.firstHit = true; s.camouflaged = false; s.lastAttack = game.nowMs;
  damage(game, target, amount, unit.team, unit);
  if (unit.cardId === 'logic-lizard') {
    const used = new Set([target.id]); let previous = target;
    for (const multiplier of [0.5, 0.25]) {
      const next = game.units.filter(u => u.hp > 0 && u.team !== unit.team && !used.has(u.id) && gap(u, previous) <= 45 && laneContains(unit, u.x) && canTarget(game, unit, u)).sort((a, b) => gap(a, previous) - gap(b, previous))[0];
      if (!next) break;
      emitBattleEffect(game, unit.cardId, previous, next); damage(game, next, unit.damage * multiplier, unit.team, unit); used.add(next.id); previous = next;
    }
    visual = true;
  }
  if (unit.cardId === 'kernel-goat' && game.nowMs >= s.nextKnock && !target.type && !airborne(target)) {
    s.nextKnock = game.nowMs + 5000;
    const d = gap(unit, target) || 1;
    target.x = Math.max(18, Math.min(342, target.x + (target.x - unit.x) / d * 10));
    target.y = Math.max(18, Math.min(542, target.y + (target.y - unit.y) / d * 10)); clampToLane(target); visual = true;
  }
  if (visual) emitBattleEffect(game, unit.cardId, unit, target);
}
