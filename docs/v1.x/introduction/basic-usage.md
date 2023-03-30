## Basic Usage

The idea is that we compose our view with one or more templates, which we then render into one or
more DOM element, or we can generate an HTML string. The templates may also use one or more states.

## In the Browser

Here is an example of a simple clicks counter. We have a `state`, a \<button\> and a \<span\>.
When the \<button\> is clicked, it increments the `clicks` property of the state, and this property
is also displayed in the \<span\> element reactively:

```html
<div id="container"></div>

<script type="module">
  import { compose, createState } from '/assets/paintor.js'
  
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

`compose()` accepts one or more callback functions, called [Templates](../templates/creating-templates.md), in which you
can build an HTML-like tree. `compose()` returns an instance of `Component`, which has the `paint()`
method, which renders the DOM elements and paints them into a DOM element with id "container".

It can be said that `compose()` returns a [Component](../components/components.md).

The following examples are all doing the same thing, only the syntax is different:

::: code-group
```js [named imports (recommended)]
import { compose, createTemplate, createState } from '/assets/paintor.js'

const state = createState(/* ... */)
const template = createTemplate(/* ... */)

compose(template).paint(/* ... */)
```
```js [named import]
import { paintor } from '/assets/paintor.js'

const state = paintor.createState(/* ... */)
const template = paintor.createTemplate(/* ... */)

paintor.compose(model).paint(/* ... */)
```
```js [default import]
import paintor from '/assets/paintor.js'

const state = paintor.createState(/* ... */)
const template = paintor.createTemplate(/* ... */)

paintor.compose(model).paint(/* ... */)
```
```js [new Component()]
import { createTemplate, createState, Component } from '/assets/paintor.js'

const state = createState(/* ... */)
const template = createTemplate(/* ... */)

new Component().compose(template).paint(/* ... */)
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
