import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Roadmap desktop nativo via Tauri (MD28). Web-first hoje; empacotamento depois.
 */
@ApiTags('desktop')
@Controller('api/desktop')
export class DesktopRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary: 'Estratégia desktop Tauri, distribuição e runtime local (stub)',
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    strategy: readonly string[];
    tauriBenefits: readonly string[];
    avoidInitially: readonly string[];
    targetPlatforms: readonly string[];
    distroFormatsFuture: readonly string[];
    appStructure: string;
    stackFlow: readonly string[];
    mvpDesktopFuture: readonly string[];
    deepLinkFuture: string;
    deferred: readonly string[];
    futureFeatures: readonly string[];
  } {
    return {
      phase: 'roadmap',
      md: 'MD28_JUNNY_NATIVE_DESKTOP_STRATEGY.md',
      description:
        'Web-first no browser e localhost; segunda fase desktop com Tauri (não Electron): shell leve, Angular reutilizável, runtime e DB locais, installers e secure storage com integração OS.',
      strategy: ['web-first', 'desktop-second-tauri', 'offline-capable', 'dark-first'],
      tauriBenefits: [
        'lower-ram-footprint',
        'smaller-binary',
        'better-perceived-performance',
        'optional-rust-extensions',
        'strong-security-model',
      ],
      avoidInitially: ['electron', 'mobile-app', 'desktop-marketplace-only', 'cloud-only-mode'],
      targetPlatforms: ['windows', 'linux', 'macos'],
      distroFormatsFuture: ['exe', 'dmg', 'deb', 'AppImage'],
      appStructure: '/apps/desktop',
      stackFlow: ['angular-frontend', 'tauri-shell', 'local-runtime'],
      mvpDesktopFuture: [
        'tauri-app-shell',
        'local-runtime-autostart-optional',
        'installers-ci',
        'secure-storage-keychain',
      ],
      deepLinkFuture: 'junny://',
      deferred: [
        'aggressive-auto-update-default',
        'realtime-mobile-clients',
      ],
      futureFeatures: [
        'tauri-commands-filesystem-secrets',
        'native-notifications-tray',
        'filesystem-watchers',
        'github-releases-update-channels',
      ],
    };
  }
}
