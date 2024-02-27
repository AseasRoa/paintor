import { component, state } from 'paintor'

component((x) => {
  const myState = state({ text: '' })

  const setText = (event) => {
    myState.text = event.target.value
  }

  x.div(
    x.input({
      type: 'text',
      placeholder: 'Type something here',
      onKeyUp: setText
    }),
    x.span(() => myState.text), // The callback here is needed for reactivity
  )
}).paint('#states-2')
