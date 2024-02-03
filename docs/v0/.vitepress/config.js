import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/paintor/v0',
  outDir: '../../dist/v0',
  lang: 'en-US',
  title: 'Paintor Docs (v0.x)',
  description: 'Paintor View Library Documentation',
  cleanUrls: true,
  lastUpdated: false,
  vite: {
    build: {
      target: 'esnext',
      minify: 'esbuild'
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
          { text: 'v1', link: '../' },
          { text: 'v0', link: '/' }
        ]
      }
    ],
    sidebar: [

    ]
  },
})
