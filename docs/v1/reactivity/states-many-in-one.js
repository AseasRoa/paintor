import { component, state, template } from 'paintor'

const stateOne = state({ number: 0 })
const stateTwo = state({ number: 0 })

setInterval(() => {
  stateOne.number += 1
  stateTwo.number -= 1
}, 1000)

const myTemplate = template(($) => {
  $.p(() => stateOne.number )
  $.p(() => stateTwo.number )
})

component(myTemplate).paint('#states-many-in-one')
