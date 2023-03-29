import { defineConfig } from 'vitepress';

// refer https://vitepress.vuejs.org/config/introduction for details
export default defineConfig({
  base: '/v0.x/',
  lang: 'en-US',
  title: 'Paintor Docs (v0.x)',
  description: 'Paintor View Library Documentation',

  themeConfig: {
    nav: [
      { text: 'View on GitHub', link: 'https://github.com/AseasRoa/paintor' }
    ],
    sidebar: [

    ]
  },
});