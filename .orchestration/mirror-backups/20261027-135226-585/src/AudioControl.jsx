import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Settings2, X } from 'lucide-react';
import { getAudioManager, AUDIO_CATALOG, TRACK_IDS } from './game/audio-manager.js';

export function AudioControl({ currentGameState }) {
  const [isOpen, setIsOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [mode, setMode] = useState('automatic');
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [unlocked, setUnlocked] = useState(false);

  const manager = getAudioManager();

  useEffect(() => {
    setMuted(manager.muted);
    setVolume(manager.volume);
    setMode(manager.mode);
    setUnlocked(manager.unlocked);

    // To reactively update currentTrackId from manager
    const interval = setInterval(() => {
      setCurrentTrackId(manager.currentTrackId);
      setUnlocked(manager.unlocked);
    }, 200);
    return () => clearInterval(interval);
  }, [manager]);

  useEffect(() => {
    manager.update(currentGameState);
  }, [currentGameState, manager, mode]); // also re-evaluate when mode changes

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

  return (
    <div className="relative z-50 pointer-events-auto">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`relative flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg border shadow-lg ${!unlocked ? 'border-yellow-400/50 bg-yellow-950/30 text-yellow-400 hover:text-yellow-300 hover:border-yellow-400' : 'border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:border-cyan-400'}`}
          aria-label="Controle de Áudio"
        >
          {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          {!unlocked && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>}
        </button>
      )}

      {isOpen && (
        <div className="absolute top-0 right-0 md:top-auto md:bottom-full md:mb-2 md:right-0 mt-2 md:mt-0 w-64 rounded-xl border border-cyan-400/30 bg-slate-900/95 p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-300 flex items-center gap-2">
              <Settings2 className="h-4 w-4" /> Áudio
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1" aria-label="Fechar Áudio">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleMuteToggle}
                className={`p-2 rounded-lg border ${muted ? 'bg-rose-500/20 border-rose-500/50 text-rose-300' : 'bg-slate-800 border-slate-700 text-slate-300'}`}
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
                className="flex-1 accent-cyan-400"
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
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs font-bold text-slate-200 outline-none focus:border-cyan-400"
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
        </div>
      )}
    </div>
  );
}
