<script> import '/./components/template-as-a-component.js' </script>

## Template as a Component

[Templates](../templates/creating-templates.md) can also be used to make components.
The example below shows a single Template with its own internal [State](../reactivity/states.md).
Because this Template can be used as independent piece of UI multiple times, we can call it a
Component.

::: code-group
<<< @/./components/template-as-a-component-1.js [JavaScript]
```html [HTML]
<template-as-a-component-1></template-as-a-component-1>
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
