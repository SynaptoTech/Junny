import type { KeyValueRow, RequestAuthConfig } from '../../requests/models/workspace.models';
import { authPayload } from '../../requests/utils/request-auth.utils';

function rowsToRecord(rows: KeyValueRow[]): Record<string, string> {
  const o: Record<string, string> = {};
  for (const r of rows) {
    if (r.key.trim()) o[r.key.trim()] = r.value;
  }
  return o;
}

/** Mescla headers manuais com auth (Bearer/Basic/API key em header). */
export function buildWsHandshakeHeaders(
  rows: KeyValueRow[],
  auth: RequestAuthConfig,
): Record<string, string> {
  const h = { ...rowsToRecord(rows) };
  const a = authPayload(auth);
  if (!a) return h;
  switch (a.type) {
    case 'bearer':
      if (a.bearerToken?.trim()) {
        h['Authorization'] = `Bearer ${a.bearerToken}`;
      }
      break;
    case 'basic':
      if (a.basicUsername?.trim() && a.basicPassword !== undefined) {
        const b64 = btoa(`${a.basicUsername}:${a.basicPassword}`);
        h['Authorization'] = `Basic ${b64}`;
      }
      break;
    case 'apiKey':
      if (a.apiKeyValue?.trim() && (a.apiKeyAddTo ?? 'header') === 'header') {
        const name = a.apiKeyName?.trim() || 'x-api-key';
        h[name] = a.apiKeyValue ?? '';
      }
      break;
    default:
      break;
  }
  return h;
}
