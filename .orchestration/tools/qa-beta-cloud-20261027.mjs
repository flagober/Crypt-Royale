import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from 'file:///C:/MonsterCrypt_Ecosystem_V1.0/MonsterCrypt_Pulso-Eleitoral/node_modules/@playwright/test/index.mjs';
import {createProgress} from '../../src/game/activities.js';
const root='C:/MonsterCrypt_Ecosystem_V1.0/Crypt-Royale',config=JSON.parse(fs.readFileSync(root+'/src/firebase-config.json','utf8'));
const authBase='https://identitytoolkit.googleapis.com/v1/accounts:',db='https://firestore.googleapis.com/v1/projects/'+config.projectId+'/databases/(default)/documents';
const users=[],errors=[];let browser;
const authPost=async(name,body)=>{const r=await fetch(authBase+name+'?key='+config.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await r.json();if(!r.ok)throw Error(name+' failed '+data.error?.message);return data;};
const http=async(path,user,method='GET',body)=>{const r=await fetch(db+path,{method,headers:{'Content-Type':'application/json',...(user?{Authorization:'Bearer '+user.idToken}:{})},body:body?JSON.stringify(body):undefined});return {status:r.status,body:await r.json().catch(()=>({}))};};
function write(user,revision,profile){return {writes:[{update:{name:`projects/${config.projectId}/databases/(default)/documents/cryptroyale_saves/${user.localId}`,fields:{owner:{stringValue:user.localId},schema:{integerValue:'1'},revision:{integerValue:String(revision)},profileJson:{stringValue:JSON.stringify(profile)}}},updateTransforms:[{fieldPath:'updatedAt',setToServerValue:'REQUEST_TIME'}]}]};}
try{
 for(let i=0;i<2;i++){const email=`royale-qa-${Date.now()}-${i}@example.invalid`,password=crypto.randomBytes(24).toString('base64url');const u=await authPost('signUp',{email,password,returnSecureToken:true});users.push({...u,password,email});}
 const [a,b]=users,profile=createProgress();profile.wallet.gold=375;profile.wallet.xp=110;profile.wallet.dataFragments=1;profile.wallet.cards['copper-mole']=3;
 const saved=await http(':commit',a,'POST',write(a,1,profile));assert.equal(saved.status,200,JSON.stringify(saved.body));
 assert.equal((await http('/cryptroyale_saves/'+a.localId,null)).status,403);
 assert.equal((await http('/cryptroyale_saves/'+a.localId,b)).status,403);
 assert.equal((await http(':commit',b,'POST',write(a,2,profile))).status,403);
 assert.equal((await http(':commit',a,'POST',write(a,3,profile))).status,403);
 assert.equal((await http('/cryptroyale_saves/'+a.localId,a)).status,200);
 console.log('LIVE_RULES_OWNERSHIP_AND_REVISION_OK');
 browser=await chromium.launch({channel:'chrome',headless:true});
 const c=await browser.newContext({viewport:{width:1440,height:1000}}),page=await c.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto('http://localhost:5179/');await page.getByRole('heading',{name:'Bem-vindo a Vila Byte!'}).waitFor();await page.screenshot({path:root+'/docs/beta-abertura-20261027.png'});await page.getByRole('button',{name:'Pular apresentação'}).click();
 await page.getByRole('button',{name:'Minha conta e progresso'}).click();await page.getByLabel('E-mail',{exact:true}).fill(a.email);await page.getByLabel('Senha',{exact:true}).fill(a.password);await page.getByRole('button',{name:'Entrar com e-mail',exact:true}).click();await page.getByText('Progresso salvo na conta',{exact:true}).first().waitFor({timeout:40000});await page.screenshot({path:root+'/docs/beta-conta-20261027.png'});
 await page.getByRole('button',{name:'Fechar conta',exact:true}).click();assert.equal(await page.locator('.prg-ws-card__val').first().innerText(),'375');
 // Independent browser profile represents another device, sharing only this disposable account.
 const c2=await browser.newContext({viewport:{width:390,height:844}}),p2=await c2.newPage();p2.on('pageerror',e=>errors.push(e.message));await p2.goto('http://localhost:5179/');await p2.getByRole('button',{name:'Pular apresentação'}).click();await p2.getByRole('button',{name:'Minha conta e progresso'}).click();await p2.getByLabel('E-mail',{exact:true}).fill(a.email);await p2.getByLabel('Senha',{exact:true}).fill(a.password);await p2.getByRole('button',{name:'Entrar com e-mail',exact:true}).click();await p2.getByText('Progresso salvo na conta',{exact:true}).first().waitFor({timeout:40000});await p2.screenshot({path:root+'/docs/beta-celular-20261027.png'});await p2.getByRole('button',{name:'Fechar conta',exact:true}).click();
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'overflow '+width);}
 await page.setViewportSize({width:1440,height:1000});await page.getByRole('button',{name:'Abrir central de atividades',exact:true}).click();
 // Use the real reward button; the backend transaction records the only accepted claim.
 const buttons=await page.getByRole('button').allTextContents();console.log('ACTIVITY_BUTTONS '+JSON.stringify(buttons.filter(t=>/check|hoje|receber|resgatar/i.test(t)).slice(0,10)));
 const claim=page.getByRole('button',{name:/Receber.*hoje|Resgatar.*hoje|Receber recompensa|Fazer check-in/i}).first();
 if(await claim.count()){await claim.click();await page.waitForFunction(()=>{const e=Object.keys(localStorage).find(k=>/^cryptroyale.player.v1\.[^.]+$/.test(k));if(!e)return false;const p=JSON.parse(localStorage.getItem(e));return !p.pending&&p.profile.wallet.gold>375;},{},{timeout:30000});}
 await p2.reload();await p2.getByRole('button',{name:'Minha conta e progresso'}).waitFor();await p2.getByRole('button',{name:'Minha conta e progresso'}).click();await p2.getByText('Progresso salvo na conta',{exact:true}).first().waitFor({timeout:30000});
 assert.equal(errors.length,0,errors.join('\n'));console.log('LIVE_EMAIL_LOGIN_TWO_DEVICES_AND_RESPONSIVE_OK');
}finally{
 await browser?.close();
 for(const u of users){await http('/cryptroyale_saves/'+u.localId,u,'DELETE');await authPost('delete',{idToken:u.idToken});}
 console.log('DISPOSABLE_QA_ACCOUNTS_REMOVED');
}
