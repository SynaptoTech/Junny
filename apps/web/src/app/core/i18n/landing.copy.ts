import type { LocaleId } from './supported-locales';

export type LandingCopy = {
  nav: {
    workspace: string;
    roadmap: string;
    explore: string;
    docs: string;
    github: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaGithub: string;
    ctaDocs: string;
    note: string;
  };
  onboarding: {
    srHeading: string;
    eyebrow: string;
    stepLabel: string;
    steps: ReadonlyArray<{ step: string; title: string; hint: string; href: string }>;
  };
  sections: {
    explore: { title: string; subtitle: string };
    trusted: { title: string; subtitle: string };
    moreThan: { title: string; subtitle: string };
    multiProtocol: { title: string; subtitle: string };
    observability: { title: string; subtitle: string };
    ai: { title: string; subtitle: string };
    built: { title: string; subtitle: string };
    git: { title: string; subtitle: string };
    marketplace: { title: string; subtitle: string };
    enterprise: { title: string; subtitle: string };
    roadmap: { title: string; subtitle: string };
    oss: { title: string; subtitle: string };
  };
  footer: {
    tagline: string;
    ctaWorkspace: string;
    ctaRoadmap: string;
    ctaDocs: string;
    groups: {
      product: string;
      dev: string;
      platform: string;
      legal: string;
    };
  };
};

const EN: LandingCopy = {
  nav: {
    workspace: 'Workspace',
    roadmap: 'Roadmap',
    explore: 'Explore',
    docs: 'Documentation',
    github: 'GitHub',
  },
  hero: {
    badge: 'Open source · local-first · dark-first',
    title: 'The Open Integration Platform for Modern APIs',
    subtitle:
      'Build, observe and automate REST, GraphQL, SOAP, WebSocket and more — with realtime observability, optional AI, event streaming and enterprise-ready foundations.',
    ctaPrimary: 'Get Started',
    ctaGithub: 'View on GitHub',
    ctaDocs: 'Documentation',
    note: 'More than an API client: workflows, observability, streaming, AI, git-native collections and a public SDK roadmap.',
  },
  onboarding: {
    srHeading: 'From zero to first request',
    eyebrow: 'Start in minutes',
    stepLabel: 'Step',
    steps: [
      { step: '1', title: 'Open the workspace', hint: 'Launch Junny locally or via Docker', href: '/app' },
      { step: '2', title: 'Read the docs', hint: 'Guides across protocols and workspace', href: '/docs/getting-started/' },
      { step: '3', title: 'Install & run', hint: 'Docker · npm · environment', href: '/docs/installation/' },
      { step: '4', title: 'First request', hint: 'REST as the default path', href: '/docs/rest/' },
    ],
  },
  sections: {
    explore: {
      title: 'Explore',
      subtitle: 'Everything Junny can become — organized, discoverable and easy to scan.',
    },
    trusted: {
      title: 'Trusted Developer Platform',
      subtitle: 'Open source. Local-first. Privacy-first. Enterprise-ready — without enterprise marketing.',
    },
    moreThan: {
      title: 'More Than an API Client',
      subtitle:
        'Junny is an integration platform: protocols, workflows, observability, streaming, AI (optional) and git-native collections.',
    },
    multiProtocol: { title: 'Multi Protocol Platform', subtitle: 'REST first. Everything else, consistently.' },
    observability: {
      title: 'Realtime Observability',
      subtitle:
        'Dashboards, streams, monitoring, profiler and traffic inspection — designed to debug production-like behavior.',
    },
    ai: { title: 'AI Powered (Optional)', subtitle: "AI when you want it. Full control when you don't." },
    built: {
      title: 'Built for Developers',
      subtitle:
        'CLI, SDK, plugins, git-native collections, workflows and AI tooling — designed for real automation.',
    },
    git: { title: 'Git Native Collections', subtitle: 'APIs versioned like code — diffs, history, branches and sync.' },
    marketplace: {
      title: 'Plugin Marketplace',
      subtitle: 'An extensible ecosystem: protocols, workflow nodes and AI tools — powered by plugins.',
    },
    enterprise: {
      title: 'Enterprise-ready when you need it',
      subtitle:
        'Open and local-first by default. Junny grows with you — from side project to regulated teams — without selling a legacy suite.',
    },
    roadmap: { title: 'Roadmap', subtitle: "A clear view of what is available today and what’s next." },
    oss: {
      title: 'Open Source Ecosystem',
      subtitle: 'MIT licensed, community-first. Build integrations, plugins and tooling around Junny.',
    },
  },
  footer: {
    tagline: 'open source, local-first, developer-first.',
    ctaWorkspace: 'Workspace',
    ctaRoadmap: 'Roadmap',
    ctaDocs: 'Docs',
    groups: {
      product: 'Product',
      dev: 'Developer',
      platform: 'Platform',
      legal: 'Legal',
    },
  },
};

