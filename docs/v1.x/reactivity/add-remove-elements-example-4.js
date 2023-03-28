import { compose, createState } from '/assets/paintor.js'

const state = createState([ '0', '1', '2', '3', '4' ])

compose(($) => {
  $.forState(state, (value, key) => {
    $.button({
      textContent: value,
      onClick: (event) => {
        delete state[key]

        setTimeout(() => {
          state[key] = key.toString()
        }, 1000)
      }
    })
  })
}).paint('add-remove-elements-example-4')
