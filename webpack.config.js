import path from 'path'
import { URL } from 'url'

// eslint-disable-next-line
const __filename = new URL(import.meta.url).href.replace('file:///', '')
// eslint-disable-next-line
const __dirname = path.dirname(__filename)

export default {
  target: 'web',
  mode: 'production',
  entry: './src/index.js',
  devtool: 'source-map',
  experiments: {
    outputModule: true,
  },
  optimization: {
    minimize: true,
  },
  output: {
    scriptType: 'module',
    environment: {
      // The environment supports arrow functions ('() => { ... }').
      arrowFunction: true,
      // The environment supports BigInt as literal (123n).
      bigIntLiteral: true,
      // The environment supports const and let for variable declarations.
      const: true,
      // The environment supports destructuring ('{ a, b } = obj').
      destructuring: true,
      // The environment supports an async import() function to import EcmaScript modules.
      dynamicImport: true,
      // The environment supports 'for of' iteration ('for (const x of array) { ... }').
      forOf: true,
      // The environment supports ECMAScript Module syntax to import ECMAScript modules
      // (import ... from '...').
      module: true,
    },
    library: {
      type: 'module',
    },
    path: path.join(__dirname, 'dist'),
    filename: 'paintor.min.js',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.mjs'],
    modules: [
      path.resolve('./src'),
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, ''),
    compress: true,
    hot: false,
    inline: false,
    open: true,
    host: 'localhost',
    headers: {
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
  watch: true,
}
