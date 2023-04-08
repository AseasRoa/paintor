## What are Templates?

Templates are functions, containing markup and JavaScript code, used by [Components](../components/what-are-components.md)
to build the view. This is how a simple Template looks like:

```js
($) => {
  $.div('Hello')
}
```

This function can't do anything by itself, it must be used in a [Components](../components/what-are-components.md):

::: code-group
```javascript
import { component } from '/assets/paintor.js'

const app = component(($) => {
  $.div('Hello')
})

app.paint('#app')
```
```html
<div id="app"></div>
```
:::

Other JavaScript code can reside in the template function, a local [State](../reactivity/states.md)
for example:

::: code-group
```javascript
import { component, state } from '/assets/paintor.js'

const app = component(($) => {
  const localState = state({ clicks: 0 })

  $.div(
    $.button({ onClick: () => localState.clicks++ }, 'Click me'),
    $.div(() => localState.clicks)
  )
})

app.paint('#app')
```
```html
<div id="app"></div>
```
:::

The template function can be defined outside the [Components](../components/what-are-components.md),
like this:

::: code-group
```javascript
import { component, template } from '/assets/paintor.js'

const myTemplate = template(($) => {
  /* ... */
})

component(myTemplate).paint('#app')
```
```html
<div id="app"></div>
```
:::

::: info
`template()` is a helper function. Technically it is not required, as it simply returns the input
function. However, it infers the necessary TypeScript types, which makes everything type safe and
provides for code completion, without the need to write any types.
:::

## The Argument (Template Tree)

The template function has an argument, which in the examples above is named `$`. This is the [Template Tree](./template-tree.md).
