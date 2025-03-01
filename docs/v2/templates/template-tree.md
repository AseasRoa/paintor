---
title: Template Tree
---

# Template Tree

In a template function, we have one special argument - the `x` argument in
the example below:

```js
import { template } from 'paintor'

template((tree) => {
  tree.div('Hello')
})
```

We will use this argument to create the HTML tree structure with JavaScript.
Some call this HyperScript.

```js
(x) => {
  x.table(
    x.thead(
      x.tr(
        x.td(/* ... */),
        x.td(/* ... */)
      )
    ),
    x.tbody(
      x.tr(
        x.td(/* ... */),
        x.td(/* ... */)
      )
    )
  )
}
```

The argument `x` (or however you name it) is an object, containing methods
for each valid HTML element. For example, `.div()` is for creating
`<div>` elements, `.p()` is for creating `<p>` elements, and so on. Each of
these methods accepts multiple arguments, used for creating text content or
child elements.

There are a few extra methods, such as:

- `.$element()` - for creating a custom element.
- `.$if()` - `if` statement.
- `.$repeat()` - iteration loop, starting with one number and ending with
  another.
- `.$each()` - to iterate over Array, Object, or [State](../reactivity/states).
- `.$state()` - to react on [State](../reactivity/states) changes.

## Argument Name

The argument name in the template function is arbitrary, it's your choice.

Here are few examples with different names:

::: code-group
```js [$]
($) => {
  $.table(
    $.tr(
      $.td('tr1 td1'),
      $.td('tr1 td2')
    ),
    $.tr(
      $.td('tr2 td1'),
      $.td('tr2 td2')
    )
  )
}
```
```js [_]
(_) => {
  _.table(
    _.tr(
      _.td('tr1 td1'),
      _.td('tr1 td2')
    ),
    _.tr(
      _.td('tr2 td1'),
      _.td('tr2 td2')
    )
  )
}
```
```js [L]
(L) => {
  L.table(
    L.tr(
      L.td('tr1 td1'),
      L.td('tr1 td2')
    ),
    L.tr(
      L.td('tr2 td1'),
      L.td('tr2 td2')
    )
  )
}
```
```js [l]
(l) => {
  l.table(
    l.tr(
      l.td('tr1 td1'),
      l.td('tr1 td2')
    ),
    l.tr(
      l.td('tr2 td1'),
      l.td('tr2 td2')
    )
  )
}
```
```js [o]
(o) => {
  o.table(
    o.tr(
      o.td('tr1 td1'),
      o.td('tr1 td2')
    ),
    o.tr(
      o.td('tr2 td1'),
      o.td('tr2 td2')
    )
  )
}
```
```js [x]
(x) => {
  x.table(
    x.tr(
      x.td('tr1 td1'),
      x.td('tr1 td2')
    ),
    x.tr(
      x.td('tr2 td1'),
      x.td('tr2 td2')
    )
  )
}
```
:::

The `$` symbol can be confusing, because of jQuery.

The `_` is minimalistic, but it also can be confusing, because of Underscore.

`L` kinda looks like stair steps when there are inner levels of elements.

`l` is similar to `L`, but more compact.

`o` is like a dot symbol.

`x` is faster to write with two hands, along with the `.` after it.

If you don't like to have such prefix, you can use the
[destructuring assignment](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
syntax:

```js
({ table, tr, td }) => {
  table(
    tr(
      td('Row 1, Column 1'),
      td('Row 1, Column 2'),
    )
  )
}
```

Or like this:
```js
(x) => {
  const { table, tr, td } = x

  table( 
    tr(
      td('Row 1, Column 1'),
      x.td('Row 1, Column 2'), // x. can still be used
    )
  )
}
```

While this may look clean, it may be unpleasant to write the destructured
objects and sort the constants in them. Also, it can be a mess if there are
other constants and variables around.

::: warning
Depending on the IDE you are using, code completion may not work properly
when destructuring.
:::

## Syntax Styles

### Free Style

You probably noticed that in the examples above the function calls in the
template function aren't entangled in any way. Other blocks of code can exist
in between:

```js
(x) => {
  /* ... JS code ... */
  
  x.h1('h1 element')

  /* ... JS code ... */
  
  x.h2('h2 element')

  /* ... JS code ... */
  
  x.h3('h3 element')

  /* ... JS code ... */
}
```

### Entangled Style

With this style, the elements live together within the same Array:

```js
(x) => [
  x.h1('h1 element'),
  x.h2('h2 element'),
  x.h3('h3 element'),
]
```
```html
<h1>h1 element</h1>
<h2>h2 element</h2>
<h3>h3 element</h3>
```

Or within a single element:

```js
(x) => $.div(
  x.h1('h1 element'),
  x.h2('h2 element'),
  x.h3('h3 element'),
)
```
```html
<div>
  <h1>h1 element</h1>
  <h2>h2 element</h2>
  <h3>h3 element</h3>
</div>
```
