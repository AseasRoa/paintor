import { compose, createState } from '/assets/paintor.js'

const state = createState([])

let number = 1

setInterval(() => {
  // Cleanup the state on too many elements
  // and reset the number
  if (state.length > 9) {
    while (state.length > 0) {
      state.pop()
    }

    number = 1
  }

  state.push(`<${number++}>`)
}, 1000)

compose(($) => {
  $.forState(state, (value, key) => {
    $.span(value())
  })
}).paint('add-remove-elements-example-1')
