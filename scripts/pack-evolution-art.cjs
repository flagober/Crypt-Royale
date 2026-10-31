// Deterministic assembly of image_gen-drawn poses; never synthesizes anatomy or flips a figure.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {pathToFileURL}=require('node:url');
const {backup,mirror,hash}=require('./release-tools.cjs');
let sharp;try{sharp=require('sharp');}catch{sharp=require('C:/Users/flavi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');}
const root=path.resolve(__dirname,'..'),canonical='C:\\MonsterCrypt_Ecosystem_V1.0\\Crypt-Royale';
if(root.toLowerCase()!==canonical.toLowerCase())throw Error('Execute o empacotador na fonte local confirmada do C.');
const mirrorRoot='G:\\Meu Drive\\MonsterCrypt_Ecosystem_V1.0\\Crypt-Royale';
const dirs=['down','right','left','up'],cell=140,pivot=[70,128];
const approved='art-source/sprite-sheets/approved/lote2';
const definitions=[
 {id:'bit-bug-mk2',canonicalId:'MC-0002',stem:'mc-0002_bit-bug-mk2',clip:'walk',columns:3,output:'public/assets/units/bit-bug-mk2-spritesheet-v001.png'},
 {id:'bit-bug-apex',canonicalId:'MC-0003',stem:'mc-0003_bit-bug-apex',clip:'walk',columns:3,output:'public/assets/units/bit-bug-apex-spritesheet-v001.png'},
 ...['male','female'].map(sex=>({id:`paladin-${sex}`,sex,stem:`class-paladin_tier2_${sex}`,clip:'attack',columns:4,output:`public/assets/class-evolutions/paladin-${sex}-attack-v001.png`}))
];
const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function cyanTip(frame,dir){
 const w=frame.width,h=frame.height,seen=new Uint8Array(w*h),parts=[];
 const cyan=i=>{const p=i*4,r=frame.pixels[p],g=frame.pixels[p+1],b=frame.pixels[p+2];return frame.pixels[p+3]>64&&r<160&&g>150&&b>165&&g>r*1.12&&b>r*1.12;};
 for(let seed=0;seed<w*h;seed++)if(!seen[seed]&&cyan(seed)){
  const queue=[seed];seen[seed]=1;for(let head=0;head<queue.length;head++){const i=queue[head],x=i%w,y=Math.floor(i/w);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx<0||nx>=w||ny<0||ny>=h)continue;const n=ny*w+nx;if(!seen[n]&&cyan(n)){seen[n]=1;queue.push(n);}}}parts.push(queue);
 }
 const largest=parts.sort((a,b)=>b.length-a.length)[0];if(!largest?.length)throw Error('Lâmina ciano não encontrada: '+dir);
 const score=i=>dir==='down'?Math.floor(i/w):dir==='up'?-Math.floor(i/w):dir==='right'?i%w:-(i%w);
 const tip=largest.reduce((a,b)=>score(b)>score(a)?b:a);return [tip%w,Math.floor(tip/w)];
}
async function main(){
 const {isolatePoses}=await import(pathToFileURL(path.join(root,'src/game/tower-frames.js')).href);
 const overridesPath=path.join(root,'art-source/metadata/animation-overrides-lote2-20261028.json');
 const overrides=fs.existsSync(overridesPath)?JSON.parse(fs.readFileSync(overridesPath,'utf8')):{};
 const only=process.argv.find(a=>a.startsWith('--only='))?.slice(7),outputs=[],summaries=[],tips={};
 const selected=definitions.filter(d=>!only||d.id===only);if(!selected.length)throw Error('Conteúdo desconhecido.');
 for(const def of selected){
  const poses=[],sources=[];
  for(let row=0;row<dirs.length;row++){
   const dir=dirs[row],file=overrides[`${def.id}:${dir}`]||`art-source/sprite-sheets/work/cr_${def.stem}_${dir}_${def.clip}-strip_v001.png`;
   const full=path.join(root,file);if(!fs.existsSync(full))throw Error('Clipe ainda não produzido: '+file);
   const {data,info}=await sharp(full).ensureAlpha().raw().toBuffer({resolveWithObject:true});
   let frames=isolatePoses(data,info.width,info.height,{count:def.columns,threshold:32,minArea:Math.floor(info.width*info.height*.008)});
   const centers=frames.map(f=>f.y+f.height/2);
   if(def.columns===3||Math.max(...centers)-Math.min(...centers)<info.height*.3)frames.sort((a,b)=>a.x-b.x);
   else frames.sort((a,b)=>Math.floor((a.y+a.height/2)/(info.height/2))-Math.floor((b.y+b.height/2)/(info.height/2))||a.x-b.x);
   if(new Set(frames.map(f=>digest(f.pixels))).size!==def.columns)throw Error('Quadros repetidos: '+file);
   for(let col=0;col<frames.length;col++){
    const f=frames[col];if(f.x<=0||f.y<=0||f.x+f.width>=info.width||f.y+f.height>=info.height)throw Error('Extremidade cortada: '+file+'/'+col);
    if(def.clip==='walk'){f.pivotX=f.width/2;f.pivotY=f.height-1;}
    poses.push({...f,row,col,dir,file,pixelHash:digest(f.pixels)});
   }
   sources.push({direction:dir,file,sha256:hash(full),dimensions:[info.width,info.height],frames:frames.length});
  }
  const scale=Math.min(...poses.flatMap(f=>[59.5/Math.max(1,f.pivotX),59.5/Math.max(1,f.width-f.pivotX),122/Math.max(1,f.pivotY)]));
  const layers=[],frames=[];tips[def.sex]={};
  for(const f of poses){
   const width=Math.max(1,Math.round(f.width*scale)),height=Math.max(1,Math.round(f.height*scale));
   const left=70-Math.round(f.pivotX*scale),top=128-Math.round(f.pivotY*scale);
   if(left<10||top<6||left+width>131||top+height>132)throw Error('Pose fora da área segura: '+def.id+'/'+f.dir+'/'+f.col);
   const input=await sharp(Buffer.from(f.pixels),{raw:{width:f.width,height:f.height,channels:4}}).resize(width,height,{kernel:'nearest'}).png().toBuffer();
   layers.push({input,left:f.col*cell+left,top:f.row*cell+top});
   frames.push({direction:f.dir,column:f.col,source:f.file,sourceRect:[f.x,f.y,f.width,f.height],sourcePivot:[f.pivotX,f.pivotY],sourcePixelsSha256:f.pixelHash,outputBounds:[left,top,width,height],pivot:[70,128]});
   if(def.clip==='attack'&&f.col===2){const t=cyanTip(f,f.dir);tips[def.sex][f.dir]=[left+Math.round(t[0]*scale),top+Math.round(t[1]*scale)];}
  }
  const approvedFile=`${approved}/${def.id}-spritesheet-v001.png`,metaFile=`${approved}/${def.id}-spritesheet-v001.json`;
  const files=[def.output,approvedFile,metaFile];backup(files.map(f=>path.join(root,f)),'royale-before-assemble-evolution');
  const bytes=await sharp({create:{width:def.columns*cell,height:4*cell,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(layers).png().toBuffer();
  for(const rel of [def.output,approvedFile]){fs.mkdirSync(path.dirname(path.join(root,rel)),{recursive:true});fs.writeFileSync(path.join(root,rel),bytes);}
  const metadata={id:def.id,canonicalId:def.canonicalId,authorization:'Flavio28/10/2026: auto aprovado daqui em diante, continue; QA obrigatório',status:'assembled-awaiting-runtime-QA',sources,grid:{columns:def.columns,rows:4,cell:[140,140]},pivot:[70,128],directions:dirs,clip:def.clip,sequence:def.clip==='walk'?[0,1,2,1]:[0,1,2,3],frameDurationMs:def.clip==='walk'?110:null,scale,frames,sha256:digest(bytes),noGlobalFlip:true,drawnFrames:true,publicFile:def.output};
  fs.writeFileSync(path.join(root,metaFile),JSON.stringify(metadata,null,2)+'\n');outputs.push(...files);summaries.push({id:def.id,dimensions:[def.columns*140,560],frames:frames.length,sha256:metadata.sha256});
 }
 if(selected.some(d=>d.clip==='attack')){
  const file='src/game/evolution-art.json',full=path.join(root,file),art=JSON.parse(fs.readFileSync(full,'utf8'));
  backup([full],'royale-before-paladin-muzzle-metadata');
  for(const def of selected.filter(d=>d.clip==='attack'))art.paladin[def.sex].tips={front:tips[def.sex].down,right:tips[def.sex].right,left:tips[def.sex].left,back:tips[def.sex].up};
  fs.writeFileSync(full,JSON.stringify(art,null,2)+'\n');outputs.push(file);
 }
 mirror(root,mirrorRoot,outputs);console.log(JSON.stringify({verifiedMirror:true,summaries},null,2));
}
main().catch(error=>{console.error(error.message);process.exitCode=1});
