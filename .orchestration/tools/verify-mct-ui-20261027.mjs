import {chromium} from 'file:///C:/MonsterCrypt_Ecosystem_V1.0/MonsterCrypt_Pulso-Eleitoral/node_modules/@playwright/test/index.mjs';
import {createProgress} from '../../src/game/activities.js';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true}),errors=[];
const p=await browser.newPage({viewport:{width:1440,height:1000}}),profile=createProgress();profile.wallet={gold:375,xp:110,dataFragments:1,cards:{'bit-bug':2}};
p.on('pageerror',e=>errors.push(e.message));
try{
 await p.addInitScript(v=>{if(!localStorage.getItem('cryptroyale.activities.v1'))localStorage.setItem('cryptroyale.activities.v1',JSON.stringify(v));},profile);
 await p.goto('http://localhost:5179/');await p.getByRole('button',{name:'MCT · Integração pendente · Ver token',exact:true}).waitFor();
 const before=await p.evaluate(()=>localStorage.getItem('cryptroyale.activities.v1'));
 await p.waitForFunction(()=>!document.body.innerText.includes('Carregando artes das classes')&&!document.body.innerText.includes('Carregando cenário'));
 await p.screenshot({path:'docs/mct-carteira-20261027.png'});
 await p.getByRole('button',{name:'MCT · Integração pendente · Ver token',exact:true}).click();
 await p.getByRole('heading',{name:'Token MCT',exact:true}).waitFor();assert.equal(await p.locator('.mct-info__balance strong').innerText(),'— MCT');
 assert.match(await p.locator('.mct-info').innerText(),/ainda não estão habilitadas/);await p.screenshot({path:'docs/mct-painel-20261027.png'});
 for(const width of [320,390,768,1440]){await p.setViewportSize({width,height:844});assert(await p.locator('.prg-overlay').evaluate(e=>e.scrollWidth<=e.clientWidth+1));}
 await p.getByRole('button',{name:'Fechar coleção',exact:true}).click();await p.setViewportSize({width:1440,height:1000});
 await p.getByRole('button',{name:'Abrir central de atividades',exact:true}).click();await p.locator('.av2-overlay').getByRole('button',{name:'MCT · Integração pendente · Ver token',exact:true}).click();await p.getByRole('heading',{name:'Token MCT',exact:true}).waitFor();
 assert.equal(await p.locator('.av2-overlay').count(),0);await p.getByRole('button',{name:'Fechar coleção',exact:true}).click();
 await p.getByRole('button',{name:'Menu de opções',exact:true}).click();await p.getByRole('button',{name:'Token MCT',exact:true}).click();await p.getByRole('heading',{name:'Token MCT',exact:true}).waitFor();await p.keyboard.press('Escape');
 await p.setViewportSize({width:320,height:568});assert.match(await p.getByLabel('Seus recursos, coleção e campanha',{exact:true}).innerText(),/MCT —/);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),320);
 const after=await p.evaluate(()=>localStorage.getItem('cryptroyale.activities.v1'));assert.equal(after,before);assert.equal(Object.hasOwn(JSON.parse(after).wallet,'mct'),false);assert.deepEqual(errors,[]);
 console.log(JSON.stringify({ok:true,mct:'visible with pending integration, no fake balance',walletUnchanged:true,widths:[320,390,768,1440],errors}));
}finally{await browser.close();}
