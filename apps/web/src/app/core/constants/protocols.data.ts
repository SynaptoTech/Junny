import type { ProtocolStatus } from '../../shared/models/protocol.model';

export interface ProtocolItem {
  id: string;
  title: string;
  description: string;
  status: ProtocolStatus;
}

/** Ordem alinhada ao roadmap (REST primeiro). */
export const PROTOCOL_ITEMS: readonly ProtocolItem[] = [
  {
    id: 'rest',
    title: 'REST',
    description: 'HTTP/HTTPS, métodos, headers e body com UX focada em velocidade.',
    status: 'available',
  },
  {
    id: 'soap',
    title: 'SOAP',
    description: 'XML, envelopes e contratos — planejado após REST estável.',
    status: 'planned',
  },
  {
    id: 'graphql',
    title: 'GraphQL',
    description: 'Queries, mutations e schema introspection.',
    status: 'planned',
  },
  {
    id: 'kafka',
    title: 'Kafka',
    description: 'Streaming e tópicos para integrações event-driven.',
    status: 'planned',
  },
  {
    id: 'websocket',
    title: 'WebSocket',
    description: 'Conexões persistentes e mensagens em tempo real.',
    status: 'planned',
  },
  {
    id: 'grpc',
    title: 'gRPC',
    description: 'Contratos protobuf e chamadas de alto desempenho.',
    status: 'coming',
  },
] as const;
