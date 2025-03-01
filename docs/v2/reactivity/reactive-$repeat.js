import { compose, state, template } from 'paintor'

const MyComponent = function() {
  return template((x) => {
    const myState = state({ from: 1, to: NaN })

    // "from" label and button
    x.label('from')
    x.input({
      type: 'number',
      value: myState.from,
      onChange: (event) => (myState.from = event.target.value)
    })

    // "to" label and button
    x.label('to')
    x.input({
      type: 'number',
      value: myState.to,
      onChange: (event) => (myState.to = event.target.value)
    })

    // Result
    x.div({ id: 'elements-container' },
      x.$repeat(
        () => myState.from,
        () => myState.to,
        (index) => {
          x.div(index)
        }
      )
    )
  })
}

compose(MyComponent()).paint('#reactive-repeat')
