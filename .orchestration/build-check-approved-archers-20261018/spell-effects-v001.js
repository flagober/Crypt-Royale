// Visual candidates only: drawing never applies damage, healing or movement.
export function drawSpell(ctx, effect, elapsedMs, { x = 220, y = 120, reducedMotion = false } = {}) {
  const t = Math.max(0, Math.min(1, elapsedMs / 900));
  if (t >= 1) return;
  ctx.save();
  ctx.strokeStyle = effect.color; ctx.fillStyle = effect.color;
  ctx.globalAlpha = (1 - t) * 0.9;
  ctx.lineWidth = 2;
  if (reducedMotion) { ctx.strokeRect(x - 12, y - 12, 24, 24); ctx.restore(); return; }
  const radius = 8 + t * 45;
  switch (effect.kind) {
    case 'beam':
      ctx.beginPath(); ctx.moveTo(70, y);
      for (let i = 1; i <= 8; i++) ctx.lineTo(70 + (x - 70) * i / 8, y + (i === 8 ? 0 : Math.sin(i * 13 + t * 18) * 7));
      ctx.stroke(); break;
    case 'heal':
      for (let i = 0; i < 4; i++) { const px = x + (i - 1.5) * 16, py = y + 25 - t * 55;
        ctx.fillRect(px - 2, py - 7, 4, 14); ctx.fillRect(px - 7, py - 2, 14, 4); }
      break;
    case 'slash':
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(x + i * 8, y, radius, radius * 0.35, -0.7, 0.2, Math.PI * 1.1); ctx.stroke(); }
      break;
    case 'shield':
      ctx.beginPath(); for (let i = 0; i <= 6; i++) { const a = i * Math.PI / 3; ctx.lineTo(x + Math.cos(a) * radius, y + Math.sin(a) * radius); } ctx.stroke();
      break;
    case 'ghost':
      for (let i = 0; i < 7; i++) ctx.fillRect(x - radius + i * 13, y + Math.sin(i + t * 10) * 20, 12, 3);
      break;
    default:
      ctx.beginPath(); ctx.ellipse(x, y, radius, effect.kind === 'ground' ? radius * 0.35 : radius, 0, 0, Math.PI * 2); ctx.stroke();
  }
  if (effect.kind !== 'heal') for (let i = 0; i < 8; i++) { const angle = i * Math.PI / 4;
    ctx.fillRect(x + Math.cos(angle) * radius - 2, y + Math.sin(angle) * radius - 2, 4, 4); }
  ctx.restore();
}
