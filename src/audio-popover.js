// Fixed-position portal coordinates bounded by the visible browser viewport.
export function computePopoverPosition(anchor, viewport) {
  const margin = 8, gap = 4;
  const width = Math.max(1, viewport.innerWidth || 320);
  const height = Math.max(1, viewport.innerHeight || 480);
  const panelWidth = Math.max(1, Math.min(288, width - margin * 2));
  const below = Math.max(0, height - anchor.bottom - gap - margin);
  const above = Math.max(0, anchor.top - gap - margin);
  const placement = below >= 160 || below >= above ? 'below' : 'above';
  const available = placement === 'below' ? below : above;
  const maxHeight = Math.max(1, Math.min(370, available || height - margin * 2));
  const desiredTop = placement === 'below' ? anchor.bottom + gap : anchor.top - gap - maxHeight;
  const top = Math.max(margin, Math.min(desiredTop, height - margin - maxHeight));
  const left = Math.max(margin, Math.min(anchor.right - panelWidth, width - margin - panelWidth));
  return {top, left, maxHeight, panelWidth, placement};
}
