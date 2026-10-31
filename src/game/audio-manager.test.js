import { test, describe, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AudioManager, AUDIO_CATALOG, TRACK_IDS } from './audio-manager.js';

describe('AudioManager', () => {
  beforeEach(() => {
    // Mock global window and localStorage
    global.window = {
      addEventListener: mock.fn(),
      removeEventListener: mock.fn(),
    };
    global.document = {
      addEventListener: mock.fn(),
      removeEventListener: mock.fn(),
      visibilityState: 'visible',
    };
    
    let store = {};
    global.localStorage = {
      getItem: mock.fn(key => store[key] || null),
      setItem: mock.fn((key, value) => { store[key] = value.toString(); }),
      clear: mock.fn(() => { store = {}; }),
    };

    global.Audio = class {
      constructor() {
        this.src = '';
        this.loop = false;
        this.volume = 1;
        this.paused = true;
      }
      play() {
        this.paused = false;
        return Promise.resolve();
      }
      pause() {
        this.paused = true;
      }
      load() {}
      removeAttribute() {}
    };
  });

  afterEach(() => {
    mock.restoreAll();
    delete global.window;
    delete global.document;
    delete global.localStorage;
    delete global.Audio;
  });

  test('Catalog integrity', () => {
    assert.strictEqual(TRACK_IDS.length, 6);
    TRACK_IDS.forEach(id => {
      const track = AUDIO_CATALOG[id];
      assert.strictEqual(track.id, id);
      assert.ok(track.label);
      assert.ok(track.url.includes('.mp3'));
      assert.strictEqual(typeof track.loop, 'boolean');
    });
  });

  test('Automatic track selection', () => {
    const manager = new AudioManager();
    manager.unlocked = true;

    // Normal play -> battle
    manager.update({ status: 'playing', remainingMs: 60000 });
    assert.strictEqual(manager.desiredTrackId, 'vila-byte-battle');

    // Final 30s -> climax
    manager.update({ status: 'playing', remainingMs: 29000 });
    assert.strictEqual(manager.desiredTrackId, 'ranked-climax');

    // Player win -> progression
    manager.update({ status: 'finished', winner: 'player' });
    assert.strictEqual(manager.desiredTrackId, 'arena-progression');

    // Enemy win -> main menu
    manager.update({ status: 'finished', winner: 'enemy' });
    assert.strictEqual(manager.desiredTrackId, 'main-menu');
    
    // Draw -> main menu
    manager.update({ status: 'finished', winner: 'draw' });
    assert.strictEqual(manager.desiredTrackId, 'main-menu');

    // Overtime by status
    manager.update({ status: 'overtime' });
    assert.strictEqual(manager.desiredTrackId, 'overtime');

    // Overtime by phase
    manager.update({ status: 'playing', phase: 'overtime' });
    assert.strictEqual(manager.desiredTrackId, 'overtime');
  });

  test('Preference sanitization', () => {
    const manager = new AudioManager();
    
    manager.setPrefs({ muted: true, volume: 1.5, mode: 'invalid' });
    assert.strictEqual(manager.muted, true);
    assert.strictEqual(manager.volume, 1.0); // max is 1.0
    assert.strictEqual(manager.mode, 'automatic'); // shouldn't change
    
    manager.setPrefs({ volume: 0.8, mode: 'ranked-climax' });
    assert.strictEqual(manager.volume, 0.8);
    assert.strictEqual(manager.mode, 'ranked-climax');
  });

  test('No restart for unchanged track', () => {
    const manager = new AudioManager();
    manager.unlocked = true;
    
    manager.update({ status: 'playing', remainingMs: 60000 });
    const firstActiveChannel = manager.activeChannelIndex;
    
    manager.update({ status: 'playing', remainingMs: 50000 });
    // Channel index should not have flipped because track is the same
    assert.strictEqual(manager.activeChannelIndex, firstActiveChannel);
  });

  test('Rejected play handling and current track clearance', async () => {
    const error = new Error('NotAllowedError');
    error.name = 'NotAllowedError';
    global.Audio.prototype.play = mock.fn(() => Promise.reject(error));
    
    const manager = new AudioManager();
    manager.attach();
    manager.unlocked = true;
    
    manager.update({ status: 'playing', remainingMs: 60000 });
    
    await new Promise(r => setTimeout(r, 10)); // wait for promise rejection
    
    assert.strictEqual(manager.unlocked, false);
    assert.strictEqual(manager.currentTrackId, null);
  });

  test('Cleanup/disposal', () => {
    const manager = new AudioManager();
    manager.update({ status: 'playing', remainingMs: 60000 });
    
    manager.dispose();
    assert.strictEqual(manager.channels[0], null);
    assert.strictEqual(manager.channels[1], null);
    assert.strictEqual(manager.fadeIntervalId, null);
  });

  test('StrictMode lifecycle reattachment', () => {
    const manager = new AudioManager();
    manager.attach();
    
    assert.strictEqual(manager.attached, true);
    const initialAddCount = global.window.addEventListener.mock.calls.length;
    assert.ok(initialAddCount >= 4);
    
    manager.dispose();
    assert.strictEqual(manager.attached, false);
    
    manager.attach();
    assert.strictEqual(manager.attached, true);
    assert.ok(global.window.addEventListener.mock.calls.length > initialAddCount);
  });

  test('Mute during crossfade', async () => {
    mock.timers.enable({ apis: ['setInterval'] });
    const manager = new AudioManager();
    manager.unlocked = true;
    manager.volume = 0.8;
    manager.attach();
    
    manager.update({ status: 'playing', remainingMs: 60000 });
    const ch1 = manager.channels[manager.activeChannelIndex];
    await new Promise(r => setImmediate(r)); // wait for promise
    
    manager.update({ status: 'playing', remainingMs: 20000 });
    const ch2 = manager.channels[manager.activeChannelIndex];
    await new Promise(r => setImmediate(r)); // wait for play() promise to crossfade
    
    assert.ok(manager.fadeIntervalId);
    
    manager.setPrefs({ muted: true });
    
    assert.strictEqual(ch1.volume, 0);
    assert.strictEqual(ch2.volume, 0);
    
    mock.timers.tick(30);
    assert.strictEqual(ch1.volume, 0);
    assert.strictEqual(ch2.volume, 0);
    
    mock.timers.reset();
  });

  test('Hidden during crossfade safely stops', async () => {
    const manager = new AudioManager();
    manager.unlocked = true;
    manager.attach();
    
    manager.update({ status: 'playing', remainingMs: 60000 });
    const ch1 = manager.channels[manager.activeChannelIndex];
    await new Promise(r => setTimeout(r, 0));
    
    manager.update({ status: 'playing', remainingMs: 20000 });
    const ch2 = manager.channels[manager.activeChannelIndex];
    await new Promise(r => setTimeout(r, 0));
    
    assert.ok(manager.fadeIntervalId);
    
    global.document.visibilityState = 'hidden';
    manager._handleVisibilityChange();
    
    assert.strictEqual(manager.fadeIntervalId, null);
    assert.strictEqual(ch1.paused, true);
    assert.strictEqual(ch2.paused, true);
    
    global.document.visibilityState = 'visible';
    manager._handleVisibilityChange();
    
    assert.strictEqual(ch2.paused, false);
    assert.strictEqual(ch2.volume, 0.5);
    
    assert.strictEqual(ch1.paused, true);
    assert.strictEqual(ch1.volume, 0);
  });

  test('Catalog URL resolves to existing files with size > 0', () => {
    // __dirname is not available in ES modules by default, so we construct it or use process.cwd()
    // Since we're running npm test from the project root, we can use process.cwd() and public
    const publicDir = path.join(process.cwd(), 'public');
    
    TRACK_IDS.forEach(id => {
      const track = AUDIO_CATALOG[id];
      // URL has a leading slash, e.g., '/assets/audio/bgm/cr_bgm_main-menu_v001.mp3'
      const relativePath = track.url.startsWith('/') ? track.url.slice(1) : track.url;
      const absolutePath = path.join(publicDir, relativePath);
      
      const exists = fs.existsSync(absolutePath);
      assert.ok(exists, `File does not exist: ${absolutePath}`);
      
      const stats = fs.statSync(absolutePath);
      assert.ok(stats.size > 0, `File size is 0: ${absolutePath}`);
    });
  });

  test('Manual mode updates desired track to each TRACK_ID', () => {
    const manager = new AudioManager();
    manager.unlocked = true;

    TRACK_IDS.forEach(id => {
      manager.setPrefs({ mode: id });
      manager.update(null);
      assert.strictEqual(manager.desiredTrackId, id, `Failed to select ${id} in manual mode`);
    });
  });

  test('update(null) and unknown state select main-menu in automatic mode', () => {
    const manager = new AudioManager();
    manager.unlocked = true;
    
    manager.setPrefs({ mode: 'automatic' });
    
    // update(null)
    manager.update(null);
    assert.strictEqual(manager.desiredTrackId, 'main-menu');
    
    // unknown state
    manager.update({ status: 'unknown_status' });
    assert.strictEqual(manager.desiredTrackId, 'main-menu');
  });

  test('Rapid switch play promises A1 -> B -> A2 do not lock state or start obsolete crossfades', async () => {
    let playPromises = [];
    let resolvePlay = [];
    let rejectPlay = [];
    
    global.Audio.prototype.play = mock.fn(function() {
      this.paused = false;
      const p = new Promise((res, rej) => {
        resolvePlay.push(res);
        rejectPlay.push(rej);
      });
      playPromises.push(p);
      return p;
    });

    const manager = new AudioManager();
    manager.attach();
    manager.unlocked = true;
    
    // A1
    manager.update({ status: 'playing', remainingMs: 60000 }); // vila-byte-battle
    assert.strictEqual(manager.currentTrackId, 'vila-byte-battle');
    
    // B
    manager.update({ status: 'playing', remainingMs: 20000 }); // ranked-climax
    assert.strictEqual(manager.currentTrackId, 'ranked-climax');
    
    // A2 (Back to A)
    manager.update({ status: 'playing', remainingMs: 60000 }); // vila-byte-battle
    assert.strictEqual(manager.currentTrackId, 'vila-byte-battle');
    
    assert.strictEqual(playPromises.length, 3);
    
    // Now reject A1 (which previously would have seen currentTrackId === A2 and relocked!)
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';
    rejectPlay[0](abortError);
    await new Promise(r => setTimeout(r, 0));
    
    // Manager MUST NOT be locked because A1 was an old generation
    assert.strictEqual(manager.unlocked, true, 'A1 rejection locked the manager incorrectly');
    assert.strictEqual(manager.currentTrackId, 'vila-byte-battle');
    
    // Resolve B
    resolvePlay[1]();
    await new Promise(r => setTimeout(r, 0));
    // B is stale, should not crossfade (we can't easily mock crossfade here but we can verify state is unaffected)
    assert.strictEqual(manager.unlocked, true);
    
    // Resolve A2
    resolvePlay[2]();
    await new Promise(r => setTimeout(r, 0));
    assert.strictEqual(manager.unlocked, true);
    assert.strictEqual(manager.currentTrackId, 'vila-byte-battle');
  });

  test('Cleanup/dispose invalidates pending callbacks', async () => {
    let resolvePlay = [];
    
    global.Audio.prototype.play = mock.fn(function() {
      this.paused = false;
      return new Promise((res) => {
        resolvePlay.push(res);
      });
    });

    const manager = new AudioManager();
    manager.attach();
    manager.unlocked = true;
    
    manager.update({ status: 'playing', remainingMs: 60000 });
    assert.strictEqual(manager.currentTrackId, 'vila-byte-battle');
    
    manager.dispose();
    
    // Resolve the promise after dispose
    resolvePlay[0]();
    await new Promise(r => setTimeout(r, 0));
    
    // The promise resolution should have been ignored due to dispose() advancing playGeneration
    // (If it wasn't, it might try to crossfade on disposed channels, etc. We just check no errors happen)
    assert.strictEqual(manager.fadeIntervalId, null);
  });
});
