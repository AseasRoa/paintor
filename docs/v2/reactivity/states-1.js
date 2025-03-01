import { compose, state, template } from 'paintor'

const App = function() {
  return template((x) => {
    const myState = state({ value: 0 })

    const increment = () => myState.value += 1
    const decrement = () => myState.value -= 1

    x.div(
      x.button({ onClick: decrement }, '-'),
      x.span(() => myState.value), // The callback here is needed for reactivity
      x.button({ onClick: increment }, '+')
    )
  })
}

compose(App()).paint('#states-1')
