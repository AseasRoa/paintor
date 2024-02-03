---
title: Components
---

<script setup>
  import { onMounted } from 'vue'
  
  onMounted(async () => {
    await import('./components-1.js')
    await import('./components-2.js')
    await import('./components-3.js')
  })
</script>

# Components

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
<div id="components-1"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="components-1"></div>
</div>

Or, you can do mixed.

## Reactivity

Each component can have its own internal state if `state()` is used inside the template:

::: code-group
<<< @/./components/components-2.js [JavaScript]
```html [HTML]
<div id="components-2"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="components-2"></div>
</div>

::: code-group
<<< @/./components/components-3.js [JavaScript]
```html [HTML]
<div id="components-3"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="components-3"></div>
</div>
