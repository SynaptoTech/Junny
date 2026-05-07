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
    description: 'XML, envelopes SOAP, headers e resposta com indentação no workspace.',
    status: 'available',
  },
  {
    id: 'graphql',
    title: 'GraphQL',
    description: 'Queries, mutations e schema introspection.',
    status: 'available',
  },
  {
    id: 'kafka',
    title: 'Kafka',
    description:
      'Streaming e tópicos; veja a página /app/kafka para o plano.',
    status: 'planned',
  },
  {
    id: 'websocket',
    title: 'WebSocket',
    description: 'Conexões persistentes e mensagens em tempo real.',
    status: 'available',
  },
  {
    id: 'grpc',
    title: 'gRPC',
    description:
      'Protobuf, explorer e unary; veja a página /app/grpc. Contratos e microserviços.',
    status: 'coming',
  },
] as const;
