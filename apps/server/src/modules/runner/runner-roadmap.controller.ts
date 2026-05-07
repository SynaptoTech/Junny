import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Roadmap do Collection / Request Runner (MD23).
 * Sem execução em cadeia persistida nem tabela RunnerExecutions ainda — só contrato.
 */
@ApiTags('runner')
@Controller('api/runner')
export class RunnerRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary:
      'Execução sequencial de collections, timeline e variáveis dinâmicas (stub)',
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    mvpCapabilities: string[];
    uiLayout: string[];
    visualStatus: Record<string, string>;
    executionControls: string[];
    futureFeatures: string[];
    backendLayout: Record<string, string>;
    frontendComponents: readonly string[];
    persistenceFuture: readonly string[];
    deferred: readonly string[];
  } {
    return {
      phase: 'roadmap',
      md: 'MD23_JUNNY_REQUEST_RUNNER.md',
      description:
        'Executar collections inteiras em sequência com timeline, logs e estados visuais; base para chaining de variáveis e testes futuros.',
      mvpCapabilities: [
        'run-collection-sequential',
        'execution-timeline',
        'basic-logs',
        'visual-status-success-running-failed',
        'stop-execution',
      ],
      uiLayout: ['Collection Runner', 'Execution Timeline', 'Logs / Results'],
      visualStatus: {
        success: 'green',
        running: 'blue',
        failed: 'red',
      },
      executionControls: ['run-all', 'stop', 'rerun-failed'],
      futureFeatures: [
        'chaining-response-to-next-request',
        'dynamic-vars-authToken-response-fields',
        'delay-wait-ms',
        'conditions-if-status',
        'assertions-expect-status',
        'runtime-vars-timestamp-random',
        'workflows-loops-schedules',
      ],
      backendLayout: {
        module: '/modules/runner',
        services: '/modules/runner/services',
        executors: '/modules/runner/executors',
        dto: '/modules/runner/dto',
      },
      frontendComponents: [
        'CollectionRunner',
        'RunnerTimeline',
        'RunnerLogs',
        'ExecutionStatus',
        'RunnerToolbar',
      ],
      persistenceFuture: ['runner-executions-table', 'stored-runs-logs'],
      deferred: [
        'cron-jobs',
        'distributed-execution',
        'cloud-runners',
        'ai-workflows',
      ],
    };
  }
}
