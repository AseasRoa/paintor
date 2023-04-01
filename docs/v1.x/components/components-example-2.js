import { compose, createState, createTemplate } from '/assets/paintor.js'

const plusMinusComponent = compose(($) => {
  const state = createState({ value: 0 })

  $.div(
    $.button({ onClick: () => state.value-- }, '-'),
    $.span(() => state.value),
    $.button({ onClick: () => state.value++ }, '+')
  )
})

compose(($) => {
  $.div('Component 1', plusMinusComponent)
  $.div('Component 2', plusMinusComponent)
  $.div('Component 3', plusMinusComponent)
}).paint('components-example-2')