const PT: LandingCopy = {
  nav: {
    workspace: 'Workspace',
    roadmap: 'Roadmap',
    explore: 'Explorar',
    docs: 'Documentação',
    github: 'GitHub',
  },
  hero: {
    badge: 'Open source · local-first · dark-first',
    title: 'A plataforma aberta de integração para APIs modernas',
    subtitle:
      'Construa, observe e automatize REST, GraphQL, SOAP, WebSocket e mais — com observabilidade em tempo real, IA opcional, streaming e base pronta para enterprise.',
    ctaPrimary: 'Começar',
    ctaGithub: 'Ver no GitHub',
    ctaDocs: 'Documentação',
    note: 'Mais que um client: workflows, observabilidade, streaming, IA, coleções git-native e roadmap público de SDK.',
  },
  onboarding: {
    srHeading: 'Do zero ao primeiro request',
    eyebrow: 'Comece em minutos',
    stepLabel: 'Passo',
    steps: [
      { step: '1', title: 'Abra o workspace', hint: 'Rode localmente ou via Docker', href: '/app' },
      { step: '2', title: 'Leia a documentação', hint: 'Guias de protocolos e workspace', href: '/docs/getting-started/' },
      { step: '3', title: 'Instale e rode', hint: 'Docker · npm · ambiente', href: '/docs/installation/' },
      { step: '4', title: 'Primeiro request', hint: 'REST como caminho padrão', href: '/docs/rest/' },
    ],
  },
  footer: {
    tagline: 'open source, local-first, developer-first.',
    ctaWorkspace: 'Workspace',
    ctaRoadmap: 'Roadmap',
    ctaDocs: 'Docs',
    groups: {
      product: 'Produto',
      dev: 'Dev',
      platform: 'Plataforma',
      legal: 'Legal',
    },
  },
  sections: {
    explore: { title: 'Explorar', subtitle: 'Tudo que o Junny pode se tornar — organizado e fácil de descobrir.' },
    trusted: {
      title: 'Plataforma confiável para devs',
      subtitle: 'Open source. Local-first. Privacy-first. Pronto para enterprise — sem marketing enterprise.',
    },
    moreThan: {
      title: 'Mais que um API client',
      subtitle:
        'Junny é uma plataforma de integração: protocolos, workflows, observabilidade, streaming, IA (opcional) e coleções git-native.',
    },
    multiProtocol: { title: 'Multi-protocolo', subtitle: 'REST primeiro. O resto, consistente.' },
    observability: {
      title: 'Observabilidade em tempo real',
      subtitle:
        'Dashboards, streams, monitoring, profiler e inspeção de tráfego — para depurar comportamento tipo produção.',
    },
    ai: { title: 'IA (opcional)', subtitle: 'IA quando você quiser. Controle total quando não quiser.' },
    built: {
      title: 'Feito para desenvolvedores',
      subtitle: 'CLI, SDK, plugins, coleções git-native, workflows e ferramentas de IA — automação de verdade.',
    },
    git: { title: 'Coleções Git Native', subtitle: 'APIs versionadas como código — diffs, histórico, branches e sync.' },
    marketplace: {
      title: 'Marketplace de plugins',
      subtitle: 'Ecossistema extensível: protocolos, nós de workflow e ferramentas de IA — via plugins.',
    },
    enterprise: {
      title: 'Enterprise quando você precisar',
      subtitle:
        'Open e local-first por padrão. Cresça do side project a times regulados — sem vender uma suíte legacy.',
    },
    roadmap: { title: 'Roadmap', subtitle: 'Visão clara do que existe hoje e do que vem depois.' },
    oss: {
      title: 'Ecossistema open source',
      subtitle: 'MIT, community-first. Construa integrações, plugins e tooling ao redor do Junny.',
    },
  },
};

