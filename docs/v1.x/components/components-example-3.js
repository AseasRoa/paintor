import { compose, createState, createTemplate } from '/assets/paintor.js'

const plusMinusComponent = (initialValue) => compose(($) => {
  const state = createState({ value: initialValue })

  $.div(
    $.button({ onClick: () => state.value-- }, '-'),
    $.span(() => state.value),
    $.button({ onClick: () => state.value++ }, '+')
  )
})

compose(($) => {
  $.div('Component 1', plusMinusComponent(1))
  $.div('Component 2', plusMinusComponent(2))
  $.div('Component 3', plusMinusComponent(3))
}).paint('components-example-3')
