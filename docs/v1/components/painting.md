---
title: Painting
---

# Painting

In the browser, one Component can be painted into one DOM element, or it can be
used to paint multiple DOM elements. It all depends on the argument, provided to
the `paint()` function.
The argument could be:

- String - then under the hood `querySelectorAll()` is applied.
- HTMLElement
- Array or HTMLElement
- HTMLCollection
- NodeList

## Paint One Element

In all three example below, we have only one \<div\> element with unique id
`myId`. Only this element is being selected in all examples, but in different
ways:

::: code-group
```html [Using a string]
<div id="myId"></div>

<script type="module">
  import { component } from 'paintor'

  component((x) => {
    /* ... */
  }).paint('#myId')
</script>
```
```html [Using querySelector()]
<div id="myId"></div>

<script type="module">
  import { component } from 'paintor'

  component((x) => {
    /* ... */
  }).paint(document.querySelector('#myId'))
</script>
```
```html [Using getElementById()]
<div id="myId"></div>

<script type="module">
  import { component } from 'paintor'

  component((x) => {
    /* ... */
  }).paint(document.getElementById('myId'))
</script>
```
:::

## Paint Multiple Elements

In this case, the same component will be painted over all elements with class
`myClass`.

::: code-group
```html [Using a string]
<div class="myClass"></div>
<div class="myClass"></div>
<div class="myClass"></div>

<script type="module">
  import { component } from 'paintor'

  component((x) => {
    /* ... */
  }).paint('.myClass')
</script>
```
```html [Using querySelectorAll()]
<div class="myClass"></div>
<div class="myClass"></div>
<div class="myClass"></div>

<script type="module">
  import { component } from 'paintor'

  component((x) => {
    /* ... */
  }).paint(document.querySelectorAll('.myClass'))
</script>
```
```html [Using getElementsByClassName()]
<div class="myClass"></div>
<div class="myClass"></div>
<div class="myClass"></div>

<script type="module">
  import { component } from 'paintor'

  component((x) => {
    /* ... */
  }).paint(document.getElementsByClassName('.myClass'))
</script>
```
:::

## Paint Custom Elements

In HTML, it's possible to create [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements),
which are part of the [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
technology. What is unique for them is that their styles are encapsulated.

Custom Elements have special tag names. Their names must be lower-case, at least
one dash is required, and the name must not start with a number.

Use the name of the Custom Element in `paint()`:

::: code-group
```html
<custom-element></custom-element>

<script type="module">
  import { component } from 'paintor'

  component((x) => {
    /* ... */
  }).paint('custom-element')
</script>
```
:::

Now if more Custom Elements with this name are created, Paintor will
automatically paint them all.
