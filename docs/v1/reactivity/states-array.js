import { component, state } from 'paintor'

const globalState = state([ 0, 0 ])

setInterval(() => {
  globalState[0] += 1
  globalState[1] -= 1
}, 2000)

component((x) => {
  x.p(() => globalState[0] )
  x.p(() => globalState[1] )
}).paint('#states-array')
