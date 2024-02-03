---
title: Template as a Component
---

<script setup>
  import { onMounted } from 'vue'
  
  onMounted(async () => {
    await import('./template-as-a-component-1.js')
    await import('./template-as-a-component-2.js')
  })
</script>

# Template as a Component

[Templates](../templates/what-are-templates.md) can also be used to make components.
The example below shows a single Template with its own internal [State](../reactivity/states.md).
Because this Template can be used as independent piece of UI multiple times, we can call it a
Component.

::: code-group
<<< @/./components/template-as-a-component-1.js [JavaScript]
```html [HTML]
<div id="template-as-a-component-1"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="template-as-a-component-1"></div>
</div>

The same Template can be used in another Template, but there is a catch - the Template Tree must be
[entangled](../templates/template-tree.md#entangled-style).

::: code-group
<<< @/./components/template-as-a-component-2.js [JavaScript]
```html [HTML]
<div id="template-as-a-component-2"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="template-as-a-component-2"></div>
</div>
