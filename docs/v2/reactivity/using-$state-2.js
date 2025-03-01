import { compose, setState, state, template } from 'paintor'

const MyComponent = function() {
  return template((x) => {
    const myStates = state({ subState: { type: 'text', value: 'Text' } })
    const buttons = [
      { type: 'text', value: 'Text' },
      { type: 'password', value: '123456' },
      { type: 'range', value: '25' },
      { type: 'color', value: '#0000FF' }
    ]

    for (const button of buttons) {
      x.button({
        textContent: button.type,
        onClick: () => {
          setState(myStates.subState, button)
        }
      })
    }

    x.hr()

    x.$state(myStates.subState, (subState) => {
      x.input({
        type: subState.type,
        value: subState.value,
      })
    })
  })
}

compose(MyComponent()).paint('#using-state-2')
