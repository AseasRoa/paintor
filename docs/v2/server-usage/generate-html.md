---
title: Generate HTML
---

# Generate HTML

To generate HTML code on the server, use `html()`.

::: info
`html()` can be used in the browser as well.
:::

```js
import { compose, template } from 'paintor'

const SayHello = function() {
  return template((x) => {
    x.div('Hello')
  })
}

const composition = compose(SayHello())

const htmlCode = composition.html()
// htmlCode: <div>Hello</div>
```

## Static HTML

### staticHtml()

If the output HTML code never changes, there is no need to generate it every
time. In this case, use `staticHtml()`, which basically allows the HTML code
to be rendered once, and every time it returns the same cached string.

```js
import { compose, template } from 'paintor'

const Counter = function() {
  let count = 0
 
  return template((x) => {
    x.div(count++)
  })
}

const composition = compose(Counter())

let htmlCode = composition.staticHtml()
// htmlCode: <div>0</div>
htmlCode = composition.staticHtml()
// htmlCode: <div>0</div>
htmlCode = composition.staticHtml()
// htmlCode: <div>0</div>
```

### static()

`static()` is used to tell the component to return cached HTML string, or not.

- `static(true)` or `static()` - to turn the cache on
- `static(false)` - to turn the cache off

If you set a component with `static(true)` or `static()`, then `html()`
will return static HTML string every time. It's just like using `staticHtml()`:

```js
import { compose, template } from 'paintor'

const Counter = function() {
  let count = 0

  return template((x) => {
    x.div(count++)
  })
}

const composition = compose(Counter())

composition.static()

let htmlCode = composition.html()
// htmlCode: <div>0</div>
htmlCode = composition.html()
// htmlCode: <div>0</div>
htmlCode = composition.html()
// htmlCode: <div>0</div>
```

But then, if you use `static(false)`, the cached HTML string is cleared and the
component starts generating new HTML code every time. Until you use
`static(true)` or `static()` again.

```js
import { component, template } from 'paintor'

const Counter = function() {
  let count = 0

  return template((x) => {
    x.div(count++)
  })
}

const composition = compose(Counter())

composition.static()

let htmlCode = composition.html()
// htmlCode: <div>0</div>
htmlCode = composition.html()
// htmlCode: <div>0</div>
htmlCode = composition.html()
// htmlCode: <div>0</div>

composition.static(false)

htmlCode = composition.html()
// htmlCode: <div>1</div>
htmlCode = composition.html()
// htmlCode: <div>2</div>
htmlCode = composition.html()
// htmlCode: <div>3</div>

composition.static()

htmlCode = composition.html()
// htmlCode: <div>4</div>
htmlCode = composition.html()
// htmlCode: <div>4</div>
htmlCode = composition.html()
// htmlCode: <div>4</div>
```

#### Internationalization

If you are using translations on static HTML generation, there will be one
cached HTML string for each translation. Note that these strings are generated
on demand.
