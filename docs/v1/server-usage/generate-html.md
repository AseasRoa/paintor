---
title: Generate HTML
---

# Generate HTML

To generate HTML code on the server, use `html()`.

::: info
`html()` can be used in the browser as well.
:::

```js
import { component } from 'paintor'

const app = component((x) => {
  x.div('Hello')
})

const htmlCode = app.html()
// htmlCode: <div>Hello</div>
```

## Static HTML

### staticHtml()

If the output HTML code never changes, there is no need to generate it every
time. In this case, use `staticHtml()`, which basically allows the HTML code
to be rendered once, and every time it returns the same cached string.

```js
import { component } from 'paintor'

let count = 0

const app = component((x) => {
  x.div(count++)
})

let htmlCode = app.staticHtml()
// htmlCode: <div>0</div>
htmlCode = app.staticHtml()
// htmlCode: <div>0</div>
htmlCode = app.staticHtml()
// htmlCode: <div>0</div>
```

### static()

`static()` is used to tell the component to return cached HTML string, or not.

- `static(true)` or `static()` - to turn the cache on
- `static(false)` - to turn the cache off

If you set a component with `static(true)` or `static()`, then `html()`
will return static HTML string every time. It's just like using `staticHtml()`:

```js
import { component } from 'paintor'

let count = 0

const app = component((x) => {
  x.div(count++)
})

app.static()

let htmlCode = app.html()
// htmlCode: <div>0</div>
htmlCode = app.html()
// htmlCode: <div>0</div>
htmlCode = app.html()
// htmlCode: <div>0</div>
```

But then, if you use `static(false)`, the cached HTML string is cleared and the
component starts generating new HTML code every time. Until you use
`static(true)` or `static()` again.

```js
import { component } from 'paintor'

let count = 0

const app = component((x) => {
  x.div(count++)
})

app.static()

let htmlCode = app.html()
// htmlCode: <div>0</div>
htmlCode = app.html()
// htmlCode: <div>0</div>
htmlCode = app.html()
// htmlCode: <div>0</div>

app.static(false)

htmlCode = app.html()
// htmlCode: <div>1</div>
htmlCode = app.html()
// htmlCode: <div>2</div>
htmlCode = app.html()
// htmlCode: <div>3</div>

app.static()

htmlCode = app.html()
// htmlCode: <div>4</div>
htmlCode = app.html()
// htmlCode: <div>4</div>
htmlCode = app.html()
// htmlCode: <div>4</div>
```

#### Internationalization

If you are using translations on static HTML generation, there will be one
cached HTML string for each translation. Note that these strings are generated
on demand.
