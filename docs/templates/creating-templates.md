## One Template

In the example below, the anonymous function used as an argument in `compose()` is a **template**.
In its body, it contains the data necessary to build the view.

```js
import { compose } from 'paintor'

compose(($) => {
  $.div('Hello, World')
}).getHtml()
```

The template function has an argument, which in the example above is named `$`, but any other
variable name can be used, it's a matter of choice.

The template function can be defined outside, like this:

```js
import { compose, createTemplate } from '/path-to/paintor.js'

const template = createTemplate(($) => {
  /* ... */
})

compose(template).paint('#container')
```

::: info
`createTemplate()` has no internal logic, it directly returns the template function.
But it infers the necessary TypeScript types, which makes everything type safe and provides for
code completion, without writing any types.
:::

## Multiple Templates

One `compose()` function accepts multiple templates. In this case, the templates will be rendered
in the order they are used in `compose()`:

```js
import { compose, createTemplate } from '/path-to/paintor.js'

const templateOne = createTemplate(($) => {
  /* ... */
})

const templateTwo = createTemplate(($) => {
  /* ... */
})

const templateThree = createTemplate(($) => {
  /* ... */
})

compose(
  templateOne,
  templateTwo,
  templateThree
).paint('#container')
```

`compose()` also accepts an array of templates:
```js
/* ... */

compose(
  [
    templateOne,
    templateTwo,
    templateThree
  ]
).paint('#container')
```