const ES: LandingCopy = {
  nav: {
    workspace: 'Workspace',
    roadmap: 'Roadmap',
    explore: 'Explorar',
    docs: 'Documentación',
    github: 'GitHub',
  },
  hero: {
    badge: 'Open source · local-first · dark-first',
    title: 'La plataforma abierta de integración para APIs modernas',
    subtitle:
      'Construye, observa y automatiza REST, GraphQL, SOAP, WebSocket y más — con observabilidad en tiempo real, IA opcional, streaming y base lista para enterprise.',
    ctaPrimary: 'Empezar',
    ctaGithub: 'Ver en GitHub',
    ctaDocs: 'Documentación',
    note: 'Más que un cliente: workflows, observabilidad, streaming, IA, colecciones git-native y roadmap público de SDK.',
  },
  onboarding: {
    srHeading: 'De cero al primer request',
    eyebrow: 'Empieza en minutos',
    stepLabel: 'Paso',
    steps: [
      { step: '1', title: 'Abre el workspace', hint: 'Ejecuta local o con Docker', href: '/app' },
      { step: '2', title: 'Lee la documentación', hint: 'Guías de protocolos y workspace', href: '/docs/getting-started/' },
      { step: '3', title: 'Instala y ejecuta', hint: 'Docker · npm · entorno', href: '/docs/installation/' },
      { step: '4', title: 'Primer request', hint: 'REST como ruta por defecto', href: '/docs/rest/' },
    ],
  },
  footer: {
    tagline: 'open source, local-first, developer-first.',
    ctaWorkspace: 'Workspace',
    ctaRoadmap: 'Roadmap',
    ctaDocs: 'Docs',
    groups: {
      product: 'Producto',
      dev: 'Dev',
      platform: 'Plataforma',
      legal: 'Legal',
    },
  },
  sections: {
    explore: { title: 'Explorar', subtitle: 'Todo lo que Junny puede ser — organizado y fácil de escanear.' },
    trusted: {
      title: 'Plataforma confiable para devs',
      subtitle: 'Open source. Local-first. Privacy-first. Lista para enterprise — sin marketing enterprise.',
    },
    moreThan: {
      title: 'Más que un API client',
      subtitle:
        'Junny es una plataforma de integración: protocolos, workflows, observabilidad, streaming, IA (opcional) y colecciones git-native.',
    },
    multiProtocol: { title: 'Multi-protocolo', subtitle: 'REST primero. Todo lo demás, consistente.' },
    observability: {
      title: 'Observabilidad en tiempo real',
      subtitle:
        'Dashboards, streams, monitoring, profiler e inspección de tráfico — para depurar comportamiento tipo producción.',
    },
    ai: { title: 'IA (opcional)', subtitle: 'IA cuando quieras. Control total cuando no.' },
    built: {
      title: 'Hecho para developers',
      subtitle: 'CLI, SDK, plugins, colecciones git-native, workflows y herramientas de IA — automatización real.',
    },
    git: { title: 'Colecciones Git Native', subtitle: 'APIs versionadas como código — diffs, historial y ramas.' },
    marketplace: {
      title: 'Marketplace de plugins',
      subtitle: 'Ecosistema extensible: protocolos, nodos de workflow y herramientas de IA — via plugins.',
    },
    enterprise: {
      title: 'Enterprise cuando lo necesites',
      subtitle:
        'Open y local-first por defecto. Crece de side project a equipos regulados — sin vender una suite legacy.',
    },
    roadmap: { title: 'Roadmap', subtitle: 'Vista clara de lo disponible hoy y lo que sigue.' },
    oss: {
      title: 'Ecosistema open source',
      subtitle: 'MIT, community-first. Construye integraciones, plugins y tooling alrededor de Junny.',
    },
  },
};

export function getLandingCopy(locale: LocaleId): LandingCopy {
  if (locale === 'pt-br') return PT;
  if (locale === 'es') return ES;
  return EN;
}

