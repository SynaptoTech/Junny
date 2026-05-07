import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Junny',
  description:
    'Open Integration Studio for REST, SOAP, GraphQL, Kafka and beyond.',
  themeConfig: {
    nav: [{ text: 'Início', link: '/' }],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/SynaptoTech/Junny' },
    ],
    footer: {
      message: 'MIT License',
    },
  },
});
