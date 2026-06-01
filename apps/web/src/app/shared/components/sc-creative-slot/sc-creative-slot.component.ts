import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  isDevMode,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { ScCreativeService } from '../../../core/creative/sc-creative.service';
import {
  JUNNY_SC_SITE_KEY,
  creativeFormatForJunnyPlacement,
} from '../../../core/creative/junny-creative-placements';
import { fallbackForJunnyPlacement } from '../../../core/creative/sc-creative-fallback.data';

const FALLBACK_MS = 3200;

@Component({
  selector: 'app-sc-creative-slot',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="sc-creative-wrap">
      <div
        #host
        class="sc-creative-host"
        [attr.data-sc-site]="siteKey"
        [attr.data-sc-placement]="placementKey"
        [attr.data-sc-format]="format"
        [attr.data-sc-theme]="theme"
      ></div>
      @if (showFallback && fallback) {
        <div class="sc-ad-wrap sc-ad-wrap--fallback">
          <div class="sc-ad sc-ad-native_card sc-ad-theme-dark">
            <span class="sc-ad-label">Parceiro Synapto</span>
            <span class="sc-ad-title">{{ fallback.title }}</span>
            @if (fallback.description) {
              <span class="sc-ad-desc">{{ fallback.description }}</span>
            }
            <a
              class="sc-ad-cta"
              [href]="fallback.targetUrl"
              target="_blank"
              rel="noopener sponsored"
              >{{ fallback.ctaLabel }} →</a
            >
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .sc-creative-wrap {
        display: block;
        width: 100%;
      }
      .sc-creative-host {
        display: block;
        min-height: 0;
      }
      .sc-creative-host:empty {
        display: none;
      }
      :host ::ng-deep .sc-ad-wrap a.sc-ad,
      :host ::ng-deep .sc-ad-wrap a.sc-ad:hover,
      :host ::ng-deep .sc-ad-wrap .sc-ad-label,
      :host ::ng-deep .sc-ad-wrap .sc-ad-title,
      :host ::ng-deep .sc-ad-wrap .sc-ad-desc,
      :host ::ng-deep .sc-ad-wrap a.sc-ad-cta,
      :host ::ng-deep .sc-ad-wrap a.sc-ad-cta:hover {
        text-decoration: none !important;
      }
      :host ::ng-deep .sc-ad-wrap .sc-ad {
        pointer-events: none;
      }
      :host ::ng-deep .sc-ad-wrap a.sc-ad-cta {
        pointer-events: auto;
        cursor: pointer;
      }
    `,
  ],
})
export class ScCreativeSlotComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) placement!: string;
  @Input() siteKey = JUNNY_SC_SITE_KEY;
  @Input() theme = 'dark';

  @ViewChild('host') hostRef?: ElementRef<HTMLElement>;

  placementKey = '';
  format: 'banner' | 'native_card' = 'native_card';
  showFallback = false;
  fallback: ReturnType<typeof fallbackForJunnyPlacement> = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private observer: MutationObserver | null = null;

  constructor(private readonly sc: ScCreativeService) {}

  ngAfterViewInit(): void {
    this.placementKey = this.sc.mapPlacement(this.placement);
    this.format = creativeFormatForJunnyPlacement(this.placement);
    this.fallback = fallbackForJunnyPlacement(this.placementKey);
    void this.sc.ensureLoaded().then(() => {
      this.sc.refreshSlots();
      this.scheduleFallbackCheck();
      this.watchHost();
    });
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
    this.observer?.disconnect();
  }

  private scheduleFallbackCheck(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.evaluateFallback(), FALLBACK_MS);
  }

  private watchHost(): void {
    const el = this.hostRef?.nativeElement;
    if (!el || typeof MutationObserver === 'undefined') return;
    this.observer = new MutationObserver(() => {
      if (
        el.getAttribute('data-sc-loaded') === '1' ||
        el.querySelector('.sc-ad-wrap')
      ) {
        this.normalizeSdkMarkup(el);
      }
      if (el.getAttribute('data-sc-loaded') === '1') {
        this.showFallback = false;
        if (this.timer) clearTimeout(this.timer);
      }
    });
    this.observer.observe(el, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  }

  private normalizeSdkMarkup(host: HTMLElement): void {
    const legacyCard = host.querySelector('a.sc-ad') as HTMLAnchorElement | null;
    if (legacyCard && !legacyCard.dataset['scClickGuard']) {
      legacyCard.dataset['scClickGuard'] = '1';
      legacyCard.addEventListener(
        'click',
        (ev) => {
          const target = ev.target as Element | null;
          if (!target?.closest('.sc-ad-cta')) {
            ev.preventDefault();
            ev.stopPropagation();
          }
        },
        true,
      );
    }
  }

  private evaluateFallback(): void {
    const el = this.hostRef?.nativeElement;
    if (!el) return;
    const loaded =
      el.getAttribute('data-sc-loaded') === '1' || el.childElementCount > 0;
    if (!loaded && this.fallback) {
      this.showFallback = true;
      if (isDevMode()) {
        console.warn(
          '[Synapto Creative] fallback exibido para placement:',
          this.placementKey,
        );
      }
    }
  }
}
