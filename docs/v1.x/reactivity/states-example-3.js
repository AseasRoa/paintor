import { component, state } from '/assets/paintor.js'

const object = { tick: 0 }
const globalState = state(object)

setInterval(() => { globalState.tick++ }, 1000)

component(($) => {
  $.button({ textContent : () => globalState.tick })
}).paint('states-example-3-button')

component(($) => {
  $.p(() => globalState.tick)
}).paint('states-example-3-paragraph')

component(($) => {
  $.textarea({ value : () => globalState.tick })
}).paint('states-example-3-textarea')
