import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'junny-history-ui-v1';

export type HistoryProtocolFilter = 'ALL' | 'REST' | 'GRAPHQL' | 'SOAP';

export type HistoryStatusFilter =
  | 'any'
  | '2xx'
  | '3xx'
  | '4xx'
  | '5xx';

@Injectable({ providedIn: 'root' })
export class HistoryUiPersistenceService {
  readonly searchQuery = signal('');
  readonly protocolFilter = signal<HistoryProtocolFilter>('ALL');
  readonly statusGroup = signal<HistoryStatusFilter>('any');
  readonly methodFilter = signal('');

  constructor() {
    this.hydrate();
  }

  private hydrate(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const u = JSON.parse(raw) as {
        searchQuery?: string;
        protocolFilter?: HistoryProtocolFilter;
        statusGroup?: HistoryStatusFilter;
        methodFilter?: string;
      };
      if (typeof u.searchQuery === 'string') this.searchQuery.set(u.searchQuery);
      if (
        u.protocolFilter &&
        ['ALL', 'REST', 'GRAPHQL', 'SOAP'].includes(u.protocolFilter)
      ) {
        this.protocolFilter.set(u.protocolFilter);
      }
      if (
        u.statusGroup &&
        ['any', '2xx', '3xx', '4xx', '5xx'].includes(u.statusGroup)
      ) {
        this.statusGroup.set(u.statusGroup);
      }
      if (typeof u.methodFilter === 'string') this.methodFilter.set(u.methodFilter);
    } catch {
      /* ignore */
    }
  }

  saveToStorage(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        searchQuery: this.searchQuery(),
        protocolFilter: this.protocolFilter(),
        statusGroup: this.statusGroup(),
        methodFilter: this.methodFilter(),
      }),
    );
  }
}
