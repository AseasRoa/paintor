---
title: Template Tree Statements
---

# Template Tree Statements

In the Template Tree you can use few special statements. Their names start with
`$` to differentiate them from the methods used to create HTML elements.

::: warning
There is no support for the HTML-syntax for the following statements.
:::

## `$if` statement

It has three arguments:

- **condition** - A boolean variable.
- **handler** - A callback that will be executed when the condition is `true`.
- **else-handler** - A callback that will be executed when the condition is
  `false`.

```js
const loggedIn = true

x.div(
  x.$if(
    loggedIn, // condition
    () => x.span('You are logged-in'), // handler
    () => x.span('You are not logged-in') // else-handler
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

## `$repeat` statement

It has three arguments:

- **from** - This is the index of the first iteration, an integer value.
- **to** - This is the index of the last iteration, an integer value.
- **handler** - A callback that will be executed on each iteration. It has one
  argument for the iteration index.

```js
x.ul(
  x.$repeat(
    1, // from (inclusive)
    3, // to (inclusive)
    (index) => x.li(index), // handler
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
x.ul(
  x.$repeat(
    3, // from (inclusive)
    1, // to (inclusive)
    (index) => x.li(index), // handler
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

## `$each` statement

It has two arguments:

- **input** - Could be Object, Map, Array, Set or [State](../reactivity/states.md).
- **handler** - A callback that will be executed for each value of the input
  object.
- **handler (on empty input object)** - A callback that will be executed when
  the input object is empty.

### `$each` statement with `Object` input

```js
const object = {
  html: 'HyperText Markup Language',
  css: 'Cascading Style Sheets',
  js: 'JavaScript'
}

x.ul(
  x.$each(
    object, // Object input
    (value, key) => x.li(`${key} - ${value}`), // handler
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

### `$each` statement with `Map` input

```js
const map = new Map()

map.set('de', 'Germany')
map.set('fr', 'France')
map.set('it', 'Italy')

x.ul(
  x.$each(
    map, // Map input
    (value, key) => x.li(`${key} - ${value}`), // handler
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

### `$each` statement with `Array` input

```js
const array = ['Zero', 'One', 'Two']

x.ul(
  x.$each(
    array, // Array input
    (value, index) => x.li(`${index}: ${value}`), // handler
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

### `$each` statement with `Set` input

```js
const set = new Set()

set.add('Screwdriver')
set.add('Hammer')
set.add('Pliers')

x.ul(
  x.$each(
    set, // Set input
    (value) => x.li(value), // handler
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

### `$each` with State input

A [State](../reactivity/states.md) is just like an Object or an Array, but reactive.
`$each` will keep up with the changes of the State, so when elements are
being added or removed from the State, the rendered view will change
accordingly.

For now everything looks familiar. But if we push a new element, the interesting
happens - a new \<li\> element is being reactively created into the \<ul\>
element.

```js
arrayState.push('Three')
```
```html
<ul>
  <li>0: Zero</li>
  <li>1: One</li>
  <li>2: Two</li>
  <li>3: Three</li>
</ul>
```

## `$state` statement

`$state` is explained [here](../reactivity/using-$state.md).
