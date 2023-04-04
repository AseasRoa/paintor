import { component, state } from '/assets/paintor.js'

const plusMinusComponent = (initialValue) => component(($) => {
  const localState = state({ value: initialValue })

  $.div(
    $.button({ onClick: () => localState.value-- }, '-'),
    $.span(() => localState.value),
    $.button({ onClick: () => localState.value++ }, '+')
  )
})

component(($) => {
  $.div('Component 1', plusMinusComponent(1))
  $.div('Component 2', plusMinusComponent(2))
  $.div('Component 3', plusMinusComponent(3))
}).paint('components-example-3')
