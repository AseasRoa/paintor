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
- `component()`
- `state()`
- `template()`
- `on()`
- `off()`
- `fetchTranslations()`
- `isTemplate()`
- `isComponent()`

### Named Imports

All functions from the default import are also available as named imports:

```js
import {
  paintor,
  component,
  state,
  template,
  on,
  off,
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

## Browser Usage

Here is an example of a simple clicks counter. We have a `localState`,
\<button\> and \<span\> elements.
When the \<button\> is clicked, it increments the `clicks` property of the
state, which is also reflected in the \<span\> element:

```html
<div id="container"></div>

<script type="module">
  import { component, state } from 'paintor'

  // Create a component
  const app = component((x) => {
    // Use a local state
    const localState = state({ clicks: 0 })

    // Build a hyperscript markup
    x.div(
      x.button({ onClick: () => localState.clicks++ }, 'Click me'),
      x.div(() => localState.clicks)
    )
  })

  // Render the component
  app.paint('#app')
</script>
```

## Server Usage

To generate HTML code on the server, use `html()`.

::: info
`html()` can be used in the browser as well.
:::

```js
import { component } from 'paintor'

const app = component((x) => {
  x.div('Hello')
})

const htmlCode = app.html()
// htmlCode: <div>Hello</div>
```

::: warning
`state()` is useless when generating HTML code.
:::