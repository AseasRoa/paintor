import { component, state } from '/assets/paintor.js'

const globalState = state({
  number: 0,
  inner: {
    number: 0,
    inner: {
      number: 0
    }
  }
})

setInterval(() => {
  globalState.number++
  globalState.inner.number = globalState.number * 2
  globalState.inner.inner.number = globalState.number * 3
}, 2000)

component(($) => {
  $.p(() => `1 * Number = ${globalState.number}` )
  $.p(() => `2 * Number = ${globalState.inner.number}` )
  $.p(() => `3 * Number = ${globalState.inner.inner.number}` )
}).paint('states-example-5')
