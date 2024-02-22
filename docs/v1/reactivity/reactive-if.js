import { component, state } from 'paintor'

component(($) => {
  const myState = state({ pass: true })
  let counter = 0

  const ifHandler = () => {
    $.div({ style: { color: 'green' }}, counter++)
  }
  const elseHandler = () => {
    $.div({ style: { color: 'red' }}, counter++)
  }

  $.div(
    $.if(
      () => myState.pass, // Condition
      ifHandler, // Runs on true
      elseHandler // Runs on false
    )
  )

  setInterval(() => {
    // Reverse
    myState.pass = !myState.pass
  }, 1000)
}).paint('#reactive-if')
