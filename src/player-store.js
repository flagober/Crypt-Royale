import {createProgress,validateProgress} from './game/activities.js';
import {PROGRESS_KEY,loadProgress,updateProgress} from './activities-storage.js';

export const accountKey=uid=>`cryptroyale.player.v1.${encodeURIComponent(uid)}`;
export const isQuotaError = e => {
 const code = (e?.code || '').toLowerCase();
 const msg = (e?.message || '').toLowerCase();
 return code === 'resource-exhausted' || msg.includes('quota') || msg.includes('resource-exhausted') || msg.includes('resource has been exhausted');
};
export const offline = e => {
 if (!e) return false;
 const code = (e?.code || '').toLowerCase();
 const msg = (e?.message || '').toLowerCase();
 return (
  ['unavailable', 'deadline-exceeded', 'offline', 'cancelled', 'resource-exhausted'].includes(code) ||
  msg.includes('quota') ||
  msg.includes('offline') ||
  msg.includes('network') ||
  msg.includes('deadline') ||
  msg.includes('unavailable') ||
  msg.includes('failed to get document')
 );
};
const copy=p=>structuredClone(validateProgress(p));
function readCache(storage,uid){
 const raw=storage.getItem(accountKey(uid));if(raw===null)return null;
 let c;try{c=JSON.parse(raw);if(c.uid!==uid||c.version!==1||!Number.isSafeInteger(c.revision)||c.revision<0||typeof c.pending!=='boolean')throw Error();copy(c.profile);}catch{throw Error('Cópia desta conta inválida. Dados preservados.');}return c;
}
function writeCache(storage,c){
 const key=accountKey(c.uid),old=storage.getItem(key);
 if(old!==null&&old!==JSON.stringify(c))storage.setItem(key+'.backup',old);
 storage.setItem(key,JSON.stringify(c));
}
// A checkpoint is an indivisible save: never add currencies from two devices.
// Revision checks are repeated inside the server transaction, not just in this UI.
export class PlayerStore {
 constructor(storage,remote){
  this.storage=storage;this.remote=remote;this.listeners=new Set();this.queue=Promise.resolve();this.epoch=0;
  this.state={uid:null,profile:null,ready:false,status:'restoring',message:'Preparando seu progresso…'};
 }
 subscribe=fn=>{this.listeners.add(fn);return()=>this.listeners.delete(fn);};
 getSnapshot=()=>this.state;
 emit(patch){this.state={...this.state,...patch};for(const fn of this.listeners)fn();}
 serial(fn){const job=this.queue.then(fn);this.queue=job.catch(()=>{});return job;}
 async connect(uid){
  const epoch=++this.epoch;this.emit({ready:false,status:'restoring',message:'Conferindo seu save…'});
  return this.serial(async()=>{
   if(epoch!==this.epoch)return;
   try{
    if(!uid){this.emit({uid:null,profile:null});const profile=loadProgress(this.storage);this.emit({profile,ready:true,status:'guest',message:'Visitante · salvo somente neste aparelho',conflict:null,revision:0,pending:false});return;}
    this.emit({uid,profile:null,conflict:null,pending:false});
    const cache=readCache(this.storage,uid);
    let saved;
    try{saved=await this.remote.read(uid);}catch(e){
     if(epoch!==this.epoch)return;
     if(offline(e)&&cache){
      const message=isQuotaError(e)
       ?'Cota diária da nuvem atingida · jogando com o save seguro deste aparelho. Sincronização será feita quando a cota renovar.'
       :'Sem conexão · progresso guardado neste aparelho. Sincronize antes de trocar de dispositivo.';
      this.emit({...cache,ready:true,status:'offline',message});return;
     }
     throw e;
    }
    if(epoch!==this.epoch)return;
    if(saved){copy(saved.profile);if(!Number.isSafeInteger(saved.revision)||saved.revision<1)throw Error('Revisão remota inválida.');}
    if(cache?.pending&&(saved?.revision||0)!==cache.revision){
     this.emit({...cache,ready:false,status:'conflict',conflict:saved,message:'Há dois saves diferentes. Suas cópias foram preservadas. Baixe o save da conta para continuar.'});return;
    }
    if(cache?.pending){this.emit({...cache,ready:true,status:'pending',message:'Sincronização pendente'});await this.flushNow(epoch);return;}
    if(saved){const c={version:1,uid,revision:saved.revision,pending:false,profile:copy(saved.profile)};writeCache(this.storage,c);this.emit({...c,ready:true,status:'synced',message:'Progresso salvo na conta'});return;}
    this.emit({uid,profile:createProgress(),revision:0,pending:false,ready:false,status:'choose',message:'Conta sem save: escolha começar ou levar seu progresso de visitante.'});
   }catch(e){if(epoch===this.epoch)this.emit({ready:false,status:'error',message:e.message||'Não foi possível abrir o save. Dados preservados.'});}
  });
 }
 async begin(importGuest=false){return this.serial(async()=>{
  if(this.state.status!=='choose'||!this.state.uid)throw Error('Conta ainda não está pronta.');
  const profile=importGuest?copy(loadProgress(this.storage)):createProgress();
  const c={version:1,uid:this.state.uid,revision:0,pending:true,profile};
  writeCache(this.storage,c);this.emit({...c,ready:true,status:'pending'});await this.flushNow(this.epoch);
 });}
 update(updater){const epoch=this.epoch;return this.serial(async()=>{
  if(epoch!==this.epoch||!this.state.ready)throw Error('Aguarde a abertura do save da sua conta.');
  if(!this.state.uid){const next=updateProgress(this.storage,updater);this.emit({profile:next});return next;}
  const current=readCache(this.storage,this.state.uid);
  // Another tab can change the same account while this tab is suspended.
  if(!current||JSON.stringify(current.profile)!==JSON.stringify(this.state.profile)||current.revision!==this.state.revision){this.emit({ready:false,status:'error',message:'O save mudou em outra janela. Reconecte para conferir as cópias.'});throw Error('Save alterado em outra janela.');}
  const profile=copy(updater(copy(current.profile)));
  const c={...current,pending:true,profile};writeCache(this.storage,c);this.emit({...c,status:'pending',message:'Salvo neste aparelho · sincronizando…'});
  await this.flushNow(epoch);return profile;
 });}
 async flushNow(epoch){
  const c=readCache(this.storage,this.state.uid);if(!c?.pending)return;
  try{
   const revision=await this.remote.commit(c.uid,c.revision,copy(c.profile));
   // Commit to the original owner's cache even if an auth change is waiting.
   const confirmed={...c,revision,pending:false};writeCache(this.storage,confirmed);
   if(epoch===this.epoch)this.emit({...confirmed,ready:true,status:'synced',message:'Progresso salvo na conta'});
  }catch(e){
   if(epoch!==this.epoch)return;
   if(e.code==='save-conflict'){this.emit({ready:false,status:'conflict',message:'Outro aparelho atualizou esta conta. Suas duas cópias foram preservadas.'});return;}
   const isOff=offline(e);
   const message=isQuotaError(e)
    ?'Cota diária da nuvem atingida · save seguro neste aparelho, sincronização continuará assim que a cota renovar.'
    :isOff
     ?'Sem conexão · save protegido neste aparelho, envio pendente.'
     :'Não foi possível sincronizar. Save local preservado. '+(e.message||'');
   this.emit({ready:isOff,status:isOff?'offline':'error',message});
  }
 }
 claimMail(id){const epoch=this.epoch;return this.serial(async()=>{
  if(epoch!==this.epoch||!this.state.uid||!this.state.ready)throw Error('Entre na conta e confira seu save antes de resgatar.');
  if(this.state.pending)await this.flushNow(epoch);
  if(epoch!==this.epoch||this.state.status!=='synced')throw Error('Sincronize o progresso antes de resgatar o brinde.');
  const uid=this.state.uid,current=readCache(this.storage,uid);
  if(!current||current.pending||current.revision!==this.state.revision||JSON.stringify(current.profile)!==JSON.stringify(this.state.profile))throw Error('O save mudou em outra janela. Sincronize antes de resgatar.');
  try{
   const result=await this.remote.claimMail(uid,current.revision,id);
   const c={version:1,uid,revision:result.revision,pending:false,profile:copy(result.profile)};
   writeCache(this.storage,c);if(epoch===this.epoch)this.emit({...c,ready:true,status:'synced',message:'Brinde recebido e progresso salvo na conta.'});
  }catch(e){if(epoch===this.epoch&&e.code==='save-conflict')this.emit({ready:false,status:'conflict',message:'Outro aparelho atualizou a conta. Confira o save antes de resgatar.'});throw e;}
 });}
 purchaseVip(tier,id){const epoch=this.epoch;return this.serial(async()=>{
  if(epoch!==this.epoch||!this.state.uid||!this.state.ready)throw Error('Entre na conta antes de comprar VIP.');
  if(this.state.pending)await this.flushNow(epoch);
  if(epoch!==this.epoch||this.state.status!=='synced')throw Error('Conecte e sincronize o progresso antes de comprar VIP.');
  const uid=this.state.uid,current=readCache(this.storage,uid);
  if(!current||current.pending||current.revision!==this.state.revision||JSON.stringify(current.profile)!==JSON.stringify(this.state.profile))throw Error('O save mudou em outra janela. Sincronize antes de comprar.');
  try{const result=await this.remote.purchaseVip(uid,current.revision,tier,id),c={version:1,uid,revision:result.revision,pending:false,profile:copy(result.profile)};writeCache(this.storage,c);if(epoch===this.epoch)this.emit({...c,ready:true,status:'synced',message:'VIP confirmado e salvo na conta.'});return c.profile;}
  catch(error){if(epoch===this.epoch&&error.code==='save-conflict')this.emit({ready:false,status:'conflict',message:'Outro aparelho atualizou seu save. Confira o progresso antes de comprar VIP.'});throw error;}
 });}
 sync(){const uid=this.state.uid;return this.connect(uid);}
 claimCheckin(){const epoch=this.epoch;return this.serial(async()=>{
  if(epoch!==this.epoch||!this.state.uid||!this.state.ready)throw Error('Entre na conta para confirmar os créditos do check-in.');
  if(this.state.pending)await this.flushNow(epoch);if(epoch!==this.epoch||this.state.status!=='synced')throw Error('Conecte e sincronize antes de confirmar o check-in.');
  const uid=this.state.uid,current=readCache(this.storage,uid);
  if(!current||current.pending||current.revision!==this.state.revision||JSON.stringify(current.profile)!==JSON.stringify(this.state.profile))throw Error('O save mudou em outra janela. Sincronize primeiro.');
  try{const result=await this.remote.claimCheckin(uid,current.revision);const c={version:1,uid,revision:result.revision,pending:false,profile:copy(result.profile)};writeCache(this.storage,c);if(epoch===this.epoch)this.emit({...c,ready:true,status:'synced',message:'Check-in confirmado na conta.'});return c.profile;}
  catch(e){if(epoch===this.epoch&&e.code==='save-conflict')this.emit({ready:false,status:'conflict',message:'Outro aparelho atualizou a conta. Confira seu save.'});throw e;}
 });}
 async removeAccountSave(){return this.serial(async()=>{
  const uid=this.state.uid;if(!uid)throw Error('Entre na conta para remover seus dados.');
  this.emit({ready:false});await this.remote.remove(uid);
  const prefix=accountKey(uid);const keys=Object.keys(this.storage).filter(k=>k===prefix||k.startsWith(prefix+'.'));
  for(const key of keys)this.storage.removeItem(key);
  this.emit({profile:null,status:'removed',message:'Dados do Crypt Royale excluídos da conta e deste aparelho.'});
 });}
 async useCloud(){
  const uid=this.state.uid,epoch=this.epoch;if(!uid||this.state.status!=='conflict')return;
  // Keep the divergent local save as an explicit recovery copy before replacing it.
  const raw=this.storage.getItem(accountKey(uid));if(raw!==null)this.storage.setItem(accountKey(uid)+'.conflict.'+Date.now(),raw);
  return this.serial(async()=>{
   if(epoch!==this.epoch)return;this.emit({ready:false});const saved=await this.remote.read(uid);if(!saved)throw Error('Save remoto ausente; cópia local preservada.');if(epoch!==this.epoch)return;
   const c={version:1,uid,revision:saved.revision,pending:false,profile:copy(saved.profile)};writeCache(this.storage,c);this.emit({...c,ready:true,status:'synced',message:'Save da conta restaurado. Cópia divergente preservada neste aparelho.'});
  });
 }
 export(){return JSON.stringify({game:'Crypt Royale',uid:this.state.uid,exportedAt:new Date().toISOString(),profile:copy(this.state.profile)},null,2);}
}
