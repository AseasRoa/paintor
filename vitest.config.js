import { defineConfig } from 'vitest/config'

export default defineConfig({
  // https://vitest.dev/config/
  test: {
    environment: 'jsdom',
    include: ['**/*.{test,spec}.{js,mjs}'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'html'],
    },
    globals: true
  },
})