import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  computed,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith, Subscription } from 'rxjs';
import { PROTOCOL_ITEMS } from '../../core/constants/protocols.data';
import type { LocaleId } from '../../core/i18n/supported-locales';
import { getLandingCopy } from '../../core/i18n/landing.copy';
import { resolveLocaleIdFromUrl } from '../../core/i18n/resolve-locale';
import { FooterComponent } from '../../layout/footer/footer.component';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { ProtocolCardComponent } from '../../shared/components/protocol-card/protocol-card.component';
import { SectionComponent } from '../../shared/components/section/section.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [NavbarComponent, SectionComponent, ProtocolCardComponent, FooterComponent],
  templateUrl: './landing.component.html',
})
export class LandingPageComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private io: IntersectionObserver | null = null;
  private readonly subs = new Subscription();

  readonly protocols = PROTOCOL_ITEMS;

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly localeId = computed<LocaleId>(() => resolveLocaleIdFromUrl(this.url()));
  readonly copy = computed(() => getLandingCopy(this.localeId()));

  /** MD60 — move full navigation out of the navbar (premium, less noise). */
  readonly exploreGroups = computed(() => {
    const locale = this.localeId();
    if (locale === 'pt-br') {
      return [
        {
          title: 'Base',
          items: [
            { title: 'Workspace', subtitle: 'REST · GraphQL · SOAP · WebSocket', href: '/app' },
            { title: 'Roadmap oficial', subtitle: 'Fases & visão consolidada', href: '/app/official' },
            { title: 'Documentação', subtitle: 'Getting started, guias & referência', href: '/docs/getting-started/' },
          ],
        },
        {
          title: 'Dev experience',
          items: [
            { title: 'Design system', subtitle: 'Tokens & princípios UI/UX', href: '/app/design-system' },
            { title: 'Plugins', subtitle: 'Extensões & marketplace', href: '/app/plugins' },
            { title: 'SDK', subtitle: 'Roadmap da plataforma dev', href: '/app/sdk' },
          ],
        },
        {
          title: 'Capacidades',
          items: [
            { title: 'Observability', subtitle: 'Dashboard realtime & traffic', href: '/app/observability' },
            { title: 'Monitoring', subtitle: 'Uptime · health · alertas', href: '/app/monitoring' },
            { title: 'Workflows', subtitle: 'Automação & chaining', href: '/app/workflows' },
            { title: 'Streaming', subtitle: 'Event streaming studio', href: '/app/streaming' },
          ],
        },
        {
          title: 'Confiança & enterprise',
          items: [
            { title: 'Security', subtitle: 'Secrets & arquitetura', href: '/app/security' },
            { title: 'Vault', subtitle: 'Roadmap do vault', href: '/app/vault' },
            { title: 'Enterprise', subtitle: 'Self-hosted & governança', href: '/app/enterprise' },
          ],
        },
      ] as const;
    }
    if (locale === 'es') {
      return [
        {
          title: 'Core',
          items: [
            { title: 'Workspace', subtitle: 'REST · GraphQL · SOAP · WebSocket', href: '/app' },
            { title: 'Roadmap oficial', subtitle: 'Fases y visión consolidada', href: '/app/official' },
            { title: 'Documentación', subtitle: 'Getting started, guías y referencia', href: '/docs/getting-started/' },
          ],
        },
        {
          title: 'Dev experience',
          items: [
            { title: 'Design system', subtitle: 'Tokens y principios UI/UX', href: '/app/design-system' },
            { title: 'Plugins', subtitle: 'Extensiones y marketplace', href: '/app/plugins' },
            { title: 'SDK', subtitle: 'Roadmap de la plataforma dev', href: '/app/sdk' },
          ],
        },
        {
          title: 'Capacidades',
          items: [
            { title: 'Observability', subtitle: 'Dashboard realtime y traffic', href: '/app/observability' },
            { title: 'Monitoring', subtitle: 'Uptime · health · alertas', href: '/app/monitoring' },
            { title: 'Workflows', subtitle: 'Automatización y chaining', href: '/app/workflows' },
            { title: 'Streaming', subtitle: 'Event streaming studio', href: '/app/streaming' },
          ],
        },
        {
          title: 'Confianza y enterprise',
          items: [
            { title: 'Security', subtitle: 'Secrets y arquitectura', href: '/app/security' },
            { title: 'Vault', subtitle: 'Roadmap del vault', href: '/app/vault' },
            { title: 'Enterprise', subtitle: 'Self-hosted y governance', href: '/app/enterprise' },
          ],
        },
      ] as const;
    }
    return [
      {
        title: 'Core',
        items: [
          { title: 'Workspace', subtitle: 'REST · GraphQL · SOAP · WebSocket', href: '/app' },
          { title: 'Official roadmap', subtitle: 'Phases & consolidated vision', href: '/app/official' },
          { title: 'Documentation', subtitle: 'Getting started, guides & reference', href: '/docs/getting-started/' },
        ],
      },
      {
        title: 'Developer experience',
        items: [
          { title: 'Design system', subtitle: 'Tokens & UI/UX principles', href: '/app/design-system' },
          { title: 'Plugins', subtitle: 'Extensions & marketplace', href: '/app/plugins' },
          { title: 'SDK', subtitle: 'Developer platform roadmap', href: '/app/sdk' },
        ],
      },
      {
        title: 'Platform capabilities',
        items: [
          { title: 'Observability', subtitle: 'Realtime dashboard & traffic', href: '/app/observability' },
          { title: 'Monitoring', subtitle: 'Uptime · health · alerts', href: '/app/monitoring' },
          { title: 'Workflows', subtitle: 'Automation & chaining', href: '/app/workflows' },
          { title: 'Streaming', subtitle: 'Event streaming studio', href: '/app/streaming' },
        ],
      },
      {
        title: 'Trust & enterprise',
        items: [
          { title: 'Security', subtitle: 'Secrets & architecture', href: '/app/security' },
          { title: 'Vault', subtitle: 'Secrets vault roadmap', href: '/app/vault' },
          { title: 'Enterprise', subtitle: 'Self-hosted & governance', href: '/app/enterprise' },
        ],
      },
    ] as const;
  });

  /** MD58 — onboarding path: product → docs → install → first request */
  readonly onboardingSteps = computed(() => this.copy().onboarding.steps);

  readonly trustedPlatformCards = [
    {
      title: 'Open source',
      subtitle: 'MIT licensed. Built in public, community-first.',
      accent: 'hover:border-white/20 hover:bg-slate-950/35',
    },
    {
      title: 'Local-first',
      subtitle: 'Runs locally by default. Cloud is optional.',
      accent: 'hover:border-junny-blue/35 hover:bg-junny-blue/5',
    },
    {
      title: 'Privacy-first',
      subtitle: 'AI optional. Explicit opt-in for external providers.',
      accent: 'hover:border-junny-violet/35 hover:bg-junny-violet/5',
    },
    {
      title: 'Enterprise-ready',
      subtitle: 'Vault, governance and self-hosted foundations (optional).',
      accent: 'hover:border-emerald-500/25 hover:bg-emerald-500/5',
    },
  ] as const;

  readonly moreThanCards = [
    {
      title: 'APIs',
      subtitle: 'REST · GraphQL · SOAP · WebSocket · gRPC',
      href: '/app',
      accent: 'hover:border-junny-blue/40 hover:bg-junny-blue/5',
    },
    {
      title: 'Workflows',
      subtitle: 'Automation · chaining · runners',
      href: '/app/workflows',
      accent: 'hover:border-amber-400/40 hover:bg-amber-500/5',
    },
    {
      title: 'Observability',
      subtitle: 'Monitoring · dashboards · traffic inspection',
      href: '/app/observability',
      accent: 'hover:border-blue-500/40 hover:bg-blue-500/5',
    },
    {
      title: 'Event streaming',
      subtitle: 'Kafka · RabbitMQ · realtime streams',
      href: '/app/streaming',
      accent: 'hover:border-teal-500/40 hover:bg-teal-500/5',
    },
    {
      title: 'AI assistant (optional)',
      subtitle: 'Request generation · debugging · documentation',
      href: '/app/ai-docs',
      accent: 'hover:border-violet-500/40 hover:bg-violet-500/5',
    },
    {
      title: 'Git native',
      subtitle: 'Collections versioning · Git workflows',
      href: '/app/git',
      accent: 'hover:border-amber-300/40 hover:bg-amber-400/5',
    },
  ] as const;

  /** MD57 — enterprise trust positioning (landing only; open source remains primary). */
  readonly enterpriseCapabilities = [
    {
      title: 'RBAC',
      subtitle: 'Roles and policies for teams.',
      href: '/app/enterprise',
    },
    {
      title: 'Self-hosted',
      subtitle: 'Docker today · Kubernetes-ready path.',
      href: '/app/enterprise',
    },
    {
      title: 'Monitoring',
      subtitle: 'Health, SLOs and alerts.',
      href: '/app/monitoring',
    },
    {
      title: 'Governance',
      subtitle: 'Contracts, validation, API lifecycle.',
      href: '/app/contracts',
    },
    {
      title: 'Secrets vault',
      subtitle: 'Encrypted secrets and masking.',
      href: '/app/vault',
    },
    {
      title: 'Audit logs',
      subtitle: 'Traceable changes and access.',
      href: '/app/enterprise',
    },
  ] as const;

  readonly enterpriseSecurityTags = [
    'Local-first',
    'Secure by default',
    'Optional cloud',
    'Privacy-first',
  ] as const;

  readonly roadmap = [
    {
      title: 'Available',
      items: ['REST workspace', 'Collections', 'Environments'],
      tone: 'border-emerald-500/20 bg-emerald-950/10',
      dot: 'bg-emerald-400',
    },
    {
      title: 'In progress',
      items: ['GraphQL', 'gRPC', 'Monitoring'],
      tone: 'border-junny-blue/20 bg-sky-950/10',
      dot: 'bg-junny-blue',
    },
    {
      title: 'Planned',
      items: ['Kafka', 'AI workflows', 'Marketplace'],
      tone: 'border-violet-500/20 bg-violet-950/10',
      dot: 'bg-junny-violet',
    },
  ] as const;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return;

    document.documentElement.classList.add('junny-reveal-enabled');

    const run = () => this.setupReveal();
    run();
    // Voltar pra landing via navegação pode recriar DOM sem chamar novamente IO.
    this.subs.add(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(() => {
        if (!document.querySelector('[data-reveal]')) return;
        // aguarda a próxima pintura para pegar o DOM final
        requestAnimationFrame(() => this.setupReveal());
      }),
    );
  }

  private setupReveal(): void {
    if (typeof window === 'undefined') return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (elements.length === 0) return;

    // Primeira dobra: deixa visível sem esperar por IO
    for (const el of elements) {
      el.classList.remove('junny-reveal-pending');
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) el.classList.add('junny-reveal-visible');
    }

    // Só marca "pending" para o que ficou fora da dobra (evita flicker de aparecer→sumir).
    for (const el of elements) {
      if (!el.classList.contains('junny-reveal-visible')) el.classList.add('junny-reveal-pending');
    }

    this.io?.disconnect();
    this.io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const t = e.target as HTMLElement;
          t.classList.add('junny-reveal-visible');
          t.classList.remove('junny-reveal-pending');
          this.io?.unobserve(e.target);
        }
      },
      /* MD59: antecipar pintura próxima à viewport sem animar fora da tela */
      { root: null, threshold: 0.12, rootMargin: '12% 0px -10% 0px' },
    );

    for (const el of elements) this.io.observe(el);

    // Fail-safe: se o IO falhar por qualquer razão, não deixa conteúdo escondido.
    window.setTimeout(() => {
      for (const el of elements) {
        el.classList.add('junny-reveal-visible');
        el.classList.remove('junny-reveal-pending');
      }
    }, 1200);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
    this.io = null;
    this.subs.unsubscribe();
  }
}
