import { component, state } from 'paintor'

const plusMinusComponent = component(($) => {
  const localState = state({ value: 0 })

  $.div(
    $.button({ onClick: () => localState.value-- }, '-'),
    $.span(() => localState.value),
    $.button({ onClick: () => localState.value++ }, '+')
  )
})

component(($) => {
  $.div('Component 1', plusMinusComponent)
  $.div('Component 2', plusMinusComponent)
  $.div('Component 3', plusMinusComponent)
}).paint('components-2')
