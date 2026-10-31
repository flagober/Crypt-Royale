import {useEffect, useRef, useState} from 'react';
import {
  X, Swords, Copy, UserRound, Check, Wifi, WifiOff, ArrowRight,
  ShieldCheck, Scale, Shuffle, AlertTriangle, Search, Loader2
} from 'lucide-react';
import {
  MATCHMAKING_MODES,
  MATCHMAKING_INFO,
  findMatchmakingRival,
  buildRivalProfile
} from './pvp/matchmaking.js';
import './pvp.css';

export function PvpPanel({
  state,
  access,
  configured,
  playerLevel = 1,
  onClose,
  onConnect,
  onCreate,
  onJoin,
  onReady,
  onLeave,
  onAccount,
  onStartMatch
}) {
  const [activeTab, setActiveTab] = useState('arena'); // 'arena' | 'room'
  const [mmMode, setMmMode] = useState(MATCHMAKING_MODES.BALANCED);
  const [searchState, setSearchState] = useState('idle'); // 'idle' | 'searching' | 'found'
  const [foundMatch, setFoundMatch] = useState(null);

  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [confirmLeave, setConfirmLeave] = useState(false);
  const panel = useRef(null);
  const close = useRef(onClose);
  close.current = onClose;
  const searchTimer = useRef(null);

  const room = state.room;
  const self = room?.players[room.seat];
  const connected = state.status === 'connected';
  const canPlay = configured && access.allowed && connected && !state.busy;

  useEffect(() => {
    const previous = document.activeElement;
    panel.current?.querySelector('button')?.focus();
    const key = e => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close.current();
      }
      if (e.key !== 'Tab') return;
      const items = [...panel.current.querySelectorAll('button:not(:disabled),input:not(:disabled)')].filter(n => n.getClientRects().length);
      const first = items[0], last = items.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    panel.current.addEventListener('keydown', key);
    const el = panel.current;
    return () => {
      el.removeEventListener('keydown', key);
      if (searchTimer.current) clearTimeout(searchTimer.current);
      if (previous?.isConnected) previous.focus();
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(room.code);
      setFeedback('Código copiado. Envie para seu amigo.');
    } catch {
      setFeedback('Selecione o código acima e copie para seu amigo.');
    }
  };

  const startSearch = (modeToUse = mmMode) => {
    setSearchState('searching');
    setFoundMatch(null);
    setFeedback('');
    if (searchTimer.current) clearTimeout(searchTimer.current);

    searchTimer.current = setTimeout(() => {
      const match = findMatchmakingRival(modeToUse, playerLevel);
      setFoundMatch(match);
      setSearchState('found');
    }, 1400);
  };

  const cancelSearch = () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    setSearchState('idle');
    setFoundMatch(null);
  };

  const acceptMatch = () => {
    if (!foundMatch) return;
    const {rival} = foundMatch;
    const rivalProfile = buildRivalProfile(rival);
    if (onStartMatch) {
      onStartMatch(rival, rivalProfile);
    } else {
      setFeedback(`Partida iniciada contra ${rival.name}!`);
    }
  };

  return (
    <div className="pvp-overlay">
      <section className="pvp-panel" role="dialog" aria-modal="true" aria-labelledby="pvp-title" ref={panel}>
        <header className="pvp-header">
          <div>
            <small>VILA BYTE · ENCONTRO ENTRE JOGADORES</small>
            <h2 id="pvp-title">Arena PvP</h2>
            <p>Dispute batalhas com oponentes ou desafie um amigo.</p>
          </div>
          <button className="pvp-close" aria-label="Fechar PvP amistoso" onClick={onClose}>
            <X size={22} />
          </button>
        </header>

        <div className="pvp-art" aria-hidden="true">
          <span><ShieldCheck size={36} /></span>
          <b>VS</b>
          <span><Swords size={36} /></span>
        </div>

        <div className="pvp-content">
          {!room ? (
            <>
              <div className="pvp-requirements">
                <span className={access.base >= 7 ? 'done' : ''}>
                  <Check size={16} /> Base 7 · seu nível: {playerLevel || access.base || '—'}
                </span>
                <span className={access.vilaByte ? 'done' : ''}>
                  <Check size={16} /> Três vitórias em Vila Byte
                </span>
              </div>

              {!access.allowed && <p className="pvp-notice">{access.reason}</p>}
              {!access.authenticated && (
                <button className="pvp-primary" onClick={onAccount}>
                  <UserRound size={18} /> Entrar na minha conta
                </button>
              )}

              {access.allowed && (
                <>
                  {/* Selector de Abas: Arena Matchmaking vs Sala de Amigo */}
                  <div className="pvp-tabs" role="tablist">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'arena'}
                      className={`pvp-tab ${activeTab === 'arena' ? 'is-active' : ''}`}
                      onClick={() => { setActiveTab('arena'); cancelSearch(); }}
                    >
                      <Swords size={18} /> Arena Matchmaking
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'room'}
                      className={`pvp-tab ${activeTab === 'room' ? 'is-active' : ''}`}
                      onClick={() => { setActiveTab('room'); cancelSearch(); }}
                    >
                      <UserRound size={18} /> Amistoso com Amigo
                    </button>
                  </div>

                  {activeTab === 'arena' ? (
                    <div className="pvp-mm-section">
                      {/* Modos de Matchmaking: Equilíbrio vs Livre */}
                      <div className="pvp-mode-selector">
                        <button
                          type="button"
                          className={`pvp-mode-card ${mmMode === MATCHMAKING_MODES.BALANCED ? 'is-selected' : ''}`}
                          onClick={() => { setMmMode(MATCHMAKING_MODES.BALANCED); cancelSearch(); }}
                        >
                          <div className="pvp-mode-card-header">
                            <Scale size={20} />
                            <strong>Modo Equilíbrio</strong>
                            <span className="pvp-badge pvp-badge-cyan">Recomendado</span>
                          </div>
                          <p>Busca jogadores de níveis compatíveis. Confirma se o oponente for de nível superior.</p>
                        </button>

                        <button
                          type="button"
                          className={`pvp-mode-card ${mmMode === MATCHMAKING_MODES.FREE ? 'is-selected' : ''}`}
                          onClick={() => { setMmMode(MATCHMAKING_MODES.FREE); cancelSearch(); }}
                        >
                          <div className="pvp-mode-card-header">
                            <Shuffle size={20} />
                            <strong>Modo Livre</strong>
                            <span className="pvp-badge pvp-badge-amber">Sem Filtro</span>
                          </div>
                          <p>Disputa sem limites. Enfrente quaisquer níveis (dos mais fracos aos mais fortes) direto.</p>
                        </button>
                      </div>

                      {/* Estado do Matchmaking */}
                      {searchState === 'idle' && (
                        <div className="pvp-mm-action">
                          <button
                            type="button"
                            className="pvp-primary pvp-search-btn"
                            onClick={() => startSearch()}
                          >
                            <Search size={20} /> Buscar Rival no {MATCHMAKING_INFO[mmMode].name}
                          </button>
                        </div>
                      )}

                      {searchState === 'searching' && (
                        <div className="pvp-searching-box" role="status">
                          <Loader2 size={32} className="pvp-spin" />
                          <h4>Procurando oponente na Arena…</h4>
                          <p>{MATCHMAKING_INFO[mmMode].description}</p>
                          <button type="button" className="pvp-secondary" onClick={cancelSearch}>
                            Cancelar busca
                          </button>
                        </div>
                      )}

                      {searchState === 'found' && foundMatch && (
                        <div className="pvp-found-box" role="region" aria-label="Rival encontrado">
                          <div className="pvp-rival-card">
                            <div className="pvp-rival-avatar">
                              <UserRound size={32} />
                              <span className="pvp-rival-level">Nv. {foundMatch.rival.level}</span>
                            </div>
                            <div className="pvp-rival-info">
                              <small>{foundMatch.rival.title}</small>
                              <h3>{foundMatch.rival.name}</h3>
                              <p>Nível {foundMatch.rival.level} · Base {foundMatch.rival.base}</p>
                            </div>
                            <span className={`pvp-match-tag ${foundMatch.mode === 'free' ? 'pvp-tag-amber' : 'pvp-tag-cyan'}`}>
                              {foundMatch.mode === 'free' ? 'Modo Livre' : 'Modo Equilíbrio'}
                            </span>
                          </div>

                          {/* Se for Modo Equilíbrio E o rival for de nível superior: pergunta de confirmação */}
                          {foundMatch.mode === MATCHMAKING_MODES.BALANCED && foundMatch.requiresConfirmation ? (
                            <div className="pvp-confirm-challenge" role="alert">
                              <div className="pvp-confirm-heading">
                                <AlertTriangle size={24} className="text-amber-400" />
                                <div>
                                  <h4>Atenção: Oponente de Nível Superior</h4>
                                  <p>
                                    O jogador <strong>{foundMatch.rival.name}</strong> está{' '}
                                    <strong>{foundMatch.levelDiff} {foundMatch.levelDiff === 1 ? 'nível' : 'níveis'} acima do seu</strong> (você é Nv. {playerLevel}).
                                  </p>
                                  <strong>Deseja realmente enfrentá-lo?</strong>
                                </div>
                              </div>
                              <div className="pvp-confirm-actions">
                                <button type="button" className="pvp-primary pvp-accept-btn" onClick={acceptMatch}>
                                  <Swords size={18} /> Sim, aceitar desafio!
                                </button>
                                <button type="button" className="pvp-secondary" onClick={() => startSearch(MATCHMAKING_MODES.BALANCED)}>
                                  Não, buscar outro rival
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="pvp-ready-match">
                              <p className="pvp-ready-text">
                                {foundMatch.mode === MATCHMAKING_MODES.FREE
                                  ? 'No Modo Livre todos os níveis são aleatórios. Pronto para entrar na arena!'
                                  : 'Oponente de nível compatível encontrado!'}
                              </p>
                              <button type="button" className="pvp-primary pvp-accept-btn" onClick={acceptMatch}>
                                <Swords size={18} /> Iniciar Batalha na Arena <ArrowRight size={18} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Aba: Sala de Amigo (código de 6 letras) */
                    <div className="pvp-friend-section">
                      {!configured && (
                        <p className="pvp-notice" role="status">
                          O amistoso via servidor está em preparação.
                        </p>
                      )}
                      {configured && !connected && (
                        <button
                          className="pvp-primary"
                          disabled={state.status === 'connecting' || state.status === 'reconnecting'}
                          onClick={onConnect}
                        >
                          {state.status === 'connecting' || state.status === 'reconnecting'
                            ? 'Conectando ao servidor…'
                            : 'Conectar ao servidor de salas'}
                        </button>
                      )}
                      <button className="pvp-primary" disabled={!canPlay} onClick={onCreate}>
                        <Swords size={19} /> Criar uma sala com código <ArrowRight size={18} />
                      </button>
                      <div className="pvp-divider">ou entre com o código de um amigo</div>
                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          if (canPlay && code.length === 6) onJoin(code);
                        }}
                      >
                        <label htmlFor="pvp-code">Código da sala (6 letras)</label>
                        <div className="pvp-join">
                          <input
                            id="pvp-code"
                            value={code}
                            onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-HJ-NP-Z2-9]/g, '').slice(0, 6))}
                            placeholder="ABC234"
                            maxLength={6}
                            autoComplete="off"
                            autoCapitalize="characters"
                            spellCheck={false}
                          />
                          <button disabled={!canPlay || code.length !== 6} type="submit">
                            Entrar
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            /* Visualização da Sala Ativa */
            <>
              {configured && access.allowed && state.status === 'error' && (
                <button className="pvp-primary" onClick={onConnect}>
                  Reconectar à sala
                </button>
              )}
              <div className="pvp-room-code">
                <small>CÓDIGO DO AMISTOSO</small>
                <div>
                  <strong>{room.code}</strong>
                  <button onClick={copy} aria-label="Copiar código da sala">
                    <Copy size={19} />
                  </button>
                </div>
              </div>
              <div className="pvp-players">
                {[0, 1].map(i => {
                  const p = room.players[i];
                  return (
                    <article key={i} className={p?.ready ? 'ready' : ''}>
                      <span className="pvp-avatar"><UserRound size={26} /></span>
                      <b>{p?.name || 'Seu próximo rival'}</b>
                      <small>{i === room.seat ? 'Você' : p ? 'Rival' : 'Compartilhe o código'}</small>
                      <p>
                        {p ? (
                          p.connected ? (
                            <><Wifi size={14} />{p.ready ? 'Pronto' : 'Conectado'}</>
                          ) : (
                            <><WifiOff size={14} />Desconectado</>
                          )
                        ) : (
                          'Aguardando…'
                        )}
                      </p>
                    </article>
                  );
                })}
              </div>
              {room.status === 'countdown' && (
                <p className="pvp-countdown" role="status">
                  A batalha começa em {Math.ceil(room.countdownMs / 1000)}…
                </p>
              )}
              {['waiting', 'countdown'].includes(room.status) && (
                <button className="pvp-primary" disabled={!canPlay} onClick={() => onReady(!self?.ready)}>
                  {self?.ready ? 'Cancelar pronto' : 'Estou pronto para a batalha'}
                </button>
              )}
              {room.status === 'playing' && (
                <>
                  <p className="pvp-notice">
                    {room.paused
                      ? `Partida pausada para reconexão. Prazo restante: ${room.reconnectSeconds} s.`
                      : 'A batalha continua enquanto este painel está aberto.'}
                  </p>
                  <button className="pvp-primary" onClick={onClose}>
                    Retomar arena <ArrowRight size={18} />
                  </button>
                </>
              )}
              {['finished', 'cancelled'].includes(room.status) && (
                <div className="pvp-result">
                  <h3>{room.status === 'cancelled' ? 'Amistoso cancelado' : state.game?.message || 'Amistoso concluído'}</h3>
                  <p>{room.resultReason}</p>
                  <p>O amistoso não altera seus recursos nem a campanha.</p>
                </div>
              )}
              {confirmLeave ? (
                <div className="pvp-leave-confirm">
                  <p>{room.status === 'playing' ? 'Desistir encerra sua participação e dá a vitória ao rival.' : 'Deseja sair desta sala?'}</p>
                  <div>
                    <button onClick={() => { setConfirmLeave(false); onLeave(); }}>Confirmar saída</button>
                    <button onClick={() => setConfirmLeave(false)}>Continuar aqui</button>
                  </div>
                </div>
              ) : (
                <button
                  className="pvp-secondary"
                  onClick={() => (['finished', 'cancelled'].includes(room.status) ? onLeave() : setConfirmLeave(true))}
                >
                  {room.status === 'playing' ? 'Desistir e voltar ao treino' : 'Sair da sala'}
                </button>
              )}
            </>
          )}

          <p className="pvp-feedback" role="status">{feedback || state.message}</p>
          <ul className="pvp-rules">
            <li><strong>Modo Equilíbrio:</strong> Busca oponentes compatíveis com seu nível e pergunta antes de desafiar níveis superiores.</li>
            <li><strong>Modo Livre:</strong> Todos os níveis disputam entre si aleatoriamente, dos mais fracos aos mais fortes.</li>
            <li>1 contra 1 · somente jogadas manuais na Arena de Vila Byte.</li>
            <li>Atributos normalizados; suas formas conquistadas continuam visíveis.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
