In Paintor, you can bind values from an Object with properties of different DOM elements.
So, when such value changes, it causes the property to which it is bound to change automatically,
and vice versa. This Object is then called a State.

## Object <--> State

To create a State, use the function `createState()`. It takes a regular Object and returns a
[Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
of it. This makes both, the original Object and the State bound together. When the values of one
change, the values of the other also change.

::: warning
`createState()` is useless when generating HTML code, because the code is a string and is not
reactive.
:::

::: code-group
```html [object -> state, increment 'state.count']
<script type="module">
  import { createState } from '/path-to/paintor.js'
  
  /* Create a State from an Object */
  const object = { count: 0 }
  const state = createState(object)
   
  /* Increment state.count on every second */
  setInterval(() => {
    state.count++
    console.log(`object.count: ${object.count} | state.count: ${state.count}`)
  }, 1000)
</script>
```
```html [object -> state, increment 'object.count']
<script type="module">
  import { createState } from '/path-to/paintor.js'
  
  /* Create a State from an Object */
  const object = { count: 0 }
  const state = createState(object)

  /* Increment object.count on every second */
  setInterval(() => {
	object.count++
    console.log(`object.count: ${object.count} | state.count: ${state.count}`)
  }, 1000)
</script>
```
:::

If we run either of these for 3 seconds, the output will be:

```bash
object.count: 1 | state.count: 1
object.count: 2 | state.count: 2
object.count: 3 | state.count: 3
```

When `state.count` is incremented, `object.count` is also incremented.

When `object.count` is incremented,`state.count` is also incremented.

## State <--> DOM

Now that we have a State, we can use it in a [Template](../templates/creating-templates) to bind
the State's values with the DOM.

But first, in order to achieve reactivity, here are few IMPORTANT things to remember:

- Although the State and the original Object are bound together, in the Template you should work
  with the State. For example, `state.value` would be reactive, but `object.value` not.
- Where you want to reactively get a value from the State, wrap it in a callback function. For
  example, use `() => state.value` instead of `state.value`.

### Change the DOM on State changes

Let's have two buttons, `-` and `+`, and a \<span\> element between them. With the buttons we
increment or decrement a value in `state`, which is bound to the text content of the \<span\>
element:

<script> import '/./reactivity/states.js' </script>

::: code-group
<<< @/./reactivity/states-example-1.js [JavaScript]
```html [HTML]
<states-example-1></states-example-1>
```
:::

Click on the `-` and `+` buttons below to try it out:

<div class="example">
  <p></p>
  <states-example-1></states-example-1>
  <p></p>
</div>

### Change the State on DOM changes

::: code-group
<<< @/./reactivity/states-example-2.js [JavaScript]
```html [HTML]
<states-example-2></states-example-2>
```
:::

Type something in the input field below. You should see the same text that you are typing on the
right side of the input field, where the \<span\> is.

<div class="example">
  <p></p>
  <states-example-2></states-example-2>
  <p></p>
</div>

## One State in many Templates

One State can serve multiple [Templates](../templates/creating-templates) at the same time.

::: code-group
<<< @/./reactivity/states-example-3.js [JavaScript]
```html [HTML]
<!-- This will hold the button -->
<states-example-3-button></states-example-3-button>
<!-- This will hold the paragraph -->
<states-example-3-paragraph></states-example-3-paragraph>
<!-- This will hold the textarea -->
<states-example-3-textarea></states-example-3-textarea>
```
:::

<div class="example">
  <p></p>
  <states-example-3-button></states-example-3-button>
  <states-example-3-paragraph></states-example-3-paragraph>
  <states-example-3-textarea></states-example-3-textarea>
  <p></p>
</div>

## Many States in one Template

::: code-group
<<< @/./reactivity/states-example-4.js [JavaScript]
```html [HTML]
<states-example-4></states-example-4>
```
:::

<div class="example">
  <p></p>
  <states-example-4></states-example-4>
  <p></p>
</div>

## Inner States

States are recursive.

::: code-group
<<< @/./reactivity/states-example-5.js [JavaScript]
```html [HTML]
<states-example-5></states-example-5>
```
:::

<div class="example">
  <p></p>
  <states-example-5></states-example-5>
  <p></p>
</div>

## State from Array

::: code-group
<<< @/./reactivity/states-example-array.js [JavaScript]
```html [HTML]
<states-example-array></states-example-array>
```
:::

<div class="example">
  <p></p>
  <states-example-array></states-example-array>
  <p></p>
</div>
