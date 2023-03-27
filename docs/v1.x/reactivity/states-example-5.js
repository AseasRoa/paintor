import { compose, createState } from '/assets/paintor.js'

const state = createState({
  number: 0,
  inner: {
    number: 0,
    inner: {
      number: 0
    }
  }
})

setInterval(() => {
  state.number++
  state.inner.number = state.number * 2
  state.inner.inner.number = state.number * 3
}, 2000)

compose(($) => {
  $.p(() => `1 * Number = ${state.number}` )
  $.p(() => `2 * Number = ${state.inner.number}` )
  $.p(() => `3 * Number = ${state.inner.inner.number}` )
}).paint('states-example-5')
