## Paintor

![Static Badge](https://img.shields.io/badge/100%25%20JavaScript-F0DB4F?style=for-the-badge&logo=JavaScript&labelColor=black)
![Static Badge](https://img.shields.io/badge/NodeJs-3C873A?style=for-the-badge&logo=node.js&labelColor=black)

[![npm version](https://img.shields.io/npm/v/paintor.svg?logo=npm&color=cb3837)](https://www.npmjs.com/package/paintor)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/paintor?color=cb3837)
![npm downloads](https://img.shields.io/npm/dm/paintor?color=cb3837)
![npm type definitions](https://img.shields.io/npm/types/paintor)
[![test](https://github.com/AseasRoa/DocSchema/actions/workflows/test.yml/badge.svg)](https://github.com/AseasRoa/DocSchema/actions/workflows/test.yml)
![license](https://img.shields.io/npm/l/paintor)

A JavaScript library with component-based model for building reactive
client-side user interfaces or generating HTML code.

Why? Because JavaScript is good enough. So good, in fact, that even HTML
can be written in JavaScript.

## [Documentation and Examples](https://aseasroa.github.io/paintor)

## Key Features
- **JavaScript syntax**: The code you write is the code to run
- **No dependencies**
- **No Virtual DOM**: Reactivity is achieved through [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
  and DOM events
- **Templates in JavaScript or HTML (experimental)**: JavaScript HTML-like
tree structure (HyperScript) or HTML syntax in [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
- **Scoped CSS**: Each component can have its own style
- **Observers**: Receive events on state changes
- **Server-Side Rendering (SSR)**: Generate HTML code on the server
- **Internationalization (i18n)**
- **Type definitions**: Built-in TypeScript definitions for code completion and
  type safety

## Quick Examples

#### Clicks counter
```javascript
import { compose, state, template } from 'paintor'

// Component
function Counter(/* Props */ { buttonText }) {
  // Template
  return template((x) => {
    // Local state
    const counter = state({ clicks: 0 })

    // Scoped CSS
    x.$css`
      div {
        span {
          color: blue;
        }
      }
    `

    // HTML elements
    x.div(
      x.button(
        { onClick: () => counter.clicks++ },
        buttonText
      ),
      x.span(() => counter.clicks)
    )

    // Observe state changes
    on(counter.clicks).change((event) => {
      console.log(`Clicked ${event.value} times`)
    })
  })
}

// Render
const app = compose(
  Counter({ buttonText: 'Click me' })
)
app.paint('#app')
```

#### Generate HTML code (for Server-Side Rendering)

```javascript
// To generate HTML code, instead of paint(), use html()
const htmlCode = app.html()
```

#### Observe state changes

```javascript
import { state, on } from 'paintor'

// Create state
const myState = state({ count: 0 })

// Make state changes
setInterval(() => {
  myState.count++
}, 1000)

// Observe state changes
on(myState.count).change((data) => {
  console.log(data.value)
})

// The result in the console will be:
// 1
// 2
// 3
// ...
```
