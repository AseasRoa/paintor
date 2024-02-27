import { component, state } from 'paintor'

component((x) => {
  const localState = state({
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5'
  })

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
}).paint('#using-foreach-automatic-order-object')
