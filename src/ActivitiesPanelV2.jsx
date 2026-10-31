// ── ActivitiesPanelV2.jsx ──────────────────────────────────────────
// Vila Byte · Central de Atividades — Apresentação premium V2
// Exporta ActivitiesPanelV2 com as mesmas props de ActivitiesPanel.
// Nenhuma lógica de atividade, economia ou armazenamento é alterada.
// ───────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react';
import {
  CalendarDays, Check, Gift, Trophy, X, Layers, Star, Zap,
} from 'lucide-react';
import { activityView, CHECKIN_REWARDS } from './game/activities.js';
import { CARD_BY_ID } from './game/cards.js';
import './activities-v2.css';
import {MctCard,LoyaltyPanel} from './MctPanel.jsx';
import{usePlayer}from'./AccountPanel.jsx';import{loyaltyView}from'./loyalty.js';

// ───────── asset paths (public, read-only) ─────────
const IMG = {
  chest:     '/assets/rewards/vila-byte-chest-v001.png',
  coins:     '/assets/rewards/vila-byte-coins-v001.png',
  fragments: '/assets/rewards/vila-byte-fragments-v001.png',
  gift:      '/assets/rewards/vila-byte-gift-v001.png',
  xp:        '/assets/rewards/vila-byte-xp-v001.png',
  cards:     '/assets/rewards/vila-byte-cards-v001.png',
};

// ───────── deterministic particles (12 fixed positions) ─────────
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  left: `${8 + (i * 7.3) % 84}%`,
  bottom: `${12 + (i * 5.7) % 20}%`,
  delay: `${(i * 0.12).toFixed(2)}s`,
  color: i % 3 === 0 ? '#22d3ee' : i % 3 === 1 ? '#fbbf24' : '#a78bfa',
}));

// ═══════════════════ REWARD LABEL ═══════════════════
function RewardLabelV2({ reward }) {
  const parts = [];
  if (reward.gold) parts.push(
    <span key="g" className="av2-reward-tag__item">
      <img src={IMG.coins} alt="" width={14} height={14} /> {reward.gold} Gold
    </span>
  );
  if (reward.xp) parts.push(
    <span key="x" className="av2-reward-tag__item">
      <img src={IMG.xp} alt="" width={14} height={14} /> {reward.xp} XP
    </span>
  );
  if (reward.dataFragments) parts.push(
    <span key="d" className="av2-reward-tag__item">
      <img src={IMG.fragments} alt="" width={14} height={14} /> {reward.dataFragments} Fragmentos de Dados
    </span>
  );
  for (const [id, n] of Object.entries(reward.cards)) {
    parts.push(
      <span key={id} className="av2-reward-tag__item">
        {n}× {CARD_BY_ID[id]?.name || id}
      </span>
    );
  }
  return <div className="av2-reward-tag">{parts}</div>;
}

