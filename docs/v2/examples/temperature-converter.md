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

# Example: Temperature Converter

<p></p>
<Badge type="warning" text="example" />
<div class="example">
  <div id="temperature-converter"></div>
</div>

::: code-group
<<< @/./examples/temperature-converter.js [app.js]
<<< @/./examples/components/TemperatureConverter.js [components/TemperatureConverter.js]
<<< @/./examples/components/TemperatureInput.js [components/TemperatureInput.js]
<<< @/./examples/temperature-converter.css [CSS]
```html [HTML]
<div id="temperature-converter"></div>
```
:::
