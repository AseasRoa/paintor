import { compose, state, template } from 'paintor'

const stateOne = state({ number: 0 })
const stateTwo = state({ number: 0 })

setInterval(() => {
  stateOne.number += 1
  stateTwo.number -= 1
}, 1000)

const MyComponent = function() {
  return template((x) => {
    x.p(() => stateOne.number )
    x.p(() => stateTwo.number )
  })
}

compose(MyComponent()).paint('#states-many-in-one')
