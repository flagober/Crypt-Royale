import {chromium} from 'file:///C:/MonsterCrypt_Ecosystem_V1.0/MonsterCrypt_Pulso-Eleitoral/node_modules/@playwright/test/index.mjs';
import assert from 'node:assert/strict';
import {createProgress} from '../../src/game/activities.js';
import {createProgression} from '../../src/game/progression.js';
const browser=await chromium.launch({channel:'chrome',headless:true});const errors=[];
async function fixture(rich=false){const p=createProgress();p.wallet={gold:rich?10000:375,xp:110,dataFragments:1,cards:{'bit-bug':rich?100:2}};if(rich){p.progression=createProgression();p.progression.classes.warrior.cards=20;}
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(({profile})=>{if(!localStorage.getItem('qa-progression-ready')){localStorage.setItem('cryptroyale.activities.v1',JSON.stringify(profile));localStorage.setItem('qa-progression-ready','1');}}, {profile:p});await page.goto('http://localhost:5179/');await page.locator('canvas').waitFor();return page;}
const saved=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('cryptroyale.activities.v1')));
const noOverflow=async(p,selector)=>assert(await p.locator(selector).evaluate(e=>e.scrollWidth<=e.clientWidth+1),selector);
try{
 const p=await fixture();await p.getByRole('button',{name:'Coleção e evoluções',exact:true}).click();
 await p.getByRole('heading',{name:'Seu poder evolui com você'}).waitFor();assert.equal(await p.locator('.prg-mon').count(),16);
 assert.match(await p.locator('.prg-header').innerText(),/Nível 2/);
 const upgrade=p.getByRole('button',{name:'Melhorar Bit Bug · Nv. 2',exact:true});await upgrade.evaluate(b=>{b.click();b.click();});
 await p.waitForFunction(()=>JSON.parse(localStorage.getItem('cryptroyale.activities.v1')).progression?.monsters['bit-bug'].level===2);
 let s=await saved(p);assert.equal(s.wallet.gold,350);assert.equal(s.wallet.xp,110);assert.equal(s.wallet.dataFragments,1);assert.equal(s.wallet.cards['bit-bug'],0);
 await p.reload();await p.getByRole('button',{name:'Coleção e evoluções',exact:true}).click();assert.match(await p.locator('.prg-mon').first().innerText(),/Nv\. 2/);
 await p.waitForFunction(()=>[...document.querySelectorAll('.prg-mon__art')].every(i=>i.complete&&i.naturalWidth>0));
 await p.getByRole('button',{name:'Só minhas cartas',exact:true}).click();assert.equal(await p.locator('.prg-mon').count(),1);await p.getByRole('button',{name:'Só minhas cartas',exact:true}).click();assert.equal(await p.locator('.prg-mon').count(),16);
 await p.screenshot({path:'docs/progressao-colecao-20261027.png'});
 for(const width of [320,390,768]){await p.setViewportSize({width,height:844});await noOverflow(p,'.prg-overlay');if(width===390)await p.screenshot({path:'docs/progressao-mobile-20261027.png'});}
 await p.setViewportSize({width:1440,height:1000});await p.getByRole('button',{name:'Campanha',exact:true}).click();
 assert.equal(await p.getByRole('button',{name:'Jogar fase 1',exact:true}).isEnabled(),true);assert.equal(await p.locator('.prg-stage__btn:disabled').count(),8);await noOverflow(p,'.prg-overlay');
 await p.screenshot({path:'docs/progressao-campanha-20261027.png'});
 await p.getByRole('button',{name:'Jogar fase 1',exact:true}).click();assert.equal(await p.locator('.prg-overlay').count(),0);assert.match(await p.locator('main header').first().innerText(),/Campanha · Fase 1/i);
 await p.locator('button[title^="Bit Bug"]').click();const canvas=p.locator('canvas'),b=await canvas.boundingBox();await canvas.click({position:{x:b.width*80/360,y:b.height*430/560}});
 // Isolated React development fixture: finish the actual UI-owned match; never a real player profile.
 await p.evaluate(()=>{const c=document.querySelector('canvas'),key=Object.keys(c).find(k=>k.startsWith('__reactFiber$'));let f=c[key],g;
  while(f){if(f.memoizedProps?.gameRef){g=f.memoizedProps.gameRef.current;break;}f=f.return;}
  if(!g||!g.activityStats.cardsUsed['bit-bug'])throw Error('Manual deployment not registered');
  g.nowMs=31000;g.remainingMs=149000;g.towers.find(t=>t.id==='enemy-core').hp=0;
 });
 await p.waitForFunction(()=>JSON.parse(localStorage.getItem('cryptroyale.activities.v1')).progression?.campaign.completed['stage-1']);
 s=await saved(p);assert.equal(s.wallet.gold,525);assert.equal(s.wallet.xp,230);assert.equal(s.wallet.cards['bit-bug'],4);assert.equal(s.progression.classes.warrior.cards,2);assert.equal(s.receipts.filter(r=>r.key.startsWith('campaign:')).length,1);
 await p.getByRole('button',{name:'Ver campanha e próxima fase',exact:true}).click();assert(await p.getByRole('button',{name:'Jogar fase 2',exact:true}).isEnabled());assert.equal(await p.locator('.prg-stage__btn:disabled').count(),7);
 await p.reload();s=await saved(p);assert.equal(s.wallet.gold,525);await p.getByRole('button',{name:'Menu de opções',exact:true}).click();await p.getByRole('button',{name:'Coleção, recursos e evoluções',exact:true}).click();assert.equal(await p.locator('.prg-overlay').count(),1);await p.keyboard.press('Escape');assert.equal(await p.locator('.prg-overlay').count(),0);
 const r=await fixture(true);await r.getByRole('button',{name:'Coleção e evoluções',exact:true}).click();await r.getByRole('button',{name:'Evoluir Bit Bug',exact:true}).click();await r.waitForFunction(()=>JSON.parse(localStorage.getItem('cryptroyale.activities.v1')).progression.monsters['bit-bug'].form===1);s=await saved(r);assert.equal(s.wallet.cards['bit-bug'],80);assert.equal(s.wallet.gold,9500);assert.match(await r.locator('.prg-mon').first().innerText(),/Bit Bug Mk-II/);
 await r.getByRole('button',{name:'Classes',exact:true}).click();await r.getByRole('button',{name:'Melhorar classe Guerreiro / Guerreira · Nv. 2',exact:true}).click();await r.waitForFunction(()=>JSON.parse(localStorage.getItem('cryptroyale.activities.v1')).progression.classes.warrior.level===2);await r.locator('#branch-warrior').selectOption('paladin');await r.getByRole('button',{name:'Especializar em Paladino / Paladina',exact:true}).click();await r.waitForFunction(()=>JSON.parse(localStorage.getItem('cryptroyale.activities.v1')).progression.classes.warrior.branch==='paladin');s=await saved(r);assert.equal(s.progression.classes.warrior.cards,8);assert.equal(s.wallet.gold,8975);
 await r.setViewportSize({width:320,height:568});await noOverflow(r,'.prg-overlay');await r.getByRole('button',{name:'Campanha',exact:true}).click();await noOverflow(r,'.prg-overlay');await r.getByRole('button',{name:'Fechar coleção',exact:true}).click();assert.equal(await r.evaluate(()=>document.documentElement.scrollWidth),320);
 assert.deepEqual(errors,[]);console.log(JSON.stringify({ok:true,legacyPreserved:true,upgradeEvolveClassSaved:true,actualUiCampaignFinish:true,widths:[320,390,768,1440],errors}));
}finally{await browser.close();}
