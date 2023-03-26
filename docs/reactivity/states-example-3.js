import { compose, createState } from '/assets/paintor.js'

const object = { tick: 0 }
const state = createState(object)

setInterval(() => { state.tick++ }, 1000)

compose(($) => {
  $.button({ textContent : () => state.tick })
}).paint('states-example-3-button')

compose(($) => {
  $.p(() => state.tick)
}).paint('states-example-3-paragraph')

compose(($) => {
  $.textarea({ value : () => state.tick })
}).paint('states-example-3-textarea')
