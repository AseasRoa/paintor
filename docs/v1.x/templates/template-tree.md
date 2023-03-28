## Naming

The argument name in the template function doesn't matter, it's a matter of choice. The following
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
## What is the Tree?

``$`` is an instance of a class, which provides a bunch of methods. There is a method for each HTML
element. For example, we have ``$.a()`` for \<a\>, ``$.p()`` for \<p\>, ``$.input()`` for \<input\>,
and so on.

These are a little bit special, they will be explained later:

- ``$.html()``
- ``$.script()``

And there are few extra methods, such as:

- ``$.createElement()`` - for creating a custom element.
- ``$.if()`` - ``if`` statement.
- ``$.for()`` - ``for`` iteration loop, starting with one number and ending with another.
- ``$.forEach()`` - to iterate over Array, Object, Set or Map.
- ``$.forState()`` - to iterate over [State](../reactivity/states).



## Syntax

When the first argument is `string` or `number`:

```js
($) => {
  $.div('text')
  $.div(123456)
}
```
```html
<div>text</div>
<div>123456</div>
```

When the first argument is an Object, it defines the element's various properties. The text content
can now be passed as the `textContent` property, or as a second argument:

```js
($) => {
  $.a({ href: 'https://github.com/', textContent: 'Go to GitHub' })
  $.a({ href: 'https://github.com/' }, 'Go to GitHub')
}
```
```html
<a href="https://github.com/">Go to GitHub</a>
<a href="https://github.com/">Go to GitHub</a>
```

The 'properties' Object (if used) must be the first argument. Otherwise, it will not be honored.
The following is not valid:

```js
($) => {
  $.a('Go to GitHub', { href: 'https://github.com/' })
}
```
```html
<a>Go to GitHub</a>
```

Following the `properties` Object (if used), the other arguments can be child elements:

```js
($) => {
  $.table(
    { class: 'tables' },
    $.tr(
      $.td('Row 1, Column 1'),
      $.td('Row 1, Column 2'),
    ),
    $.tr(
      $.td('Row 2, Column 1'),
      $.td('Row 2, Column 2'),
    )
  )
}
```
```html
<table class="tables">
  <tr>
    <td>Row 1, Column 1</td>
    <td>Row 1, Column 2</td>
  </tr>
  <tr>
    <td>Row 2, Column 1</td>
    <td>Row 2, Column 2</td>
  </tr>
</table>
```

You can also put the children into an Array:
```js
($) => {
  $.ul(
    [
      $.li('List Item 1'),
      $.li('List Item 2'),
      $.li('List Item 3'),
    ]
  )
}
```

Elements can be mixed with text:

```js
($) => {
  $.p(
    'The quick brown ', $.strong('fox'), ' jumps over the lazy ', $.strong('dog')
  )
}
```
```html
<p>The quick brown <strong>fox</strong> jumps over the lazy <strong>dog</strong></p>
```
## Free Style

You probably noticed that in the examples above the method calls in the template function aren't
entangled in any way. Other blocks of code can exist in between:

```js
($) => {
  /* ... */
  
  $.h1('h1 element')

  /* ... */
  
  $.h2('h2 element')

  /* ... */
  
  $.h3('h3 element')

  /* ... */
}
```

::: warning
Keep in mind that the order and the time of execution (of the methods) matters.
:::

In the following example the \<h2\> element will not be rendered, because `$.h2()` is executed after
everything else is rendered:
```js
($) => {
  $.h1('h1 element')
  setTimeout(() => $.h2('h2 element'), 0)
  $.h3('h3 element')
}
```
```html
<h1>h1 element</h1>
<h3>h3 element</h3>
```

## Entangled Style

Sometimes it's better to entangle the elements into an Array:

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
