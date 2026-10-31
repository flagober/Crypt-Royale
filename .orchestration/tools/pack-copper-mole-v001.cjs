// Deterministic export of the animation approved by Flavio on 2026-10-02.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('C:/Users/flavi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = 'C:/FlavioG/Crypt-Royale';
const source = 'art-source/sprite-sheets/work/mc-0022/cr_mc-0022_copper-mole_walk-source_candidate_v002.png';
const approved = 'art-source/sprite-sheets/approved/mc-0022';
const output = approved + '/cr_mc-0022_copper-mole_spritesheet_v001.png';
const publicFile = 'public/assets/units/copper-mole-spritesheet-v001.png';
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
async function main() {
  const {data,info} = await sharp(path.join(root,source)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const frames=[];
  // Alpha components identify complete sprites despite unequal generated gutters.
  const seen=new Uint8Array(info.width*info.height);
  for(let p=0;p<seen.length;p++) {
    if(seen[p] || data[p*4+3]<=128) continue;
    const q=[p];seen[p]=1;let minX=info.width,minY=info.height,maxX=-1,maxY=-1;
    for(let k=0;k<q.length;k++) {
      const a=q[k],x=a%info.width,y=Math.floor(a/info.width);
      minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
      for(const b of [x>0?a-1:-1,x<info.width-1?a+1:-1,y>0?a-info.width:-1,y<info.height-1?a+info.width:-1]) {
        if(b>=0&&!seen[b]&&data[b*4+3]>128){seen[b]=1;q.push(b);}
      }
    }
    if(q.length<1000)continue;
    if(minX===0||minY===0||maxX===info.width-1||maxY===info.height-1)throw Error('Clipped source component');
    frames.push({row:Math.floor((minY+maxY)/2/(info.height/4)),col:Math.floor((minX+maxX)/2/(info.width/3)),left:minX,top:minY,width:maxX-minX+1,height:maxY-minY+1});
  }
  if(frames.length!==12||new Set(frames.map(f=>f.row+','+f.col)).size!==12)throw Error('Expected 12 separate complete source sprites: '+JSON.stringify(frames));
  frames.sort((a,b)=>a.row-b.row||a.col-b.col);
  const scale=Math.min(120/Math.max(...frames.map(f=>f.width)),122/Math.max(...frames.map(f=>f.height)));
  const layers=[];
  for(const f of frames) {
    const width=Math.max(1,Math.round(f.width*scale)),height=Math.max(1,Math.round(f.height*scale));
    const input=await sharp(path.join(root,source)).extract({left:f.left,top:f.top,width:f.width,height:f.height}).resize(width,height,{kernel:'nearest'}).png().toBuffer();
    layers.push({input,left:f.col*140+Math.round((140-width)/2),top:f.row*140+128-height});
    f.output={width,height,left:Math.round((140-width)/2),top:128-height};
  }
  fs.mkdirSync(path.join(root,approved),{recursive:true});
  await sharp({create:{width:420,height:560,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(layers).png().toFile(path.join(root,output));
  fs.copyFileSync(path.join(root,output),path.join(root,publicFile));
  const metadata={sprite_id:'MC-0022',sprite_name:'copper-mole',status:'approved',approval_date:'2026-10-02',approval_source:'User explicitly approved walk source v002.',source_file:source,source_sha256:hash(source),dimensions:[420,560],mode:'RGBA',grid:{columns:3,rows:4,cell:[140,140]},pivot:[70,128],baseline:128,row_order:['down','right','left','up'],frame_order:['contact-a','passing','contact-b'],playback_pattern:[0,1,2,1],frame_duration_ms:140,animation_type:'mole-walk',file:output,public_file:publicFile,sha256:hash(output),frames};
  fs.writeFileSync(path.join(root,approved,'cr_mc-0022_copper-mole_spritesheet_v001.json'),JSON.stringify(metadata,null,2)+'\n');
  const master='art-source/approved-masters/cr_mc-0022_copper-mole_master_v001.png';
  const art=await sharp(path.join(root,master)).trim().resize(600,740,{fit:'inside',kernel:'nearest'}).png().toBuffer();
  const artInfo=await sharp(art).metadata();
  const card='public/assets/cards/copper-mole-card_v001.webp';
  await sharp({create:{width:640,height:800,channels:4,background:'#172554'}}).composite([{input:art,left:Math.round((640-artInfo.width)/2),top:Math.round((800-artInfo.height)/2)}]).webp({quality:92}).toFile(path.join(root,card));
  fs.writeFileSync(path.join(root,approved,'cr_mc-0022_copper-mole_card-export_v001.json'),JSON.stringify({id:'MC-0022',source_file:master,source_sha256:hash(master),public_file:card,sha256:hash(card),dimensions:[640,800],method:'Deterministic crop/fit of approved master; no new painted artwork.'},null,2)+'\n');
  console.log(JSON.stringify({output,publicFile,card,scale,frames:frames.length}));
}
main().catch(e=>{console.error(e);process.exit(1)});




