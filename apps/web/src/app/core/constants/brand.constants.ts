/** URLs e textos de marca — fonte única para landing e layout. */
export const BRAND = {
  name: 'junny',
  slogan: 'Open Integration Studio',
  description:
    'Open Integration Studio for REST, SOAP, GraphQL, Kafka and beyond.',
  urls: {
    github: 'https://github.com/SynaptoTech/Junny',
    website: 'https://junny.dev.br',
    /** Same-origin (VitePress `base: /docs/`). Use absolute URL in meta tags if needed. */
    docs: '/docs/',
    license:
      'https://github.com/SynaptoTech/Junny/blob/main/LICENSE',
    synapto: 'https://www.synapto.com.br',
    ogImage: 'https://junny.dev.br/images/logo.png',
  },
  footer: {
    builtBy: 'Built by Synapto',
  },
} as const;
