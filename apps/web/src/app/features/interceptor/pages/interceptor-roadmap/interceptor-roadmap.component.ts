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

export interface InterceptorRoadmapApi {
  phase: string;
  md: string;
  description: string;
  strategicGoals: readonly string[];
  inspirations: readonly string[];
  mainFlowSteps: readonly string[];
  capturedTrafficFields: readonly string[];
  protocolsFuture: readonly string[];
  proxyPortExample: string;
  backendLayout: {
    moduleRoot: string;
    proxy: string;
    capture: string;
    inspectors: string;
  };
  mvpGoals: readonly string[];
  deferred: readonly string[];
  securityNotes: readonly string[];
  frontendStructure: string;
}

const INTERCEPTOR_ROADMAP_FALLBACK: InterceptorRoadmapApi = {
  phase: 'roadmap',
  md: 'MD34_JUNNY_TRAFFIC_INTERCEPTOR_HTTP_INSPECTOR.md',
  description:
    'Roadmap para proxy/captura HTTP local-first, inspectors de request/response e replay básico — integrável ao client e observabilidade; tráfego permanece na máquina do utilizador, sem envio automático nem cloud proxy na v0.',
  strategicGoals: [
    'plataforma completa debugging APIs',
    'unificar API Client, Inspector, Monitoring e debugging num único produto local-first',
    'diferenciar Junny de clientes apenas HTTP tradicionais',
  ],
  inspirations: ['Charles Proxy', 'Fiddler', 'Burp Suite', 'HTTP Toolkit'],
  mainFlowSteps: [
    'iniciar proxy local',
    'configurar proxy sistema/browser',
    'capturar tráfego pelo Junny',
    'requests em tempo quasi-real na timeline',
  ],
  capturedTrafficFields: [
    'method',
    'URL',
    'headers',
    'body',
    'response',
    'status',
    'duration',
  ],
  protocolsFuture: ['HTTP', 'HTTPS', 'WebSocket', 'GraphQL'],
  proxyPortExample: 'localhost:8888',
  backendLayout: {
    moduleRoot: '/modules/interceptor',
    proxy: '/modules/interceptor/proxy',
    capture: '/modules/interceptor/capture',
    inspectors: '/modules/interceptor/inspectors',
  },
  mvpGoals: [
    'HTTP capture',
    'request inspector',
    'response inspector',
    'replay básico',
  ],
  deferred: [
    'MITM avançado',
    'distributed interception',
    'cloud proxy',
    'telemetry automática',
  ],
  securityNotes: [
    'tráfego capturado permanece local',
    'nunca enviado automaticamente para terceiros',
    'privacy-first · controlo total do utilizador',
  ],
  frontendStructure: '/features/interceptor',
};

@Component({
  selector: 'app-interceptor-roadmap-page',
  standalone: true,
  templateUrl: './interceptor-roadmap.component.html',
})
export class InterceptorRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD34_JUNNY_TRAFFIC_INTERCEPTOR_HTTP_INSPECTOR.md';

  private readonly apiRoadmap = signal<InterceptorRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  readonly roadmapView = computed(
    (): InterceptorRoadmapApi =>
      this.apiRoadmap() ?? INTERCEPTOR_ROADMAP_FALLBACK,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<InterceptorRoadmapApi>(
        `${environment.apiOrigin}/api/interceptor/roadmap`,
      )
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo segue o MD34.',
          ),
      });
  }
}
