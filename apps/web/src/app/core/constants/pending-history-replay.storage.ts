/** Reprodução de pedido do histórico após navegar entre workspaces. */
export const PENDING_HISTORY_REPLAY_KEY = 'junny.pendingHistoryReplay';

export function storePendingHistoryReplay(entry: unknown): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(PENDING_HISTORY_REPLAY_KEY, JSON.stringify(entry));
}

export function peekPendingHistoryReplay(): unknown | null {
  if (typeof sessionStorage === 'undefined') return null;
  const raw = sessionStorage.getItem(PENDING_HISTORY_REPLAY_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export function clearPendingHistoryReplay(): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.removeItem(PENDING_HISTORY_REPLAY_KEY);
}
