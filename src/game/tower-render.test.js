import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {drawApprovedTower} from './tower-render.js';import {TOWER_ART} from './tower-animation.js';
function fakeAssets(){const characters={};for(const c of TOWER_ART.characters){characters[c.id]={};for(const [name,spec]of Object.entries(c.directions))characters[c.id][name]={spec,surfaces:[0,1,2,3].map(pose=>({character:c.id,direction:name,pose}))};}const archers={};for(const id of ['female','male']){const frames=direction=>({surfaces:[0,1,2,3].map(pose=>({type:'archer-'+id,direction,pose}))});archers[id]={...frames('front'),back:frames('back')};}return {tower:{type:'core'},base:{type:'guard'},archers,characters};}
function ctx(){return {calls:[],save(){this.calls.push('save');},restore(){this.calls.push('restore');},beginPath(){},ellipse(){},fill(){},translate(x,y){this.calls.push(['translate',x,y]);},rotate(angle){this.calls.push(['rotate',angle]);},drawImage(image,...args){this.calls.push(['image',image,...args]);}};}
test('core draws its chosen approved character at the real strike pose; guards draw their approved archer without a cannon',()=>{
 const art=fakeAssets(),context=ctx();const tower={x:180,y:502,team:'player',type:'core',appearance:'female',facing:'front',lastAttackAt:100};
 drawApprovedTower(context,tower,100,art);const images=context.calls.filter(c=>Array.isArray(c)&&c[0]==='image');assert.equal(images.length,2);assert.equal(images[1][1].character,'female');assert.equal(images[1][1].pose,2);assert.equal(images[1][1].direction,'back');
 const guardContext=ctx();drawApprovedTower(guardContext,{...tower,type:'guard',aimAngle:Math.PI},100,art);
 const guardImages=guardContext.calls.filter(c=>Array.isArray(c)&&c[0]==='image');assert.equal(guardImages.length,2);assert.equal(guardImages[0][1].type,'guard');assert.equal(guardImages[1][1].type,'archer-male');assert.equal(guardImages[1][1].pose,2);assert.equal(guardImages[1][1].direction,'back');assert.equal(guardContext.calls.filter(c=>c==='save').length,guardContext.calls.filter(c=>c==='restore').length);
});

test('enemy frontal views and existing side directions are retained',()=>{
 const art=fakeAssets();for(const type of ['core','guard']){
  const context=ctx();drawApprovedTower(context,{x:58,y:64,team:'enemy',type,appearance:'male',facing:'front'},0,art);
  const draw=context.calls.filter(c=>Array.isArray(c)&&c[0]==='image').at(-1);assert.equal(draw[1].direction,'front');
 }
 const context=ctx();drawApprovedTower(context,{x:180,y:530,team:'player',type:'core',appearance:'female',facing:'left'},0,art);
 assert.equal(context.calls.filter(c=>Array.isArray(c)&&c[0]==='image').at(-1)[1].direction,'left');
});
test('runtime pose isolation matches the approved preview implementation',()=>{assert.equal(readFileSync(new URL('./tower-frames.js',import.meta.url),'utf8'),readFileSync(new URL('../../public/class-tower-frames.js',import.meta.url),'utf8'));});



