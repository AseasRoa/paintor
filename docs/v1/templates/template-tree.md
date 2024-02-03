---
title: Template Tree
---

# Template Tree

The template tree is the HTML-like structure in a [Template](./what-are-templates.md),
built in JavaScript. Some call it HyperScript.

```js
// This function is a Template
($) => {
  // Use the $ argument to build a tree
  $.table(
    $.thead(
      $.tr(
        $.td(/* ... */),
        $.td(/* ... */)
      )
    ),
    $.tbody(
      $.tr(
        $.td(/* ... */),
        $.td(/* ... */)
      )
    )
  )
}
```
In a [Template](./what-are-templates.md) function, `$` is an instance of a class, containing a bunch
of methods. There is a method for each HTML element. For example, we have `$.a()`
for \<a\>, `$.p()` for \<p\>, `$.input()` for \<input\>, and so on.

These are a little bit special, they will be explained later:

- `$.html()`
- `$.script()`

There are a few extra functions, such as:

- `$.createElement()` - for creating a custom element.
- `$.if()` - `if` statement.
- `$.for()` - `for` iteration loop, starting with one number and ending with another.
- `$.forEach()` - to iterate over Array, Object, or [State](../reactivity/states).
- `$.forState()` - to react on [State](../reactivity/states) changes.

## Argument Name

The argument name in the template function doesn't matter, it's your choice. The following
two examples are doing exactly the same:

```js
($) => {
  $.h1('h1 element')
  $.h2('h2 element')
  $.h3('h3 element')
}
```
```js
(myTree) => {
  myTree.h1('h1 element')
  myTree.h2('h2 element')
  myTree.h3('h3 element')
}
```

## Syntax Styles

### Free Style

You probably noticed that in the examples above the function calls in the template function aren't
entangled in any way. Other blocks of code can exist in between:

```js
($) => {
  /* ... JS code ... */
  
  $.h1('h1 element')

  /* ... JS code ... */
  
  $.h2('h2 element')

  /* ... JS code ... */
  
  $.h3('h3 element')

  /* ... JS code ... */
}
```

### Entangled Style

With this style, the elements live together within the same Array:

```js
($) => [
  $.h1('h1 element'),
  $.h2('h2 element'),
  $.h3('h3 element'),
]
```
```html
<h1>h1 element</h1>
<h2>h2 element</h2>
<h3>h3 element</h3>
```

Or within a single element:

```js
($) => $.div(
  $.h1('h1 element'),
  $.h2('h2 element'),
  $.h3('h3 element'),
)
```
```html
<div>
  <h1>h1 element</h1>
  <h2>h2 element</h2>
  <h3>h3 element</h3>
</div>
```
