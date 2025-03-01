import { compose, state, template } from 'paintor'

const App = function() {
  return template((x) => {
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
  })
}

compose(App()).paint('#states-2')
