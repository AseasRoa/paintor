import { component, state } from 'paintor'

component(($) => {
  const myStates = state({ subState: {} })
  const buttons = [
    { type: 'text', value: 'Text' },
    { type: 'password', value: '123456' },
    { type: 'range', value: '25' },
    { type: 'color', value: '#0000FF' }
  ]

  for (const button of buttons) {
    $.button({
      textContent: button.type,
      onClick: () => {
        myStates.subState = button
      }
    })
  }

  $.hr()

  $.forState(myStates.subState, (subState) => {
    $.input({
      type: subState.type,
      value: subState.value,
    })
  })
}).paint('using-forstate-1')
