import {isolatePoses} from './class-tower-frames.js';
const phases=['Preparar','Puxar a corda','Soltar a flecha','Recuperar'];
const durations=[200,300,100,250],total=durations.reduce((a,b)=>a+b,0),actors=[];
let playing=true,phase=0,clock=0,last=performance.now();
const play=document.querySelector('#play'),status=document.querySelector('#status');
function pause(){playing=false;play.textContent='Reproduzir';}
play.onclick=()=>{playing=!playing;play.textContent=playing?'Pausar':'Reproduzir';};
document.querySelector('#next').onclick=()=>{pause();phase=(phase+1)%4;clock=durations.slice(0,phase).reduce((a,b)=>a+b,0);draw();};
for(const id of ['speed','zoom','background'])document.querySelector('#'+id).onchange=()=>draw();
async function load(id){
 const img=new Image();img.src=`./assets/class-tower-candidates/archer-${id}-front-attack-candidate-v001.png`;await img.decode();
 const c=document.createElement('canvas');c.width=img.width;c.height=img.height;
 const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);
 const frames=isolatePoses(ctx.getImageData(0,0,c.width,c.height).data,c.width,c.height);
 const surfaces=frames.map(f=>{const out=document.createElement('canvas');out.width=f.width;out.height=f.height;out.getContext('2d').putImageData(new ImageData(f.pixels,f.width,f.height),0,0);return out;});
 return {id,frames,surfaces,canvas:document.querySelector('#'+id),source:[img.width,img.height],scale:300/frames[0].height};
}
function draw(){for(const actor of actors){
 const ctx=actor.canvas.getContext('2d'),bg=document.querySelector('#background').value;
 ctx.clearRect(0,0,520,460);ctx.fillStyle=bg==='light'?'#d5e2e8':'#0e2233';ctx.fillRect(0,0,520,460);
 if(bg==='grid'){ctx.strokeStyle='#335064';ctx.lineWidth=1;for(let x=0;x<520;x+=26){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,460);ctx.stroke();}for(let y=0;y<460;y+=26){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(520,y);ctx.stroke();}}
 const f=actor.frames[phase],scale=actor.scale*Number(document.querySelector('#zoom').value);
 ctx.strokeStyle='#6b929a';ctx.beginPath();ctx.moveTo(30,410);ctx.lineTo(490,410);ctx.stroke();
 ctx.drawImage(actor.surfaces[phase],260-f.pivotX*scale,410-f.pivotY*scale,f.width*scale,f.height*scale);
 actor.canvas.closest('article').querySelector('.phase').textContent=`${phase+1}/4 · ${phases[phase]} · ${durations[phase]} ms`;
}}
try{
 actors.push(...await Promise.all(['female','male'].map(load)));
 document.querySelector('#metadata').textContent=JSON.stringify({status:'candidate',directions:{female:'front',male:'front'},globalFlipAllowed:false,sequence:[0,1,2,3],durationsMs:durations,cycleMs:total,actors:actors.map(({id,source,frames})=>({id,source,frames:frames.map(({pixels,...f})=>f)}))},null,2);
 status.textContent='8 poses separadas · prontas para conferência visual';draw();
 requestAnimationFrame(function tick(now){const dt=Math.min(100,now-last);last=now;if(playing){clock=(clock+dt*Number(document.querySelector('#speed').value))%total;let t=clock;phase=0;while(t>=durations[phase]&&phase<3)t-=durations[phase++];draw();}requestAnimationFrame(tick);});
}catch(error){status.textContent='Falha ao preparar a prévia: '+error.message;status.style.color='#ff9e9e';console.error(error);}