// ═══════════════════ PROGRESS BAR ═══════════════════
function ProgressBar({ label, current, goal, gold }) {
  const clamped = Math.min(current, goal);
  const pct = Math.min(100, (clamped / goal) * 100);
  return (
    <div className="av2-progress-wrap">
      <div className="av2-progress-label">
        <span>{label}</span>
        <span className="av2-progress-label__val">
          {clamped.toLocaleString('pt-BR')} / {goal.toLocaleString('pt-BR')}
        </span>
      </div>
      <div
        className="av2-progress-track"
        role="progressbar"
        aria-label={label}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={goal}
      >
        <div
          className={`av2-progress-fill${gold ? ' av2-progress-fill--gold' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ═══════════════════ ACTIVITY CARD ═══════════════════
function ActivityCardV2({ title, description, item, onClaim, busy, icon, children }) {
  const ready = item.goals
    ? item.goals.every(g => g.current >= g.goal)
    : item.current >= item.goal;
  return (
    <section className={`av2-activity${item.claimed ? ' av2-activity--claimed' : ''}`}>
      <div className="av2-activity__header">
        <img
          src={icon || IMG.gift}
          alt=""
          width={44}
          height={44}
          className="av2-activity__icon"
        />
        <div>
          <h3 className="av2-activity__title">{title}</h3>
          <p className="av2-activity__desc">{description}</p>
        </div>
      </div>
      {children || <ProgressBar label="Progresso" current={item.current} goal={item.goal} />}
      <RewardLabelV2 reward={item.reward} />
      <button
        type="button"
        disabled={busy || item.claimed || !ready}
        onClick={onClaim}
        className={`av2-claim-btn ${item.claimed ? 'av2-claim-btn--done' : ready ? 'av2-claim-btn--primary' : ''}`}
      >
        {item.claimed
          ? <><Check size={16} /> Resgatado</>
          : ready
            ? <><Gift size={16} /> Receber recompensa</>
            : 'Em andamento'}
      </button>
    </section>
  );
}

// ═══════════════════ REWARD TOAST ═══════════════════
function RewardToast({ text }) {
  return (
    <div className="av2-toast" role="status" aria-live="polite">
      <img src={IMG.gift} alt="" className="av2-toast__icon" width={20} height={20} />
      {text}
    </div>
  );
}

// ═══════════════════ PARTICLES ═══════════════════
function ParticleBurst() {
  return (
    <div className="av2-particles" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="av2-particle"
          style={{
            left: p.left,
            bottom: p.bottom,
            animationDelay: p.delay,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════ CHECK-IN IMAGE SELECTOR ═══════════════════
function checkinImg(reward, isPremium) {
  if (isPremium) return IMG.chest;
  if (reward.dataFragments) return IMG.fragments;
  return IMG.coins;
}

// ═══════════════════ MAIN COMPONENT ═══════════════════
export function ActivitiesPanelV2({
  profile, now, onClaim, onClose, busy, message, onRetryBattle, onOpenCollection, onOpenMct,
}) {
  const account=usePlayer();
  const [tab, setTab] = useState('daily');
  const dialogRef = useRef(null);
  const receiptsRef = useRef(null);
  const toastTimerRef = useRef(null);
  const [toast, setToast] = useState(null);
  const [showParticles, setShowParticles] = useState(false);

  // ── Focus trap (preserves original behavior) ──
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const btns = () =>
      [...dialog.querySelectorAll('button:not(:disabled), summary, a[href], [tabindex="0"]')].filter(
        b => b.getClientRects().length,
      );
    btns()[0]?.focus();
    const trap = event => {
      if (event.key !== 'Tab') return;
      const list = btns();
      const first = list[0];
      const last = list.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first?.focus();
      }
    };
    dialog.addEventListener('keydown', trap);
    return () => dialog.removeEventListener('keydown', trap);
  }, []);

  // ── Reward animation (only on NEW receipt confirmed in profile.receipts) ──
  useEffect(() => {
    if (!profile?.receipts) return;
    const prev = receiptsRef.current;
    if (prev === null) {
      // First mount — just record, never animate
      receiptsRef.current = { count: profile.receipts.length, lastKey: profile.receipts.at(-1)?.key ?? null };
      return;
    }
    const curr = profile.receipts;
    if (curr.length > prev.count) {
      const newest = curr.at(-1);
      if (newest && newest.key !== prev.lastKey) {
        // Genuine new receipt → toast + particles
        const label = [];
        if (newest.reward.gold) label.push(`${newest.reward.gold} Gold`);
        if (newest.reward.xp) label.push(`${newest.reward.xp} XP`);
        if (newest.reward.dataFragments) label.push(`${newest.reward.dataFragments} Fragmentos`);
        const cardEntries = Object.entries(newest.reward.cards);
        if (cardEntries.length) label.push(`${cardEntries.reduce((s, [, n]) => s + n, 0)} carta(s)`);
        setToast(label.join(' · ') || 'Recompensa recebida!');
        setShowParticles(true);
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => { setToast(null); setShowParticles(false); }, 2200);
        receiptsRef.current = { count: curr.length, lastKey: newest.key };
      }
    }
    receiptsRef.current = { count: curr.length, lastKey: curr.at(-1)?.key ?? null };
  }, [profile?.receipts]);
  useEffect(() => () => clearTimeout(toastTimerRef.current), []);

  // ── Activity view (error boundary preserved) ──
  let view;
  try {
    view = activityView(profile, now);
  } catch (error) {
    return (
      <div className="av2-overlay">
        <div className="av2-shell" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
          <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1rem' }}>Progresso preservado</h2>
            <p style={{ marginBottom: '1.5rem', color: '#94a3b8' }}>{error.message}</p>
            <button className="av2-claim-btn av2-claim-btn--primary" onClick={onClose} style={{ width: 'auto', padding: '.6rem 1.5rem' }}>
              Voltar à arena
            </button>
          </div>
        </div>
      </div>
    );
  }

  const p = view.profile;
  const checkinToday = p.checkin.lastDay === p.daily.day;
  const needsCredits=!!account?.uid&&!loyaltyView(account.loyalty,now).today;
  const shownCursor = checkinToday && p.checkin.lastClaimIndex === 6 ? 7 : p.checkin.cursor;
  const cards = Object.entries(p.wallet.cards);
  const today = new Date(`${p.daily.day}T12:00:00Z`).toLocaleDateString('pt-BR');
  const endWeek = new Date(`${p.weekly.week}T12:00:00Z`);
  endWeek.setUTCDate(endWeek.getUTCDate() + 6);

  // ── Wallet data ──
  const walletItems = [
    { img: IMG.coins, label: 'Gold', value: p.wallet.gold },
    { img: IMG.xp, label: 'XP', value: p.wallet.xp },
    { img: IMG.cards, label: 'Cartas', value: cards.reduce((sum, [, n]) => sum + n, 0) },
    { img: IMG.fragments, label: 'Fragmentos de Dados', value: p.wallet.dataFragments },
  ];

  // ── Tab definitions ──
  const tabDefs = [
    { id: 'daily', img: IMG.gift, label: 'Rotina diária' },
    { id: 'events', img: IMG.chest, label: 'Semana e eventos' },
    { id: 'collection', img: IMG.cards, label: 'Recompensas' },
  ];

  // ── Check-in day render ──
  const renderCheckinDay = (r, index) => {
    const claimed = index < shownCursor;
    const active = !checkinToday && index === p.checkin.cursor;
    const isPremium = index === 6;
    const cls = [
      'av2-checkin-day',
      claimed && 'av2-checkin-day--claimed',
      active && 'av2-checkin-day--active',
      isPremium && 'av2-checkin-day--premium',
    ].filter(Boolean).join(' ');
    return (
      <div key={index} className={cls}>
        <p className="av2-checkin-day__num">Dia {index + 1}</p>
        <img
          src={checkinImg(r, isPremium)}
          alt=""
          width={56}
          height={56}
          className="av2-checkin-day__img"
        />
        <div className="av2-checkin-day__reward">
          {!!r.gold && <div>{r.gold} Gold</div>}
          {!!r.xp && <div>{r.xp} XP</div>}
          {!!r.dataFragments && <div>{r.dataFragments} Frag.</div>}
        </div>
        <span className={`av2-checkin-day__status ${
          claimed ? 'av2-checkin-day__status--claimed'
            : active ? 'av2-checkin-day__status--active'
              : 'av2-checkin-day__status--locked'
        }`}>
          {claimed ? 'Recebido' : active ? 'Hoje' : 'Bloqueado'}
        </span>
      </div>
    );
  };

  return (
    <div
      className="av2-overlay"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="av2-title"
    >
      {/* ── Reward effects ── */}
      {toast && <RewardToast text={toast} />}
      {showParticles && <ParticleBurst />}

      <div className="av2-shell">
        {/* ═══════ HERO ═══════ */}
        <div className="av2-hero">
          <button
            type="button"
            onClick={onClose}
            className="av2-close"
            aria-label="Fechar central de atividades"
          >
            <X size={20} />
          </button>

          <div className="av2-hero-left">
            <span className="av2-hero-tag">Vila Byte · Central de atividades</span>
            <h2 id="av2-title" className="av2-hero-title">Sua jornada continua</h2>
            <p className="av2-hero-sub">
              Jogue, complete desafios e conquiste as recompensas de Vila Byte.
            </p>
            <div className="av2-hero-day">
              <Star size={12} /> Dia {today} · {p.checkin.consecutive} check-in{p.checkin.consecutive !== 1 ? 's' : ''} consecutivo{p.checkin.consecutive !== 1 ? 's' : ''}
            </div>
            <p className="av2-hero-note">Arena em pausa · Recompensas locais de teste</p>
          </div>

          <img
            src={IMG.chest}
            alt=""
            width={130}
            height={130}
            className="av2-hero-chest"
          />
        </div>

        {/* ═══════ WALLET ═══════ */}
        <div className="av2-wallet">
          {walletItems.map(w => (
            <div key={w.label} className="av2-wallet-card">
              <img src={w.img} alt="" width={64} height={64} className="av2-wallet-art"/>
              <div className="av2-wallet-label">
                {w.label}
              </div>
              <p className="av2-wallet-value">{w.value.toLocaleString('pt-BR')}</p>
            </div>
          ))}
          <MctCard onOpen={onOpenMct}/>
        </div>

        {/* ═══════ TABS ═══════ */}
        <nav aria-label="Atividades" className="av2-tabs">
          {tabDefs.map(({ id, img, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              type="button"
              aria-pressed={tab === id}
              className={`av2-tab av2-tab--${id}`}
            >
              <img src={img} alt="" width={40} height={40} className="av2-tab-art"/> {label}
            </button>
          ))}
        </nav>

        {/* ═══════ STATUS ═══════ */}
        {message && <p role="status" className="av2-message">{message}</p>}
        {onRetryBattle && (
          <button
            onClick={onRetryBattle}
            disabled={busy}
            className="av2-retry-btn"
          >
            Conferir registro da última partida
          </button>
        )}

        {/* ═══════ DAILY TAB ═══════ */}
        {tab === 'daily' && (
          <div>
            {/* Check-in 7 dias */}
            <LoyaltyPanel now={now}/>
            <div className="av2-panel">
              <div className="av2-panel-header">
                <div>
                  <h3 className="av2-panel-title">Check-in · Ciclo de sete dias</h3>
                  <p className="av2-panel-sub">
                    Uma coleta por dia. Faltar um dia não apaga o ciclo de Gold e materiais.
                  </p>
                </div>
                <span className="av2-panel-badge">
                  {p.checkin.consecutive} check-ins consecutivos
                </span>
              </div>

              {/* Desktop/tablet grid */}
              <div className="av2-checkin-grid">
                {CHECKIN_REWARDS.map((r, i) => renderCheckinDay(r, i))}
              </div>
              {/* Mobile scroll container */}
              <div className="av2-checkin-scroll">
                {CHECKIN_REWARDS.map((r, i) => renderCheckinDay(r, i))}
              </div>

              <button
                type="button"
                disabled={busy || (checkinToday&&!needsCredits)}
                onClick={() => onClaim('checkin')}
                className={`av2-claim-btn ${checkinToday ? 'av2-claim-btn--done' : 'av2-claim-btn--gold'}`}
              >
                {checkinToday&&!needsCredits
                  ? <><Check size={16} /> Check-in de hoje resgatado</>
                  : <><Gift size={16} /> Receber check-in de hoje</>}
              </button>
            </div>

            {/* Missões diárias */}
            <div className="av2-panel">
              <div className="av2-panel-header">
                <div>
                  <h3 className="av2-panel-title">Missões de {today}</h3>
                  <p className="av2-panel-sub">
                    Renovam à meia-noite de Brasília. Resgate antes da virada. Partidas manuais concluídas, com participação e pelo menos 30 segundos; treino automático não conta.
                  </p>
                </div>
              </div>
              <div className="av2-missions-grid">
                {view.missions.map(m => (
                  <ActivityCardV2
                    key={m.id}
                    title={m.title}
                    description={m.description}
                    item={m}
                    busy={busy}
                    icon={IMG.gift}
                    onClaim={() => onClaim('daily', m.id)}
                  />
                ))}
              </div>
            </div>

            {/* Primeira vitória */}
            <div className="av2-panel">
              <ActivityCardV2
                title="Primeira vitória do dia"
                description="Conquiste uma vitória manual e receba o bônus uma única vez hoje."
                item={view.firstWin}
                busy={busy}
                icon={IMG.chest}
                onClaim={() => onClaim('first-win')}
              />
            </div>
          </div>
        )}

        {/* ═══════ EVENTS TAB ═══════ */}
        {tab === 'events' && (
          <div>
            <p className="av2-panel-sub" style={{ marginBottom: '1rem' }}>
              Semana atual até {endWeek.toLocaleDateString('pt-BR')} às 23h59, horário de Brasília. Novos objetivos na segunda-feira. Resgates únicos por semana.
            </p>
            <div className="av2-events-grid">
              <ActivityCardV2
                title="Objetivo semanal"
                description="Resgate nove missões diárias durante a semana e receba um Cache Tático de conteúdo conhecido."
                item={view.weekly}
                busy={busy}
                icon={IMG.chest}
                onClaim={() => onClaim('weekly')}
              />
              <ActivityCardV2
                title={view.event.title}
                description="Desafio semanal com o catálogo atual. Complete os três objetivos para receber o Cache Regional de teste."
                item={view.event}
                busy={busy}
                icon={IMG.gift}
                onClaim={() => onClaim('event')}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
                  {view.event.goals.map(g => (
                    <ProgressBar key={g.title} label={g.title} current={g.current} goal={g.goal} gold />
                  ))}
                </div>
              </ActivityCardV2>
            </div>

            {/* Boss placeholder */}
            <div className="av2-boss-placeholder" style={{ marginTop: '1rem' }}>
              <h3>Evento de Boss · Em preparação</h3>
              <p>
                Batalhas e Ecos serão habilitados depois da produção e integração do lote de Bosses. Não há recompensas de Boss disponíveis nesta versão.
              </p>
            </div>
          </div>
        )}

        {/* ═══════ COLLECTION TAB ═══════ */}
        {tab === 'collection' && (
          <div>
            {onOpenCollection&&<button type="button" onClick={onOpenCollection} className="av2-claim-btn av2-claim-btn--primary" style={{marginBottom:'1rem'}}>Abrir coleção e evoluir monstros / classes</button>}
            {/* Cards */}
            <div className="av2-panel">
              <h3 className="av2-panel-title" style={{ marginBottom: '1rem' }}>
                Cartas recebidas nas atividades
              </h3>
              <div className="av2-cards-grid">
                {cards.length
                  ? cards.map(([id, n]) => (
                      <div key={id} className="av2-card-entry">
                        <img
                          src={CARD_BY_ID[id]?.cardArt}
                          alt=""
                          width={48}
                          height={56}
                          className="av2-card-entry__art"
                        />
                        <div>
                          <p className="av2-card-entry__name">{CARD_BY_ID[id]?.name || id}</p>
                          <p className="av2-card-entry__count">{n} carta(s)</p>
                        </div>
                      </div>
                    ))
                  : (
                    <p style={{ gridColumn: '1 / -1', fontSize: '.82rem', color: '#94a3b8' }}>
                      As cartas recebidas aparecerão aqui. Atributos de batalha não mudam nesta etapa.
                    </p>
                  )}
              </div>
            </div>

            {/* Receipts */}
            <div className="av2-panel">
              <h3 className="av2-panel-title" style={{ marginBottom: '.75rem' }}>
                Últimos resgates
              </h3>
              {p.receipts.length
                ? p.receipts.slice(-10).reverse().map(r => (
                    <div key={r.key} className="av2-receipt">
                      <p className="av2-receipt__date">
                        {new Date(r.at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
                      </p>
                      <RewardLabelV2 reward={r.reward} />
                      {r.classCards&&<p className="av2-panel-sub">{Object.entries(r.classCards).map(([id,n])=>`${n} carta(s) de ${id==='warrior'?'Guerreiro / Guerreira':'Arqueiro / Arqueira'}`).join(' · ')}</p>}
                    </div>
                  ))
                : (
                  <p style={{ fontSize: '.82rem', color: '#94a3b8' }}>
                    Nenhuma recompensa resgatada ainda.
                  </p>
                )}
            </div>
          </div>
        )}

        {/* ═══════ FOOTER — MCT / progress info ═══════ */}
        <details className="av2-footer">
          <summary>Informações sobre progresso local e MCT</summary>
          <p>
            <strong>Créditos internos MCT.</strong> Os marcos de 7, 14, 21 e 30 dias dão 5, 7, 10 e 15 créditos, com sequência validada online. Não são tokens blockchain, vouchers ou promessa de pagamento futuro.
          </p>
          <p>
            Gold, XP, cartas e materiais são recursos do jogo. Com login e sincronização, o progresso fica salvo na conta; como visitante, fica neste aparelho. Melhorias de cartas valem na campanha.
          </p>
        </details>
      </div>
    </div>
  );
}
