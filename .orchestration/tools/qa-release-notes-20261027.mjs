import assert from 'node:assert/strict';
import {chromium} from 'file:///C:/MonsterCrypt_Ecosystem_V1.0/MonsterCrypt_Pulso-Eleitoral/node_modules/@playwright/test/index.mjs';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{for(const width of [320,390,1440]){
 const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(process.argv[2]||'http://localhost:5179/');await page.getByRole('button',{name:'Pular apresentação',exact:true}).click();await page.getByRole('button',{name:'Ver notas da versão',exact:true}).waitFor();
 const before=await page.evaluate(()=>localStorage.getItem('cryptroyale.activities.v1'));
 await page.getByRole('button',{name:'Ver notas da versão',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.getByRole('heading',{name:'Notas das versões',exact:true}).waitFor();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'overflow '+width);
 if(width===390)await page.screenshot({path:'C:/MonsterCrypt_Ecosystem_V1.0/Crypt-Royale/docs/beta-notas-20261027.png'});
 await dialog.getByRole('button',{name:'Ver arquivo completo do histórico',exact:true}).click();assert.match(await dialog.locator('pre').innerText(),/v0\.13/);await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});assert.equal(await page.evaluate(()=>localStorage.getItem('cryptroyale.activities.v1')),before);assert.deepEqual(errors,[]);await context.close();console.log('NOTES_UI_SAVE_PRESERVED_OK '+width);
}}finally{await browser.close();}
