import { component, state } from 'paintor'

component(($) => {
  const myState = state({ value: 0 })

  const increment = () => myState.value += 1
  const decrement = () => myState.value -= 1

  $.div(
    $.button({ onClick: decrement }, '-'),
    $.span(() => myState.value), // The callback here is needed for reactivity
    $.button({ onClick: increment }, '+')
  )
}).paint('#states-1')
