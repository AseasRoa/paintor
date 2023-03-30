<script> import '/./components/components.js' </script>

## What are Components?

Components are independent and reusable pieces of UI.

In Paintor, there are two ways to make components:
- With `compose()`
- With [Templates](../templates/creating-templates.md)

## compose() as a Component

::: code-group
<<< @/./components/components-example-3.js [JavaScript]
```html [HTML]
<components-example-3></components-example-3>
```
:::

<div class="example">
  <p></p>
  <components-example-3></components-example-3>
  <p></p>
</div>

## Template as a Component

The example below shows a single Template with its own internal [State](../reactivity/states.md). Because this Template can be used
as independent piece of UI multiple times, we can call it a Component.

::: code-group
<<< @/./components/components-example-1.js [JavaScript]
```html [HTML]
<components-example-1></components-example-1>
```
:::

<div class="example">
  <p></p>
  <components-example-1></components-example-1>
  <p></p>
</div>

The same Template can be used in another Template, but there is a catch - the Template Tree must be
[entangled](../templates/template-tree.md#entangled-style).

::: code-group
<<< @/./components/components-example-2.js [JavaScript]
```html [HTML]
<components-example-2></components-example-2>
```
:::

<div class="example">
  <p></p>
  <components-example-2></components-example-2>
  <p></p>
</div>
