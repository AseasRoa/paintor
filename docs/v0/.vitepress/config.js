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
          { text: 'v2', link: '/', target: '_self' },
          { text: 'v1', link: '/v1', target: '_self' },
          { text: 'v0', link: '/v0', target: '_self' }
        ]
      }
    ],
    sidebar: []
  },
})
