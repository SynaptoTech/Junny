import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { environment } from '../../../../core/environments/environment';

export interface StreamingRoadmapApi {
  phase: string;
  md: string;
  description: string;
  strategicGoal: string;
  protocolsFuture: readonly string[];
  plannedLayout: readonly string[];
  messageFields: readonly string[];
  filtersFuture: readonly string[];
  notInitially: readonly string[];
  mvpGoals: readonly string[];
  uxRequirements: readonly string[];
  frontendStructure: string;
  backendLayout: {
    moduleRoot: string;
    consumers: string;
    producers: string;
    inspectors: string;
  };
}

const STREAMING_ROADMAP_FALLBACK: StreamingRoadmapApi = {
  phase: 'roadmap',
  md: 'MD46_JUNNY_EVENT_STREAMING_STUDIO.md',
  description:
    'Roadmap para um Event Streaming Studio (Kafka primeiro) com stream em tempo real, inspeção de payload e filtros — foco enterprise, integrações realtime e observabilidade de eventos.',
  strategicGoal: 'plataforma moderna para integrações realtime event-driven',
  protocolsFuture: ['Kafka', 'RabbitMQ', 'Redis Streams', 'NATS', 'MQTT (futuro)'],
  plannedLayout: ['Topics / Streams', 'Realtime Messages', 'Payload Inspector'],
  messageFields: ['payload', 'timestamp', 'topic', 'partition', 'offset'],
  filtersFuture: ['topic', 'key', 'payload', 'regex', 'timestamp'],
  notInitially: [
    'distributed tracing',
    'enterprise Kafka management',
    'cloud streaming mandatory',
    'AI stream analysis',
  ],
  mvpGoals: ['Kafka consume', 'realtime messages', 'payload viewer', 'stream filters'],
  uxRequirements: [
    'extremamente visual',
    'moderna',
    'fluida',
    'profissional',
    'dark-first',
  ],
  frontendStructure: '/features/streaming',
  backendLayout: {
    moduleRoot: '/modules/streaming',
    consumers: '/modules/streaming/consumers',
    producers: '/modules/streaming/producers',
    inspectors: '/modules/streaming/inspectors',
  },
};

@Component({
  selector: 'app-streaming-roadmap-page',
  standalone: true,
  templateUrl: './streaming-roadmap.component.html',
})
export class StreamingRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD46_JUNNY_EVENT_STREAMING_STUDIO.md';

  private readonly apiRoadmap = signal<StreamingRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  readonly roadmapView = computed(
    (): StreamingRoadmapApi => this.apiRoadmap() ?? STREAMING_ROADMAP_FALLBACK,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<StreamingRoadmapApi>(`${environment.apiOrigin}/api/streaming/roadmap`)
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo segue o MD46.',
          ),
      });
  }
}
