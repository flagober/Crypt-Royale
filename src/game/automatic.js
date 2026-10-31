import { CARD_BY_ID } from './cards.js';

// Internal playtesting: defend an invaded lane, otherwise build a tank/support push.
export function updateAutomatic(game, dt, { deployCard, activateOperator }) {
  if (!game.automaticEnabled || game.status !== 'playing') return;
  if(!(game.autoPassUntil>Date.now())){game.automaticEnabled=false;return;}
  if (game.activityStats) game.activityStats.automaticUsed = true;
  game.automaticThinkMs = Math.max(0, game.automaticThinkMs - dt);
  if (game.automaticThinkMs === 0) {
    game.automaticThinkMs = 800;
    const threats = game.units.filter(u => u.team === 'enemy' && u.hp > 0 && u.y > 300);
    const threat = threats.sort((a, b) => b.y - a.y)[0];
    const targets = game.towers.filter(t => t.team === 'enemy' && t.hp > 0);
    const target = targets.sort((a, b) => (a.type === 'core') - (b.type === 'core') || a.hp - b.hp)[0];
    const x = threat ? (threat.x < 180 ? 88 : 272) : (target?.x ?? 88);
    const army = game.units.filter(u => u.team === 'player' && u.hp > 0 && Math.abs(u.x - x) < 90);
    const hasFrontline = army.some(u => CARD_BY_ID[u.cardId]?.hp >= 430);
    const cards = game.playerHand.map(id => CARD_BY_ID[id]).filter(c => c && c.cost <= game.playerEnergy + 0.0001);
    const score = c => threat
      ? c.damage * c.count / c.cost + c.range / 4
      : hasFrontline ? c.range + c.damage * c.count / c.cost : c.hp / c.cost;
    cards.sort((a, b) => score(b) - score(a));
    if (cards[0]) deployCard(game, cards[0].id, x, threat ? Math.min(490, Math.max(320, threat.y + 35)) : hasFrontline ? 380 : 330);
  }
  // Deploy first so a new troop receives the shield on the activation tick.
  if (game.operatorBastionMs <= 0 && game.operatorCooldownMs <= 0) activateOperator(game);
}
