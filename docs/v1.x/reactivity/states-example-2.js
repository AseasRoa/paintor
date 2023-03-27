import { compose, createState } from '/assets/paintor.js'

const object = { text: '' }
const state = createState(object)

compose(($) => {
  $.div(
    $.input({
      type: 'text',
      placeholder: 'Type something here',
      onKeyDown: (event) => {
        state.text = event.target.value
      }
    }),
    $.span(() => state.text), // The callback here is needed for reactivity
  )
}).paint('states-example-2')
