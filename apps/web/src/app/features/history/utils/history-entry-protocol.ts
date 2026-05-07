import type { HistoryEntryDto } from '../../requests/services/rest-workspace-api.service';

export function historyEntryProtocol(entry: HistoryEntryDto): string {
  const top = entry.protocol?.trim();
  if (top) return top;
  const req = entry.request as Record<string, unknown> | null;
  const p = req?.['protocol'];
  return typeof p === 'string' && p ? p : 'REST';
}
