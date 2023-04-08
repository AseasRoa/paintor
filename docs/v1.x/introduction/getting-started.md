## Installation

#### Browser

There is a file `paintor.js` in `/dist`. It is an [ES Module](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules).

```js
<script type="module">
  import paintor from '/path/to/paintor.js'
</script>
```

#### Server

You can use Paintor in [Node.Js](https://nodejs.org). To install it:

::: code-group
```bash [npm]
npm install paintor
```
```bash [pnpm]
pnpm add paintor
```
```bash [yarn]
yarn add paintor
```
:::

Then import it:
```js
import paintor from 'paintor'
```

## Basic Usage

### In the Browser

Here is an example of a simple clicks counter. We have a `localState`, a \<button\> and a \<span\>.
When the \<button\> is clicked, it increments the `clicks` property of the state, and this property
is also displayed in the \<span\> element reactively:

```html
<div id="container"></div>

<script type="module">
  import { component, state } from '/assets/paintor.js'

  // Create a component
  const app = component(($) => {
    // Use a local state
    const localState = state({ clicks: 0 })

    // Build a hyperscript markup
    $.div(
      $.button({ onClick: () => localState.clicks++ }, 'Click me'),
      $.div(() => localState.clicks)
    )
  })

  // Render the component
  app.paint('#app')

</script>
```

### On the Server

On the server, `html()` is used instead of `paint()`:

```js
import { component } from 'paintor'

const app = component(($) => {
  $.div('Hello')
})

const htmlCode = app.html()
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


## The Main Functions

```js
import paintor from 'paintor'
```

`paintor` is an object, containing the following functions:
- `component()`
- `state()`
- `template()`
- `fetchTranslations()`

and a class, which can be used to make class components, or as a type:
- `Component`

All of these can also be imported as named imports:

```js
import {
  paintor,
  component,
  state,
  template,
  fetchTranslations,
  Component
} from 'paintor'
```

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
:::
