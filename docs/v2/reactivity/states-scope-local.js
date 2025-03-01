import { compose, state, template } from 'paintor'

const PlusMinus = function() {
  return template((x) => {
    const localState = state({value: 0})

    x.div(
      x.button({onClick: () => localState.value -= 1}, '-'),
      x.span(() => localState.value),
      x.button({onClick: () => localState.value += 1}, '+')
    )
  })
}

const App = function() {
  return template((x) => {
    x.div('Template 1', PlusMinus())
    x.div('Template 2', PlusMinus())
  })
}

compose(App()).paint('#states-scope-local')
