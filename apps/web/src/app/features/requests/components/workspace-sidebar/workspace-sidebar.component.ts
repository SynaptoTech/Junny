import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HistoryPanelComponent } from '../../../history/components/history-panel/history-panel.component';
import type {
  CollectionRow,
  HistoryEntryDto,
} from '../../services/rest-workspace-api.service';

export interface EnvironmentOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-workspace-sidebar',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive, HistoryPanelComponent],
  template: `
    <aside
      class="flex h-full min-h-0 w-full flex-col border-r border-white/10 bg-slate-950/90 md:w-72"
    >
      <div
        class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden px-3 py-3"
      >
        <!-- Environments -->
        <section class="shrink-0 border-b border-white/10 pb-3">
          <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Environments
          </p>
          <label class="mb-1 block text-xs font-medium text-slate-500" for="workspace-env"
            >Active</label
          >
          <select
            id="workspace-env"
            class="mb-2 w-full rounded-lg border border-white/10 bg-slate-900 px-2 py-2 text-sm text-slate-100 focus:border-junny-violet/50 focus:outline-none"
            [value]="selectedEnvironmentId()"
            (change)="envChange.emit($any($event.target).value)"
          >
            <option value="">— none —</option>
            @for (e of environments(); track e.id) {
              <option [value]="e.id">{{ e.name }}</option>
            }
          </select>
          <div class="flex gap-2">
            <button
              type="button"
              class="flex-1 rounded-lg border border-white/10 bg-slate-900 py-2 text-xs font-medium text-slate-200 transition hover:border-junny-violet/40 hover:text-white"
              (click)="openEnvCreate.emit()"
            >
              + Novo
            </button>
            <button
              type="button"
              class="flex-1 rounded-lg border border-white/10 bg-slate-900 py-2 text-xs font-medium text-slate-200 transition hover:border-junny-violet/40 hover:text-white disabled:opacity-40"
              [disabled]="!selectedEnvironmentId()"
              (click)="openEnvEdit.emit(selectedEnvironmentId())"
            >
              Editar
            </button>
          </div>
        </section>

        <!-- Collections -->
        <section class="flex min-h-0 flex-1 flex-col overflow-hidden">
          <p
            class="mb-2 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Collections
          </p>
          <div class="min-h-0 flex-1 space-y-1 overflow-y-auto">
            @for (c of collections(); track c.id) {
              <div>
                <div
                  class="flex items-center gap-0.5 rounded-lg px-1 py-0.5 transition hover:bg-white/5"
                >
                  <button
                    type="button"
                    class="min-w-0 flex-1 truncate px-1 py-1.5 text-left text-sm text-slate-200"
                    [ngClass]="{ 'text-junny-blue': expandedCollectionId() === c.id }"
                    (click)="toggleCollection.emit(c.id)"
                  >
                    {{ c.name }}
                  </button>
                  <button
                    type="button"
                    class="shrink-0 rounded px-1.5 py-1 text-xs text-slate-500 hover:bg-white/10 hover:text-slate-200"
                    title="Duplicar"
                    (click)="duplicateCollection.emit(c.id); $event.stopPropagation()"
                  >
                    ⧉
                  </button>
                  <button
                    type="button"
                    class="shrink-0 rounded px-1.5 py-1 text-xs text-slate-500 hover:bg-white/10 hover:text-slate-200"
                    title="Renomear"
                    (click)="renameCollection.emit(c); $event.stopPropagation()"
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    class="shrink-0 rounded px-1.5 py-1 text-xs text-slate-500 hover:bg-white/10 hover:text-slate-200"
                    title="Auth da collection"
                    (click)="editCollectionAuth.emit(c); $event.stopPropagation()"
                  >
                    🔑
                  </button>
                  <button
                    type="button"
                    class="shrink-0 rounded px-1.5 py-1 text-xs text-slate-500 hover:bg-rose-500/10 hover:text-rose-300"
                    title="Eliminar"
                    (click)="deleteCollection.emit(c.id); $event.stopPropagation()"
                  >
                    ✕
                  </button>
                </div>
                @if (expandedCollectionId() === c.id && collectionRequests()) {
                  <div class="ml-2 mt-1 border-l border-white/10 pl-2">
                    @for (r of collectionRequests()!; track r.id) {
                      <div class="group flex items-center gap-0.5 py-0.5">
                        <button
                          type="button"
                          class="min-w-0 flex-1 truncate py-1 text-left text-xs text-slate-400 hover:text-junny-blue"
                          (click)="loadStored.emit(r)"
                        >
                          @if (r.tag) {
                            <span class="mr-1 text-[10px] uppercase text-slate-600">{{
                              r.tag
                            }}</span>
                          }
                          @if (r.protocol === 'GRAPHQL') {
                            <span class="mr-1 font-mono text-[10px] text-junny-violet"
                              >GQL</span
                            >
                          } @else if (r.protocol === 'SOAP') {
                            <span class="mr-1 font-mono text-[10px] text-amber-300"
                              >SOAP</span
                            >
                          } @else if (r.protocol === 'WEBSOCKET') {
                            <span class="mr-1 font-mono text-[10px] text-emerald-300"
                              >WS</span
                            >
                          } @else {
                            <span class="mr-1 font-mono text-[10px]">{{ r.method }}</span>
                          }
                          {{ r.url }}
                        </button>
                        <button
                          type="button"
                          class="shrink-0 rounded px-1 text-[10px] text-slate-600 opacity-0 transition hover:text-rose-300 group-hover:opacity-100"
                          title="Eliminar request"
                          (click)="
                            deleteStoredRequest.emit({
                              collectionId: c.id,
                              requestId: r.id,
                            });
                            $event.stopPropagation()
                          "
                        >
                          ✕
                        </button>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
          <button
            type="button"
            class="mt-2 w-full shrink-0 rounded-lg border border-dashed border-white/15 py-2 text-xs text-slate-400 hover:border-junny-violet/40 hover:text-slate-200"
            (click)="newCollection.emit()"
          >
            + Nova collection
          </button>
        </section>

        <app-history-panel
          class="flex min-h-[220px] min-w-0 flex-1 flex-col"
          [reloadTick]="historyReloadTick()"
          (replay)="replayHistory.emit($event)"
        />

        <section
          class="shrink-0 rounded-lg border border-white/10 px-2 py-3 text-xs text-slate-400"
        >
          <p
            class="mb-2 text-center font-semibold uppercase tracking-wide text-slate-500"
          >
            Protocolos
          </p>
          <div class="flex flex-wrap gap-2">
            <a
              routerLink="/app"
              routerLinkActive="pointer-events-none border-junny-violet/50 bg-slate-900 text-junny-blue"
              [routerLinkActiveOptions]="{ exact: true }"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center transition hover:border-junny-violet/40 hover:text-slate-100"
              >REST</a
            >
            <a
              routerLink="/app/graphql"
              routerLinkActive="pointer-events-none border-junny-violet/50 bg-slate-900 text-junny-blue"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center transition hover:border-junny-violet/40 hover:text-slate-100"
              >GraphQL</a
            >
            <a
              routerLink="/app/soap"
              routerLinkActive="pointer-events-none border-junny-violet/50 bg-slate-900 text-junny-blue"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center transition hover:border-junny-violet/40 hover:text-slate-100"
              >SOAP</a
            >
            <a
              routerLink="/app/websocket"
              routerLinkActive="pointer-events-none border-junny-violet/50 bg-slate-900 text-junny-blue"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center transition hover:border-junny-violet/40 hover:text-slate-100"
              >WS</a
            >
            <a
              routerLink="/app/kafka"
              routerLinkActive="pointer-events-none border-amber-500/40 bg-amber-950/50 text-amber-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center transition hover:border-amber-500/30 hover:text-amber-50"
              >Kafka</a
            >
            <a
              routerLink="/app/plugins"
              routerLinkActive="pointer-events-none border-indigo-500/40 bg-indigo-950/45 text-indigo-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-xs transition hover:border-indigo-400/35 hover:text-indigo-50"
              >Plugins</a
            >
            <a
              routerLink="/app/ai"
              routerLinkActive="pointer-events-none border-sky-500/40 bg-sky-950/45 text-sky-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-xs transition hover:border-sky-400/35 hover:text-sky-50"
              >AI</a
            >
            <a
              routerLink="/app/grpc"
              routerLinkActive="pointer-events-none border-teal-500/40 bg-teal-950/45 text-teal-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-xs transition hover:border-teal-400/35 hover:text-teal-50"
              >gRPC</a
            >
            <a
              routerLink="/app/codegen"
              routerLinkActive="pointer-events-none border-fuchsia-500/40 bg-fuchsia-950/45 text-fuchsia-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-fuchsia-400/35 hover:text-fuchsia-50"
              title="cURL import + code generation"
              >cURL+</a
            >
            <a
              routerLink="/app/runner"
              routerLinkActive="pointer-events-none border-emerald-500/40 bg-emerald-950/45 text-emerald-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-xs transition hover:border-emerald-400/35 hover:text-emerald-50"
              title="Collection request runner"
              >Run</a
            >
            <a
              routerLink="/app/mock"
              routerLinkActive="pointer-events-none border-cyan-500/40 bg-cyan-950/35 text-cyan-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-cyan-400/35 hover:text-cyan-50"
              title="Mock server roadmap"
              >Mock</a
            >
            <a
              routerLink="/app/security"
              routerLinkActive="pointer-events-none border-rose-500/40 bg-rose-950/30 text-rose-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-rose-400/35 hover:text-rose-50"
              title="Security & secrets roadmap"
              >Sec</a
            >
            <a
              routerLink="/app/sync"
              routerLinkActive="pointer-events-none border-blue-500/40 bg-blue-950/30 text-blue-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-blue-400/35 hover:text-blue-50"
              title="Sync & cloud strategy roadmap"
              >Sync</a
            >
            <a
              routerLink="/app/workspace-layout"
              routerLinkActive="pointer-events-none border-purple-500/40 bg-purple-950/30 text-purple-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-purple-400/35 hover:text-purple-50"
              title="Workspace layout system"
              >Lay</a
            >
            <a
              routerLink="/app/desktop"
              routerLinkActive="pointer-events-none border-orange-500/40 bg-orange-950/25 text-orange-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-orange-400/35 hover:text-orange-50"
              title="Native desktop — Tauri roadmap"
              >Dsk</a
            >
            <a
              routerLink="/app/team"
              routerLinkActive="pointer-events-none border-pink-500/40 bg-pink-950/25 text-pink-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-pink-400/35 hover:text-pink-50"
              title="Enterprise · team workspaces"
              >Team</a
            >
            <a
              routerLink="/app/official"
              routerLinkActive="pointer-events-none border-sky-500/40 bg-sky-950/25 text-sky-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-sky-400/35 hover:text-sky-50"
              title="Official roadmap v1"
              >v1</a
            >
            <a
              routerLink="/app/monitoring"
              routerLinkActive="pointer-events-none border-lime-500/40 bg-lime-950/25 text-lime-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-lime-400/35 hover:text-lime-50"
              title="API monitoring roadmap"
              >Mon</a
            >
            <a
              routerLink="/app/contracts"
              routerLinkActive="pointer-events-none border-violet-500/40 bg-violet-950/30 text-violet-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-violet-400/35 hover:text-violet-50"
              title="Contract testing & schemas"
              >Ctx</a
            >
            <a
              routerLink="/app/diff"
              routerLinkActive="pointer-events-none border-amber-500/40 bg-amber-950/25 text-amber-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-amber-400/35 hover:text-amber-50"
              title="API diff & schema compare"
              >Dif</a
            >
            <a
              routerLink="/app/interceptor"
              routerLinkActive="pointer-events-none border-teal-500/40 bg-teal-950/25 text-teal-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-teal-400/35 hover:text-teal-50"
              title="Traffic interceptor · HTTP inspector"
              >Tráf</a
            >
            <a
              routerLink="/app/browser-extension"
              routerLinkActive="pointer-events-none border-indigo-500/40 bg-indigo-950/30 text-indigo-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-indigo-400/35 hover:text-indigo-50"
              title="Browser extension · capture"
              >Ext</a
            >
            <a
              routerLink="/app/ai-generator"
              routerLinkActive="pointer-events-none border-purple-500/40 bg-purple-950/30 text-purple-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-purple-400/35 hover:text-purple-50"
              title="AI request generator · prompt → request"
              >Gen</a
            >
            <a
              routerLink="/app/ai-analyzer"
              routerLinkActive="pointer-events-none border-cyan-500/40 bg-cyan-950/25 text-cyan-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-cyan-400/35 hover:text-cyan-50"
              title="AI response analyzer · errors & fixes"
              >Ana</a
            >
            <a
              routerLink="/app/workflows"
              routerLinkActive="pointer-events-none border-amber-500/40 bg-amber-950/25 text-amber-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-amber-400/35 hover:text-amber-50"
              title="AI workflow builder · chaining"
              >Flo</a
            >
            <a
              routerLink="/app/marketplace"
              routerLinkActive="pointer-events-none border-fuchsia-500/40 bg-fuchsia-950/20 text-fuchsia-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-fuchsia-400/35 hover:text-fuchsia-50"
              title="Plugin marketplace · community"
              >Mkt</a
            >
            <a
              routerLink="/app/enterprise"
              routerLinkActive="pointer-events-none border-sky-500/40 bg-sky-950/30 text-sky-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-sky-400/35 hover:text-sky-50"
              title="Enterprise self-hosted"
              >Ent</a
            >
            <a
              routerLink="/app/profiler"
              routerLinkActive="pointer-events-none border-green-500/40 bg-green-950/25 text-green-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-green-400/35 hover:text-green-50"
              title="API performance profiler"
              >Prf</a
            >
            <a
              routerLink="/app/observability"
              routerLinkActive="pointer-events-none border-blue-500/40 bg-blue-950/30 text-blue-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-blue-400/35 hover:text-blue-50"
              title="Realtime observability dashboard"
              >Obs</a
            >
            <a
              routerLink="/app/vault"
              routerLinkActive="pointer-events-none border-rose-500/40 bg-rose-950/25 text-rose-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-rose-400/35 hover:text-rose-50"
              title="Secrets vault enterprise"
              >Vlt</a
            >
            <a
              routerLink="/app/ai-docs"
              routerLinkActive="pointer-events-none border-violet-500/40 bg-violet-950/25 text-violet-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-violet-400/35 hover:text-violet-50"
              title="AI API documentation generator"
              >Doc</a
            >
            <a
              routerLink="/app/ai-openapi"
              routerLinkActive="pointer-events-none border-lime-500/40 bg-lime-950/25 text-lime-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-lime-400/35 hover:text-lime-50"
              title="AI OpenAPI generator & schema builder"
              >OAI</a
            >
            <a
              routerLink="/app/streaming"
              routerLinkActive="pointer-events-none border-teal-500/40 bg-teal-950/25 text-teal-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-teal-400/35 hover:text-teal-50"
              title="Event streaming studio"
              >Str</a
            >
            <a
              routerLink="/app/git"
              routerLinkActive="pointer-events-none border-amber-500/40 bg-amber-950/25 text-amber-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-amber-400/35 hover:text-amber-50"
              title="Git native collections"
              >Git</a
            >
            <a
              routerLink="/app/sdk"
              routerLinkActive="pointer-events-none border-indigo-500/40 bg-indigo-950/25 text-indigo-100"
              class="min-w-[4.5rem] flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[10px] font-medium leading-tight transition hover:border-indigo-400/35 hover:text-indigo-50"
              title="Public SDK"
              >SDK</a
            >
          </div>
        </section>
      </div>
    </aside>
  `,
})
export class WorkspaceSidebarComponent {
  readonly collections = input<CollectionRow[]>([]);
  readonly environments = input<EnvironmentOption[]>([]);
  readonly selectedEnvironmentId = input('');
  readonly expandedCollectionId = input<string | null>(null);
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
  }>();
  readonly deleteStoredRequest = output<{
    collectionId: string;
    requestId: string;
  }>();
  readonly replayHistory = output<HistoryEntryDto>();
  readonly newCollection = output<void>();
  readonly duplicateCollection = output<string>();
  readonly renameCollection = output<CollectionRow>();
  readonly deleteCollection = output<string>();
  readonly editCollectionAuth = output<CollectionRow>();
}
