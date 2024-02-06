import { component, state, template } from 'paintor'

// TEMPLATE
const plusMinusTemplate = template(($) => {
  const localState = state({ value: 0 })

  $.div(
    $.button({ onClick: () => localState.value -= 1 }, '-'),
    $.span(() => localState.value),
    $.button({ onClick: () => localState.value += 1 }, '+')
  )
})

// COMPONENT
const plusMinusComponent = component(($) => {
  const localState = state({ value: 0 })

  $.div(
    $.button({ onClick: () => localState.value -= 1 }, '-'),
    $.span(() => localState.value),
    $.button({ onClick: () => localState.value += 1 }, '+')
  )
})

// Paint
component(
  plusMinusTemplate,
  plusMinusComponent
).paint('#components-vs-templates-1')
