import { component, state } from 'paintor'

component((x) => {
  const myStates = state({ subState: {} })
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
        myStates.subState = button
      }
    })
  }

  x.hr()

  x.forState(myStates.subState, (subState) => {
    x.input({
      type: subState.type,
      value: subState.value,
    })
  })
}).paint('#using-forstate-1')