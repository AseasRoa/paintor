import { component, state } from 'paintor'

component(($) => {
  const myState = state({ from: 1, to: NaN })

  // "from" label and button
  $.label('from')
  $.input({
    type: 'number',
    value: myState.from,
    onChange: (event) => (myState.from = event.target.value)
  })

  // "to" label and button
  $.label('to')
  $.input({
    type: 'number',
    value: myState.to,
    onChange: (event) => (myState.to = event.target.value)
  })

  // Result
  $.div({ id: 'elements-container' },
    $.for(
      () => myState.from,
      () => myState.to,
      (index) => {
        $.span(index)
      }
    )
  )
}).paint('#reactive-for')
