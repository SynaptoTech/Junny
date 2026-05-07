/**
 * Referências estáveis ao roadmap de IA (MD20).
 * Não há chamadas a modelos nem providers aqui — só contratos/consultoria futura.
 */

export const MD20_REFERENCE = 'MD20_JUNNY_AI_INTEGRATION_STRATEGY.md';

export const JUNNY_AI_ROADMAP_PHASE = 'strategy' as const;

/** Providers externos/locais a suportar no futuro. */
export const AI_PROVIDER_CANDIDATES = [
  'OpenAI',
  'OpenRouter',
  'Ollama',
  'Anthropic',
  'local-models',
  'llamacpp',
] as const;

/** Princípios de privacidade (UX futura). */
export const AI_PRIVACY_PRINCIPLES = [
  'optional-ai',
  'user-controls-data-sent',
  'privacy-mode-local-only',
  'no-mandatory-cloud',
] as const;
