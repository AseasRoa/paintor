import { compose, createState, createTemplate } from '/assets/paintor.js'

const component = createTemplate(($) => {
  const state = createState({ value: 0 })

  $.div(
    $.button({ onClick: () => state.value-- }, '-'),
    $.span(() => state.value),
    $.button({ onClick: () => state.value++ }, '+')
  )
})

compose(
  component,
  component,
  component
).paint('components-example-1')
