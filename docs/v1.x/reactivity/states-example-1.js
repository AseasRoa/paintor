import { component, state } from '/assets/paintor.js'

component(($) => {
  const object = { value: 0 }
  const localState = state(object)

  $.div(
    $.button({ onClick: () => localState.value-- }, '-'),
    $.span(() => localState.value), // The callback here is needed for reactivity
    $.button({ onClick: () => localState.value++ }, '+')
  )
}).paint('states-example-1')
