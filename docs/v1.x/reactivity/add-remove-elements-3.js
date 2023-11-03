import { component, state } from 'paintor'

component(($) => {
  const localState = state({ 1: '1', 2: '2', 3: '3', 4: '4', 5: '5' })

  $.forState(localState, (value, key) => {
    $.button({
      textContent: value,
      onClick: (event) => {
        delete localState[key]

        setTimeout(() => {
          localState[key] = key.toString()
        }, 1000)
      }
    })
  })
}).paint('add-remove-elements-3')
