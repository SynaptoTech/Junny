import type { KeyValueRow, RequestAuthConfig } from '../../requests/models/workspace.models';

export type WsUiStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error';

export interface WsHandshakePersistence {
  url: string;
  protocolsText: string;
  headerRows: KeyValueRow[];
  auth: RequestAuthConfig;
  sendDraft: string;
}
