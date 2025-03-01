---
title: Components
---

# Components

Components are independent and reusable pieces of UI. They are a combination
of template, state, css rules, input properties and the ability to use other
components in them.

## Usage
This is a simple `SayHello` component:

::: code-group
```js [SayHello.js]
import { css, template } from 'paintor'

/**
 * @param {{ name: string }} props
 */
export function SayHello(props) {
  css(`
    span { color: blue; }
  `)

  return template((x) => {
    x.span('Hello, ', props.name)
  })
}
```
:::

#### Component name and location
Usually, components are located in separate files and their names
are PascalCase.

#### Component `props`
You can pass any kind of arguments to `SayHello()`, as this is just a regular
JavaScript function. However, in component-based model like this, it is
expected to pass a single object `props`, containing all the input data.

#### Component `template()`
The component function should return a function, wrapped in `template()`.
The one argument of the template function (`x`) provides you with the methods,
used to build the template of the component. The `template()` wrapper also
provides typing information for `x`.

#### Component `css()`
You can specify CSS rules for the current component. These rules are scoped,
they only apply for the DOM elements, created in the scope of the current
component.
There are 2 ways to specify the CSS rules:
- With `css()` function, located above `template()`
- With `$css()`, provided in `template()`
