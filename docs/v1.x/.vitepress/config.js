import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/',
  lang: 'en-US',
  title: 'Paintor Docs',
  description: 'Paintor View Library Documentation',
  lastUpdated: false,
  vite: {
    build: {
      target: 'esnext',
      minify: 'esbuild'
    },
    resolve: {
      alias: {
        paintor: '#paintor'
      }
    }
  },

  head: [
    [
      'link',
      { rel: 'stylesheet', href: '/style.css' }
    ]
  ],

  themeConfig: {
    nav: [
      {
        text: 'View on GitHub',
        link: 'https://github.com/AseasRoa/paintor'
      },
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
          {
            text: 'What is Paintor?',
            link: '/introduction/what-is-paintor'
          },
          {
            text: 'Getting Started',
            link: '/introduction/getting-started'
          }
        ]
      },
      {
        text: 'Templates',
        collapsed: true,
        items: [
          {
            text: 'What are Templates?',
            link: '/templates/what-are-templates'
          },
          {
            text: 'Template Tree',
            link: '/templates/template-tree'
          },
          {
            text: 'Template Tree Elements',
            link: '/templates/template-tree-elements'
          },
          {
            text: 'Properties Object',
            link: '/templates/properties-object'
          },
          {
            text: 'Template Tree Statements',
            link: '/templates/template-tree-statements'
          }
        ]
      },
      {
        text: 'Components',
        collapsed: true,
        items: [
          {
            text: 'What are Components?',
            link: '/components/what-are-components'
          },
          {
            text: 'Painting Templates',
            link: '/components/painting-templates'
          },
          {
            text: 'Components',
            link: '/components/components'
          },
          {
            text: 'Template as a Component',
            link: '/components/template-as-a-component'
          }
        ]
      },
      {
        text: 'Reactivity',
        collapsed: true,
        items: [
          {
            text: 'States',
            link: '/reactivity/states'
          },
          {
            text: 'Using forEach()',
            link: '/reactivity/using-forEach'
          },
          {
            text: 'Using forState()',
            link: '/reactivity/using-forState'
          }
        ]
      },
      {
        text: 'Internationalization',
        collapsed: true,
        items: [
          {
            text: 'Translations',
            link: '/internationalization/translations'
          },
          {
            text: 'Fetch Translations',
            link: '/internationalization/fetch-translations'
          }
        ]
      },
      {
        text: 'HTML Syntax',
        collapsed: true,
        items: [
          {
            text: 'HTML Syntax',
            link: '/html-syntax/html-syntax'
          }
        ]
      },
      {
        text: 'Examples',
        collapsed: true,
        items: [
          {
            text: 'To-Do List',
            link: '/examples/to-do-list'
          },
          {
            text: 'Temperature Converter',
            link: '/examples/temperature-converter'
          },
          {
            text: 'Many Elements',
            link: '/examples/many-elements'
          }
        ]
      }
    ]
  },
})
