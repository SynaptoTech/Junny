import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Stub do workspace gRPC (MD21).
 * Sem cliente gRPC nem reflection — apenas roadmap até existir MVP (import proto, explorer, unary).
 */
@ApiTags('grpc')
@Controller('api/grpc')
export class GrpcRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary: 'Roadmap técnico do workspace gRPC (sem execução de RPC)',
  })
  roadmap(): {
    phase: string;
    description: string;
    md: string;
    urls: readonly string[];
    libraryCandidates: string[];
    plannedCapabilities: string[];
    futureStreaming: readonly string[];
    deferred: readonly string[];
    frontendComponents: readonly string[];
    backendFolders: Record<string, string>;
  } {
    return {
      phase: 'roadmap',
      description:
        'Workspace gRPC com import .proto, explorer de services/métodos e execução unary; streaming e reflection em fases posteriores.',
      md: 'MD21_JUNNY_GRPC_WORKSPACE.md',
      urls: ['grpc://', 'grpcs://'],
      libraryCandidates: ['@grpc/grpc-js', 'protobufjs'],
      plannedCapabilities: [
        'protobuf-import-dot-proto',
        'proto-explorer-packages-services-methods',
        'unary-rpc-call',
        'json-payload-editor',
        'response-viewer-metadata-status',
        'metadata-auth-tokens',
        'collections-grpc-requests',
        'environments-grpc-host-variables',
      ],
      futureStreaming: [
        'server-streaming',
        'client-streaming',
        'bidi-streaming',
        'streaming-viewer',
      ],
      deferred: ['grpc-web', 'proto-marketplace', 'ai-grpc-generation', 'grpc-full-observability'],
      frontendComponents: [
        'ProtoExplorer',
        'GrpcMethodSelector',
        'GrpcPayloadEditor',
        'GrpcResponseViewer',
        'GrpcToolbar',
      ],
      backendFolders: {
        module: '/modules/grpc',
        services: '/modules/grpc/services',
        clients: '/modules/grpc/clients',
        proto: '/modules/grpc/proto',
      },
    };
  }
}
