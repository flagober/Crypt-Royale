import test from 'node:test';
import assert from 'node:assert/strict';
import {PlayerStore,accountKey} from './player-store.js';
import {createProgress,recordBattle} from './game/activities.js';
import {PROGRESS_KEY} from './activities-storage.js';
import {applyGift} from './mailbox.js';
import {prepareVipCommit} from './vip-transaction.js';
const storage=()=>{const map=new Map();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v)),map};};
const add=p=>{p.wallet.gold+=10;return p;};
function remote(){const docs=new Map();let online=true;return {docs,set online(x){online=x;},async read(uid){if(!online)throw {code:'unavailable'};return docs.has(uid)?structuredClone(docs.get(uid)):null;},async commit(uid,expected,profile){if(!online)throw {code:'unavailable'};const old=docs.get(uid);if((old?.revision||0)!==expected)throw {code:'save-conflict'};docs.set(uid,{revision:expected+1,profile:structuredClone(profile)});return expected+1;}};}
test('guest remains separate: first account requires explicit import and logout restores guest',async()=>{
 const local=storage(),r=remote(),s=new PlayerStore(local,r);await s.connect(null);await s.update(add);const raw=local.getItem(PROGRESS_KEY);
 await s.connect('A');assert.equal(s.state.status,'choose');assert.equal(r.docs.size,0);await s.begin(true);assert.equal(r.docs.get('A').profile.wallet.gold,10);await s.update(add);await s.connect(null);assert.equal(s.state.profile.wallet.gold,10);assert.equal(local.getItem(PROGRESS_KEY),raw);await s.connect('B');await s.begin(false);assert.equal(s.state.profile.wallet.gold,0);assert.equal(r.docs.get('A').profile.wallet.gold,20);
});
test('second device restores the entire profile; same rewards are not added twice',async()=>{
 const r=remote(),a=new PlayerStore(storage(),r),b=new PlayerStore(storage(),r);await a.connect('A');await a.begin();await a.update(p=>{add(p);p.wallet.cards['copper-mole']=4;p.checkin.cursor=2;return p;});await b.connect('A');assert.deepEqual(b.state.profile,a.state.profile);assert.equal(b.state.profile.wallet.gold,10);assert.equal(b.state.status,'synced');
});

