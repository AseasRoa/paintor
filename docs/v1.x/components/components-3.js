import { component, state } from 'paintor'

const plusMinusComponent = (initialValue) => component(($) => {
  const localState = state({ value: initialValue })

  $.div(
    $.button({ onClick: () => localState.value -= 1 }, '-'),
    $.span(() => localState.value),
    $.button({ onClick: () => localState.value += 1 }, '+')
  )
})

component(($) => {
  $.div('Component 1', plusMinusComponent(1))
  $.div('Component 2', plusMinusComponent(2))
  $.div('Component 3', plusMinusComponent(3))
}).paint('components-3')
