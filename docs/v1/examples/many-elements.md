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

# Many Elements

<p></p>
<Badge type="warning" text="example" />
<div class="example">
  <div id="many-elements"></div>
</div>

::: code-group
<<< @/./examples/many-elements.js [app.js]
<<< @/./examples/components/ManyElements.js [components/ManyElements.js]
<<< @/./examples/many-elements.css [CSS]
```html [HTML]
<div id="many-elements"></div>
```
:::
