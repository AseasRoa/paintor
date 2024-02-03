---
title: Many Elements
---

<script setup>
  import { onMounted } from 'vue'
  
  onMounted(async () => {
    await import('./many-elements.css')
    await import('./many-elements.js')
  })
</script>

## To-Do List Example

<Badge type="warning" text="example" />
<div class="example">
  <div id="many-elements"></div>
</div>

::: code-group
<<< @/./examples/many-elements.js [JavaScript]
<<< @/./examples/many-elements.css [CSS]
```html [HTML]
<div id="many-elements"></div>
```
:::
