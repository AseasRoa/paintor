import { component, state } from 'paintor'

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

component(($) => {
  $.p(() => `First counter: ${globalState.counter}` )
  $.p(() => `Second counter: ${globalState.innerObject.counter}` )
  $.p(() => `Third counter: ${globalState.innerObject.innerArray[0]}` )
}).paint('#states-recursive')
