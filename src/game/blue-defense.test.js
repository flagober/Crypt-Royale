import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {TOWER_ART,coreArtDirection,archerArt,towerMuzzle,towerLayout,archerPose} from './tower-animation.js';
import {isolateTowerPoses} from './tower-frames.js';
test('approved rear source files retain original hashes, distinct identities and four complete bounds',()=>{
 const approval=JSON.parse(fs.readFileSync(new URL('../../public/assets/class-tower-candidates/approval-blue-back-attacks-20261027.json',import.meta.url)));
 assert.equal(approval.status,'approved');assert.equal(approval.globalFlipAllowed,false);assert.equal(approval.actors.length,4);
 for(const a of approval.actors){assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL('../../public/'+a.file.slice(2),import.meta.url))).digest('hex'),a.sha256);
  assert.equal(a.frames.length,4);for(const f of a.frames){assert(f.x>=0&&f.y>=0&&f.width>0&&f.height>0);assert(f.x+f.width<=a.sheet[0]&&f.y+f.height<=a.sheet[1]);}
 }
});
test('team selects back only for blue, with anatomical art and unchanged event clock',()=>{
 for(const gender of ['female','male']){
  const player={team:'player',type:'guard',x:gender==='female'?58:302,y:496},enemy={...player,team:'enemy'};
  assert.equal(archerArt(player).direction,'back');assert.equal(archerArt(enemy).direction,'front');
  const tip=towerMuzzle(player),foot=towerLayout(player).foot;assert(Math.abs(tip.x-foot.x)<1);assert(tip.y<foot.y);
  const core=TOWER_ART.characters.find(c=>c.id===gender);assert.equal(core.directions.back.direction,'back');
 }
 assert.equal(coreArtDirection({team:'player'}),'back');assert.equal(coreArtDirection({team:'enemy'}),'front');
 const tower={lastAttackAt:10,attackLeftMs:1000};assert.equal(archerPose(tower,10),2);assert.equal(archerPose(tower,110),3);assert.equal(archerPose(tower,360),0);
});
test('row isolation keeps swords crossing a column boundary and rejects invalid regions',()=>{
 const w=20,h=20,pixels=new Uint8ClampedArray(w*h*4);
 for(const [x,y,width,height]of [[1,1,6,4],[12,1,6,4],[1,12,11,4],[15,12,4,4]])for(let yy=y;yy<y+height;yy++)for(let xx=x;xx<x+width;xx++)pixels[(yy*w+xx)*4+3]=255;
 const f=isolateTowerPoses(pixels,w,h,{minPoseAreaFraction:.01,regions:[[0,0,w,10,2],[0,10,w,10,2]]});
 assert.equal(f[2].width,11);assert.equal(f[2].x,1);assert.equal(f[2].y,12);assert.equal(f.length,4);
 assert.throws(()=>isolateTowerPoses(pixels,w,h,{regions:[[0,0,30,10,2]]}),/inválida/);
 assert.throws(()=>isolateTowerPoses(pixels.subarray(4),w,h,{regions:[]}),/RGBA/);
});
