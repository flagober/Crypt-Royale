import test from 'node:test';
import assert from 'node:assert/strict';
import { spriteProfile, selectSpriteFrame } from './sprite-animation.js';

test('existing sheets keep their four-beat cycle, idle and direction mapping', () => {
  const profile = spriteProfile();
  assert.deepEqual([0, 110, 220, 330, 440].map(t => selectSpriteFrame(profile, t, true, 'left').column), [0, 1, 2, 1, 0]);
  assert.deepEqual(selectSpriteFrame(profile, 220, false, 'right'), {column: 1, row: 1, x: 140, y: 140, size: 140});
});

test('eight-frame source supports separate idle and atlas offsets', () => {
  const profile = spriteProfile({cellSize: 64, offsetY: 512, idleColumn: 0, playback: [1,2,3,4,5,6,7,8], frameDurationMs: 100, directionRows: {up:0,left:1,down:2,right:3}});
  assert.deepEqual(Array.from({length:9}, (_,i) => selectSpriteFrame(profile,i*100,true,'down').column), [1,2,3,4,5,6,7,8,1]);
  assert.deepEqual(selectSpriteFrame(profile,750,false,'down'), {column:0,row:2,x:0,y:640,size:64});
});

test('one-shot clips hold their final frame instead of repeating', () => {
  assert.equal(selectSpriteFrame(spriteProfile({loop:false}),10000,true,'up').column,1);
  assert.throws(() => selectSpriteFrame(spriteProfile({frameDurationMs:0}),0,true,'up'));
});
