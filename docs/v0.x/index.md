
# What is Paintor?

Paintor is a small View library that works in the browser or at the server. It uses JavaScript syntax that is structured like HTML.

States are used to bind some input data with some DOM elements.

## Installation

```bash
npm install paintor
```

## Examples

First, start the local server:

```bash
npm run start-server
```

Go to `http://localhost:8080/examples/` to view the examples.
To view the source code of the examples, open `/examples/index.html`.

## How to use it in the browser

Paintor is a [JavaScript module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules),
so import it as such:

```html
<script type="module">
    import { paintor } from '../dist/paintor.min.js'
</script>
```

Now, let's use it:
```html
<script type="module">
  import { paintor } from '../dist/paintor.min.js'

  paintor('container', {}, ($) => {
    $.div('Hello, World!')

    // Note that here the div (above) and the table (below) are separated, they are siblings.
    // In the table there are children. Each child is provided as an argument of its parent.

    $.table(
      $.thead(
        $.tr(
          $.th({colspan: 3}, 'The table header')
        ),
      ),
      $.tr(
        $.td('Row 1, Column 1'),
        $.td('Row 1, Column 2'),
      ),
      $.tr(
        $.td('Row 2, Column 1'),
        $.td('Row 2, Column 2'),
      )
    )
  })
</script>
```

This will be the output:
```html
<div id="container">
  <div>Hello, World!</div>
  <table>
    <thead>
      <tr>
        <th colspan="3">The table header</th>
      </tr>
    </thead>
      <tr>
        <td>Row 1, Column 1</td>
        <td>Row 1, Column 2</td>
      </tr>
      <tr>
        <td>Row 2, Column 1</td>
        <td>Row 2, Column 2</td>
      </tr>
  </table>
</div>
```
The first argument of the `paintor()` function is the ID of the HTML element in which
all the HTML elements should be placed. In this case the ID is "container".

The second argument is for the states, but this will be explained below.

The third argument is a function in which all the code that produces HTML elements should be placed.
There is one mandatory argument, named $ in the example. Note that you can name this argument
however you want.

