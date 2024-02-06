import { component, template, state } from 'paintor'

const globalState = state({ value: 0 })

const plusMinus = template(($) => {
  $.div(
    $.button({ onClick: () => globalState.value -= 1 }, '-'),
    $.span(() => globalState.value),
    $.button({ onClick: () => globalState.value += 1 }, '+')
  )
})

component(($) => {
  $.div('Template 1', plusMinus)
  $.div('Template 2', plusMinus)
}).paint('#states-scope-global')
