

## Free Style

You probably noticed that in the examples above the function calls in the template function aren't
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

However, this style has its quirks and can't be used everywhere!


Or when a Template is used in another Template, the order of the rendered elements will not be as
expected:

```js
import { component, template } from 'paintor'

const buttonTpl = template(($) => {
  $.button('Button')
})

component(($) => {
  $.div($.span('This span is actually rendered after the button'), buttonTpl($))
}).paint('#container')
```
```html
<div>
   <button>Button</button>
   <span>This span is actually rendered after the button</span>
</div>
```

To overcome these quirks, use the Entangled Style, which is described below.

## Entangled Style

When using Template in another Template, or using the Template as a [Component](../components/components.md),
it's necessary to entangle the elements into an Array:

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

or into a single element:

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
