import {facingForTarget,turnTowards,transformedPoint,targetAt} from './class-tower-tracking.js';
import {isolatePoses} from './class-tower-frames.js';
import {towerEngagement} from './tower-targeting.js';
const $=id=>document.getElementById(id), cycle=2400;
const boundaries=[0,650,1000,1200,1560], phases=['Guarda','Preparação','Corte · liberação de energia','Recuperação','Guarda'];
let time=0,elapsed=0,paused=matchMedia('(prefers-reduced-motion: reduce)').matches,last=performance.now();
let pointer={x:0.75,y:0.58};
const phaseAt=t=>t<650?0:t<1000?1:t<1200?2:t<1560?3:4;
const freshState=()=>({facing:'front',phase:-1,shot:null});
const directionName=direction=>({left:'Esquerda',right:'Direita',front:'Frente'}[direction]);
const loadImage=async url=>{const img=new Image();img.src=url;await img.decode();return img;};
function pause(value){paused=value;$('pause').textContent=paused?'Reproduzir':'Pausar';}
$('pause').onclick=()=>pause(!paused);
$('restart').onclick=()=>{time=0;elapsed=0;};
$('step').onclick=()=>{pause(true);time=boundaries.find(t=>t>time+1)??0;};
$('scrub').oninput=e=>{pause(true);time=Number(e.target.value);};
pause(paused);
for(const id of ['male','female','lineup']){
 const canvas=$(id);
 const update=e=>{const r=canvas.getBoundingClientRect();pointer={x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height};};
 canvas.addEventListener('pointerdown',e=>{$('aim-mode').value='pointer';update(e);canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if($('aim-mode').value==='pointer'&&(e.pointerType==='mouse'||e.buttons))update(e);});
 canvas.style.touchAction='none';
}
try{
 const manifest=await fetch('./assets/class-tower-candidates/manifest-v004.json').then(r=>{if(!r.ok)throw Error('Metadados indisponíveis');return r.json();});
 const [tower,base,cannon]=await Promise.all([manifest.tower.file,manifest.guard.base.file,manifest.guard.cannon.file].map(loadImage));
 const views=await Promise.all(manifest.characters.map(async entry=>{
  const directions={};for(const [direction,spec] of Object.entries(entry.directions)){
   const img=await loadImage(spec.file),scratch=document.createElement('canvas');scratch.width=img.width;scratch.height=img.height;
   const context=scratch.getContext('2d',{willReadFrequently:true});context.drawImage(img,0,0);
   const frames=isolatePoses(context.getImageData(0,0,img.width,img.height).data,img.width,img.height);
   // Explicit foot pivots keep a downward-pointing sword from shifting the body.
   frames.forEach((frame,index)=>{const pivot=spec.frames?.[index];if(pivot){frame.pivotX=pivot.pivotX;frame.pivotY=pivot.pivotY;}});
   const surfaces=frames.map(frame=>{const canvas=document.createElement('canvas');canvas.width=frame.width;canvas.height=frame.height;canvas.getContext('2d').putImageData(new ImageData(frame.pixels,frame.width,frame.height),0,0);return canvas;});
   const scale=spec.displayHeight/frames[0].height,attack=frames[2];
   directions[direction]={...spec,frames,surfaces,scale,release:{x:(spec.tip.x-attack.x-attack.pivotX)*scale,y:(spec.tip.y-attack.y-attack.pivotY)*scale}};
  }
  return {...entry,directions,ctx:$(entry.id).getContext('2d'),state:freshState()};
 }));
 const lineupStates={male:freshState(),female:freshState()},angles=[-Math.PI/2,-Math.PI/2];
 $('aim-mode').addEventListener('change',()=>{for(const view of views)view.state.phase=-1;for(const state of Object.values(lineupStates))state.phase=-1;});
 $('status').textContent='Artes aprovadas · integradas ao jogo local';
 function background(ctx,width,height){
  const bg=$('background').value;ctx.fillStyle=bg==='light'?'#dce8ee':'#091a2b';ctx.fillRect(0,0,width,height);
  if(bg==='grid'){ctx.strokeStyle='#294357';ctx.lineWidth=1;for(let x=0;x<width;x+=28){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,height);ctx.stroke();}for(let y=0;y<height;y+=28){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke();}}
 }
 function marker(ctx,target){
  ctx.save();ctx.strokeStyle=$('background').value==='light'?'#a84916':'#ffbf75';ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(target.x,target.y,13,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(target.x-19,target.y);ctx.lineTo(target.x+19,target.y);ctx.moveTo(target.x,target.y-19);ctx.lineTo(target.x,target.y+19);ctx.stroke();ctx.font='12px system-ui';ctx.textAlign='center';ctx.fillText('ALVO',target.x,target.y+32);ctx.restore();
 }
 function sight(ctx,from,to){if(!$('aim-lines').checked)return;ctx.save();ctx.setLineDash([5,7]);ctx.strokeStyle='#68bfc6';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(to.x,to.y);ctx.stroke();ctx.restore();}
 function central(ctx,view,state,target,allowed=true){
  const p=allowed?phaseAt(time):0,pose=p===4?0:p,[px,py]=view.pivot;
  if(p!==2||state.phase!==2)state.facing=allowed?facingForTarget(target,{x:px,y:py},state.facing):'front';
  const direction=view.directions[state.facing],rect=direction.frames[pose],scale=direction.scale;
  const tr=manifest.tower;ctx.drawImage(tower,tr.x,tr.y,tr.width,tr.height);
  ctx.drawImage(direction.surfaces[pose],px-rect.pivotX*scale,py-rect.pivotY*scale,rect.width*scale,rect.height*scale);
  if($('feet').checked){ctx.strokeStyle='#ffcd66';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px-50,py);ctx.lineTo(px+50,py);ctx.stroke();}
  const start={x:px+direction.release.x,y:py+direction.release.y};if(allowed)sight(ctx,start,target);
  // Visual event only. Snapshot the target at release; no real game damage here.
  if(p===2&&state.phase!==2)state.shot={from:start,to:{...target}};
  if(p===0||p===4)state.shot=null;
  if($('effects').checked&&state.shot&&time>=1000&&time<1460){
   const t=(time-1000)/460,{from,to}=state.shot,x=from.x+(to.x-from.x)*t,y=from.y+(to.y-from.y)*t;
   ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(to.y-from.y,to.x-from.x));ctx.globalAlpha=1-t;ctx.strokeStyle=view.effectColor;ctx.shadowColor=view.effectColor;ctx.shadowBlur=12;ctx.lineWidth=5*(1-t)+1;ctx.beginPath();ctx.arc(0,0,20,-1.2,1.2);ctx.stroke();ctx.restore();
  }
  state.phase=p;
 }
 // This illustration shows only the defending half. Project it into logical
 // arena coordinates; gameplay keeps its own actual tower/unit positions.
 const defensivePoint=point=>({x:point.x/1120*360,y:280+point.y/650*280});
 function permission(type,origin,target){return towerEngagement({...defensivePoint(origin),type,team:'player',hp:1},{...defensivePoint(target),team:'enemy',hp:1},{width:360,height:560});}
 function guard(ctx,x,index,target,dt){
  const spec=manifest.guard,s=250/base.width,h=base.height*s,y=600-h;
  ctx.drawImage(base,x,y,250,h);
  const mount={x:x+spec.base.mount.x*s,y:y+spec.base.mount.y*s};
  const reason=permission('guard',mount,target),allowed=reason==='permitido';
  const desired=Math.atan2(target.y-mount.y,target.x-mount.x);
  if(allowed)angles[index]=turnTowards(angles[index],desired,dt*0.004);
  const angle=angles[index],cs=spec.cannon.scale;
  const recoil=$('effects').checked&&time>=1000&&time<1150?Math.sin((time-1000)/150*Math.PI)*3:0;
  const origin=transformedPoint(mount,angle,{x:-recoil,y:0});
  ctx.save();ctx.translate(origin.x,origin.y);ctx.rotate(angle);ctx.drawImage(cannon,-spec.cannon.pivot.x*cs,-spec.cannon.pivot.y*cs,cannon.width*cs,cannon.height*cs);ctx.restore();
  const muzzle=transformedPoint(origin,angle,{x:spec.cannon.muzzleDistance*cs,y:0});if(allowed)sight(ctx,muzzle,target);
  // Do not fire sideways while still turning to the target.
  const aligned=Math.abs(Math.atan2(Math.sin(desired-angle),Math.cos(desired-angle)))<0.15;
  if(allowed&&$('effects').checked&&aligned&&time>=1000&&time<1360){
   const t=(time-1000)/360,p={x:muzzle.x+(target.x-muzzle.x)*t,y:muzzle.y+(target.y-muzzle.y)*t};
   ctx.save();ctx.fillStyle='#8bfcff';ctx.shadowColor='#43dfff';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(p.x,p.y,5*(1-t)+2,0,Math.PI*2);ctx.fill();ctx.restore();
  }
  return reason;
 }
 function lineup(dt){
  const ctx=$('lineup').getContext('2d');background(ctx,1120,650);
  const target=targetAt($('aim-mode').value,elapsed,1120,650,pointer),id=$('lineup-class').value,view=views.find(v=>v.id===id);
  ctx.save();ctx.setLineDash([5,8]);ctx.strokeStyle='#29475f';ctx.beginPath();ctx.moveTo(560,320);ctx.lineTo(560,600);ctx.stroke();ctx.restore();
  const left=guard(ctx,30,0,target,dt),right=guard(ctx,840,1,target,dt),core=permission('core',{x:560,y:view.pivot[1]},target);
  ctx.save();ctx.translate(280,0);central(ctx,view,lineupStates[id],{x:target.x-280,y:target.y},core==='permitido');ctx.restore();marker(ctx,target);
  const names={'permitido':'Alvo válido','fora-da-rota':'Fora da rota','fora-do-alcance':'Fora do alcance','fora-da-metade':'Outra metade'};
  ctx.fillStyle=$('background').value==='light'?'#17354c':'#a8c0d4';ctx.font='16px system-ui';ctx.textAlign='center';ctx.fillText(`Esquerda · ${names[left]||left}`,155,630);ctx.fillText(`Central · ${names[core]||core}`,560,630);ctx.fillText(`Direita · ${names[right]||right}`,965,630);
  $('tracking-status').textContent=`Central: ${directionName(lineupStates[id].facing)} · Esquerda: ${names[left]||left} · Núcleo: ${names[core]||core} · Direita: ${names[right]||right}`;
 }
 function tick(now){
  const raw=Math.min(100,now-last),dt=paused?0:raw*Number($('speed').value);last=now;
  if(!paused){time=(time+dt)%cycle;elapsed+=dt;}
  for(const view of views){background(view.ctx,560,600);const target=targetAt($('aim-mode').value,elapsed,560,600,pointer);central(view.ctx,view,view.state,target);marker(view.ctx,target);const p=phaseAt(time);$(view.id+'-phase').textContent=`${phases[p]} · pose ${(p===4?0:p)+1}/4 · ${directionName(view.state.facing)}`;}
  // Manual target controls also turn turrets while the attack clip is paused.
  lineup(paused?raw:dt);$('scrub').value=String(Math.floor(time));$('clock').textContent=`${Math.floor(time)} ms`;requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
}catch(error){$('status').className='error';$('status').textContent=`Falha ao carregar a prévia: ${error.message}`;console.error(error);}
