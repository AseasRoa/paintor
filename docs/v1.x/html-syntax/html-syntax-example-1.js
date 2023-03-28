import { compose, createState } from '/assets/paintor.js'

compose(($) => {
  const state = createState({ time: Date().toLocaleString() })

  setInterval(() => {
    state.time = Date().toLocaleString()
  }, 1000)

  $.html`
  <div>
    <label>Current Time: </label>
    ${ () => state.time }
  </div>
  `
}).paint('html-syntax-example-1')
