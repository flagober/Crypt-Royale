import {chromium} from 'file:///C:/MonsterCrypt_Ecosystem_V1.0/MonsterCrypt_Pulso-Eleitoral/node_modules/@playwright/test/index.mjs';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
const page=await browser.newPage();await page.goto('http://localhost:5179/blue-defense-preview.html');await page.getByRole('status').filter({hasText:'16 poses separadas'}).waitFor();
console.log(JSON.stringify(await page.evaluate(async()=>{
 const {isolatePoses}=await import('/class-tower-frames.js'),meta=JSON.parse(document.querySelector('#metadata').textContent),result=[];
 for(const spec of meta.actors){
  const image=new Image();image.src='/assets/class-tower-candidates/'+spec.id+'-back-attack-candidate-v001.png';await image.decode();
  const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const c=canvas.getContext('2d',{willReadFrequently:true});c.drawImage(image,0,0);
  try{const f=isolatePoses(c.getImageData(0,0,image.width,image.height).data,image.width,image.height,{minArea:Math.floor(image.width*image.height*.03)});
   result.push({id:spec.id,layout:'components',frames:f.map(({pixels,...frame})=>frame)});
  }catch(e){result.push({id:spec.id,error:e.message});}
 }
 return result;
}),null,2));
}finally{await browser.close();}
