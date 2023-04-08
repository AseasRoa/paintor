## What are Components?

Components are independent and reusable pieces of UI.

## Using Multiple Templates

One `component()` function accepts multiple templates. In this case, the templates will be rendered
in the order they are used in `component()`:

```js
import { component, template } from '/assets/paintor.js'

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
).paint('#container')
```

`component()` also accepts an array of templates:

```js
/* ... */

component(
  [
    templateOne,
    templateTwo,
    templateThree
  ]
).paint('#container')
```
