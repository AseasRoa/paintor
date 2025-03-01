import { compose, state, template } from 'paintor'

const globalState = state({ tick: 0 })

setInterval(() => {
  globalState.tick += 1
}, 1000)

const tick = () => globalState.tick

const Button = function() {
  return template((x) => {
    x.button({ textContent: tick })
  })
}

const Paragraph = function() {
  return template((x) => {
    x.p(tick)
  })
}

const Textarea = function() {
  return template((x) => {
    x.textarea({ value: tick })
  })
}

compose(
  Button(),
  Paragraph(),
  Textarea(),
).paint('#states-one-in-many')
