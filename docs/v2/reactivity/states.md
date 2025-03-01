---
title: States
---

<script setup>
  import { onMounted } from 'vue'
  
  onMounted(async () => {
    await import('./states-scope-local.css')
    await import('./states-scope-local.js')
    await import('./states-scope-global.css')
    await import('./states-scope-global.js')

    await import('./states-1.css')
    await import('./states-1.js')
    await import('./states-2.js')
    await import('./states-one-in-many.js')
    await import('./states-many-in-one.js')
    await import('./states-array.js')
  })
</script>

# States

## What is a State?

In Paintor, State is an object, whose values are bound to chosen parts of the
web page. This means that when you update the values of the State, the
corresponding parts of the page are being automatically updated.

To create a State, use the function `state()`. It takes an Array or an Object
and returns a
[Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
of it.

## Object <--> State

This makes both, the original Object and the State bound together.
When the values of one change, the corresponding values of the other also
change.

::: warning
`state()` is useless when generating HTML code, because the code is a string
and is not reactive.
:::

::: code-group
```html [myObject -> myState, increment myState.count]
<script type="module">
  import { state } from 'paintor'
  
  /* Create a State from an Object */
  const myObject = { count: 0 }
  const myState = state(myObject)
   
  /* Increment myState.count on every second */
  setInterval(() => {
    myState.count += 1
    console.log(`myObject.count: ${myObject.count} | myState.count: ${myState.count}`)
  }, 1000)
</script>
```
```html [myObject -> myState, increment myObject.count]
<script type="module">
  import { state } from 'paintor'
  
  /* Create a State from an Object */
  const myObject = { count: 0 }
  const myState = state(myObject)

  /* Increment myObject.count on every second */
  setInterval(() => {
    myObject.count += 1
    console.log(`myObject.count: ${myObject.count} | myState.count: ${myState.count}`)
  }, 1000)
</script>
```
:::

If we run either of these for 3 seconds, the output will be:

```bash
myObject.count: 1 | myState.count: 1
myObject.count: 2 | myState.count: 2
myObject.count: 3 | myState.count: 3
```

## State <--> DOM

Now that we have a State, we can use it in a [Template](../templates/what-are-templates.md)
to bind the State's values with the DOM.

But first, in order to achieve reactivity, here are few IMPORTANT things to
remember:

- Although the State and the original Object are bound together, in the Template
  you should work with the State. For example, `myState.value` will be reactive,
  but `myObject.value` will not.
- Where you want to reactively get a value from the State, wrap it in a callback
  function. For example, use `() => myState.value` instead of `myState.value`.

### Change the DOM on State changes

Let's have two buttons, `-` and `+`, and a \<span\> element between them.
Clicking on either button going to change `myState.value`, which is bound with
the text content of the \<span\> element.

::: code-group
<<< @/./reactivity/states-1.js [JavaScript]
<<< @/./reactivity/states-1.css [CSS]
```html [HTML]
<div id="states-1"></div>
```
:::

Click on the `-` and `+` buttons below to try it out:

<Badge type="warning" text="example" />
<div class="example">
  <div id="states-1"></div>
</div>

### Change the State on DOM changes

Let's have `myState.text` and an input field from which `myState.text` can be
changed.

::: code-group
<<< @/./reactivity/states-2.js [JavaScript]
```html [HTML]
<div id="states-2"></div>
```
:::

Type something in the input field below. You should see the same text that you
are typing on the right side of the input field, where the \<span\> is.

<Badge type="warning" text="example" />
<div class="example">
  <div id="states-2"></div>
</div>

## Scope

### Local State

Each template can have its own local (internal) state:

::: code-group
<<< @/./reactivity/states-scope-local.js [JavaScript]
<<< @/./reactivity/states-scope-local.css [CSS]
```html [HTML]
<div id="states-scope-local"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="states-scope-local"></div>
</div>

### Global State

Or, the template can use states from upper scope. In this case, multiple
templates can use the same state.

::: code-group
<<< @/./reactivity/states-scope-global.js [JavaScript]
<<< @/./reactivity/states-scope-global.css [CSS]
```html [HTML]
<div id="states-scope-global"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="states-scope-global"></div>
</div>

## One State in Many Components

One State can serve multiple [Components](../components/components.md) at the same time.

::: code-group
<<< @/./reactivity/states-one-in-many.js [JavaScript]
```html [HTML]
<div id="states-one-in-many"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="states-one-in-many"></div>
</div>

## Many States in One Component

::: code-group
<<< @/./reactivity/states-many-in-one.js [JavaScript]
```html [HTML]
<div id="states-many-in-one"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="states-many-in-one"></div>
</div>

## State from Array

::: code-group
<<< @/./reactivity/states-array.js [JavaScript]
```html [HTML]
<div id="states-array"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="states-array"></div>
</div>
