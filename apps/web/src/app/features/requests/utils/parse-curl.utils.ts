import { defaultAuth } from '../models/workspace.models';
import type {
  HttpMethod,
  KeyValueRow,
  RequestAuthConfig,
} from '../models/workspace.models';

export interface ParsedCurlRequest {
  method: HttpMethod;
  url: string;
  queryParams: KeyValueRow[];
  headerRows: KeyValueRow[];
  bodyText: string;
  auth: RequestAuthConfig;
}

const HTTP_METHODS: HttpMethod[] = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
];

function isHttpMethod(x: string): x is HttpMethod {
  return (HTTP_METHODS as readonly string[]).includes(x);
}

function mapCurlMethod(m: string): HttpMethod {
  const u = m.toUpperCase();
  if (u === 'HEAD' || u === 'OPTIONS' || u === 'TRACE') return 'GET';
  if (isHttpMethod(u)) return u;
  return 'GET';
}

function normalizeLineContinuations(s: string): string {
  return s.replace(/\r\n/g, '\n').replace(/\\\n[ \t]*/g, ' ');
}

/** Minimal shell-like tokenizer for typical cURL pastes (single or double quotes, escapes in double quotes). */
function shellTokenize(input: string): string[] {
  const out: string[] = [];
  let i = 0;
  const len = input.length;
  while (i < len) {
    while (i < len && /\s/.test(input[i] ?? ' ')) i++;
    if (i >= len) break;
    const c = input[i];
    if (c === '"' || c === "'") {
      const q = c;
      i++;
      let s = '';
      while (i < len && input[i] !== q) {
        if (q === '"' && input[i] === '\\' && i + 1 < len) {
          s += input[i + 1] ?? '';
          i += 2;
          continue;
        }
        s += input[i] ?? '';
        i++;
      }
      if (i < len && input[i] === q) i++;
      out.push(s);
    } else {
      let s = '';
      while (i < len && !/\s/.test(input[i] ?? '')) {
        if (input[i] === '\\' && i + 1 < len) {
          s += input[i + 1] ?? '';
          i += 2;
          continue;
        }
        s += input[i] ?? '';
        i++;
      }
      out.push(s);
    }
  }
  return out;
}

function splitHeader(h: string): KeyValueRow | null {
  const idx = h.indexOf(':');
  if (idx <= 0) return null;
  const key = h.slice(0, idx).trim();
  const value = h.slice(idx + 1).trim();
  if (!key) return null;
  return { key, value };
}

function urlLooksLike(u: string): boolean {
  return /^https?:\/\//i.test(u);
}

function decodeBasicUserPass(b64: string): { user: string; pass: string } | null {
  try {
    if (typeof atob !== 'function') return null;
    const decoded = atob(b64.trim());
    const c = decoded.indexOf(':');
    if (c < 0) return { user: decoded, pass: '' };
    return { user: decoded.slice(0, c), pass: decoded.slice(c + 1) };
  } catch {
    return null;
  }
}

function emptyParamRow(): KeyValueRow[] {
  return [{ key: '', value: '' }];
}

function queryFromUrl(fullUrl: string): {
  baseUrl: string;
  params: KeyValueRow[];
} {
  try {
    const u = new URL(fullUrl);
    const params: KeyValueRow[] = [];
    u.searchParams.forEach((value, key) => {
      params.push({ key, value });
    });
    u.search = '';
    return {
      baseUrl: u.toString(),
      params: params.length ? params : emptyParamRow(),
    };
  } catch {
    const q = fullUrl.indexOf('?');
    if (q === -1) return { baseUrl: fullUrl, params: emptyParamRow() };
    const baseUrl = fullUrl.slice(0, q);
    const qs = fullUrl.slice(q + 1);
    const params: KeyValueRow[] = [];
    for (const pair of qs.split('&')) {
      if (!pair) continue;
      const eq = pair.indexOf('=');
      if (eq === -1) params.push({ key: decodeURIComponent(pair), value: '' });
      else {
        params.push({
          key: decodeURIComponent(pair.slice(0, eq)),
          value: decodeURIComponent(pair.slice(eq + 1)),
        });
      }
    }
    return { baseUrl, params: params.length ? params : emptyParamRow() };
  }
}

/**
 * Returns a filled request if `raw` looks like a curl command; otherwise `null`.
 */
