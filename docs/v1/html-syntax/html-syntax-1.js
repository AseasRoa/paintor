import { component, state } from 'paintor'

component(($) => {
  const localState = state({ time: new Date().toLocaleTimeString() })

  setInterval(() => {
    localState.time = new Date().toLocaleTimeString()
  }, 1000)

  $.html`
  <div>
    <label>Current Time: </label>
    ${() => localState.time}
  </div>
  `
}).paint('#html-syntax-1')
