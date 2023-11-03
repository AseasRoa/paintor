---
head:
  - - script
    - src: ./components-1.js
      type: module
  - - script
    - src: ./components-2.js
      type: module
  - - script
    - src: ./components-3.js
      type: module
---

## Create a Component with component()

`component()` returns an instance of a class called 'Component', which can be used as an input to
another `component()` function.

::: code-group
```js [Pass as Arguments]
import { component } from 'paintor'

const componentOne = component(/* ... */)
const componentTwo = component(/* ... */)

const app = component(
  componentOne,
  componentTwo
)

app.paint('#app')
```
```js [Pass as an Array]
import { component } from 'paintor'

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
<<< @/./components/components-1.js [JavaScript]
```html [HTML]
<components-1></components-1>
```
:::

<div class="example">
  <p></p>
  <components-1></components-1>
  <p></p>
</div>

Or, you can do mixed.

## Reactivity

Each component can have its own internal state if `state()` is used inside the template:

::: code-group
<<< @/./components/components-2.js [JavaScript]
```html [HTML]
<components-2></components-2>
```
:::

<div class="example">
  <p></p>
  <components-2></components-2>
  <p></p>
</div>

::: code-group
<<< @/./components/components-3.js [JavaScript]
```html [HTML]
<components-3></components-3>
```
:::

<div class="example">
  <p></p>
  <components-3></components-3>
  <p></p>
</div>
