import { compose, state, template } from 'paintor'

const CurrentTime = function() {
  return template((x) => {
    const localState = state({ time: new Date().toLocaleTimeString() })

    setInterval(() => {
      localState.time = new Date().toLocaleTimeString()
    }, 1000)

    x.$html`
  <div>
    <label>Current Time: </label>
    ${() => localState.time}
  </div>
  `
  })
}

compose(CurrentTime()).paint('#html-syntax-1')
