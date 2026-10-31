// Shared, DOM-independent frame selection for gameplay and animation previews.
export function spriteProfile(options = {}) {
  return {
    cellSize: 140, pivotX: 70, pivotY: 128,
    playback: [0, 1, 2, 1], idleColumn: 1,
    directionRows: { down: 0, right: 1, left: 2, up: 3 },
    offsetX: 0, offsetY: 0, frameDurationMs: 110, loop: true,
    ...options,
  };
}

export function selectSpriteFrame(profile, elapsedMs, moving, direction) {
  const sequence = profile.playback;
  if (!sequence.length || !Number.isFinite(profile.frameDurationMs) || profile.frameDurationMs <= 0) {
    throw new Error('Animation needs frames and a positive frame duration');
  }
  const tick = Math.floor(Math.max(0, elapsedMs) / profile.frameDurationMs);
  const index = profile.loop ? tick % sequence.length : Math.min(tick, sequence.length - 1);
  const column = moving ? sequence[index] : profile.idleColumn;
  const row = profile.directionRows[direction] ?? profile.directionRows.up ?? 0;
  return {
    column, row,
    x: profile.offsetX + column * profile.cellSize,
    y: profile.offsetY + row * profile.cellSize,
    size: profile.cellSize,
  };
}
