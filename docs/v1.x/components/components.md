<script> import '/./components/components.js' </script>

## What are Components?

Components are independent and reusable pieces of UI.

In Paintor, there are two ways to make components:
- With `compose()`
- With [Templates](../templates/creating-templates.md)

## Create a Component with compose()

`compose()` returns an instance of a class called 'Component', which can be used as an input to
another `compose()` function.

::: code-group
```js [Pass as Arguments]
import { compose } from '/assets/paintor.js'

const componentOne = compose(/* ... */)
const componentTwo = compose(/* ... */)

const app = compose(
  componentOne,
  componentTwo
)

app.paint('#app')
```
```js [Pass as an Array]
import { compose } from '/assets/paintor.js'

const componentOne = compose(/* ... */)
const componentTwo = compose(/* ... */)

const app = compose([
  componentOne,
  componentTwo
])

app.paint('#app')
```
:::

Or, you can use instances of the 'Component' class in [Templates](../templates/creating-templates.md).

::: code-group
<<< @/./components/components-in-templates.js [JavaScript]
```html [HTML]
<components-in-templates></components-in-templates>
```
:::

<div class="example">
  <p></p>
  <components-in-templates></components-in-templates>
  <p></p>
</div>

Or, you can do mixed.

## Reactivity

Each component can have its own internal state if `createState()` is used inside the template:

::: code-group
<<< @/./components/components-example-2.js [JavaScript]
```html [HTML]
<components-example-2></components-example-2>
```
:::

<div class="example">
  <p></p>
  <components-example-2></components-example-2>
  <p></p>
</div>

::: code-group
<<< @/./components/components-example-3.js [JavaScript]
```html [HTML]
<components-example-3></components-example-3>
```
:::

<div class="example">
  <p></p>
  <components-example-3></components-example-3>
  <p></p>
</div>
