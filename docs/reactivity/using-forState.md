---
head:
  - - script
    - src: ./using-forState-1.js
      type: module
  - - script
    - src: ./using-forState-2.js
      type: module
---

## forState() Explained

`forState()` is a method, used in the [Template Tree](../templates/template-tree.md).

`forEach()` accepts a state as an input, and it has a callback that is called once.
In the callback you can access the input state, and you can render some DOM elements.

```js
$.forState(myState, (myState) => {
  // ...
})
```

The reactivity happens when you change the state itself - then the rendered DOM elements
are removed, the callback is called again and new DOM elements are rendered.

But how to change the state? If you have the state in a variable, and you set the variable to
something else, the variable is simply reassigned:

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
<<< @/./reactivity/using-forState-1.js [JavaScript]
```html [HTML]
<using-forstate-1></using-forstate-1>
```
:::

<div class="example">
  <p></p>
  <using-forstate-1></using-forstate-1>
  <p></p>
</div>

## `setState()` Example

::: code-group
<<< @/./reactivity/using-forState-2.js [JavaScript]
```html [HTML]
<using-forstate-2></using-forstate-2>
```
:::

<div class="example">
  <p></p>
  <using-forstate-2></using-forstate-2>
  <p></p>
</div>
