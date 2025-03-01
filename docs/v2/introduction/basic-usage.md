---
title: Basic Usage
---

# Basic Usage

## Imports

### Default Import

```js
import paintor from 'paintor'
```

`paintor` is an object, containing the following functions:
- `compose()`
- `state()`
- `template()`
- `on()`
- `off()`
- `fetchTranslations()`
- `isTemplate()`
- `isComposition()`

### Named Imports

All functions from the default import are also available as named imports:

```js
import {
  paintor,
  compose,
  state,
  template,
  on,
  off,
  fetchTranslations,
  isTemplate,
  isComposition
} from 'paintor'
```

The following examples are all doing the same thing, only the syntax is
different:

::: code-group
```js [named imports (recommended)]
import { component, state, template } from 'paintor'

const myState = state(/* ... */)
const myTemplate = template(/* ... */)

compose(myTemplate).paint(/* ... */)
```
```js [named import]
import { paintor } from 'paintor'

const myState = paintor.state(/* ... */)
const myTemplate = paintor.template(/* ... */)

paintor.compose(myTemplate).paint(/* ... */)
```
```js [default import]
import paintor from 'paintor'

const myState = paintor.state(/* ... */)
const myTemplate = paintor.template(/* ... */)

paintor.compose(myTemplate).paint(/* ... */)
```
:::

## Browser Usage

We start with an empty `<div>` element. This is the container where all
generated elements will be placed.

Then we have a component `Flowers`,
which is a function that returns a template. The template has a special
argument (`x`), from which we are using `span()` function to create few span
elements.

The `Flowers` component is then used in the `compose()` function, which takes
one or more such components. From there, we use the `paint()` function provided
by `compose()` to tell Paintor where to draw our composition.

```html
<div id="app"></div>

<script type="module">
  import { compose, template } from 'paintor'

  // Component
  function Flowers() {
    return template((x) => {
      x.span('Rose')
      x.span('Tulip')
      x.span('Daisy')
    })
  }

  // Render
  const app = compose(Flowers)
  app.paint('#app')
</script>
```

## Server Usage

To generate HTML code on the server, use `html()` instead of `paint()`.

::: info
`html()` can be used in the browser as well.
:::

```js
...
...
const htmlCode = app.html('#app')
```