export function tryParseCurlCommand(raw: string): ParsedCurlRequest | null {
  const normalized = normalizeLineContinuations(raw.trim());
  if (!/^curl(\s|$)/i.test(normalized)) return null;

  const tokens = shellTokenize(normalized);
  if (
    tokens.length < 2 ||
    tokens[0]?.toLowerCase() !== 'curl'
  ) {
    return null;
  }

  let method: HttpMethod = 'GET';
  let useGet = false;
  const headerLines: string[] = [];
  let body = '';
  let basicUser: string | null = null;
  let basicPass: string | null = null;
  let url: string | null = null;

  let i = 1;
  const flagVal = (): string | null => {
    const v = tokens[i];
    i++;
    return v ?? null;
  };

  while (i < tokens.length) {
    const t = tokens[i] ?? '';
    const tl = t.toLowerCase();

    if (tl === '-x' || tl === '--request') {
      i++;
      const m = flagVal() ?? '';
      method = mapCurlMethod(m);
      continue;
    }
    if (tl.startsWith('-x') && tl.length > 2) {
      const m = t.slice(2);
      method = mapCurlMethod(m);
      i++;
      continue;
    }

    if (tl === '-h' || tl === '--header') {
      i++;
      const line = flagVal();
      if (line) headerLines.push(line);
      continue;
    }

    if (
      tl === '-d' ||
      tl === '--data' ||
      tl === '--data-binary' ||
      tl === '--data-raw'
    ) {
      i++;
      const d = flagVal() ?? '';
      if (d.startsWith('@')) {
        /* file ref — browsers cannot read; leave body as hint */
        body = '';
      } else {
        body = d;
      }
      continue;
    }

    if (tl.startsWith('--data=')) {
      const d = t.slice('--data='.length);
      body = d.startsWith('@') ? '' : d;
      i++;
      continue;
    }
    if (tl.startsWith('--data-binary=')) {
      const d = t.slice('--data-binary='.length);
      body = d.startsWith('@') ? '' : d;
      i++;
      continue;
    }
    if (tl.startsWith('--data-raw=')) {
      const d = t.slice('--data-raw='.length);
      body = d.startsWith('@') ? '' : d;
      i++;
      continue;
    }

    if (tl === '--data-urlencode') {
      i++;
      const d = flagVal() ?? '';
      body = body ? `${body}&${d}` : d;
      continue;
    }

    if (tl === '-u' || tl === '--user') {
      i++;
      const up = flagVal() ?? '';
      const c = up.indexOf(':');
      if (c >= 0) {
        basicUser = up.slice(0, c);
        basicPass = up.slice(c + 1);
      } else {
        basicUser = up;
        basicPass = '';
      }
      continue;
    }

    if (tl === '-b' || tl === '--cookie') {
      i++;
      const cookie = flagVal() ?? '';
      if (cookie) headerLines.push(`Cookie: ${cookie}`);
      continue;
    }

    if (tl === '-g' || tl === '--get') {
      useGet = true;
      i++;
      continue;
    }

    if (tl === '-f' || tl === '--form') {
      i++;
      flagVal();
      continue;
    }

    if (tl === '--compressed' || tl === '-l' || tl === '--location') {
      i++;
      continue;
    }

    if (urlLooksLike(t)) {
      url = t;
      i++;
      continue;
    }

    if (tl.startsWith('-')) {
      i++;
      continue;
    }

    i++;
  }

  if (!url) return null;

  if (useGet) method = 'GET';

  if (body && method === 'GET' && !useGet) {
    method = 'POST';
  }

  const { baseUrl, params } = queryFromUrl(url);

  const headerRows: KeyValueRow[] = [];
  let auth: RequestAuthConfig = defaultAuth();

  for (const line of headerLines) {
    const row = splitHeader(line);
    if (!row) continue;
    const hk = row.key.toLowerCase();
    const hv = row.value;
    if (hk === 'authorization') {
      const v = hv.trim();
      const bear = /^bearer\s+(.*)$/i.exec(v);
      if (bear) {
        auth = { type: 'bearer', bearerToken: bear[1]?.trim() ?? '' };
        continue;
      }
      const bas = /^basic\s+(.*)$/i.exec(v);
      if (bas) {
        const cred = decodeBasicUserPass(bas[1]?.trim() ?? '');
        if (cred) {
          auth = {
            type: 'basic',
            basicUsername: cred.user,
            basicPassword: cred.pass,
          };
          continue;
        }
      }
    }
    headerRows.push(row);
  }

  if (basicUser !== null) {
    auth = {
      type: 'basic',
      basicUsername: basicUser,
      basicPassword: basicPass ?? '',
    };
  }

  if (!headerRows.length) {
    headerRows.push({ key: '', value: '' });
  }

  return {
    method,
    url: baseUrl,
    queryParams: params,
    headerRows,
    bodyText: body,
    auth,
  };
}
