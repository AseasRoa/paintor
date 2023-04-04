import { component, state } from '/assets/paintor.js'

component(($) => {
  const object = { text: '' }
  const localState = state(object)

  $.div(
    $.input({
      type: 'text',
      placeholder: 'Type something here',
      onKeyDown: (event) => {
        localState.text = event.target.value
      }
    }),
    $.span(() => localState.text), // The callback here is needed for reactivity
  )
}).paint('states-example-2')
