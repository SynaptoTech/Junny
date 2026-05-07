import { defineConfig } from 'vitepress';

const siteUrl = 'https://junny.dev.br';

export default defineConfig({
  // Host the built site under the main domain (e.g. https://junny.dev.br/docs/)
  base: '/docs/',

  title: 'Junny Documentation',
  description:
    'Learn how to install, run, and use Junny — the open integration studio for REST, GraphQL, SOAP, WebSocket, and more.',
  lang: 'en-US',
  appearance: 'dark',
  lastUpdated: true,

  head: [
    ['meta', { name: 'theme-color', content: '#0f172a' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Junny Docs' }],
    ['meta', { property: 'og:image', content: `${siteUrl}/images/logo.png` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
      },
    ],
  ],

  themeConfig: {
    nav: [
      {
        text: 'Start',
        link: '/getting-started/',
        activeMatch: '^/getting-started/|^/installation/',
      },
      {
        text: 'Guides',
        link: '/workflows/',
        activeMatch:
          '^/workflows/|^/monitoring/|^/ai/|^/enterprise/|^/plugins/|^/cli/|^/sdk/|^/api-client/',
      },
      {
        text: 'Protocols',
        link: '/rest/',
        activeMatch: '^/rest/|^/graphql/|^/soap/|^/websocket/',
      },
      {
        text: 'Workspace',
        link: '/collections/',
        activeMatch: '^/collections/|^/environments/',
      },
      { text: 'API', link: '/api/' },
      { text: 'Examples', link: '/examples/' },
      { text: 'Roadmap', link: '/roadmap/' },
    ],

    sidebar: {
      '/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/getting-started/' },
            { text: 'Installation', link: '/installation/' },
            { text: 'Roadmap', link: '/roadmap/' },
          ],
        },
        {
          text: 'Guides',
          items: [
            { text: 'API client', link: '/api-client/' },
            { text: 'Workflows', link: '/workflows/' },
            { text: 'Monitoring', link: '/monitoring/' },
            { text: 'AI features', link: '/ai/' },
            { text: 'Enterprise', link: '/enterprise/' },
            { text: 'Plugins', link: '/plugins/' },
            { text: 'CLI', link: '/cli/' },
            { text: 'SDK', link: '/sdk/' },
          ],
        },
        {
          text: 'Protocols',
          items: [
            { text: 'REST', link: '/rest/' },
            { text: 'GraphQL', link: '/graphql/' },
            { text: 'SOAP', link: '/soap/' },
            { text: 'WebSocket', link: '/websocket/' },
          ],
        },
        {
          text: 'Workspace',
          items: [
            { text: 'Collections', link: '/collections/' },
            { text: 'Environments', link: '/environments/' },
          ],
        },
        {
          text: 'Reference',
          items: [
            { text: 'API & Swagger', link: '/api/' },
            { text: 'Examples', link: '/examples/' },
            { text: 'Tutorials', link: '/tutorials/' },
            { text: 'Docs versioning', link: '/guide/versioning/' },
          ],
        },
      ],
    },

    search: {
      provider: 'local',
    },

    editLink: {
      pattern:
        'https://github.com/SynaptoTech/Junny/edit/main/apps/docs/:path',
      text: 'Edit this page on GitHub',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/SynaptoTech/Junny' },
    ],

    footer: {
      message:
        'Released under the MIT License. Built by Synapto (https://www.synapto.com.br).',
      copyright: 'Copyright © Synapto / Junny contributors',
    },

    outline: 'deep',
  },
});
