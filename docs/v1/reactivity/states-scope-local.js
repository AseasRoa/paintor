import { component, state, template } from 'paintor'

const plusMinus = template((x) => {
  const localState = state({ value: 0 })

  x.div(
    x.button({ onClick: () => localState.value -= 1 }, '-'),
    x.span(() => localState.value),
    x.button({ onClick: () => localState.value += 1 }, '+')
  )
})

component((x) => {
  x.div('Template 1', plusMinus)
  x.div('Template 2', plusMinus)
}).paint('#states-scope-local')
