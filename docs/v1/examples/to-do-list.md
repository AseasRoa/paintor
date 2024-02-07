---
title: To-Do List
---

<script setup>
  import { onMounted } from 'vue'
  
  onMounted(async () => {
    await import('./to-do-list.css')
    await import('./to-do-list.js')
  })
</script>

# To-Do List Example

<p></p>
<Badge type="warning" text="example" />
<div class="example">
  <div id="to-do-list"></div>
</div>

::: code-group
<<< @/./examples/to-do-list.js [app.js]
<<< @/./examples/components/ToDoList.js [components/ToDoList.js]
<<< @/./examples/to-do-list.css [CSS]
```html [HTML]
<div id="to-do-list"></div>
```
:::
