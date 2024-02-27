---
title: What are Templates?
---

# What are Templates?

Templates are functions, containing markup and JavaScript code, used by
[Components](../components/components.md) to build the view.
This is how a simple Template looks like:

```js
(x) => {
  x.div('Hello')
}
```

This function can't do anything by itself, it must be used in a
[Component](../components/components.md):

::: code-group
```javascript
import { component } from 'paintor'

const app = component((x) => {
  x.div('Hello')
})

app.paint('#app')
```
```html
<div id="app"></div>
```
:::

Other JavaScript code can reside in the template function. For example, a local
[State](../reactivity/states.md):

::: code-group
```javascript
import { component, state } from 'paintor'

const app = component((x) => {
  const localState = state({ clicks: 0 })

  x.div(
    x.button({ onClick: () => localState.clicks++ }, 'Click me'),
    x.div(() => localState.clicks)
  )
})

app.paint('#app')
```
```html
<div id="app"></div>
```
:::

The template function can be defined outside the
[Components](../components/components.md), like this:

::: code-group
```javascript
import { component, template } from 'paintor'

const myTemplate = template((x) => {
  /* ... */
})

component(myTemplate).paint('#app')
```
```html
<div id="app"></div>
```
:::

::: info
`template()` returns the input function. Technically it is not required to use
it, but it helps, because it infers the necessary TypeScript types, which makes
the code type safe and provides for code completion without the need to write
any types.
:::

## Template Tree (The Argument)

The template function has an argument, which in the examples above is named `x`.
This is the [Template Tree](./template-tree.md).
