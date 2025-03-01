---
title: Painting
---

# Painting

To "paint" means to render the contents of a component in the browser.
These contents are HTML elements, coming from the component itself and from
all the other components, used in it. In addition, the contents can be
dynamic - HTML elements can be created, updated and removed.

To paint a component, it is passed to the `compose()` function,
which gives us the `paint()` function.

## Composition

Before painting, a composition must be created. The composition is created by
passing one or more components to the `compose()` function.

We can say that the `compose()` function accepts one or more components, but
in reality it accepts their templates. You can see in the example below that
when we call the component `SayHello({ name: 'John' })`, we get what
is returned by the function, which is a template with one `<span>` element.
Then, `paint('body')` is called to paint the composition into the `<body>`
element.

```js
import { compose, template } from 'paintor'

/**
 * @param {{ name: string }} props
 */
export function SayHello(props) {
  return template((x) => {
    x.span('Hello, ', props.name)
  })
}

compose(SayHello({ name: 'John' })).paint('body')
```
```html
<body>
  <span>Hello, John</span>
</body>
```

If we want to create header, main content and footer, we can paint the following
composition:

```js
import { compose, template } from 'paintor'

const Header = function() {
  return template((x) => {
    x.header('Header  Contents')
  })
}

const Main = function() {
  return template((x) => {
    x.main('Main  Contents')
  })
}

const Footer = function() {
  return template((x) => {
    x.footer('Footer Contents')
  })
}

compose(
  Header(),
  Main(),
  Footer()
).paint('body')
```
```html
<body>
  <header>Header Contents</header>
  <main>Header Contents</main>
  <footer>Header Contents</footer>
</body>
```

## Painting

The composition can be painted not only in the `<body>` element, but also in
other HTML elements. One or many at the same time!
It all depends on the argument, provided to the `paint()` function.
The argument can be:

- String - then under the hood `querySelectorAll()` is applied.
- HTMLElement
- Array or HTMLElement
- HTMLCollection
- NodeList

## Paint One Element

In all three example below, we have only one `<div>` element with unique id
`myId`. Only this element is being selected in all examples, but in different
ways:

::: code-group
```html [Using a string]
<div id="myId"></div>

<script type="module">
  import { compose, template } from 'paintor'
  
  const MyComponent = function() {
    return template((x) => {
      /* ... */
    })
  }

  compose(MyComponent()).paint('#myId')
</script>
```
```html [Using querySelector()]
<div id="myId"></div>

<script type="module">
  import { compose, template } from 'paintor'

  const MyComponent = function() {
    return template((x) => {
      /* ... */
    })
  }

  compose(MyComponent()).paint(document.querySelector('#myId'))
</script>
```
```html [Using getElementById()]
<div id="myId"></div>

<script type="module">
  import { compose, template } from 'paintor'

  const MyComponent = function() {
    return template((x) => {
      /* ... */
    })
  }

  compose(MyComponent()).paint(document.getElementById('myId'))
</script>
```
:::

## Paint Multiple Elements

In this case, the same component will be painted over all elements with class
`myClass`.

::: code-group
```html [Using a string]
<div class="myClass"></div>
<div class="myClass"></div>
<div class="myClass"></div>

<script type="module">
  import { compose, template } from 'paintor'

  const MyComponent = function() {
    return template((x) => {
      /* ... */
    })
  }

  compose(MyComponent()).paint('.myClass')
</script>
```
```html [Using querySelectorAll()]
<div class="myClass"></div>
<div class="myClass"></div>
<div class="myClass"></div>

<script type="module">
  import { compose, template } from 'paintor'

  const MyComponent = function() {
    return template((x) => {
      /* ... */
    })
  }

  compose(MyComponent()).paint(document.querySelectorAll('.myClass'))
</script>
```
```html [Using getElementsByClassName()]
<div class="myClass"></div>
<div class="myClass"></div>
<div class="myClass"></div>

<script type="module">
  import { compose, template } from 'paintor'

  const MyComponent = function() {
    return template((x) => {
      /* ... */
    })
  }

  compose(MyComponent()).paint(document.getElementsByClassName('.myClass'))
</script>
```
:::

## Paint Custom Elements

In HTML, it's possible to create [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements),
which are part of the [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
technology. What is unique for them is that their styles are encapsulated.

Custom Elements have special tag names. Their names must be lower-case, at least
one dash is required, and the name must not start with a number.

Use the name of the Custom Element in `paint()`:

::: code-group
```html
<custom-element></custom-element>

<script type="module">
  import { compose, template } from 'paintor'

  const MyComponent = function() {
    return template((x) => {
      /* ... */
    })
  }

  compose(MyComponent()).paint('custom-element')
</script>
```
:::

Now if more Custom Elements with this name are created, Paintor will
automatically paint them all.
