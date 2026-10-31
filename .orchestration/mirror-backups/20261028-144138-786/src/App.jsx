import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Sparkles, Swords, Timer, Zap, MoreVertical, Mail } from 'lucide-react';
import { CARD_BY_ID } from './game/cards.js';
import { activateOperator, ARENA, createGame, deployCard, getHud, stepGame } from './game/engine.js';
import { renderGame } from './game/render.js';
import { getAudioManager } from './game/audio-manager.js';
import {GameMenu} from './GameMenu.jsx';
import { ActivitiesPanelV2 as ActivitiesPanel } from './ActivitiesPanelV2.jsx';
import { PROGRESS_KEY } from './activities-storage.js';
import { recordBattle, claimActivity, battleEligibility } from './game/activities.js';
import releaseInfo from '../versao.json';
import {prepareTowerArt} from './game/tower-assets.js';
import {setCoreAppearance} from './game/tower-animation.js';
import {MapChooser} from './MapChooser.jsx';
import {mapById,setGameMap,DEFAULT_MAP_ID} from './game/maps.js';
import {prepareMapArt} from './game/map-art.js';
import {ProgressionPanel} from './ProgressionPanel.jsx';
import {STAGES,playerLevel,upgradeMonster,evolveMonster,upgradeClass,specializeClass,recordCampaignBattle} from './game/progression.js';
import {configureCampaign} from './game/progression-engine.js';
import {PlayerProvider,usePlayer} from './AccountPanel.jsx';
import {WelcomePanel} from './WelcomePanel.jsx';
import {ReleaseNotes} from './ReleaseNotes.jsx';
import {MailboxPanel} from './MailboxPanel.jsx';

const MAP_KEY='crypt-royale-map-v1';
function savedMap(){try{return mapById(window.localStorage.getItem(MAP_KEY)).id;}catch{return DEFAULT_MAP_ID;}}

const APPEARANCE_KEY='crypt-royale-core-appearance-v1';
function savedAppearance(){try{return window.localStorage.getItem(APPEARANCE_KEY)==='female'?'female':'male';}catch{return 'male';}}

