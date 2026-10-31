import test from 'node:test';
import assert from 'node:assert/strict';
import {turnTowards,facingFor,facingForTarget,transformedPoint,targetAt} from './class-tower-tracking.js';
import {isolatePoses} from './class-tower-frames.js';
test('turret takes shortest route across the -pi/pi seam',()=>{
  const a=turnTowards(Math.PI-0.05,-Math.PI+0.05,0.04);
  assert.ok(Math.abs(a-(Math.PI-0.01))<1e-9);
  assert.ok(Math.abs(turnTowards(0,1,0.2)-0.2)<1e-9);
});
test('facing hysteresis prevents flipping when target crosses the pivot by a few pixels',()=>{
  assert.equal(facingFor(505,500,'left'),'left');assert.equal(facingFor(520,500,'left'),'right');
  assert.equal(facingFor(480,500,'right'),'left');
});
test('muzzle follows the rotating barrel on either side',()=>{
  const origin={x:100,y:80},offset={x:30,y:0};
  assert.deepEqual(transformedPoint(origin,0,offset),{x:130,y:80});
  const p=transformedPoint(origin,Math.PI,offset);assert.ok(Math.abs(p.x-70)<1e-9);assert.ok(Math.abs(p.y-80)<1e-9);
});
test('target moves to both halves and fixed modes remain on their side',()=>{
  assert.ok(targetAt('auto',3000,1120,650).x>560);assert.ok(targetAt('auto',9000,1120,650).x<560);
  assert.ok(targetAt('left',0,560,600).x<280);assert.ok(targetAt('right',0,560,600).x>280);
  assert.deepEqual(targetAt('pointer',0,100,100,{x:2,y:-1}),{x:94,y:10});
});
test('pose isolation removes a disconnected neighbouring fragment without recolouring art',()=>{
  const rgba=new Uint8ClampedArray(20*20*4);
  for(const [x,y] of [[2,2],[12,2],[2,12],[12,12]])for(let dy=0;dy<3;dy++)for(let dx=0;dx<3;dx++)rgba.set([70,120,200,255],((y+dy)*20+x+dx)*4);
  rgba.set([255,0,0,255],(8*20+8)*4);
  const frames=isolatePoses(rgba,20,20,{minArea:4});assert.equal(frames.length,4);
  for(const frame of frames){assert.equal(frame.area,9);assert.deepEqual([...frame.pixels.slice(0,4)],[70,120,200,255]);}
});
test('pose isolation refuses merged or missing drawings rather than guessing',()=>{
  const rgba=new Uint8ClampedArray(8*8*4).fill(255);
  assert.throws(()=>isolatePoses(rgba,8,8,{minArea:1}),/encontradas 1/);
});
test('front sector follows a central target without flickering at the edge',()=>{
  assert.equal(facingForTarget({x:280,y:350},{x:280,y:255}),'front');
  assert.equal(facingForTarget({x:340,y:350},{x:280,y:255},'front'),'front');
  assert.equal(facingForTarget({x:340,y:350},{x:280,y:255},'right'),'right');
  assert.equal(facingForTarget({x:100,y:350},{x:280,y:255}),'left');
  assert.equal(facingForTarget({x:480,y:350},{x:280,y:255}),'right');
  assert.equal(targetAt('center',5000,560,600).x,280);
});
