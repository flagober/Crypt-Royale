import {mapById} from './maps.js';
const images=new Map(),pending=new Map();
export function prepareMapArt(id){
 const map=mapById(id);if(images.has(map.id))return Promise.resolve(images.get(map.id));
 if(pending.has(map.id))return pending.get(map.id);
 const work=(async()=>{const image=new Image();image.src=map.file;await image.decode();images.set(map.id,image);return image;})().catch(error=>{pending.delete(map.id);throw error;});
 pending.set(map.id,work);return work;
}
export function drawMapGround(ctx,id,arena){
 const image=images.get(mapById(id).id);if(!image)return false;
 ctx.save();ctx.drawImage(image,0,0,arena.width,arena.height);
 ctx.fillStyle='rgba(120,18,42,.07)';ctx.fillRect(0,0,arena.width,arena.riverTop);
 ctx.fillStyle='rgba(3,85,122,.06)';ctx.fillRect(0,arena.riverBottom,arena.width,arena.height-arena.riverBottom);
 ctx.restore();return true;
}
export function drawMapCrossing(ctx,id,arena){
 const map=mapById(id),height=arena.riverBottom-arena.riverTop;
 ctx.save();ctx.fillStyle=map.river;ctx.fillRect(0,arena.riverTop,arena.width,height);
 ctx.strokeStyle='#9be4ed44';ctx.lineWidth=1;
 for(const y of [arena.riverTop+6,arena.riverBottom-6]){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(arena.width,y);ctx.stroke();}
 for(const x of [64,238]){ctx.fillStyle=map.bridge;ctx.fillRect(x,arena.riverTop,58,height);ctx.strokeStyle='#201a2288';
  for(let y=arena.riverTop+3;y<arena.riverBottom;y+=6){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+58,y);ctx.stroke();}
 }
 ctx.restore();
}
