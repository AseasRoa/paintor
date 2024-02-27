---
title: Components vs Templates
---

<script setup>
  import { onMounted } from 'vue'
  
  onMounted(async () => {
    await import('./components-vs-templates-1.js')
    await import('./components-vs-templates-1.css')
  })
</script>

# Components vs Templates

On the surface, Components and Templates look the same. Or at leas they are
created in a very similar way - by putting the same kind of function in
`template()` or `component()`.

```js
import { component, template } from 'paintor'

const myTemplate = template((x) => { ... })
const myComponent = component((x) => { ... })
```

In reality, the `(x) => { ... }` function is the template. `template()` returns
back the input template function and is used mostly for type safety and code
completion. You can omit `template()` most of the time, but then you have to
type the template function manually:

```js
import { component, template } from 'paintor'

/** @type {Template} */
const myTemplate = (x) => { ... }
```

However, this is not recommended, because `template()` also marks the template
function with a special property, which in some cases helps Paintor to
differentiate between template and normal functions.

`component()` is what gives life to the template functions. Generally, the
component uses one or more templates to render the view.

One component can also use other components, but it's a good practice to never
use `component()` two or more times in a single file.

Think of `component()` as a class and `template()` as a method for the class.
