## First Argument

If used, the 'properties' object must be the first argument. This rule exists to force the
consistency of setting the properties in the beginning. This is also how it's done in HTML anyway.

For example, this works:

```js
$.a({ href: 'https://github.com/' }, 'Go to GitHub')
```
```html
<a href="https://github.com/">Go to GitHub</a>
```

But this doesn't work as expected, because the 'properties' object is not the first argument:

```js
$.a('Go to GitHub', { href: 'https://github.com/' })
```
```html
<a>Go to GitHub</a>
```

## HTML Attributes

[HTML Attributes](https://www.w3schools.com/htmL/html_attributes.asp)

You can use all available HTML Attributes. Some are [global](https://www.w3schools.com/tags/ref_standardattributes.asp),
others depend on the element. Paintor is bundled with TypeScript types, so your IDE should give
you code completion and error messages if you attempt to use wrong attributes.

```js
$.input(
  {
    class : 'buttonClass', // Global attribute
    title : 'This is a button', // Global attribute
    type  : 'button', // Specific for <input>
    value : 'Click me' // Specific for <input>
  }
)
```
```html
<input class="buttonClass" title="This is a button" type="button" value="Click me">
```

::: info
`style` and `data-*` attributes are a little bit more special, they will be explained later.
:::

## HTML DOM Element Properties

[HTML DOM Element Properties](https://www.w3schools.com/jsref/dom_obj_all.asp)

Most of these DOM Element Properties are read-only properties, and it makes no sense to use them in the
'properties' object. But few are setters, such as:

- className
- id
- innerHTML
- outerHTML
- part
- scrollLeft
- scrollTop
- slot

```js
$.p(
  { className: 'myClass', id: 'myId', innerHTML: '<strong>Some Text</strong>' }
)
```
```html
<p class="myClass" id="myId"><strong>Some Text</strong></p>
```

## HTML Event Attributes

[HTML Event Attributes](https://www.w3schools.com/tags/ref_eventattributes.asp)

Use callback functions for these:

```js
$.button(
  {
    /**
     * @param {MouseEvent} event
     */
    onClick: (event) => {
      console.log(event.target)
    }
  },
  'Click me'
)
```
::: info
Lowercase or camelCase names are allowed.
:::
Note that in the example above, `onClick` is used instead
of `onclick`. `onClick` looks more appropriate for JavaScript.

The `event` argument provides the native JavaScript Event object.

## Inline Style

There are two ways to set the inline style: as a string or as an object. The result will be the
same.

```js
// Inline style as a string
$.p(
  { style: 'color: blue; border: 1px solid red;' }
)

// Inline style as an object
$.p(
  { style: { color: 'Blue', border: '1px solid red' } }
)
```
```html
<p style="color: blue; border: 1px solid red;"></p>
<p style="color: blue; border: 1px solid red;"></p>
```

Some style rules have a dash in their names, for example `background-color`. Such style names can be
written in two ways, and once again, the result will be the same:

```js
// Dashed style name
$.p(
  { style: { 'background-color': 'LightYellow' } }
)

// camelCase style name
$.p(
  { style: { backgroundColor: 'LightYellow' } }
)
```
```html
<p style="background-color: lightyellow;"></p>
<p style="background-color: lightyellow;"></p>
```

## HTML data-* Attribute

[HTML data-* Attribute](https://www.w3schools.com/tags/att_data-.asp)

In the 'properties' object set an object with key 'data'. 

If you want to get this:

```html
<ul>
  <li data-animal-type="mammal">Cat</li>
  <li data-animal-type="bird">Parrot</li>
  <li data-animal-type="reptile">Gecko</li>
</ul>
```

Do this:

```js
$.ul(
  $.li({ data: { 'animal-type': 'mammal' } }, 'Cat'),
  $.li({ data: { 'animal-type': 'bird' } }, 'Parrot'),
  $.li({ data: { 'animal-type': 'reptile' } }, 'Gecko')
)
```
