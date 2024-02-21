## Paintor

![Static Badge](https://img.shields.io/badge/100%25%20JavaScript-F0DB4F?style=for-the-badge&logo=JavaScript&labelColor=black)
![Static Badge](https://img.shields.io/badge/NodeJs-3C873A?style=for-the-badge&logo=node.js&labelColor=black)

[![npm version](https://img.shields.io/npm/v/paintor.svg?logo=npm&color=cb3837)](https://www.npmjs.com/package/paintor)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/paintor?color=cb3837)
![npm downloads](https://img.shields.io/npm/dm/paintor?color=cb3837)
![npm type definitions](https://img.shields.io/npm/types/paintor)
[![test](https://github.com/AseasRoa/DocSchema/actions/workflows/test.yml/badge.svg)](https://github.com/AseasRoa/DocSchema/actions/workflows/test.yml)
![license](https://img.shields.io/npm/l/paintor)

Paintor is a JavaScript library for building client-side user interfaces or HTML
code.

## [Documentation and Examples](https://aseasroa.github.io/paintor)

## Key Features
- **100% JavaScript**: No transpilation. The code you write is the code to run.
- **JS Templates**: HTML-like structure (HyperScript) in JavaScript with type
  safety in the smallest detail.
- **HTML Templates**: Optional HTML syntax in JavaScript [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).
- **SSR**: The output can be HTML code for server-side rendering.
- **Reactivity**: Through [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
  and DOM events.
- **Internationalization (i18n)**: Render the templates in the client's
  language.
- **Type Definitions**: TypeScript type definitions for code completion and type
  safety.

## Why?

### Cults? No.

I don't like React. As a JavaScript developer, every time I was curious enough
to see and understand what React offers, I was disgusted. I couldn't stand
looking at React code for more than a few minutes. There is something in it that
is not intuitive for me. I think the learning curve of React is too steep for
the problems it aims to solve. To the point that everyone who manages to endure
the learning process, eventually becomes a cult follower. This is how I think
about Angular and other over-hyped, but complex solutions.

### "Aha" and "Wow"

I much prefer Vue or Svelte, which at the time I first stared hearing about
React were probably less popular than Angular. But when I looked at them,
I quickly had this "aha" moment, and for me Svelte even has that "wow" factor.
For me, the quick "aha" and the "wow" are very important.

### To transpile? How about No?

However, I'm not a big fan of the idea to write something in a non-native format
and transpile it on every small change in order to use it. This is usually a
deal-breaker for me.

### Vanilla

Then I was inspired by Mithril, which is fairly easy to understand and vanilla,
although it doesn't really have the "wow" factor. As I often do in such cases,
I decided to quickly write something like it, tailored for my needs. Well, this
took some years and it's still an ongoing process.

## Quick Example

```javascript
import { component, state } from 'paintor'

// Create a component
const app = component((o) => {
  // Use a local state
  const localState = state({ clicks: 0 })

  // Build a hyperscript markup
  o.div(
    o.button({ onClick: () => localState.clicks++ }, 'Click me'),
    o.div(() => localState.clicks)
  )
})

// Render the component
app.paint('#app')

// Or, generate HTML
const htmlCode = app.html()
```
