// Procedural combat visuals. No damage or game state is applied while drawing.
export function drawTowerSpell(ctx, id, ms, { casterX, casterY, x, y, color = '#22d3ee', reducedMotion = false }) {
  const duration = id === 'operator-bastion' ? 1100 : 650;
  if (ms < 0 || ms >= duration) return;
  const t = ms / duration;
  ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color;
  ctx.globalAlpha = (1 - t) * 0.8; ctx.lineWidth = 2;
  if (reducedMotion) {
    ctx.strokeRect(x - 6, y - 6, 12, 12);
  } else if (id === 'operator-bastion') {
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.ellipse(casterX, casterY, 12 + t * 50 + i * 6, 6 + t * 25 + i * 3, 0, 0, Math.PI * 2); ctx.stroke();
    }
  } else {
    const p = Math.min(1, t * 3), px = casterX + (x - casterX) * p, py = casterY + (y - casterY) * p;
    ctx.beginPath(); ctx.moveTo(casterX, casterY); ctx.lineTo(px, py); ctx.stroke();
    if (id === 'operator-core') {
      ctx.beginPath(); ctx.arc(px, py, 4 + Math.sin(t * Math.PI) * 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(casterX, casterY, 9, 4, 0, 0, Math.PI * 2); ctx.stroke();
    } else {
      ctx.fillRect(px - 3, py - 3, 6, 6);
    }
    if (p >= 1) { ctx.beginPath(); ctx.arc(x, y, 4 + t * 15, 0, Math.PI * 2); ctx.stroke(); }
  }
  ctx.restore();
}
