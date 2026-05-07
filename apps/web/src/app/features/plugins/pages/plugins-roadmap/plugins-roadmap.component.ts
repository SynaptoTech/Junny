import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { JUNNY_PLUGIN_API_VERSION, MD19_REFERENCE } from '@junny/plugin-sdk';
import { environment } from '../../../../core/environments/environment';

@Component({
  selector: 'app-plugins-roadmap-page',
  standalone: true,
  templateUrl: './plugins-roadmap.component.html',
})
export class PluginsRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = MD19_REFERENCE;
  readonly pluginSdkVersion = JUNNY_PLUGIN_API_VERSION;

  readonly apiRoadmap = signal<{
    phase: string;
    pluginApiVersion: string;
    sdkPackage: string;
    pluginKinds: string[];
    plannedCapabilities: string[];
  } | null>(null);
  readonly apiError = signal<string | null>(null);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<{
        phase: string;
        pluginApiVersion: string;
        sdkPackage: string;
        pluginKinds: string[];
        plannedCapabilities: string[];
      }>(`${environment.apiOrigin}/api/plugins/roadmap`)
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático desta página mantém-se válido.',
          ),
      });
  }
}
