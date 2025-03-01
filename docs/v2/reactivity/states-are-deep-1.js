import { compose, state, template } from 'paintor'

const globalState = state({
  counter: 0, // First counter
  innerObject: {
    counter: 0, // Second counter
    innerArray: [0] // Third counter
  }
})

setInterval(() => {
  // Increment all counters
  globalState.counter += 1
  globalState.innerObject.counter += 1
  globalState.innerObject.innerArray[0] += 1
}, 2000)

const MyComponent = function() {
  return template((x) => {
    x.p(() => `First counter: ${globalState.counter}` )
    x.p(() => `Second counter: ${globalState.innerObject.counter}` )
    x.p(() => `Third counter: ${globalState.innerObject.innerArray[0]}` )
  })
}

compose(MyComponent()).paint('#states-are-deep-1')
