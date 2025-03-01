import { compose, state, template } from 'paintor'

const globalState = state([ 0, 0 ])

setInterval(() => {
  globalState[0] += 1
  globalState[1] -= 1
}, 2000)

const MyComponent = function() {
  return template((x) => {
    x.p(() => globalState[0] )
    x.p(() => globalState[1] )
  })
}

compose(MyComponent()).paint('#states-array')
