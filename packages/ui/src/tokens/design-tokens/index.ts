/**
 * Tokens oficiais Junny — MD14_JUNNY_UI_UX_DESIGN_SYSTEM.md
 * Fonte única para documentação, APIs e consumo TypeScript.
 */

export const junnyColorPalette = {
  violetPrimary: '#7C3AED',
  blueSecondary: '#2563EB',
  background: '#0F172A',
  card: '#111827',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
} as const;

/** Estados de feedback (suave / técnico). */
export const junnyStatusColors = {
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#38BDF8',
} as const;

export const junnyTypography = {
  primary: 'Inter',
  alternative: 'Geist',
} as const;

/** Escala de espaçamento (px). */
export const junnySpacingScale = [4, 8, 12, 16, 24, 32, 48, 64] as const;

export const junnyRadius = {
  standard: '12px',
  large: '16px',
} as const;

/** Inspirações de produto (referência UX). */
export const junnyUxInspirations = [
  'Linear',
  'Raycast',
  'Vercel',
  'Supabase',
  'Bruno',
  'Hoppscotch',
] as const;

/** Catálogo de componentes previstos no design system. */
export const junnyComponentCatalog = [
  'Button',
  'Card',
  'Input',
  'Select',
  'Modal',
  'Tabs',
  'Sidebar',
  'Navbar',
  'Badge',
  'Tooltip',
  'Dropdown',
] as const;

/** Princípios UX (resumo). */
export const junnyUxPrinciples = [
  'Reduzir cliques e ruído visual',
  'Acelerar produtividade',
  'Evitar excesso de menus',
  'Dark-first; light/system preparados para o futuro',
] as const;

/** Fora de escopo inicial (MD14). */
export const junnyDesignSystemDeferred = ['marketplace themes', 'theme editor', 'visual builder'] as const;

export const MD14_REFERENCE = 'MD14_JUNNY_UI_UX_DESIGN_SYSTEM.md';
