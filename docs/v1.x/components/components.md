<script> import '/./components/components.js' </script>

## Create a Component with component()

`component()` returns an instance of a class called 'Component', which can be used as an input to
another `component()` function.

::: code-group
```js [Pass as Arguments]
import { component } from '/assets/paintor.js'

const componentOne = component(/* ... */)
const componentTwo = component(/* ... */)

const app = component(
  componentOne,
  componentTwo
)

app.paint('#app')
```
```js [Pass as an Array]
import { component } from '/assets/paintor.js'

const componentOne = component(/* ... */)
const componentTwo = component(/* ... */)

const app = component([
  componentOne,
  componentTwo
])

app.paint('#app')
```
:::

Or, you can use instances of the 'Component' class in [Templates](../templates/what-are-templates.md).

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

Each component can have its own internal state if `state()` is used inside the template:

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
