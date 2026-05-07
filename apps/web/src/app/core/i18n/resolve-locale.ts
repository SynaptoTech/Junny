import type { LocaleId } from './supported-locales';

export function resolveLocaleIdFromUrl(url: string): LocaleId {
  const path = url.split('?')[0].split('#')[0];
  const first = path.replace(/^\//, '').split('/')[0];
  if (first === 'pt-br') return 'pt-br';
  if (first === 'es') return 'es';
  return 'en';
}

