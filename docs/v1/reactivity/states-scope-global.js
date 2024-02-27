import { component, state, template } from 'paintor'

const globalState = state({ value: 0 })

const plusMinus = template((x) => {
  x.div(
    x.button({ onClick: () => globalState.value -= 1 }, '-'),
    x.span(() => globalState.value),
    x.button({ onClick: () => globalState.value += 1 }, '+')
  )
})

component((x) => {
  x.div('Template 1', plusMinus)
  x.div('Template 2', plusMinus)
}).paint('#states-scope-global')
