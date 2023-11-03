import { component, state } from 'paintor'

component(($) => {
  const localState = state([])

  let number = 1

  setInterval(() => {
    // Cleanup the state on too many elements
    // and reset the number
    if (localState.length > 9) {
      while (localState.length > 0) {
        localState.pop()
      }

      number = 1
    }

    localState.push(number++)
  }, 1000)

  $.forState(localState, (number, key) => {
    $.span('<' + number + '>')
  })
}).paint('add-remove-elements-1')
