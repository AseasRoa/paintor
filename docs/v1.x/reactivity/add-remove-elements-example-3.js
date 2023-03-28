import { compose, createState } from '/assets/paintor.js'

const state = createState({ 1: '1', 2: '2', 3: '3', 4: '4', 5: '5' })

compose(($) => {
  $.forState(state, (value, key) => {
    $.button({
      textContent: value,
      onClick: (event) => {
        delete state[key]

        setTimeout(() => {
          state[key] = key.toString()
        }, 1000)
      }
    })
  })
}).paint('add-remove-elements-example-3')
