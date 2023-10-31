import { component, state } from '/assets/paintor.js'

const globalState = state({ tick: 0 })

setInterval(() => { globalState.tick++ }, 1000)

const tick = () => globalState.tick

component(($) => {
  $.button({ textContent : tick })
}).paint('states-example-3-button')

component(($) => {
  $.p(tick)
}).paint('states-example-3-paragraph')

component(($) => {
  $.textarea({ value : tick })
}).paint('states-example-3-textarea')
