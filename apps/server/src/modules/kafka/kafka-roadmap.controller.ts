import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Stub do módulo Kafka (MD13).
 * Endpoints informativos até existir integração real (KafkaJS, etc.).
 */
@ApiTags('kafka')
@Controller('api/kafka')
export class KafkaRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary: 'Roadmap técnico do módulo Kafka (sem cluster ligado)',
  })
  roadmap(): {
    phase: string;
    description: string;
    plannedCapabilities: string[];
    libraryCandidate: string;
    md: string;
  } {
    return {
      phase: 'roadmap',
      description:
        'Workspace Kafka em planeamento — produtor, consumidor, tópicos e stream em tempo real.',
      plannedCapabilities: [
        'cluster-connection',
        'topic-list',
        'producer',
        'consumer-stream',
        'sasl-ssl-auth',
        'environments-variables',
      ],
      libraryCandidate: 'kafkajs',
      md: 'MD13_JUNNY_KAFKA_WORKSPACE_ROADMAP.md',
    };
  }
}
