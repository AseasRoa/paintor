---
title: Getting Started
---

# Getting Started

## Installation

#### Browser

Paintor is an
[ES Module](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules),
import it with the `import` syntax:

```js
<script type="module">
  import paintor from '/path/to/paintor.js'
</script>
```

#### Server

Paintor can be used in [Node.Js](https://nodejs.org) as well. First, install it:

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

Then, import it:
```js
import paintor from 'paintor'
```

## Basic Usage

### In the Browser

Here is an example of a simple clicks counter. We have a `localState`,
\<button\> and \<span\> elements.
When the \<button\> is clicked, it increments the `clicks` property of the
state, which is also reflected in the \<span\> element:

```html
<div id="container"></div>

<script type="module">
  import { component, state } from 'paintor'

  // Create a component
  const app = component(($) => {
    // Use a local state
    const localState = state({ clicks: 0 })

    // Build a hyperscript markup
    $.div(
      $.button({ onClick: () => localState.clicks++ }, 'Click me'),
      $.div(() => localState.clicks)
    )
  })

  // Render the component
  app.paint('#app')

</script>
```

### On the Server

On the server, `html()` is used instead of `paint()`:

```js
import { component } from 'paintor'

const app = component(($) => {
  $.div('Hello')
})

const htmlCode = app.html()
```

`html()` renders an HTML string:

```html
<div>Hello, World</div>
```

::: info
`html()` can be used in the browser as well.
:::

::: warning
`state()` is useless when generating HTML code.
:::


## The Main Functions

```js
import paintor from 'paintor'
```

`paintor` is an object, containing the following functions:
- `component()`
- `state()`
- `template()`
- `fetchTranslations()`
- `isTemplate()`
- `isComponent()`

All of these can also be imported as named imports:

```js
import {
  paintor,
  component,
  state,
  template,
  fetchTranslations,
  isTemplate,
  isComponent
} from 'paintor'
```

The following examples are all doing the same thing, only the syntax is
different:

::: code-group
```js [named imports (recommended)]
import { component, state, template } from 'paintor'

const myState = state(/* ... */)
const myTemplate = template(/* ... */)

component(myTemplate).paint(/* ... */)
```
```js [named import]
import { paintor } from 'paintor'

const myState = paintor.state(/* ... */)
const myTemplate = paintor.template(/* ... */)

paintor.component(myTemplate).paint(/* ... */)
```
```js [default import]
import paintor from 'paintor'

const myState = paintor.state(/* ... */)
const myTemplate = paintor.template(/* ... */)

paintor.component(myTemplate).paint(/* ... */)
```
:::
