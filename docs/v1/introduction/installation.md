---
title: Installation
---

# Installation

::: warning
Paintor is an
[ES Module](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules) and as such, it is always imported with the `import` syntax.
:::

## Install

Install Paintor using your preferred package manager:

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

## Browser

### Self-hosted

After you install Paintor with your preferred package manager, you can find a minified
bundle file in `/dist`, which you can copy and use on your server:

```js
<script type="module">
  import { ... } from '/path/to/paintor/bundle.js'
</script>
```

### From CDN

::: code-group
```js [UNPKG]
<script type="module">
  import { ... } from 'https://unpkg.com/paintor'
</script>
```
```js [jsDelivr]
<script type="module">
  import { ... } from 'https://cdn.jsdelivr.net/npm/paintor'
</script>
```
:::

For specific versions, look at [UNPKG](https://unpkg.com/) or [jsDelivr](https://www.jsdelivr.com/).

## Server

In [Node.Js](https://nodejs.org):

```js
import { ... } from 'paintor'
```
