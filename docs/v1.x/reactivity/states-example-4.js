import { compose, createState } from '/assets/paintor.js'

const stateOne = createState({ number: 0 })
const stateTwo = createState({ number: 0 })
const stateThree = createState({ number: 0 })

setInterval(() => {
  stateOne.number++
  stateTwo.number = stateOne.number * 2
  stateThree.number = stateOne.number * 3
}, 2000)

compose(($) => {
  $.p(() => `1 * Number = ${stateOne.number}` )
  $.p(() => `2 * Number = ${stateTwo.number}` )
  $.p(() => `3 * Number = ${stateThree.number}` )
}).paint('states-example-4')
