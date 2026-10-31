export const CARDS = [
  { id: 'bit-bug', canonicalId: 'MC-0001', name: 'Bit Bug', cost: 2, role: 'Enxame', count: 3, hp: 95, damage: 22, speed: 48, range: 16, attackMs: 750, color: '#22d3ee', glyph: 'BB', cardArt: '/assets/cards/bit-bug-card_v002.webp' },
  { id: 'data-mouse', canonicalId: 'MC-0004', name: 'Data Mouse', cost: 3, role: 'Atirador', count: 1, hp: 290, damage: 58, speed: 44, range: 86, attackMs: 1050, color: '#94a3b8', glyph: 'DM', cardArt: '/assets/cards/data-mouse-card_v002.webp' },
  { id: 'code-slime', canonicalId: 'MC-0007', name: 'Code Slime', cost: 2, role: 'Duplicador', count: 2, hp: 145, damage: 31, speed: 36, range: 18, attackMs: 900, color: '#4ade80', glyph: 'CS', cardArt: '/assets/cards/code-slime-card_v002.webp' },
  { id: 'pixel-pup', canonicalId: 'MC-0010', name: 'Pixel Pup', cost: 3, role: 'Lutador', count: 1, hp: 430, damage: 67, speed: 52, range: 19, attackMs: 1000, color: '#60a5fa', glyph: 'PP', cardArt: '/assets/cards/pixel-pup-card_v002.webp' },
  { id: 'circuit-hare', canonicalId: 'MC-0013', name: 'Circuit Hare', cost: 4, role: 'Investida', count: 1, hp: 335, damage: 104, speed: 70, range: 20, attackMs: 1200, color: '#c084fc', glyph: 'CH', cardArt: '/assets/cards/circuit-hare-card_v001.webp' },
  { id: 'cache-crow', canonicalId: 'MC-0016', name: 'Cache Crow', cost: 3, role: 'Voador', count: 2, hp: 155, damage: 43, speed: 58, range: 62, attackMs: 900, color: '#f472b6', glyph: 'CC', cardArt: '/assets/cards/cache-crow-card_v001.webp' },
  { id: 'byte-boar', canonicalId: 'MC-0019', name: 'Byte Boar', cost: 5, role: 'Tanque', count: 1, hp: 980, damage: 82, speed: 30, range: 22, attackMs: 1300, color: '#fb923c', glyph: 'BO', cardArt: '/assets/cards/byte-boar-card_v001.webp' },
  { id: 'socket-crab', canonicalId: 'MC-0031', name: 'Socket Crab', cost: 4, role: 'Guardião', count: 1, hp: 690, damage: 54, speed: 28, range: 24, attackMs: 950, color: '#fbbf24', glyph: 'SC', cardArt: '/assets/cards/socket-crab-card_v001.webp' },
  { id: 'copper-mole', canonicalId: 'MC-0022', name: 'Copper Mole', cost: 3, role: 'Escavador', count: 1, hp: 350, damage: 70, speed: 45, range: 18, attackMs: 1050, color: '#2dd4bf', glyph: 'CM', cardArt: '/assets/cards/copper-mole-card_v001.webp' },
  { id: 'fiber-finch', canonicalId: 'MC-0025', name: 'Fiber Finch', cost: 2, role: 'Batedor aéreo', count: 2, hp: 110, damage: 35, speed: 68, range: 55, attackMs: 850, color: '#a78bfa', glyph: 'FF', cardArt: '/assets/cards/fiber-finch-card_v001.webp' },
  { id: 'patch-toad', canonicalId: 'MC-0028', name: 'Patch Toad', cost: 3, role: 'Suporte', count: 1, hp: 360, damage: 40, speed: 32, range: 45, attackMs: 1200, color: '#22d3ee', glyph: 'PT', cardArt: '/assets/cards/patch-toad-card_v001.webp' },
  { id: 'logic-lizard', canonicalId: 'MC-0034', name: 'Logic Lizard', cost: 4, role: 'Dano encadeado', count: 1, hp: 390, damage: 64, speed: 40, range: 78, attackMs: 1100, color: '#38bdf8', glyph: 'LL', cardArt: '/assets/cards/logic-lizard-card_v001.webp' },
  { id: 'kernel-goat', canonicalId: 'MC-0037', name: 'Kernel Goat', cost: 4, role: 'Rompedor', count: 1, hp: 560, damage: 75, speed: 50, range: 20, attackMs: 1000, color: '#f97316', glyph: 'KG', cardArt: '/assets/cards/kernel-goat-card_v001.webp' },
  { id: 'packet-fox', canonicalId: 'MC-0040', name: 'Packet Fox', cost: 4, role: 'Infiltração', count: 1, hp: 330, damage: 90, speed: 56, range: 18, attackMs: 900, color: '#a855f7', glyph: 'PF', cardArt: '/assets/cards/packet-fox-card_v001.webp' },
  { id: 'buffer-bison', canonicalId: 'MC-0046', name: 'Buffer Bison', cost: 5, role: 'Tanque de aura', count: 1, hp: 880, damage: 62, speed: 28, range: 22, attackMs: 1250, color: '#22d3ee', glyph: 'BB', cardArt: '/assets/cards/buffer-bison-card_v001.webp' },
  { id: 'cache-mantis', canonicalId: 'MC-0049', name: 'Cache Mantis', cost: 4, role: 'Assassino', count: 1, hp: 320, damage: 115, speed: 62, range: 18, attackMs: 1000, color: '#34d399', glyph: 'CM', cardArt: '/assets/cards/cache-mantis-card_v001.webp' },
];

export const CARD_BY_ID = Object.fromEntries(CARDS.map((card) => [card.id, card]));








