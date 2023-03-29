## Installation

#### Browser

`/dist/paintor.js` is an ES module

```js
<script type="module">
  import paintor from '/assets/paintor.js'
</script>
```

#### Server

You can use Paintor in [Node.Js](https://nodejs.org). To install it:

::: code-group
```bash [npm]
npm install paintor
```
```bash [pnpm]
pnpm add paintor
```
```bash [yarn]
yarn add paintor
```
:::

Then import it:
```js
import paintor from 'paintor'
```

## The Main Functions

When imported, `paintor` is an object, containing the following functions:
- `compose()`
- `createState()`
- `createTemplate()`
- `createTranslation()`

and a class, which should only be used as a type:
- `Paintor`

If you prefer, you can import each of these as named imports:
```js
import {
  paintor,
  compose,
  createState,
  createTemplate,
  createTranslation,
  Paintor
} from 'paintor'
```

`paintor` is also available as a default import:
```js
import paintor from 'paintor'
```