import { component, state } from 'paintor'

component((x) => {
  const localState = state({ time: new Date().toLocaleTimeString() })

  setInterval(() => {
    localState.time = new Date().toLocaleTimeString()
  }, 1000)

  x.html`
  <div>
    <label>Current Time: </label>
    ${() => localState.time}
  </div>
  `
}).paint('#html-syntax-1')
