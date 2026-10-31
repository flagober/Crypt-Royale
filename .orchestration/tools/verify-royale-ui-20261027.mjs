import {chromium} from 'file:///C:/MonsterCrypt_Ecosystem_V1.0/MonsterCrypt_Pulso-Eleitoral/node_modules/@playwright/test/index.mjs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://localhost:5179/');
 const art=await page.evaluate(async()=>{const {prepareTowerArt}=await import('/src/game/tower-assets.js');const a=await prepareTowerArt();return {archers:Object.values(a.archers).map(x=>x.back.surfaces.length),heroes:Object.values(a.characters).map(x=>x.back.surfaces.length)};});
 assert.deepEqual(art,{archers:[4,4],heroes:[4,4]});await page.screenshot({path:'docs/defesa-azul-integrada-20261027.png',fullPage:true});
 await page.getByRole('button',{name:'Abrir central de atividades',exact:true}).click();await page.getByRole('heading',{name:'Sua jornada continua'}).waitFor();
 assert.equal(await page.locator('.av2-toast').count(),0);
 await page.getByRole('button',{name:/Receber check-in/}).dblclick();
 await page.waitForFunction(()=>localStorage.getItem('cryptroyale.activities.v1')!==null);
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('cryptroyale.activities.v1')));assert.equal(stored.wallet.gold,30);assert.equal(stored.receipts.length,1);
 await page.getByRole('button',{name:'Fechar central de atividades',exact:true}).click();await page.reload();await page.getByRole('button',{name:'Abrir central de atividades',exact:true}).click();
 assert.equal(await page.locator('.av2-toast').count(),0);assert(await page.getByRole('button',{name:/Check-in de hoje resgatado/}).isDisabled());
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('cryptroyale.activities.v1')).wallet.gold),30);
 await page.goto('http://localhost:5179/activities-preview.html');await page.getByRole('heading',{name:'Sua jornada continua'}).waitFor();
 await page.waitForFunction(()=>[...document.querySelectorAll('img')].every(i=>i.complete&&i.naturalWidth>0));
 assert.equal(await page.locator('.av2-checkin-day:visible').count(),7);assert.equal(await page.locator('.av2-toast').count(),0);
 const alpha=await page.evaluate(async()=>{const result=[];for(const name of ['chest','coins','fragments','gift']){const i=new Image();i.src='/assets/rewards/vila-byte-'+name+'-v001.png';await i.decode();const c=document.createElement('canvas');c.width=i.width;c.height=i.height;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(i,0,0);result.push({name,alpha:x.getImageData(0,0,1,1).data[3]});}return result;});assert(alpha.every(x=>x.alpha===0));
 await page.screenshot({path:'docs/central-atividades-20261027.png',fullPage:true});
 const wallet=page.locator('.av2-wallet-card').filter({hasText:'Gold'});assert.match(await wallet.innerText(),/360/);
 const checkin=page.getByRole('button',{name:/Receber check-in/});await checkin.click();await page.locator('.av2-toast').waitFor();assert.match(await wallet.innerText(),/410/);assert(await page.getByRole('button',{name:/Check-in de hoje resgatado/}).isDisabled());
 await page.waitForTimeout(2500);assert.equal(await page.locator('.av2-toast').count(),0);
 for(const tab of ['Semana e eventos','Recompensas','Rotina diária'])await page.getByRole('button',{name:tab,exact:true}).click();
 for(const width of [320,390,768]){await page.setViewportSize({width,height:844});const size=await page.locator('.av2-overlay').evaluate(el=>({scroll:el.scrollWidth,width:el.clientWidth}));assert(size.scroll<=size.width,JSON.stringify({width,...size}));}
 await page.setViewportSize({width:390,height:844});await page.reload();await page.getByRole('heading',{name:'Sua jornada continua'}).waitFor();await page.waitForFunction(()=>[...document.querySelectorAll('img')].every(i=>i.complete&&i.naturalWidth>0));await page.screenshot({path:'docs/central-atividades-mobile-20261027.png',fullPage:true});
 await page.emulateMedia({reducedMotion:'reduce'});await page.getByRole('button',{name:/Receber check-in/}).click();assert.equal(await page.locator('.av2-particle').first().evaluate(el=>getComputedStyle(el).display),'none');
 assert.deepEqual(errors,[]);console.log(JSON.stringify({backPoses:16,rewardImagesAlpha:true,checkinAmountsPreserved:true,realAppDoubleClickOnce:true,realAppReloadPreservesClaim:true,toastMount:false,toastClaim:true,mobile:[320,390,768],reducedMotion:true,errors}));
}finally{await browser.close();}
