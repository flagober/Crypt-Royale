// Deterministic export of the animation approved by Flavio on 2026-10-02.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('C:/Users/flavi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = 'C:/FlavioG/Crypt-Royale';
const source = 'art-source/sprite-sheets/work/mc-0016/cr_mc-0016_cache-crow_flight-source_layout_v002.png';
const approved = 'art-source/sprite-sheets/approved/mc-0016';
const output = approved + '/cr_mc-0016_cache-crow_spritesheet_v001.png';
const publicFile = 'public/assets/units/cache-crow-spritesheet-v001.png';
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
async function main() {
  const {data,info} = await sharp(path.join(root,source)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const frames=[];
  // The generated source has unequal vertical gutters; use the observed gaps,
  // not height/4, which would cut front paws and split the next row's ears.
  const rowCuts=[0,Math.round(info.height/4),Math.round(info.height/2),Math.round(info.height*3/4),info.height];
  for(let row=0;row<4;row++) for(let col=0;col<3;col++) {
    const colCuts=[0,365,731,info.width]; const x0=colCuts[col], x1=colCuts[col+1];
    const y0=rowCuts[row], y1=rowCuts[row+1];
    let minX=x1,minY=y1,maxX=-1,maxY=-1;
    for(let y=y0;y<y1;y++) for(let x=x0;x<x1;x++) if(data[(y*info.width+x)*4+3]>128) {
      minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
    }
    if(maxX<0 || minX===x0 || maxX===x1-1 || minY===y0 || maxY===y1-1) throw new Error('Empty or clipped source cell '+row+','+col);
    frames.push({row,col,left:minX,top:minY,width:maxX-minX+1,height:maxY-minY+1});
  }
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
  const metadata={sprite_id:'MC-0016',sprite_name:'cache-crow',status:'approved',approval_date:'2026-10-02',approval_source:'User approved original flight source v001; layout v002 adds technical spacing, preserving identity and poses.',source_file:source,source_sha256:hash(source),dimensions:[420,560],mode:'RGBA',grid:{columns:3,rows:4,cell:[140,140]},pivot:[70,128],baseline:128,row_order:['down','right','left','up'],frame_order:['upstroke','midstroke','downstroke'],playback_pattern:[0,1,2,1],frame_duration_ms:140,animation_type:'crow-flight-hover',file:output,public_file:publicFile,sha256:hash(output),frames};
  fs.writeFileSync(path.join(root,approved,'cr_mc-0016_cache-crow_spritesheet_v001.json'),JSON.stringify(metadata,null,2)+'\n');
  const master='art-source/approved-masters/cr_mc-0016_cache-crow_master_v001.png';
  const art=await sharp(path.join(root,master)).trim().resize(600,740,{fit:'inside',kernel:'nearest'}).png().toBuffer();
  const artInfo=await sharp(art).metadata();
  const card='public/assets/cards/cache-crow-card_v001.webp';
  await sharp({create:{width:640,height:800,channels:4,background:'#172554'}}).composite([{input:art,left:Math.round((640-artInfo.width)/2),top:Math.round((800-artInfo.height)/2)}]).webp({quality:92}).toFile(path.join(root,card));
  fs.writeFileSync(path.join(root,approved,'cr_mc-0016_cache-crow_card-export_v001.json'),JSON.stringify({id:'MC-0016',source_file:master,source_sha256:hash(master),public_file:card,sha256:hash(card),dimensions:[640,800],method:'Deterministic crop/fit of approved master; no new painted artwork.'},null,2)+'\n');
  console.log(JSON.stringify({output,publicFile,card,scale,frames:frames.length}));
}
main().catch(e=>{console.error(e);process.exit(1)});


