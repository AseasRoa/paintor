import { component, state } from '/assets/paintor.js'

component(($) => {
  const localState = state([ '0', '1', '2', '3', '4' ])

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
}).paint('add-remove-elements-example-4')
