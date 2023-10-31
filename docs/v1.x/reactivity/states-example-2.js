import { component, state } from '/assets/paintor.js'

component(($) => {
  const localState = state({ text: '' })

  const setText = (event) => {
    localState.text = event.target.value
  }

  $.div(
    $.input({
      type: 'text',
      placeholder: 'Type something here',
      onKeyDown: setText
    }),
    $.span(() => localState.text), // The callback here is needed for reactivity
  )
}).paint('states-example-2')
