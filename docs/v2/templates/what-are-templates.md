---
title: What are Templates?
---

# What are Templates?

Templates are functions, containing markup and JavaScript code, used by
[Components](../components/components.md) to build the view.

```js
import { template } from 'paintor'

template((x) => {
  x.div('Hello')
})
```

The `template()` function used in the example above is a helper that accepts
a single function and returns a `Template`. Technically, the input function
remains intact, only a little property is attached to it, so it can then be
recognized as a special `Template`.

`template()` also provides the typing information needed for the `x` argument.

Other JavaScript code can reside in the template function. For example, a local
[State](../reactivity/states.md):

::: code-group
```javascript
import { state, template } from 'paintor'

template((x) => {
  const localState = state({ clicks: 0 })

  x.div(
    x.button({ onClick: () => localState.clicks++ }, 'Click me'),
    x.div(() => localState.clicks)
  )
})
```
:::

## Template Tree (The Argument)

The template function has an argument, which in the examples above is named `x`.
This is the [Template Tree](./template-tree.md).
