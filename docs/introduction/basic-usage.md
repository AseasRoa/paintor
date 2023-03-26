## Basic Usage

The idea is that we compose our view with one or more templates, which we render into a DOM element.
We can also use one or more states. We can also generate an HTML string instead of the whole view.

## In the Browser

Here is an example of a simple clicks counter. We have a `state`, a \<button\> and a \<span\>.
When the \<button\> is clicked, it increments the `clicks` property of the state, and this property
is also displayed in the \<span\> element reactively:

```html
<div id="container"></div>

<script type="module">
  import { compose, createState } from '/path-to/paintor.js'
  
  const state = createState({ clicks: 0 })

  compose(($) => {
    $.div(
      $.button({ onClick: () => state.clicks++ }, 'Click me'),
      $.span(() => state.clicks)
    )
  }).paint('#container')
</script>
```

`createState()` creates a reactive version of the input Object.

`compose()` accepts one or more callback functions, called **Templates**, in which you
can build an HTML-like tree. `compose()` returns an instance of `Paintor`, which has the `paint()`
method, which renders the DOM elements and paints them into a DOM element with id "container".

The following examples are all doing the same thing, only the syntax is different:

::: code-group
```js [named imports (recommended)]
import { compose, createTemplate, createState } from '/path-to/paintor.js'

const state = createState(/* ... */)
const template = createTemplate(/* ... */)

compose(template).paint(/* ... */)
```
```js [named import]
import { paintor } from '/path-to/paintor.js'

const state = paintor.createState(/* ... */)
const template = paintor.createTemplate(/* ... */)

paintor.compose(model).paint(/* ... */)
```
```js [default import]
import paintor from '/path-to/paintor.js'

const state = paintor.createState(/* ... */)
const template = paintor.createTemplate(/* ... */)

paintor.compose(model).paint(/* ... */)
```
```js [new Paintor()]
import { createTemplate, createState, Paintor } from '/path-to/paintor.js'

const state = createState(/* ... */)
const template = createTemplate(/* ... */)

new Paintor().compose(template).paint(/* ... */)
```
:::

The argument of `paint()` can be a [selector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)

## On the Server

On the server, `getHtml()` is used instead of `paint()`:

```js
import { compose } from 'paintor'

compose(($) => {
  $.div('Hello, World')
}).getHtml()
```

`getHtml()` renders an HTML string:

```html
<div>Hello, World</div>
```

`getHtml()` can be used in the browser as well.

::: warning
`createState()` is useless when generating HTML code, because the code is a string and is not
reactive.
:::
