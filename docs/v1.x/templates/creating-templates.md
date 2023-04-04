## Single Template

In the example below, the anonymous function used as an argument in `component()` is a **template**.
In its body, it contains the data necessary to build the view.

```js
import { component } from 'paintor'

component(($) => {
  $.div('Hello, World')
}).paint('#container')
```

The template function has an argument, which in the example above is named `$`, but any other
variable name can be used, it's a matter of choice.

The template function can be defined outside, like this:

```js
import { component, template } from '/assets/paintor.js'

const myTemplate = template(($) => {
  /* ... */
})

component(myTemplate).paint('#container')
```

::: info
Technically `template()` is not required, as it simply returns the input function.
However, it infers the necessary TypeScript types, which makes everything type safe and provides for
code completion, without the need to write any types.
:::

## Multiple Templates

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
