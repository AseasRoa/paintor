import { compose, createState, createTemplate } from '/assets/paintor.js'

const plusMinusTemplate = createTemplate(($) => {
  const state = createState({ value: 0 })

  return [
    $.div(
      $.button({ onClick: () => state.value-- }, '-'),
      $.span(() => state.value),
      $.button({ onClick: () => state.value++ }, '+')
    )
  ]
})

compose(($) => {
  $.div('Component 1', plusMinusTemplate($))
  $.div('Component 2', plusMinusTemplate($))
  $.div('Component 3', plusMinusTemplate($))
}).paint('template-as-a-component-2')