test('legacy forms and additive Job survive offline restart and account sync without duplicate battle XP',async()=>{
 const r=remote(),local=storage(),old=createProgress();delete old.progression.career;
 old.wallet.xp=110;old.progression.monsters['bit-bug'].form=2;old.progression.classes.warrior.branch='paladin';
 r.docs.set('career',{revision:1,profile:old});const a=new PlayerStore(local,r);await a.connect('career');
 const match={id:'career-offline-match',winner:'player',durationMs:60000,automaticUsed:false,cardsUsed:{'bit-bug':1}};
 r.online=false;await a.update(p=>recordBattle(p,match));assert.equal(a.state.status,'offline');
 const restored=new PlayerStore(local,r);await restored.connect('career');assert.equal(restored.state.profile.progression.career.jobXp.warrior,20);
 r.online=true;await restored.sync();const b=new PlayerStore(storage(),r);await b.connect('career');await b.update(p=>recordBattle(p,match));
 assert.equal(b.state.profile.progression.career.jobXp.warrior,20);assert.equal(b.state.profile.progression.career.jobXp.archer,20);
 assert.equal(b.state.profile.wallet.xp,110);assert.equal(b.state.profile.progression.monsters['bit-bug'].form,2);assert.equal(b.state.profile.progression.classes.warrior.branch,'paladin');
 assert.deepEqual(r.docs.get('career').profile,b.state.profile);
});
test('offline progress survives restart and uploads with the original revision',async()=>{
 const local=storage(),r=remote(),s=new PlayerStore(local,r);await s.connect('A');await s.begin();r.online=false;await s.update(add);assert.equal(s.state.status,'offline');const restored=new PlayerStore(local,r);await restored.connect('A');assert.equal(restored.state.profile.wallet.gold,10);assert.equal(restored.state.pending,true);r.online=true;await restored.sync();assert.equal(r.docs.get('A').profile.wallet.gold,10);assert.equal(restored.state.pending,false);
});
test('two-device race never overwrites the newer cloud save or merges wallets',async()=>{
 const r=remote(),local=storage(),a=new PlayerStore(local,r),b=new PlayerStore(storage(),r);await a.connect('A');await a.begin();await b.connect('A');r.online=false;await a.update(add);r.online=true;await b.update(p=>{p.wallet.gold=90;return p;});await a.sync();assert.equal(a.state.status,'conflict');assert.equal(r.docs.get('A').profile.wallet.gold,90);assert.equal(a.state.profile.wallet.gold,10);await assert.rejects(a.update(add));await a.useCloud();assert.equal(a.state.profile.wallet.gold,90);assert.ok([...local.map.keys()].some(k=>k.includes('.conflict.')));
});
test('corrupt local data is preserved and does not upload an empty profile',async()=>{
 const local=storage(),r=remote();local.setItem(accountKey('A'),'broken');const s=new PlayerStore(local,r);await s.connect('A');assert.equal(s.state.status,'error');assert.equal(local.getItem(accountKey('A')),'broken');assert.equal(r.docs.size,0);local.setItem(PROGRESS_KEY,'broken-guest');await s.connect(null);assert.equal(s.state.ready,false);assert.equal(s.state.uid,null);
});
test('queued actions cannot migrate across account changes',async()=>{
 const local=storage(),r=remote(),s=new PlayerStore(local,r);await s.connect('A');await s.begin();const change=s.connect('B');const update=s.update(add);await change;await assert.rejects(update);assert.equal(r.docs.get('A').profile.wallet.gold,0);assert.equal(r.docs.has('B'),false);
});
test('remote permission failure blocks play and preserves pending local save',async()=>{
 const local=storage(),r=remote(),s=new PlayerStore(local,r);await s.connect('A');await s.begin();r.commit=async()=>{throw {code:'permission-denied',message:'Negado'};};await s.update(add);assert.equal(s.state.ready,false);assert.equal(JSON.parse(local.getItem(accountKey('A'))).profile.wallet.gold,10);
});
test('quota exceeded preserves local save, sets status offline, and keeps player ready to continue playing',async()=>{
 const local=storage(),r=remote(),s=new PlayerStore(local,r);await s.connect('A');await s.begin();
 r.commit=async()=>{throw {code:'resource-exhausted',message:'Quota exceeded.'};};
 await s.update(add);
 assert.equal(s.state.ready,true);
 assert.equal(s.state.status,'offline');
 assert.match(s.state.message,/Cota diária/);
 assert.equal(s.state.profile.wallet.gold,10);
 assert.equal(JSON.parse(local.getItem(accountKey('A'))).profile.wallet.gold,10);
 await s.update(add);
 assert.equal(s.state.ready,true);
 assert.equal(s.state.profile.wallet.gold,20);
 assert.equal(JSON.parse(local.getItem(accountKey('A'))).profile.wallet.gold,20);
});
test('offline first-save creation retries instead of conflicting with a missing document',async()=>{
 const local=storage(),r=remote(),s=new PlayerStore(local,r);await s.connect('A');r.online=false;await s.begin();assert.equal(s.state.status,'offline');r.online=true;await s.sync();assert.equal(s.state.status,'synced');assert.equal(r.docs.get('A').revision,1);
});
function giftRemote(){const r=remote(),claims=new Set();r.claimMail=async(uid,revision,id)=>{const saved=r.docs.get(uid);if(saved.revision!==revision)throw {code:'save-conflict'};if(!claims.has(uid+id)){const profile=applyGift(saved.profile,id,{gold:100,xp:10,dataFragments:1,cards:{'bit-bug':2},classCards:{}});r.docs.set(uid,{revision:revision+1,profile});claims.add(uid+id);}return structuredClone(r.docs.get(uid));};return r;}
const mailId='237c63a1-326e-4a5f-8b8e-5d53583c9660';
test('mail requires an account, survives reload and is never doubled on retry',async()=>{
 const local=storage(),r=giftRemote(),s=new PlayerStore(local,r);await s.connect(null);await assert.rejects(s.claimMail(mailId));await s.connect('A');await s.begin();await s.claimMail(mailId);assert.equal(s.state.profile.wallet.gold,100);assert.equal(s.state.status,'synced');await s.claimMail(mailId);assert.equal(s.state.profile.wallet.gold,100);const reloaded=new PlayerStore(local,r);await reloaded.connect('A');assert.equal(reloaded.state.profile.wallet.gold,100);
});
test('mail revision conflict preserves local progress and does not overwrite another device',async()=>{
 const r=giftRemote(),a=new PlayerStore(storage(),r),b=new PlayerStore(storage(),r);await a.connect('A');await a.begin();await b.connect('A');await a.update(add);await assert.rejects(b.claimMail(mailId));assert.equal(b.state.status,'conflict');assert.equal(b.state.profile.wallet.gold,0);assert.equal(r.docs.get('A').profile.wallet.gold,10);
});
test('a mail claim in flight remains with its original account during login changes',async()=>{
 const r=giftRemote(),s=new PlayerStore(storage(),r);await s.connect('A');await s.begin();const original=r.claimMail;let release,entered;const started=new Promise(resolve=>entered=resolve);r.claimMail=async(...args)=>{entered();await new Promise(resolve=>release=resolve);return original(...args);};const claim=s.claimMail(mailId);await started;const change=s.connect('B');release();await claim;await change;assert.equal(s.state.uid,'B');assert.equal(s.state.status,'choose');assert.equal(s.state.profile.wallet.gold,0);assert.equal(r.docs.get('A').profile.wallet.gold,100);
});
test('server grant is recoverable by sync when local storage fails after its commit',async()=>{
 const local=storage(),r=giftRemote(),s=new PlayerStore(local,r);await s.connect('A');await s.begin();const set=local.setItem;local.setItem=()=>{throw Error('Disco cheio');};await assert.rejects(s.claimMail(mailId));assert.equal(r.docs.get('A').profile.wallet.gold,100);local.setItem=set;await s.sync();await s.claimMail(mailId);assert.equal(s.state.profile.wallet.gold,100);
});

