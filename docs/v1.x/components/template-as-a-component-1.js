import { compose, createState, createTemplate } from '/assets/paintor.js'

const plusMinusTemplate = createTemplate(($) => {
  const state = createState({ value: 0 })

  $.div(
    $.button({ onClick: () => state.value-- }, '-'),
    $.span(() => state.value),
    $.button({ onClick: () => state.value++ }, '+')
  )
})

compose(
  plusMinusTemplate,
  plusMinusTemplate,
  plusMinusTemplate
).paint('components-example-1')
