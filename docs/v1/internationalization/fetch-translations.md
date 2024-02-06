---
title: Fetch Translations
---


# Fetch Translations

::: warning
Translations are experimental in Paintor and their implementation may change!
:::

## Basic Usage

For the browser there is a function `fetchTranslations()` that would try to
fetch one or more remote translations. It accepts string arguments, which should
be the paths to existing translations. Then, the fetched translations are used
in `useTranslations()`, as shown below:

```js
import { component, fetchTranslations } from 'paintor'

const translations = await fetchTranslations('/path/to/en.js')

component(/* ... */).useTranslations(tranlstions).paint('#container')
```

::: warning
`fetchTranslations()` would not work properly in server environment.
:::

## How Fetching Works?

Let's say you have English and Italian translations in folder `/translations`.
There should be two files with there:

::: code-group
```js [/translations/en.js]
export default {
  hello: 'Hello'
}
```
```js [/translations/it.js]
export default {
  hello: 'Ciao'
}
```
:::

It is necessary for the files to have names that are valid
[Language Codes](https://www.w3schools.com/tags/ref_language_codes.asp).
It is also necessary for the files to export their translation Object as a
default export.

Now use `fetchTranslations()` like this, pointing to the default translation:

```js
const translations = await fetchTranslations('/translations/en.js')
```

`fetchTranslations()` gets the user's language code from the `lang` attribute
of the `html` tag, and replaces the file name in the path with the that
language code.

```html
<!DOCTYPE html>
<html lang="en">
...
</html>
```

If the user's language code is 'it', then the file that will be imported will be
changed to `/translations/it.js`.

`fetchTranslations()` uses `import()` to import the file. If the import fails,
it will try to import the default file instead. In our example this is
`/translations/en.js`.
