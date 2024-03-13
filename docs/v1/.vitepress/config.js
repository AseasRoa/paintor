import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/paintor',
  outDir: '../../dist',
  lang: 'en-US',
  title: 'Paintor Docs',
  description: 'Paintor View Library Documentation',
  cleanUrls: true,
  lastUpdated: false,
  vite: {
    build: {
      target: 'esnext',
      minify: 'esbuild'
    },
    resolve: {
      alias: {
        paintor: 'paintor/v1/bundle.js'
      }
    }
  },
  themeConfig: {
    nav: [
      {
        text: 'View on GitHub',
        link: 'https://github.com/AseasRoa/paintor'
      },
      {
        text: 'Versions',
        items: [
          { text: 'v1', link: '/', target: '_self' },
          { text: 'v0', link: '/v0', target: '_self' }
        ]
      }
    ],
    /*
     * target: "_self" makes it so the page is actually reloaded,
     * which is needed for pages with live scripts
     */
    sidebar: [
      {
        text: 'Introduction',
        collapsed: false,
        items: [
          {
            text: 'What is Paintor?',
            link: '/introduction/what-is-paintor',
            target: "_self"
          },
          {
            text: 'Installation',
            link: '/introduction/installation',
            target: "_self"
          },
          {
            text: 'Basic Usage',
            link: '/introduction/basic-usage',
            target: "_self"
          }
        ]
      },
      {
        text: 'Templates',
        collapsed: true,
        items: [
          {
            text: 'What are Templates?',
            link: '/templates/what-are-templates',
            target: "_self"
          },
          {
            text: 'Template Tree',
            link: '/templates/template-tree',
            target: "_self"
          },
          {
            text: 'Template Tree Elements',
            link: '/templates/template-tree-elements',
            target: "_self"
          },
          {
            text: 'Properties Object',
            link: '/templates/properties-object',
            target: "_self"
          },
          {
            text: 'Template Tree Statements',
            link: '/templates/template-tree-statements',
            target: "_self"
          }
        ]
      },
      {
        text: 'Components',
        collapsed: true,
        items: [
          {
            text: 'Components',
            link: '/components/components',
            target: "_self"
          },
          {
            text: 'Components vs Templates',
            link: '/components/components-vs-templates',
            target: "_self"
          },
          {
            text: 'Painting',
            link: '/components/painting',
            target: "_self"
          }
        ]
      },
      {
        text: 'Reactivity',
        collapsed: true,
        items: [
          {
            text: 'States',
            link: '/reactivity/states',
            target: "_self"
          },
          {
            text: 'States are Deep',
            link: '/reactivity/states-are-deep',
            target: "_self"
          },
          {
            text: 'Observe States',
            link: '/reactivity/observe-states',
            target: "_self"
          },
          {
            text: 'Reactive if() and for()',
            link: '/reactivity/reactive-if-for',
            target: "_self"
          },
          {
            text: 'Using forEach()',
            link: '/reactivity/using-forEach',
            target: "_self"
          },
          {
            text: 'Using forState()',
            link: '/reactivity/using-forState',
            target: "_self"
          }
        ]
      },
      {
        text: 'Internationalization',
        collapsed: true,
        items: [
          {
            text: 'Translations',
            link: '/internationalization/translations',
            target: "_self"
          },
          {
            text: 'Fetch Translations',
            link: '/internationalization/fetch-translations',
            target: "_self"
          }
        ]
      },
      {
        text: 'HTML Syntax',
        collapsed: true,
        items: [
          {
            text: 'HTML Syntax',
            link: '/html-syntax/html-syntax',
            target: "_self"
          }
        ]
      },
      {
        text: 'Server Usage',
        collapsed: true,
        items: [
          {
            text: 'Generate HTML',
            link: '/server-usage/generate-html',
            target: "_self"
          }
        ]
      },
      {
        text: 'Examples',
        collapsed: true,
        items: [
          {
            text: 'To-Do List',
            link: '/examples/to-do-list',
            target: "_self"
          },
          {
            text: 'Temperature Converter',
            link: '/examples/temperature-converter',
            target: "_self"
          },
          {
            text: 'Many Elements',
            link: '/examples/many-elements',
            target: "_self"
          }
        ]
      }
    ]
  }
})
