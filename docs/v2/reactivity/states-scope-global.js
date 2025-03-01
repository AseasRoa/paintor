import { compose, state, template } from 'paintor'

const globalState = state({ value: 0 })

const PlusMinus = function() {
  return template((x) => {
    x.div(
      x.button({onClick: () => globalState.value -= 1}, '-'),
      x.span(() => globalState.value),
      x.button({onClick: () => globalState.value += 1}, '+')
    )
  })
}

const App = function() {
  return template((x) => {
    x.div('Template 1', PlusMinus())
    x.div('Template 2', PlusMinus())
  })
}

compose(App()).paint('#states-scope-global')
