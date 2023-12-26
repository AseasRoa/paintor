import { component, state, template } from 'paintor'

const plusMinusTemplate = template(($) => {
  const localState = state({ value: 0 })

  return [
    $.div(
      $.button({ onClick: () => localState.value -= 1 }, '-'),
      $.span(() => localState.value),
      $.button({ onClick: () => localState.value += 1 }, '+')
    )
  ]
})

component(($) => {
  $.div('Component 1', plusMinusTemplate($))
  $.div('Component 2', plusMinusTemplate($))
  $.div('Component 3', plusMinusTemplate($))
}).paint('template-as-a-component-2')
