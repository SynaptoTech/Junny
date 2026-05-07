export type ProtocolKind = 'REST' | 'GRAPHQL' | 'SOAP' | 'WEBSOCKET';

export interface MethodTone {
  /** Texto curto que aparece no badge. */
  label: string;
  /** Cor de texto / borda / fundo (Tailwind). */
  text: string;
  bg: string;
  border: string;
  /** Combinação compacta para badges sólidos. */
  pill: string;
}

const REST_TONES: Record<string, MethodTone> = {
  GET: {
    label: 'GET',
    text: 'text-emerald-300',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/40',
    pill: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30',
  },
  POST: {
    label: 'POST',
    text: 'text-amber-300',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/40',
    pill: 'bg-amber-500/20 text-amber-200 border-amber-500/30',
  },
  PUT: {
    label: 'PUT',
    text: 'text-sky-300',
    bg: 'bg-sky-500/15',
    border: 'border-sky-500/40',
    pill: 'bg-sky-500/20 text-sky-200 border-sky-500/30',
  },
  PATCH: {
    label: 'PATCH',
    text: 'text-violet-300',
    bg: 'bg-violet-500/15',
    border: 'border-violet-500/40',
    pill: 'bg-violet-500/20 text-violet-200 border-violet-500/30',
  },
  DELETE: {
    label: 'DEL',
    text: 'text-rose-300',
    bg: 'bg-rose-500/15',
    border: 'border-rose-500/40',
    pill: 'bg-rose-500/20 text-rose-200 border-rose-500/30',
  },
  HEAD: {
    label: 'HEAD',
    text: 'text-teal-300',
    bg: 'bg-teal-500/15',
    border: 'border-teal-500/40',
    pill: 'bg-teal-500/20 text-teal-200 border-teal-500/30',
  },
  OPTIONS: {
    label: 'OPT',
    text: 'text-fuchsia-300',
    bg: 'bg-fuchsia-500/15',
    border: 'border-fuchsia-500/40',
    pill: 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-500/30',
  },
};

const PROTOCOL_TONES: Record<ProtocolKind, MethodTone> = {
  REST: REST_TONES['GET'],
  GRAPHQL: {
    label: 'GQL',
    text: 'text-junny-violet',
    bg: 'bg-junny-violet/15',
    border: 'border-junny-violet/40',
    pill: 'bg-junny-violet/20 text-junny-violet border-junny-violet/30',
  },
  SOAP: {
    label: 'SOAP',
    text: 'text-amber-300',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/40',
    pill: 'bg-amber-500/20 text-amber-200 border-amber-500/30',
  },
  WEBSOCKET: {
    label: 'WS',
    text: 'text-emerald-300',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/40',
    pill: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30',
  },
};

const FALLBACK: MethodTone = {
  label: '—',
  text: 'text-slate-400',
  bg: 'bg-slate-700/40',
  border: 'border-slate-600/40',
  pill: 'bg-slate-700/40 text-slate-300 border-slate-600/40',
};

/**
 * Resolve cor + label para um método HTTP, levando em conta o protocolo.
 * Quando `protocol` é REST (default) usa as cores clássicas (Postman/Insomnia).
 */
export function methodTone(
  method: string | undefined,
  protocol?: string | null,
): MethodTone {
  const proto = (protocol ?? 'REST').toUpperCase();
  if (proto === 'GRAPHQL' || proto === 'SOAP' || proto === 'WEBSOCKET') {
    return PROTOCOL_TONES[proto as ProtocolKind];
  }
  if (!method) return FALLBACK;
  const key = method.toUpperCase();
  return REST_TONES[key] ?? FALLBACK;
}

export interface StatusTone {
  text: string;
  bg: string;
  pill: string;
  /** Bandeira humana (Success / Redirect / Client error / Server error). */
  group: '2xx' | '3xx' | '4xx' | '5xx' | 'other';
}

export function statusTone(status: number | undefined | null): StatusTone {
  if (status === undefined || status === null || Number.isNaN(status)) {
    return {
      text: 'text-slate-300',
      bg: 'bg-slate-800',
      pill: 'bg-slate-800 text-slate-300',
      group: 'other',
    };
  }
  if (status >= 200 && status < 300) {
    return {
      text: 'text-emerald-200',
      bg: 'bg-emerald-500/20',
      pill: 'bg-emerald-500/20 text-emerald-200',
      group: '2xx',
    };
  }
  if (status >= 300 && status < 400) {
    return {
      text: 'text-blue-200',
      bg: 'bg-junny-blue/20',
      pill: 'bg-junny-blue/20 text-blue-200',
      group: '3xx',
    };
  }
  if (status >= 400 && status < 500) {
    return {
      text: 'text-amber-200',
      bg: 'bg-amber-500/20',
      pill: 'bg-amber-500/20 text-amber-200',
      group: '4xx',
    };
  }
  return {
    text: 'text-rose-200',
    bg: 'bg-rose-500/20',
    pill: 'bg-rose-500/20 text-rose-200',
    group: '5xx',
  };
}

/** Texto humano curto da família do status. */
export function statusGroupLabel(status: number | undefined | null): string {
  const t = statusTone(status);
  switch (t.group) {
    case '2xx':
      return 'Success';
    case '3xx':
      return 'Redirect';
    case '4xx':
      return 'Client error';
    case '5xx':
      return 'Server error';
    default:
      return '—';
  }
}

/** Tamanho humano (KB/MB) a partir de qualquer dado serializável. */
export function humanSize(data: unknown): string {
  try {
    const s = typeof data === 'string' ? data : JSON.stringify(data ?? '');
    const bytes = new TextEncoder().encode(s).byteLength;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  } catch {
    return '—';
  }
}
