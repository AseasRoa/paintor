import { component, state, template } from 'paintor'

const globalState = state({ tick: 0 })

setInterval(() => {
  globalState.tick += 1
}, 1000)

const tick = () => globalState.tick

const button = template(($) => {
  $.button({ textContent: tick })
})

const paragraph = template(($) => {
  $.p(tick)
})

const textarea = template(($) => {
  $.textarea({ value: tick })
})

component(
  button,
  paragraph,
  textarea
).paint('#states-one-in-many')
