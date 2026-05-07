import type { RequestAuthConfig } from '../models/workspace.models';
import { defaultAuth } from '../models/workspace.models';

/** Payload para o proxy: omitir quando não há auth efetiva. */
export function authPayload(
  a?: RequestAuthConfig,
): RequestAuthConfig | undefined {
  if (!a || a.type === 'none') return undefined;
  return a;
}

export function parseAuthFromUnknown(
  raw: unknown,
): RequestAuthConfig | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const o = raw as Record<string, unknown>;
  const t = o['type'];
  if (t !== 'none' && t !== 'bearer' && t !== 'basic' && t !== 'apiKey') {
    return undefined;
  }
  return {
    type: t,
    bearerToken:
      typeof o['bearerToken'] === 'string' ? o['bearerToken'] : undefined,
    basicUsername:
      typeof o['basicUsername'] === 'string' ? o['basicUsername'] : undefined,
    basicPassword:
      typeof o['basicPassword'] === 'string' ? o['basicPassword'] : undefined,
    apiKeyValue:
      typeof o['apiKeyValue'] === 'string' ? o['apiKeyValue'] : undefined,
    apiKeyAddTo:
      o['apiKeyAddTo'] === 'header' || o['apiKeyAddTo'] === 'query'
        ? o['apiKeyAddTo']
        : undefined,
    apiKeyName:
      typeof o['apiKeyName'] === 'string' ? o['apiKeyName'] : undefined,
  };
}

/** Histórico pode ter segredos redatados — preservar tipo, limpar segredos marcados. */
export function normalizeHistoryAuth(
  parsed: RequestAuthConfig | undefined,
): RequestAuthConfig {
  if (!parsed) return defaultAuth();
  const redacted = (v: string | undefined) =>
    v === '[redacted]' ? '' : v ?? '';
  return {
    ...parsed,
    bearerToken: redacted(parsed.bearerToken),
    basicPassword: redacted(parsed.basicPassword),
    apiKeyValue: redacted(parsed.apiKeyValue),
  };
}
