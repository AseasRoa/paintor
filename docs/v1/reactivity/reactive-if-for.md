---
title: Reactive if() and for()
---

<script setup>
  import { onMounted } from 'vue'
  
  onMounted(async () => {
    await import('./reactive-if.js')
    await import('./reactive-for.css')
    await import('./reactive-for.js')
  })
</script>

# Reactive if() and for()

::: info
`if()` and `for()` are methods, used in the [Template Tree](../templates/template-tree.md).
:::

::: warning
On reactive changes, `if()` and `for()` are always re-rendering the DOM
elements!
:::

## if()

The first argument in `if()` is the condition, which can be boolean value, or
a function, returning boolean value. When a state is used in that function,
`if()` becomes reactive.

::: warning
On reactive changes, `if()` is always re-rendering the DOM
elements!
:::

::: code-group
<<< @/./reactivity/reactive-if.js [JavaScript]
```html [HTML]
<div id="reactive-if"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="reactive-if"></div>
</div>

## for()

The first two arguments in `for()` are `from` and `to`. They both accept integer
values, or functions, returning integer values. When states are used in these
functions, they become reactive.

`from` and `to` are both inclusive. For example, if both are 0, the handler will
still be called once. However, if `from` or `to` is `NaN` (or a function,
returning `NaN`), the loop will be empty.

::: warning
On reactive changes, `for()` is always re-rendering the DOM
elements!
:::

::: code-group
<<< @/./reactivity/reactive-for.js [JavaScript]
```html [HTML]
<div id="reactive-for"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="reactive-for"></div>
</div>

*Hint: Change the numbers in the inputs.*