function vipRemote(){const r=remote();r.purchaseVip=async(uid,expected,tier,id)=>{const old=r.docs.get(uid);const result=prepareVipCommit(old?{owner:uid,schema:1,revision:old.revision,profileJson:JSON.stringify(old.profile)}:null,uid,expected,tier,id,1800000000000);if(result.changed)r.docs.set(uid,{revision:result.revision,profile:result.profile});return structuredClone(r.docs.get(uid));};return r;}
test('VIP purchase is confirmed before local debit and lost-response retry restores exactly one charge across devices',async()=>{
 const r=vipRemote(),s=new PlayerStore(storage(),r);await s.connect('A');await s.begin();await s.update(p=>{p.wallet.gold=20000;return p;});
 const original=r.purchaseVip;let lost=true;r.purchaseVip=async(...args)=>{const result=await original(...args);if(lost){lost=false;throw Error('Lost response');}return result;};
 const id='11111111-1111-4111-8111-111111111111';await assert.rejects(s.purchaseVip(1,id));assert.equal(s.state.profile.wallet.gold,20000);assert.equal(r.docs.get('A').profile.wallet.gold,15000);
 await s.purchaseVip(1,id);assert.equal(s.state.profile.wallet.gold,15000);assert.equal(s.state.status,'synced');const other=new PlayerStore(storage(),r);await other.connect('A');assert.equal(other.state.profile.commerce.vip.until,s.state.profile.commerce.vip.until);assert.equal(other.state.profile.wallet.gold,15000);
});
test('VIP guest or conflicting-device purchase cannot spend resources or replace a newer account save',async()=>{
 const r=vipRemote(),a=new PlayerStore(storage(),r),b=new PlayerStore(storage(),r);await a.connect(null);await assert.rejects(a.purchaseVip(1,mailId));await a.connect('A');await a.begin();await a.update(p=>{p.wallet.gold=20000;return p;});await b.connect('A');await a.update(add);await assert.rejects(b.purchaseVip(1,mailId));assert.equal(b.state.status,'conflict');assert.equal(r.docs.get('A').profile.wallet.gold,20010);assert.equal(r.docs.get('A').profile.commerce,undefined);
});
