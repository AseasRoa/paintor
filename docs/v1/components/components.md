---
title: Components
---

<script setup>
  import { onMounted } from 'vue'
  
  onMounted(async () => {
    await import('./components-1.js')
    await import('./components-parameters.css')
    await import('./components-parameters.js')
  })
</script>

# Components

Components are independent and reusable pieces of UI.

## Create Components

Components are created using the `component()` function. `component()` accepts
one or more arguments (templates or components), and returns utility functions
used to display the result.

The input arguments can be provided like this:
```js
component(arg1, arg1, arg3)
```
or like this, in an Array:
```js
component([ arg1, arg1, arg3 ])
```

`component()` returns a function `paint()`, which is used to render the result
in an HTML element with id `app`:

::: code-group
```js
import { component } from 'paintor'

component(/* ... */).paint('#app')
```
```html
<div id="app"></div>
```
:::

Or, with `html()` you can generate HTML code:

::: code-group
```js
import { component } from 'paintor'

const htmlCode = component(/* ... */).html()
```
:::

### From Templates

Create one or more templates with `template()` and then use them in
`component()` like this:

::: code-group
```js
import { component, template } from 'paintor'

const templateOne = template((x) => {/* ... */})
const templateTwo = template((x) => {/* ... */})

component(
  templateOne,
  templateTwo
).paint('#app')
```
```html
<div id="app"></div>
```
:::

### From Template Functions

In this case `template()` can be omitted:

::: code-group
```js
import { component } from 'paintor'

component(
  (x) => {/* ... */},
  (x) => {/* ... */}
).paint('#app')
```
```html
<div id="app"></div>
```
:::

### From Components

Instead of templates, you can use other components. But note that it's not
a good practice to have two or more `component()` usages in a single file.

::: code-group
```js
import { component } from 'paintor'

const componentOne = component(/* ... */)
const componentTwo = component(/* ... */)

const app = component(
  componentOne,
  componentTwo
)

app.paint('#app')
```
```html
<div id="app"></div>
```
:::

### Mixed

::: code-group
```js
import { component, template } from 'paintor'

const myComponent = template(/* ... */)
const myTemplate = component(/* ... */)

const app = component(
  myComponent,
  myTemplate
)

app.paint('#app')
```
```html
<div id="app"></div>
```
:::

## Components in Templates

You can also use components in templates:

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

## With Parameters

`component()` accepts not only templates and components, but also functions,
returning templates or components. This allows us to use parameters.
Also, we can move the component in its own file.

::: code-group
<<< @/./components/components-parameters.js [app.js]
<<< @/./components/ProfileCard.js [ProfileCard.js]
<<< @/./components/components-parameters.css [CSS]
```html [HTML]
#oneCard
<div id="oneCard"></div>

#manyCards
<div id="manyCards"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  #oneCard
  <div id="oneCard"></div>

  #manyCards
  <div id="manyCards"></div>
</div>
