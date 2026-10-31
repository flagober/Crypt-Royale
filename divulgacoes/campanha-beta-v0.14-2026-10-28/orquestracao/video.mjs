import fs from 'node:fs/promises';import path from 'node:path';import {fileURLToPath}from'node:url';import {spawn}from'node:child_process';
const kit=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const ffmpeg='C:/Users/flavi/AppData/Local/Python/pythoncore-3.15-64/Lib/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const duration=18.6,rate=48000;
async function absent(p){try{await fs.access(p);throw Error('Saída já existe; preserve-a e escolha uma variante: '+p);}catch(e){if(e.code!=='ENOENT')throw e;}}
const audio=path.join(kit,'fontes/vinheta-original-v001.wav');if(!process.argv.includes('--reuse-audio'))await absent(audio);
const count=Math.round(duration*rate),wav=Buffer.alloc(44+count*4);wav.write('RIFF',0);wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(2,22);wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*4,28);wav.writeUInt16LE(4,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(count*4,40);
const motif=[392,523.25,659.25,587.33,440,554.37,698.46,523.25],notes=[];for(let n=0;n<15;n++)notes.push({at:n*1.15+0.18,freq:motif[n%8]});
for(let i=0;i<count;i++){const t=i/rate;let l=0,r=0;for(let n=0;n<notes.length;n++){const a=t-notes[n].at;if(a<0||a>2.7)continue;const env=Math.min(1,a/.025)*Math.exp(-a*2.2)*.16,signal=env*(Math.sin(2*Math.PI*notes[n].freq*a)+.22*Math.sin(4*Math.PI*notes[n].freq*a));l+=signal*(n%2?.72:1);r+=signal*(n%2?1:.72);}const fade=Math.min(1,t/.3,(duration-t)/.8);wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,l*fade))*32767),44+i*4);wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,r*fade))*32767),46+i*4);}
if(!process.argv.includes('--reuse-audio'))await fs.writeFile(audio,wav);
async function run(args){return new Promise((resolve,reject)=>{const p=spawn(ffmpeg,args,{windowsHide:true});let out='';p.stderr.on('data',d=>out+=d);p.on('error',reject);p.on('close',code=>code===0?resolve(out):reject(Error('FFmpeg falhou: '+out.slice(-5000))));});}
const reports=[];
for(const[format,name,width,height]of [['story','vertical-1080x1920',1080,1920],['horizontal','horizontal-1920x1080',1920,1080]]){
 const output=path.join(kit,'videos/royale-beta-'+name+'.mp4');await absent(output);let args=['-hide_banner','-loglevel','warning','-n'];
 for(const scene of ['hero','cards','evolve','founder','invite'])args.push('-loop','1','-framerate','30','-t','4','-i',path.join(kit,`revisao/cena-${format}-${scene}.png`));args.push('-i',audio);
 let filters=[];for(let i=0;i<5;i++)filters.push(`[${i}:v]format=yuv420p,setsar=1,setpts=PTS-STARTPTS,fps=30,settb=1/30[s${i}]`);
 let current='s0';for(let i=1;i<5;i++){const next='x'+i;filters.push(`[${current}][s${i}]xfade=transition=fade:duration=0.35:offset=${(3.65*i).toFixed(2)}[${next}raw];[${next}raw]fps=30,settb=1/30[${next}]`);current=next;}
 filters.push(`[${current}]format=yuv420p[v]`);
 args.push('-filter_complex_threads','1','-filter_complex',filters.join(';'),'-map','[v]','-map','5:a','-c:v','libx264','-preset','fast','-crf','20','-threads','3','-profile:v','high','-level','4.2','-pix_fmt','yuv420p','-r','30','-c:a','aac','-b:a','160k','-ar','48000','-ac','2','-t',String(duration),'-movflags','+faststart',output);
 const buildLog=await run(args);const decodeLog=await run(['-hide_banner','-v','info','-i',output,'-map','0:v','-map','0:a','-f','null','-']);
 const data=await fs.readFile(output),atoms=[];for(let at=0;at+8<=data.length;){let size=data.readUInt32BE(at),header=8;if(size===1){size=Number(data.readBigUInt64BE(at+8));header=16;}if(size===0)size=data.length-at;if(size<header)throw Error('MP4 inválido');atoms.push({name:data.toString('ascii',at+4,at+8),at,size});at+=size;}
 if(atoms.find(a=>a.name==='moov').at>atoms.find(a=>a.name==='mdat').at)throw Error('faststart ausente');
 if(!decodeLog.includes(`${width}x${height}`)||!decodeLog.includes('h264')||!decodeLog.includes('aac'))throw Error('Formato inesperado');
 await fs.writeFile(path.join(kit,'revisao/decode-'+format+'.log'),decodeLog);
 reports.push({file:path.relative(kit,output).replaceAll('\\','/'),width,height,durationSeconds:duration,fps:30,video:'H.264 High/yuv420p',audio:'AAC stereo 48kHz',faststart:true,fullDecodePassed:true,bytes:data.length,buildWarnings:buildLog.trim()});console.log('Vídeo validado: '+name);
}
await fs.writeFile(path.join(kit,'videos/video-report.json'),JSON.stringify({status:'preview-not-approved',music:'Vinheta original sintetizada; sem música de marcas ou narração.',durationSeconds:duration,reports},null,2));
