import {chromium} from 'file:///C:/MonsterCrypt_Ecosystem_V1.0/MonsterCrypt_Pulso-Eleitoral/node_modules/@playwright/test/index.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1160,height:1050}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://localhost:5179/blue-defense-preview.html');
 await page.getByRole('status').filter({hasText:'16 poses separadas'}).waitFor();
 await page.locator('#play').click();
 const meta=JSON.parse(await page.locator('#metadata').textContent());
 assert.equal(meta.status,'candidate');assert.equal(meta.actors.length,4);
 await page.screenshot({path:'docs/defesa-azul-revisao-20261027.png',fullPage:true});
 for(const value of ['warrior-male','warrior-female']){
   await page.locator('#core').selectOption(value);
   for(let i=0;i<4;i++){await page.locator('#next').click();assert.match(await page.locator('#phase').textContent(),/vista de costas/);}
 }
 const result=await page.evaluate(async meta=>{
   const {isolatePoses}=await import('/class-tower-frames.js');
   const canvas=document.createElement('canvas');canvas.width=1280;canvas.height=1160;
   const ctx=canvas.getContext('2d');ctx.fillStyle='#081522';ctx.fillRect(0,0,1280,1160);
   const names={'archer-female':'Arqueira','archer-male':'Arqueiro','warrior-male':'Guerreiro','warrior-female':'Guerreira'};
   const phases=['Pronto','Preparação','Disparo / golpe','Recuperação'],metrics=[];
   ctx.fillStyle='#e5f7ff';ctx.font='bold 25px system-ui';ctx.fillText('DEFESA AZUL — REVISÃO DAS 16 POSES',24,36);
   ctx.fillStyle='#a7d5e1';ctx.font='16px system-ui';ctx.fillText('Vista de costas / para cima · candidatas, ainda fora do combate',24,64);
   for(const [row,spec] of meta.actors.entries()){
     const img=new Image();img.src='/assets/class-tower-candidates/'+spec.id+'-back-attack-candidate-v001.png';await img.decode();
     const source=document.createElement('canvas');source.width=img.width;source.height=img.height;const sourceCtx=source.getContext('2d',{willReadFrequently:true});sourceCtx.drawImage(img,0,0);
     const scale=185/Math.max(...spec.frames.map(f=>f.height));
     for(let col=0;col<4;col++){
       const x0=Math.floor((col%2)*img.width/2),y0=Math.floor(Math.floor(col/2)*img.height/2);
       const w=Math.floor((col%2+1)*img.width/2)-x0,h=Math.floor((Math.floor(col/2)+1)*img.height/2)-y0;
       const [f]=isolatePoses(sourceCtx.getImageData(x0,y0,w,h).data,w,h,{count:1,minArea:Math.floor(w*h*.1)});
       const frame=document.createElement('canvas');frame.width=f.width;frame.height=f.height;frame.getContext('2d').putImageData(new ImageData(f.pixels,f.width,f.height),0,0);
       const left=16+col*316,top=88+row*265,cx=left+150,foot=top+237;
       ctx.fillStyle='#103245';ctx.fillRect(left,top,304,253);ctx.fillStyle='#dff5ff';ctx.font='bold 17px system-ui';ctx.fillText(names[spec.id]+' · '+phases[col],left+10,top+24);
       ctx.strokeStyle='#50afbf';ctx.beginPath();ctx.moveTo(left+12,foot);ctx.lineTo(left+292,foot);ctx.stroke();
       ctx.drawImage(frame,cx-f.pivotX*scale,foot-f.pivotY*scale,f.width*scale,f.height*scale);
       metrics.push({actor:spec.id,pose:col,bounds:[f.x,f.y,f.width,f.height],pivot:[f.pivotX,f.pivotY],cell:[w,h],touchesCell:f.x===0||f.y===0||f.x+f.width===w||f.y+f.height===h});
     }
   }
   return {png:canvas.toDataURL('image/png').split(',')[1],metrics};
 },meta);
 fs.writeFileSync('docs/defesa-azul-16-poses-20261027.png',Buffer.from(result.png,'base64'));
 await page.setViewportSize({width:390,height:844});await page.reload();await page.getByRole('status').filter({hasText:'16 poses separadas'}).waitFor();
 const mobile=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:innerWidth}));assert(mobile.width<=mobile.viewport);
 assert.deepEqual(errors,[]);
 const report={status:'candidate',poseCount:result.metrics.length,mobile,errors,metrics:result.metrics};
 fs.writeFileSync('.orchestration/qa-blue-defense-20261027.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify({poseCount:report.poseCount,mobile,errors,touchesCell:result.metrics.filter(m=>m.touchesCell).map(({actor,pose})=>({actor,pose}))}));
}finally{await browser.close();}
