export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type AuthType = 'none' | 'bearer' | 'basic' | 'apiKey';

/** Espelha RequestAuthDto / Auth na stack REST–GraphQL–SOAP. */
export interface RequestAuthConfig {
  type: AuthType;
  bearerToken?: string;
  basicUsername?: string;
  basicPassword?: string;
  apiKeyValue?: string;
  apiKeyAddTo?: 'header' | 'query';
  apiKeyName?: string;
}

export function defaultAuth(): RequestAuthConfig {
  return { type: 'none' };
}

export interface KeyValueRow {
  key: string;
  value: string;
}

/** Pedido já persistido no backend (raiz ou numa collection). */
export interface LinkedStoredRef {
  requestId: string;
  /** `null` = raiz (sem collection) */
  collectionId: string | null;
}

export interface WorkspaceTabState {
  id: string;
  title: string;
  method: HttpMethod;
  url: string;
  headerRows: KeyValueRow[];
  paramRows: KeyValueRow[];
  bodyText: string;
  auth: RequestAuthConfig;
  linkedStored?: LinkedStoredRef;
  /** Último conteúdo considerado “guardado” localmente / no servidor. */
  savedFingerprint: string;
}

export interface RestExecuteResponse {
  success: boolean;
  status: number;
  duration: number;
  headers: Record<string, string>;
  data: unknown;
}
