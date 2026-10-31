import {isolatePoses} from './class-tower-frames.js';
const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d'),actors={},images={};
let playing=true,phase=0,clock=0,last=performance.now();const durations=[200,300,100,250],names=['Pronto','Preparação','Disparo','Recuperação'];
document.querySelector('#play').onclick=()=>{playing=!playing;document.querySelector('#play').textContent=playing?'Pausar':'Reproduzir';};
document.querySelector('#next').onclick=()=>{playing=false;document.querySelector('#play').textContent='Reproduzir';phase=(phase+1)%4;clock=durations.slice(0,phase).reduce((a,b)=>a+b,0);draw();};
document.querySelector('#core').onchange=draw;
async function image(file){const img=new Image();img.src='./assets/class-tower-candidates/'+file;await img.decode();return img;}
async function actor(id){const img=await image(id+'-back-attack-candidate-v001.png'),c=document.createElement('canvas');c.width=img.width;c.height=img.height;const context=c.getContext('2d',{willReadFrequently:true});context.drawImage(img,0,0);
 const frames=[];
 // Separate the declared 2x2 cells first: generated glow may connect adjacent rows.
 // Retain only the character's alpha component in each cell, never neighbouring fragments.
 for(let row=0;row<2;row++)for(let col=0;col<2;col++){
  const x=Math.floor(col*c.width/2),y=Math.floor(row*c.height/2),w=Math.floor((col+1)*c.width/2)-x,h=Math.floor((row+1)*c.height/2)-y;
  const [f]=isolatePoses(context.getImageData(x,y,w,h).data,w,h,{count:1,minArea:Math.floor(w*h*.1)});
  frames.push({...f,x:f.x+x,y:f.y+y});
 }
 const surfaces=frames.map(f=>{const c=document.createElement('canvas');c.width=f.width;c.height=f.height;c.getContext('2d').putImageData(new ImageData(f.pixels,f.width,f.height),0,0);return c;});return {id,frames,surfaces,source:[img.width,img.height]};}
function draw(){if(!images.core)return;ctx.fillStyle='#0b3547';ctx.fillRect(0,0,960,540);ctx.strokeStyle='#24566b';for(let x=0;x<960;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,540);ctx.stroke();}for(let y=0;y<540;y+=45){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(960,y);ctx.stroke();}
ctx.fillStyle='#a4e3ef';ctx.font='bold 16px system-ui';ctx.textAlign='center';ctx.fillText('↑ CENTRO DA ARENA / ADVERSÁRIO ↑',480,35);
for(const [id,x,ground,isCore]of [['archer-female',170,435,false],[document.querySelector('#core').value,480,470,true],['archer-male',790,435,false]]){
 const width=isCore?230:190,scale=width/1312,vertical=scale*(isCore?1.15:0.85),bodyY=ground-(isCore?1120:1085)*vertical,footY=bodyY+(isCore?400:420)*vertical;
 ctx.fillStyle='#23b9d044';ctx.beginPath();ctx.ellipse(x,ground,width/2,width/6,0,0,Math.PI*2);ctx.fill();ctx.drawImage(isCore?images.core:images.side,x-656*scale,bodyY,width,1199*vertical);
 const actor=actors[id],f=actor.frames[phase],s=(isCore?150:135)/actor.frames[0].height;
 ctx.drawImage(actor.surfaces[phase],x-f.pivotX*s,footY-f.pivotY*s,f.width*s,f.height*s);
 }document.querySelector('#phase').textContent=`${phase+1}/4 · ${names[phase]} — vista de costas, sem espelhamento`;
}
try{for(const id of ['archer-female','archer-male','warrior-male','warrior-female'])actors[id]=await actor(id);images.core=await image('archer-platform-v001.png');images.side=await image('archer-side-narrow-v001.png');document.querySelector('#metadata').textContent=JSON.stringify({status:'candidate',direction:'up/back',globalFlipAllowed:false,actors:Object.values(actors).map(({surfaces,frames,...a})=>({...a,frames:frames.map(({pixels,...f})=>f)}))},null,2);document.querySelector('#status').textContent='16 poses separadas · defesa voltada para cima';draw();requestAnimationFrame(function tick(now){const dt=Math.min(100,now-last);last=now;if(playing){clock=(clock+dt*Number(document.querySelector('#speed').value))%850;let t=clock;phase=0;while(t>=durations[phase]&&phase<3)t-=durations[phase++];draw();}requestAnimationFrame(tick);});}catch(e){document.querySelector('#status').textContent='Falha na prévia: '+e.message;console.error(e);}
