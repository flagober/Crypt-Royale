import {useEffect, useRef, useState} from 'react';
import {Mail, X, Sparkles, Database, Swords, Crosshair, Gift, CheckCircle2} from 'lucide-react';
import {usePlayer} from './AccountPanel.jsx';
import {watchMail, friendlyError} from './cloud.js';
import {CARD_BY_ID} from './game/cards.js';
import './mailbox.css';

function RewardItemCard({type, title, subtitle, badge, count, image, icon: Icon, color = 'gold'}) {
  return (
    <article className={`mail-reward-card mail-reward-card--${color}`} tabIndex={0}>
      <div className="mail-reward-visual">
        {image ? (
          <img
            src={image}
            alt={title}
            className="mail-reward-img"
            loading="lazy"
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : Icon ? (
          <Icon className="mail-reward-icon" size={26} />
        ) : null}
        {count && <span className="mail-reward-multiplier">{count}</span>}
      </div>
      <div className="mail-reward-details">
        {badge && <span className="mail-reward-badge">{badge}</span>}
        <strong className="mail-reward-title">{title}</strong>
        {subtitle && <small className="mail-reward-subtitle">{subtitle}</small>}
      </div>
    </article>
  );
}

export function Reward({value}) {
  if (!value) return null;
  return (
    <div className="mail-rewards-grid">
      {value.gold > 0 && (
        <RewardItemCard
          type="gold"
          title={`+${value.gold.toLocaleString('pt-BR')} Gold`}
          subtitle="Moeda de Vila Byte"
          badge="Recurso"
          image="/assets/rewards/vila-byte-coins-v001.png"
          color="gold"
        />
      )}
      {value.xp > 0 && (
        <RewardItemCard
          type="xp"
          title={`+${value.xp.toLocaleString('pt-BR')} XP`}
          subtitle="Experiência de Conta"
          badge="Evolução"
          icon={Sparkles}
          color="purple"
        />
      )}
      {value.dataFragments > 0 && (
        <RewardItemCard
          type="dataFragments"
          title={`+${value.dataFragments.toLocaleString('pt-BR')} Fragmentos`}
          subtitle="Fragmentos de Dados"
          badge="Tecnologia"
          icon={Database}
          color="cyan"
        />
      )}
      {Object.entries(value.cards || {}).map(([id, n]) => {
        const card = CARD_BY_ID[id];
        return (
          <RewardItemCard
            key={id}
            type="card"
            title={card?.name || id}
            subtitle={card?.role || 'Tropa'}
            badge="Carta"
            count={`×${n}`}
            image={card?.cardArt}
            color="blue"
          />
        );
      })}
      {Object.entries(value.classCards || {}).map(([id, n]) => (
        <RewardItemCard
          key={id}
          type="classCard"
          title={id === 'warrior' ? 'Guerreiro' : 'Arqueiro'}
          subtitle={`${n} cartas de classe`}
          badge="Classe"
          count={`×${n}`}
          icon={id === 'warrior' ? Swords : Crosshair}
          color="emerald"
        />
      ))}
    </div>
  );
}

export function MailboxPanel({onClose}) {
  const player = usePlayer();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(null);
  const [celebration, setCelebration] = useState(null);
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const switching = (player.user?.uid || null) !== player.uid;

  useEffect(() => {
    setMessages([]);
    setError('');
    setLoading(!!player.uid);
    if (!player.uid || switching) return;
    return watchMail(
      player.uid,
      list => {
        setMessages(list);
        setLoading(false);
      },
      e => {
        setError(friendlyError(e));
        setLoading(false);
      }
    );
  }, [player.uid, player.user?.uid, switching]);

  useEffect(() => {
    const previous = document.activeElement;
    ref.current?.focus();
    const onKey = e => {
      if (e.key === 'Escape') closeRef.current();
      if (e.key === 'Tab') {
        const list = [...ref.current.querySelectorAll('button:not(:disabled),a[href]')];
        const first = list[0], last = list.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.isConnected && previous.focus();
    };
  }, []);

  const claim = async (id, reward) => {
    if (busy) return;
    setBusy(id);
    setError('');
    try {
      await player.store.claimMail(id);
      if (reward) {
        setCelebration(reward);
      }
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mail-overlay" role="dialog" aria-modal="true" aria-labelledby="mail-title" tabIndex={-1} ref={ref}>
      <section className="mail-shell">
        <header>
          <div>
            <small>VILA BYTE · CORREIO</small>
            <h2 id="mail-title"><Mail /> Sua caixa de correio</h2>
            <p>Mensagens e presentes enviados pela equipe do Crypt Royale.</p>
          </div>
          <button onClick={onClose} aria-label="Fechar caixa de correio"><X /></button>
        </header>

        {switching ? (
          <p role="status">Conferindo os dados da sua conta…</p>
        ) : !player.uid ? (
          <div className="mail-empty">
            <img className="mail-chest" src="/assets/rewards/founder-chest-v001.png" alt="Baú Fundador de Vila Byte" />
            <h3>Seus presentes têm endereço certo.</h3>
            <p>Entre na sua conta para consultar mensagens e receber brindes. O progresso de visitante fica guardado neste aparelho.</p>
            <button onClick={() => { onClose(); player.open(); }}>Entrar na minha conta</button>
          </div>
        ) : (
          <>
            {error && <p role="alert" className="mail-error">{error}</p>}
            {loading && <p role="status">Buscando suas mensagens…</p>}
            {!loading && !error && !messages.length && (
              <p className="mail-empty">Sua caixa está vazia. Quando a equipe enviar um presente, ele aparecerá aqui.</p>
            )}

            {messages.map(m => (
              <article key={m.id} className={'mail-item ' + (m.claimedAt ? 'claimed' : '')}>
                <div className="mail-item-heading">
                  <img src="/assets/rewards/founder-chest-v001.png" alt="Presente da equipe" />
                  <div>
                    <h3>{m.title}</h3>
                    <time>{new Date(m.createdAt).toLocaleString('pt-BR')}</time>
                  </div>
                  <span>{m.claimedAt ? 'Recebido' : 'Presente disponível'}</span>
                </div>
                <p className="mail-body">{m.body}</p>
                <Reward value={m.reward} />
                <button
                  disabled={!!m.claimedAt || !!busy || !player.ready || player.status !== 'synced'}
                  onClick={() => claim(m.id, m.reward)}
                >
                  {m.claimedAt ? 'Presente recebido' : busy === m.id ? 'Recebendo…' : 'Receber presente'}
                </button>
              </article>
            ))}

            <p className="mail-note">
              Últimas 50 mensagens. Cada presente pode ser recebido uma vez por conta. Gold, cartas e Fragmentos de Dados são recursos do jogo, sem valor financeiro.
            </p>
            {player.status !== 'synced' && (
              <p role="status">{player.message} Sincronize a conta antes de receber presentes.</p>
            )}
          </>
        )}

        {/* Modal de Celebração com os cards dos itens resgatados */}
        {celebration && (
          <div className="mail-celebration-overlay" role="dialog" aria-modal="true" aria-labelledby="celebration-title">
            <div className="mail-celebration-card">
              <div className="mail-celebration-icon">
                <Gift size={42} />
              </div>
              <h3 id="celebration-title">Presente Resgatado com Sucesso!</h3>
              <p>Os seguintes itens foram entregues na sua conta:</p>
              <div className="mail-celebration-items">
                <Reward value={celebration} />
              </div>
              <button
                type="button"
                className="mail-celebration-btn"
                onClick={() => setCelebration(null)}
              >
                <CheckCircle2 size={18} /> Confirmar e Voltar
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
