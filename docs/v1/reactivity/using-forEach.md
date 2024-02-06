---
title: Using forEach()
---

<script setup>
  import { onMounted } from 'vue'
  
  onMounted(async () => {
    await import('./using-forEach-add.css')
    await import('./using-forEach-add.js')

    await import('./using-forEach-update.css')
    await import('./using-forEach-update.js')

    await import('./using-forEach-remove.css')
    await import('./using-forEach-remove.js')

    await import('./using-forEach-automatic-order-object.js')
    await import('./using-forEach-automatic-order-array.js')
    await import('./using-forEach-on-empty-state.js')
  })
</script>

# Using forEach()

::: info
`forEach()` is a method, used in the [Template Tree](../templates/template-tree.md).
:::

`forEach()` accepts a [State](./states.md) as an input, and it calls the provided
callback function once for each element in the state. You can render the same
pattern of DOM elements for each element in the state. The callback function
provides two arguments - value and key.

```js
$.forEach(myState, (value, key) => {
  // ...
})
```

You can also use one extra callback function to handle the case when the state
is empty.

The reactivity happens when you add, update or remove elements from the state,
which in turn will add or remove elements from the DOM.

## Add Elements

In the example below there are 2 initial elements in the array state.
Click on the **Add** button to add more elements and see what happens.

::: code-group
<<< @/./reactivity/using-forEach-add.js [JavaScript]
<<< @/./reactivity/using-forEach-add.css [CSS]
```html [HTML]
<div id="using-foreach-add"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="using-foreach-add"></div>
</div>

Note that the existing DOM elements are not re-rendered. You can test this
if you change the values in the inputs and then add new elements - the inputs
will stay the same.

The behavior is the same when the state is an Object.

## Update Elements

Now let's try to update a value in the array state and see how that reflects on
the DOM. In the example below we have an array state with 3 elements.
Click on the **Update Middle** button to increment the middle value.

::: code-group
<<< @/./reactivity/using-forEach-update.js [JavaScript]
<<< @/./reactivity/using-forEach-update.css [CSS]
```html [HTML]
<div id="using-foreach-update"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="using-foreach-update"></div>
</div>

Only the middle \<li\> is being re-rendered.

The behavior is the same when the state is an Object.

## Remove Elements

::: code-group
<<< @/./reactivity/using-forEach-remove.js [JavaScript]
<<< @/./reactivity/using-forEach-remove.css [CSS]
```html [HTML]
<div id="using-foreach-remove"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="using-foreach-remove"></div>
</div>

The behavior is the same when the state is an Object.

## Automatic Order of the Elements

### Object with numeric keys

In JavaScript, if you dynamically add numeric keys to an Object, they are
automatically sorted.
The Object behaves like an Array in this case: 

```js
const myObject = { 1: 'One', 3: 'Three'}
myObject[2] = 'Two'

// myObject is now sorted by its keys: { 1: 'One', 2: 'Two', 3: 'Three' }
```

This automatic sorting behavior is reflected in Paintor. Below we have an
Object state with numeric keys and 5 values, which are initially rendered into
5 different buttons. Click on any button, and this will cause its origin value
in the state to be deleted, which in turn will delete the \<button\> itself.
But after 1 second, in the `setTimeout()` callback the deleted value will be
re-created, which in turn will create a new \<button\>. This new \<button\>
will take the same place where the previous \<button\> was.

::: code-group
<<< @/./reactivity/using-forEach-automatic-order-object.js [JavaScript]
```html [HTML]
<div id="using-foreach-automatic-order-object"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="using-foreach-automatic-order-object"></div>
</div>

### Array

In JavaScript, this is what happens when we use the `delete` keyword to delete
element from an
Array:

```js
const myArray = [ '0', '1', '2' ]
delete myArray[1]

// myArray is now: [ '0', empty, '2' ]
```

The behavior in Paintor is similar. Just like the example with the Object, when
you click on any button, it will be re-created at the same place after 1 second:

::: code-group
<<< @/./reactivity/using-forEach-automatic-order-array.js [JavaScript]
```html [HTML]
<div id="using-foreach-automatic-order-array"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="using-foreach-automatic-order-array"></div>
</div>

## Applying Array Mutating Methods Over Array State

In JavaScript there are multiple [methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
to manipulate an Array. Some of them are mutating the input Array. These methods
also work on an array state:

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
<<< @/./reactivity/using-forEach-on-empty-state.js [JavaScript]
```html [HTML]
<div id="using-foreach-on-empty-state"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="using-foreach-on-empty-state"></div>
</div>
