/**
 * Plugin SDK (MD19) — tipos estáveis futuros para extensões.
 * Não existe carregamento dinâmico nem marketplace ainda.
 */

/** Versão do contrato plugin↔host (negociação futura). */
export const JUNNY_PLUGIN_API_VERSION = '0';

export type JunnyPluginType =
  | 'protocol'
  | 'ui'
  | 'automation'
  | 'ai';

/** Manifest futuro (`manifest.json`). */
export interface JunnyPluginManifest {
  name: string;
  version: string;
  author: string;
  type: JunnyPluginType;
  /** Opcional — capabilities declarativas. */
  contributes?: Record<string, unknown>;
  junnyPluginApi?: string;
}

/** Lifecycle hooks planejados (sandbox futura). */
export interface JunnyPluginLifecycle<Context = unknown> {
  onLoad?(ctx: Context): Promise<void> | void;
  onUnload?(ctx: Context): Promise<void> | void;
  onRequest?(payload: unknown, ctx: Context): Promise<unknown> | unknown;
}

export const MD19_REFERENCE = 'MD19_JUNNY_PLUGIN_SYSTEM_ARCHITECTURE.md';
