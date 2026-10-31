import test from 'node:test';
import assert from 'node:assert/strict';
import {computePopoverPosition} from './audio-popover.js';
const rect=(top,left)=>({top,left,right:left+44,bottom:top+44,width:44,height:44});
test('audio panel remains in the viewport near each edge, including short screens',()=>{
 for(const [w,h] of [[1440,900],[768,1024],[390,844],[320,568],[400,300],[320,180]]) {
  for(const top of [0,Math.floor(h/2)-22,h-44])for(const left of [0,w-44]){
   const p=computePopoverPosition(rect(top,left),{innerWidth:w,innerHeight:h});
   for(const field of ['top','left','maxHeight','panelWidth'])assert(Number.isFinite(p[field]));
   assert(p.top>=8);assert(p.left>=8);assert(p.panelWidth>0&&p.panelWidth<=288);
   assert(p.left+p.panelWidth<=w-8);assert(p.top+p.maxHeight<=h-8);
  }
 }
});
test('header prefers below, footer opens above and leaves the trigger visible',()=>{
 const vp={innerWidth:1440,innerHeight:900};
 const header=rect(12,1100),footer=rect(850,1100);
 const a=computePopoverPosition(header,vp),b=computePopoverPosition(footer,vp);
 assert.equal(a.placement,'below');assert(a.top>=header.bottom+4);
 assert.equal(b.placement,'above');assert(b.top+b.maxHeight<=footer.top-4);
});
