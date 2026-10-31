import{useEffect,useRef,useState}from'react';
import{Crown,Shield,Sparkles}from'lucide-react';
import{VIP_TIERS,vipAccess}from'./vip.js';
import{readVipPending,saveVipPending,clearVipPending}from'./vip-pending.js';
import'./vip.css';
const date=n=>new Date(n).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo',dateStyle:'short',timeStyle:'short'});
export function VipBadge({access}){
 if(!access?.active)return null;
 return <div className="vip-badge" data-tier={access.tier}><Crown size={21}/><span><strong>{access.config.name} · {access.config.label}</strong><small>{access.config.title||'Moldura Bronze'} · até {date(access.until)}</small></span></div>;
}
export function VipShop({profile,ownerId,authenticated,ready,busy,clockNow,onBuy,storage=globalThis.localStorage}){
 const[initial]=useState(()=>{try{return{order:readVipPending(storage,ownerId),error:''};}catch(error){return{order:null,error:error.message};}});
 const[order,setOrder]=useState(initial.order),[error,setError]=useState(initial.error),[sending,setSending]=useState(false),flight=useRef(false),confirmRef=useRef(null);
 useEffect(()=>{if(order)confirmRef.current?.focus();},[order?.id]);
 const access=vipAccess(profile,clockNow),gold=profile?.wallet?.gold||0,locked=busy||sending||!authenticated||!ready||clockNow==null||!!initial.error;
 const select=tier=>{try{const next=saveVipPending(storage,{uid:ownerId,tier,id:crypto.randomUUID(),sent:false});setOrder(next);setError('');}catch(e){setError(e.message);}};
 const cancel=()=>{try{clearVipPending(storage,ownerId,order.id);setOrder(null);setError('');}catch(e){setError(e.message);}};
 const buy=async()=>{if(flight.current||locked||!order)return;flight.current=true;setSending(true);setError('');try{
  const next=saveVipPending(storage,{...order,sent:true});setOrder(next);
  if(await onBuy(next.tier,next.id)){clearVipPending(storage,ownerId,next.id);setOrder(null);}else setError('A compra ainda não foi confirmada. Confira o aviso e tente verificar este mesmo pedido.');
 }catch(e){setError(e.message);}finally{flight.current=false;setSending(false);}};
 return <section className="vip-shop" aria-labelledby="vip-title"><div className="vip-heading"><Crown/><div><small>SEU ESTILO NA ARENA</small><h3 id="vip-title">VIP por 7 dias</h3></div></div>
 <p>Escolha sua moldura e um reforço no Bastião contra a máquina. Os benefícios entram no início da próxima partida.</p><VipBadge access={access}/>
 <div className="vip-grid">{VIP_TIERS.map(def=>{const other=access.active&&access.tier!==def.tier;return <article className="vip-card" data-tier={def.tier} key={def.tier}>
  <div className="vip-emblem"><Crown size={38}/></div><small>{def.label}</small><h4>{def.name}</h4><strong className="vip-price">{def.gold.toLocaleString('pt-BR')} <span>Gold</span></strong><p>7 dias · sem renovação automática</p>
  <ul><li><Shield size={17}/> Bastião: 15 s ativo + {def.recoveryMs/1000} s de recarga no PvE</li><li><Crown size={17}/> Moldura {def.label.toLowerCase()}</li>{def.title&&<li><Sparkles size={17}/> Título {def.title}</li>}{def.entryEffect&&<li><Sparkles size={17}/> Entrada dourada na arena PvE</li>}</ul>
  <button type="button" disabled={locked||!!order||other||gold<def.gold} onClick={()=>select(def.tier)}>{other?'Disponível após o VIP atual':gold<def.gold?'Gold insuficiente':access.active?'Renovar por 7 dias':'Escolher '+def.name}</button>
 </article>;})}</div>
 {order&&<div className="vip-confirm" ref={confirmRef} tabIndex={-1} role="group" aria-label="Confirmar compra VIP"><strong>{order.sent?'Verificar compra de ': 'Confirmar '+(access.active?'renovação de ':'compra de ')}{VIP_TIERS[order.tier-1].name}</strong><p>{VIP_TIERS[order.tier-1].gold.toLocaleString('pt-BR')} Gold · 7 dias. {order.sent?'A verificação repete o mesmo pedido sem duplicar o débito.':'O Gold será consumido ao confirmar.'}</p><div><button type="button" disabled={locked} onClick={buy}>{sending?'Confirmando…':order.sent?'Verificar compra':'Confirmar compra'}</button>{!order.sent&&<button type="button" disabled={sending||busy} onClick={cancel}>Cancelar</button>}</div></div>}
 {error&&<p className="vip-error" role="alert">{error}</p>}{!authenticated?<p>Entre na sua conta para escolher seu VIP.</p>:!ready?<p>Sincronize seu progresso antes de comprar.</p>:clockNow==null?<p role="status">Aguardando conexão para confirmar a validade do VIP…</p>:null}
 <p className="vip-fair"><Shield size={18}/> No PvP: 15 s ativo e 20 s de recarga para todos. O passe do automático é comprado separadamente. Renove o mesmo VIP para somar sete dias; outro nível fica disponível ao terminar o atual.</p></section>;
}
