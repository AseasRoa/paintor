<script> import '/./internationalization/translations.js' </script>

::: warning
Translations are experimental in Paintor and their implementation may change!
:::

## Translations

In Paintor, translations can be used to translate the rendered texts in different languages.
Translations are just JavaScript Objects, containing key-value pairs of strings. Here is a basic
example:

::: code-group
<<< @/./internationalization/translations-example-1.js [JavaScript]
```html [HTML]
<translations-example-1></translations-example-1>
```
:::

<div class="example">
  <p></p>
  <translations-example-1></translations-example-1>
  <p></p>
</div>

Multiple translation objects can be used. `useTranslations()` accepts one or more objects,
or an array of objects, or objects mixed with arrays of objects.

::: code-group
```js [Multiple objects]
const translationOne = { /* ... */ }
const translationTwo = { /* ... */ }

compose(($) => {
  /* ... */
}).useTranslations(translationOne, translationTwo).paint('#container')
```
```js [Array of objects]
const translationOne = { /* ... */ }
const translationTwo = { /* ... */ }
const translations = [ translationOne, translationTwo ]

compose(($) => {
  /* ... */
}).useTranslations(translations).paint('#container')
```
```js [Mixed]
const translationOne = { /* ... */ }
const translationTwo = { /* ... */ }
const translationThree = { /* ... */ }
const translations = [ translationOne, translationTwo ]

compose(($) => {
  /* ... */
}).useTranslations(translations, translationThree).paint('#container')
```
:::

## What is translated?

- textContent
- innerText
- The `value` property of `<input type="button">`

::: code-group
<<< @/./internationalization/translations-example-2.js [JavaScript]
```html [HTML]
<translations-example-2></translations-example-2>
```
:::

<div class="example">
  <p></p>
  <translations-example-2></translations-example-2>
  <p></p>
</div>
