import { DatePipe, JsonPipe, NgClass } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { RestWorkspaceApiService } from '../../../requests/services/rest-workspace-api.service';
import type { HistoryEntryDto } from '../../../requests/services/rest-workspace-api.service';
import {
  HistoryUiPersistenceService,
  type HistoryProtocolFilter,
  type HistoryStatusFilter,
} from '../../services/history-ui-persistence.service';
import {
  bucketForCreatedAt,
  bucketLabel,
  type HistoryDateBucket,
} from '../../utils/history-date-buckets';
import { historyEntryProtocol } from '../../utils/history-entry-protocol';

const BUCKET_ORDER: HistoryDateBucket[] = [
  'today',
  'yesterday',
  'week',
  'older',
];

@Component({
  selector: 'app-history-panel',
  standalone: true,
  imports: [DatePipe, JsonPipe, NgClass],
  templateUrl: './history-panel.component.html',
})
export class HistoryPanelComponent {
  private readonly api = inject(RestWorkspaceApiService);
  readonly ui = inject(HistoryUiPersistenceService);

  readonly reloadTick = input.required<number>();

  readonly replay = output<HistoryEntryDto>();

  readonly loading = signal(false);
  readonly items = signal<HistoryEntryDto[]>([]);
  readonly expandedId = signal<string | null>(null);

  readonly grouped = computed(() => {
    const map: Record<HistoryDateBucket, HistoryEntryDto[]> = {
      today: [],
      yesterday: [],
      week: [],
      older: [],
    };
    for (const h of this.items()) {
      map[bucketForCreatedAt(h.createdAt)].push(h);
    }
    return map;
  });

  readonly bucketOrder = BUCKET_ORDER;

  constructor() {
    effect(() => {
      this.reloadTick();
      this.ui.searchQuery();
      this.ui.protocolFilter();
      this.ui.statusGroup();
      this.ui.methodFilter();
      untracked(() => void this.fetchHistory());
    });
  }

  trackBucket(bucket: HistoryDateBucket): HistoryDateBucket {
    return bucket;
  }

  labelBucket(bucket: HistoryDateBucket): string {
    return bucketLabel(bucket);
  }

  protocolShort(entry: HistoryEntryDto): string {
    return historyEntryProtocol(entry);
  }

  protocolBadgeClass(entry: HistoryEntryDto): string {
    const p = historyEntryProtocol(entry);
    if (p === 'GRAPHQL') return 'text-junny-violet border-junny-violet/40 bg-junny-violet/10';
    if (p === 'SOAP') return 'text-amber-300 border-amber-500/30 bg-amber-500/10';
    return 'text-slate-300 border-white/15 bg-slate-900/80';
  }

  statusPillClass(status: number): string {
    if (status >= 200 && status < 300) return 'bg-emerald-500/20 text-emerald-200';
    if (status >= 300 && status < 400) return 'bg-junny-blue/20 text-blue-200';
    if (status >= 400 && status < 500) return 'bg-amber-500/20 text-amber-200';
    return 'bg-rose-500/20 text-rose-200';
  }

  displayUrl(entry: HistoryEntryDto): string {
    const u = entry.url?.trim();
    if (u) return u.length > 46 ? `${u.slice(0, 44)}…` : u;
    const req = entry.request as Record<string, unknown> | null;
    const fallback = req?.['url'];
    if (typeof fallback === 'string' && fallback)
      return fallback.length > 46 ? `${fallback.slice(0, 44)}…` : fallback;
    return '—';
  }

  displayMethod(entry: HistoryEntryDto): string {
    const m = entry.method?.trim();
    if (m) return m;
    const req = entry.request as Record<string, unknown> | null;
    const mo = req?.['method'];
    return typeof mo === 'string' ? mo : '—';
  }

  toggleExpand(entry: HistoryEntryDto): void {
    this.expandedId.update((id) => (id === entry.id ? null : entry.id));
  }

  onReplay(entry: HistoryEntryDto, ev: Event): void {
    ev.stopPropagation();
    this.replay.emit(entry);
  }

  updateSearch(v: string): void {
    this.ui.searchQuery.set(v);
    this.ui.saveToStorage();
  }

  updateProtocol(v: string): void {
    const p = v as HistoryProtocolFilter;
    if (['ALL', 'REST', 'GRAPHQL', 'SOAP'].includes(p)) {
      this.ui.protocolFilter.set(p);
      this.ui.saveToStorage();
    }
  }

  updateStatus(v: string): void {
    const s = v as HistoryStatusFilter;
    if (['any', '2xx', '3xx', '4xx', '5xx'].includes(s)) {
      this.ui.statusGroup.set(s);
      this.ui.saveToStorage();
    }
  }

  updateMethod(v: string): void {
    this.ui.methodFilter.set(v);
    this.ui.saveToStorage();
  }

  clearFilters(): void {
    this.ui.searchQuery.set('');
    this.ui.protocolFilter.set('ALL');
    this.ui.statusGroup.set('any');
    this.ui.methodFilter.set('');
    this.ui.saveToStorage();
  }

  clearAllHistory(): void {
    if (typeof window === 'undefined') return;
    if (
      !window.confirm(
        'Delete all history? This cannot be undone.',
      )
    ) {
      return;
    }
    this.api.deleteAllHistory().subscribe(() => void this.fetchHistory());
  }

  private fetchHistory(): void {
    this.loading.set(true);
    const pf = this.ui.protocolFilter();
    const sg = this.ui.statusGroup();
    this.api
      .listHistory({
        skip: 0,
        take: 200,
        q: this.ui.searchQuery().trim() || undefined,
        protocol: pf !== 'ALL' ? pf : undefined,
        method: this.ui.methodFilter().trim() || undefined,
        statusGroup: sg === 'any' ? undefined : sg,
      })
      .subscribe({
        next: (r) => {
          this.items.set(r.items);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}
