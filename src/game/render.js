import { ARENA } from './engine.js';
import {drawMapGround,drawMapCrossing} from './map-art.js';
import { drawOperatorRing } from './vfx-operator-ring.js';
import { drawTowerDestructionVFX } from './vfx-tower-destruction.js';
import { spriteProfile, selectSpriteFrame } from './sprite-animation.js';
import { drawBattleEffects } from './battle-effects.js';
import {getTowerArt} from './tower-assets.js';
import {drawApprovedTower} from './tower-render.js';
import {EVOLUTION_ART,evolutionSpriteKey} from './evolution-art.js';
import {drawVipEntry} from './vip-effects.js';

const CORE_SPRITE = {
  image: new Image(),
  pivotX: 1085,
  pivotY: 1750,
  scale: 0.034,
};
CORE_SPRITE.image.src = '/assets/towers/cr_vila_byte_operator_core_master_v001.png';

const GUARD_SPRITE = {
  image: new Image(),
  pivotX: 1024,
  pivotY: 1980,
  scale: 0.03,
};
GUARD_SPRITE.image.src = '/assets/towers/cr_vila_byte_guard_tower_master_v001.png';
function createUnitSprite(src, { scale, frameDurationMs, healthOffset, animateWhileStationary = false, ...animation }) {
  const sprite = {
    image: new Image(),
    ...spriteProfile({ ...animation, frameDurationMs }),
    scale,
    frameDurationMs,
    healthOffset,
    animateWhileStationary,
  };
  sprite.image.src = src;
  return sprite;
}

const UNIT_SPRITES = {
  ...Object.fromEntries(Object.entries(EVOLUTION_ART.unitForms).map(([key,spec])=>[key,createUnitSprite(spec.file,spec)])),
  'cache-mantis': createUnitSprite('/assets/units/cache-mantis-spritesheet-v001.png', { scale: 0.5, frameDurationMs: 140, healthOffset: 64 }),
  'buffer-bison': createUnitSprite('/assets/units/buffer-bison-spritesheet-v001.png', { scale: 0.56, frameDurationMs: 160, healthOffset: 64 }),
  'packet-fox': createUnitSprite('/assets/units/packet-fox-spritesheet-v001.png', { scale: 0.48, frameDurationMs: 140, healthOffset: 60 }),
  'kernel-goat': createUnitSprite('/assets/units/kernel-goat-spritesheet-v001.png', { scale: 0.5, frameDurationMs: 140, healthOffset: 64 }),
  'logic-lizard': createUnitSprite('/assets/units/logic-lizard-spritesheet-v001.png', { scale: 0.46, frameDurationMs: 140, healthOffset: 56 }),
  'patch-toad': createUnitSprite('/assets/units/patch-toad-spritesheet-v001.png', { scale: 0.46, frameDurationMs: 140, healthOffset: 52 }),
  'fiber-finch': createUnitSprite('/assets/units/fiber-finch-spritesheet-v001.png', { scale: 0.4, frameDurationMs: 140, healthOffset: 51, animateWhileStationary: true }),
  'copper-mole': createUnitSprite('/assets/units/copper-mole-spritesheet-v001.png', { scale: 0.46, frameDurationMs: 140, healthOffset: 53 }),
  'socket-crab': createUnitSprite('/assets/units/socket-crab-spritesheet-v001.png', { scale: 0.48, frameDurationMs: 140, healthOffset: 49 }),
  'byte-boar': createUnitSprite('/assets/units/byte-boar-spritesheet-v001.png', { scale: 0.5, frameDurationMs: 140, healthOffset: 61 }),
  'cache-crow': createUnitSprite('/assets/units/cache-crow-spritesheet-v001.png', {
    scale: 0.45,
    frameDurationMs: 140,
    healthOffset: 55,
    animateWhileStationary: true,
  }),
  'bit-bug': createUnitSprite('/assets/units/bit-bug-spritesheet-v005.png', {
    scale: 0.42,
    frameDurationMs: 110,
    healthOffset: 38,
  }),
  'data-mouse': createUnitSprite('/assets/units/data-mouse-spritesheet-v002.png', {
    scale: 0.46,
    frameDurationMs: 160,
    healthOffset: 47,
  }),
  'code-slime': createUnitSprite('/assets/units/code-slime-spritesheet-v002.png', {
    scale: 0.44,
    frameDurationMs: 150,
    healthOffset: 43,
  }),
  'pixel-pup': createUnitSprite('/assets/units/pixel-pup-spritesheet-v002.png', {
    scale: 0.45,
    frameDurationMs: 140,
    healthOffset: 46,
  }),
  'circuit-hare': createUnitSprite('/assets/units/circuit-hare-spritesheet-v001.png', {
    scale: 0.45,
    frameDurationMs: 110,
    healthOffset: 57,
  }),
};

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

