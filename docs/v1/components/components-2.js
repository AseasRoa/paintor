import { component, state } from 'paintor'

const plusMinusComponent = component(($) => {
  const localState = state({ value: 0 })

  $.div(
    $.button({ onClick: () => localState.value -= 1 }, '-'),
    $.button({ onClick: () => localState.value += 1 }, '+'),
    $.span(() => localState.value)
  )
})

component(($) => {
  $.div('Component 1', plusMinusComponent)
  $.div('Component 2', plusMinusComponent)
  $.div('Component 3', plusMinusComponent)
}).paint('#components-2')
