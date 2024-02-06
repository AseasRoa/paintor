---
title: Components
---

<script setup>
  import { onMounted } from 'vue'
  
  onMounted(async () => {
    await import('./components-1.js')
  })
</script>

# Components

Components are independent and reusable pieces of UI.

## Create Components

Components are created using the `component()` function. `component()` accepts
one or more templates or components as arguments, and returns utility functions
used to display the result.

### From Templates

In the example below, the three templates will be rendered in the order they are
used in `component()`:

::: code-group
```js
import { component, template } from 'paintor'

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
).paint('#app')
```
```html
<div id="app"></div>
```
:::

`component()` also accepts an array of templates:

```js
/* ... */

component(
  [
    templateOne,
    templateTwo,
    templateThree
  ]
).paint('#app')
```

Obviously, `.paint()` is used to render the result in an HTML element with id
`app`.

### From Components

Or, instead of templates, you can use other components. But note that it's not
a good practice to have two or more `component()` usages in a single file.

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

### Mixed

You can also use Components in Templates:

::: code-group
<<< @/./components/components-1.js [JavaScript]
```html [HTML]
<div id="components-1"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="components-1"></div>
</div>
