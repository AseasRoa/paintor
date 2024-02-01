## What are Components?

Components are independent and reusable pieces of UI.
Components are created using the `component()` function.

`component()` accepts one or more templates as arguments, and returns utility functions used to
display the result.

In the example below, the three templates will be rendered in the order they are used in
`component()`:

::: code-group
```js
import { component, template } from 'paintor'

const templateOne = template(($) => {
  /* ... */
})

const templateTwo = template(($) => {
  /* ... */
})

const templateThree = template(($) => {
  /* ... */
})

component(
  templateOne,
  templateTwo,
  templateThree
).paint('#app')
```
```html
<div id="app"></div>
```
:::

`component()` also accepts an array of templates:

```js
/* ... */

component(
  [
    templateOne,
    templateTwo,
    templateThree
  ]
).paint('#app')
```

Obviously, `.paint()` is used to render the result in an HTML element with id `app`.
