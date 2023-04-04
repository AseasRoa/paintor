import { component, state, template } from '/assets/paintor.js'

const plusMinusTemplate = template(($) => {
  const localState = state({ value: 0 })

  $.div(
    $.button({ onClick: () => localState.value-- }, '-'),
    $.span(() => localState.value),
    $.button({ onClick: () => localState.value++ }, '+')
  )
})

component(
  plusMinusTemplate,
  plusMinusTemplate,
  plusMinusTemplate
).paint('components-example-1')
