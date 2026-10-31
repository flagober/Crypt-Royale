export function wrapAngle(angle) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}
export function turnTowards(current, desired, maxStep) {
  const delta = wrapAngle(desired - current);
  return wrapAngle(current + Math.sign(delta) * Math.min(Math.abs(delta), Math.max(0, maxStep)));
}
export function facingFor(targetX, originX, current = 'right', deadZone = 12) {
  const dx = targetX - originX;
  return dx > deadZone ? 'right' : dx < -deadZone ? 'left' : current;
}
export function facingForTarget(target,origin,current='front') {
  const dx=target.x-origin.x,dy=target.y-origin.y;
  const frontWidth=Math.max(20,Math.abs(dy)*0.55)+(current==='front'?12:0);
  return Math.abs(dx)<=frontWidth?'front':facingFor(target.x,origin.x,current);
}
export function transformedPoint(origin, angle, offset) {
  return {x:origin.x + Math.cos(angle)*offset.x - Math.sin(angle)*offset.y,
    y:origin.y + Math.sin(angle)*offset.x + Math.cos(angle)*offset.y};
}
export function targetAt(mode, elapsed, width, height, pointer = {x:0.75,y:0.58}) {
  const fraction = mode === 'left' ? 0.12 : mode === 'right' ? 0.88 : mode === 'center' ? 0.5 : mode === 'pointer' ? pointer.x : 0.5 + 0.39*Math.sin(elapsed/1900);
  return {x: Math.max(0.06,Math.min(0.94,fraction))*width,
    y: mode === 'pointer' ? Math.max(0.1,Math.min(0.85,pointer.y))*height : height*(0.58+0.035*Math.sin(elapsed/1400))};
}
