---
title: Template Tree Elements
---

# Template Tree Elements

## The Argument

The argument `x` (or however you name it) is an instance of a class, containing
methods for each valid HTML element. For example, `.div()` is for creating
\<div\> elements, `.p()` is for creating \<p\> elements, and so on. Each of
these methods accepts multiple arguments, used for creating text content or
child elements.

Here is an example of a simple table with one row and two columns:

```js
(x) => {
  x.table(
    x.tr(
      x.td('Row 1, Column 1'),
      x.td('Row 1, Column 2'),
    )
  )
}
```
```html
<table>
  <tr>
    <td>Row 1, Column 1</td>
    <td>Row 1, Column 2</td>
  </tr>
</table>
```

## Element Properties (The First Argument)

The first argument also accepts and object, containing global element properties
(id, class...) and element-specific properties:
```js
(x) => {
  x.a(
    {
      class: 'anchors', // "class" is valid for all elements
      href: 'https://github.com/' // "href" is specific for <a> elements
    },
    'Go to GitHub'
  )
}
```
```html
<a>Go to GitHub</a>
```

If the properties object is not the first argument, it is not honored.
The following is NOT valid:

```js
(x) => {
  x.a(
    'Go to GitHub',
    { href: 'https://github.com/' } // Doesn't work if not the first argument!
  )
}
```
```html
<a>Go to GitHub</a>
```

By the way, you can pass the text content as a `textContent` property,
or as a second argument:

```js
(x) => {
  x.a({ href: 'https://github.com/', textContent: 'Go to GitHub' })
  x.a({ href: 'https://github.com/' }, 'Go to GitHub')
}
```
```html
<a href="https://github.com/">Go to GitHub</a>
<a href="https://github.com/">Go to GitHub</a>
```

## Text Content and Child Elements

Each argument can be any of the following.

### Text

```js
(x) => {
  x.div('text')
}
```
```html
<div>text</div>
```

### Number

```js
(x) => {
  x.div(123456)
}
```
```html
<div>123456</div>
```

### Child Elements

```js
(x) => {
  x.ul(
    x.li('List Item 1'),
    x.li('List Item 2'),
    x.li('List Item 3'),
  )
}
```
```html
<ul>
  <li>List Item 1</li>
  <li>List Item 2</li>
  <li>List Item 3</li>
</ul>
```

### Array of Child Elements

```js
(x) => {
  x.ul(
    [
      x.li('List Item 1'),
      x.li('List Item 2'),
      x.li('List Item 3'),
    ]
  )
}
```
```html
<ul>
  <li>List Item 1</li>
  <li>List Item 2</li>
  <li>List Item 3</li>
</ul>
```

### Mixed

```js
(x) => {
  x.p(
    'The quick brown ',
    x.strong('fox'),
    [' jumped', 3, 'times '],
    [' over the lazy '],
    x.strong('dog')
  )
}
```
```html
<p>The quick brown <strong>fox</strong> jumped 3 times  over the lazy <strong>dog</strong></p>
```

## Destructuring

If you don't like the `x.` prefix, you can use the
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

## The Template Tree is Synchronous

In the following example the \<h2\> element will not be rendered,
because `.h2()` is executed after the tree has already been rendered:
```js
(x) => {
  x.h1('h1 element')
  setTimeout(() => x.h2('h2 element'), 0)
  x.h3('h3 element')
}
```
```html
<h1>h1 element</h1>
<h3>h3 element</h3>
```
