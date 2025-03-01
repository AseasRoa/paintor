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

# Example: To-Do List

<p></p>
<Badge type="warning" text="example" />
<div class="example">
  <div id="to-do-list"></div>
</div>

::: code-group
<<< @/./examples/to-do-list.js [app.js]
<<< @/./examples/components/ToDoList.js [components/ToDoList.js]
<<< @/./examples/components/ToDoHeader.js [components/ToDoHeader.js]
<<< @/./examples/components/ToDoTasks.js [components/ToDoTasks.js]
<<< @/./examples/components/ToDoTaskItem.js [components/ToDoTaskItem.js]
<<< @/./examples/to-do-list.css [CSS]
```html [HTML]
<div id="to-do-list"></div>
```
:::
