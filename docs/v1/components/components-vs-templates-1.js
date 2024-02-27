import { component, state, template } from 'paintor'

// TEMPLATE
const plusMinusTemplate = template((x) => {
  const localState = state({ value: 0 })

  x.div(
    x.button({ onClick: () => localState.value -= 1 }, '-'),
    x.span(() => localState.value),
    x.button({ onClick: () => localState.value += 1 }, '+')
  )
})

// COMPONENT
const plusMinusComponent = component((x) => {
  const localState = state({ value: 0 })

  x.div(
    x.button({ onClick: () => localState.value -= 1 }, '-'),
    x.span(() => localState.value),
    x.button({ onClick: () => localState.value += 1 }, '+')
  )
})

// Paint
component(
  plusMinusTemplate,
  plusMinusComponent
).paint('#components-vs-templates-1')
