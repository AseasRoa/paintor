---
title: Temperature Converter
---

<script setup>
  import { onMounted } from 'vue'
  
  onMounted(async () => {
    await import('./temperature-converter.css')
    await import('./temperature-converter.js')
  })
</script>

## Temperature Converter Example

<Badge type="warning" text="example" />
<div class="example">
  <div id="temperature-converter"></div>
</div>

::: code-group
<<< @/./examples/temperature-converter.js [JavaScript]
<<< @/./examples/temperature-converter.css [CSS]
```html [HTML]
<div id="temperature-converter"></div>
```
:::
