import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';

export type WorkspaceNavLink = { label: string; href: string };

export type WorkspaceNavMenu = {
  id: string;
  label: string;
  links: WorkspaceNavLink[];
};

const MENUS: WorkspaceNavMenu[] = [
  {
    id: 'protocols',
    label: 'Protocols',
    links: [
      { label: 'REST', href: '/app' },
      { label: 'GraphQL', href: '/app/graphql' },
      { label: 'SOAP', href: '/app/soap' },
      { label: 'WebSocket', href: '/app/websocket' },
      { label: 'Kafka', href: '/app/kafka' },
      { label: 'gRPC', href: '/app/grpc' },
    ],
  },
  {
    id: 'studio',
    label: 'Studio',
    links: [
      { label: 'Plugins', href: '/app/plugins' },
      { label: 'AI', href: '/app/ai' },
      { label: 'cURL+', href: '/app/codegen' },
      { label: 'Runner', href: '/app/runner' },
      { label: 'Mock', href: '/app/mock' },
      { label: 'Security', href: '/app/security' },
      { label: 'Sync', href: '/app/sync' },
      { label: 'Diff', href: '/app/diff' },
      { label: 'Traffic', href: '/app/interceptor' },
    ],
  },
  {
    id: 'ai',
    label: 'AI & docs',
    links: [
      { label: 'AI generator', href: '/app/ai-generator' },
      { label: 'AI analyzer', href: '/app/ai-analyzer' },
      { label: 'Workflows', href: '/app/workflows' },
      { label: 'AI docs', href: '/app/ai-docs' },
      { label: 'OpenAPI spec', href: '/app/ai-openapi' },
    ],
  },
  {
    id: 'platform',
    label: 'Platform',
    links: [
      { label: 'Layout', href: '/app/workspace-layout' },
      { label: 'Desktop', href: '/app/desktop' },
      { label: 'Team', href: '/app/team' },
      { label: 'Extension', href: '/app/browser-extension' },
      { label: 'Official roadmap', href: '/app/official' },
      { label: 'Monitor', href: '/app/monitoring' },
      { label: 'Contracts', href: '/app/contracts' },
      { label: 'Marketplace', href: '/app/marketplace' },
      { label: 'Enterprise', href: '/app/enterprise' },
      { label: 'Profiler', href: '/app/profiler' },
      { label: 'Observability', href: '/app/observability' },
      { label: 'Vault', href: '/app/vault' },
      { label: 'Streaming', href: '/app/streaming' },
      { label: 'Git native', href: '/app/git' },
      { label: 'SDK', href: '/app/sdk' },
    ],
  },
];

@Component({
  selector: 'app-workspace-app-header',
  standalone: true,
  imports: [NgClass],
  templateUrl: './workspace-app-header.component.html',
})
export class WorkspaceAppHeaderComponent {
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly auth = inject(AuthService);

  /** Label do workspace atual (ex.: "REST workspace"). */
  readonly contextLabel = input<string | null>(null);

  readonly showImportOpenApi = input(false);

  readonly importOpenApi = output<void>();

  readonly menus = MENUS;

  readonly openId = signal<string | null>(null);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  path(): string {
    return this.url().split('?')[0];
  }

  linkActive(href: string): boolean {
    const p = this.path();
    if (href === '/app') return p === '/app' || p === '/app/';
    return p === href || p.startsWith(`${href}/`);
  }

  menuHasActive(links: WorkspaceNavLink[]): boolean {
    return links.some((l) => this.linkActive(l.href));
  }

  toggleMenu(id: string, ev: Event): void {
    ev.preventDefault();
    ev.stopPropagation();
    this.openId.update((cur) => (cur === id ? null : id));
  }

  closeMenus(): void {
    this.openId.set(null);
  }

  onImportClick(ev: Event): void {
    ev.preventDefault();
    ev.stopPropagation();
    this.importOpenApi.emit();
  }

  logout(): void {
    this.closeMenus();
    this.auth.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: MouseEvent): void {
    if (!this.host.nativeElement.contains(ev.target as Node)) {
      this.openId.set(null);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.openId.set(null);
  }
}