function drawHealth(ctx, entity, width, yOffset = 25) {
  const ratio = Math.max(0, entity.hp / entity.maxHp);
  ctx.fillStyle = 'rgba(2, 6, 23, .85)';
  ctx.fillRect(entity.x - width / 2, entity.y - yOffset, width, 5);
  ctx.fillStyle = entity.team === 'player' ? '#22d3ee' : '#fb7185';
  ctx.fillRect(entity.x - width / 2, entity.y - yOffset, width * ratio, 5);
  if (entity.shield > 0) {
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2;
    ctx.strokeRect(entity.x - width / 2 - 2, entity.y - yOffset - 2, width + 4, 9);
  }
}

function drawUnitSprite(ctx, unit, mobileScale, nowMs = 0) {
  const evolution=UNIT_SPRITES[evolutionSpriteKey(unit.cardId,unit.form)];
  const sprite=evolution?.image.complete&&evolution.image.naturalWidth>0?evolution:UNIT_SPRITES[unit.cardId];
  if (!sprite || !sprite.image.complete || sprite.image.naturalWidth === 0) return false;

  const frame = selectSpriteFrame(sprite, unit.animationMs, unit.isMoving || sprite.animateWhileStationary, unit.facing);
  const scale = sprite.scale * mobileScale;
  const drawSize = sprite.cellSize * scale;
  const drawX = Math.round(unit.x - sprite.pivotX * scale);
  const drawY = Math.round(unit.y - sprite.pivotY * scale);

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  if ((unit.corrosionFlashUntil ?? 0) > nowMs) ctx.filter = 'drop-shadow(0 0 5px #4ade80)';
  if (unit.ability?.camouflaged) ctx.globalAlpha = 0.4;
  if (unit.cardId === 'copper-mole' && unit.ability?.born !== null && unit.ability?.born !== undefined && unit.ability.born + 1200 > nowMs) ctx.globalAlpha = 0.5;
  // Atlas v001: the right-facing idle cell contains two detached neighbour fragments.
  // Clip only their measured rectangles; preserve the original artwork and pivot.
  if (unit.cardId === 'logic-lizard' && frame.row === 1 && frame.column === 1) {
    ctx.beginPath();
    ctx.rect(drawX, drawY, drawSize, drawSize);
    for (const [x, y, w, h] of [[13, 58, 8, 21], [121, 89, 7, 29]]) {
      ctx.rect(drawX + x * scale, drawY + y * scale, w * scale, h * scale);
    }
    ctx.clip('evenodd');
  }
  ctx.drawImage(
    sprite.image,
    frame.x,
    frame.y,
    sprite.cellSize,
    sprite.cellSize,
    drawX,
    drawY,
    drawSize,
    drawSize,
  );
  ctx.restore();
  return true;
}

