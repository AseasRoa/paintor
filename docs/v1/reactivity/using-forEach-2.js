import { component, state } from 'paintor'

component(($) => {
  // Create the states
  const stateA = state([0])
  const stateB = state([{ number: 0 }])

  // And change them
  setInterval(() => {
    stateA[0] += 1
    stateB[0].number += 1
  }, 1000)

  // Variant A: The passed value is a primitive number
  $.forEach(stateA, (number) => {
    // Reactive, the value will change
    $.div(() => number)
  })

  // Variant B: The passed value is a State
  $.forEach(stateB, (item) => {
    // Reactive, the value will change
    $.div(() => item.number)
  })
}).paint('#using-foreach-2')
