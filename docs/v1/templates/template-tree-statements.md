---
title: Template Tree Statements
---

# Template Tree Statements

In the Template Tree you can make statements, such as **IF** or **FOR**.
All of them are explained below.

::: warning
There is no support for the HTML-syntax for the following statements.
:::

## `if` statement

In the [Template Tree](template-tree.md) there is an `if` method, which has
three arguments:

- **condition** - A boolean variable.
- **handler** - A callback that will be executed when the condition is `true`.
- **else-handler** - A callback that will be executed when the condition is
  `false`.

```js
const loggedIn = true

x.div(
  x.if(
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

## `for` statement

In the [Template Tree](template-tree.md) there is a `for` method, which has
three arguments:

- **from** - This is the index of the first iteration, an integer value.
- **to** - This is the index of the last iteration, an integer value.
- **handler** - A callback that will be executed on each iteration. It has one
  argument for the iteration index.

```js
x.ul(
  x.for(
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
  x.for(
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

## `forEach` statement

In the [Template Tree](template-tree.md) there is a `forEach` method,
which has two arguments:

- **input** - Could be Object, Map, Array, Set or [State](../reactivity/states.md).
- **handler** - A callback that will be executed for each value of the input
  object.
- **handler (on empty input object)** - A callback that will be executed when
  the input object is empty.

### `forEach` statement with `Object` input

```js
const object = {
  html: 'HyperText Markup Language',
  css: 'Cascading Style Sheets',
  js: 'JavaScript'
}

x.ul(
  x.forEach(
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

### `forEach` statement with `Map` input

```js
const map = new Map()

map.set('de', 'Germany')
map.set('fr', 'France')
map.set('it', 'Italy')

x.ul(
  x.forEach(
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

### `forEach` statement with `Array` input

```js
const array = ['Zero', 'One', 'Two']

x.ul(
  x.forEach(
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

### `forEach` statement with `Set` input

```js
const set = new Set()

set.add('Screwdriver')
set.add('Hammer')
set.add('Pliers')

x.ul(
  x.forEach(
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

### `forEach` with State input

A [State](../reactivity/states.md) is just like an Object or an Array, but
reactive.
`forEach` will keep up with the changes of the State, so when elements are
being added or removed from the State, the rendered view will change
accordingly.

Let's see an example for an Array-like State: 

::: code-group
```js
import { component, state } from 'paintor'

const arrayState = state(['Zero', 'One', 'Two'])

component((x) => {
  x.ul(
    x.forEach(
      arrayState,
      (value, index) => x.li(`${index}: ${value}`), // handler
    )
  )
}).paint('#app')
```
```html
<div id="app"></div>
```
:::
```html
<ul>
  <li>0: Zero</li>
  <li>1: One</li>
  <li>2: Two</li>
</ul>
```

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

## `forState` statement

`forState` is explained [here](../reactivity/using-forState.md).
