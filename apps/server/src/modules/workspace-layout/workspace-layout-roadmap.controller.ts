import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Roadmap do sistema de layout do workspace (MD27).
 * Sem split panels reais nem motor de docking neste stub.
 */
@ApiTags('workspace-layout')
@Controller('api/workspace-layout')
export class WorkspaceLayoutRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary:
      'Painéis, splits, tabs e presets de produtividade (stub arquitetural)',
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    layoutViewsInitial: readonly string[];
    layoutViewsEvolved: readonly string[];
    presets: Record<string, string>;
    mvpCapabilities: readonly string[];
    frontendComponents: readonly string[];
    persistenceInitial: readonly string[];
    shortcutsFuture: readonly string[];
    multiProtocolTargets: readonly string[];
    deferred: readonly string[];
    futureFeatures: readonly string[];
    frontendStructure: string;
  } {
    return {
      phase: 'roadmap',
      md: 'MD27_JUNNY_WORKSPACE_LAYOUT_SYSTEM.md',
      description:
        'Evoluir de Sidebar | Request | Response para layouts com logs, splits aninhados, tabs com reorder, presets (Minimal/Developer/Advanced) e persistência inicial em localStorage — sensação premium, dark-first.',
      layoutViewsInitial: ['sidebar', 'request', 'response'],
      layoutViewsEvolved: ['sidebar', 'request', 'response', 'logs'],
      presets: {
        minimal: 'Sidebar + Request',
        developer: 'Sidebar + Request + Response',
        advanced: 'Sidebar + Request + Response + Logs',
      },
      mvpCapabilities: [
        'basic-split-panels',
        'drag-resize-collapse',
        'multi-tabs-reorder',
        'layout-persistence-localstorage',
        'smooth-resize-tab-animations',
      ],
      frontendComponents: [
        'WorkspaceLayout',
        'SplitPanel',
        'ResizeHandler',
        'TabManager',
        'WorkspaceToolbar',
      ],
      persistenceInitial: [
        'open-tabs',
        'panel-sizes',
        'current-layout',
        'last-workspace',
      ],
      shortcutsFuture: ['ctrl+t', 'ctrl+w', 'ctrl-shift-p'],
      multiProtocolTargets: [
        'rest',
        'graphql',
        'soap',
        'websocket',
        'kafka',
        'grpc',
      ],
      deferred: [
        'real-multi-window-popout',
        'cloud-hosted-layout-presets-default',
        'collaborative-shared-cursors-layout',
        'detachable-floating-panels',
      ],
      futureFeatures: [
        'command-palette-quick-actions',
        'multi-monitor-detachable-windows',
        'workspace-templates',
        'ai-layout-suggestions',
      ],
      frontendStructure: '/features/workspace',
    };
  }
}
