import { component, state } from 'paintor'

component(($) => {
  const localState = state({ text: '' })

  const setText = (event) => {
    localState.text = event.target.value
  }

  $.div(
    $.input({
      type: 'text',
      placeholder: 'Type something here',
      onKeyUp: setText
    }),
    $.span(() => localState.text), // The callback here is needed for reactivity
  )
}).paint('states-2')
