import { defineConfig } from 'vite'

export default defineConfig({
  /**
   * @see https://vitejs.dev/config/server-options.html
   */
  server: {
    host: 'localhost',
    port: 8080,
    hmr: true,
  },
  /**
   * When building in Library Mode (lib), the 'es' build contains whitespaces
   * and even JSDoc comments when minified.
   * When Rollup is used (via rollupOptions), it works as in only Rollup is used
   *
   * @see https://vitejs.dev/guide/build.html
   */
  build: {
    target: 'esnext',
    minify: 'esbuild',
    outDir: 'dist',
    sourcemap: true,
    // lib: {
    //   entry: 'src/index.js',
    //   name: 'paintor',
    //   formats: ['es', 'umd'],
    // },
    rollupOptions: {
      // https://stackoverflow.com/questions/71500190/how-to-keep-root-level-export-when-building-with-vite-in-format-esm
      preserveEntrySignatures: 'exports-only',
      // https://rollupjs.org/guide/en/#big-list-of-options
      input: {
        paintor: 'src/index.js',
      },
      output: [
        {
          entryFileNames: '[name].js',
          format: 'es',
          exports: 'named',
        },
        {
          entryFileNames: '[name].[format].js',
          format: 'cjs',
          exports: 'named',
        },
        {
          entryFileNames: '[name].[format].js',
          format: 'amd',
          exports: 'named',
        },
        {
          entryFileNames: '[name].js',
          format: 'es',
          exports: 'named',
          dir: 'docs/assets',
        },
      ],
    },
  },
})