export function renderGame(ctx, game, selectedCard) {
  if(!drawMapGround(ctx,game.mapId,ARENA)){
  const gradient = ctx.createLinearGradient(0, 0, 0, ARENA.height);
  gradient.addColorStop(0, '#3f1325');
  gradient.addColorStop(.48, '#172554');
  gradient.addColorStop(.52, '#164e63');
  gradient.addColorStop(1, '#082f49');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, ARENA.width, ARENA.height);

  ctx.strokeStyle = 'rgba(125, 211, 252, .09)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= ARENA.width; x += 30) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ARENA.height); ctx.stroke();
  }
  for (let y = 0; y <= ARENA.height; y += 28) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(ARENA.width, y); ctx.stroke();
  }

  }
  drawMapCrossing(ctx,game.mapId,ARENA);
  drawVipEntry(ctx,game);

  if (selectedCard) {
    ctx.fillStyle = 'rgba(34, 211, 238, .07)';
    ctx.fillRect(0, ARENA.riverBottom + 12, ARENA.width, ARENA.height - ARENA.riverBottom - 50);
    ctx.strokeStyle = 'rgba(34, 211, 238, .45)';
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(2, ARENA.riverBottom + 14, ARENA.width - 4, ARENA.height - ARENA.riverBottom - 54);
    ctx.setLineDash([]);
  }

  for (const item of game.towers) {
    if (item.hp <= 0) {
      drawTowerDestructionVFX(ctx, item, game.nowMs);
      if (item.type === 'core') drawOperatorRing(ctx, item, game.nowMs, item.shield > 0);
      continue;
    }

    const approvedLayout=drawApprovedTower(ctx,item,game.nowMs,getTowerArt());
    if(approvedLayout){
      if(item.type==='core')drawOperatorRing(ctx,{...item,y:approvedLayout.ground.y+46},game.nowMs,item.shield>0);
      const healthY=Math.max(6,approvedLayout.top-9);
      drawHealth(ctx,{...item,y:healthY+5},item.type==='core'?48:38,5);
      continue;
    }
    if (item.type === 'core' && CORE_SPRITE.image.complete && CORE_SPRITE.image.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      const drawSizeX = CORE_SPRITE.image.naturalWidth * CORE_SPRITE.scale;
      const drawSizeY = CORE_SPRITE.image.naturalHeight * CORE_SPRITE.scale;
      const drawX = Math.round(item.x - CORE_SPRITE.pivotX * CORE_SPRITE.scale);
      const drawY = Math.round(item.y - CORE_SPRITE.pivotY * CORE_SPRITE.scale);
      
      ctx.drawImage(CORE_SPRITE.image, drawX, drawY, drawSizeX, drawSizeY);
      ctx.restore();

      drawOperatorRing(ctx, item, game.nowMs, item.shield > 0);
      
      drawHealth(ctx, item, 48);
      continue;
    }

    if (item.type === 'guard' && GUARD_SPRITE.image.complete && GUARD_SPRITE.image.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(item.x, item.y, 22, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = item.team === 'player' ? 'rgba(34, 211, 238, 0.4)' : 'rgba(251, 113, 133, 0.4)';
      ctx.fill();

      ctx.imageSmoothingEnabled = true;
      const drawSizeX = GUARD_SPRITE.image.naturalWidth * GUARD_SPRITE.scale;
      const drawSizeY = GUARD_SPRITE.image.naturalHeight * GUARD_SPRITE.scale;
      const drawX = Math.round(item.x - GUARD_SPRITE.pivotX * GUARD_SPRITE.scale);
      const drawY = Math.round(item.y - GUARD_SPRITE.pivotY * GUARD_SPRITE.scale);
      
      ctx.drawImage(GUARD_SPRITE.image, drawX, drawY, drawSizeX, drawSizeY);
      ctx.restore();

      drawHealth(ctx, item, 38, 52);
      continue;
    }

    const size = item.type === 'core' ? 48 : 38;
    ctx.fillStyle = item.team === 'player' ? '#0e7490' : '#9f1239';
    ctx.strokeStyle = item.team === 'player' ? '#67e8f9' : '#fda4af';
    ctx.lineWidth = 2;
    roundedRect(ctx, item.x - size / 2, item.y - size / 2, size, size, 9);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = `700 ${item.type === 'core' ? 18 : 13}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.type === 'core' ? 'O' : 'T', item.x, item.y);
    drawHealth(ctx, item, size);
  }

  const isMobile = window.innerWidth <= 767;
  const troopScale = isMobile ? 1.15 : 1;

  for (const unit of game.units) {
    ctx.beginPath();
    ctx.ellipse(unit.x, unit.y - 1, 14 * troopScale, 5 * troopScale, 0, 0, Math.PI * 2);
    ctx.fillStyle = unit.team === 'player' ? 'rgba(34, 211, 238, .24)' : 'rgba(251, 113, 133, .28)';
    ctx.fill();

    const spriteWasDrawn = drawUnitSprite(ctx, unit, troopScale, game.nowMs);
    if (!spriteWasDrawn) {
      ctx.beginPath();
      ctx.arc(unit.x, unit.y, 11 * troopScale, 0, Math.PI * 2);
      ctx.fillStyle = unit.color;
      ctx.fill();
      ctx.strokeStyle = unit.team === 'player' ? '#cffafe' : '#fecdd3';
      ctx.lineWidth = 2 * troopScale;
      ctx.stroke();
      ctx.fillStyle = '#020617';
      ctx.font = `800 ${7 * troopScale}px system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(unit.glyph, unit.x, unit.y + .5 * troopScale);
    }
    
    // Scale health bar width and offset it slightly higher if scaled
    const healthWidth = 24 * troopScale;
    const healthY = unit.y - (UNIT_SPRITES[unit.cardId]?.healthOffset ?? 25) * troopScale;
    const ratio = Math.max(0, unit.hp / unit.maxHp);
    ctx.fillStyle = 'rgba(2, 6, 23, .85)';
    ctx.fillRect(unit.x - healthWidth / 2, healthY, healthWidth, 5 * troopScale);
    ctx.fillStyle = unit.team === 'player' ? '#22d3ee' : '#fb7185';
    ctx.fillRect(unit.x - healthWidth / 2, healthY, healthWidth * ratio, 5 * troopScale);
    if (unit.shield > 0) {
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2 * troopScale;
      ctx.strokeRect(unit.x - healthWidth / 2 - 2 * troopScale, healthY - 2 * troopScale, healthWidth + 4 * troopScale, 9 * troopScale);
    }
  }
  drawBattleEffects(ctx, game);
}









