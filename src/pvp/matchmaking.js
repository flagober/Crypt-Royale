import {CARDS} from '../game/cards.js';

export const MATCHMAKING_MODES = Object.freeze({
  BALANCED: 'balanced',
  FREE: 'free'
});

export const MATCHMAKING_INFO = Object.freeze({
  [MATCHMAKING_MODES.BALANCED]: {
    id: MATCHMAKING_MODES.BALANCED,
    name: 'Modo Equilíbrio',
    badge: 'Balanceado',
    description: 'Busca oponentes com níveis compatíveis ao seu. Se o rival for de nível superior, você decide se aceita o desafio.',
    hasConfirmation: true
  },
  [MATCHMAKING_MODES.FREE]: {
    id: MATCHMAKING_MODES.FREE,
    name: 'Modo Livre',
    badge: 'Sem Limites',
    description: 'Disputa aberta sem filtro de nível. Encontra oponentes dos mais fracos aos mais fortes, sem confirmação prévia.',
    hasConfirmation: false
  }
});

export const ARENA_RIVALS = Object.freeze([
  { id: 'rival-01', name: 'CyberKnight', level: 1, base: 1, title: 'Iniciante de Vila Byte', avatar: 'warrior' },
  { id: 'rival-02', name: 'BitNovice', level: 2, base: 2, title: 'Treinador de Bits', avatar: 'archer' },
  { id: 'rival-03', name: 'PixelBug', level: 3, base: 3, title: 'Caçador de Pixels', avatar: 'warrior' },
  { id: 'rival-04', name: 'DataScout', level: 4, base: 4, title: 'Batedor de Dados', avatar: 'archer' },
  { id: 'rival-05', name: 'VilaHunter', level: 5, base: 5, title: 'Guardião de Vila Byte', avatar: 'warrior' },
  { id: 'rival-06', name: 'ByteStriker', level: 6, base: 6, title: 'Duelista de Cobre', avatar: 'archer' },
  { id: 'rival-07', name: 'GigaGuard', level: 7, base: 7, title: 'Sentinela do Bastião', avatar: 'warrior' },
  { id: 'rival-08', name: 'GlitchNinja', level: 8, base: 8, title: 'Infiltrador Silencioso', avatar: 'archer' },
  { id: 'rival-09', name: 'NeonMage', level: 9, base: 9, title: 'Mestre da Sintaxe', avatar: 'warrior' },
  { id: 'rival-10', name: 'CryptoClaw', level: 10, base: 10, title: 'Veterano das Minas', avatar: 'archer' },
  { id: 'rival-11', name: 'IronPixel', level: 11, base: 11, title: 'Blindagem de Ferro', avatar: 'warrior' },
  { id: 'rival-12', name: 'ShadowCoder', level: 12, base: 12, title: 'Executor Noturno', avatar: 'archer' },
  { id: 'rival-13', name: 'DataPaladin', level: 13, base: 13, title: 'Campeão do Protocolo', avatar: 'warrior' },
  { id: 'rival-14', name: 'VoltStriker', level: 14, base: 14, title: 'Tempestade Elétrica', avatar: 'archer' },
  { id: 'rival-15', name: 'VilaTitan', level: 15, base: 15, title: 'Muralha de Vila Byte', avatar: 'warrior' },
  { id: 'rival-16', name: 'ByteOverlord', level: 16, base: 16, title: 'Lorde do Barramento', avatar: 'archer' },
  { id: 'rival-17', name: 'QuantumZero', level: 18, base: 18, title: 'Mestre Dimensional', avatar: 'warrior' },
  { id: 'rival-18', name: 'OmegaRoyale', level: 20, base: 20, title: 'Lenda da Arena Livre', avatar: 'archer' }
]);

export function findMatchmakingRival(mode, playerLevel = 1, options = {}) {
  const safeLevel = Math.max(1, Number.isFinite(playerLevel) ? Math.floor(playerLevel) : 1);
  const randomFn = typeof options.random === 'function' ? options.random : Math.random;

  if (mode === MATCHMAKING_MODES.FREE) {
    const index = Math.floor(randomFn() * ARENA_RIVALS.length);
    const rival = ARENA_RIVALS[Math.min(index, ARENA_RIVALS.length - 1)];
    const levelDiff = rival.level - safeLevel;
    return {
      rival: { ...rival },
      mode: MATCHMAKING_MODES.FREE,
      levelDiff,
      requiresConfirmation: false
    };
  }

  // Modo Equilíbrio: busca os níveis mais compatíveis (diferença absoluta menor)
  const sorted = [...ARENA_RIVALS].sort((a, b) => {
    const diffA = Math.abs(a.level - safeLevel);
    const diffB = Math.abs(b.level - safeLevel);
    if (diffA !== diffB) return diffA - diffB;
    return a.level - b.level;
  });

  // Pega um dos 4 candidatos mais próximos para dar variedade
  const pool = sorted.slice(0, Math.min(4, sorted.length));
  const pickedIndex = Math.floor(randomFn() * pool.length);
  const rival = pool[Math.min(pickedIndex, pool.length - 1)];
  const levelDiff = rival.level - safeLevel;

  return {
    rival: { ...rival },
    mode: MATCHMAKING_MODES.BALANCED,
    levelDiff,
    requiresConfirmation: levelDiff > 0
  };
}

export function buildRivalProfile(rival, playerProfile = null) {
  const cardIds = CARDS.slice(0, 8).map(c => c.id);
  const monsterLevels = {};
  for (const id of cardIds) {
    monsterLevels[id] = { level: Math.max(1, Math.min(10, Math.floor(rival.level / 2) + 1)), form: 1 };
  }

  return {
    uid: 'bot-' + rival.id,
    name: rival.name,
    wallet: {
      gold: 1000,
      xp: rival.level * 250,
      dataFragments: 10,
      cards: {}
    },
    progression: {
      monsters: monsterLevels,
      classes: {
        warrior: { level: rival.level, branch: rival.avatar === 'archer' ? 'sniper' : 'paladin' }
      },
      campaign: {
        completed: {
          'stage-1': { stars: 3 },
          'stage-2': { stars: 3 },
          'stage-3': { stars: 3 }
        }
      }
    }
  };
}

