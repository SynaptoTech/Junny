import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { environment } from '../../../../core/environments/environment';

/**
 * MD60 — docker dev stability:
 * Evita depender do package workspace `@junny/ui` em runtime do `ng serve` no container.
 * (O build de produção continua ok; estes tokens são apenas para esta página de documentação interna.)
 */
const MD14_REFERENCE = 'MD14_JUNNY_UI_UX_DESIGN_SYSTEM.md' as const;
const junnySpacingScale = [4, 8, 12, 16, 24, 32, 48, 64] as const;
const junnyRadius = { standard: '12px', large: '16px' } as const;
const junnyStatusColors = {
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#38BDF8',
} as const;
const junnyTypography = { primary: 'Inter', alternative: 'Geist' } as const;
const junnyUxInspirations = ['Linear', 'Raycast', 'Vercel', 'Supabase'] as const;
const junnyComponentCatalog = ['Button', 'Card', 'Input', 'Tabs', 'Sidebar', 'Navbar'] as const;
const junnyUxPrinciples = ['Developer-first', 'Dark-first', 'Less noise'] as const;
const junnyDesignSystemDeferred = ['theme editor', 'visual builder'] as const;

@Component({
  selector: 'app-design-system-page',
  standalone: true,
  templateUrl: './design-system-page.component.html',
})
export class DesignSystemPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = MD14_REFERENCE;
  readonly spacingScale = junnySpacingScale;
  readonly radius = junnyRadius;
  readonly statusColors = junnyStatusColors;
  readonly typography = junnyTypography;
  readonly catalog = junnyComponentCatalog;
  readonly inspirations = junnyUxInspirations;
  readonly principles = junnyUxPrinciples;
  readonly deferred = junnyDesignSystemDeferred;

  readonly apiRoadmap = signal<{
    phase: string;
    theme: string;
    philosophy: string[];
  } | null>(null);
  readonly apiError = signal<string | null>(null);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<{
        phase: string;
        theme: string;
        philosophy: string[];
      }>(`${environment.apiOrigin}/api/design-system/roadmap`)
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — tokens da biblioteca @junny/ui e tema Tailwind abaixo mantêm-se válidos.',
          ),
      });
  }
}
