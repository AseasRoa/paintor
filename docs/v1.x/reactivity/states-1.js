import { component, state } from 'paintor'

component(($) => {
  const localState = state({ value: 0 })

  const increment = () => localState.value += 1
  const decrement = () => localState.value -= 1

  $.div(
    $.button({ onClick: decrement }, '-'),
    $.span(() => localState.value), // The callback here is needed for reactivity
    $.button({ onClick: increment }, '+')
  )
}).paint('states-1')
