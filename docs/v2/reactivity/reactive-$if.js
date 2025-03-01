import { compose, state, template } from 'paintor'

const MyComponent = function() {
  return template((x) => {
    const myState = state({ pass: true })
    let counter = 0

    const ifHandler = () => {
      x.div({ style: { color: 'green' }}, counter++)
    }
    const elseHandler = () => {
      x.div({ style: { color: 'red' }}, counter++)
    }

    x.div(
      x.$if(
        () => myState.pass, // Condition
        ifHandler, // Runs on true
        elseHandler // Runs on false
      )
    )

    setInterval(() => {
      // Reverse
      myState.pass = !myState.pass
    }, 1000)
  })
}

compose(MyComponent()).paint('#reactive-if')
