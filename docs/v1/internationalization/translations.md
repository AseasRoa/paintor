---
title: Translations
---

<script setup>
  import { onMounted } from 'vue'
  
  onMounted(async () => {
    await import('./translations-1.js')
    await import('./translations-2.js')
  })
</script>

# Translations

::: warning
Translations are experimental in Paintor and their implementation may change!
:::

Translations are just JavaScript Objects, containing key-value pairs of strings. Here is a basic
example:

::: code-group
<<< @/./internationalization/translations-1.js [JavaScript]
```html [HTML]
<div id="translations-1"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="translations-1"></div>
</div>

Multiple translation objects can be used. `useTranslations()` accepts one or more objects,
or an array of objects, or objects mixed with arrays of objects.

::: code-group

```js [Multiple objects]
const translationOne = { /* ... */ }
const translationTwo = { /* ... */ }

component(($) => {
  /* ... */
}).useTranslations(translationOne, translationTwo).paint('#container')
```

```js [Array of objects]
const translationOne = { /* ... */ }
const translationTwo = { /* ... */ }
const translations   = [translationOne, translationTwo]

component(($) => {
  /* ... */
}).useTranslations(translations).paint('#container')
```

```js [Mixed]
const translationOne   = { /* ... */ }
const translationTwo   = { /* ... */ }
const translationThree = { /* ... */ }
const translations     = [translationOne, translationTwo]

component(($) => {
  /* ... */
}).useTranslations(translations, translationThree).paint('#container')
```
:::

## What is translated?

- textContent
- innerText
- The `value` property of `<input type="button">`

::: code-group
<<< @/./internationalization/translations-2.js [JavaScript]
```html [HTML]
<div id="translations-2"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="translations-2"></div>
</div>
