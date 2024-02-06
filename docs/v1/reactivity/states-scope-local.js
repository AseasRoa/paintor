import { component, template, state } from 'paintor'

const plusMinus = template(($) => {
  const localState = state({ value: 0 })

  $.div(
    $.button({ onClick: () => localState.value -= 1 }, '-'),
    $.span(() => localState.value),
    $.button({ onClick: () => localState.value += 1 }, '+')
  )
})

component(($) => {
  $.div('Template 1', plusMinus)
  $.div('Template 2', plusMinus)
}).paint('#states-scope-local')
