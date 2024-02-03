import { component, state } from 'paintor'

component(($) => {
  const localState = state({
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5'
  })

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
}).paint('#using-foreach-3')
