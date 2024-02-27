---
title: HTML Syntax
---

<script setup>
  import { onMounted } from 'vue'
  
  onMounted(async () => {
    await import('./html-syntax-1.js')
    await import('./html-syntax-2.js')
  })
</script>

# HTML Syntax

One of the methods in the [Template Tree](../templates/template-tree) is
`html()`. Although it may seem that it would produce \<html\> elements, this is
not the case. Here is how `html()` is used: 

```js
(x) => {
  x.html`<h3>This is HTML</h3>`
}
```

Note that the method is used as a [Tag Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates).
This is important.

## Characteristics

- **Code Highlighting**: The HTML code may not be highlighted if your IDE does 
  not support code highlighting in template literals.
- **Performance**: Internally, the HTML syntax is first converted into a
  [Template Tree](../templates/template-tree),
  and then it's rendered. This additional step obviously lowers the performance.
  However, if the template string is one piece, and you are not using
  translations, this could lead to better performance.
- **Type Safety**: For TypeScript this is just a string, you will not be warned
  you if you make a mistake in the HTML code.
- **Limited Capabilities**: Not all functionalities are supported, you can do
  more things with the JS syntax.

## Statements

::: warning
Statements for the HTML syntax are under development.
:::

## Reactivity

::: code-group
<<< @/./html-syntax/html-syntax-1.js [JavaScript]
```html [HTML]
<div id="html-syntax-1"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="html-syntax-1"></div>
</div>

## Translations

::: code-group
<<< @/./html-syntax/html-syntax-2.js [JavaScript]
```html [HTML]
<div id="html-syntax-2"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="html-syntax-2"></div>
</div>