The simplest way to create an element is to just call its function (let's call it Element function),
for example:
```javascript
$.br()
```
For elements with text content you can do it like this:
```javascript
$.div('some text here')
```
or like this:
```javascript
$.div({textContent: 'some text here'})
```

## Siblings and Children

At the first level, to create siblings, put them one below the other:

```javascript
paintor('container', {}, ($) => {
  $.div('Sibling One')
  $.div('Sibling Two')
  $.div('Sibling Three')
})
```
```html
<div id="container">
  <div>Sibling One</div>
  <div>Sibling Two</div>
  <div>Sibling Three</div>
</div>
```

Children - they are the arguments in their parent's function:

```javascript
paintor('container', {}, ($) => {
  $.div('Parent',
    $.div('Child One'),
    $.div('Child Two'),
    $.div('Child Three')
  )
})
```
```html
<div id="container">
  <div>Parent
    <div>Child One</div>
    <div>Child Two</div>
    <div>Child Three</div>
  </div>
</div>
```
The same result can be obtained by using an array like this:
```javascript
paintor('container', {}, ($) => {
  $.div('Parent', [
    $.div('Child One'),
    $.div('Child Two'),
    $.div('Child Three')
  ])
})
```

## HTML Attributes

Learn about [HTML Attributes](https://www.w3schools.com/htmL/html_attributes.asp).

Use the first argument of each Element function to specify HTML attributes. In the example below we
create an "a" element with its "href" attribute:
```javascript
$.a({href: 'https://google.com'}, 'Link to google.com')
```
```html
<a href="https://google.com">Link to google.com</a>
```

## Inline Style

Just like in HTML, use the "style" attribute. You can use a string value:
```javascript
$.p({style: 'color: blue; background-color: lightyellow; border: 1px solid red;', textContent: 'Hello, World!'})
```
or an object:
```javascript
$.p({style: {color: 'Blue', backgroundColor: 'LightYellow', border: '1px solid red'}, textContent: 'Hello, World!'})
```
The output is the same in both cases:
```html
<p style="color: blue; border: 1px solid red;">Hello, World!</p>
```
Note that there are two possible name styles for the `background-color` property - hyphen case
(background-color) and JavaScript style (backgroundColor). This is true for many CSS properties.
You can use both name styles, but prefer the JavaScript style.

```javascript
// Both variants below produce the same result
$.p({style: {backgroundColor: 'LightYellow'}})
$.p({style: {'background-color': 'LightYellow'}})
```

## HTML DOM Element Properties

There is a difference between [HTML Attributes](https://www.w3schools.com/htmL/html_attributes.asp)
and [HTML DOM Element Properties](https://www.w3schools.com/jsref/dom_obj_all.asp), although both
are set in the same way in Paintor. For example:

```javascript
// Both variants below produce the same result
$.p({className: 'MyClassName', id: 'MyID', innerHTML: '<b>Some Text</b>'})
```
This outputs the following HTML:
```html
<p class="MyClassName" id="MyID"><b>Some Text</b></p>
```
Here `className`, `id` and `innerHTML` are HTML DOM Element Properties.

Note that most properties are read-only, so there is no there is no reason to use them like that.

## HTML Event Attributes

Some [HTML Attributes](https://www.w3schools.com/htmL/html_attributes.asp) are Event Attributes.
These are `onclick`, `ondblclick`, `onkeydown` and many others. Use them like this:

```javascript
$.input({type: 'button', value: 'Click me!', onClick:() => alert('Button Clicked')})
```

Note that here `onClick` is used instead of `onclick`. Both are actually valid, but `onClick` looks
better in JavaScript. The same goes for the other `on...` attributes.

## States

These are [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
objects used for data binding and style binding. Both are explained below.

How to initiate a state?
```html
<script type="module">
    import { paintor, createState } from '../dist/paintor.min.js'
    
    const sourceObject = {key: 'value'}
    const state = createState(sourceObject)
    
    paintor('container', {state}, ($) => {
      ...
    })
</script>
```
From your `sourceObject` create a state using the `createState()` function. Then provide that state
in the second argument of the `paintor()` function. The second argument must be an Object,
containing zero, one or more states.

It's important to have the second argument like this `{state}`, instead of like this
`{stateName: state}`. Of course, `{state: state}` is also valid, but it's longer. Just do not rename
the state. As a result, when you use the `state` variable inside `paintor()`, your IDE will
recognize it as the original `state` variable, which is in fact a proxy of `sourceObject`.

## Data Binding

Here is how to bind a value from the state with some HTML attribute:

```javascript
const state = createState({clicks: 0})
    
paintor('container', {state}, ($) => {
  $.button({
    textContent: 'Click me',
    onClick: () => {state.clicks++},
  })
  $.p({ textContent: () => state.clicks })
})
```
To bind the HTML attribute with a value from the state, use a function that returns the state value.
In other words, instead of this:
```javascript
$.p({ textContent: state.clicks })
```
do this:
```javascript
$.p({ textContent: () => state.clicks })
```

Of course, this is just the shorter version of this:
```javascript
$.p({ textContent: function() { return state.clicks } })
```

You can also add some extra text:

```javascript
$.p({ textContent: () => `The number of clicks is ${state.clicks}` })
```

## Inline Style Binding

Do it the same way as the Data Binding, but for the style attributes. If you have a `color` element
in your state that is controlled from outside, then:

```javascript
$.p({style: {backgroundColor: () => state.color }})
```
... the background color of this `p` element will be changed every time when `state.color` is
changed.

## Bind `id`, `class`, `innerHTML` or any of the other [HTML DOM Element Properties](https://www.w3schools.com/jsref/dom_obj_all.asp)

The same way again, but for `id`, `class`, `innerHTML` or whatever the property name is.

## How to `if` and `for`?

At the first level you can just use the regular JavaScript `if` and `for`.

```javascript
paintor('container', {}, ($) => {
  for (let i = 1; i <= 4; i++) {
    if (i % 2 > 0) {
      $.div('Sibling ' + i)
    }
  }
})
```
```html
<div id="container">
   <div>Sibling 1</div>
   <div>Sibling 3</div>
</div>
```

Down the tree you can use the special `if` and `for` functions:

```javascript
paintor('container', {}, ($) => {
  $.div('Parent',
    $.for(1, 4, (i) => {
      $.if(i % 2 > 0, () => {
        $.div('Sibling ' + i)
      })
    })
  )
})
```
The result is the same as above:
```html
<div id="container">
   <div>Sibling 1</div>
   <div>Sibling 3</div>
</div>
```

Both `if` and `for` are explained below.

## `if()`

`if()` has 2 arguments. The first one is the boolean condition, and the second one is a
function in which you can place the children.

```javascript
$.if(condition, () => {
  $.div()
  $.div()
  ...
})
```

Note that in the body of the function you can put all the siblings one below the other, just like
on the first level.

You can also bind the condition argument of `if()`. In the example below when `state.condition` is
set to `true`, the HTML elements are created, and when it is set to `false` they are removed.

```javascript
$.if(
  () => state.condition,
  () => {
    $.div()
    $.div()
    ...
})
```

## `for()`

`for()` has 2 or 3 arguments, the last one is always the function in which you place
the children. Below are the possible ways to use it.

Provide the number of iterations:
```javascript
const iterations = 3

$.for(iterations, (i) => {
  $.div('Sibling ' + i)
})
```
```html
<div>Sibling 0</div>
<div>Sibling 1</div>
<div>Sibling 2</div>
```

Provide `from` and `to` numbers. Both are inclusive:
```javascript
const from = 0
const to = 2

$.for(from, to, (i) => {
  $.div('Sibling ' + i)
})
```
```html
<div>Sibling 0</div>
<div>Sibling 1</div>
<div>Sibling 2</div>
```

Provide an array:
```javascript
const array = ['One', 'Two', 'Three']

$.for(array, (i, value) => {
  $.div(i + ' => ' + value)
})
```
```html
<div>0 => One</div>
<div>1 => Two</div>
<div>2 => Three</div>
```

Provide an object:

```javascript
const object = {
  'one': 'ONE',
  'two': 'TWO',
  'three': 'THREE'
}

$.for(object, (key, value) => {
  $.div(key + ' => ' + value)
})
```
```html
<div>one => ONE</div>
<div>two => TWO</div>
<div>three => THREE</div>
```

## How to use it at the server

Here the idea is to just generate HTML code. Instead of states, there is just data.
There is no data binding, because there are no events.
Event the first argument in `paintor()` is useless, it exists only for the syntax to be the same as the syntax for the browser.
The generated output is returned as HTML code by `paintor()`.

```javascript
import {paintor} from 'paintor'

const data = { firstName: 'John', lastName: 'Smith' }

const htmlCode = paintor('', {data}, ($) => {
  $.div(`My name is ${data.firstName} ${data.lastName}`)
})

console.log(htmlCode)
```
`className`, `innerText`, `innerHTML` and `style` are functional.
