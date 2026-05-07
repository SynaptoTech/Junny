import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Informação do design system (MD14) — sem persistência; espelha tokens e roadmap.
 */
@ApiTags('design-system')
@Controller('api/design-system')
export class DesignSystemController {
  @Get('roadmap')
  @ApiOperation({
    summary: 'Fundamentos do UI/UX Junny (tokens, componentes, filosofia)',
  })
  roadmap(): {
    phase: string;
    md: string;
    theme: string;
    philosophy: string[];
    colors: Record<string, string>;
    typography: { primary: string; alternative: string };
    spacingScalePx: readonly number[];
    radiusPx: { standard: string; large: string };
    statusColors: Record<string, string>;
    componentCatalog: readonly string[];
    inspirations: readonly string[];
    uxPrinciples: readonly string[];
    deferred: readonly string[];
  } {
    return {
      phase: 'foundation',
      md: 'MD14_JUNNY_UI_UX_DESIGN_SYSTEM.md',
      theme: 'junny-dark',
      philosophy: [
        'moderno',
        'limpo',
        'premium',
        'rápido',
        'developer-first',
        'minimalismo',
      ],
      colors: {
        violetPrimary: '#7C3AED',
        blueSecondary: '#2563EB',
        background: '#0F172A',
        card: '#111827',
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
      },
      typography: {
        primary: 'Inter',
        alternative: 'Geist',
      },
      spacingScalePx: [4, 8, 12, 16, 24, 32, 48, 64],
      radiusPx: {
        standard: '12px',
        large: '16px',
      },
      statusColors: {
        success: '#34D399',
        warning: '#FBBF24',
        error: '#F87171',
        info: '#38BDF8',
      },
      componentCatalog: [
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
      ],
      inspirations: [
        'Linear',
        'Raycast',
        'Vercel',
        'Supabase',
        'Bruno',
        'Hoppscotch',
      ],
      uxPrinciples: [
        'Reduzir cliques e ruído visual',
        'Acelerar produtividade',
        'Evitar excesso de menus',
      ],
      deferred: ['marketplace themes', 'theme editor', 'visual builder'],
    };
  }
}
