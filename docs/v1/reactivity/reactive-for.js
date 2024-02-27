import { component, state } from 'paintor'

component((x) => {
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
    x.for(
      () => myState.from,
      () => myState.to,
      (index) => {
        x.span(index)
      }
    )
  )
}).paint('#reactive-for')
