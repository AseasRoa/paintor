import { compose, createState } from '/assets/paintor.js'

const object = { one: 'One', two: 'Two' }
const state = createState(object)

setInterval(() => {

}, 5000)

compose(($) => {
  $.forEach(state, (value, key) => {
    $.p(() => `key: ${key} value: ${value}` )
  })
}).paint('add-example-1')
