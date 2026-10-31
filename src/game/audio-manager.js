export const AUDIO_CATALOG = {
  'main-menu': {
    id: 'main-menu',
    label: 'Menu Principal',
    url: '/assets/audio/bgm/cr_bgm_main-menu_v001.mp3',
    loop: true,
    role: 'bgm',
  },
  'vila-byte-battle': {
    id: 'vila-byte-battle',
    label: 'Batalha: Vila Byte',
    url: '/assets/audio/bgm/cr_bgm_vila-byte_battle_v001.mp3',
    loop: true,
    role: 'bgm',
  },
  'ranked-climax': {
    id: 'ranked-climax',
    label: 'Clímax Ranqueado',
    url: '/assets/audio/bgm/cr_bgm_ranked-climax_v001.mp3',
    loop: true,
    role: 'bgm',
  },
  'arena-progression': {
    id: 'arena-progression',
    label: 'Vitória: Progressão',
    url: '/assets/audio/bgm/cr_bgm_arena-progression_v001.mp3',
    loop: false,
    role: 'bgm',
  },
  'overtime': {
    id: 'overtime',
    label: 'Morte Súbita (Prorrogação)',
    url: '/assets/audio/bgm/cr_bgm_overtime_v001.mp3',
    loop: true,
    role: 'bgm',
  },
  'theme-bit-bug': {
    id: 'theme-bit-bug',
    label: 'Tema: Bit Bug',
    url: '/assets/audio/characters/cr_theme_mc-0001_bit-bug_v001.mp3',
    loop: true,
    role: 'theme',
  },
};

export const TRACK_IDS = Object.keys(AUDIO_CATALOG);

const CROSSFADE_MS = 600;

export class AudioManager {
  constructor() {
    this.mode = 'automatic';
    this.muted = false;
    this.volume = 0.5;
    this.unlocked = false;
    
    this.channels = [null, null];
    this.activeChannelIndex = 0;
    
    this.currentTrackId = null;
    this.desiredTrackId = null;
    this.fadeIntervalId = null;
    this.playGeneration = 0;
    
    this.pageVisible = true;
    this.attached = false;
    
    this._handleVisibilityChange = this._handleVisibilityChange.bind(this);
    this._handleUnlock = this._handleUnlock.bind(this);
  }
  
