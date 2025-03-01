---
title: Using $state()
---

<script setup>
  import { onMounted } from 'vue'
  
  onMounted(async () => {
    await import('./using-$state-1.js')
    await import('./using-$state-2.js')
  })
</script>

# Using $state()

::: info
`$state()` is a method, used in the [Template Tree](../templates/template-tree.md).
:::

`$state()` accepts a [State](./states.md) as an input, and it calls the provided
callback function once, so you can render some DOM elements, representing
the state. The callback function provides one argument - the input state.

```js
x.$state(myState, (myState) => {
  // ...
})
```

The reactivity happens when you change the state itself - then the rendered DOM
elements are removed, the callback is called again and new DOM elements are
rendered.

But how to change the state? If you have the state in a variable, and you set
the variable to something else, the variable is simply reassigned:

```js
import { state } from 'paintor'

let myState = state(['one'])

myState = ['two']
// At this point myState lost the reference to the state
// and points to the ['two'] array
```

One solution is to use a sub-state, because states are recursive:

```js
import { state } from 'paintor'

const myStates = state({ subState: ['one'] })

myStates.subState = ['two']
```

And the other solution is to use `setState()`:

```js
import { setState, state } from 'paintor'

let myState = state(['one'])

setState(myState, ['two'])
```

## Sub-State Example

::: code-group
<<< @/./reactivity/using-$state-1.js [JavaScript]
```html [HTML]
<div id="using-state-1"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="using-state-1"></div>
</div>

## `setState()` Example

::: code-group
<<< @/./reactivity/using-$state-2.js [JavaScript]
```html [HTML]
<div id="using-state-2"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="using-state-2"></div>
</div>
