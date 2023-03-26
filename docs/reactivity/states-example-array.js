import { compose, createState } from '/assets/paintor.js'

const state = createState([ 0, 0, 0 ])

setInterval(() => {
  state[0]++
  state[1] = state[0] * 2
  state[2] = state[0] * 3
}, 2000)

compose(($) => {
  $.p(() => `1 * Number = ${state[0]}` )
  $.p(() => `2 * Number = ${state[1]}` )
  $.p(() => `3 * Number = ${state[2]}` )
}).paint('states-example-array')
