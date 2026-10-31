import { CARDS, CARD_BY_ID } from './cards.js';
import {DEFAULT_MAP_ID,mapById} from './maps.js';
import {battleCard} from './progression-engine.js';
import { towerCanEngage } from './tower-targeting.js';
import {towerFacing,turnTower,towerLayout,towerMuzzle,TOWER_ART_TIMING} from './tower-animation.js';
import { updateAutomatic } from './automatic.js';
import { attackPosition, separateUnits, UNIT_SPACING, laneContains, clampToLane } from './positioning.js';
import { notifyTowerHit, notifyTowerDestroyed, resetOperatorRingVFX, tickRingVFX } from './vfx-operator-ring.js';
import { notifyTowerDestroyedVFX, resetTowerDestructionVFX, tickTowerDestructionVFX } from './vfx-tower-destruction.js';
import { abilityState, canTarget, tickAbility, effectiveSpeed, onAcquireTarget, performAbilityAttack, incomingMultiplier, onUnitDefeated, emitBattleEffect, tickCorrosion } from './abilities.js';

export const ARENA = Object.freeze({ width: 360, height: 560, riverTop: 265, riverBottom: 295 });
export const MATCH_DURATION_MS = 180_000;
export const OPERATOR_BASTION_DURATION_MS = 15_000;
const ENERGY_PER_SECOND = 1 / 2.8;

function tower(id, team, type, x, y, hp) {
  return { id, team, type, x, y, hp, maxHp: hp, shield: 0, attackLeftMs: 0, appearance:team==='player'?'male':'female',facing:'front',aimAngle:null,aimTarget:null,lastAttackAt:null,attackSerial:0,windingUp:false };
}

export function createGame(seed = 0x43525950,mapId = DEFAULT_MAP_ID) {
  resetOperatorRingVFX();
  resetTowerDestructionVFX();
  return {
    seed: seed >>> 0,
    mapId: mapById(mapId).id,
    nowMs: 0,
    remainingMs: MATCH_DURATION_MS,
    status: 'playing',
    winner: null,
    activityStats: { cardsUsed: {}, towerDamage: 0, automaticUsed: false },
    nextUnitId: 1,
    playerEnergy: 5,
    enemyEnergy: 5,
    playerHand: CARDS.slice(0, 4).map((card) => card.id),
    playerQueue: CARDS.slice(4).map((card) => card.id),
    units: [],
    effects: [],
    zones: [],
    corrosionContacts: {},
    towers: [
      tower('enemy-left', 'enemy', 'guard', 58, 92, 1800),
      tower('enemy-core', 'enemy', 'core', 180, 58, 2800),
      tower('enemy-right', 'enemy', 'guard', 302, 92, 1800),
      tower('player-left', 'player', 'guard', 58, 496, 1800),
      tower('player-core', 'player', 'core', 180, 530, 2800),
      tower('player-right', 'player', 'guard', 302, 496, 1800),
    ],
    enemyThinkMs: 1700,
    operatorCooldownMs: 0,
    operatorBastionMs: 0,
    automaticEnabled: false,
    automaticThinkMs: 0,
    message: 'Escolha uma carta e toque na sua metade da arena.',
  };
}

