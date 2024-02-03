import { component, state } from 'paintor'

const globalState = state({ tick: 0 })

setInterval(() => {
  globalState.tick += 1
}, 1000)

const tick = () => globalState.tick

component(($) => {
  $.button({ textContent: tick })
}).paint('#states-3-button')

component(($) => {
  $.p(tick)
}).paint('#states-3-paragraph')

component(($) => {
  $.textarea({ value: tick })
}).paint('#states-3-textarea')
