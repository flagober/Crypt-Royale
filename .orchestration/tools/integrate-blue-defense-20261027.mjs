import {chromium} from 'file:///C:/MonsterCrypt_Ecosystem_V1.0/MonsterCrypt_Pulso-Eleitoral/node_modules/@playwright/test/index.mjs';
import fs from 'node:fs';import crypto from 'node:crypto';
const browser=await chromium.launch({channel:'chrome',headless:true});let actors;
try{
 const page=await browser.newPage();await page.goto('http://localhost:5179/blue-defense-preview.html');await page.getByRole('status').filter({hasText:'16 poses separadas'}).waitFor();
 actors=await page.evaluate(async()=>{
  const {isolateTowerPoses}=await import('/class-tower-frames.js');const meta=JSON.parse(document.querySelector('#metadata').textContent),result=[];
  for(const a of meta.actors){
   const isolation={minPoseAreaFraction:.03};
   if(a.id==='warrior-female')isolation.regions=[[0,0,1254,627,2],[0,627,1254,627,2]];
   const img=new Image();img.src='/assets/class-tower-candidates/'+a.id+'-back-attack-candidate-v001.png';await img.decode();
   const canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);
   result.push({id:a.id,file:'./assets/class-tower-candidates/'+a.id+'-back-attack-candidate-v001.png',sheet:[img.width,img.height],isolation,frames:isolateTowerPoses(ctx.getImageData(0,0,img.width,img.height).data,img.width,img.height,isolation).map(({pixels,...f})=>f)});
  }return result;
 });
}finally{await browser.close();}
const file='src/game/tower-art.json',art=JSON.parse(fs.readFileSync(file,'utf8'));
for(const actor of actors){
 const {id,...spec}=actor;spec.direction='back';spec.origin='approved-blue-back-attacks-2026-10-27';
 if(id.startsWith('archer-')){
  const base=art.archers[id.replace('archer-','')];spec.displayHeight=base.displayHeight;
  spec.tip={x:spec.frames[1].pivotX,y:12};base.back=spec;
 }else{
  const base=art.characters.find(c=>c.id===id.replace('warrior-',''));spec.displayHeight=base.directions.front.displayHeight;
  spec.tip={x:spec.frames[2].x+spec.frames[2].width*.9,y:spec.frames[2].y+24};base.directions.back=spec;
 }
}
art.approvedBackAttackOn='2026-10-27';fs.writeFileSync(file,JSON.stringify(art,null,2)+'\n');
fs.writeFileSync('public/assets/class-tower-candidates/approval-blue-back-attacks-20261027.json',JSON.stringify({status:'approved',approvedOn:'2026-10-27',userApproval:'Aprovo o visual das quatro',direction:'up/back',globalFlipAllowed:false,actors:actors.map(a=>({...a,sha256:crypto.createHash('sha256').update(fs.readFileSync('public/'+a.file.replace(/^\.\//,''))).digest('hex')}))},null,2)+'\n');
console.log('Quatro vistas aprovadas registradas; PNGs originais preservados.');
