import { component, state } from 'paintor'

component(($) => {
  const myState = state({ text: '' })

  const setText = (event) => {
    myState.text = event.target.value
  }

  $.div(
    $.input({
      type: 'text',
      placeholder: 'Type something here',
      onKeyUp: setText
    }),
    $.span(() => myState.text), // The callback here is needed for reactivity
  )
}).paint('#states-2')
