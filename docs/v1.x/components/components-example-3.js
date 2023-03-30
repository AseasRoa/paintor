import { compose, createState, createTemplate } from '/assets/paintor.js'

const component = compose(($) => {
  const state = createState({ value: 0 })

  $.div(
    $.button({ onClick: () => state.value-- }, '-'),
    $.span(() => state.value),
    $.button({ onClick: () => state.value++ }, '+')
  )
})

compose(($) => {
  $.div('Component 1', component)
  $.div('Component 2', component)
  $.div('Component 3', component)
}).paint('components-example-3')
