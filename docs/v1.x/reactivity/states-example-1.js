import { component, state } from '/assets/paintor.js'

component(($) => {
  const localState = state({ value: 0 })

  const increment = () => localState.value++
  const decrement = () => localState.value--

  $.div(
    $.button({ onClick: decrement }, '-'),
    $.span(() => localState.value), // The callback here is needed for reactivity
    $.button({ onClick: increment }, '+')
  )
}).paint('states-example-1')
