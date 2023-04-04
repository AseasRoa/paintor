import { component, state } from '/assets/paintor.js'

const stateOne = state({ number: 0 })
const stateTwo = state({ number: 0 })
const stateThree = state({ number: 0 })

setInterval(() => {
  stateOne.number++
  stateTwo.number = stateOne.number * 2
  stateThree.number = stateOne.number * 3
}, 2000)

component(($) => {
  $.p(() => `1 * Number = ${stateOne.number}` )
  $.p(() => `2 * Number = ${stateTwo.number}` )
  $.p(() => `3 * Number = ${stateThree.number}` )
}).paint('states-example-4')
