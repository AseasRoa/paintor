import { compose, createState } from '/assets/paintor.js'

const object = { value: 0 }
const state = createState(object)

compose(($) => {
  $.div(
    $.button({ onClick: () => state.value-- }, '-'),
    $.span(() => state.value), // The callback here is needed for reactivity
    $.button({ onClick: () => state.value++ }, '+')
  )
}).paint('states-example-1')
