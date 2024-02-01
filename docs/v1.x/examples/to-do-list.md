---
head:
  - - link
    - href: ./to-do-list.css
      rel: stylesheet
  - - script
    - src: ./to-do-list.js
      type: module
navbar: false
---

## To-Do List Example

<div class="example">
  <p></p>
  <div id="to-do-list"></div>
  <p></p>
</div>

::: code-group
<<< @/./examples/to-do-list.js [JavaScript]
<<< @/./examples/to-do-list.css [CSS]
```html [HTML]
<div id="to-do-list"></div>
```
:::