function newActivityGame(mapId=savedMap()) {
  const game = createGame(undefined,mapId);
  setCoreAppearance(game,savedAppearance());
  game.activityId = globalThis.crypto?.randomUUID?.() || `match-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return game;
}

function formatTime(milliseconds) {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;
}

function Arena({ gameRef, selectedCard, onDeploy, paused }) {
  const canvasRef = useRef(null);
  const selectedRef = useRef(selectedCard);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    selectedRef.current = selectedCard;
  }, [selectedCard]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let animationFrame = 0;
    let previous = performance.now();
    let accumulator = 0;

    const frame = (now) => {
      const elapsed = Math.min(100, now - previous);
      previous = now;
      if (!pausedRef.current) {
        accumulator += elapsed;
        while (accumulator >= 50) {
          stepGame(gameRef.current, 50);
          accumulator -= 50;
        }
      }
      renderGame(context, gameRef.current, selectedRef.current);
      animationFrame = requestAnimationFrame(frame);
    };

    renderGame(context, gameRef.current, selectedRef.current);
    animationFrame = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animationFrame);
  }, [gameRef]);

  const handlePointer = (event) => {
    if (!selectedCard) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * ARENA.width;
    const y = ((event.clientY - bounds.top) / bounds.height) * ARENA.height;
    onDeploy(x, y);
  };

  return (
    <div className="arena-shell relative overflow-hidden rounded-3xl border border-cyan-300/25 bg-slate-950 shadow-2xl shadow-cyan-950/60">
      <canvas
        ref={canvasRef}
        width={ARENA.width}
        height={ARENA.height}
        onPointerDown={handlePointer}
        className={`block h-auto w-full touch-none ${selectedCard ? 'cursor-crosshair' : 'cursor-default'}`}
        aria-label={`Arena ${mapById(gameRef.current.mapId).name}. Escolha uma carta e toque na metade azul para posicionar uma tropa.`}
      />
      {selectedCard && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-cyan-300/40 bg-slate-950/90 px-4 py-2 text-xs font-bold text-cyan-100 shadow-lg">
          Toque na área azul para posicionar {selectedCard.name}
        </div>
      )}
    </div>
  );
}

function CardButton({ cardId, energy, selected, onSelect,stats }) {
  const card = CARD_BY_ID[cardId];
  const affordable = energy + 0.0001 >= card.cost;
  
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const fallback = e.target.parentElement.querySelector('.fallback-glyph');
    if (fallback) fallback.style.display = 'grid';
  };

  return (
    <button
      type="button"
      onClick={() => affordable && onSelect(card)}
      disabled={!affordable}
      aria-pressed={selected}
      title={`${card.name} · ${card.targetPolicy==='structures'?'Ataca somente torres':card.role}`}
      className={`group relative flex min-h-[4.5rem] md:min-h-32 flex-col rounded-xl md:rounded-2xl border p-1 md:p-2 md:pt-4 overflow-hidden text-center md:text-left transition duration-150 ${
        selected
          ? 'translate-y-[-4px] md:translate-y-[-8px] border-yellow-300 bg-yellow-300/10 shadow-[0_0_15px_rgba(253,224,71,.35)]'
          : affordable
            ? 'border-slate-600 bg-slate-900 md:hover:-translate-y-1 md:hover:border-cyan-300/70'
            : 'cursor-not-allowed border-slate-800 bg-slate-950 opacity-45 grayscale'
      }`}
    >
      <div className="absolute inset-0 z-0">
        {card.cardArt && (
          <img src={card.cardArt} alt={`${card.name} — ${card.canonicalId}`} className="h-full w-full object-cover object-center" onError={handleImageError} />
        )}
        <div 
           className={`fallback-glyph ${card.cardArt ? 'hidden' : 'grid'} h-full w-full place-items-center font-black text-slate-950 opacity-50`} 
           style={{ backgroundColor: card.color }}>
          {card.glyph}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
      </div>
      
      <span className="absolute -left-1 -top-1 md:-left-2 md:-top-2 z-10 grid h-6 w-6 md:h-8 md:w-8 place-items-center rounded-full border-2 border-slate-950 bg-fuchsia-600 text-xs md:text-sm font-black text-white shadow-md">
        {card.cost}
      </span>
      
      <div className="relative z-10 mt-auto w-full pt-6 md:pt-12 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-1">
          <span className="block truncate text-[9px] md:text-xs font-extrabold text-white leading-tight">{card.name}</span>
          <span className="text-[8px] md:text-[10px] font-bold text-cyan-300">x{card.count}</span>
        </div>
        {card.targetPolicy==='structures' && <span className="block mt-0.5 text-[8px] md:text-[10px] font-bold text-amber-200">Só torres</span>}
        <span className="hidden md:block mt-0.5 truncate text-[10px] uppercase tracking-wide text-slate-400">{card.role} · Comum</span>
        {stats&&<span className="block text-[8px] md:text-[10px] font-bold text-cyan-200">Nv. {stats.level} · Forma {stats.form+1}</span>}
      </div>
    </button>
  );
}


function MobileToast({ message }) {
  const [visible, setVisible] = useState(false);
  const [currentMsg, setCurrentMsg] = useState('');

  useEffect(() => {
    if (!message) return;
    setCurrentMsg(message);
    setVisible(true);

    const isError = message.toLowerCase().includes('insuficiente') || 
                    message.toLowerCase().includes('não') || 
                    message.toLowerCase().includes('limite') ||
                    message.toLowerCase().includes('inválido');
    const delay = isError ? 4000 : 2500;

    const t = setTimeout(() => {
      setVisible(false);
    }, delay);

    return () => clearTimeout(t);
  }, [message]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mx-auto w-max max-w-[90%] rounded-2xl border border-cyan-400/30 bg-slate-900/95 px-4 py-2.5 text-center text-[11px] md:text-xs font-bold text-cyan-100 shadow-xl backdrop-blur-md">
        {currentMsg}
      </div>
    </div>
  );
}

export default function App(){return <PlayerProvider><Game/></PlayerProvider>;}
function Game() {
  const account=usePlayer(),store=account.store,progress=account.profile;
  const [welcomeOpen,setWelcomeOpen]=useState(()=>{try{return window.localStorage.getItem('cryptroyale.welcome.v1')!=='seen';}catch{return true;}});
  const [releasesOpen,setReleasesOpen]=useState(false);
  const [mailOpen,setMailOpen]=useState(false);
  const closeWelcome=()=>{setWelcomeOpen(false);try{window.localStorage.setItem('cryptroyale.welcome.v1','seen');}catch{}};
  const gameRef = useRef(null);
  if (!gameRef.current) gameRef.current = newActivityGame();
  const [appearance,setAppearance]=useState(savedAppearance);
  const [mapId,setMapId]=useState(()=>gameRef.current.mapId);
  const [mapsOpen,setMapsOpen]=useState(false);
  const [mapArtState,setMapArtState]=useState('loading');
  useEffect(()=>{let active=true;setMapArtState('loading');prepareMapArt(mapId).then(()=>{if(active)setMapArtState('ready');}).catch(()=>{if(active)setMapArtState('error');});return()=>{active=false;};},[mapId]);
  const chooseMap=id=>{if(setGameMap(gameRef.current,id)){setMapId(id);try{window.localStorage.setItem(MAP_KEY,id);}catch{ /* Selection remains active in this session. */ }setMapsOpen(false);}};
  const [towerArtState,setTowerArtState]=useState('loading');
  useEffect(()=>{let active=true;prepareTowerArt().then(()=>{if(active)setTowerArtState('ready');}).catch(()=>{if(active)setTowerArtState('error');});return()=>{active=false;};},[]);
  const chooseAppearance=event=>{const value=event.target.value;if(setCoreAppearance(gameRef.current,value)){setAppearance(value);try{window.localStorage.setItem(APPEARANCE_KEY,value);}catch{ /* Cosmetic selection remains valid for this session. */ }}};
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [progressionTab,setProgressionTab]=useState(null);
  const [activityNow, setActivityNow] = useState(Date.now());
  const [activityMessage, setActivityMessage] = useState('');
  const [progressBusy, setProgressBusy] = useState(false);
  const progressQueue = useRef(Promise.resolve());
  const handledMatch = useRef(null);
  const progressAction = (updater, message) => {
    const actionEpoch=store.epoch;
    const job = progressQueue.current.then(async () => {
      setProgressBusy(true);
      try {
        if(actionEpoch!==store.epoch)throw Error('Conta alterada antes de salvar esta ação.');
        const write = () => store.update(updater);
        const next = navigator.locks ? await navigator.locks.request(PROGRESS_KEY, write) : await write();
        setActivityMessage(store.state.status==='synced'?message+' Save confirmado na conta.':message+' '+store.state.message); return true;
      } catch (error) { setActivityMessage(`Não foi possível salvar: ${error.message}. Dados anteriores preservados.`); return false; }
      finally { setProgressBusy(false); }
    });
    progressQueue.current = job.catch(() => {});
    return job;
  };
  const registerFinishedGame = (game) => {
    if(!store.state.ready||owner.current!==store.state.uid)return;
    if (game.status !== 'finished' || handledMatch.current === game.activityId) return;
    handledMatch.current = game.activityId;
    const summary = { id: game.activityId, campaignStageId:game.campaignStageId, playerCrowns:getHud(game).playerCrowns,durationMs: game.nowMs, winner: game.winner, ...structuredClone(game.activityStats) };
    progressAction(p => recordCampaignBattle(recordBattle(p, summary),summary), battleEligibility(summary) || (game.campaignStageId?'Resultado e recompensas da campanha salvos. Abra Campanha para seguir.':'Partida registrada nas atividades. Abra a central para acompanhar e resgatar os objetivos.'));
  };
  const collectActivity = (kind, id) => progressAction(p => claimActivity(p, kind, id), 'Recompensa recebida e salva neste navegador.');
  const openActivities = () => { setActivityNow(Date.now()); setActivitiesOpen(true); };
  const openProgression=tab=>{setActivitiesOpen(false);setMapsOpen(false);setProgressionTab(tab);setShowMobileMenu(false);};
  const startStage=id=>{try{if(!store.state.ready)throw Error('Abra sua conta para conferir o save antes de jogar.');registerFinishedGame(gameRef.current);const current=store.state.profile;const game=configureCampaign(newActivityGame(),current,id);gameRef.current=game;setMapId(game.mapId);setSelectedCard(null);setProgressionTab(null);refreshHud();}catch(error){setActivityMessage(error.message);}};
  useEffect(() => {
    const timer = window.setInterval(() => setActivityNow(Date.now()), 30000);
    return () => { window.clearInterval(timer); };
  }, []);
  const owner=useRef(account.uid);
  useEffect(()=>{if(owner.current!==account.uid){owner.current=account.uid;gameRef.current=newActivityGame();handledMatch.current=null;setSelectedCard(null);setActivitiesOpen(false);setProgressionTab(null);setActivityMessage('Conta alterada. Partida reiniciada para manter os saves separados.');}},[account.uid]);
  useEffect(() => {
    if (!activitiesOpen && !mapsOpen && !progressionTab) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = event => { if (event.key === 'Escape') {setActivitiesOpen(false);setMapsOpen(false);setProgressionTab(null);} };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', onKey); };
  }, [activitiesOpen,mapsOpen,progressionTab]);
  const [hud, setHud] = useState(() => getHud(gameRef.current));
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const audioManager = getAudioManager();
    const interval = window.setInterval(() => { setHud(getHud(gameRef.current)); registerFinishedGame(gameRef.current); }, 100);
    return () => {
       window.clearInterval(interval);
       audioManager.dispose();
    };
  }, []);

  const refreshHud = () => setHud(getHud(gameRef.current));

  const deploy = (x, y) => {
    if (!selectedCard) return;
    const result = deployCard(gameRef.current, selectedCard.id, x, y);
    if (result.ok) setSelectedCard(null);
    else gameRef.current.message = result.reason;
    refreshHud();
  };

  const useOperator = () => {
    activateOperator(gameRef.current);
    refreshHud();
  };

  const restart = () => {
    registerFinishedGame(gameRef.current);
    const stageId=gameRef.current.campaignStageId;
    try{if(!store.state.ready)return;const next=newActivityGame(mapId);if(stageId)configureCampaign(next,store.state.profile,stageId);gameRef.current=next;}catch(error){setActivityMessage(error.message);return;}
    setSelectedCard(null);
    refreshHud();
    getAudioManager().setPrefs({ mode: 'automatic' }); // Ensure automatic mode on restart
  };
  const restartTraining=()=>{registerFinishedGame(gameRef.current);gameRef.current=newActivityGame(mapId);setSelectedCard(null);refreshHud();};

  const nextCard = CARD_BY_ID[hud.nextCard];
  const operatorReady = hud.operatorCooldownMs <= 0 && hud.status === 'playing';

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const toggleAutomatic=()=>{gameRef.current.automaticEnabled=!gameRef.current.automaticEnabled;if(gameRef.current.automaticEnabled&&gameRef.current.status==='playing')gameRef.current.activityStats.automaticUsed=true;gameRef.current.automaticThinkMs=0;setSelectedCard(null);refreshHud();};
  const menuAction=action=>()=>{setShowMobileMenu(false);action();};
  const currentStage=STAGES.find(s=>s.id===gameRef.current.campaignStageId);
  const currentPlayerLevel=progress?playerLevel(progress.wallet.xp):null;

  return (
    <main data-cr-version={releaseInfo.versao} className="cr-game flex min-h-[100dvh] flex-col bg-[#020617] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] md:block md:min-h-screen md:px-6 md:py-4 text-slate-100">
      {welcomeOpen&&<WelcomePanel ready={account.ready} onClose={closeWelcome} onAccount={()=>{closeWelcome();account.open();}} onCampaign={()=>{closeWelcome();openProgression('campaign');}}/>}
      {releasesOpen&&<ReleaseNotes onClose={()=>setReleasesOpen(false)}/>}
      {mailOpen&&<MailboxPanel key={account.user?.uid||'guest'} onClose={()=>setMailOpen(false)}/>}
      {mapsOpen && <MapChooser current={mapId} onApply={chooseMap} onClose={()=>setMapsOpen(false)}/>}
      {progressionTab&&<ProgressionPanel profile={progress} initialTab={progressionTab} busy={progressBusy} message={activityMessage} onClose={()=>setProgressionTab(null)} onUpgrade={(id,level)=>progressAction(p=>upgradeMonster(p,id,level),'Nível melhorado e salvo. O novo poder vale na próxima partida de campanha.')} onEvolve={(id,form)=>progressAction(p=>evolveMonster(p,id,form),'Nova forma conquistada e salva! Válida na próxima partida de campanha.')} onClassUpgrade={(id,level)=>progressAction(p=>upgradeClass(p,id,level),'Classe melhorada e salva. Válida na próxima partida de campanha.')} onSpecialize={(id,branch)=>progressAction(p=>specializeClass(p,id,branch),'Especialização conquistada e salva. Válida na próxima partida de campanha.')} onStartStage={startStage}/>}
      {activitiesOpen && (progress ? <ActivitiesPanel profile={progress} now={activityNow} onClose={() => setActivitiesOpen(false)} onClaim={collectActivity} busy={progressBusy} message={activityMessage} onOpenCollection={()=>openProgression('collection')} onOpenMct={()=>openProgression('mct')} onRetryBattle={hud.status === 'finished' ? () => { handledMatch.current = null; registerFinishedGame(gameRef.current); } : null}/> : <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950 p-6"><div className="max-w-lg space-y-4"><h2 className="text-xl font-bold">Progresso local preservado</h2><p>Não foi possível ler os dados. Não serão substituídos por um perfil vazio.</p><p>{activityMessage}</p><button onClick={() => setActivitiesOpen(false)} className="rounded-xl bg-cyan-300 px-4 py-3 font-bold text-slate-950">Voltar à arena</button></div></div>)}
      <GameMenu open={showMobileMenu} onClose={()=>setShowMobileMenu(false)} hud={hud} account={account} profile={progress} version={releaseInfo.versao} mapName={mapById(mapId).name} inCampaign={!!currentStage} appearance={appearance} onAppearance={chooseAppearance} onAutomatic={toggleAutomatic} onAccount={menuAction(account.open)} onMail={menuAction(()=>setMailOpen(true))} onActivities={menuAction(openActivities)} onProgression={openProgression} onMaps={menuAction(()=>setMapsOpen(true))} onWelcome={menuAction(()=>setWelcomeOpen(true))} onRestart={menuAction(restartTraining)} onNotes={menuAction(()=>setReleasesOpen(true))}/>
      <div inert={activitiesOpen||mapsOpen||progressionTab||welcomeOpen||account.isOpen||releasesOpen||mailOpen||showMobileMenu ? "" : undefined} className="cr-game-layout mx-auto flex h-full flex-col md:grid md:max-w-6xl md:gap-5 md:grid-cols-[minmax(0,430px)_minmax(330px,1fr)] md:items-start">
        
        {/* Mobile Header */}
        <header className="cr-game-header flex h-[44px] md:h-auto md:col-span-2 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-3 md:mb-3 md:rounded-2xl md:border md:px-4 md:py-2 z-20">
          <div className="cr-header-player">
            <button type="button" className="cr-player-level" disabled={!currentPlayerLevel||!account.ready} onClick={()=>openProgression('collection')} aria-label={currentPlayerLevel?`Nível do jogador ${currentPlayerLevel.level} · Ver progresso`:'Carregando nível do jogador'} title={currentPlayerLevel?`${progress.wallet.xp.toLocaleString('pt-BR')} XP · Ver seu progresso`:'Carregando progresso'}><img src="/assets/rewards/vila-byte-xp-v001.png" alt="" width="20" height="20"/><span>Nv. {currentPlayerLevel?.level??'—'}</span></button>
            <h1 className="flex items-center text-[13px] font-black"><span className="sr-only">Crypt Royale</span><img src="/assets/branding/crypt-royale-logo-v001.png" alt="" width="1536" height="1024" className="cr-header-logo"/></h1>
            <div className="cr-header-context hidden md:block text-xs text-slate-400"><strong className="block text-sm text-slate-200">{mapById(mapId).name}</strong>{currentStage?`Campanha · Fase ${currentStage.index}`:'Treino livre'}</div>
          </div>
          <button type="button" role="switch" aria-checked={hud.automaticEnabled} aria-label="Modo automático" title={hud.automaticEnabled?'Desligar jogo automático':'Ligar jogo automático'} disabled={!account.ready} onClick={toggleAutomatic} className="cr-auto-toggle">{hud.automaticEnabled?'AUTO':'OFF'}</button>
          <div className="cr-header-actions"><div className="cr-battle-time" aria-label={`Tempo restante: ${formatTime(hud.remainingMs)}`}><Timer size={13}/>{formatTime(hud.remainingMs)}</div><button type="button" onClick={()=>setShowMobileMenu(true)} className="cr-header-icon" aria-label="Menu de opções" aria-expanded={showMobileMenu} aria-controls="cr-game-menu"><MoreVertical size={19}/></button><button type="button" onClick={()=>setMailOpen(true)} className="cr-header-icon cr-header-mail" aria-label="Abrir caixa de correio" title="Correio"><Mail size={19}/></button></div>
        </header>

        <section className="cr-game-arena relative flex min-h-0 flex-1 flex-col md:block">
          {/* Mobile HUD overlay (Now without the center menu button) */}
          <div className="absolute left-2 right-2 top-2 z-10 flex justify-between gap-2 md:hidden pointer-events-none">
            <div className="flex flex-col items-center rounded-xl border border-cyan-400/20 bg-cyan-950/60 p-1.5 px-3 backdrop-blur-sm shadow-md pointer-events-auto">
               <span className="text-[9px] font-bold uppercase text-cyan-300">Você</span>
               <span className="text-lg font-black leading-none">{hud.playerCrowns}</span>
            </div>
            {/* Center is free so tower is not blocked */}
            <div className="flex flex-col items-center rounded-xl border border-rose-400/20 bg-rose-950/60 p-1.5 px-3 backdrop-blur-sm shadow-md pointer-events-auto">
               <span className="text-[9px] font-bold uppercase text-rose-300">Rival</span>
               <span className="text-lg font-black leading-none">{hud.enemyCrowns}</span>
            </div>
          </div>

          <div className="cr-arena-host flex min-h-0 flex-1 items-center justify-center p-2 md:p-0">
             <Arena gameRef={gameRef} selectedCard={selectedCard} onDeploy={deploy} paused={!account.ready||account.isOpen||mailOpen||releasesOpen||welcomeOpen||activitiesOpen||mapsOpen||!!progressionTab||showMobileMenu} />
          </div>

          {hud.status === 'finished' && (
            <div className="absolute inset-0 z-30 grid place-items-center rounded-3xl bg-slate-950/75 p-4 text-center backdrop-blur-sm pointer-events-auto">
              <div className="rounded-3xl border border-cyan-300/30 bg-slate-950 p-6 shadow-2xl">
                <Swords className="mx-auto mb-3 h-10 w-10 text-cyan-300" />
                <h2 className="text-xl md:text-2xl font-black">{hud.message}</h2>
                <p className="mt-2 text-sm text-slate-400">Placar: {hud.playerCrowns} × {hud.enemyCrowns}</p>
                {activityMessage && <p role="status" className="mt-3 max-w-sm text-xs text-cyan-200">{activityMessage}</p>}
                {currentStage&&<button type="button" onClick={()=>openProgression('campaign')} className="mt-4 min-h-[44px] rounded-xl border border-cyan-400 px-4 py-2 text-sm font-bold text-cyan-200">Ver campanha e próxima fase</button>}
                <button type="button" onClick={openActivities} className="mt-4 min-h-[44px] rounded-xl border border-amber-400/40 px-4 py-2 text-sm font-bold text-amber-200">Ver missões e recompensas</button>
                <button type="button" onClick={restart} className="mt-5 min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-black text-slate-950 hover:bg-cyan-200">
                  <RotateCcw className="h-4 w-4" /> Jogar novamente
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="cr-game-hand sticky bottom-0 z-20 flex shrink-0 flex-col gap-2 border-t border-slate-800 bg-[#020617] p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:static md:space-y-4 md:border-t-0 md:bg-transparent md:p-0 md:pb-0 pointer-events-auto">
          
          {/* Mobile floating operator & toast container */}

          <div className="absolute bottom-full left-0 right-0 mb-3 flex flex-col items-end gap-3 md:hidden pointer-events-none px-2">
             <MobileToast message={hud.message} />
             
             {/* Operator button */}
             <button
               type="button"
               onClick={useOperator}
               disabled={!operatorReady}
               className="pointer-events-auto flex min-h-[44px] items-center gap-2 rounded-full border border-yellow-300/40 bg-yellow-400 px-4 py-2 font-bold text-slate-950 shadow-lg shadow-yellow-900/50 transition active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700 disabled:shadow-none"
             >
               <Sparkles className="h-5 w-5" />
               <span className="font-mono text-sm">{operatorReady ? 'PRONTO' : `${Math.ceil(hud.operatorCooldownMs / 1000)}s`}</span>
             </button>
          </div>

          <div className="cr-battle-score hidden md:flex" aria-label="Placar da partida"><span>Você <strong>{hud.playerCrowns}</strong></span><span className="text-slate-600">×</span><span>Rival <strong>{hud.enemyCrowns}</strong></span></div>

          {towerArtState!=='ready'&&<p role="status" className="px-2 text-xs text-slate-400">{towerArtState==='loading'?'Carregando artes das classes…':'Não foi possível carregar as novas artes. A arena continua disponível.'}</p>}
          {mapArtState!=='ready'&&<p role="status" className="px-2 text-xs text-slate-400">{mapArtState==='loading'?'Carregando cenário…':'Não foi possível carregar o cenário. A arena usa o fundo de reserva.'}</p>}
          <div className="rounded-xl md:rounded-2xl border border-slate-800 bg-slate-900/90 p-2 md:bg-slate-900/80 md:p-4 backdrop-blur-md">
            <div className="hidden md:flex mb-3 items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-slate-500">Mão de batalha</p>
                <p className="text-sm text-slate-300">Selecione e posicione na metade azul.</p>
              </div>
              <div className="text-right text-[10px] uppercase text-slate-500">Próxima<br/><strong className="text-slate-200">{nextCard?.name}</strong></div>
            </div>
            
            <div className="flex md:hidden mb-1.5 items-center justify-between px-1">
               <div className="flex items-center gap-1 text-[10px] font-bold text-fuchsia-400 uppercase tracking-wider"><Zap className="h-3 w-3"/> {Math.floor(hud.energy)} Energia</div>
               <div className="text-[10px] uppercase tracking-wider text-slate-500">Próxima: <strong className="text-slate-200">{nextCard?.name}</strong></div>
            </div>

            <div className="cr-hand-cards grid grid-cols-4 gap-1.5 md:gap-2">
              {hud.hand.map((cardId) => (
                <CardButton
                  stats={gameRef.current.cardStats?.player?.[cardId]}
                  key={cardId}
                  cardId={cardId}
                  energy={hud.energy}
                  selected={selectedCard?.id === cardId}
                  onSelect={(card) => setSelectedCard(selectedCard?.id === card.id ? null : card)}
                />
              ))}
            </div>
            <div className="mt-2 md:mt-4 h-2 md:h-4 overflow-hidden rounded-full border border-fuchsia-400/20 bg-slate-950">
              <div className="h-full bg-gradient-to-r from-fuchsia-700 to-fuchsia-400 transition-[width] duration-100" style={{ width: `${hud.energy * 10}%` }} />
            </div>
          </div>

          <div className="hidden md:block">
            <button
              type="button"
              onClick={useOperator}
              disabled={!operatorReady}
              className="flex w-full items-center justify-between rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-4 text-left transition hover:border-yellow-300/60 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-yellow-300 text-slate-950"><Sparkles className="h-5 w-5" /></span>
                <span><strong className="block">Bastião do Operador</strong><small className="text-slate-400">Escudo temporário para tropas e torres</small></span>
              </span>
              <span className="font-mono text-xs font-bold text-yellow-200">{operatorReady ? 'PRONTO' : `${Math.ceil(hud.operatorCooldownMs / 1000)}s`}</span>
            </button>
          </div>

        </section>
      </div>
    </main>
  );
}