function random(game) {
  game.seed = (Math.imul(game.seed, 1664525) + 1013904223) >>> 0;
  return game.seed / 4294967296;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function livingTowers(game, team) {
  return game.towers.filter((item) => item.team === team && item.hp > 0);
}

function damageEntity(game, target, amount, attackerTeam, attacker) {
  const hpBefore = target.hp;
  amount *= incomingMultiplier(game, target, attacker);
  const absorbed = Math.min(target.shield || 0, amount);
  target.shield = Math.max(0, (target.shield || 0) - absorbed);
  target.hp = Math.max(0, target.hp - (amount - absorbed));
  if (!target.type && hpBefore > 0 && target.hp <= 0) onUnitDefeated(game, target);

  if (target.type && target.team === 'enemy' && attackerTeam === 'player') game.activityStats.towerDamage += hpBefore - target.hp;

  if (target.type) {
    notifyTowerHit(target.id);
    if (hpBefore > 0 && target.hp <= 0) {
      notifyTowerDestroyed(target.id);
      notifyTowerDestroyedVFX(target.id, target.type, target.team);
    }
  }
}

function addUnit(game, card, team, x, y, index) {
  const spread = (index - (card.count - 1) / 2) * UNIT_SPACING;
  game.units.push({
    id: `unit-${game.nextUnitId++}`,
    cardId: card.id,
    level:card.level||1,
    form:card.form||0,
    team,
    lane: x <= ARENA.width / 2 ? 'left' : 'right',
    x: Math.max(18, Math.min(ARENA.width - 18, x + spread)),
    y,
    hp: card.hp,
    maxHp: card.hp,
    shield: 0,
    damage: card.damage,
    speed: card.speed,
    range: card.range,
    attackMs: card.attackMs,
    attackLeftMs: 0,
    color: card.color,
    glyph: card.glyph,
    facing: team === 'player' ? 'up' : 'down',
    isMoving: false,
    animationMs: 0,
  });
}

export function deployCard(game, cardId, x, y, team = 'player') {
  if (game.status !== 'playing') return { ok: false, reason: 'A partida terminou.' };
  const base = CARD_BY_ID[cardId];
  const card = base&&battleCard(game,base,team);
  if (!card) return { ok: false, reason: 'Carta inválida.' };

  const isPlayer = team === 'player';
  if (isPlayer && (y < ARENA.riverBottom + 12 || y > ARENA.height - 38)) {
    return { ok: false, reason: 'Posicione a tropa na metade azul da arena.' };
  }
  if (!isPlayer && (y > ARENA.riverTop - 12 || y < 38)) {
    return { ok: false, reason: 'Posição inimiga inválida.' };
  }

  const energyKey = isPlayer ? 'playerEnergy' : 'enemyEnergy';
  if (game[energyKey] + 0.0001 < card.cost) {
    return { ok: false, reason: 'Energia insuficiente.' };
  }

  game[energyKey] -= card.cost;
  for (let index = 0; index < card.count; index++) addUnit(game, card, team, x, y, index);

  if (isPlayer) {
    game.activityStats.cardsUsed[cardId] = (game.activityStats.cardsUsed[cardId] || 0) + 1;
    const handIndex = game.playerHand.indexOf(cardId);
    if (handIndex >= 0) {
      const replacement = game.playerQueue.shift();
      game.playerQueue.push(cardId);
      game.playerHand[handIndex] = replacement;
    }
    game.message = `${card.name} entrou na arena.`;
  }

  return { ok: true };
}

export function activateOperator(game) {
  if (game.status !== 'playing') return false;
  if (game.operatorCooldownMs > 0) return false;

  for (const unit of game.units) {
    if (unit.team === 'player' && unit.hp > 0) unit.shield += 120;
  }
  for (const item of livingTowers(game, 'player')) item.shield += 180;
  game.operatorCooldownMs = OPERATOR_BASTION_DURATION_MS;
  game.operatorBastionMs = OPERATOR_BASTION_DURATION_MS;
  const core = game.towers.find(t => t.team === 'player' && t.type === 'core' && t.hp > 0);
  if (core) emitBattleEffect(game, 'operator-bastion', core);
  game.message = 'Bastião do Operador: escudo aplicado ao exército azul.';
  return true;
}

function chooseTarget(game, actor) {
  const opponent = actor.team === 'player' ? 'enemy' : 'player';
  if (actor.cardId === 'cache-crow' && abilityState(actor).rememberUntil > game.nowMs) {
    const remembered = game.units.find(u => u.id === actor.targetId && u.hp > 0 && u.team === opponent && laneContains(actor, u.x) && canTarget(game, actor, u) && distance(actor, u) <= 115);
    if (remembered) return remembered;
  }
  const nearbyUnit = CARD_BY_ID[actor.cardId]?.targetPolicy === 'structures' ? null : game.units
    .filter((unit) => unit.team === opponent && unit.hp > 0 && laneContains(actor, unit.x) && canTarget(game, actor, unit))
    .map((unit) => ({ entity: unit, distance: distance(actor, unit) }))
    .filter((entry) => entry.distance <= 95)
    .sort((a, b) => a.distance - b.distance)[0];
  if (nearbyUnit) return nearbyUnit.entity;

  return livingTowers(game, opponent)
    .filter(item => laneContains(actor, item.x))
    .map((item) => ({ entity: item, distance: distance(actor, item) }))
    .sort((a, b) => a.distance - b.distance)[0]?.entity ?? null;
}

function updateUnit(game, unit, dtMs) {
  if (unit.hp <= 0) return;
  unit.isMoving = false;
  unit.attackLeftMs = Math.max(0, unit.attackLeftMs - dtMs);
  if (!tickAbility(game, unit)) return;
  const target = chooseTarget(game, unit);
  if (!target) return;
  onAcquireTarget(game, unit, target);
  const gap = distance(unit, target);
  const position = attackPosition(game, unit, target);
  const approachGap = distance(unit, position);

  const attackReach = target.type ? unit.range + 19 : Math.max(UNIT_SPACING + 1, unit.range + 10);
  if (gap <= attackReach) {
    if (unit.attackLeftMs <= 0) {
      performAbilityAttack(game, unit, target, damageEntity);
      emitBattleEffect(game, 'basic-hit', unit, target);
      unit.attackLeftMs = unit.attackMs;
    }
    const dx = target.x - unit.x, dy = target.y - unit.y;
    if (Math.abs(dx) > Math.abs(dy)) unit.facing = dx < 0 ? 'left' : 'right';
    else unit.facing = dy < 0 ? 'up' : 'down';
    return;
  }

  if (approachGap <= 0.01) return;
  const step = Math.min(approachGap, effectiveSpeed(game, unit) * (dtMs / 1000));
  abilityState(unit).walked += step;
  const deltaX = ((position.x - unit.x) / approachGap) * step;
  const deltaY = ((position.y - unit.y) / approachGap) * step;
  unit.x += deltaX;
  unit.y += deltaY;
  clampToLane(unit);
  unit.isMoving = step > 0.01;
  if (unit.isMoving) {
    unit.animationMs += dtMs;
    if (Math.abs(deltaX) > Math.abs(deltaY)) unit.facing = deltaX < 0 ? 'left' : 'right';
    else unit.facing = deltaY < 0 ? 'up' : 'down';
  }
}

function updateTower(game, item, dtMs) {
  if (item.hp <= 0) return;
  item.attackLeftMs = Math.max(0, item.attackLeftMs - dtMs);
  const target = game.units
    .filter((unit) => towerCanEngage(item, unit, ARENA) && canTarget(game, item, unit))
    .sort((a, b) => distance(item, a) - distance(item, b))[0];
  item.aimTarget=target?{id:target.id,x:target.x,y:target.y}:null;
  item.windingUp=!!target&&item.attackLeftMs>0&&item.attackLeftMs<=TOWER_ART_TIMING.windup;
  let angle;
  if(target){
    if(item.type==='core'){
      const age=item.lastAttackAt==null?Infinity:game.nowMs-item.lastAttackAt;
      if(age>=TOWER_ART_TIMING.strike)item.facing=towerFacing(item,target);
    }else{
      const mount=towerLayout(item).mount;angle=Math.atan2(target.y-mount.y,target.x-mount.x);
      item.aimAngle=item.aimAngle==null?angle:turnTower(item.aimAngle,angle,dtMs*0.004);
    }
  }
  if (target && item.attackLeftMs <= 0) {
    if(item.type==='core')item.facing=towerFacing(item,target);
    else item.aimAngle=angle; // Aim metadata at the existing damage instant.
    item.lastAttackAt=game.nowMs;item.attackSerial++;item.windingUp=false;
    damageEntity(game, target, item.combatDamage ?? (item.type === 'core' ? 72 : 54), item.team, item);
    emitBattleEffect(game, item.type === 'core' ? 'operator-core' : 'guard-tower', item, target);
    const muzzle=towerMuzzle(item);
    Object.assign(game.effects.at(-1),{projectile:item.type==='guard'?'arrow':null,casterX:muzzle.x,casterY:muzzle.y,towerId:item.id,attackSerial:item.attackSerial,color:item.type==='core'&&item.appearance==='female'?'#b8a3ef':item.team==='player'?'#22d3ee':'#fb7185'});
    item.attackLeftMs = item.type === 'core' ? 850 : 1000;
  }
}

function enemyTurn(game) {
  const affordable = CARDS.filter((card) => card.cost <= game.enemyEnergy + 0.0001);
  if (!affordable.length) {
    game.enemyThinkMs = 500;
    return;
  }
  const card = affordable[Math.floor(random(game) * affordable.length)];
  const x = random(game) < 0.5 ? 92 : 268;
  deployCard(game, card.id, x, 190 + random(game) * 42, 'enemy');
  game.enemyThinkMs = 1800 + random(game) * 1700;
}

function crownScore(game, team) {
  const opponent = team === 'player' ? 'enemy' : 'player';
  return game.towers.filter((item) => item.team === opponent && item.hp <= 0).length;
}

function finishByScore(game) {
  const playerCore = game.towers.find((item) => item.id === 'player-core');
  const enemyCore = game.towers.find((item) => item.id === 'enemy-core');
  if (playerCore.hp <= 0 || enemyCore.hp <= 0) {
    game.winner = enemyCore.hp <= 0 ? 'player' : 'enemy';
  } else {
    const playerCrowns = crownScore(game, 'player');
    const enemyCrowns = crownScore(game, 'enemy');
    if (playerCrowns !== enemyCrowns) game.winner = playerCrowns > enemyCrowns ? 'player' : 'enemy';
    else {
      const playerHp = livingTowers(game, 'player').reduce((sum, item) => sum + item.hp, 0);
      const enemyHp = livingTowers(game, 'enemy').reduce((sum, item) => sum + item.hp, 0);
      game.winner = playerHp === enemyHp ? 'draw' : playerHp > enemyHp ? 'player' : 'enemy';
    }
  }
  game.status = 'finished';
  game.message = game.winner === 'player' ? 'Vitória em Vila Byte!' : game.winner === 'enemy' ? 'A defesa inimiga venceu.' : 'Empate técnico.';
}

export function stepGame(game, dtMs) {
  const dt = Math.min(100, Math.max(0, dtMs));
  if (game.status === 'playing' && game.automaticEnabled) game.activityStats.automaticUsed = true;

  if (game.status === 'playing' && game.operatorBastionMs > 0) {
    game.operatorBastionMs = Math.max(0, game.operatorBastionMs - dt);
    if (game.operatorBastionMs === 0) {
      for (const unit of game.units) {
        if (unit.team === 'player') unit.shield = 0;
      }
      for (const item of game.towers) {
        if (item.team === 'player') item.shield = 0;
      }
      game.message = 'Bastião do Operador encerrado.';
    }
  }

  tickRingVFX(dt, game.towers);
  tickTowerDestructionVFX(dt, game.towers);
  if (game.status !== 'playing') return game;
  game.nowMs += dt;
  game.effects = (game.effects ?? []).filter(effect => game.nowMs - effect.start < 1200);
  tickCorrosion(game, dt, damageEntity);
  game.zones = (game.zones ?? []).filter(zone => zone.expires > game.nowMs);
  game.remainingMs = Math.max(0, MATCH_DURATION_MS - game.nowMs);
  game.playerEnergy = Math.min(10, game.playerEnergy + ENERGY_PER_SECOND * (dt / 1000));
  game.enemyEnergy = Math.min(10, game.enemyEnergy + ENERGY_PER_SECOND * (dt / 1000));
  game.operatorCooldownMs = Math.max(0, game.operatorCooldownMs - dt);
  game.enemyThinkMs -= dt;
  if (game.enemyThinkMs <= 0) enemyTurn(game);

  for (const unit of game.units) updateUnit(game, unit, dt);
  separateUnits(game, dt);
  for (const item of game.towers) updateTower(game, item, dt);
  game.units = game.units.filter((unit) => unit.hp > 0);

  const coreDestroyed = game.towers.some((item) => item.type === 'core' && item.hp <= 0);
  if (coreDestroyed || game.remainingMs <= 0) finishByScore(game);
  updateAutomatic(game, dt, { deployCard, activateOperator });
  return game;
}

export function getHud(game) {
  return {
    automaticEnabled: game.automaticEnabled,
    energy: game.playerEnergy,
    hand: [...game.playerHand],
    nextCard: game.playerQueue[0],
    remainingMs: game.remainingMs,
    status: game.status,
    winner: game.winner,
    message: game.message,
    operatorCooldownMs: game.operatorCooldownMs,
    operatorBastionMs: game.operatorBastionMs,
    playerCrowns: crownScore(game, 'player'),
    enemyCrowns: crownScore(game, 'enemy'),
  };
}



