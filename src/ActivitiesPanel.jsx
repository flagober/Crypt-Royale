import { useEffect, useRef, useState } from 'react';
import { CalendarDays, Check, Gift, Trophy, X, Coins, Layers, Shield } from 'lucide-react';
import { activityView, CHECKIN_REWARDS } from './game/activities.js';
import { CARD_BY_ID } from './game/cards.js';

export function RewardLabel({ reward }) {
  return <div className="flex flex-wrap gap-2 text-xs font-semibold text-amber-100">
    {!!reward.gold && <span>{reward.gold} Gold</span>}{!!reward.xp && <span>· {reward.xp} XP</span>}
    {!!reward.dataFragments && <span>· {reward.dataFragments} Fragmentos de Dados</span>}
    {Object.entries(reward.cards).map(([id, n]) => <span key={id}>· {n}× {CARD_BY_ID[id]?.name || id}</span>)}
  </div>;
}
function Goal({ title, current, goal }) {
  return <div><div className="mb-1 flex justify-between gap-3 text-xs"><span>{title}</span><span className="font-mono text-cyan-200">{Math.min(current, goal).toLocaleString('pt-BR')} / {goal.toLocaleString('pt-BR')}</span></div>
    <div role="progressbar" aria-label={title} aria-valuenow={Math.min(current, goal)} aria-valuemin={0} aria-valuemax={goal} className="h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-cyan-400" style={{ width: `${Math.min(100, current / goal * 100)}%` }}/></div></div>;
}
function ActivityCard({ title, description, item, onClaim, busy, children }) {
  const ready = item.goals ? item.goals.every(g => g.current >= g.goal) : item.current >= item.goal;
  return <section className={`flex flex-col gap-4 rounded-2xl border p-4 md:p-5 ${item.claimed ? 'border-emerald-500/30 bg-emerald-950/20' : 'border-slate-700 bg-slate-900/70'}`}>
    <div><h3 className="font-bold text-slate-100">{title}</h3><p className="mt-1 text-sm text-slate-400">{description}</p></div>
    {children || <Goal title="Progresso" current={item.current} goal={item.goal}/>}
    <RewardLabel reward={item.reward}/>
    <button type="button" disabled={busy || item.claimed || !ready} onClick={onClaim} className="mt-auto flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 disabled:bg-slate-800 disabled:text-slate-400">
      {item.claimed ? <><Check size={16}/> Resgatado</> : ready ? <><Gift size={16}/> Receber recompensa</> : 'Em andamento'}
    </button>
  </section>;
}
export function ActivitiesPanel({ profile, now, onClaim, onClose, busy, message, onRetryBattle }) {
  const [tab, setTab] = useState('daily');
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const buttons = () => [...dialog.querySelectorAll('button:not(:disabled)')].filter(button => button.getClientRects().length);
    buttons()[0]?.focus();
    const trap = event => {
      if (event.key !== 'Tab') return;
      const list = buttons(), first = list[0], last = list.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    dialog.addEventListener('keydown', trap);
    return () => dialog.removeEventListener('keydown', trap);
  }, []);
  let view;
  try { view = activityView(profile, now); } catch (error) {
    return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/95 p-6"><div className="max-w-lg space-y-4"><h2 className="text-xl font-black">Progresso preservado</h2><p>{error.message}</p><button className="rounded-xl bg-cyan-300 px-5 py-3 font-bold text-slate-950" onClick={onClose}>Voltar à arena</button></div></div>;
  }
  const p = view.profile, checkinToday = p.checkin.lastDay === p.daily.day;
  const shownCursor = checkinToday && p.checkin.lastClaimIndex === 6 ? 7 : p.checkin.cursor;
  const cards = Object.entries(p.wallet.cards), today = new Date(`${p.daily.day}T12:00:00Z`).toLocaleDateString('pt-BR');
  const endWeek = new Date(`${p.weekly.week}T12:00:00Z`); endWeek.setUTCDate(endWeek.getUTCDate() + 6);
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-[#020617] text-slate-100" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="activities-title">
    <div className="mx-auto max-w-6xl p-4 pb-12 md:p-8">
      <header className="mb-5 flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Vila Byte · Central de atividades</p><h2 id="activities-title" className="mt-1 text-2xl font-black md:text-3xl">Sua jornada continua</h2><p className="mt-2 text-sm text-slate-400">Progresso local de teste · Partida pausada enquanto esta central estiver aberta.</p></div><button type="button" onClick={onClose} className="grid min-h-[44px] min-w-[44px] place-items-center rounded-xl border border-slate-700 bg-slate-900" aria-label="Fechar central de atividades"><X/></button></header>
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">{[[Coins, 'Gold', p.wallet.gold], [Trophy, 'XP', p.wallet.xp], [Layers, 'Cartas', cards.reduce((sum, [, n]) => sum + n, 0)], [Shield, 'Fragmentos de Dados', p.wallet.dataFragments]].map(([Icon, label, value]) => <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"><div className="flex items-center gap-2 text-xs text-slate-400"><Icon size={16}/>{label}</div><p className="mt-2 text-2xl font-black">{value.toLocaleString('pt-BR')}</p></div>)}</div>
      <nav aria-label="Atividades" className="mb-5 flex flex-wrap gap-2">{[['daily', CalendarDays, 'Rotina diária'], ['events', Trophy, 'Semana e eventos'], ['collection', Layers, 'Recompensas']].map(([id, Icon, label]) => <button key={id} onClick={() => setTab(id)} type="button" aria-pressed={tab === id} className={`flex min-h-[44px] items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold ${tab === id ? 'border-cyan-400 bg-cyan-950 text-cyan-100' : 'border-slate-700 bg-slate-900 text-slate-400'}`}><Icon size={16}/>{label}</button>)}</nav>
      {message && <p role="status" className="mb-5 rounded-xl border border-cyan-500/30 bg-cyan-950/40 p-3 text-sm">{message}</p>}
      {onRetryBattle && <button onClick={onRetryBattle} disabled={busy} className="mb-4 rounded-xl border border-slate-700 px-4 py-2 text-sm">Conferir registro da última partida</button>}
      {tab === 'daily' && <div className="space-y-5">
        <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 md:p-5"><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><h3 className="text-lg font-bold">Check-in · Ciclo de sete dias</h3><p className="text-xs text-slate-400">Uma coleta por dia. Faltar um dia não apaga o ciclo de Gold e materiais.</p></div><span className="text-xs text-cyan-200">{p.checkin.consecutive} check-ins consecutivos</span></div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">{CHECKIN_REWARDS.map((r, index) => {
            const claimed = index < shownCursor, active = !checkinToday && index === p.checkin.cursor;
            return <div key={index} className={`flex flex-col gap-3 rounded-xl border p-3 ${claimed ? 'border-emerald-500/40 bg-emerald-950/25' : active ? 'border-cyan-400 bg-cyan-950/50' : 'border-slate-800 bg-slate-950'}`}><p className="text-sm font-bold">Dia {index + 1}</p><RewardLabel reward={r}/><span className="mt-auto text-[10px] font-bold uppercase text-slate-400">{claimed ? 'Resgatado' : active ? 'Disponível hoje' : 'Próximos dias'}</span></div>;
          })}</div><button type="button" disabled={busy || checkinToday} onClick={() => onClaim('checkin')} className="mt-4 min-h-[44px] rounded-xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 disabled:bg-slate-800 disabled:text-emerald-300">{checkinToday ? '✓ Check-in de hoje resgatado' : 'Receber check-in de hoje'}</button>
        </section>
        <div><h3 className="mb-1 text-lg font-bold">Missões de {today}</h3><p className="mb-4 text-xs text-slate-400">Renovam à meia-noite de Brasília. Resgate antes da virada. Partidas manuais concluídas, com participação e pelo menos 30 segundos; treino automático não conta.</p><div className="grid gap-3 md:grid-cols-3">{view.missions.map(m => <ActivityCard key={m.id} title={m.title} description={m.description} item={m} busy={busy} onClaim={() => onClaim('daily', m.id)}/>)}</div></div>
        <ActivityCard title="Primeira vitória do dia" description="Conquiste uma vitória manual e receba o bônus uma única vez hoje." item={view.firstWin} busy={busy} onClaim={() => onClaim('first-win')}/>
      </div>}
      {tab === 'events' && <div className="space-y-5"><p className="text-sm text-slate-400">Semana atual até {endWeek.toLocaleDateString('pt-BR')} às 23h59, horário de Brasília. Novos objetivos na segunda-feira. Resgates únicos por semana.</p><div className="grid gap-4 md:grid-cols-2"><ActivityCard title="Objetivo semanal" description="Resgate nove missões diárias durante a semana e receba um Cache Tático de conteúdo conhecido." item={view.weekly} busy={busy} onClaim={() => onClaim('weekly')}/><ActivityCard title={view.event.title} description="Desafio semanal com o catálogo atual. Complete os três objetivos para receber o Cache Regional de teste." item={view.event} busy={busy} onClaim={() => onClaim('event')}><div className="space-y-3">{view.event.goals.map(g => <Goal key={g.title} {...g}/>)}</div></ActivityCard></div><section className="rounded-2xl border border-dashed border-slate-700 p-5"><h3 className="font-bold">Evento de Boss · Em preparação</h3><p className="mt-2 text-sm text-slate-400">Batalhas e Ecos serão habilitados depois da produção e integração do lote de Bosses. Não há recompensas de Boss disponíveis nesta versão.</p></section></div>}
      {tab === 'collection' && <div className="space-y-5"><section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><h3 className="mb-4 font-bold">Cartas recebidas nas atividades</h3><div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">{cards.length ? cards.map(([id, n]) => <div key={id} className="flex items-center gap-3 rounded-xl border border-slate-700 p-3"><img src={CARD_BY_ID[id]?.cardArt} alt="" className="h-14 w-12 rounded-lg object-cover"/><div><p className="text-sm font-bold">{CARD_BY_ID[id]?.name || id}</p><p className="text-xs text-cyan-300">{n} carta(s)</p></div></div>) : <p className="text-sm text-slate-400">As cartas recebidas aparecerão aqui. Atributos de batalha não mudam nesta etapa.</p>}</div></section><section className="rounded-2xl border border-slate-800 p-5"><h3 className="mb-3 font-bold">Últimos resgates</h3>{p.receipts.slice(-10).reverse().map(r => <div key={r.key} className="border-t border-slate-800 py-3"><p className="mb-1 text-xs text-slate-400">{new Date(r.at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p><RewardLabel reward={r.reward}/></div>)}{!p.receipts.length && <p className="text-sm text-slate-400">Nenhuma recompensa resgatada ainda.</p>}</section></div>}
      <footer className="mt-6 rounded-2xl border border-amber-400/25 bg-amber-950/20 p-4 text-xs leading-relaxed text-amber-100"><strong>MCT: distribuição ainda indisponível.</strong> A diretriz V10 prevê 1 MCT no sétimo check-in consecutivo, mas o resgate depende de orçamento, conta validada e registro compartilhado com MonsterCrypt. Esta central não credita MCT, não emite vouchers e não garante pagamento futuro. Gold, XP, cartas e materiais desta versão são de teste e ficam neste navegador; não são saldo do Marketplace.</footer>
    </div>
  </div>;
}
