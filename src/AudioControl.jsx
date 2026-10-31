import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Volume2, VolumeX, Music, Settings2, X } from 'lucide-react';
import { getAudioManager, AUDIO_CATALOG, TRACK_IDS } from './game/audio-manager.js';
import { computePopoverPosition } from './audio-popover.js';

const PANEL_ID = 'audio-panel';
const PANEL_TITLE_ID = 'audio-panel-title';

export function AudioControl({ currentGameState, embedded = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [mode, setMode] = useState('automatic');
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [unlocked, setUnlocked] = useState(false);

  // Popover position state
  const [pos, setPos] = useState(null);

  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const manager = getAudioManager();

  // ─── sync state from AudioManager ───
  useEffect(() => {
    setMuted(manager.muted);
    setVolume(manager.volume);
    setMode(manager.mode);
    setUnlocked(manager.unlocked);

    // Reactively update currentTrackId / unlocked from manager
    const interval = setInterval(() => {
      setCurrentTrackId(manager.currentTrackId);
      setUnlocked(manager.unlocked);
    }, 200);
    return () => clearInterval(interval);
  }, [manager]);

  // ─── forward gameState to AudioManager ───
  useEffect(() => {
    manager.update(currentGameState);
  }, [currentGameState, manager, mode]); // also re-evaluate when mode changes

  // ─── position calculation ───
  const reposition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const vp = { innerWidth: window.innerWidth, innerHeight: window.innerHeight };
    setPos(computePopoverPosition(rect, vp));
  }, []);

  // Recalculate on open and on resize/scroll
  useLayoutEffect(() => {
    if (!isOpen) {
      setPos(null);
      return;
    }
    reposition();

    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [isOpen, reposition]);

  // ─── close on Escape (without propagating to other dialogs) ───
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    // Use capture so we intercept before other dialogs
    document.addEventListener('keydown', handleKey, true);
    return () => document.removeEventListener('keydown', handleKey, true);
  }, [isOpen]);

  // ─── close on click outside ───
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (
        triggerRef.current && triggerRef.current.contains(e.target)
      ) return;
      if (
        panelRef.current && panelRef.current.contains(e.target)
      ) return;
      setIsOpen(false);
    };
    // Delay to avoid the opening click itself closing immediately
    const raf = requestAnimationFrame(() => {
      document.addEventListener('pointerdown', handleClick, true);
    });
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointerdown', handleClick, true);
    };
  }, [isOpen]);

  // ─── handlers ───
  const handleToggle = () => {
    setIsOpen((prev) => {
      if (prev) {
        // closing — return focus
        setTimeout(() => triggerRef.current?.focus(), 0);
      }
      return !prev;
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleMuteToggle = () => {
    manager.setPrefs({ muted: !muted });
    setMuted(!muted);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    manager.setPrefs({ volume: val });
    setVolume(val);
  };

  const handleModeChange = (e) => {
    const newMode = e.target.value;
    manager.setPrefs({ mode: newMode });
    setMode(newMode);
  };

  const currentLabel = currentTrackId ? AUDIO_CATALOG[currentTrackId]?.label : 'Nenhuma';

  // ─── trigger button — ALWAYS visible ───
  const triggerButton = (
    <button
      ref={triggerRef}
      onClick={handleToggle}
      className={`relative flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg border shadow-lg ${!unlocked ? 'border-yellow-400/50 bg-yellow-950/30 text-yellow-400 hover:text-yellow-300 hover:border-yellow-400' : 'border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:border-cyan-400'}`}
      aria-label="Controle de Áudio"
      aria-expanded={isOpen}
      aria-controls={PANEL_ID}
    >
      {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      {!unlocked && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>}
    </button>
  );

  const content = <>
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <h3
          id={PANEL_TITLE_ID}
          className="text-xs font-bold uppercase tracking-widest text-cyan-300 flex items-center gap-2"
        >
          <Settings2 className="h-4 w-4" /> Áudio
        </h3>
        {!embedded && <button
          onClick={handleClose}
          className="text-slate-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Fechar Áudio"
        >
          <X className="h-4 w-4" />
        </button>}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleMuteToggle}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border ${muted ? 'bg-rose-500/20 border-rose-500/50 text-rose-300' : 'bg-slate-800 border-slate-700 text-slate-300'}`}
            aria-label={muted ? 'Desmutar' : 'Mutar'}
          >
            {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            disabled={muted}
            className="flex-1 accent-cyan-400 min-h-[44px]"
            aria-label="Volume"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="audio-mode" className="text-[10px] uppercase font-bold text-slate-500">
            Trilha Sonora
          </label>
          <select
            id="audio-mode"
            value={mode}
            onChange={handleModeChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs font-bold text-slate-200 outline-none focus:border-cyan-400 min-h-[44px]"
          >
            <option value="automatic">Automático</option>
            <optgroup label="Manuais / Teste">
              {TRACK_IDS.map((id) => (
                <option key={id} value={id}>
                  {AUDIO_CATALOG[id].label}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div className="rounded-lg bg-slate-950/50 p-2 text-[10px] text-slate-400 flex flex-col gap-2">
          {!unlocked && (
            <div className="flex items-start gap-2 text-yellow-400">
              <div className="mt-0.5 h-3 w-3 shrink-0 rounded-full bg-yellow-400/20 grid place-items-center"><span className="block h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse"></span></div>
              <div>
                <span className="block font-bold uppercase tracking-wider mb-0.5">Aguardando Interação</span>
                <span>Toque na tela para liberar o áudio.</span>
              </div>
            </div>
          )}
          <div className="flex items-start gap-2">
            <Music className={`h-3 w-3 shrink-0 mt-0.5 ${unlocked ? 'text-fuchsia-400' : 'text-slate-500'}`} />
            <div>
              <span className="block font-bold uppercase tracking-wider text-slate-500 mb-0.5">Tocando agora</span>
              <span className={`font-bold ${unlocked ? 'text-slate-200' : 'text-slate-600'}`}>{currentLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </>;

  if (embedded) return <section className="cr-menu-audio" aria-labelledby={PANEL_TITLE_ID}>{content}</section>;
  const panel = isOpen && pos && createPortal(
    <div ref={panelRef} id={PANEL_ID} role="dialog" aria-labelledby={PANEL_TITLE_ID}
      style={{position:'fixed',top:pos.top,left:pos.left,width:pos.panelWidth,maxHeight:pos.maxHeight,overflowY:'auto',zIndex:9999}}
      className="rounded-xl border border-cyan-400/30 bg-slate-900/95 p-4 shadow-xl backdrop-blur-md">{content}</div>,document.body);

  return (
    <div className="relative z-50 pointer-events-auto">
      {triggerButton}
      {panel}
    </div>
  );
}
