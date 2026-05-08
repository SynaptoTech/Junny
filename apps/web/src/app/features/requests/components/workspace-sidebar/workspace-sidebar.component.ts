import { isPlatformBrowser, NgClass } from '@angular/common';
import {
  Component,
  effect,
  HostListener,
  computed,
  inject,
  input,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TeamWorkspaceModalComponent } from '../../../team/components/team-workspace-modal/team-workspace-modal.component';
import { TeamApiService, type WorkspaceDto } from '../../../team/services/team-api.service';
import { PromptDialogComponent } from '../../../../shared/components/prompt-dialog/prompt-dialog.component';
import { HistoryPanelComponent } from '../../../history/components/history-panel/history-panel.component';
import type {
  CollectionRow,
  HistoryEntryDto,
} from '../../services/rest-workspace-api.service';
import { methodTone, type MethodTone } from '../../utils/http-method.utils';

export interface EnvironmentOption {
  id: string;
  name: string;
}

type PanelId = 'env' | 'collections' | 'history' | 'team' | 'protocols';

const STORAGE_KEY = 'junny.workspace-sidebar.width';
const MIN_W = 240;
const MAX_W = 640;
const DEFAULT_W = 300;

export type SidebarStoredRequestPayload = {
  id: string;
  method: string;
  url: string;
  headers: unknown;
  params?: unknown;
  body: string | null;
  tag?: string | null;
  protocol?: string;
  graphqlVariables?: unknown;
  authConfig?: unknown;
};