  attach() {
    if (this.attached) return;
    this.attached = true;
    
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this._loadPrefs();
      document.addEventListener('visibilitychange', this._handleVisibilityChange);
      
      if (!this.unlocked) {
        this._attachUnlockListeners();
      } else {
        if (this.desiredTrackId) {
            this._applyDesiredTrack();
        }
      }
    }
  }

  _attachUnlockListeners() {
    if (typeof window === 'undefined') return;
    const unlockEvents = ['pointerdown', 'keydown', 'click', 'touchstart'];
    unlockEvents.forEach(evt => {
        window.removeEventListener(evt, this._handleUnlock);
        window.addEventListener(evt, this._handleUnlock, { once: true, passive: true });
    });
  }

  _removeUnlockListeners() {
    if (typeof window === 'undefined') return;
    const unlockEvents = ['pointerdown', 'keydown', 'click', 'touchstart'];
    unlockEvents.forEach(evt => window.removeEventListener(evt, this._handleUnlock));
  }
  
  _loadPrefs() {
    try {
      const prefs = localStorage.getItem('cr_audio_prefs');
      if (prefs) {
        const p = JSON.parse(prefs);
        if (typeof p.muted === 'boolean') this.muted = p.muted;
        if (typeof p.volume === 'number' && p.volume >= 0 && p.volume <= 1) this.volume = p.volume;
        if (p.mode === 'automatic' || AUDIO_CATALOG[p.mode]) this.mode = p.mode;
      }
    } catch (e) {
      // ignore
    }
  }
  
  _savePrefs() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('cr_audio_prefs', JSON.stringify({
        muted: this.muted,
        volume: this.volume,
        mode: this.mode,
      }));
    } catch (e) {
      // ignore
    }
  }
  
  _handleVisibilityChange() {
    if (typeof document === 'undefined') return;
    this.pageVisible = document.visibilityState === 'visible';
    this._updateChannels();
  }
  
  _handleUnlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    this._removeUnlockListeners();
    this._applyDesiredTrack();
  }
  
  setPrefs(updates) {
    let changed = false;
    if (updates.muted !== undefined && !!updates.muted !== this.muted) {
      this.muted = !!updates.muted;
      changed = true;
    }
    if (updates.volume !== undefined) {
      const vol = Math.max(0, Math.min(1, Number(updates.volume) || 0));
      if (vol !== this.volume) {
         this.volume = vol;
         changed = true;
      }
    }
    if (updates.mode !== undefined && updates.mode !== this.mode) {
      if (updates.mode === 'automatic' || AUDIO_CATALOG[updates.mode]) {
        this.mode = updates.mode;
        changed = true;
      }
    }
    if (changed) {
      this._savePrefs();
      this._updateChannels();
      this.update(this.lastGameState); // Re-eval
    }
  }
  
  update(gameState) {
    this.lastGameState = gameState;
    let nextTrackId = null;
    
    if (this.mode !== 'automatic') {
      nextTrackId = this.mode;
    } else {
      if (gameState) {
        if (gameState.status === 'overtime' || gameState.phase === 'overtime') {
          nextTrackId = 'overtime';
        } else if (gameState.status === 'playing') {
          if (gameState.remainingMs <= 30000) {
            nextTrackId = 'ranked-climax';
          } else {
            nextTrackId = 'vila-byte-battle';
          }
        } else if (gameState.status === 'finished') {
          if (gameState.winner === 'player') {
            nextTrackId = 'arena-progression';
          } else {
            nextTrackId = 'main-menu';
          }
        }
      }
      if (!nextTrackId) {
        nextTrackId = 'main-menu';
      }
    }
    
    if (nextTrackId !== this.desiredTrackId) {
      this.desiredTrackId = nextTrackId;
      if (this.unlocked) {
        this._applyDesiredTrack();
      }
    }
  }
  
  _applyDesiredTrack() {
    if (!this.unlocked) return;
    if (this.currentTrackId === this.desiredTrackId) return;
    
    const targetTrackId = this.desiredTrackId;
    
    if (typeof Audio === 'undefined') {
      this.currentTrackId = targetTrackId;
      return;
    }
    
    const prevChannel = this.channels[this.activeChannelIndex];
    this.activeChannelIndex = (this.activeChannelIndex + 1) % 2;
    let nextChannel = this.channels[this.activeChannelIndex];
    
    if (!targetTrackId) {
       this.currentTrackId = null;
       this._crossfade(prevChannel, null);
       return;
    }
    
    const trackInfo = AUDIO_CATALOG[targetTrackId];
    if (!nextChannel) {
      nextChannel = new Audio();
      this.channels[this.activeChannelIndex] = nextChannel;
    }
    
    this.currentTrackId = targetTrackId;
    this.playGeneration++;
    const currentGen = this.playGeneration;
    
    nextChannel.src = trackInfo.url;
    nextChannel.loop = trackInfo.loop;
    nextChannel.volume = 0;
    
    // Only play if page is visible
    if (this.pageVisible) {
      const playPromise = nextChannel.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (this.playGeneration !== currentGen) {
             nextChannel.pause();
             return;
          }
          this._crossfade(prevChannel, nextChannel);
        }).catch(e => {
          if (this.playGeneration !== currentGen) return;
          // Fallback if autoplay rejected
          this.unlocked = false;
          if (this.currentTrackId === targetTrackId) {
              this.currentTrackId = null;
          }
          this._attachUnlockListeners();
        });
      }
    } else {
      // If hidden, just prepare the crossfade state so it resumes later
      if (prevChannel) prevChannel.pause();
      nextChannel.volume = this.muted ? 0 : this.volume;
    }
  }
  
  _crossfade(fadeOutAudio, fadeInAudio) {
    if (this.fadeIntervalId) {
      clearInterval(this.fadeIntervalId);
      this.fadeIntervalId = null;
    }
    
    if (!this.pageVisible) {
       // Instantly finish crossfade if hidden
       if (fadeOutAudio) {
           fadeOutAudio.pause();
           fadeOutAudio.volume = 0;
       }
       if (fadeInAudio) {
           fadeInAudio.volume = this.muted ? 0 : this.volume;
       }
       return;
    }

    const steps = 20;
    const intervalMs = CROSSFADE_MS / steps;
    let currentStep = 0;
    
    const initialFadeOutVol = fadeOutAudio ? fadeOutAudio.volume : 0;

    this.fadeIntervalId = setInterval(() => {
      currentStep++;
      const ratio = currentStep / steps;
      const currentTargetVol = this.muted ? 0 : this.volume;
      
      if (fadeInAudio) {
         fadeInAudio.volume = Math.min(1, Math.max(0, currentTargetVol * ratio));
      }
      
      if (fadeOutAudio) {
         fadeOutAudio.volume = this.muted ? 0 : Math.min(1, Math.max(0, initialFadeOutVol * (1 - ratio)));
      }
      
      if (currentStep >= steps) {
        clearInterval(this.fadeIntervalId);
        this.fadeIntervalId = null;
        if (fadeInAudio) fadeInAudio.volume = currentTargetVol;
        if (fadeOutAudio) {
          fadeOutAudio.pause();
          fadeOutAudio.volume = 0;
        }
      }
    }, intervalMs);
  }
  
  _updateChannels() {
    const targetVol = this.muted ? 0 : this.volume;
    
    if (!this.pageVisible) {
        if (this.fadeIntervalId) {
            clearInterval(this.fadeIntervalId);
            this.fadeIntervalId = null;
        }
        this.channels.forEach(ch => {
            if (ch) ch.pause();
        });
    } else {
        if (this.fadeIntervalId) {
            if (this.muted) {
                this.channels.forEach(ch => { if (ch) ch.volume = 0; });
            }
        } else {
            const activeChannel = this.channels[this.activeChannelIndex];
            const inactiveChannel = this.channels[(this.activeChannelIndex + 1) % 2];
            
            if (inactiveChannel) {
                inactiveChannel.pause();
                inactiveChannel.volume = 0;
            }
            
            if (activeChannel) {
                activeChannel.volume = targetVol;
                if (activeChannel.paused && this.unlocked && this.currentTrackId) {
                   const p = activeChannel.play();
                   if (p) p.catch(()=>null);
                }
            }
        }
    }
  }
  
  dispose() {
    this.attached = false;
    this.playGeneration++;
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this._handleVisibilityChange);
      this._removeUnlockListeners();
    }
    if (this.fadeIntervalId) {
      clearInterval(this.fadeIntervalId);
      this.fadeIntervalId = null;
    }
    this.channels.forEach(ch => {
      if (ch) {
        ch.pause();
        ch.removeAttribute('src');
        ch.load();
      }
    });
    this.channels = [null, null];
    this.currentTrackId = null;
  }
}

// Global instance for the app to use
let _audioManager = null;
export function getAudioManager() {
  if (!_audioManager) _audioManager = new AudioManager();
  _audioManager.attach();
  return _audioManager;
}
