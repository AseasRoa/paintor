---
head:
  - - script
    - src: ./states-1.js
      type: module
  - - script
    - src: ./states-2.js
      type: module
  - - script
    - src: ./states-3.js
      type: module
  - - script
    - src: ./states-4.js
      type: module
  - - script
    - src: ./states-recursive.js
      type: module
  - - script
    - src: ./states-array.js
      type: module
---

## What is a State?

In Paintor, State is an object, whose values are bound to chosen parts of the web page. This means
that when you update the values of the State, the corresponding parts of the page are being
automatically updated.

To create a State, use the function `state()`. It takes an Array or an Object and returns a
[Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) of it.

## Object <--> State

This makes both, the original Object and the State bound together.
When the values of one change, the corresponding values of the other also change.

::: warning
`state()` is useless when generating HTML code, because the code is a string and is not
reactive.
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

But first, in order to achieve reactivity, here are few IMPORTANT things to remember:

- Although the State and the original Object are bound together, in the Template you should work
  with the State. For example, `myState.value` will be reactive, but `myObject.value` will not.
- Where you want to reactively get a value from the State, wrap it in a callback function. For
  example, use `() => myState.value` instead of `myState.value`.

### Change the DOM on State changes

Let's have two buttons, `-` and `+`, and a \<span\> element between them. Clicking on either button
going to change `myState.value`, which is bound with the text content of the \<span\> element.

::: code-group
<<< @/./reactivity/states-1.js [JavaScript]
```html [HTML]
<states-1></states-1>
```
:::

Click on the `-` and `+` buttons below to try it out:

<div class="example">
  <p></p>
  <states-1></states-1>
  <p></p>
</div>

### Change the State on DOM changes

Let's have `myState.text` and an input field from which `myState.text` can be changed.

::: code-group
<<< @/./reactivity/states-2.js [JavaScript]
```html [HTML]
<states-2></states-2>
```
:::

Type something in the input field below. You should see the same text that you are
typing on the right side of the input field, where the \<span\> is.

<div class="example">
  <p></p>
  <states-2></states-2>
  <p></p>
</div>

## States are Recursive

The inner objects and arrays of a state are also states:

::: code-group
<<< @/./reactivity/states-recursive.js [JavaScript]
```html [HTML]
<states-recursive></states-recursive>
```
:::

<div class="example">
  <p></p>
  <states-recursive></states-recursive>
  <p></p>
</div>

## One State in Many Templates

One State can serve multiple [Templates](../templates/what-are-templates.md) at the same time.

::: code-group
<<< @/./reactivity/states-3.js [JavaScript]
```html [HTML]
<!-- This will hold the button -->
<states-3-button></states-3-button>
<!-- This will hold the paragraph -->
<states-3-paragraph></states-3-paragraph>
<!-- This will hold the textarea -->
<states-3-textarea></states-3-textarea>
```
:::

<div class="example">
  <p></p>
  <states-3-button></states-3-button>
  <states-3-paragraph></states-3-paragraph>
  <states-3-textarea></states-3-textarea>
  <p></p>
</div>

## Many States in One Template

::: code-group
<<< @/./reactivity/states-4.js [JavaScript]
```html [HTML]
<states-4></states-4>
```
:::

<div class="example">
  <p></p>
  <states-4></states-4>
  <p></p>
</div>

## State from Array

::: code-group
<<< @/./reactivity/states-array.js [JavaScript]
```html [HTML]
<states-array></states-array>
```
:::

<div class="example">
  <p></p>
  <states-array></states-array>
  <p></p>
</div>
