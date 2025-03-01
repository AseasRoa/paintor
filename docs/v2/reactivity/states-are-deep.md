---
title: States are Deep
---

<script setup>
  import { onMounted } from 'vue'
  
  onMounted(async () => {
    await import('./states-are-deep-1.js')
  })
</script>

# States are Deep

The inner objects and arrays of a state are also states:

::: code-group
<<< @/./reactivity/states-are-deep-1.js [JavaScript]
```html [HTML]
<div id="states-are-deep-1"></div>
```
:::

<Badge type="warning" text="example" />
<div class="example">
  <div id="states-are-deep-1"></div>
</div>
