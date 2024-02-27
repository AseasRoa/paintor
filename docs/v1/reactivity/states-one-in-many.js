import { component, state, template } from 'paintor'

const globalState = state({ tick: 0 })

setInterval(() => {
  globalState.tick += 1
}, 1000)

const tick = () => globalState.tick

const button = template((x) => {
  x.button({ textContent: tick })
})

const paragraph = template((x) => {
  x.p(tick)
})

const textarea = template((x) => {
  x.textarea({ value: tick })
})

component(
  button,
  paragraph,
  textarea
).paint('#states-one-in-many')
