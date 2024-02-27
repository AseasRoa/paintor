import { component, state } from 'paintor'

component((x) => {
  const localState = state([ '0', '1', '2', '3', '4' ])

  x.forEach(localState, (value, key) => {
    x.button({
      textContent: value,
      onClick: () => {
        delete localState[key]

        setTimeout(() => {
          localState[key] = key.toString()
        }, 1000)
      }
    })
  })
}).paint('#using-foreach-automatic-order-array')
