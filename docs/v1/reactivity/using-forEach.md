---
title: Using forEach()
---

<script setup>
  import { onMounted } from 'vue'
  
  onMounted(async () => {
    await import('./using-forEach-1.js')
    await import('./using-forEach-2.js')
    await import('./using-forEach-3.js')
    await import('./using-forEach-4.js')
    await import('./using-forEach-5.js')
  })
</script>

# Using forEach()

`forEach()` is a method, used in the [Template Tree](../templates/template-tree.md).

`forEach()` accepts a state as an input, and it has a callback that is called once for each element
of the state, so you can render the same pattern of DOM elements for each element of the state.
In the callback you can access the key-value pair.

```js
$.forEach(myState, (value, key) => {
  // ...
})
```

There is also one more callback to handle the case when the state is empty.

The reactivity happens when you can add or remove elements from the state,
which in turn will add or remove elements from the DOM.

## Add and Remove Elements

The following example shows the process of adding and removing values in a state. In the
beginning there is an empty Array state. On every second a new item is pushed into the array.
When the values become 10, they are cleared, and everything starts from the beginning.

::: code-group
<<< @/./reactivity/using-forEach-1.js [JavaScript]
```html [HTML]
<div id="using-foreach-1"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="using-foreach-1"></div>
</div>

## Primitive Values are Not Reactive in forEach()

When the value passed in the callback of `forEach()` is a primitive value
(string, boolean, number), this value will not bring reactivity:

::: code-group
<<< @/./reactivity/using-forEach-2.js [JavaScript]
```html [HTML]
<div id="using-foreach-2"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="using-foreach-2"></div>
</div>

## Automatic Order of the Elements

### Object with numeric keys

In JavaScript, if you dynamically add numeric keys to an Object, they are automatically sorted.
The Object behaves like an Array in this case: 

```js
const myObject = { 1: 'One', 3: 'Three'}
myObject[2] = 'Two'

// myObject is now sorted by its keys: { 1: 'One', 2: 'Two', 3: 'Three' }
```

This automatic sorting behavior is reflected in Paintor. Below we have an Object state with numeric
keys and 5 values, which are initially rendered into 5 different buttons. Click on any button, and
this will cause its origin value in the state to be deleted, which in turn will delete the
\<button\> itself. But after 1 second, in the `setTimeout()` callback the deleted value will be
re-created, which in turn will create a new \<button\>. This new \<button\> will take the same
place where the previous \<button\> was.

::: code-group
<<< @/./reactivity/using-forEach-3.js [JavaScript]
```html [HTML]
<div id="using-foreach-3"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="using-foreach-3"></div>
</div>

### Array

In JavaScript, this is what happens when we use the `delete` keyword to delete element from an
Array:

```js
const myArray = [ '0', '1', '2' ]
delete myArray[1]

// myArray is now: [ '0', empty, '2' ]
```

The behavior in Paintor is similar. Just like the example with the Object, when you click on any
button, it will be re-created at the same place after 1 second:

::: code-group
<<< @/./reactivity/using-forEach-4.js [JavaScript]
```html [HTML]
<div id="using-foreach-4"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="using-foreach-4"></div>
</div>

## Applying Array Mutating Methods Over Array State

In JavaScript there are multiple [methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
to manipulate an Array. Some of them are mutating the input Array. These methods also work on a
state Array:

- copyWithin()
- push()
- reverse()
- shift()
- pop()
- sort()
- splice()
- unshift()

::: info
When using `sort()`, all DOM elements will be repainted. 
:::

## Render Elements on Empty State

::: code-group
<<< @/./reactivity/using-forEach-5.js [JavaScript]
```html [HTML]
<div id="using-foreach-5"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="using-foreach-5"></div>
</div>
