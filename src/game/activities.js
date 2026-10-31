import { CARDS, CARD_BY_ID } from './cards.js';
import {validateProgression,createProgression,progressionState,COLLECTION_POLICY,availableCardIds,ARENA_UNLOCKS,CLASS_DEFS} from './progression.js';
import {creditBattleJobs} from './career.js';
import{validateCommerce}from'../shop.js';

export const ACTIVITY_VERSION = 1;
export const MIN_ACTIVITY_MATCH_MS = 30_000;
export const dayKey = (now = Date.now()) => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date(now));
const dayNumber = day => Math.floor(Date.parse(`${day}T12:00:00Z`) / 86400000);
export function weekKey(day) {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7);
  return date.toISOString().slice(0, 10);
}
const dailyState = (day,ids=CARDS.map(c=>c.id)) => ({ day, featuredCardId:ids[dayNumber(day)%ids.length], battles: 0, wins: 0, towerDamage: 0, familyWins: 0, claimed: {} });
const weeklyState = week => ({ week, wins: 0, towerDamage: 0, cardsUsed: [], missionsClaimed: 0, claimed: {} });
const reward = (gold = 0, xp = 0, dataFragments = 0, cards = {}) => ({ gold, xp, dataFragments, cards });
export const CHECKIN_REWARDS = [reward(30, 10), reward(40, 10), reward(50, 15, 1), reward(60, 15), reward(80, 20, 1), reward(100, 20), reward(150, 30, 2)];
export function createProgress(now = Date.now()) {
  const day = dayKey(now);
  return { version: ACTIVITY_VERSION, highWaterDay: day, daily: dailyState(day,ARENA_UNLOCKS[0].ids), weekly: weeklyState(weekKey(day)),
    wallet: reward(), checkin: { cursor: 0, lastDay: null, lastClaimIndex: null, consecutive: 0, cycle: 0 },
    processedMatches: {}, receipts: [], progression:createProgression(COLLECTION_POLICY) };
}
export function validateProgress(p) {
  if (!p || p.version !== ACTIVITY_VERSION || !/^\d{4}-\d{2}-\d{2}$/.test(p.highWaterDay || '') ||
    !/^\d{4}-\d{2}-\d{2}$/.test(p.daily?.day || '') || !/^\d{4}-\d{2}-\d{2}$/.test(p.weekly?.week || '') || !p.daily?.claimed || !p.weekly?.claimed || !Array.isArray(p.weekly.cardsUsed) || !p.processedMatches || !Array.isArray(p.receipts) ||
    !Number.isInteger(p.checkin?.cursor) || p.checkin.cursor < 0 || p.checkin.cursor > 6 || !p.wallet?.cards ||
    ![p.wallet.gold, p.wallet.xp, p.wallet.dataFragments, p.daily.battles, p.daily.wins, p.daily.towerDamage, p.daily.familyWins,
      p.weekly.wins, p.weekly.towerDamage, p.weekly.missionsClaimed, p.checkin.consecutive, p.checkin.cycle,
      ...Object.values(p.wallet.cards)].every(n => Number.isSafeInteger(n) && n >= 0)) {
    throw Error('O progresso local não pôde ser lido. Os dados foram preservados; não serão substituídos.');
  }
  if(p.progression!==undefined)validateProgression(p.progression);
  validateCommerce(p.commerce);
  if(p.daily.featuredCardId!==undefined&&!CARD_BY_ID[p.daily.featuredCardId])throw Error('Destaque diário inválido. Seus dados foram preservados.');
  return p;
}
export function advanceProgress(profile, now = Date.now()) {
  validateProgress(profile);
  const p = structuredClone(profile), day = dayKey(now);
  if (day < p.highWaterDay) throw Error('O relógio voltou para um dia anterior. Confira a data do dispositivo antes de resgatar.');
  if (p.daily.day !== day) p.daily = dailyState(day,availableCardIds(p));
  const week = weekKey(day);
  if (p.weekly.week !== week) p.weekly = weeklyState(week);
  p.highWaterDay = day;
  return p;
}
export function featuredCard(day) { return CARDS[dayNumber(day) % CARDS.length]; }
export function cacheReward(key, count) {
  const offset = [...key].reduce((sum, c) => sum + c.charCodeAt(0), 0), cards = {};
  for (let i = 0; i < count; i++) { const id = CARDS[(offset + i * 3) % CARDS.length].id; cards[id] = (cards[id] || 0) + 1; }
  return cards;
}
export function activityView(profile, now = Date.now()) {
  const p = advanceProgress(profile, now), card = CARD_BY_ID[p.daily.featuredCardId]||featuredCard(p.daily.day);
  const missions = [
    { id: 'battles', title: 'Presença na arena', description: 'Conclua 3 partidas manuais.', current: p.daily.battles, goal: 3, reward: reward(100, 20) },
    { id: 'tower-damage', title: 'Pressão nas torres', description: 'Cause 1.000 de dano efetivo às torres rivais.', current: p.daily.towerDamage, goal: 1000, reward: reward(80, 15, 1) },
    { id: 'family-win', title: `Destaque: ${card.name}`, description: `Vença uma partida em que você jogou ${card.name}.`, current: p.daily.familyWins, goal: 1, reward: reward(50, 30, 0, { [card.id]: 1 }) },
  ].map(m => ({ ...m, claimed: !!p.daily.claimed[m.id] }));
  return { profile: p, featured: card, missions,
    firstWin: { current: p.daily.wins, goal: 1, claimed: !!p.daily.claimed['first-win'], reward: reward(75, 25, 0, cacheReward(p.daily.day, 1)) },
    weekly: { current: p.weekly.missionsClaimed, goal: 9, claimed: !!p.weekly.claimed.weekly, reward: reward(300, 100, 2, cacheReward(p.weekly.week + ':weekly', 3)) },
    event: { id: `vila-byte:${p.weekly.week}`, title: 'Operação Vila Byte', claimed: !!p.weekly.claimed.event,
      goals: [{ title: 'Vitórias manuais', current: p.weekly.wins, goal: 3 }, { title: 'Dano em torres', current: p.weekly.towerDamage, goal: 5000 }, { title: 'Criaturas diferentes utilizadas', current: p.weekly.cardsUsed.length, goal: 4 }],
      reward: reward(200, 80, 3, cacheReward(p.weekly.week + ':event', 5)) } };
}
export function battleEligibility(b) {
  if (!b || typeof b.id !== 'string' || !b.id || !['player', 'enemy', 'draw'].includes(b.winner) ||
    typeof b.automaticUsed !== 'boolean' || !Number.isFinite(b.durationMs) || b.durationMs < MIN_ACTIVITY_MATCH_MS || !b.cardsUsed ||
    !Object.entries(b.cardsUsed).some(([id, n]) => CARD_BY_ID[id] && Number.isInteger(n) && n > 0)) return 'Partida sem participação manual suficiente para as atividades (mínimo de 30 segundos).';
  if (b.automaticUsed) return 'Treino automático concluído: não conta para missões, eventos ou recompensas de batalha.';
  return null;
}
export function recordBattle(profile, summary, now = Date.now()) {
  const p = advanceProgress(profile, now);
  if (typeof summary?.id !== 'string' || !summary.id) throw Error('Resultado sem identificação de partida.');
  if (Object.hasOwn(p.processedMatches, summary.id)) return p;
  const reason = battleEligibility(summary);
  p.processedMatches[summary.id] = { day: p.daily.day, eligible: !reason };
  if (reason) return p;
  const damage = Math.round(Math.max(0, Math.min(6400, Number(summary.towerDamage) || 0)));
  const used = Object.entries(summary.cardsUsed).filter(([id, n]) => CARD_BY_ID[id] && Number.isInteger(n) && n > 0).map(([id]) => id);
  p.daily.battles++; p.daily.towerDamage += damage; p.weekly.towerDamage += damage;
  p.weekly.cardsUsed = [...new Set([...p.weekly.cardsUsed, ...used])];
  if (summary.winner === 'player') {
    p.daily.wins++; p.weekly.wins++;
    if (used.includes((CARD_BY_ID[p.daily.featuredCardId]||featuredCard(p.daily.day)).id)) p.daily.familyWins++;
  }
  if(used.length&&used.every(id=>availableCardIds(p).includes(id))){
    p.progression=structuredClone(progressionState(p));
    p.progression.career=creditBattleJobs(p,summary.winner,CLASS_DEFS.map(c=>c.id));
  }
  return validateProgress(p);
}
function credit(p, key, value, now) {
  if (p.receipts.some(r => r.key === key)) throw Error('Esta recompensa já foi recebida.');
  for (const resource of ['gold', 'xp', 'dataFragments']) p.wallet[resource] += value[resource];
  for (const [id, n] of Object.entries(value.cards)) p.wallet.cards[id] = (p.wallet.cards[id] || 0) + n;
  p.receipts.push({ key, at: new Date(now).toISOString(), reward: structuredClone(value) });
  return validateProgress(p);
}
export function claimActivity(profile, kind, id, now = Date.now()) {
  const v = activityView(profile, now), p = v.profile, day = p.daily.day;
  if (kind === 'checkin') {
    if (p.checkin.lastDay === day) throw Error('Check-in de hoje já recebido.');
    const index = p.checkin.cursor, previous = p.checkin.lastDay;
    p.checkin.consecutive = previous && dayNumber(day) - dayNumber(previous) === 1 ? p.checkin.consecutive + 1 : 1;
    p.checkin.lastDay = day; p.checkin.lastClaimIndex = index; p.checkin.cursor = (index + 1) % 7;
    if (index === 6) p.checkin.cycle++;
    return credit(p, `checkin:${day}`, CHECKIN_REWARDS[index], now);
  }
  const item = kind === 'daily' ? v.missions.find(m => m.id === id) : kind === 'first-win' ? v.firstWin : kind === 'weekly' ? v.weekly : kind === 'event' ? v.event : null;
  if (!item) throw Error('Atividade desconhecida.');
  if (item.claimed) throw Error('Esta recompensa já foi recebida.');
  if (kind === 'event' ? !item.goals.every(g => g.current >= g.goal) : item.current < item.goal) throw Error('Conclua o objetivo antes de receber a recompensa.');
  if (kind === 'daily' || kind === 'first-win') {
    p.daily.claimed[kind === 'daily' ? id : 'first-win'] = true;
    if (kind === 'daily') p.weekly.missionsClaimed++;
    return credit(p, `${day}:${kind}:${id || ''}`, item.reward, now);
  }
  p.weekly.claimed[kind] = true;
  return credit(p, `${p.weekly.week}:${kind}`, item.reward, now);
}
