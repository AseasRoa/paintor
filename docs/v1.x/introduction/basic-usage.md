## Basic Usage

The idea is that we component our view with one or more templates, which we then render into one or
more DOM element, or we can generate an HTML string. The templates may also use one or more states.

## In the Browser

Here is an example of a simple clicks counter. We have a `localState`, a \<button\> and a \<span\>.
When the \<button\> is clicked, it increments the `clicks` property of the state, and this property
is also displayed in the \<span\> element reactively:

```html
<div id="container"></div>

<script type="module">
  import { component, state } from '/assets/paintor.js'
  
  component(($) => {
    const localState = state({ clicks: 0 })

    $.div(
      $.button({ onClick: () => localState.clicks++ }, 'Click me'),
      $.span(() => localState.clicks)
    )
  }).paint('#container')

</script>
```

`component()` creates a [Component](../components/components.md). In its arguments it accepts:
- One or more callback functions, called [Templates](../templates/creating-templates.md), in which
  you can build an HTML-like tree. `component()` returns an instance of `Component`, which has
  `paint()` method, which renders the DOM elements and paints them into a DOM element with id
  "container".
- One or more `Component` instances.

`state()` creates a reactive version of the input Object.

The following examples are all doing the same thing, only the syntax is different:

::: code-group
```js [named imports (recommended)]
import { component, state, template } from '/assets/paintor.js'

const myState = state(/* ... */)
const myTemplate = template(/* ... */)

component(myTemplate).paint(/* ... */)
```
```js [named import]
import { paintor } from '/assets/paintor.js'

const myState = paintor.state(/* ... */)
const myTemplate = paintor.template(/* ... */)

paintor.component(myTemplate).paint(/* ... */)
```
```js [default import]
import paintor from '/assets/paintor.js'

const myState = paintor.state(/* ... */)
const myTemplate = paintor.template(/* ... */)

paintor.component(myTemplate).paint(/* ... */)
```
```js [new Component()]
import { state, template, Component } from '/assets/paintor.js'

const myState = state(/* ... */)
const myTemplate = template(/* ... */)

new Component().component(myTemplate).paint(/* ... */)
```
:::

The argument of `paint()` can be a [selector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)

## On the Server

On the server, `html()` is used instead of `paint()`:

```js
import { component } from 'paintor'

component(($) => {
  $.div('Hello, World')
}).html()
```

`html()` renders an HTML string:

```html
<div>Hello, World</div>
```

`html()` can be used in the browser as well.

::: warning
`state()` is useless when generating HTML code, because the code is a string and is not
reactive.
:::
