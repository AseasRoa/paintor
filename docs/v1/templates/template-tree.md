---
title: Template Tree
---

# Template Tree

The template tree is the HTML-like structure in a [Template](./what-are-templates.md),
built in JavaScript. Some call it HyperScript.

```js
// This function is a Template
(x) => {
  // Use the $ argument to build a tree
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
In a [Template](./what-are-templates.md) function, `x` is an instance of
a class, containing a bunch of methods. There is a method for each HTML element.
For example, we have `.a()` for \<a\>, `.p()` for \<p\>, `.input()` for
\<input\>, and so on.

These are a little bit special, they will be explained later:

- `.html()`
- `.script()`

There are a few extra functions, such as:

- `.createElement()` - for creating a custom element.
- `.if()` - `if` statement.
- `.for()` - `for` iteration loop, starting with one number and ending with
  another.
- `.forEach()` - to iterate over Array, Object, or [State](../reactivity/states).
- `.forState()` - to react on [State](../reactivity/states) changes.

## Argument Name

The argument name in the template function doesn't matter, it's your choice.
The following two examples are doing exactly the same:

```js
(x) => {
  x.h1('h1 element')
  x.h2('h2 element')
  x.h3('h3 element')
}
```
```js
(myTree) => {
  myTree.h1('h1 element')
  myTree.h2('h2 element')
  myTree.h3('h3 element')
}
```

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
