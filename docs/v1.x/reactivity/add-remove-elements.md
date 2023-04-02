<script> import '/./reactivity/add-remove-elements.js' </script>

## Add and Remove Elements, forState() explained

As mentioned before, if you have an object with multiple values, you can use `forEach()` to
visualize them. However, what would happen if you add or remove value from the object?
Nothing, because the object is not a State. But if you have a State, with `forState()`
you can visualize the values in the State, and also dynamically add or remove values.

The following example shows the process of adding and removing values in a State. In the
beginning there is an empty Array State. On every second a new value is pushed into the array.
When the values become 10, they are cleared, and everything starts from the beginning.

::: code-group
<<< @/./reactivity/add-remove-elements-example-1.js [JavaScript]
```html [HTML]
<add-remove-elements-example-1></add-remove-elements-example-1>
```
:::

<div class="example">
  <p></p>
  <add-remove-elements-example-1></add-remove-elements-example-1>
  <p></p>
</div>

## The 'value' argument in forState()

`forState()` is very similar to `forEach()` in what it does, with a difference in the
`value` argument in the handler function. In `forState()`, the `value` is a function, wrapping the
original value.

In other words:

```js
const state = createState({ mouse: 'Jerry' })

compose(($) => {
  $.forEach(state, (value, key) => {
    // value is a string 'Jerry'
  })

  $.forState(state, (value, key) => {
    // value is a function like this:
    // () => state[key]
  })
})
```

So, because `value` is a function in `forState()`, this function needs to be called in order to get
the actual value out of it. But remember, such wrapping functions were needed for reactivity
anyway.

## Variants for working with the 'value' in forState()

::: code-group
<<< @/./reactivity/add-remove-elements-example-2.js [JavaScript]
```html [HTML]
<add-remove-elements-example-2></add-remove-elements-example-2>
```
:::

<div class="example">
  <p></p>
  <add-remove-elements-example-2></add-remove-elements-example-2>
  <p></p>
</div>

## Elements Automatic Order

### Object with numeric keys

In JavaScript, there is an interesting auto-sorting behavior when dynamically adding numeric keys in
an Object: 

```js
const myObject = { 1: 'One', 3: 'Three'}
myObject[2] = 'Two'

// myObject is now sorted by its keys: { 1: 'One', 2: 'Two', 3: 'Three' }
```

This auto-sorting behavior happens in Paintor with the DOM elements as well. Below we have an Object
State with numeric keys and 5 values, which are initially rendered into 5 different buttons. Click
on any button, and this will cause its origin value in the State to be deleted, which in turn will
delete the \<button\> itself. But after 1 second, in the `setTimeout()` callback the deleted value
will be re-created, which in turn will create a new \<button\>. And this new \<button\> will take
the same place where the previous \<button\> was.

::: code-group
<<< @/./reactivity/add-remove-elements-example-3.js [JavaScript]
```html [HTML]
<add-remove-elements-example-3></add-remove-elements-example-3>
```
:::

<div class="example">
  <p></p>
  <add-remove-elements-example-3></add-remove-elements-example-3>
  <p></p>
</div>

### Array

In JavaScript, this is what happens when we use the `delete` keyword to delete an element from an
Array:

```js
const myArray = [ '0', '1', '2' ]
delete myArray[1]

// myArray is now: [ '0', undefined, '2' ]
```

The behavior in Paintor is similar. And just like the example with the Object, when you click on any
button, it will be re-created at the same place after 1 second:

::: code-group
<<< @/./reactivity/add-remove-elements-example-4.js [JavaScript]
```html [HTML]
<add-remove-elements-example-4></add-remove-elements-example-4>
```
:::

<div class="example">
  <p></p>
  <add-remove-elements-example-4></add-remove-elements-example-4>
  <p></p>
</div>

## Applying Array mutating methods over State Array

In JavaScript there are multiple [methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
to manipulate an Array. Some of them are mutating the input Array, and they will also work on a
State Array:

- copyWithin()
- push()
- reverse()
- shift()
- pop()
- sort()
- splice()
- unshift()
