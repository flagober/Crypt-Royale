import { createProgress, validateProgress } from './game/activities.js';
export const PROGRESS_KEY = 'cryptroyale.activities.v1';
export function loadProgress(storage, now = Date.now()) {
  const raw = storage.getItem(PROGRESS_KEY);
  if (raw === null) return createProgress(now);
  try { return validateProgress(JSON.parse(raw)); }
  catch { throw Error('Não foi possível ler seu progresso local. A cópia existente foi preservada.'); }
}
export function updateProgress(storage, updater, now = Date.now()) {
  const current = storage.getItem(PROGRESS_KEY), profile = loadProgress(storage, now);
  const next = validateProgress(updater(profile));
  const raw = JSON.stringify(next);
  if (current === raw) return next;
  // Preserve the previous state before committing a reward or a battle receipt.
  if (current !== null) storage.setItem(PROGRESS_KEY + '.backup', current);
  storage.setItem(PROGRESS_KEY, raw);
  return next;
}
