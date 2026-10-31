import {chromium} from 'file:///C:/MonsterCrypt_Ecosystem_V1.0/MonsterCrypt_Pulso-Eleitoral/node_modules/@playwright/test/index.mjs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const shot=name=>page.screenshot({path:`docs/${name}-20261027.png`});
const sound=()=>page.getByRole('button',{name:'Controle de Áudio',exact:true});
const bounds=()=>page.locator('#audio-panel').evaluate(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,w:innerWidth,h:innerHeight};});
const timer=async()=>{const text=await page.locator('main header').first().innerText();const m=text.match(/(\d+):(\d{2})/);return Number(m[1])*60+Number(m[2]);};
async function choose(name){
 await page.getByRole('button',{name:'Menu de opções',exact:true}).click();
 await page.getByRole('button',{name:/Mapas e fases/}).click();
 await page.getByRole('button',{name:new RegExp(name)}).click();
 await page.getByRole('button',{name:'Usar este mapa',exact:true}).click();
 await page.waitForFunction(()=>!document.body.innerText.includes('Carregando cenário')&&!document.body.innerText.includes('Carregando artes das classes'));
}
try{
 await page.goto('http://localhost:5179/');await page.locator('canvas').waitFor();
 await page.waitForFunction(()=>!document.body.innerText.includes('Carregando cenário')&&!document.body.innerText.includes('Carregando artes das classes'));
 for(const size of [{width:1440,height:1000},{width:320,height:568},{width:400,height:300}]){
  await page.setViewportSize(size);await sound().click();
  await page.locator('#audio-panel').waitFor();assert.equal(await sound().getAttribute('aria-expanded'),'true');
  assert(await sound().isVisible());const b=await bounds();assert(b.x>=7&&b.y>=7&&b.right<=b.w-7&&b.bottom<=b.h-7,JSON.stringify(b));
  if(size.width===1440)await shot('audio-ajustado');
  await page.keyboard.press('Escape');assert.equal(await sound().getAttribute('aria-expanded'),'false');assert(await sound().evaluate(e=>e===document.activeElement));
 }
 await page.setViewportSize({width:1440,height:1000});
 await sound().click();await page.getByLabel('Trilha Sonora',{exact:true}).selectOption('automatic');
 await page.getByRole('button',{name:'Fechar Áudio',exact:true}).click();
 await page.getByRole('button',{name:'Abrir central de atividades',exact:true}).click();
 await page.waitForFunction(()=>[...document.querySelectorAll('.av2-wallet-art')].every(i=>i.complete&&i.naturalWidth>0));
 assert.equal(await page.locator('.av2-wallet-art').count(),4);assert.equal(await page.locator('.av2-tab-art').count(),3);
 await shot('central-icones');
 for(const name of ['Semana e eventos','Recompensas','Rotina diária']){await page.getByRole('button',{name,exact:true}).click();assert.equal(await page.locator('.av2-tab[aria-pressed=true]').count(),1);}
 for(const width of [390,320,768]){
  await page.setViewportSize({width,height:844});
  assert(await page.locator('.av2-overlay').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
  if(width===390)await shot('central-icones-mobile');
 }
 await page.getByRole('button',{name:'Fechar central de atividades',exact:true}).click();
 await page.setViewportSize({width:1440,height:1000});
 const before=await timer();await choose('Minas de Cobre');const after=await timer();assert(after<=before&&after>=before-5,{before,after});
 assert.equal(await page.evaluate(()=>localStorage.getItem('crypt-royale-map-v1')),'copper-mines');
 await shot('mapa-minas');await page.reload();await page.waitForFunction(()=>!document.body.innerText.includes('Carregando cenário')&&!document.body.innerText.includes('Carregando artes das classes'));
 assert(await page.locator('h1').innerText().then(t=>t.includes('Minas de Cobre')));
 await choose('Bosque de Circuitos');await shot('mapa-bosque');
 await choose('Vila Byte');await shot('mapa-vila-byte');
 await page.getByRole('button',{name:'Menu de opções',exact:true}).click();await page.getByRole('button',{name:/Mapas e fases/}).click();
 await page.waitForFunction(()=>[...document.querySelectorAll('.map-choice img')].every(i=>i.complete&&i.naturalWidth>0));
 await shot('mapas-selecao');
 const focused=await page.evaluate(()=>document.activeElement?.textContent);await page.waitForTimeout(400);assert.equal(await page.evaluate(()=>document.activeElement?.textContent),focused);
 await page.setViewportSize({width:320,height:568});assert(await page.locator('.map-overlay').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
 await page.keyboard.press('Escape');assert.equal(await page.locator('.map-overlay').count(),0);
 assert.deepEqual(errors,[]);console.log(JSON.stringify({ok:true,audio:'desktop/mobile/short',maps:3,activityWidths:[320,390,768],errors}));
}finally{await browser.close();}
