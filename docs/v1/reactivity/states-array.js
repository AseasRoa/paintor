import { component, state } from 'paintor'

const globalState = state([ 0, 0, 0 ])

setInterval(() => {
  globalState[0] += 1
  globalState[1] = globalState[0] * 2
  globalState[2] = globalState[0] * 3
}, 2000)

component(($) => {
  $.p(() => `1 * Number = ${globalState[0]}` )
  $.p(() => `2 * Number = ${globalState[1]}` )
  $.p(() => `3 * Number = ${globalState[2]}` )
}).paint('#states-array')
