import { component, state } from 'paintor'

component(($) => {
  const localState = state([ '0', '1', '2', '3', '4' ])

  $.forEach(localState, (value, key) => {
    $.button({
      textContent: value,
      onClick: () => {
        delete localState[key]

        setTimeout(() => {
          localState[key] = key.toString()
        }, 1000)
      }
    })
  })
}).paint('using-foreach-4')
