import { compose, state, template } from 'paintor'

const MyComponent = function() {
  return template((x) => {
    const localState = state({
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5'
    })

    x.$each(localState, (value, key) => {
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
  })
}

compose(MyComponent()).paint('#using-each-automatic-order-object')
