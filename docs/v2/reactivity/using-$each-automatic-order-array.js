import { compose, state, template } from 'paintor'

const MyComponent = function() {
  return template((x) => {
    const localState = state([ '0', '1', '2', '3', '4' ])

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

compose(MyComponent()).paint('#using-each-automatic-order-array')
