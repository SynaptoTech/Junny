/** Placements Synapto Creative — siteKey `junny` (https://junny.dev.br). */
export const JUNNY_SC_SITE_KEY = 'junny';

/** Cache bust do `creative.js` — incrementar após deploy do SDK. */
export const JUNNY_SC_SDK_VERSION = '2026052803';

export const JUNNY_CREATIVE_PLACEMENT_KEYS = {
  homeSynoraBanner: 'home_synora_banner',
  homeBetweenSections: 'home_between_sections',
  homeBeforeFooter: 'home_before_footer',
  footerEcosystem: 'footer_ecosystem',
} as const;

export type JunnyCreativePlacementKey =
  (typeof JUNNY_CREATIVE_PLACEMENT_KEYS)[keyof typeof JUNNY_CREATIVE_PLACEMENT_KEYS];

export const JUNNY_CREATIVE_HOME_SLOTS: ReadonlyArray<{
  key: JunnyCreativePlacementKey;
  format: 'banner' | 'native_card';
  uiPlacement: string;
}> = [
  {
    key: JUNNY_CREATIVE_PLACEMENT_KEYS.homeSynoraBanner,
    format: 'native_card',
    uiPlacement: 'home_synora_banner',
  },
  {
    key: JUNNY_CREATIVE_PLACEMENT_KEYS.homeBetweenSections,
    format: 'native_card',
    uiPlacement: 'home_between_sections',
  },
  {
    key: JUNNY_CREATIVE_PLACEMENT_KEYS.homeBeforeFooter,
    format: 'banner',
    uiPlacement: 'home_before_footer',
  },
  {
    key: JUNNY_CREATIVE_PLACEMENT_KEYS.footerEcosystem,
    format: 'banner',
    uiPlacement: 'footer_ecosystem',
  },
];

export const JUNNY_CREATIVE_PLACEMENT_ALIASES: Readonly<Record<string, string>> = {
  home_after_hero: JUNNY_CREATIVE_PLACEMENT_KEYS.homeSynoraBanner,
};

export function resolveJunnyCreativePlacement(uiPlacement: string): string {
  return JUNNY_CREATIVE_PLACEMENT_ALIASES[uiPlacement] ?? uiPlacement;
}

export function creativeFormatForJunnyPlacement(
  uiPlacement: string,
): 'banner' | 'native_card' {
  const key = resolveJunnyCreativePlacement(uiPlacement);
  const slot = JUNNY_CREATIVE_HOME_SLOTS.find((s) => s.key === key);
  if (slot) return slot.format;
  if (uiPlacement.includes('footer') || uiPlacement.includes('before_footer')) {
    return 'banner';
  }
  return 'native_card';
}
