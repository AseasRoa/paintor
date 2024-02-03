import { component, state } from 'paintor'

component(($) => {
  const localState = state([])

  let number = 1

  setInterval(() => {
    // Reset on too many elements
    if (localState.length > 9) {
      localState.length = 0
      number = 1
    }

    // Create a new element
    localState.push(number)
    number += 1
  }, 1000)

  $.forEach(localState, (number, key) => {
    $.span('<' + number + '>')
  })
}).paint('using-foreach-1')
