---
head:
  - - script
    - src: ./add-remove-elements-1.js
      type: module
  - - script
    - src: ./add-remove-elements-2.js
      type: module
  - - script
    - src: ./add-remove-elements-3.js
      type: module
  - - script
    - src: ./add-remove-elements-4.js
      type: module
  - - script
    - src: ./add-remove-elements-5.js
      type: module
---

## Add and Remove Elements, forState() explained

In JavaScript you can add or remove elements from an Array or an Object. In Paintor you can
dynamically add or remove elements in the DOM when adding or removing elements from a State.

To dynamically visualize the contents of a State, `forState()` is used. `forState()` is very similar
to `forEach()`, but `forEach()` would only print the contents once.

The following example shows the process of adding and removing values in a State. In the
beginning there is an empty Array State. On every second a new item is pushed into the array.
When the values become 10, they are cleared, and everything starts from the beginning.

::: code-group
<<< @/./reactivity/add-remove-elements-1.js [JavaScript]
```html [HTML]
<add-remove-elements-1></add-remove-elements-1>
```
:::

<div class="example">
  <p></p>
  <add-remove-elements-1></add-remove-elements-1>
  <p></p>
</div>

## Primitive values are not reactive in forState()

When the value passed in the callback of `forState()` (and `forEach`) is a primitive value
(string, boolean, number), this value will not bring reactivity:

::: code-group
<<< @/./reactivity/add-remove-elements-2.js [JavaScript]
```html [HTML]
<add-remove-elements-2></add-remove-elements-2>
```
:::

<div class="example">
  <p></p>
  <add-remove-elements-2></add-remove-elements-2>
  <p></p>
</div>

## Elements Automatic Order

### Object with numeric keys

In JavaScript, if you dynamically add numeric keys to an Object, they are automatically sorted.
The Object behaves like an Array in this case: 

```js
const myObject = { 1: 'One', 3: 'Three'}
myObject[2] = 'Two'

// myObject is now sorted by its keys: { 1: 'One', 2: 'Two', 3: 'Three' }
```

This automatic sorting behavior is reflected in Paintor. Below we have an Object State with numeric
keys and 5 values, which are initially rendered into 5 different buttons. Click on any button, and
this will cause its origin value in the State to be deleted, which in turn will delete the
\<button\> itself. But after 1 second, in the `setTimeout()` callback the deleted value will be
re-created, which in turn will create a new \<button\>. And this new \<button\> will take the same
place where the previous \<button\> was.

::: code-group
<<< @/./reactivity/add-remove-elements-3.js [JavaScript]
```html [HTML]
<add-remove-elements-3></add-remove-elements-3>
```
:::

<div class="example">
  <p></p>
  <add-remove-elements-3></add-remove-elements-3>
  <p></p>
</div>

### Array

In JavaScript, this is what happens when we use the `delete` keyword to delete an element from an
Array:

```js
const myArray = [ '0', '1', '2' ]
delete myArray[1]

// myArray is now: [ '0', empty, '2' ]
```

The behavior in Paintor is similar. And just like the example with the Object, when you click on any
button, it will be re-created at the same place after 1 second:

::: code-group
<<< @/./reactivity/add-remove-elements-4.js [JavaScript]
```html [HTML]
<add-remove-elements-4></add-remove-elements-4>
```
:::

<div class="example">
  <p></p>
  <add-remove-elements-4></add-remove-elements-4>
  <p></p>
</div>

## Applying Array mutating methods over State Array

In JavaScript there are multiple [methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
to manipulate an Array. Some of them are mutating the input Array. These methods also work on a
State Array:

- copyWithin()
- push()
- reverse()
- shift()
- pop()
- sort()
- splice()
- unshift()

::: warning
When using `sort()`, all DOM elements will be repainted. 
:::

## Render elements on empty State

::: code-group
<<< @/./reactivity/add-remove-elements-5.js [JavaScript]
```html [HTML]
<add-remove-elements-5></add-remove-elements-5>
```
:::

<div class="example">
  <p></p>
  <add-remove-elements-5></add-remove-elements-5>
  <p></p>
</div>
