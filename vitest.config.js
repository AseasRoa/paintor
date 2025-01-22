import { defineConfig } from 'vitest/config'

export default defineConfig({
  // https://vitest.dev/config/
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'html'],
    },
    globals: false,
  },
})
