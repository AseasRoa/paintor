import { component, state } from '/assets/paintor.js'

const global = state({
  number: 0,
  inner: {
    number: 0,
    inner: {
      number: 0
    }
  }
})

setInterval(() => {
  global.number++
  global.inner.number = global.number * 2
  global.inner.inner.number = global.number * 3
}, 2000)

component(($) => {
  $.p(() => `1 * Number = ${global.number}` )
  $.p(() => `2 * Number = ${global.inner.number}` )
  $.p(() => `3 * Number = ${global.inner.inner.number}` )
}).paint('states-example-5')
