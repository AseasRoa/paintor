import { component, state } from 'paintor'

component(($) => {
  // Create the states
  const stateA = state([0])
  const stateB = state([{ number: 0 }])

  // And try to change them
  setInterval(() => {
    stateA[0] = 1
    stateB[0].number = 1
  }, 1000)

  // Variant A: The passed value is a primitive number
  $.forState(stateA, (number) => {
    // Not reactive, the value will remain 0
    $.div(() => number)
  })

  // Variant B: The passed value is a State
  $.forState(stateB, (item) => {
    // Reactive, the value will change to 1
    $.div(() => item.number)
  })
}).paint('add-remove-elements-2')
