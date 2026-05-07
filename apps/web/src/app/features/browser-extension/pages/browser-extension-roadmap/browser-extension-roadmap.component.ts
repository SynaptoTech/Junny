import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  computed,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { environment } from '../../../../core/environments/environment';

export interface BrowserExtensionRoadmapApi {
  phase: string;
  md: string;
  description: string;
  strategicGoals: readonly string[];
  mainFlowSteps: readonly string[];
  capturesSupported: readonly string[];
  protocolsMvp: readonly string[];
  graphqlCaptureHints: readonly string[];
  localIntegrationHost: string;
  extensionWorkspacePath: string;
  frontendStructure: string;
  browsersPlanned: readonly string[];
  componentsPlanned: readonly string[];
  mvpGoals: readonly string[];
  deferred: readonly string[];
  securityNotes: readonly string[];
  privacyControls: readonly string[];
}

const BROWSER_EXT_ROADMAP_FALLBACK: BrowserExtensionRoadmapApi = {
  phase: 'roadmap',
  md: 'MD35_JUNNY_BROWSER_EXTENSION_REQUEST_CAPTURE.md',
  description:
    'Roadmap para extensão de navegador que intercepta fetch/XHR, extrai operações GraphQL e envia requests para instância Junny local (ex.: porta 13050) — cloud opcional desligada por defeito e sem telemetry invasiva.',
  strategicGoals: [
    'ferramenta integrada ao navegador',
    'aproximar Junny ao workflow real de frontend',
    'unificar browser, APIs, debugging e collections num fluxo só',
  ],
  mainFlowSteps: [
    'instalar extensão',
    'navegar na aplicação alvo',
    'capturar requests na extensão',
    'enviar para o Junny em execução local',
  ],
  capturesSupported: [
    'fetch',
    'XMLHttpRequest',
    'GraphQL requests',
    'headers',
    'responses',
  ],
  protocolsMvp: ['REST', 'GraphQL'],
  graphqlCaptureHints: ['operations', 'queries', 'mutations', 'variables'],
  localIntegrationHost: 'localhost:13050',
  extensionWorkspacePath: '/extensions/browser',
  frontendStructure: '/features/browser-extension',
  browsersPlanned: ['Chrome', 'Edge', 'Brave', 'Firefox futuro'],
  componentsPlanned: [
    'CapturedRequestsPanel',
    'BrowserConnectionStatus',
    'RequestImporter',
    'GraphqlCaptureViewer',
  ],
  mvpGoals: [
    'capture fetch',
    'capture XHR',
    'import requests',
    'integração local',
  ],
  deferred: [
    'cloud sync',
    'analytics agressivo',
    'session replay',
    'remote capture',
  ],
  securityNotes: [
    'função local-first',
    'sem cloud obrigatória',
    'sem telemetry invasiva',
  ],
  privacyControls: [
    'domínios monitorados configuráveis',
    'ativação/desativação global da captura',
    'filtros finos sobre tráfego',
  ],
};

@Component({
  selector: 'app-browser-extension-roadmap-page',
  standalone: true,
  templateUrl: './browser-extension-roadmap.component.html',
})
export class BrowserExtensionRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD35_JUNNY_BROWSER_EXTENSION_REQUEST_CAPTURE.md';

  private readonly apiRoadmap = signal<BrowserExtensionRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  readonly roadmapView = computed(
    (): BrowserExtensionRoadmapApi =>
      this.apiRoadmap() ?? BROWSER_EXT_ROADMAP_FALLBACK,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<BrowserExtensionRoadmapApi>(
        `${environment.apiOrigin}/api/browser-extension/roadmap`,
      )
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo segue o MD35.',
          ),
      });
  }
}
