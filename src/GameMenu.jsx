import{VipBadge}from'./VipShop.jsx';
import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {X,Swords,Map,Gift,Mail,UserRound,Layers,Bot,RotateCcw,BookOpen,ChevronRight} from 'lucide-react';
import {AudioControl} from './AudioControl.jsx';
import {WalletSummary} from './ProgressionPanel.jsx';
import './game-menu.css';

const tabs=[['play','Jogo'],['collection','Coleção'],['settings','Ajustes']];

export function GameMenu({open,onClose,hud,account,profile,version,mapName,inCampaign,appearance,onAppearance,onAutomatic,onAccount,onMail,onActivities,onProgression,onWelcome,onRestart,onNotes,onShop,onPvp,vip}){
 const [tab,setTab]=useState('play'),panelRef=useRef(null),tabRefs=useRef([]),closeRef=useRef(onClose);
 closeRef.current=onClose;
 useEffect(()=>{
  if(!open)return;
  const previous=document.activeElement;
  const frame=requestAnimationFrame(()=>panelRef.current?.querySelector('button')?.focus());
  const key=e=>{
   if(!panelRef.current?.contains(e.target))return;
   if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeRef.current();return;}
   if(e.key!=='Tab')return;
   const controls=[...panelRef.current.querySelectorAll('button:not(:disabled),select:not(:disabled),input:not(:disabled),a[href]')].filter(x=>x.getClientRects().length);
   const first=controls[0],last=controls.at(-1);
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
  };
  document.addEventListener('keydown',key);
  return()=>{cancelAnimationFrame(frame);document.removeEventListener('keydown',key);if(previous?.isConnected&&!previous.closest('[inert]'))previous.focus();};
 },[open]);
 const moveTab=(event,index)=>{
  let next;
  if(event.key==='ArrowRight')next=(index+1)%tabs.length;
  if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
  if(event.key==='Home')next=0;
  if(event.key==='End')next=tabs.length-1;
  if(next===undefined)return;
  event.preventDefault();setTab(tabs[next][0]);tabRefs.current[next]?.focus();
 };
 // Stay mounted while hidden: AudioManager must still receive the current game state.
 return createPortal(<div className="cr-menu" hidden={!open}>
  <div className="cr-menu-backdrop" onClick={onClose}/>
  <aside ref={panelRef} id="cr-game-menu" className="cr-menu-sheet" role="dialog" aria-modal="true" aria-labelledby="cr-menu-title">
   <header className="cr-menu-header"><img src="/assets/branding/icon-192.png" alt="" width="44" height="44"/><div><p>CRYPT ROYALE</p><h2 id="cr-menu-title">Vila Byte</h2></div><button type="button" onClick={onClose} aria-label="Fechar menu"><X size={22}/></button></header>
   <nav className="cr-menu-tabs" role="tablist" aria-label="Seções do menu">{tabs.map(([id,label],i)=><button ref={el=>tabRefs.current[i]=el} type="button" role="tab" key={id} id={`cr-tab-${id}`} aria-selected={tab===id} aria-controls={`cr-panel-${id}`} tabIndex={tab===id?0:-1} onKeyDown={e=>moveTab(e,i)} onClick={()=>setTab(id)}>{label}</button>)}</nav>
   <div className="cr-menu-scroll">
    <section id="cr-panel-play" role="tabpanel" aria-labelledby="cr-tab-play" hidden={tab!=='play'} className="cr-menu-panel">
     <div className="cr-menu-context"><span>{inCampaign?'Jornada de arenas':'Treino da arena'}</span><strong>{mapName}</strong><small>{hud.status==='finished'?'Partida encerrada':'Partida pausada enquanto o menu está aberto'}</small></div>
     <VipBadge access={vip}/>
     <div className="cr-menu-grid"><button type="button" onClick={onAccount} aria-label="Minha conta e progresso"><UserRound/><strong>{account.user?'Minha conta':'Entrar / cadastrar'}</strong><small>{account.status==='synced'?'Progresso sincronizado':'Conta e salvamento'}</small></button><button type="button" onClick={onMail} aria-label="Abrir caixa de correio"><Mail/><strong>Correio</strong><small>Mensagens e presentes</small></button><button type="button" onClick={()=>onProgression('campaign')}><Swords/><strong>Arenas</strong><small>Avance uma batalha por vez</small></button><button type="button" disabled={!account.ready} onClick={onRestart}><Map/><strong>Treinar nesta arena</strong><small>Segue o seu progresso nas arenas</small></button></div>
     <button type="button" className="cr-menu-row" onClick={onPvp}><Swords size={20}/><span>PvP amistoso · desafie um amigo</span><ChevronRight size={18}/></button>
     <button type="button" className="cr-menu-feature" onClick={onActivities}><img src="/assets/rewards/vila-byte-gift-v001.png" alt=""/><span><strong>Missões e recompensas</strong><small>Check-in, objetivos e eventos</small></span><ChevronRight size={19}/></button>
     <p className="cr-menu-status" role="status">{account.message}</p>
    </section>
    <section id="cr-panel-collection" role="tabpanel" aria-labelledby="cr-tab-collection" hidden={tab!=='collection'} className="cr-menu-panel">
     <div className="cr-menu-heading"><h3>Seu poder, sua coleção</h3><p>Recursos, cartas e evolução reunidos aqui.</p></div>
     {profile?<WalletSummary profile={profile} onOpen={onProgression}/>:<p role="status">Carregando seu progresso…</p>}
     <button type="button" className="cr-menu-row" onClick={()=>onProgression('classes')}><Layers size={20}/><span>Classes e especializações</span><ChevronRight size={18}/></button>
     <button type="button" className="cr-menu-row" onClick={onActivities}><Gift size={20}/><span>Missões e recompensas</span><ChevronRight size={18}/></button>
     <button type="button" className="cr-menu-row" onClick={onShop}><Gift size={20}/><span>Loja · VIP e Sentinela</span><ChevronRight size={18}/></button>
    </section>
    <section id="cr-panel-settings" role="tabpanel" aria-labelledby="cr-tab-settings" hidden={tab!=='settings'} className="cr-menu-panel">
     <AudioControl currentGameState={hud} embedded/>
     <div className="cr-menu-setting"><div><h3><Bot size={18}/> Treino automático</h3><p>Exige o passe de 7 dias comprado na loja. Missões e progresso de campanha continuam manuais.</p></div><button type="button" role="switch" aria-checked={hud.automaticEnabled} aria-label="Modo automático com passe" className="cr-menu-switch" onClick={onAutomatic}><span/></button></div>
     <label className="cr-menu-select" htmlFor="core-appearance"><span>Operador central</span><select id="core-appearance" value={appearance} onChange={onAppearance}><option value="male">Guerreiro</option><option value="female">Guerreira</option></select></label>
     <button type="button" className="cr-menu-row" onClick={onWelcome}><BookOpen size={20}/><span>Guia de Vila Byte</span><ChevronRight size={18}/></button>
     <button type="button" className="cr-menu-row" onClick={onRestart}><RotateCcw size={20}/><span>Reiniciar treino</span></button>
    </section>
   </div>
   <footer className="cr-menu-footer"><button type="button" className="cr-menu-resume" onClick={onClose}>Voltar à arena <ChevronRight size={18}/></button><button type="button" className="cr-menu-version" aria-label="Ver notas da versão" onClick={onNotes}>Beta v{version} · Notas das versões</button></footer>
  </aside>
 </div>,document.body);
}
