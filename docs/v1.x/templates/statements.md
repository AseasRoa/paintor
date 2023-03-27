::: warning
There is no support for the HTML-syntax for the following statements.
:::

## if-statement

In the [Template Tree](template-tree.md) there is an `if` method, which has three arguments:

- condition - A boolean variable.
- handler - A callback that will be executed when the condition is `true`.
- else-handler - A callback that will be executed when the condition is `false`.

```js
const loggedIn = true;

$.div(
  $.if(
    loggedIn, // condition
    () => $.span('You are logged-in'), // handler
    () => $.span('You are not logged-in') // else-handler
  )
)
```

If `loggedIn` is `true`, the result will be:
```html
<div>
  <span>You are logged-in</span>
</div>
```
If `loggedIn` is `false`, the result will be:
```html
<div>
  <span>You are not logged-in</span>
</div>
```

## for-statement

In the [Template Tree](template-tree.md) there is a `for` method, which has three arguments:

- from - This is the index of the first iteration, an integer value.
- to - This is the index of the last iteration, an integer value.
- handler - A callback that will be executed on each iteration. It has one argument for the
iteration index.

```js
$.ul(
  $.for(
    1, // from (inclusive)
    3, // to (inclusive)
    (index) => $.li(index), // handler
  )
)
```
```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
```

If `from` is the bigger number, the iteration happens in reverse order:

```js
$.ul(
  $.for(
    3, // from (inclusive)
    1, // to (inclusive)
    (index) => $.li(index), // handler
  )
)
```
```html
<ul>
  <li>3</li>
  <li>2</li>
  <li>1</li>
</ul>
```

## forEach-statement

In the [Template Tree](template-tree.md) there is a `forEach` method, which has two arguments:

- input - Could be Object, [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
  , Array or [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
  .
- handler - A callback that will be executed on each iteration.

#### forEach-statement with Object input

```js
const object = {
  html: 'HyperText Markup Language',
  css: 'Cascading Style Sheets',
  js: 'JavaScript'
}

$.ul(
  $.forEach(
    object, // Object input
    (value, key) => $.li(`${key} - ${value}`), // handler
  )
)
```
```html
<ul>
  <li>html - HyperText Markup Language</li>
  <li>css - Cascading Style Sheets</li>
  <li>js - JavaScript</li>
</ul>
```

#### forEach-statement with Map input

```js
const map = new Map()

map.set('de', 'Germany')
map.set('fr', 'France')
map.set('it', 'Italy')

$.ul(
  $.forEach(
    map, // Map input
    (value, key) => $.li(`${key} - ${value}`), // handler
  )
)
```
```html
<ul>
  <li>de - Germany</li>
  <li>fr - France</li>
  <li>it - Italy</li>
</ul>
```

#### forEach-statement with Array input

```js
const array = ['Zero', 'One', 'Two']

$.ul(
  $.forEach(
    array, // Array input
    (value, index) => $.li(`${index}: ${value}`), // handler
  )
)
```
```html
<ul>
  <li>0: Zero</li>
  <li>1: One</li>
  <li>2: Two</li>
</ul>
```

#### forEach-statement with Set input

```js
const set = new Set()

set.add('Screwdriver')
set.add('Hammer')
set.add('Pliers')

$.ul(
  $.forEach(
    set, // Set input
    (value) => $.li(value), // handler
  )
)
```
```html
<ul>
  <li>Screwdriver</li>
  <li>Hammer</li>
  <li>Pliers</li>
</ul>
```
