/** MD58 — supported landing locales (content remains EN; URLs + document lang prepared for i18n). */
export type LocaleId = 'en' | 'pt-br' | 'es';

export interface LandingLocale {
  id: LocaleId;
  /** BCP 47 for the document language attribute */
  htmlLang: string;
  label: string;
  /** Primary route path (empty = `/`) */
  path: string;
}

export const LANDING_LOCALES: readonly LandingLocale[] = [
  { id: 'en', htmlLang: 'en', label: 'English', path: '' },
  { id: 'pt-br', htmlLang: 'pt-BR', label: 'Português (BR)', path: 'pt-br' },
  { id: 'es', htmlLang: 'es', label: 'Español', path: 'es' },
] as const;

export const DEFAULT_LOCALE_ID: LocaleId = 'en';

/** Future: optional locale redirect from navigator.language — persist choice only for now. */
export const LOCALE_STORAGE_KEY = 'junny-preferred-locale';
