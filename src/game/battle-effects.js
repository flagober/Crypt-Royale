import { drawSpell } from './spell-art.js';
import { drawTowerSpell } from './tower-effects.js';

export function drawBattleEffects(ctx, game) {
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  for (const zone of game.zones ?? []) {
    ctx.save(); ctx.fillStyle = 'rgba(74,222,128,.24)';
    ctx.beginPath(); ctx.ellipse(zone.x, zone.y, 28, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(134,239,172,.65)'; ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const pulse = reducedMotion ? 0.5 : ((game.nowMs - (zone.createdAt ?? 0) + i * 137) % 650) / 650;
      ctx.beginPath(); ctx.arc(zone.x - 18 + i * 9, zone.y - 1 - Math.sin(i * 3) * 4 - pulse * 3, 1 + pulse * 2, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }
  for (const event of game.effects ?? []) {
    const ms = game.nowMs - event.start;
    if (ms < 0 || ms >= 1200) continue;
    if (event.id === 'corrosion-hit') {
      if (ms >= 400) continue;
      const target = game.units.find(u => u.id === event.targetId && u.hp > 0);
      const x = target?.x ?? event.x, y = target ? target.y - 18 : event.y;
      ctx.save(); ctx.globalAlpha = 1 - ms / 400; ctx.fillStyle = '#86efac'; ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(x, y, reducedMotion ? 16 : 12 + ms / 45, 18, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(`−${Number(event.amount.toFixed(1))}`, x, y - 25 - (reducedMotion ? 0 : ms / 35)); ctx.restore();
      continue;
    }
    if(event.projectile==='arrow'){
      if(ms>=350)continue;
      const dx=event.x-event.casterX,dy=event.y-event.casterY,length=Math.hypot(dx,dy)||1;
      const progress=reducedMotion?1:Math.min(1,ms/180),x=event.casterX+dx*progress,y=event.casterY+dy*progress;
      ctx.save();ctx.strokeStyle='#86efac';ctx.lineWidth=1.8;ctx.globalAlpha=1-ms/350;
      ctx.beginPath();ctx.moveTo(x-dx/length*10,y-dy/length*10);ctx.lineTo(x,y);
      ctx.lineTo(x-dx/length*4-dy/length*3,y-dy/length*4+dx/length*3);
      ctx.moveTo(x,y);ctx.lineTo(x-dx/length*4+dy/length*3,y-dy/length*4-dx/length*3);ctx.stroke();ctx.restore();continue;
    }
    const options = { ...event, allyX: event.x, allyY: event.y, reducedMotion };
    if (['operator-core', 'operator-bastion', 'guard-tower', 'basic-hit'].includes(event.id)) {
      drawTowerSpell(ctx, event.id, ms, options);
    } else {
      drawSpell(ctx, event, ms, options);
    }
  }
}