@Component({
  selector: 'app-workspace-sidebar',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    RouterLinkActive,
    HistoryPanelComponent,
    TeamWorkspaceModalComponent,
    PromptDialogComponent,
  ],
  templateUrl: './workspace-sidebar.component.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class WorkspaceSidebarComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly teamApi = inject(TeamApiService);

  readonly collections = input<CollectionRow[]>([]);
  readonly environments = input<EnvironmentOption[]>([]);
  readonly selectedEnvironmentId = input('');
  readonly expandedCollectionId = input<string | null>(null);
  /** Quando vazio, esconde a entrada "Root" (ex.: outros workspaces). */
  readonly rootFolderId = input<string>('');
  readonly collectionRequests = input<
    | {
        id: string;
        method: string;
        url: string;
        headers: unknown;
        params?: unknown;
        body: string | null;
        tag?: string | null;
        protocol?: string;
        graphqlVariables?: unknown;
        authConfig?: unknown;
      }[]
    | null
  >(null);
  readonly historyReloadTick = input(0);

  readonly envChange = output<string>();
  readonly openEnvCreate = output<void>();
  readonly openEnvEdit = output<string>();
  readonly toggleCollection = output<string>();
  readonly loadStored = output<{
    storageFolderId: string;
    request: SidebarStoredRequestPayload;
  }>();
  readonly deleteStoredRequest = output<{
    collectionId: string;
    requestId: string;
  }>();
  readonly renameStoredRequest = output<{
    collectionId: string;
    requestId: string;
    currentTag: string | null | undefined;
    currentUrl: string;
  }>();
  readonly replayHistory = output<HistoryEntryDto>();
  readonly newCollection = output<void>();
  readonly duplicateCollection = output<string>();
  readonly renameCollection = output<CollectionRow>();
  readonly deleteCollection = output<string>();
  readonly editCollectionAuth = output<CollectionRow>();

  readonly sidebarWidth = signal(this.readStoredWidth());
  readonly activePanel = signal<PanelId>('collections');
  readonly searchQuery = signal('');

  readonly teamWorkspaces = signal<WorkspaceDto[]>([]);
  readonly teamLoading = signal(false);
  readonly teamError = signal<string | null>(null);
  readonly teamModalWorkspace = signal<WorkspaceDto | null>(null);
  readonly teamCreatePromptOpen = signal(false);

  protected readonly visibleRequests = computed(() => {
    const list = this.collectionRequests();
    if (!list) return null;
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return list;
    return list.filter((r) => {
      const tag = (r.tag ?? '').toLowerCase();
      const url = r.url.toLowerCase();
      const method = (r.method ?? '').toLowerCase();
      const protocol = (r.protocol ?? '').toLowerCase();
      return (
        tag.includes(q) ||
        url.includes(q) ||
        method.includes(q) ||
        protocol.includes(q)
      );
    });
  });

  protected toneFor(
    method: string,
    protocol?: string | null,
  ): MethodTone {
    return methodTone(method, protocol);
  }

  readonly tabs: readonly {
    id: PanelId;
    short: string;
    title: string;
    icon: string;
  }[] = [
    { id: 'env', short: 'Env', title: 'Environments', icon: '⚙' },
    { id: 'collections', short: 'Col', title: 'Collections', icon: '📁' },
    { id: 'history', short: 'Log', title: 'History', icon: '🕐' },
    { id: 'team', short: 'Eqp', title: 'Equipe e workspace', icon: '👥' },
    { id: 'protocols', short: 'Nav', title: 'Protocols & tools', icon: '⎘' },
  ];

  constructor() {
    effect(() => {
      if (this.activePanel() !== 'team') return;
      this.loadTeamWorkspaces();
    });
  }

  protected loadTeamWorkspaces(): void {
    this.teamLoading.set(true);
    this.teamError.set(null);
    this.teamApi.listMyWorkspaces().subscribe({
      next: (list) => {
        this.teamWorkspaces.set(list);
        this.teamLoading.set(false);
      },
      error: () => {
        this.teamLoading.set(false);
        this.teamError.set('Não foi possível carregar os workspaces.');
      },
    });
  }

  protected openTeamModal(w: WorkspaceDto): void {
    this.teamModalWorkspace.set(w);
  }

  protected closeTeamModal(): void {
    this.teamModalWorkspace.set(null);
    if (this.activePanel() === 'team') this.loadTeamWorkspaces();
  }

  protected openTeamCreatePrompt(): void {
    this.teamCreatePromptOpen.set(true);
  }

  protected onTeamCreateCancelled(): void {
    this.teamCreatePromptOpen.set(false);
  }

  protected onTeamCreateConfirmed(name: string): void {
    const trimmed = name.trim();
    if (!trimmed) return;
    this.teamCreatePromptOpen.set(false);
    this.teamLoading.set(true);
    this.teamApi.createWorkspace(trimmed).subscribe({
      next: () => this.loadTeamWorkspaces(),
      error: () => {
        this.teamLoading.set(false);
        this.teamError.set('Falha ao criar workspace.');
      },
    });
  }

  private resizing = false;
  private resizeStartX = 0;
  private resizeStartW = 0;

  private readStoredWidth(): number {
    if (!isPlatformBrowser(this.platformId)) return DEFAULT_W;
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (!v) return DEFAULT_W;
      const n = Number.parseInt(v, 10);
      if (Number.isNaN(n)) return DEFAULT_W;
      return Math.min(MAX_W, Math.max(MIN_W, n));
    } catch {
      return DEFAULT_W;
    }
  }

  private persistWidth(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(STORAGE_KEY, String(this.sidebarWidth()));
    } catch {
      /* ignore */
    }
  }

  onResizeStart(ev: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    ev.preventDefault();
    this.resizing = true;
    this.resizeStartX = ev.clientX;
    this.resizeStartW = this.sidebarWidth();
  }

  @HostListener('document:mousemove', ['$event'])
  onResizeMove(ev: MouseEvent): void {
    if (!this.resizing) return;
    ev.preventDefault();
    const delta = ev.clientX - this.resizeStartX;
    const next = Math.min(MAX_W, Math.max(MIN_W, this.resizeStartW + delta));
    this.sidebarWidth.set(next);
  }

  @HostListener('document:mouseup')
  onResizeEnd(): void {
    if (!this.resizing) return;
    this.resizing = false;
    this.persistWidth();
  }
}
