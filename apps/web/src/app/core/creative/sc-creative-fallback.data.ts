/** Fallback estático quando a API Synapto Creative não responde. */
export interface ScCreativeFallback {
  title: string;
  description: string;
  ctaLabel: string;
  targetUrl: string;
}

export const JUNNY_SC_CREATIVE_FALLBACKS: Record<string, ScCreativeFallback> = {
  home_synora_banner: {
    title: 'Observe — monitoramento Synapto',
    description: 'Monitore APIs e serviços com alertas, uptime e dashboards simples.',
    ctaLabel: 'Conhecer o Observe',
    targetUrl: 'https://observe.synapto.com.br',
  },
  home_between_sections: {
    title: 'Synapto Creative',
    description: 'Monetize conteúdo e produtos digitais com anúncios nativos no ecossistema Synapto.',
    ctaLabel: 'Conhecer a Creative',
    targetUrl: 'https://synaptocreative.com.br',
  },
  home_before_footer: {
    title: 'Ecossistema Synapto',
    description: 'Ferramentas conectadas para desenvolvedores e produtos digitais.',
    ctaLabel: 'Conhecer a Synapto',
    targetUrl: 'https://synapto.com.br',
  },
  footer_ecosystem: {
    title: 'Observe',
    description: 'Monitore seus serviços com uma plataforma simples e moderna.',
    ctaLabel: 'Conhecer o Observe',
    targetUrl: 'https://observe.synapto.com.br',
  },
};

export function fallbackForJunnyPlacement(
  placementKey: string,
): ScCreativeFallback | null {
  return (
    JUNNY_SC_CREATIVE_FALLBACKS[placementKey] ??
    JUNNY_SC_CREATIVE_FALLBACKS['home_synora_banner'] ??
    null
  );
}
