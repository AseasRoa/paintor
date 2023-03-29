import { defineConfig } from 'vitepress';

// refer https://vitepress.vuejs.org/config/introduction for details
export default defineConfig({
  base: '/',
  lang: 'en-US',
  title: 'Paintor Docs',
  description: 'Paintor View Library Documentation',
  lastUpdated: false,

  head: [
    [
      'script',
      { src: 'https://cdn.jsdelivr.net/gh/AseasRoa/paintor@54c93d888460d3e137540589f817f5f5faf59fee/dist/paintor.js', crossorigin: '' }
    ],
    [
      'link',
      { rel: 'stylesheet', href: '/style.css' }
    ]
  ],

  themeConfig: {
    nav: [
      { text: 'View on GitHub', link: 'https://github.com/AseasRoa/paintor' },
      {
        text: 'v1',
        items: [
          { text: 'v1.x', link: '/' },
          { text: 'v0.x', link: '/v0.x/' },
        ]
      }
    ],
    sidebar: [
      {
        text: 'Introduction',
        collapsed: false,
        items: [
          { text: 'What is Paintor?', link: '/introduction/what-is-paintor' },
          { text: 'Getting Started', link: '/introduction/getting-started' },
          { text: 'Basic Usage', link: '/introduction/basic-usage' },
        ]
      },
      {
        text: 'Templates',
        collapsed: false,
        items: [
          { text: 'Creating Templates', link: '/templates/creating-templates'},
          { text: 'Painting Templates', link: '/templates/painting-templates'},
          { text: 'Template Tree', link: '/templates/template-tree'},
          { text: 'Properties Object', link: '/templates/properties-object'},
          { text: 'Statements', link: '/templates/statements'}
        ]
      },
      {
        text: 'Reactivity',
        collapsed: false,
        items: [
          { text: 'States', link: '/reactivity/states'},
          { text: 'Add and Remove Elements', link: '/reactivity/add-remove-elements'}
        ]
      },
      {
        text: 'Translations',
        collapsed: false,
        items: [
          { text: 'Translations', link: '/translations/translations'},
          { text: 'Fetch Translations', link: '/translations/fetch-translations'}
        ]
      },
      {
        text: 'HTML Syntax',
        collapsed: false,
        items: [
          { text: 'HTML Syntax', link: '/html-syntax/html-syntax'}
        ]
      }
    ]
  },
});
